import { describe, expect, it } from 'vitest';
import { compareMethods, type ComparisonInput } from './comparison';
import { buildObservations } from './observations';
import { ranges } from './testHelpers';

const BASE: ComparisonInput = {
  age: null,
  measuredHrmax: null,
  hrmaxSource: null,
  rhr: null,
  avg20: null,
};

const full = (over: Partial<ComparisonInput> = {}): ComparisonInput => ({
  ...BASE,
  hrmaxSource: 'measured',
  measuredHrmax: 190,
  rhr: 50,
  avg20: 170,
  ...over,
});

describe('compareMethods: all inputs present', () => {
  const r = compareMethods(full());
  it('all three methods are complete and give the hand-verified zones', () => {
    expect(r.blocking).toBe(false);
    expect(r.outcomes.mhr.state).toBe('complete');
    expect(r.outcomes.hrr.state).toBe('complete');
    expect(r.outcomes.threshold.state).toBe('complete');
    expect(ranges(r.outcomes.mhr.calc!)).toEqual([[null, 138], [139, 157], [158, 166], [167, 174], [175, 190]]);
    expect(ranges(r.outcomes.hrr.calc!)).toEqual([[120, 133], [134, 147], [148, 161], [162, 175], [176, 190]]);
    expect(ranges(r.outcomes.threshold.calc!)).toEqual([[null, 125], [126, 140], [141, 151], [152, 161], [162, null]]);
  });

  it('assumptions are listed for every method', () => {
    expect(r.outcomes.mhr.assumptions[0]).toBe('HRmax: 190 bpm (measured value entered by you)');
    expect(r.outcomes.hrr.assumptions.some((a) => a === 'Resting heart rate: 50 bpm')).toBe(true);
    expect(r.outcomes.hrr.assumptions.some((a) => a.includes('Up to 119 bpm is below Zone 1'))).toBe(true);
    expect(r.outcomes.threshold.assumptions.some((a) => a.includes('Estimated FTHR: 161.5 bpm'))).toBe(true);
  });
});

describe('compareMethods: incomplete inputs are shown as incomplete, never guessed', () => {
  it('nothing entered', () => {
    const r = compareMethods(BASE);
    expect(r.outcomes.mhr.state).toBe('incomplete');
    expect(r.outcomes.mhr.missing).toEqual(['HRmax source']);
    expect(r.outcomes.hrr.missing).toEqual(['HRmax source', 'Resting heart rate']);
    expect(r.outcomes.threshold.missing).toEqual(['20-minute average heart rate']);
    expect(r.outcomes.mhr.calc).toBeNull();
    expect(r.blocking).toBe(false);
  });

  it('only the 20-minute average: threshold works, the others stay incomplete', () => {
    const r = compareMethods({ ...BASE, avg20: 170 });
    expect(r.outcomes.threshold.state).toBe('complete');
    expect(r.outcomes.mhr.calc).toBeNull();
    expect(r.outcomes.hrr.calc).toBeNull();
  });

  it('estimate chosen without age; measured chosen without a value', () => {
    expect(compareMethods({ ...BASE, hrmaxSource: 'tanaka' }).outcomes.mhr.missing).toEqual(['Age']);
    expect(compareMethods({ ...BASE, hrmaxSource: 'measured' }).outcomes.mhr.missing).toEqual([
      'Measured maximum heart rate',
    ]);
  });

  it('%HRR without resting heart rate is incomplete while %MHR is complete', () => {
    const r = compareMethods(full({ rhr: null }));
    expect(r.outcomes.mhr.state).toBe('complete');
    expect(r.outcomes.hrr.state).toBe('incomplete');
    expect(r.outcomes.hrr.missing).toEqual(['Resting heart rate']);
  });
});

describe('compareMethods: methods are evaluated independently', () => {
  it('threshold zones do not change with other inputs', () => {
    const a = compareMethods(full()).outcomes.threshold.calc!;
    const b = compareMethods({ ...BASE, avg20: 170 }).outcomes.threshold.calc!;
    expect(ranges(a)).toEqual(ranges(b));
  });

  it('different HRmax sources per method, with the assumptions visible', () => {
    const r = compareMethods(
      full({ hrmaxSource: 'tanaka', age: 40, measuredHrmax: 190, hrmaxSourceOverrides: { hrr: 'measured' } }),
    );
    expect(r.outcomes.mhr.hrmax?.bpm).toBe(180);
    expect(r.outcomes.hrr.hrmax?.bpm).toBe(190);
    expect(r.outcomes.mhr.assumptions[0]).toContain('tanaka');
    expect(r.outcomes.hrr.assumptions[0]).toContain('measured');
  });

  it('an invalid method does not stop the others', () => {
    const r = compareMethods(full({ measuredHrmax: 190, rhr: 190 }));
    expect(r.outcomes.hrr.state).toBe('invalid');
    expect(r.outcomes.hrr.errors[0].code).toBe('rhr_not_below_hrmax');
    expect(r.outcomes.mhr.state).toBe('complete');
  });

  it('custom edges apply to that method only', () => {
    const r = compareMethods(full({ edges: { mhr: [null, 73, 85, 88, 92, 100] } }));
    expect(r.outcomes.mhr.calc?.isCustom).toBe(true);
    expect(r.outcomes.mhr.calc?.status).toBe('custom');
    expect(r.outcomes.hrr.calc?.isCustom).toBe(false);
  });
});

describe('compareMethods: consistency checks', () => {
  it('20-minute average above a measured HRmax blocks the comparison', () => {
    const r = compareMethods(full({ measuredHrmax: 170, avg20: 175 }));
    expect(r.blocking).toBe(true);
    expect(r.issues.map((i) => i.code)).toEqual(['avg20_above_measured_hrmax']);
  });

  it('...but is only a warning when HRmax is an estimate', () => {
    const r = compareMethods(full({ hrmaxSource: 'tanaka', age: 60, avg20: 170 }));
    expect(r.blocking).toBe(false);
    expect(r.issues.map((i) => [i.severity, i.code])).toEqual([['warning', 'avg20_above_estimated_hrmax']]);
  });

  it('resting heart rate not below the 20-minute average blocks', () => {
    const r = compareMethods(full({ rhr: 175 }));
    expect(r.blocking).toBe(true);
    expect(r.issues.some((i) => i.code === 'rhr_not_below_avg20')).toBe(true);
  });

  it('does not repeat the same warning for two methods sharing one HRmax', () => {
    const r = compareMethods(full({ hrmaxSource: 'tanaka', age: 60, avg20: 170 }));
    expect(r.issues.length).toBe(1);
  });
});

describe('buildObservations', () => {
  const ids = (input: ComparisonInput) => buildObservations(compareMethods(input), input).map((o) => o.id);
  const text = (input: ComparisonInput, id: string) =>
    buildObservations(compareMethods(input), input).find((o) => o.id === id)?.text ?? '';

  it('measured HRmax: resting HR, reference and range observations use the real numbers', () => {
    const i = full();
    expect(ids(i)).toEqual(['resting-hr', 'measured-hrmax', 'threshold-reference', 'ranges-differ', 'hrr-provisional', 'none-superior']);
    const rest = text(i, 'resting-hr');
    expect(rest).toContain('148 bpm');
    expect(rest).toContain('133 bpm');
    expect(rest).toContain('a difference of 15 bpm');
    expect(text(i, 'threshold-reference')).toContain('161.5 bpm');
    expect(text(i, 'threshold-reference')).toContain('about 85%');
    const diff = text(i, 'ranges-differ');
    expect(diff).toContain('Zone 2 starts at 139 bpm (%MHR), 134 bpm (%HRR) and 126 bpm (Threshold-based)');
    expect(diff).toContain('Zone 4 starts at 167 bpm (%MHR), 162 bpm (%HRR) and 152 bpm (Threshold-based)');
    expect(diff).toContain('a spread of 15 bpm');
  });

  it('estimated HRmax: shows the effect of a 10 bpm error and the two equations', () => {
    const i = full({ hrmaxSource: 'tanaka', age: 33, measuredHrmax: null, rhr: 55, avg20: 165 });
    const est = text(i, 'estimated-hrmax');
    expect(est).toContain('184.9 bpm');
    expect(est).toContain('%MHR boundaries by about 7–9 bpm');
    expect(est).toContain('%HRR boundaries by about 6–9 bpm');
    const eq = text(i, 'equations');
    expect(eq).toContain('At age 33');
    expect(eq).toContain('184.9 bpm');
    expect(eq).toContain('187 bpm');
    expect(eq).toContain('2.1 bpm');
    expect(ids(i).includes('measured-hrmax')).toBe(false);
  });

  it('incomplete methods are reported and observations that need their data are skipped', () => {
    const i: ComparisonInput = { ...BASE, avg20: 170 };
    const list = ids(i);
    expect(list[0]).toBe('incomplete');
    expect(text(i, 'incomplete')).toContain('%MHR is incomplete: it still needs hrmax source');
    expect(list.includes('resting-hr')).toBe(false);
    expect(list.includes('ranges-differ')).toBe(false);
    expect(list.includes('threshold-reference')).toBe(true);
    expect(text(i, 'threshold-reference').includes('of the HRmax used')).toBe(false);
  });

  it('different HRmax sources and custom zones are called out', () => {
    const i = full({ hrmaxSource: 'tanaka', age: 40, hrmaxSourceOverrides: { hrr: 'measured' }, edges: { mhr: [null, 73, 85, 88, 92, 100] } });
    const list = ids(i);
    expect(list.includes('different-sources')).toBe(true);
    expect(list.includes('custom')).toBe(true);
    expect(text(i, 'custom')).toContain('%MHR is using custom zone percentages');
  });

  it('never presents one method as superior', () => {
    const list = buildObservations(compareMethods(full()), full());
    expect(list[list.length - 1].id).toBe('none-superior');
    expect(list[list.length - 1].text).toContain('None of the three methods is automatically better');
  });
});

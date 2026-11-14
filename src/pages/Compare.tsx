import { useMemo, useState } from 'react';
import { compareMethods, type ComparisonInput } from '../calculations/comparison';
import { buildObservations } from '../calculations/observations';
import ComparisonChart from '../components/charts/ComparisonChart';
import ComparisonTable from '../components/comparison/ComparisonTable';
import Observations from '../components/comparison/Observations';
import SharedInputs, { EMPTY_FORM, type CompareForm } from '../components/comparison/SharedInputs';
import { METHOD_ORDER, METHOD_STYLE } from '../components/comparison/methodStyle';
import Disclaimer from '../components/common/Disclaimer';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useZoneEditsStore } from '../hooks/ZoneEditsContext';
import type { HRmaxSource } from '../types';
import { parseNumberInput } from '../utils/format';

type Snapshot = Omit<ComparisonInput, 'edges'>;

function toSnapshot(f: CompareForm): Snapshot {
  const overrides: Partial<Record<'mhr' | 'hrr', HRmaxSource>> = {};
  if (f.useOverrides) {
    if (f.overrideMhr) overrides.mhr = f.overrideMhr;
    if (f.overrideHrr) overrides.hrr = f.overrideHrr;
  }
  return {
    age: parseNumberInput(f.age),
    measuredHrmax: parseNumberInput(f.measured),
    hrmaxSource: f.source,
    hrmaxSourceOverrides: overrides,
    rhr: parseNumberInput(f.rhr),
    avg20: parseNumberInput(f.avg20),
  };
}

export default function Compare() {
  useDocumentMeta(
    'Compare Heart Rate Zone Methods',
    'Enter your details once and compare %MHR, %HRR and threshold-based heart rate zones side by side on a shared scale.',
  );
  const [form, setForm] = useState<CompareForm>(EMPTY_FORM);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const store = useZoneEditsStore();

  const input: ComparisonInput | null = useMemo(
    () => (snapshot ? { ...snapshot, edges: store.edges } : null),
    [snapshot, store.edges],
  );
  const result = useMemo(() => (input ? compareMethods(input) : null), [input]);
  const observations = useMemo(() => (input && result ? buildObservations(result, input) : []), [input, result]);

  const customMethods = result ? METHOD_ORDER.filter((m) => result.outcomes[m].calc?.isCustom) : [];
  const errors = result ? result.issues.filter((i) => i.severity === 'error') : [];
  const warnings = result ? result.issues.filter((i) => i.severity === 'warning') : [];

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">Comparison dashboard</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">Compare the Three Methods</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Enter your details once to see %MHR, %HRR and threshold-based zones side by side. Each method uses only the inputs
        it needs, and none is presented as universally superior.
      </p>

      <div className="mt-10 max-w-3xl">
        <SharedInputs form={form} onChange={(p) => setForm((f) => ({ ...f, ...p }))} onSubmit={() => setSnapshot(toSnapshot(form))} />
      </div>

      {result ? (
        <section aria-labelledby="compare-results" className="mt-12 space-y-10 border-t border-ink pt-8">
          <h2 id="compare-results" className="text-3xl font-medium">Side-by-side results</h2>

          {errors.length > 0 ? (
            <div role="alert" className="border border-accent p-3 text-sm">
              <p className="font-semibold text-accent">These values do not fit together:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {errors.map((e) => (
                  <li key={e.code}>{e.message}</li>
                ))}
              </ul>
              <p className="mt-2">Please correct them and compare again.</p>
            </div>
          ) : null}

          {!result.blocking ? (
            <>
              {warnings.length > 0 ? (
                <ul className="space-y-1 border border-accent p-3 text-sm" aria-label="Warnings about your inputs">
                  {warnings.map((w) => (
                    <li key={w.code}>{w.message}</li>
                  ))}
                </ul>
              ) : null}

              <ComparisonTable result={result} />

              <div>
                <h3 className="text-2xl font-medium">One scale</h3>
                <div className="mt-4">
                  <ComparisonChart result={result} />
                </div>
              </div>

              <section aria-labelledby="assumptions-heading">
                <h3 id="assumptions-heading" className="text-2xl font-medium">Assumptions used</h3>
                <div className="mt-4 grid gap-6 md:grid-cols-3">
                  {METHOD_ORDER.map((m) => {
                    const o = result.outcomes[m];
                    return (
                      <div key={m}>
                        <h4 className="font-sans text-sm font-semibold">
                          <span aria-hidden="true">{METHOD_STYLE[m].glyph}</span> {METHOD_STYLE[m].name}
                        </h4>
                        {o.state === 'complete' ? (
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                            {o.assumptions.map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        ) : o.state === 'incomplete' ? (
                          <p className="mt-1 text-sm text-muted">Incomplete: still needs {o.missing.join(', ').toLowerCase()}.</p>
                        ) : (
                          <p className="mt-1 text-sm text-muted">{o.errors[0]?.message}</p>
                        )}
                        {o.warnings.map((w) => (
                          <p key={w.code} className="mt-1 text-xs text-accent">{w.message}</p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </section>

              {customMethods.length > 0 ? (
                <section aria-label="Custom zones in use" className="border border-line p-4 text-sm">
                  <p>
                    Custom zone percentages (set on the Calculator page) are in use. They do not carry the source’s
                    validation.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {customMethods.map((m) => (
                      <button key={m} type="button" className="btn btn-secondary" onClick={() => store.reset(m)}>
                        Reset {METHOD_STYLE[m].name} to preset
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <Observations items={observations} />
            </>
          ) : null}
        </section>
      ) : null}

      <div className="mt-16 border-t border-line pt-6">
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}

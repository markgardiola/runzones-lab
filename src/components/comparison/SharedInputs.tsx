import type { HRmaxSource } from '../../types';
import { HRmaxSourceRadios } from '../calculator/HRmaxFields';
import NumberField from '../common/NumberField';

export interface CompareForm {
  age: string;
  measured: string;
  rhr: string;
  avg20: string;
  source: HRmaxSource | null;
  useOverrides: boolean;
  overrideMhr: '' | HRmaxSource;
  overrideHrr: '' | HRmaxSource;
}

export const EMPTY_FORM: CompareForm = {
  age: '',
  measured: '',
  rhr: '',
  avg20: '',
  source: null,
  useOverrides: false,
  overrideMhr: '',
  overrideHrr: '',
};

interface Props {
  form: CompareForm;
  onChange: (patch: Partial<CompareForm>) => void;
  onSubmit: () => void;
}

const SOURCE_NAMES: Record<HRmaxSource, string> = {
  measured: 'Measured value',
  tanaka: 'Tanaka estimate',
  traditional: '220 − age estimate',
};

function SourceSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: '' | HRmaxSource;
  onChange: (v: '' | HRmaxSource) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as '' | HRmaxSource)}
        className="mt-2 min-h-[44px] w-full max-w-xs border border-ink bg-paper px-3 text-base"
      >
        <option value="">Same as the shared choice</option>
        {(Object.keys(SOURCE_NAMES) as HRmaxSource[]).map((k) => (
          <option key={k} value={k}>{SOURCE_NAMES[k]}</option>
        ))}
      </select>
    </div>
  );
}

/** Shared athlete inputs, collected once. Each method still uses only what it needs. */
export default function SharedInputs({ form, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      aria-label="Shared athlete information"
      className="space-y-8"
    >
      <HRmaxSourceRadios
        idPrefix="cmp"
        legend="How should maximum heart rate (HRmax) be determined?"
        source={form.source}
        onSourceChange={(s) => onChange({ source: s })}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <NumberField
          id="cmp-age"
          label="Age"
          unit="years"
          hint="Needed only for an age-based HRmax estimate."
          value={form.age}
          onChange={(v) => onChange({ age: v })}
        />
        <NumberField
          id="cmp-measured"
          label="Measured maximum heart rate"
          unit="bpm"
          hint="Needed only if you chose a measured value."
          value={form.measured}
          onChange={(v) => onChange({ measured: v })}
          step="0.1"
        />
        <NumberField
          id="cmp-rhr"
          label="Resting heart rate"
          unit="bpm"
          hint="Needed for %HRR."
          value={form.rhr}
          onChange={(v) => onChange({ rhr: v })}
          step="0.1"
        />
        <NumberField
          id="cmp-avg20"
          label="Average heart rate over a 20-minute time trial"
          unit="bpm"
          hint="Needed for the threshold-based method."
          value={form.avg20}
          onChange={(v) => onChange({ avg20: v })}
          step="0.1"
        />
      </div>

      <div>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.useOverrides}
            onChange={(e) => onChange({ useOverrides: e.target.checked })}
            className="h-4 w-4"
          />
          Use a different HRmax source for %MHR or %HRR
        </label>
        {form.useOverrides ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <SourceSelect id="cmp-override-mhr" label="HRmax source for %MHR" value={form.overrideMhr} onChange={(v) => onChange({ overrideMhr: v })} />
            <SourceSelect id="cmp-override-hrr" label="HRmax source for %HRR" value={form.overrideHrr} onChange={(v) => onChange({ overrideHrr: v })} />
          </div>
        ) : null}
        <p className="mt-2 text-xs text-muted">
          Every assumption used is listed with the results, and a method that lacks an input is shown as incomplete
          instead of being guessed.
        </p>
      </div>

      <button type="submit" className="btn btn-primary">Compare methods</button>
    </form>
  );
}

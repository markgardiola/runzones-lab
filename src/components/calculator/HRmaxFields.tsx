import type { HRmaxSource, ValidationIssue } from '../../types';
import NumberField from '../common/NumberField';

export const HRMAX_OPTIONS: { id: HRmaxSource; label: string; caveat: string }[] = [
  {
    id: 'measured',
    label: 'I know my measured maximum heart rate',
    caveat:
      'The best option. Age-based estimates are not equivalent to a measured value. A maximal effort is strenuous, so read the disclaimer first.',
  },
  {
    id: 'tanaka',
    label: 'Estimate it with the Tanaka equation: 208 − (0.7 × age)',
    caveat:
      'Tanaka, Monahan and Seals (2001). Derived from healthy adults, with individual differences of about 10 bpm, and it may not apply if you have cardiovascular disease or smoke.',
  },
  {
    id: 'traditional',
    label: 'Estimate it with the traditional equation: 220 − age',
    caveat:
      'A commonly used legacy estimate, not a precise or universally valid prediction. It tends to overestimate in younger adults and underestimate in older ones.',
  },
];

interface RadiosProps {
  idPrefix: string;
  legend: string;
  source: HRmaxSource | null;
  onSourceChange: (s: HRmaxSource) => void;
  sourceError?: string;
}

/** The three HRmax source choices, with no default selected. */
export function HRmaxSourceRadios({ idPrefix, legend, source, onSourceChange, sourceError }: RadiosProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-3 space-y-3">
        {HRMAX_OPTIONS.map((o) => (
          <div key={o.id}>
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
              <input
                type="radio"
                name={`${idPrefix}-hrmax-source`}
                value={o.id}
                checked={source === o.id}
                onChange={() => onSourceChange(o.id)}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="block text-xs leading-relaxed text-muted">{o.caveat}</span>
              </span>
            </label>
          </div>
        ))}
      </div>
      {sourceError ? <p className="mt-2 text-sm text-accent">{sourceError}</p> : null}
    </fieldset>
  );
}

interface Props {
  idPrefix: string;
  source: HRmaxSource | null;
  onSourceChange: (s: HRmaxSource) => void;
  age: string;
  onAgeChange: (v: string) => void;
  measured: string;
  onMeasuredChange: (v: string) => void;
  issues: ValidationIssue[];
  sourceError?: string;
}

const msg = (issues: ValidationIssue[], field: string) => issues.find((i) => i.field === field)?.message;

export default function HRmaxFields({
  idPrefix,
  source,
  onSourceChange,
  age,
  onAgeChange,
  measured,
  onMeasuredChange,
  issues,
  sourceError,
}: Props) {
  return (
    <div>
      <HRmaxSourceRadios
        idPrefix={idPrefix}
        legend="How do you want to determine your maximum heart rate (HRmax)?"
        source={source}
        onSourceChange={onSourceChange}
        sourceError={sourceError}
      />
      {source === 'measured' ? (
        <div className="mt-4">
          <NumberField
            id={`${idPrefix}-hrmax`}
            label="Measured maximum heart rate"
            unit="bpm"
            value={measured}
            onChange={onMeasuredChange}
            error={msg(issues, 'hrmax')}
            step="0.1"
          />
        </div>
      ) : null}
      {source === 'tanaka' || source === 'traditional' ? (
        <div className="mt-4">
          <NumberField
            id={`${idPrefix}-age`}
            label="Age"
            unit="years"
            value={age}
            onChange={onAgeChange}
            error={msg(issues, 'age')}
          />
        </div>
      ) : null}
    </div>
  );
}

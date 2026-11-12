interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
  error?: string;
  step?: string;
  min?: number;
  max?: number;
}

export default function NumberField({ id, label, value, onChange, unit, hint, error, step = '1', min, max }: Props) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {unit ? <span className="font-normal text-muted"> ({unit})</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 min-h-[44px] w-full max-w-[12rem] border bg-paper px-3 text-base ${
          error ? 'border-accent' : 'border-ink'
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

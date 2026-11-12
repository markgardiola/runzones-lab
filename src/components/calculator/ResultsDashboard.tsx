import type { ValidationIssue, ZoneCalculation, ZoneModel } from '../../types';
import { formatNumber } from '../../utils/format';
import ZoneBar from '../charts/ZoneBar';
import CalculationBreakdown from './CalculationBreakdown';
import StatusBadge, { statusExplanation } from './StatusBadge';
import ZoneEditor from './ZoneEditor';
import ZoneTable from './ZoneTable';

interface Props {
  calc: ZoneCalculation;
  model: ZoneModel;
  warnings: ValidationIssue[];
  edges: (number | null)[];
  onEdgesChange: (edges: (number | null)[]) => void;
  onReset: () => void;
}

export default function ResultsDashboard({ calc, model, warnings, edges, onEdgesChange, onReset }: Props) {
  const hadSubBands = Boolean(model.subBands) && calc.isCustom;
  return (
    <section aria-labelledby={`results-${calc.method}`} className="mt-10 space-y-8 border-t border-ink pt-8">
      <div>
        <p className="eyebrow">Results</p>
        <h3 id={`results-${calc.method}`} className="mt-1 text-2xl font-medium">Your five heart rate zones</h3>
      </div>

      {warnings.length > 0 ? (
        <ul className="space-y-1 border border-accent p-3 text-sm" aria-label="Warnings about your inputs">
          {warnings.map((w) => (
            <li key={w.code + w.field}>{w.message}</li>
          ))}
        </ul>
      ) : null}

      <div>
        <h4 className="sr-only">Summary</h4>
        <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Method</dt>
            <dd className="font-semibold">{calc.modelLabel}</dd>
          </div>
          <div>
            <dt className="text-muted">{calc.anchor.label}</dt>
            <dd className="font-semibold">{formatNumber(calc.anchor.value)} bpm</dd>
          </div>
          {Object.entries(calc.anchor.details).map(([k, v]) => (
            <div key={k}>
              <dt className="text-muted">{k}</dt>
              <dd>{typeof v === 'number' ? `${formatNumber(v)} bpm` : v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <StatusBadge status={calc.status} />
          <span className="text-muted">{statusExplanation(calc.status)}</span>
        </p>
        {model.notes.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
            {model.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
        {hadSubBands ? (
          <p className="mt-2 text-xs text-muted">The source’s Zone 5a/5b sub-bands apply to the original preset only.</p>
        ) : null}
      </div>

      <ZoneBar calc={calc} />
      <ZoneTable calc={calc} />
      <CalculationBreakdown calc={calc} />
      <ZoneEditor model={model} edges={edges} onChange={onEdgesChange} onReset={onReset} />
    </section>
  );
}

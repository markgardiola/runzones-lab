import { useSearchParams } from 'react-router-dom';
import Disclaimer from '../components/common/Disclaimer';
import Tabs from '../components/common/Tabs';
import HrrCalculator from '../components/calculator/HrrCalculator';
import MhrCalculator from '../components/calculator/MhrCalculator';
import ThresholdCalculator from '../components/calculator/ThresholdCalculator';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { MethodId } from '../types';

const TABS: { id: MethodId; label: string }[] = [
  { id: 'mhr', label: '%MHR' },
  { id: 'hrr', label: '%HRR (Karvonen)' },
  { id: 'threshold', label: 'Threshold (FTHR)' },
];

function isMethod(v: string | null): v is MethodId {
  return v === 'mhr' || v === 'hrr' || v === 'threshold';
}

export default function Calculator() {
  useDocumentMeta(
    'Heart Rate Zone Calculator',
    'Calculate five heart rate training zones with the %MHR, Karvonen %HRR or threshold-based field-estimate method, with every step of the calculation shown.',
  );
  const [params, setParams] = useSearchParams();
  const raw = params.get('method');
  const active: MethodId = isMethod(raw) ? raw : 'mhr';

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">Calculator</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">Heart Rate Zone Calculator</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Pick a method, enter your numbers and see five zones with every step of the calculation. The three methods use
        different physiological references, so their ranges will differ.
      </p>

      <div className="mt-8">
        <Tabs
          idPrefix="calc"
          label="Calculation method"
          tabs={TABS}
          active={active}
          onChange={(id) => setParams({ method: id }, { replace: true })}
        />
      </div>

      {TABS.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`calc-panel-${t.id}`}
          aria-labelledby={`calc-tab-${t.id}`}
          hidden={t.id !== active}
          className="mt-8"
        >
          {t.id === 'mhr' ? <MhrCalculator /> : t.id === 'hrr' ? <HrrCalculator /> : <ThresholdCalculator />}
        </div>
      ))}

      <div className="mt-16 border-t border-line pt-6">
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}

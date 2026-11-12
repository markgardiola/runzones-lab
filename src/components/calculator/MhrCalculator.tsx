import { useState } from 'react';
import type { FormEvent } from 'react';
import { calculateMhrZones, type HRmaxInput } from '../../calculations/maximumHR';
import { ZONE_MODELS } from '../../data/zoneModels';
import { useZoneMethod } from '../../hooks/useZoneMethod';
import type { HRmaxSource } from '../../types';
import { parseNumberInput } from '../../utils/format';
import ErrorSummary from './ErrorSummary';
import HRmaxFields from './HRmaxFields';
import MethodLayout from './MethodLayout';
import ResultsDashboard from './ResultsDashboard';

interface Inputs {
  hrmax: HRmaxInput;
}

const model = ZONE_MODELS.mhr;
const calculate = (inputs: Inputs, edges: (number | null)[] | undefined) => calculateMhrZones({ ...inputs, edges });

export default function MhrCalculator() {
  const [source, setSource] = useState<HRmaxSource | null>(null);
  const [age, setAge] = useState('');
  const [measured, setMeasured] = useState('');
  const [sourceError, setSourceError] = useState('');
  const { result, edges, setEdges, submit, reset } = useZoneMethod<Inputs>(model, calculate);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (source === null) {
      setSourceError('Choose how your maximum heart rate is determined.');
      return;
    }
    setSourceError('');
    submit({ hrmax: { source, age: parseNumberInput(age), measured: parseNumberInput(measured) } });
  };

  const errors = result && !result.ok ? result.errors : [];

  return (
    <MethodLayout
      title="Maximum Heart Rate (%MHR)"
      intro={
        <>
          <p>
            Each zone is a percentage range of your maximum heart rate (HRmax). Choose where your HRmax comes from:
            a measured value is preferred, and age-based estimates are clearly labelled as estimates.
          </p>
          <p>Zone percentages follow Joe Friel’s published zone table (Friel, 2025).</p>
        </>
      }
      formula="Target HR = HRmax × zone percentage"
      limits={[
        'The result is only as reliable as the HRmax behind it. Age-based estimates carry individual differences of roughly 10 bpm (Tanaka et al., 2001).',
        'The %MHR method ignores resting heart rate, so two runners with the same HRmax get the same zones even if their resting heart rates differ widely.',
        'The zone table comes from a cycling book; Friel’s current article no longer separates running and cycling zones.',
        'Different methods use different physiological references, so these ranges will not match the other two methods.',
      ]}
      sources={[
        { label: 'Tanaka, Monahan & Seals (2001), Age-predicted maximal heart rate revisited', href: 'https://pubmed.ncbi.nlm.nih.gov/11153730/' },
        { label: 'Friel, A Quick Guide to Setting Zones', href: 'https://joefrieltraining.com/a-quick-guide-to-setting-zones/' },
      ]}
    >
      <form onSubmit={onSubmit} noValidate>
        <HRmaxFields
          idPrefix="mhr"
          source={source}
          onSourceChange={setSource}
          age={age}
          onAgeChange={setAge}
          measured={measured}
          onMeasuredChange={setMeasured}
          issues={errors}
          sourceError={sourceError}
        />
        <button type="submit" className="btn btn-primary mt-6">Calculate zones</button>
      </form>
      <ErrorSummary errors={errors} />
      {result && result.ok ? (
        <ResultsDashboard
          calc={result.value}
          model={model}
          warnings={result.warnings}
          edges={edges}
          onEdgesChange={setEdges}
          onReset={reset}
        />
      ) : null}
    </MethodLayout>
  );
}

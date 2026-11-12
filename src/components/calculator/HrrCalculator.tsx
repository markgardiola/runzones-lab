import { useState } from 'react';
import type { FormEvent } from 'react';
import { calculateHrrZones } from '../../calculations/heartRateReserve';
import type { HRmaxInput } from '../../calculations/maximumHR';
import { ZONE_MODELS } from '../../data/zoneModels';
import { useZoneMethod } from '../../hooks/useZoneMethod';
import type { HRmaxSource } from '../../types';
import { parseNumberInput } from '../../utils/format';
import NumberField from '../common/NumberField';
import ErrorSummary from './ErrorSummary';
import HRmaxFields from './HRmaxFields';
import MethodLayout from './MethodLayout';
import ResultsDashboard from './ResultsDashboard';

interface Inputs {
  hrmax: HRmaxInput;
  rhr: number | null;
}

const model = ZONE_MODELS.hrr;
const calculate = (inputs: Inputs, edges: (number | null)[] | undefined) => calculateHrrZones({ ...inputs, edges });

export default function HrrCalculator() {
  const [source, setSource] = useState<HRmaxSource | null>(null);
  const [age, setAge] = useState('');
  const [measured, setMeasured] = useState('');
  const [rhr, setRhr] = useState('');
  const [sourceError, setSourceError] = useState('');
  const { result, edges, setEdges, submit, reset } = useZoneMethod<Inputs>(model, calculate);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (source === null) {
      setSourceError('Choose how your maximum heart rate is determined.');
      return;
    }
    setSourceError('');
    submit({
      hrmax: { source, age: parseNumberInput(age), measured: parseNumberInput(measured) },
      rhr: parseNumberInput(rhr),
    });
  };

  const errors = result && !result.ok ? result.errors : [];
  const rhrError = errors.find((e) => e.field === 'rhr')?.message;

  return (
    <MethodLayout
      title="Heart Rate Reserve (Karvonen, %HRR)"
      intro={
        <>
          <p>
            Heart rate reserve (HRR) is the gap between your maximum and resting heart rate. Zones are a percentage of
            that gap, added back on top of your resting heart rate. This is the Karvonen method, named after Martti
            Karvonen.
          </p>
          <p>
            Resting heart rate matters because it is the starting point: for the same HRmax, a lower resting heart rate
            gives a larger reserve and moves every zone boundary. The breakdown below shows each step with your numbers.
          </p>
          <p>
            Zone percentages here are a common 10%-band convention applied to HRR. They are a provisional preset, not a
            validated running-specific model.
          </p>
        </>
      }
      formula="HRR = HRmax − RHR;  Target HR = RHR + (HRR × zone percentage)"
      limits={[
        'The zone percentages are a convention that was originally defined on maximum heart rate. Treat the zones as a starting point.',
        'The American College of Sports Medicine notes that no study compares all intensity methods, so zones from one method are not equivalent to another’s (Garber et al., 2011).',
        'Accuracy depends on both inputs: an estimated HRmax carries individual error, and an unusual resting heart rate on the day skews every zone.',
        'Effort below the lowest zone boundary falls below Zone 1; the results say so explicitly.',
      ]}
      sources={[
        { label: 'Karvonen, Kentala & Mustala (1957), The effects of training on heart rate', href: 'https://pubmed.ncbi.nlm.nih.gov/13470504/' },
        { label: 'Garber et al. (2011), ACSM position stand on exercise quantity and quality', href: 'https://pubmed.ncbi.nlm.nih.gov/21694556/' },
      ]}
    >
      <form onSubmit={onSubmit} noValidate>
        <HRmaxFields
          idPrefix="hrr"
          source={source}
          onSourceChange={setSource}
          age={age}
          onAgeChange={setAge}
          measured={measured}
          onMeasuredChange={setMeasured}
          issues={errors}
          sourceError={sourceError}
        />
        <div className="mt-6">
          <NumberField
            id="hrr-rhr"
            label="Resting heart rate"
            unit="bpm"
            value={rhr}
            onChange={setRhr}
            hint="Measure it while resting, for example first thing in the morning before getting up. Use a typical value rather than an unusually high or low day."
            error={rhrError}
            step="0.1"
          />
        </div>
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

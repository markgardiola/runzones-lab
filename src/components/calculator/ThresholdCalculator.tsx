import { useState } from 'react';
import type { FormEvent } from 'react';
import { calculateThresholdZones } from '../../calculations/thresholdHR';
import { ZONE_MODELS } from '../../data/zoneModels';
import { useZoneMethod } from '../../hooks/useZoneMethod';
import { parseNumberInput } from '../../utils/format';
import NumberField from '../common/NumberField';
import ErrorSummary from './ErrorSummary';
import MethodLayout from './MethodLayout';
import ResultsDashboard from './ResultsDashboard';

interface Inputs {
  avg20: number | null;
}

const model = ZONE_MODELS.threshold;
const calculate = (inputs: Inputs, edges: (number | null)[] | undefined) => calculateThresholdZones({ ...inputs, edges });

export default function ThresholdCalculator() {
  const [avg20, setAvg20] = useState('');
  const { result, edges, setEdges, submit, reset } = useZoneMethod<Inputs>(model, calculate);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit({ avg20: parseNumberInput(avg20) });
  };

  const errors = result && !result.ok ? result.errors : [];

  return (
    <MethodLayout
      title="Threshold-Based Heart Rate (field-estimated FTHR)"
      intro={
        <>
          <p>
            This method anchors your zones to an estimate of your functional threshold heart rate (FTHR), taken from a
            20-minute field test. It is an approximation of FTHR, not a direct laboratory measurement of lactate
            threshold heart rate.
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Perform a steady, hard 20-minute time trial.</li>
            <li>Record the average heart rate for the entire 20-minute effort.</li>
            <li>Multiply the average heart rate by 0.95.</li>
            <li>Use the resulting estimated FTHR to calculate training zones.</li>
          </ol>
          <p>
            Enter your average below; the calculator does steps 3 and 4. Friel suggests doing the test alone, starting
            conservatively, and repeating it about every six weeks. A hard 20-minute effort is strenuous, so read the
            disclaimer and seek professional guidance first if you have any health concerns.
          </p>
        </>
      }
      formula="Estimated FTHR = 20-minute average HR × 0.95;  Target HR = FTHR × zone percentage"
      limits={[
        'Pacing errors matter: starting too hard or fading changes the average and therefore every zone.',
        'Fatigue, heat and other conditions on the day can shift your average heart rate, as can the accuracy of your heart rate device.',
        'The 0.95 factor is an approximation, so the result is a field estimate of FTHR, not a laboratory lactate threshold heart rate.',
        'The zone table comes from a cycling book; Friel’s current article no longer separates running and cycling zones. Zone 5 has no upper cap in the source.',
      ]}
      sources={[{ label: 'Friel, A Quick Guide to Setting Zones', href: 'https://joefrieltraining.com/a-quick-guide-to-setting-zones/' }]}
    >
      <form onSubmit={onSubmit} noValidate>
        <NumberField
          id="threshold-avg20"
          label="Average heart rate over the full 20-minute effort"
          unit="bpm"
          value={avg20}
          onChange={setAvg20}
          error={errors.find((e) => e.field === 'avg20')?.message}
          step="0.1"
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

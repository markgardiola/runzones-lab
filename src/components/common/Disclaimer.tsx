import { Link } from 'react-router-dom';

interface Props {
  variant?: 'short' | 'full';
}

export default function Disclaimer({ variant = 'short' }: Props) {
  if (variant === 'short') {
    return (
      <p className="text-sm leading-relaxed text-muted">
        RunZones Lab is an educational and informational tool. Calculated zones are estimates and
        training references, not medical advice or diagnoses. If you have a health condition or take
        medication that affects heart rate, seek professional guidance before strenuous testing or
        changing your training intensity.{' '}
        <Link to="/about#disclaimer" className="link-underline">Read the full disclaimer</Link>.
      </p>
    );
  }
  return (
    <div id="disclaimer" className="scroll-mt-8">
      <h2 className="text-2xl font-semibold">Medical and educational disclaimer</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
        <li>RunZones Lab is an educational and informational tool.</li>
        <li>Calculated heart rate zones are estimates or training references, not medical diagnoses.</li>
        <li>Different training methodologies use different physiological references.</li>
        <li>Age-based maximum heart rate equations have individual limitations.</li>
        <li>Field-test results can be affected by fatigue, pacing, environment and measurement error.</li>
        <li>Some medications and health conditions can affect heart rate responses.</li>
        <li>
          If you have relevant health concerns, seek professional guidance before undertaking
          strenuous testing or changing exercise intensity.
        </li>
      </ul>
      <p className="mt-4 text-sm text-muted">
        RunZones Lab makes no medical guarantees and does not replace individualised professional advice.
      </p>
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { Validated, ZoneCalculation, ZoneModel } from '../types';
import { useZoneEditsStore } from './ZoneEditsContext';

type Edges = (number | null)[];

/**
 * Holds one method's submitted inputs and recomputes the result when the inputs or the method's
 * custom zone edges change. `calculate` must be a stable (module-level) function.
 */
export function useZoneMethod<I>(
  model: ZoneModel,
  calculate: (inputs: I, edges: Edges | undefined) => Validated<ZoneCalculation>,
) {
  const [submitted, setSubmitted] = useState<I | null>(null);
  const store = useZoneEditsStore();
  const edges = store.edges[model.method];
  const result = useMemo(
    () => (submitted === null ? null : calculate(submitted, edges)),
    [submitted, edges, calculate],
  );
  return {
    result,
    edges,
    setEdges: (e: Edges) => store.setEdges(model.method, e),
    submit: (inputs: I) => setSubmitted(inputs),
    reset: () => store.reset(model.method),
  };
}

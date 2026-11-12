import { useMemo, useState } from 'react';
import { resetEdges } from '../calculations/zoneEditing';
import type { Validated, ZoneCalculation, ZoneModel } from '../types';

type Edges = (number | null)[];

/**
 * Holds one method's submitted inputs and custom zone edges, and recomputes the result when either
 * changes. `calculate` must be a stable (module-level) function.
 */
export function useZoneMethod<I>(
  model: ZoneModel,
  calculate: (inputs: I, edges: Edges | undefined) => Validated<ZoneCalculation>,
) {
  const [submitted, setSubmitted] = useState<I | null>(null);
  const [edges, setEdges] = useState<Edges>(() => resetEdges(model));
  const result = useMemo(
    () => (submitted === null ? null : calculate(submitted, edges)),
    [submitted, edges, calculate],
  );
  return {
    result,
    edges,
    setEdges,
    submit: (inputs: I) => setSubmitted(inputs),
    reset: () => setEdges(resetEdges(model)),
  };
}

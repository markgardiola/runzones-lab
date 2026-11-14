import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { resetEdges } from '../calculations/zoneEditing';
import { ZONE_MODELS } from '../data/zoneModels';
import type { MethodId } from '../types';

type Edges = (number | null)[];
type EditsByMethod = Record<MethodId, Edges>;

export interface ZoneEditsStore {
  edges: EditsByMethod;
  setEdges: (method: MethodId, edges: Edges) => void;
  reset: (method: MethodId) => void;
}

function initial(): EditsByMethod {
  return {
    mhr: resetEdges(ZONE_MODELS.mhr),
    hrr: resetEdges(ZONE_MODELS.hrr),
    threshold: resetEdges(ZONE_MODELS.threshold),
  };
}

function useLocalStore(): ZoneEditsStore {
  const [edges, setAll] = useState<EditsByMethod>(initial);
  return useMemo(
    () => ({
      edges,
      setEdges: (method, e) => setAll((prev) => ({ ...prev, [method]: e })),
      reset: (method) => setAll((prev) => ({ ...prev, [method]: resetEdges(ZONE_MODELS[method]) })),
    }),
    [edges],
  );
}

const Ctx = createContext<ZoneEditsStore | null>(null);

/** In-memory only: shares custom zone percentages between the Calculator and Compare pages. */
export function ZoneEditsProvider({ children }: { children: ReactNode }) {
  const store = useLocalStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

/** Uses the shared store when a provider exists, otherwise a private one (e.g. in isolated tests). */
export function useZoneEditsStore(): ZoneEditsStore {
  const shared = useContext(Ctx);
  const local = useLocalStore();
  return shared ?? local;
}

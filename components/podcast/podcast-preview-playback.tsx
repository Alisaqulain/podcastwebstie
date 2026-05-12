"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Ctx = {
  activeId: string | null;
  request: (id: string) => void;
  release: (id: string) => void;
};

const PodcastPreviewPlaybackContext = createContext<Ctx | null>(null);

export function PodcastPreviewPlaybackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const request = useCallback((id: string) => setActiveId(id), []);
  const release = useCallback((id: string) => {
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);
  const value = useMemo(
    () => ({ activeId, request, release }),
    [activeId, request, release]
  );
  return (
    <PodcastPreviewPlaybackContext.Provider value={value}>
      {children}
    </PodcastPreviewPlaybackContext.Provider>
  );
}

export function usePodcastPreviewPlayback(): Ctx | null {
  return useContext(PodcastPreviewPlaybackContext);
}

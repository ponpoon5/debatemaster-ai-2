import { useMemo } from 'react';
import { DebateArchive } from '../core/types';

export const useHistoryLogic = (archives: DebateArchive[]) => {
  const sortedArchives = useMemo(() => {
    return [...archives].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [archives]);

  const isEmpty = sortedArchives.length === 0;

  return {
    sortedArchives,
    isEmpty,
  };
};

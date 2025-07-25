import { useMemo } from 'react';

export const useFiltering = <T>(data: T[], predicate: (item: T) => boolean): T[] => {
  return useMemo(() => {
    return data.filter(predicate);
  }, [data, predicate]);
};

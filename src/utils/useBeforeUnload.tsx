import { useCallback, useEffect } from 'react';

const useBeforeUnload = (value: ((evt: BeforeUnloadEvent) => void) | string): void => {
  const handleBeforeunload = useCallback(
    (evt: BeforeUnloadEvent) => {
      if (typeof value === 'function') {
        value(evt);
      }
    },
    [value],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => window.removeEventListener('beforeunload', handleBeforeunload);
  }, [handleBeforeunload]);
};

export default useBeforeUnload;

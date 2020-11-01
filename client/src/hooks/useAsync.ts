import { useEffect } from 'react';

function useAsync(asyncFn: any, onSuccess: any) {
  useEffect(() => {
    let isMounted = true;
    asyncFn().then((data: any) => {
      if (isMounted) onSuccess(data);
    });
    return () => {
      isMounted = false;
    };
  }, [asyncFn, onSuccess]);
}

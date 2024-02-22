import { useEffect, useRef } from 'react';

/**
 * This is utility component/hook which can be used by any view component to check the number of times it is getting rendered
 * @returns
 */
export const useRenderCount = () => {
  const ref = useRef(0);

  useEffect(() => {
    ref.current += 1;
  });

  return ref.current;
};

export default useRenderCount;

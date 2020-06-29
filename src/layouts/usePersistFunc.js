import { useRef, useCallback } from 'react';

const usePersistFunc = (func) => {
  const ref = useRef();
  ref.current = func;
  const pFun = useCallback((...args) => ref.current(...args), [ref]);
  return pFun;
};
export default usePersistFunc;

import { useRef, useCallback, useState } from 'react';

export function cloneHistory(history: any) {
  // const historyShadow = JSON.parse(JSON.stringify(history));
  const historyShadow = { ...history };
  return historyShadow;
}

export type noop = (...args: any[]) => any;

export function usePersistFn<T extends noop>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering.');
  });

  ref.current = fn;

  const persistFn = useCallback(((...args) => ref.current(...args)) as T, [ref]);

  return persistFn;
}

export function useOState<T extends object>(initialObj: T = {} as T): [T, (o: Partial<T>) => void] {
  const [state, setState] = useState(initialObj);
  const setOState = usePersistFn((obj) => {
    setState({
      ...state,
      ...obj,
    });
  });
  return [state, setOState];
}

/**
 * 为history对象拦截go方法
 * @param history created by createBrowserHistory()
 */
export function injectHistory(history: any): void {
  const originGo = history.go.bind(history);
  history.go = (num: number) => {
    if (Math.abs(num) > 1) {
      history.go(num - Math.sign(num));
    }
    return originGo(Math.sign(num));
  };
}

export function useHistoryStack(
  history: any,
  initStack: any[] = [],
  initIndex: number = 0,
): [any[], number, { push: noop; pop: noop; replace: noop }] {
  const [{ offset, index, historyStack }, setState] = useOState({
    offset: 0,
    index: initIndex,
    historyStack: initStack,
  });
  const currStack = historyStack.slice(0, index);
  const push = usePersistFn(() => {
    setState({
      historyStack: [...currStack, cloneHistory(history)],
      index: index + 1,
    });
  });
  const replace = usePersistFn(() => {
    if (currStack.length === 0) {
      console.error('history replace error: stack size(0)');
      return;
    }
    setState({
      historyStack: [...currStack.slice(0, currStack.length - 1), cloneHistory(history)],
    });
  });
  const pop = usePersistFn(() => {
    if (currStack.length > 1) {
      setState({
        index: index - 1,
      });
    } else {
      /* 特殊情况，在中间的位置刷新了，导致之前的栈丢失，这种情况就需要从history中填充数据 */
      setState({
        historyStack: [cloneHistory(history)],
        offset: offset - 1,
      });
    }
  });

  return [
    currStack,
    offset,
    {
      push,
      replace,
      pop,
    },
  ];
}

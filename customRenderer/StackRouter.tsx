import React, { useEffect } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import invariant from 'tiny-invariant';
import { injectHistory, useHistoryStack } from './renderTools';
import './StackRouter.less';

interface StackRouterProps {
  routerContext: any;
}

const StackRouter: React.FC<StackRouterProps> = (props) => {
  const { routerContext: context } = props;
  const { history, staticContext, match } = context;
  const [historyStack, offsetIndex, { push, replace, pop }] = useHistoryStack(history);

  useEffect(() => {
    injectHistory(history);
    return history.listen((_: any, action: string) => {
      switch (action) {
        case 'PUSH':
          push();
          break;
        case 'POP':
          pop();
          break;
        case 'REPLACE':
          replace();
          break;
        default:
          push();
      }
    });
  }, [history]);
  const classNames = `stack-routes-anim-${history.action === 'PUSH' ? 'push' : 'pop'}`;
  return (
    <TransitionGroup childFactory={child => React.cloneElement(child, { classNames })}>
      {historyStack.map((h, _index) => {
        const curHistory = _index === historyStack.length - 1 ? history : h;
        const curLocation = h.location;
        const isShow = _index === historyStack.length - 1;
        if (!isShow) return null;
        return (
          <CSSTransition key={offsetIndex + _index} timeout={200}>
            {/* double transition support persist mode */}
            <CSSTransition in={isShow} timeout={200} classNames={classNames}>
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: _index }}>
                <RouterContext.Provider
                  value={{
                    history: curHistory,
                    location: curLocation,
                    match,
                    staticContext,
                  }}
                >
                  {props.children}
                </RouterContext.Provider>
              </div>
            </CSSTransition>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

const StackRouterWrapper = ({ children }: { children: any }) => (
  <RouterContext.Consumer>
    {(context) => {
      invariant(context, 'You should not use <Route> outside a <Router>');
      return <StackRouter routerContext={context}>{children}</StackRouter>;
    }}
  </RouterContext.Consumer>
);
export default StackRouterWrapper;

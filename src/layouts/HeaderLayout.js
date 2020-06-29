import React, { useMemo, useState } from 'react';
import { Helmet } from 'umi';
import HeaderContext from './HeaderContext';
import styles from './HeaderLayout.less';
import usePersistFunc from './usePersistFunc';

const HeaderViewer = (props = {}) => {
  const { left, title, right, onLeftClick, onRightClick } = props;
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {left && (
          <div className={styles.sideContent} onClick={onLeftClick}>
            <div className={styles.button}>{left}</div>
          </div>
        )}
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.right}>
        {right && (
          <div className={styles.sideContent} onClick={onRightClick}>
            <div className={styles.button}>{right}</div>
          </div>
        )}
      </div>
    </div>
  );
};

HeaderViewer.defaultProps = {
  onLeftClick: () => undefined,
  onRightClick: () => undefined,
};

const HeaderLayout = (props) => {
  const { children } = props;
  const [headers, setHeaders] = useState([]);
  const { left, title, right, onLeftClick, onRightClick } = useMemo(() => headers[headers.length - 1] || {}, [headers]);
  const popHeader = usePersistFunc((headerObj) => {
    setHeaders(headers.filter(obj => obj !== headerObj));
    return () => {};
  });
  const pushHeader = usePersistFunc((headerObj) => {
    setHeaders([...headers, headerObj]);
    return () => popHeader(headerObj);
  });
  return (
    <div className={styles.root}>
      {title && (
        <HeaderViewer left={left} title={title} right={right} onLeftClick={onLeftClick} onRightClick={onRightClick} />
      )}
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <HeaderContext.Provider value={{ pushHeader }}>
        <div className={styles.content}>{children}</div>
      </HeaderContext.Provider>
    </div>
  );
};

export default HeaderLayout;

import React, { useState } from 'react';
import { Helmet } from 'umi';
import HeaderContext from './HeaderContext';
import styles from './HeaderLayout.less';

const HeaderViewer = (props = {}) => {
  const { left, title = 'title', right } = props;
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.sideContent}>
          <div className={styles.button}>{left}</div>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.right}>
        <div className={styles.sideContent}>
          <div className={styles.button}>{right}</div>
        </div>
      </div>
    </div>
  );
};

const HeaderLayout = (props) => {
  const { children } = props;
  const [{ left, title, right }, setHeader] = useState({});
  return (
    <div className={styles.root}>
      {title && <HeaderViewer left={left} title={title} right={right} />}
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <HeaderContext.Provider value={{ setHeader }}>
        <div className={styles.content}>{children}</div>
      </HeaderContext.Provider>
    </div>
  );
};

export default HeaderLayout;

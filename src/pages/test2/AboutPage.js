import React from 'react';
import { history } from 'umi';
import styles from './AboutPage.less';

const Test2Page = () => (
  <div className={styles.root}>
    <p className={styles.title}>This is Test2 ...</p>
    <a className={styles.link} onClick={() => history.go(-1)}>
      Go back
    </a>
    <a className={styles.link} onClick={() => (history.go(-2))}>
      To Home
    </a>
  </div>
);

export default Test2Page;

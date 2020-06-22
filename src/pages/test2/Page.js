import React from 'react';
import { history } from 'umi';
import Page from '@/components/Page';
import styles from './Page.less';

const Test2Page = () => (
  <Page name="test2">
    <div className={styles.root}>
      <p className={styles.title}>This is Test2 ...</p>
      <a className={styles.link} onClick={() => history.go(-1)}>
        Go back
      </a>
      <a className={styles.link} onClick={() => history.go(-3)}>
        To Home
      </a>
    </div>
  </Page>
);

export default Test2Page;

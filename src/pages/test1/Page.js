import React from 'react';
import { history, Link } from 'umi';
import Page from '@/components/Page';
import styles from './Page.less';

const Test1Page = () => (
  <Page name="test1">
    <div className={styles.root}>
      <p className={styles.title}>This is Test1 ...</p>
      <Link className={styles.link} to="/test2">
        Goto Test2
      </Link>
      <a className={styles.link} onClick={() => history.go(-1)}>
        Go back
      </a>
    </div>
  </Page>
);

export default Test1Page;

import Page from '@/components/Page';
import { Button, Modal } from 'antd-mobile';
import React, { useState } from 'react';
import { connect, history, Link, Persist } from 'umi';
import styles from './AboutPage.less';

const About = () => {
  const [sub, setSub] = useState(false);
  return (
    <Page name="about">
      <Persist
        onShow={() =>
          history.block(
            () =>
              new Promise((resolve) => {
                Modal.alert('Warn', 'Do you want to leave???', [{ text: 'Cancel' }, { text: 'Ok', onPress: resolve }]);
              }),
          )
        }
        onHide={() => console.log('hide')}
      />
      <div className={styles.root}>
        <p className={styles.title}>This is About ...</p>
        <Link className={styles.link} to="/test1">
          Goto Test1
        </Link>
        <a className={styles.link} onClick={() => history.go(-1)}>
          Go back.
        </a>
        <Button onClick={() => setSub(!sub)}>toggle sub</Button>
      </div>
    </Page>
  );
};

export default connect()(About);

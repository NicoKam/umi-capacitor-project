import Page from '@/components/Page';
import Header from '@/layouts/Header';
import { SettingOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { history, Link, Persist } from 'umi';
import { Button } from 'antd-mobile';
import styles from './AboutPage.less';

const About = () => {
  const [sub, setSub] = useState(false);
  return (
    <Page name="about">
      <Header title="AboutPage" right={<SettingOutlined />} />
      <Persist />
      <div className={styles.root}>
        <p className={styles.title}>This is About ...</p>
        <Link className={styles.link} to="/test1">
          Goto Test1
        </Link>
        <a className={styles.link} onClick={() => history.go(-1)}>
          Go back.
        </a>
        <Button onClick={() => setSub(!sub)}>toggle sub</Button>
        {sub && <Header title="subTitle" />}
      </div>
    </Page>
  );
};

export default About;

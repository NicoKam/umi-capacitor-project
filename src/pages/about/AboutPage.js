import React from 'react';
import { history, Link } from 'umi';
import styles from './AboutPage.less';

const About = () => (
  <div className={styles.root}>
    <p className={styles.title}>This is About ...</p>
    <Link className={styles.link} to="/test1">
      Goto Test1
    </Link>
    <a className={styles.link} onClick={() => history.go(-1)}>
      Go back.
    </a>
  </div>
);

export default About;

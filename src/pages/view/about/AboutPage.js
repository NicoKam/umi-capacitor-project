import React from 'react';
import { Link } from 'umi';
import styles from './AboutPage.less';

const About = () => (
  <div className={styles.root}>
    <p className={styles.title}>This is About ...</p>
    <Link className={styles.link} to="/view/home">
      Back to home page.
    </Link>
  </div>
);

export default About;

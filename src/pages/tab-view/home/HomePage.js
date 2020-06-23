import Page from '@/components/Page';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Link } from 'umi';
import styles from './HomePage.less';

@connect(stores => ({ homeData: stores.home }))
class HomePage extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'home/fetch' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'home/clear' });
  }

  render() {
    const { homeData } = this.props;
    const { title } = homeData;
    return (
      <Page name="home">
        <div className={styles.root}>
          <p className={styles.title}>{`Hello ${title} !`}</p>
          <Link className={styles.link} to="/about">
            Go to about page.
          </Link>
        </div>
      </Page>
    );
  }
}

export default HomePage;

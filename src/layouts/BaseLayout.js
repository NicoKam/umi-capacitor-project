/**
 * author: liu.yang
 * date: 2018-08-22 07:53:50
 */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import TabLayout from './TabLayout';
import styles from './BaseLayout.less';

class BaseLayout extends Component {
  renderChildren = () => {
    const { location, children } = this.props;
    const { pathname } = location;
    if (pathname === '/' || pathname.indexOf('/about') >= 0) {
      return children;
    }
    return <TabLayout {...this.props} />;
  };

  render() {
    const { location } = this.props;
    const { state } = location;

    let t = '移动项目';
    if (state && state.title) {
      t = state.title;
    }
    return (
      <div className={styles.root}>
        <Helmet>
          <title>{t}</title>
        </Helmet>
        {this.renderChildren()}
      </div>
    );
  }
}

export default BaseLayout;

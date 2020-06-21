/**
 * author: liu.yang
 * date: 2018-08-22 07:53:50
 */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styles from './BaseLayout.less';

class BaseLayout extends Component {
  renderChildren = () => {
    const { children } = this.props;
    return children;
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

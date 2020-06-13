/**
 * author: liu.yang
 * date: 2018-08-22 07:53:50
 */
import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';

// 基础容器，便于以后扩展需求
class TabLayout extends Component {
  localTrimPathName = (pathname) => {
    const ojb = {
      hidden: true,
    };
    if (pathname.indexOf('/view/home') >= 0) {
      ojb.selected = 'home';
      if (pathname === '/view/home') {
        ojb.hidden = false;
      }
    } else if (pathname.indexOf('/view/list') >= 0) {
      ojb.selected = 'list';
      if (pathname === '/view/list') {
        ojb.hidden = false;
      }
    } else {
      ojb.selected = 'all';
      ojb.hidden = false;
    }
    return ojb;
  };

  localOnPress = (path) => {
    const { history } = this.props;
    history.replace(path);
  };

  render() {
    const { location, children } = this.props;
    const { pathname } = location;

    const option = this.localTrimPathName(pathname);
    return (
      <TabBar unselectedTintColor="#a4a9b0" tintColor="#108ee9" barTintColor="white" hidden={option.hidden}>
        <TabBar.Item
          title="首页"
          key="home"
          className={option.selected === 'home' ? 'abc' : 'dev'}
          icon={<HomeOutlined />}
          selectedIcon={<HomeOutlined />}
          selected={option.selected === 'home'}
          onPress={() => this.localOnPress('/view/home')}
        >
          {option.selected === 'home' ? children : null}
        </TabBar.Item>
        <TabBar.Item
          title="列表"
          key="list"
          icon={<InfoCircleOutlined />}
          selectedIcon={<InfoCircleOutlined />}
          selected={option.selected === 'list'}
          onPress={() => this.localOnPress('/view/list')}
        >
          {option.selected === 'list' ? children : null}
        </TabBar.Item>
      </TabBar>
    );
  }
}

export default TabLayout;

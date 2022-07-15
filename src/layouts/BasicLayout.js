import React from 'react';
import { connect, router, routerRedux } from 'dva';
import { Layout } from 'antd';
import NavBar from 'components/NavBar';
import { LeftSideBar, RightSideBar } from 'components/SideBar';
import TopBar from 'components/TopBar';
import SkinToolbox from 'components/SkinToolbox';
import pathToRegexp from 'path-to-regexp';
import { enquireIsMobile } from '@/utils/enquireScreen';
import TabsLayout from './TabsLayout';
import $$ from 'cmn-utils';
import cx from 'classnames';
import isEqual from 'react-fast-compare';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import 'assets/styles/transition.less';
import './styles/basic.less';
const { Switch } = router;
const { Content, Header } = Layout;

/**
 * 基本部局
 * 可设置多种皮肤 theme: [light, grey, primary, info, warning, danger, alert, system, success, dark]
 * 可设置多种布局 [header(固定头), sidebar(固定边栏), breadcrumb(固定面包蟹), tabLayout(标签布局)]
 * @author weiq
 */
@connect(({ global }) => ({ global }))
export default class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    const user = $$.getStore('user', []);
    const theme = $$.getStore('theme', {
      leftSide: 'darkgrey', // 左边
      navbar: 'light' // 顶部
    });
    if (!theme.layout) {
      theme.layout = [
        'fixedHeader',
        'fixedSidebar',
        'fixedBreadcrumbs'
        // 'hidedBreadcrumbs',
        // 'tabLayout',
      ];
    }
    this.state = {
      collapsedLeftSide: false, // 左边栏开关控制
      leftCollapsedWidth: 60, // 左边栏宽度
      expandTopBar: false, // 头部多功能区开合
      showSidebarHeader: false, // 左边栏头部开关
      collapsedRightSide: true, // 右边栏开关
      theme, // 皮肤设置
      user,
      currentMenu: {},
      isMobile: false
    };

    props.dispatch({
      type: 'global/getMenu'
    });
  }

  componentDidMount() {
    this.checkLoginState();

    this.unregisterEnquire = enquireIsMobile(ismobile => {
      const { isMobile, theme } = this.state;
      if (isMobile !== ismobile) {
        // 如查是移动端则不固定侧边栏
        if (ismobile && $$.isArray(theme.layout)) {
          theme.layout = theme.layout.filter(item => item !== 'fixedSidebar');
        }
        this.setState({
          isMobile: ismobile
        });
      }
    });
  }

  // 检查有户是否登录
  checkLoginState() {
    if (!$$.getStore('user') || !$$.getStore('token')) {
      this.props.dispatch(routerRedux.replace('/sign/login'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(this.props.location.pathname, prevProps.location.pathname) ||
      !isEqual(this.props.global.flatMenu, prevProps.global.flatMenu)
    ) {
      this.setState({
        currentMenu: this.getCurrentMenu(this.props) || {}
      });
    }
  }

  componentWillUnmount() {
    // 清理监听
    this.unregisterEnquire();
  }

  getCurrentMenu(props) {
    const {
      location: { pathname },
      global
    } = props || this.props;
    const menu = this.getMeunMatchKeys(global.flatMenu, pathname)[0];
    return menu;
  }

  getMeunMatchKeys = (flatMenu, path) => {
    return flatMenu.filter(item => {
      return pathToRegexp(item.path).test(path);
    });
  };

  /**
   * 顶部左侧菜单图标收缩控制
   */
  onCollapseLeftSide = _ => {
    const collapsedLeftSide =
      this.state.leftCollapsedWidth === 0
        ? true
        : !this.state.collapsedLeftSide;
    const collapsedRightSide =
      this.state.collapsedRightSide || !collapsedLeftSide;

    this.setState({
      collapsedLeftSide,
      collapsedRightSide,
      leftCollapsedWidth: 60
    });
  };

  /**
   * 完全关闭左边栏，即宽为0
   */
  onCollapseLeftSideAll = _ => {
    this.setState({
      collapsedLeftSide: true,
      leftCollapsedWidth: 0
    });
  };

  /**
   * 展开面包屑所在条中的多功能区
   */
  onExpandTopBar = _ => {
    this.setState({
      expandTopBar: true
    });
  };

  /**
   * 与上面相反
   */
  onCollapseTopBar = _ => {
    this.setState({
      expandTopBar: false
    });
  };

  /**
   * 切换左边栏中头部的开合
   */
  toggleSidebarHeader = _ => {
    this.setState({
      showSidebarHeader: !this.state.showSidebarHeader
    });
  };

  /**
   * 切换右边栏
   */
  toggleRightSide = _ => {
    const { collapsedLeftSide, collapsedRightSide } = this.state;
    this.setState({
      collapsedLeftSide: collapsedRightSide ? true : collapsedLeftSide,
      collapsedRightSide: !collapsedRightSide
    });
  };

  onChangeTheme = theme => {
    $$.setStore('theme', theme);
    this.setState({
      theme
    });
  };

  render() {
    const {
      collapsedLeftSide,
      leftCollapsedWidth,
      expandTopBar,
      showSidebarHeader,
      collapsedRightSide,
      theme,
      user,
      currentMenu,
      isMobile
    } = this.state;
    const { routerData, location, global } = this.props;
    const { menu, flatMenu } = global;
    const { childRoutes } = routerData;
    const classnames = cx('basic-layout', 'full-layout', {
      fixed: theme.layout && theme.layout.indexOf('fixedSidebar') !== -1,
      'fixed-header':
        theme.layout && theme.layout.indexOf('fixedHeader') !== -1,
      'fixed-breadcrumbs':
        theme.layout && theme.layout.indexOf('fixedBreadcrumbs') !== -1,
      'hided-breadcrumbs':
        theme.layout && theme.layout.indexOf('hidedBreadcrumbs') !== -1
    });

    return (
      <Layout className={classnames}>
        <Header>
          <NavBar
            collapsed={collapsedLeftSide}
            onCollapseLeftSide={this.onCollapseLeftSide}
            onExpandTopBar={this.onExpandTopBar}
            toggleSidebarHeader={this.toggleSidebarHeader}
            theme={theme.navbar}
            user={user}
            isMobile={isMobile}
          />
        </Header>
        <Layout>
          <LeftSideBar
            collapsed={collapsedLeftSide}
            leftCollapsedWidth={leftCollapsedWidth}
            showHeader={showSidebarHeader}
            onCollapse={this.onCollapseLeftSide}
            onCollapseAll={this.onCollapseLeftSideAll}
            location={location}
            theme={theme.leftSide}
            flatMenu={flatMenu}
            currentMenu={currentMenu}
            menu={menu}
            user={user}
            isMobile={isMobile}
          />
          <Content>
            {theme.layout.indexOf('tabLayout') >= 0 ? (
              <TabsLayout childRoutes={childRoutes} location={location} />
            ) : (
              <Layout className="full-layout">
                <Header>
                  <TopBar
                    expand={expandTopBar}
                    toggleRightSide={this.toggleRightSide}
                    collapsedRightSide={collapsedRightSide}
                    onCollapse={this.onCollapseTopBar}
                    currentMenu={currentMenu}
                    location={location}
                    theme={theme}
                  />
                </Header>
                <Content style={{ overflow: 'hidden' }}>
                  <SwitchTransition>
                    <CSSTransition
                      key={location.pathname}
                      classNames="fade"
                      timeout={500}
                    >
                      <Layout className="full-layout">
                        <Content className="router-page">
                          <Switch location={location}>{childRoutes}</Switch>
                        </Content>
                      </Layout>
                    </CSSTransition>
                  </SwitchTransition>
                </Content>
              </Layout>
            )}
          </Content>
          <RightSideBar
            collapsed={collapsedRightSide}
            isMobile={isMobile}
            onCollapse={this.toggleRightSide}
          />
        </Layout>
        <SkinToolbox onChangeTheme={this.onChangeTheme} theme={theme} />
      </Layout>
    );
  }
}

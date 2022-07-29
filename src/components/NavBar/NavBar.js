import React, { PureComponent } from 'react';
import Icon from '../Icon';
import { Popover, Badge, Avatar } from 'antd';
import {connect, router} from 'dva';
import cx from 'classnames';
import './style/index.less';
import logoImg from 'assets/images/logo.png';
import {logout} from '../../service/login';
const { Link } = router;

/**
 * 其本本局头部区域
 */
class NavBar extends PureComponent {
  state = {
    openSearchBox: false,
    popoverVisible: false
  };

  static defaultProps = {
    fixed: true,
    theme: '' //'bg-dark',
  };

  handlerLoginOut = () => {
    logout()
  }

  popoverHide = () => {
    this.setState({popoverVisible: false});
  };

  handleVisibleChange = (newVisible: boolean) => {
    this.setState({popoverVisible: newVisible});
  };

  render() {
    const {
      fixed,
      theme,
      onCollapseLeftSide,
      collapsed,
      onExpandTopBar,
      toggleSidebarHeader,
      user,
      isMobile
    } = this.props;

    const classnames = cx('navbar', {
      'navbar-fixed-top': !!fixed,
      'navbar-sm': isMobile ? true : collapsed,
      ['bg-' + theme]: !!theme
    });

    return (
      <header className={classnames}>
        <div className="navbar-branding">
          <Link className="navbar-brand" to="/">
            <img src={logoImg} alt="logo" />
            <b>LANIF</b>
            Admin
          </Link>
          <span className="toggle_sidemenu_l" onClick={onCollapseLeftSide}>
            <Icon type="lines" />
          </span>
        </div>
        <ul className="nav navbar-nav navbar-left clearfix">
          {collapsed || isMobile ? null : (
            <li>
              <a className="sidebar-menu-toggle" onClick={toggleSidebarHeader}>
                <Icon type="ruby" />
              </a>
            </li>
          )}
          <li>
            <a onClick={onExpandTopBar}>
              <Icon type="wand" />
            </a>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right clearfix">
          <li className="dropdown">
            <Popover
              placement="bottomRight"
              visible={this.state.popoverVisible}
              overlayClassName={cx('navbar-popup', { [theme]: !!theme })}
              onVisibleChange={this.handleVisibleChange}
              content={
                <ul className="dropdown-menu list-group dropdown-persist">
                  <li className="list-group-item">
                    <a className="animated animated-short fadeIn">
                      <Icon type="mail" /> 信息
                      <Badge count={5} className="label" />
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="animated animated-short fadeIn">
                      <Icon type="users" /> 好友
                      <Badge count={6} className="label" />
                    </a>
                  </li>
                  <li className="list-group-item">
                    <Link to={"/user/center"} className="animated animated-short fadeIn" onClick={this.popoverHide}>
                        <Icon type="gear" /> 个人中心
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <a className="animated animated-short fadeIn">
                      <Icon type="ring" /> 通知
                    </a>
                  </li>
                  <li className="list-group-item dropdown-footer" onClick={this.handlerLoginOut}>
                    <a className="animated animated-short fadeIn">
                      <Icon type="poweroff"/> 退出
                    </a>
                  </li>
                </ul>
              }
              trigger="click"
            >
              <a className="dropdown-toggle">
                  <Avatar src={require('assets/images/avatar.jpg')} />
                  <span className="username">{user.username}</span>
              </a>
            </Popover>
          </li>
        </ul>
      </header>
    );
  }
}

export default NavBar;

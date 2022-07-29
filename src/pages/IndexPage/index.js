import React, { Component } from 'react';
import { connect, router } from 'dva';
import { Input, Button, Select, Row, Col, Popover, Progress, Layout, Form } from 'antd';
import './index.less';
import '@/pages/Login/index.less';
import logoImg from 'assets/images/logo1.png';
import Success from './Success';
import {getCurrentUser} from "@/service/user";
const { Link } = router;
const { Content } = Layout;

const passwordStatusMap = {
  ok: <div style={{ color: '#52c41a' }}>强度：强</div>,
  pass: <div style={{ color: '#faad14' }}>强度：中</div>,
  poor: <div style={{ color: '#f5222d' }}>强度：太短</div>
};

export default class Index extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    registerSuccess: false
  };

  componentWillUnmount() {
  }

  getPasswordStatus = () => {
    if (!this.form) {
      return;
    }
    const value = this.form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = values => {
    getCurrentUser().then(rsp=> console.log(rsp))
  };

  checkConfirm = (rule, value) => {
    if (value && value !== this.form.getFieldValue('password')) {
      this.setState({ confirmDirty: value });
      return Promise.reject('两次输入的密码不匹配!');
    } else {
      return Promise.resolve();
    }
  };

  checkPassword = (rule, value) => {
    if (!value) {
      this.setState({
        visible: !!value
      });
      return Promise.reject('请输入密码！');
    } else {
      this.setState({
        help: ''
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 6) {
        return Promise.reject('');
      } else {
        if (value && confirmDirty) {
          this.form.validateFields(['confirm'], { force: true });
        }
        return Promise.resolve();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value
    });
  };

  render() {
    const { submitting } = this.props;
    const { count, prefix, help, visible, registerSuccess } = this.state;

    if (registerSuccess) {
      return <Success />;
    }
    return (
      <Layout className="full-layout register-page login-page">
        <Content>
              <Button
                size="large"
                loading={submitting}
                className="register-form-button"
                type="primary"
                onClick={this.handleSubmit}
                htmlType="submit"
              ></Button>
        </Content>
      </Layout>
    );
  }
}

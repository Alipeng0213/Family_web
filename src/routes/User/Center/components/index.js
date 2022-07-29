import React, { Component } from 'react';
import {connect, router, routerRedux} from 'dva';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Button, Input, Checkbox, Spin, Form } from 'antd';
import logoImg from 'assets/images/logo1.png';
import './index.less';
import {login} from "../../../service/login";

const { Link } = router;
const { Content } = Layout;
const FormItem = Form.Item;

@connect()
export default class Login extends Component {

  state = {
      loading: true
  }


  render() {
    return (
      <Layout className="full-layout login-page">
        <Content>
          <Spin tip="执行中..." spinning={this.state.loading}>

          </Spin>
        </Content>
      </Layout>
    );
  }
}

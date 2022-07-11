import React, { Component } from 'react';
import {connect, router, routerRedux} from 'dva';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Button, Input, Checkbox, Spin, Form } from 'antd';
import logoImg from 'assets/images/logo1.png';
import './index.less';
import {login} from "../service";

const { Link } = router;
const { Content } = Layout;
const FormItem = Form.Item;

@connect()
export default class Login extends Component {

  state = {
      loading: false
  }

  handleSubmit = values => {

    const { dispatch } = this.props;
    const _that = this;
    _that.setState({loading: true})
    login(values).then(rsp=> {
      console.log(rsp)
      dispatch(routerRedux.replace("/"))
    }).catch(error=> console.log(error))

  };

  render() {

    return (
      <Layout className="full-layout login-page">
        <Content>
          <Spin tip="登录中..." spinning={this.state.loading}>
            <Form onFinish={this.handleSubmit} className="login-form" initialValues={{ userName: 'admin', password: 'admin', remember: true }}>
              <div className="user-img">
                <img src={logoImg} alt="logo" />
                <b>LANIF</b>
                <span>Admin</span>
              </div>
              <FormItem name="userName" rules={[{ required: true, message: '请输入您的用户名，示例admin' }]}>
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </FormItem>
              <FormItem name="password" rules={[{ required: true, message: '请输入您的密码，示例admin' }]}>
                <Input
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码"
                />
              </FormItem>
              <FormItem name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </FormItem>
              <Link className="login-form-forgot" to="#">
                忘记密码
                </Link>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
                </Button>
              <div className="new-user">
                新用户？<Link to="/sign/register">现在注册</Link>
              </div>
            </Form>
          </Spin>
        </Content>
      </Layout>
    );
  }
}

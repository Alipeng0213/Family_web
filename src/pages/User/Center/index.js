import React from 'react';
import BaseComponent from 'components/BaseComponent'
import {connect, router, routerRedux} from 'dva';
import {Layout, Card, Button, Input, Checkbox, Spin, Form, Avatar} from 'antd';
const Meta = Card.Meta;

const $$ = require('cmn-utils')
const UserAction = require("@/service/user")
const Content = Layout.Content;

export default class UserCenter extends BaseComponent {

    state = {
        loading: false,
        user: {}
    }

    componentDidMount() {
        let _that = this;
        UserAction.getCurrentUser().then(user=> {
            console.log(user)
            _that.setState({user: user})
            $$.store.setStore("user", user)
        });
    }

    render() {
        const {user} = this.state;
        return (
            <Layout className="user-center-page">
                <Content>
                    <Spin tip="登录中..." spinning={this.state.loading}>
                        <Card
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                        >
                            <Meta title={user.nickname + "(" + user.username + ")"} description={user.email} />
                        </Card>
                    </Spin>
                </Content>
            </Layout>
        );
    }
}

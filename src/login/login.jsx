import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker, Form, Icon,Checkbox } from "antd";
import Mock from "mockjs";
import "./login.css";
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入账户名' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入账户密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="账户密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                     </Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
@observer
class Login extends React.Component {
    //@observable tableHeight = 0;
    state = {
    };

    componentDidMount() {
    }
    render() {
        return (
            <div className="login" ref="login">
                <div className="top">
                    <div className="avatar">
                        <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1545224240&di=430a80584b56d9db0c393e52aa3a4a80&src=http://pic43.photophoto.cn/20170506/0470102348231008_b.jpg"/>
                    </div>
                    <div className="title">
                        ***管理平台
                    </div>
                </div>
                <div className="content">
                    <WrappedNormalLoginForm/>
                </div>
            </div>
        );
    }
}

export default Login;
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Redirect } from "react-router";
import { Button, Input, Table, DatePicker, Form, Icon, Checkbox,message} from "antd";
import Mock from "mockjs";
import tool from "../tools/tool.js";
import admin from "./admin.jpg"
let publicUrl = "http://93.179.103.52:5000";
publicUrl = "/api";
let loginUrl = publicUrl + "/userLogin";
import "./login.css";
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        let userName = values.userName;
        let passWord = values.password;
        let rel = await tool.requestAjaxSync(loginUrl, "post", {
          username: userName,
          password: passWord
        });
        rel = rel.data;
        if (rel.state == 1) {
          message.success("登录成功");
          tool.setCookie("userName", userName, "d1");
          this.props.changeLoginState(true);
        } else {
          this.props.changeLoginState(false);
          message.error(`登录失败,用户名或密码错误，请重新输入`);
          return;
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "请输入账户名" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="账户名"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入账户密码" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="账户密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
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
  @observable loginState = false;

  componentDidMount() {}
  render() {
    if (this.loginState) {
      return <Redirect to="/home/useCard" />;
    }
    return (
      <div className="login" ref="login">
        <div className="top">
          <div className="avatar">
            <img src={admin} />
          </div>
          <div className="title">浪漫斯基管理平台</div>
        </div>
        <div className="content">
          <WrappedNormalLoginForm
            changeLoginState={state => {
              this.loginState = state;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Login;

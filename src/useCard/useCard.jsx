import React from "react";
import { message, Form, Button, Input, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import tool from "../tools/tool.js";

const FormItem = Form.Item;

@inject("myGlobal")
@observer
class MyForm extends React.Component {
  inputNode = {};

  componentDidMount() {
    if (this.inputNode) {
      this.inputNode.select();
    }
  }

  submitForm = () => {
    const { form } = this.props;
    form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      let data = await tool.requestAjaxSync("/sp/coupon/consume", "get", {
        card_code: values.card_code
      });
      data = data.data;
      if (data.code == "0000") {
        message.success("卡券使用成功!");
      } else {
        message.error("卡券使用失败!");
      }
      if (this.inputNode) {
        this.inputNode.select();
      }
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    if (this.inputNode) {
      this.inputNode.select();
    }
  };

  render() {
    let { form } = this.props;
    let formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    return (
      <Row
        type="flex"
        style={{ width: "100%", height: "100%" }}
        align="middle"
        justify="center"
      >
        <Form layout="horizontal" style={{ width: "40%" }}>
          <FormItem label="卡券码" {...formLayout}>
            {form.getFieldDecorator("card_code", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: ""
            })(
              <Input
                ref={e => (this.inputNode = e)}
                autoComplete="off"
                placeholder="输入卡券码"
                onPressEnter={this.submitForm}
              />
            )}
          </FormItem>
          <FormItem label=" " colon={false} {...formLayout}>
            <div style={{ float: "right" }}>
              <Button style={{ marginRight: 10 }} onClick={this.resetForm}>
                重置
              </Button>
              <Button type="primary" onClick={this.submitForm}>
                使用
              </Button>
            </div>
          </FormItem>
        </Form>
      </Row>
    );
  }
}

// 用来创建表单验证的必要逻辑
MyForm = Form.create()(MyForm);

@observer
class UseCard extends React.Component {
  render() {
    return <MyForm />;
  }
}

export default UseCard;

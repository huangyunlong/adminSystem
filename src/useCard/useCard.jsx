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
      let card_code = values.card_code;
      card_code = card_code.replace(/[ ]/gi, "");
      let data = await tool.requestAjaxSync("/sp/coupon/consume", "get", {
        card_code: card_code
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
      labelCol: { span: 1 },
      wrapperCol: { span: 23 }
    };
    return (
      <Row
        type="flex"
        style={{ width: "100%", height: "100%" }}
        align="middle"
        justify="center"
      >
        <Form layout="horizontal" style={{ width: "50%" }}>
          <FormItem label="" {...formLayout}>
            {form.getFieldDecorator("card_code", {
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    value = value.replace(/[ ]/gi, "");
                    if (value.length != 12 || !/^[0-9]{12,12}$/.test(value)) {
                      callback("请输入12位由数字组成的卡券码");
                      return;
                    }
                    callback();
                  }
                }
              ],
              getValueFromEvent: e => {
                let value = e.target.value;
                let step = 1;
                for (var i = 0; i < value.length; i++, step++) {
                  if (step == 4) {
                    if (value[i + 1] == null) {
                      let str = value.split("");
                      str.push(" ");
                      value = str.join("");
                      i++;
                    }
                    step = -1;
                  }
                }
                return value;
              },
              initialValue: ""
            })(
              <Input
                ref={e => (this.inputNode = e)}
                autoComplete="off"
                placeholder="输入卡券码"
                onPressEnter={this.submitForm}
                style={{ height: 50 }}
              />
            )}
          </FormItem>
          <FormItem label=" " colon={false} {...formLayout}>
            <div style={{ marginLeft: "30%" }}>
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

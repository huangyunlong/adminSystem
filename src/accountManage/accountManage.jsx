import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./accountManage.css";
import MyTable from "../components/myTable/myTable.jsx";
import { Button, Input } from "antd";

@observer
class AccountManage extends React.Component {
  /**
   * 表头设计
   */
  defineColumn() {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "userName", // dataIndex 和 key 需要一致
        key: "userName",
        width: 150,
        align: "center", // 列文字排版
        editWindow: {
          // 编辑窗口中应用什么组件,input:普通文字输入框,img:多图片上传（此时需要传递数组进去）,select:下拉列表
          type: "custom",
          customRender: (form, row, column) => {
            // 自定义渲染，如果不需要验证，也可以直接返回组件，但是需要自行改变row里面此字段的值
            // row 是行信息,form是表单对象，column是列信息
            return form.getFieldDecorator(column.key, {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: row[column.key]
            })(<Input placeholder="输入内容" />);
          },
          moreSet: {} // moreSet里的所有属性都会加到对应的组件中
        }
      },
      {
        title: "是否顶部显示",
        dataIndex: "topping",
        key: "topping",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = text == 0 ? "否" : "是";
          return <span>{relText}</span>;
        },
        editWindow: {
          type: "select",
          optionList: [
            {
              title: "是",
              value: "1"
            },
            {
              title: "否",
              value: "0"
            }
          ]
        }
      }
    ];
  }
  componentWillMount() {
    this.defineColumn();
  }
  render() {
    return (
      <div className="accountManage" ref="accountManage">
        <h2>账户权限</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="account" mode="edit" />
        </div>
      </div>
    );
  }
}

export default AccountManage;

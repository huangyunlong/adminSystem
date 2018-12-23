import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./themeManage.css";
import MyTable from "../components/myTable/myTable.jsx";
import { Button, Input } from "antd";

@observer
class ThemeManage extends React.Component {
  /**
   * 表头设计
   */
  defineColumn() {
    this.columns = [
      {
        title: "主题名称",
        dataIndex: "themeName", // dataIndex 和 key 需要一致
        key: "themeName",
        filterType: "string", // 表示过滤字符串,string,date
        width: 150,
        sorter: true, // 是否可排序
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
            // return (
            //   <Input
            //     placeholder="输入内容"
            //     defaultValue={row[column.key]}
            //     onChange={e => {
            //       row[column.key] = e.target.value;
            //     }}
            //   />
            // );
          },
          moreSet: {} // moreSet里的所有属性都会加到对应的组件中
        }
      },
      {
        title: "缩略图",
        dataIndex: "imgs",
        key: "imgs",
        align: "center",
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
          <img width="100%" src="${_.get(row, "imgs[0].url")}" />
        </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="smallImg"
              src={_.get(row, "imgs[0].url")}
            />
          );
        },
        editWindow: {
          type: "imgs"
        }
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = "";
          switch (text) {
            case "inDisplay":
              relText = "显示中";
              break;
            case "lowerShelf":
              relText = "已下架";
              break;
          }
          return (
            <span style={{ color: text == "inDisplay" ? "#237804" : "" }}>
              {relText}
            </span>
          );
        },
        editWindow: {
          type: "select",
          optionList: [
            {
              title: "显示中",
              value: "inDisplay"
            },
            {
              title: "已下架",
              value: "lowerShelf"
            }
          ],
          moreSet: {
            showSearch: false, // 是否需要搜索框，这个属性是antd中的，可自行配置
            filterOption: (input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
          }
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
      <div className="themeManage" ref="themeManage">
        <h2>主题管理</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="theme" mode="edit" tableWidth="100%"/>
        </div>
      </div>
    );
  }
}

export default ThemeManage;

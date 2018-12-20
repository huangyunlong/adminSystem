import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./themeManage.css";
import MyTable from "../components/myTable/myTable.jsx";

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
          // 编辑窗口中应用什么组件,input:普通文字输入框,img:图片上传,select:下拉列表
          type: "input",
          moreSet: {} // moreSet里的所有属性都会加到对应的组件中
        }
      },
      {
        title: "缩略图",
        dataIndex: "img",
        key: "img",
        align: "center",
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
          <img width="100%" src="${row.img}" />
        </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="smallImg"
              src={row.img}
            />
          );
        },
        editWindow: {
          type: "img"
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
          <MyTable columns={this.columns} tableName="theme" mode="edit" />
        </div>
      </div>
    );
  }
}

export default ThemeManage;

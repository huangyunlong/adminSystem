import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import "./userManage.css";

@observer
class userManage extends React.Component {
  // 表头设计
  defineColumn(){
    this.columns = [
      {
        title: "用户头像",
        dataIndex: "userImage",
        key: "userImage",
        align: "center",
        width: 150,
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
      <img width="100%" src="${row.userImage}" />
    </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="userImage"
              src={row.userImage}
            />
          );
        }
      },
      {
        title: "昵称",
        dataIndex: "nickName",
        key: "nickName",
        width: 100,
        align: "center"
      },
      {
        title: "用户名",
        dataIndex: "userName",
        key: "userName",        
        width: 100,
        align: "center"
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",        
        align: "center",
        width: 150,
        align: "center"
      },
      {
        title: "手机号",
        dataIndex: "phoneNumber",
        key: "phoneNumber",        
        width: 150,
        align: "center"
      },
      {
        title: "注册时间",
        dataIndex: "registeredTime",
        key: "registeredTime",        
        width: 150,
        align: "center"
      }
    ]
  }
  componentWillMount() {
    this.defineColumn();
  }
  render() {
    return (
      <div className="userManage" ref="userManage">
        <h2>用户管理</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="userManage" mode="null" />
        </div>
      </div>
    );
  }
}

export default userManage;

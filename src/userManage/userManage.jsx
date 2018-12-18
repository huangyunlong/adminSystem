import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table } from "antd";
import Mock from 'mockjs';
import "./userManage.css";

@observer
class userManage extends React.Component {
  @observable tableHeight = 0;// 表格高度
    state = {
      columns: [{
        title: '用户头像',
        dataIndex: 'userImage',
        align: "center",
        width:150,
        render: (text, row, index) => {
          return <a href={row.userImage} target='__black' >
            <img src={row.userImage} className='smallImag' />
          </a >
        }
      }, {
        title: '昵称',
        dataIndex: 'nickName',
        width: 100,
        align: "center"
      }, {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
        align: "center"
      },{
        title: '性别',
        dataIndex: 'sex',
        align: "center",
        width: 150,
        align: "center"
      },{
        title: '手机号',
        dataIndex: 'phoneNumber',
        width: 150,
        align: "center"
      },{
        title: '注册时间',
        dataIndex: 'registeredTime',
        width: 150,
        align: "center"
      }],
      data: Mock.mock({
        'list|10-100': [
          {
            'key|+1': 0,
            'userImage|1': ['https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1545051324&di=e87b3dd7c9626ce1781d584b7d800459&src=http://imgsrc.baidu.com/imgad/pic/item/aa64034f78f0f736433a793c0155b319eac413c2.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545061413945&di=da8a8f2416d97003f5fa67fbea22023e&imgtype=0&src=http%3A%2F%2Fdownhdlogo.yy.com%2Fhdlogo%2F640640%2F630%2F630%2F71%2F1000710067%2Fu1000710067JGb2l8C.png'],
            'userName': '@cname',
            'nickName': '@cname',
            'sex|1': ['男', '女'],
            'phoneNumber': '@integer(10000)',
            'registeredTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
          }
        ]
      }).list,
      rowSelecttion: {
        onchange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRows)
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User',
          name: record.name
        })
      }
    }
  componentDidMount() {
    this.tableHeight = this.refs.userManage.offsetHeight - 238 - 40 - 50;
  }
  render() {
    return (
      <div className="userManage" ref="userManage">
        <div className="userManage_title">
          <div className="titles">用户管理</div>
          <div className="information">用户信息</div>
        </div>
        <div className="userManage_search">
          <div className="searchConditions">搜索条件</div>
          <div className="searchConditionsInput">
            <div className="search_input">
                <Input placeholder="输入用户名查找" />
            </div>
            <div className="btn">
              <Button type="primary">确定</Button>
            </div>
            
          </div>
        </div>
        <div className="userManage_tables">
          <div className="userManageTop">
            <span className='userList'>用户列表</span>
            <span className='export'>导出excel</span>
          </div>
          <div className="userManage_tableContent">
            <Table  
              className='table' 
              ref='tabless'
              scroll={{ y: this.tableHeight }}
              bordered
              columns={this.state.columns} 
              dataSource={this.state.data} 
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: total => <span>共 {total} 条</span>
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default userManage;

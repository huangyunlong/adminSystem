import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import "./cardManage.css";

@observer
class CardManage extends React.Component {
  // 表头设计
  defineColumn(){
    this.columns = [
      {
        title: "订单编号",
        dataIndex: "orderNumber",
        width: 200,
        align: "center",
        filterType: "string"
      },
        {
        title: "卡券编号",
        dataIndex: "cardNumber",
        width: 150,
        align: "center"
      },
      {
        title: "描述",
        dataIndex: "cardDesc",
        align: "center",
        width: 150,
        align: "center"
      },
      {
        title: "合计价格",
        dataIndex: "allPrice",
        width: 150,
        align: "center"
      },
      {
        title: "使用时间",
        dataIndex: "useTime",
        width: 150,
        align: "center"
      },{
        title: '状态',
        dataIndex: "status",
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
      <div className="cardManage" ref="cardManage">
        <h2>卡券管理</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="cardManage" mode="null" />
        </div>
      </div>
    );
  }
}
export default CardManage;
    // data: Mock.mock({
    //   "list|10-100": [
    //     {
    //       "key|+1": 0,
    //       orderNumber: "@id(5)",
    //       cardNumber: "@id(5)",
    //       cardDesc: "@ctitle",
    //       allPrice: "@integer(200,1000)",
    //       useTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    //       "status|1": ['已付款','已使用']
    //     }
    //   ]
    // }).list
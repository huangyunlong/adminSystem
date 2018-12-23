import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import "./orderManage.css";
@observer
class OrderManage extends React.Component {
  // 表头设计
  defineColumn() {
    this.columns = [
      {
        title: "订单编号",
        dataIndex: "orderNumber",
        key: "orderNumber",
        width: "14%",
        align: "center",
        filterType: "string" // 表示过滤字符串,string,date
      },
      {
        title: "用户名",
        dataIndex: "userName",
        key: "userName",
        width: "10%",
        align: "center"
      },
      {
        title: "商品详情",
        dataIndex: "goodDetail",
        key: "goodDetail",
        align: "center",
        width: "14%",
        align: "center"
      },
      {
        title: "数量",
        dataIndex: "count",
        key: "count",
        width: "8%",
        align: "center"
      },
      {
        title: "合计价格",
        dataIndex: "allPrice",
        key: "allPrice",
        width: "10%",
        align: "center"
      },
      {
        title: "实付金额",
        dataIndex: "price",
        key: "price",
        width: "10%",
        align: "center"
      },
      {
        title: "付款时间",
        dataIndex: "paymentTime",
        key: "paymentTime",
        width: "14%",
        align: "center",
        filterType: "date" // 表示过滤字符串,string,date        
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: "11%",
        align: "center"
      }
    ];
  }
  componentWillMount() {
    this.defineColumn();
  }
  render() {
    return (
      <div className="orderManage" ref="orderManage">
        <h2>订单管理</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="orderManage" mode="null" />
        </div>
      </div>
    );
  }
}
export default OrderManage;

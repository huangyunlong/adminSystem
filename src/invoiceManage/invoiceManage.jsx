import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import "./invoiceManage.css";

@observer
class InvoiceManage extends React.Component {
  // 表头设计
  defineColumn() {
    this.columns = [
      {
        title: "发票类型",
        dataIndex: "invoiceType",
        key: "invoiceType",
        width: 100,
        align: "center"
      },
      {
        title: "订单号",
        dataIndex: "orderNumber",
        key: "orderNumber",
        align: "center",
        width: 150,
        align: "center",
        filterType: "date" // 表示过滤字符串,string,date                
      },
      {
        title: "抬头",
        dataIndex: "lookUp",
        key: "lookUp",
        width: 150,
        align: "center"
      },
      {
        title: "税号",
        dataIndex: "ein",
        key: "ein",
        width: 150,
        align: "center"
      },
      {
        title: "电话号码",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: 150,
        align: "center"
      },
      {
        title: "姓名",
        dataIndex: "userName",
        key: "userName",
        width: 150,
        align: "center",
        filterType: "string" // 表示过滤字符串,string,date                
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        width: 150,
        align: "center"
      }
    ];
  }
  componentWillMount() {
    this.defineColumn();
  }
  render() {
    return (
      <div className="invoiceManage" ref="invoiceManage">
        <h2>发票管理</h2>
        <div className="tablePanel">
          <MyTable
            columns={this.columns}
            tableName="invoiceManage"
            mode="null"
          />
        </div>
      </div>
    );
  }
}
export default InvoiceManage;

// columns: [
//   {
//     title: "编号",
//     dataIndex: "number",
//     width: 200,
//     align: "center",
//     render: (text, row, index) => {
//         return <span>{index+1}</span>
//       }
//   },
//     {
//     title: "发票类型",
//     dataIndex: "invoiceType",
//     width: 150,
//     align: "center"
//   },
//   {
//     title: "订单号",
//     dataIndex: "orderNumber",
//     align: "center",
//     width: 150,
//     align: "center"
//   },
//   {
//     title: "抬头",
//     dataIndex: "lookUp",
//     width: 150,
//     align: "center"
//   },
//   {
//     title: "税号",
//     dataIndex: "ein",
//     width: 150,
//     align: "center"
//   },
//   {
//     title: "电话号码",
//     dataIndex: "phoneNumber",
//     width: 150,
//     align: "center"
//   },
//   {
//     title: "姓名",
//     dataIndex: "userName",
//     width: 150,
//     align: "center"
//   },{
//     title: '邮箱',
//     dataIndex: "email",
//     width: 150,
//     align: "center"
//   }
// ],
// data: Mock.mock({
//   "list|10-100": [
//     {
//       "key|+1": 0,
//       'invoiceType|1': ["单位","个人"],
//       orderNumber: "@id(5)",
//       invoiceName: "@cname",
//       lookUp:'@cname',
//       ein:'@integer(1,100)',
//       phoneNumber: "@id",
//       email: "@email",
//       userName:'@cname'
//     }
//   ]
// }).list

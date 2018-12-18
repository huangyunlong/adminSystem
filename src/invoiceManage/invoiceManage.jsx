import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import "./invoiceManage.css";
@observer
class InvoiceManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  state = {
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: total => <span>共 {total} 条</span>,
      defaultCurrent:1,
      defaultPageSize:10      
    },
    columns: [
      {
        title: "编号",
        dataIndex: "number",
        width: 200,
        align: "center",
        render: (text, row, index) => {
            return <span>{index+1}</span>
          }
      },
        {
        title: "发票类型",
        dataIndex: "invoiceType",
        width: 150,
        align: "center"
      },
      {
        title: "订单号",
        dataIndex: "orderNumber",
        align: "center",
        width: 150,
        align: "center"
      },
      {
        title: "抬头",
        dataIndex: "lookUp",
        width: 150,
        align: "center"
      },
      {
        title: "税号",
        dataIndex: "ein",
        width: 150,
        align: "center"
      },
      {
        title: "电话号码",
        dataIndex: "phoneNumber",
        width: 150,
        align: "center"
      },
      {
        title: "姓名",
        dataIndex: "userName",
        width: 150,
        align: "center"
      },{
        title: '邮箱',
        dataIndex: "email",
        width: 150,
        align: "center"
      }
    ],
    data: Mock.mock({
      "list|10-100": [
        {
          "key|+1": 0,
          'invoiceType|1': ["单位","个人"],
          orderNumber: "@id(5)",
          invoiceName: "@cname",
          lookUp:'@cname',
          ein:'@integer(1,100)',
          phoneNumber: "@id",
          email: "@email",
          userName:'@cname'
        }
      ]
    }).list,
    rowSelecttion: {
      onchange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === "Disabled User",
        name: record.name
      })
    }
  };

  componentDidMount() {
    this.tableHeight = this.refs.invoiceManage.offsetHeight - 238 - 40 - 50;
  }
  onStartChange(value, dateString) {
    // console.log('Selected Time: ', value);
    console.log("Formatted Selected start Time: ", dateString);
  }
  onStartChange(value, dateString) {
    // console.log('Selected Time: ', value);
    console.log("Formatted Selected end Time: ", dateString);
  }
  onPageChange(pageNumber) {
    console.log(`页码：${pageNumber.current},每页显示的数据条数：${pageNumber.pageSize}`);
  }
  exportDefaultExcel() {}
  render() {
    return (
      <div className="invoiceManage" ref="invoiceManage">
        <div className="invoiceManage_title">
          <div className="titles">发票管理</div>
          <div className="information">发票列表</div>
        </div>
        <div className="invoiceManage_search">
          <div className="searchConditions">搜索条件</div>
          <div className="searchConditionsInput">
            <div className="search_input">
              <Input placeholder="请输入用户名" />
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                locale={locale}
                placeholder="请选择开始时间"
                onChange={this.onStartChange}
              />
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                locale={locale}
                placeholder="请选择结束时间"
                onChange={this.onEndChange}
              />
            </div>
            <div className="btn">
              <Button type="primary">确定</Button>
            </div>
          </div>
        </div>
        <div className="invoiceManage_tables">
          <div className="invoiceManageTop">
            <span className="invoiceList">发票信息</span>
          </div>
          <div className="invoiceManage_tableContent">
            <Table
              className="table"
              scroll={{ y: this.tableHeight }}
              bordered
              columns={this.state.columns}
              dataSource={this.state.data}
              onChange={this.onPageChange}
              pagination={this.state.pagination}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceManage;
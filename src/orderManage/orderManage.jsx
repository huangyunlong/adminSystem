import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import "./orderManage.css";
@observer
class OrderManage extends React.Component {
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
        title: "订单编号",
        dataIndex: "orderNumber",
        width: 200,
        align: "center"
      },
        {
        title: "用户名",
        dataIndex: "userName",
        width: 150,
        align: "center"
      },
      {
        title: "商品详情",
        dataIndex: "goodDetail",
        align: "center",
        width: 150,
        align: "center"
      },
      {
        title: "数量",
        dataIndex: "count",
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
        title: "实付金额",
        dataIndex: "price",
        width: 150,
        align: "center"
      },
      {
        title: "付款时间",
        dataIndex: "paymentTime",
        width: 150,
        align: "center"
      },{
        title: '状态',
        dataIndex: "status",
        width: 150,
        align: "center"
      }
    ],
    data: Mock.mock({
      "list|10-100": [
        {
          "key|+1": 0,
          orderNumber: "@id(5)",
          userName: "@cname",
          invoiceName: "@cname",
          taxNumber: "@id",
          email: "@email",
          goodDetail:'@ctitle',
          count: '@integer(1,10)',
          price: '@integer(1,10)',
          paymentTime:'@datetime("yyyy-MM-dd HH:mm:ss")',
          "allPrice":'@integer(60,1000)',
          "status|1": ['已付款','已使用']
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
    this.tableHeight = this.refs.orderManage.offsetHeight - 238 - 40 - 50;
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
      <div className="orderManage" ref="orderManage">
        <div className="orderManage_title">
          <div className="titles">订单管理</div>
          <div className="information">订单信息</div>
        </div>
        <div className="orderManage_search">
          <div className="searchConditions">搜索条件</div>
          <div className="searchConditionsInput">
            <div className="search_input">
              <Input placeholder="输入订单编号" />
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
        <div className="orderManage_tables">
          <div className="orderManageTop">
            <span className="orderList">订单列表</span>
          </div>
          <div className="orderManage_tableContent">
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

export default OrderManage;
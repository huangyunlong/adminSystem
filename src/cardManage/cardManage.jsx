import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import "./cardManage.css";
@observer
class CardManage extends React.Component {
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
    ],
    data: Mock.mock({
      "list|10-100": [
        {
          "key|+1": 0,
          orderNumber: "@id(5)",
          cardNumber: "@id(5)",
          cardDesc: "@ctitle",
          allPrice: "@integer(200,1000)",
          useTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
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
    this.tableHeight = this.refs.cardManage.offsetHeight - 238 - 40 - 50;
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
      <div className="cardManage" ref="cardManage">
        <div className="cardManage_title">
          <div className="titles">卡券管理</div>
          <div className="information">卡券列表</div>
        </div>
        <div className="cardManage_search">
          <div className="searchConditions">搜索条件</div>
          <div className="searchConditionsInput">
            <div className="search_input">
              <Input placeholder="输入订单编号" />
            </div>
            <div className="btn">
              <Button type="primary">确定</Button>
            </div>
          </div>
        </div>
        <div className="cardManage_tables">
          <div className="cardManageTop">
            <span className="cardList">卡券列表</span>
          </div>
          <div className="cardManage_tableContent">
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

export default CardManage;
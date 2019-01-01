import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import "./orderManage.css";
import tool from "../tools/tool.js";
@observer
class OrderManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
  @observable pagination = {
    showSizeChanger: true,
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: total => {
      return `共 ${total} 条`;
    },
    pageSizeOptions: ["10", "20", "50", "100"]
  };
  @observable loading = false;
  defineColumns(){
    this.columns = [
      {
        title: "订单编号",
        dataIndex: "orderNumber",
        width: "16%",
        align: "center"
      },
        {
        title: "用户名",
        dataIndex: "userName",
        width: "12%",
        align: "center"
      },
      {
        title: "商品详情",
        dataIndex: "goodDetail",
        align: "center",
        width: "12%",
        align: "center"
      },
      {
        title: "数量",
        dataIndex: "count",
        width: "10%",
        align: "center"
      },
      {
        title: "合计价格",
        dataIndex: "allPrice",
        width: "12%",
        align: "center"
      },
      {
        title: "实付金额",
        dataIndex: "price",
        width: "12%",
        align: "center"
      },
      {
        title: "付款时间",
        dataIndex: "paymentTime",
        width: "12%",
        align: "center"
      },{
        title: '状态',
        dataIndex: "status",
        width: "12%",
        align: "center"
      }
    ]
  };
  async fetchDataSource(params){
    this.loading = true;
    console.log(params)
    let getUrl = 'http://93.179.103.52:5000/tables/order';
    // let response = await tool.requestAjaxSync('/tables/order', "GET", {
    //   ...params
    // });
    let data = await tool.requestAjaxSync(getUrl, "post", {
      getTableDataParams: params
    });
    console.log(data)
    data = data.data;
    console.log('data');
    // this.pagination.total = data.length;
    // this.loading = false;
    let list = Mock.mock({
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
    }).list;
    this.dataSource = _.clone(list);
    this.pagination.total = list.length;
    this.pagination.page = _.clone(params.page);
    this.pagination.pageSize = _.clone(params.pageSize);
  }
  initTable() {
    this.defineColumns();
    this.fetchDataSource({
      pageSize: 10,
      page: 1
    });
  }
  componentWillMount() {
    this.initTable();
  }
  componentDidMount() {
    setTimeout(()=>{
      this.tableHeight = this.refs.orderManage.offsetHeight - 110 - 90;
    },200)
  }
  onStartChange(value, dateString) {
    console.log("Formatted Selected start Time: ", dateString);
  }
  onEndChange(value, dateString) {
    console.log("Formatted Selected end Time: ", dateString);
  }
  async onhandleTableChange(pagination, filters, sorter) {
    this.pagination = _.merge(this.pagination,pagination);
    await this.fetchDataSource({
      pageSize: pagination.pageSize,
      page: pagination.current
    });
  }
  render() {
    return (
      <div className="orderManage" ref="orderManage">
        <h2>订单管理</h2>
        <div className="orderManage_search">
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
          <div className="orderManage_tableContent">
            <Table
              className="table"
              scroll={{ y: this.tableHeight }}
              bordered
              columns={this.columns}
              dataSource={this.dataSource}
              onChange={this.onhandleTableChange.bind(this)}
              pagination={this.pagination}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OrderManage;
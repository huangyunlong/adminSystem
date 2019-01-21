import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, Input, Table, DatePicker, Icon, Modal } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import "./orderManage.css";
import tool from "../tools/tool.js";
const { RangePicker } = DatePicker;
let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "/manage";
let getUrl = publicUrl + "/order/getData";
let getDetail = publicUrl+"/order_dtl/getOrderDtl";
@observer
class OrderManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
  @observable modalIsShow = false;
  @observable goodsDetailList = [];
  @observable tableX = "100%";
  @observable
  pagination = {
    showSizeChanger: true,
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: total => {
      return `共 ${total} 条`;
    },
    pageSizeOptions: ["10", "20", "50", "100"]
  };
  @observable loading = true;
  @observable lastRequestTableParams = {};
  defineColumns() {
    this.columns = [
      {
        title: "订单编号",
        dataIndex: "order_id",
        key: "order_no",
        width: "16%",
        align: "center",
        sorter: true, // 是否可排序
        filterType: "string"
      },
      {
        title: "用户名",
        dataIndex: "nickname",
        key: "nick_name",
        width: "12%",
        align: "center"
      },
      {
        title: "商品详情",
        dataIndex: "goodsDetail",
        key: "goodsDetail",
        align: "center",
        width: "12%",
        render: (text, row, index) => {
          return (
            <a
              href="javascript:;"
              key={row.key}
              onClick={this.goodsDetailClick.bind(this, text, row)}
            >
              点击获取详情
            </a>
          );
        }
      },
      // {
      //   title: "数量",
      //   dataIndex: "count",
      //   key: "count",
      //   width: "10%",
      //   align: "center"
      // },
      {
        title: "合计价格",
        dataIndex: "total_price",
        key: "total_price",
        width: "12%",
        align: "center",
        render:(text)=>{
          return <span>{text/100}元</span>
        }
      },
      // {
      //   title: "实付金额",
      //   dataIndex: "total_price",
      //   key: "total_price",
      //   width: "12%",
      //   align: "center"
      // },
      {
        title: "付款时间",
        dataIndex: "pay_finish_time",
        key: "pay_finish_time",
        width: "12%",
        align: "center",
        filterType: "date",
        render:(text)=>{
          text = Number(text)
          return <span>{tool.dateToString(new Date(text*1000),'yyyy-MM-dd HH:mm:ss')}</span>
        }
      },
      {
        title: "状态",
        dataIndex: "is_chatroom",
        key: "is_chatroom",
        width: "12%",
        align: "center",
        render: (text, row) => {
          let content = "已付款";
          return <span>已付款</span>;
        }
      }
    ];
    this.columns.forEach(item => {
      if (item.filterType == "string") {
        _.merge(item, { ...this.getStringColumnSearchProps(item.title) });
      } else if (item.filterType == "date") {
        _.merge(item, { ...this.getDateColumnSearchProps(item.title) });
      }
    });
  }

  async fetchDataSource(params) {
    this.loading = true;
    let data = await tool.requestAjaxSync(getUrl, "POST", {
      getTableDataParams: params
    });
    this.loading = false;
    console.log("data");
    console.log(data);
    data = data.data;
    let list = data.datas;
    // let list = Mock.mock({
    //   "list|10-100": [
    //     {
    //       "key|+1": 0,
    //       orderNumber: "@id(5)",
    //       userName: "@cname",
    //       invoiceName: "@cname",
    //       taxNumber: "@id",
    //       email: "@email",
    //       goodDetail: "@ctitle",
    //       count: "@integer(1,10)",
    //       price: "@integer(1,10)",
    //       paymentTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    //       allPrice: "@integer(60,1000)",
    //       "status|1": ["已付款", "已使用"]
    //     }
    //   ]
    // }).list;
    this.dataSource = list.map(item => {
      return {
        key: item.id,
        ...item
      };
    });
    this.pagination.total = data.tableInfo.total;
    this.pagination = _.clone(this.pagination);
    this.loading = false;
  }
  initTable() {
    this.defineColumns();
    this.tableX = 0;
    this.columns.forEach(item => {
      this.tableX += item.width || 100;
    });
    this.tableX += 100;
    this.fetchDataSource({
      pageSize: 10,
      page: 1
    });
  }
  componentWillMount() {
    this.initTable();
  }
  componentDidMount() {
    setTimeout(() => {
      this.tableHeight = this.refs.orderManage.offsetHeight - 110 - 40;
    }, 200);
  }
  async onhandleTableChange(pagination, filters, sorter) {
    this.pagination = _.merge(this.pagination, pagination);
    _.find(filters, (item, key) => {
      if (Array.isArray(item[0])) {
        filters[key] = [...item[0]];
      }
    });
    await this.fetchDataSource({
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters
    });
  }
  // 点击订单号
  async goodsDetailClick(text, record) {
    let orderNumber = record.order_id;
    let data = await tool.requestAjaxSync(
      `${getDetail}/${orderNumber}`,
      "get",
      {}
    );
    if (Array.isArray(data.data)) {
      this.goodsDetailList = data.data.map(item => {
        return {
          key: item.order_id,
          ...item
        };
      });
    }else{
      this.goodsDetailList = [];
    }
    this.modalIsShow = true;
  }
  // modal取消框
  handleGoodsDetailCancel() {
    this.modalIsShow = false;
  }
  // modal确定框
  handleGoodDetail() {
    this.modalIsShow = false;
  }
  getDateColumnSearchProps = searchTitle => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div className="custom-filter-dropdown-date">
        <RangePicker
          onChange={(date, dateString) => {
            setSelectedKeys(dateString ? [dateString] : []);
            confirm();
          }}
          style={{ width: 250, marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    )
  });

  getStringColumnSearchProps = searchTitle => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div className="custom-filter-dropdown-string">
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索 【${searchTitle}】`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    }
  });
  render() {
    let tableX = this.tableX;
    return (
      <div className="orderManage" ref="orderManage">
        <h2>订单管理</h2>
        <div className="orderManage_tables">
          <div className="orderManage_tableContent">
            <Table
              className="table"
              scroll={{x:tableX, y: this.tableHeight }}
              bordered
              columns={this.columns}
              dataSource={this.dataSource}
              onChange={this.onhandleTableChange.bind(this)}
              pagination={this.pagination}
              loading={this.loading}
            />
            <Modal
              visible={this.modalIsShow}
              title="商品详情"
              onOk={this.handleGoodDetail.bind(this)}
              onCancel={this.handleGoodsDetailCancel.bind(this)}
              className = "oderModal"
              width={600}
            >
              {this.goodsDetailList.map(item => {
                return (
                  <div className="goodsDetailDesc" key={item.key}>
                    <p>
                      商品图片
                      <a href={item.background_pic_url} target="__blank">
                        <img className="orderImage" src={item.background_pic_url} />
                      </a>
                    </p>
                    <p>商品价格：{item.price/100}元</p>
                    {/*<p>商品数量：{item.goods_num}</p>*/}
                  </div>
                );
              })}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderManage;

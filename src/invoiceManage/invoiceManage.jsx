import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import { Button, Input, Table, DatePicker, Icon } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import tool from "../tools/tool.js";
import "./invoiceManage.css";
const { RangePicker } = DatePicker;
let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "/api";
let getUrl = publicUrl + "/invoice/getData";
@observer
class InvoiceManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
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
  // 表头设计
  defineColumns() {
    this.columns = [
      // {
      //   title: "编号",
      //   dataIndex: "number",
      //   width: 200,
      //   align: "center",
      //   render: (text, row, index) => {
      //     return <span>{index + 1}</span>;
      //   }
      // },
      {
        title: "发票类型",
        dataIndex: "type",
        key: "type",
        width: 100,
        align: "center",
        render: text => {
          let relText = text == "1" ? "个人" : "单位";
          return <span>{relText}</span>;
        }
      },
      {
        title: "订单号",
        dataIndex: "order_no",
        key: "order_no",
        align: "center",
        width: 200
      },
      {
        title: "时间",
        dataIndex: "create_time",
        key: "create_time",
        align: "center",
        width: 200,
        filterType: "date" // 表示过滤字符串,string,date
      },
      {
        title: "抬头",
        dataIndex: "look_up_name",
        key: "look_up_name",
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
        dataIndex: "phone_numer",
        key: "phone_numer",
        width: 150,
        align: "center"
      },
      {
        title: "姓名",
        dataIndex: "user_name",
        key: "user_name",
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
    //       "invoiceType|1": ["单位", "个人"],
    //       orderNumber: "@id(5)",
    //       invoiceName: "@cname",
    //       lookUp: "@cname",
    //       ein: "@integer(1,100)",
    //       phoneNumber: "@id",
    //       email: "@email",
    //       userName: "@cname",
    //       invoiceTime: "@datetime('yyyy-MM-dd HH:mm:ss')"
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
      this.tableHeight = this.refs.invoiceManage.offsetHeight - 110 - 40;
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
      <div className="invoiceManage" ref="invoiceManage">
        <h2>发票管理</h2>
        <div className="invoiceManage_tables">
          <div className="invoiceManage_tableContent">
            <Table
              className="table"
              scroll={{ x: tableX, y: this.tableHeight }}
              bordered
              columns={this.columns}
              dataSource={this.dataSource}
              onChange={this.onhandleTableChange.bind(this)}
              pagination={this.pagination}
              loading={this.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default InvoiceManage;

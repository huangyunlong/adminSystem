import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyTable from "../components/myTable/myTable.jsx";
import { Button, Input, Table, DatePicker, Icon } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import Mock from "mockjs";
import tool from "../tools/tool.js";
import "./userManage.css";
const { RangePicker } = DatePicker;
let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "/api";
let getUrl = publicUrl + "/member/getData";
@observer
class UserManage extends React.Component {
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
      {
        title: "用户头像",
        dataIndex: "photo",
        key: "photo",
        align: "center",
        width: 150,
        render: (text, row, index) => {
          let imgUrl = row.photo;
          return (
            <a href={imgUrl} target="__blank">
              <img className="userImage" src={imgUrl} />
            </a>
          );
        }
      },
      {
        title: "昵称",
        dataIndex: "nick_name",
        key: "nick_name",
        width: 100,
        align: "center",
        filterType: "string"
      },
      // {
      //   title: "用户名",
      //   dataIndex: "userName",
      //   key: "userName",
      //   width: 100,
      //   align: "center",
      // },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
        align: "center",
        width: 150,
        render: (text, row) => {
          let sex = row.gender == 1 ? "男" : "女";
          return <span>{sex}</span>;
        }
      },
      {
        title: "注册时间",
        dataIndex: "register_time",
        key: "register_time",
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
    console.log("data");
    console.log(data);
    this.loading = false;
    console.log("data");
    console.log(data);
    let list = data.data.datas;
    // let list = data.datas;
    // let list = Mock.mock({
    //   "list|10-100": [
    //     {
    //       "key|+1": 0,
    //       orderNumber: "@id(5)",
    //       cardNumber: "@id(5)",
    //       cardDesc: "@ctitle",
    //       allPrice: "@integer(200,1000)",
    //       useTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
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
    this.pagination.total = data.data.tableInfo.total;
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
      this.tableHeight = this.refs.userManage.offsetHeight - 110 - 40;
    }, 200);
  }
  async onhandleTableChange(pagination, filters, sorter) {
    this.pagination = _.merge(this.pagination, pagination);
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
      <div className="userManage" ref="userManage">
        <h2>用户管理</h2>
        <div className="userManage_tables">
          <div className="userManage_tableContent">
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

export default UserManage;

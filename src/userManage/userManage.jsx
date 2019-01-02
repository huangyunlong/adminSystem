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
publicUrl = "http://93.179.103.52:5000";
let getUrl = publicUrl + "/order/getData";
@observer
class UserManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
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
 defineColumns(){
    this.columns = [
      {
        title: "用户头像",
        dataIndex: "userImage",
        key: "userImage",
        align: "center",
        width: 150,
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
      <img width="100%" src="${row.userImage}" />
    </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="userImage"
              src={row.userImage}
            />
          );
        }
      },
      {
        title: "昵称",
        dataIndex: "nick_name",
        key: "nick_name",
        width: 100,
        align: "center"
      },
      {
        title: "用户名",
        dataIndex: "userName",
        key: "userName",        
        width: 100,
        align: "center",
        filterType: "string" // 表示过滤字符串,string,date
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",        
        align: "center",
        width: 150,
        align: "center"
      },
      {
        title: "手机号",
        dataIndex: "phoneNumber",
        key: "phoneNumber",        
        width: 150,
        align: "center"
      },
      {
        title: "注册时间",
        dataIndex: "registeredTime",
        key: "registeredTime",        
        width: 150,
        align: "center"
      }
    ]
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
    // let list = data.datas;
    let list = Mock.mock({
      "list|10-100": [
        {
          "key|+1": 0,
          orderNumber: "@id(5)",
          cardNumber: "@id(5)",
          cardDesc: "@ctitle",
          allPrice: "@integer(200,1000)",
          useTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          "status|1": ["已付款", "已使用"]
        }
      ]
    }).list;
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
            setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
    return (
      <div className="userManage" ref="userManage">
        <h2>用户管理</h2>
        <div className="userManage_tables">
          <div className="userManage_tableContent">
            <Table
              className="table"
              scroll={{ y: this.tableHeight }}
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

 

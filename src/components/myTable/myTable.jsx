import React from "react";
import { observer, inject } from "mobx-react";
import { observable, computed } from "mobx";
import { DatePicker, message, Icon, Table, Input, Button } from "antd";
import "./myTable.css";
import tool from "../../tools/tool.js";

const { RangePicker } = DatePicker;

let tableName = "";

@inject("myGlobal")
@observer
class MyTable extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable tableWidth = 0;
  @observable editingRowIndex = -1; // 正在编辑的行在datasource中的下标
  @observable editWindowVisible = false; // 是否打开编辑行窗口
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
  @observable pagination = {
    showSizeChanger: true,
    current: 0,
    pageSize: 10,
    total: 100,
    showTotal: total => {
      return `共 ${total} 条`;
    },
    pageSizeOptions: ["10", "20", "50", "100"]
  };
  @observable loading = false;
  lastTableRequestParam = {}; // 上一次请求表格数据时的参数
  nowSelectedRows = [];

  @computed get nowSelectedRow() {
    return _.get(this.dataSource, this.editingRowIndex);
  }

  constructor(props) {
    super(props);
    tableName = props.tableName;
  }

  componentWillMount() {
    this.initTable();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.mode == "edit") {
        this.tableHeight = this.refs.myTable.offsetHeight - 40 - 100;
      } else {
        this.tableHeight = this.refs.myTable.offsetHeight - 100;
      }
      this.tableWidth = this.props.tableWidth;
    }, 0);
  }

  handleRowEdit(index) {
    this.editingRowIndex = index;
    this.editWindowVisible = true;
  }

  /**
   * 单行删除
   *
   * @param {*} index
   */
  async handleRowDelete(index) {
    let row = this.dataSource[index];
    let rel = await tool.updateRowWithServer(tableName, "delete", {
      deleteIds: [row.id]
    });
    if (rel.state == 1) {
      this.dataSource.splice(index, 1);
      this.dataSource = this.dataSource.slice(); // dataSource是给antd的table组件用的，table组件并没有对mobx数据做响应，所以需要重新赋值
      this.pagination.total = this.dataSource.length;
      this.pagination = _.clone(this.pagination);
      message.success("操作成功");
    } else {
      message.error(`操作失败,errorMsg:${rel.errorMsg}`);
    }
  }

  /**
   * 多行删除
   *
   */
  async handleRowsDelete() {
    let ids = this.nowSelectedRows.map(item => {
      return item.id;
    });
    if (ids.length <= 0) {
      message.error("未选中行");
      return;
    }
    let rel = await tool.updateRowWithServer(tableName, "delete", {
      deleteIds: ids
    });
    if (rel.state == 1) {
      this.dataSource = this.dataSource
        .filter(item => {
          let rel = this.nowSelectedRows.findIndex(subItem => {
            return subItem.key == item.key;
          });
          return rel === -1;
        })
        .slice();
      this.pagination.total = this.dataSource.length;
      this.pagination = _.clone(this.pagination);
      this.nowSelectedRows = [];
      message.success("操作成功");
    } else {
      message.error(`操作失败,errorMsg:${rel.errorMsg}`);
    }
  }

  /**
   * 定义表头
   * 参考文档
   * https://ant.design/components/table-cn/#components-table-demo-edit-row
   *
   * @memberof ThemeManage
   */
  defineColumns() {
    this.columns = this.props.columns;

    this.columns.forEach(item => {
      if (item.filterType == "string") {
        _.merge(item, { ...this.getStringColumnSearchProps(item.title) });
      } else if (item.filterType == "date") {
        _.merge(item, { ...this.getDateColumnSearchProps(item.title) });
      }
    });

    this.columns.unshift({
      key: Math.random(),
      title: "序号",
      render: (text, row, index) => {
        return <span>{index + 1}</span>;
      },
      width: 100,
      align: "center"
    });
    if (this.props.mode == "edit") {
      this.columns.push({
        key: Math.random(),
        title: "操作",
        width: 150,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              <span
                style={{ color: "#1890ff", cursor: "pointer", marginRight: 10 }}
                onClick={this.handleRowEdit.bind(this, index)}
              >
                编辑
              </span>
              <span
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={this.handleRowDelete.bind(this, index)}
              >
                删除
              </span>
            </div>
          );
        }
      });
    }
  }

  /**
   * 获取表格数据并更新到this.dataSource里
   * @param {*} params = {
      pageSize,  // 每页多少条数据
      page, // 当前页码
      sortField, // 当前排序字段
      sortOrder, // 当前排序方式
    }
   */
  async fetchDataSource(params = {}) {
    this.loading = true;
    let data = [];
    this.lastTableRequestParam = _.cloneDeep(params);
    data = await tool.updateRowWithServer(tableName, "get", {
      getTableDataParams: _.merge(
        {
          pageSize: 10,
          page: 1
        },
        params
      )
    });
    this.dataSource = data.datas.map(item => {
      return {
        key: item.id,
        ...item
      };
    });
    console.log("table data=", this.dataSource);
    this.pagination.total = data.datas.length;
    this.loading = false;
  }

  initTable() {
    this.defineColumns();
    this.fetchDataSource();
  }

  addRow() {
    this.editWindowVisible = true;
  }

  async handleTableChange(pagination, filters, sorter) {
    console.log(filters);
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
    const MyModal = this.props.MyModal;
    return (
      <div className="myTable" ref="myTable">
        <div className="tool">
          {this.props.mode == "edit" ? (
            <React.Fragment>
              <Button type="primary" onClick={this.addRow.bind(this)}>
                增加
              </Button>
              <Button type="danger" onClick={this.handleRowsDelete.bind(this)}>
                删除
              </Button>
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
        <Table
          bordered
          className="table"
          scroll={{ x: this.tableWidth, y: this.tableHeight }}
          rowSelection={
            this.props.mode == "edit"
              ? {
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.nowSelectedRows = selectedRows;
                  }
                }
              : null
          }
          loading={this.loading}
          dataSource={this.dataSource}
          columns={this.columns}
          pagination={this.pagination}
          onChange={this.handleTableChange.bind(this)}
        />
        {/** 编辑窗口 */}
        <MyModal
          editingRowIndex={this.editingRowIndex}
          relativeRow={this.nowSelectedRow}
          visible={this.editWindowVisible}
          cancelWindow={() => {
            this.editWindowVisible = false;
          }}
          updateRow={(newRow, index) => {
            this.dataSource[index] = newRow;
            this.dataSource = this.dataSource.slice();
            console.log(this.dataSource);
          }}
          addRow={newRow => {
            this.dataSource.unshift(newRow);
            this.dataSource = this.dataSource.slice();
            this.pagination.total = this.dataSource.length;
            this.pagination = _.clone(this.pagination);
          }}
          resetChoosedRow={() => {
            this.editingRowIndex = -1;
          }}
          columns={this.columns}
        />
      </div>
    );
  }
}

export default MyTable;

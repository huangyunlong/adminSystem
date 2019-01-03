import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./accountManage.css";
import {
  Button,
  Input,
  Table,
  Divider,
  Modal,
  message,
  Form,
  Select,
  Popconfirm
} from "antd";
import Mock from "mockjs";
import tool from "../tools/tool.js";
import _ from "lodash";
let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "http://93.179.103.52:5000";
let getUrl = "http://93.179.103.52:5000" + "/admin/getData";
/**
 * 更新表格信息
 */
async function updateRowWithServer(type, datas) {
  let url = "",
    rel = {};
  try {
    rel = await tool.requestOrdinaryAjaxSync(url, "post", {
      type,
      tableName,
      ...datas
    });
  } catch (error) {}
  rel.state = 1;
  rel.datas = _.merge(
    {
      key: Math.random()
    },
    datas.editRow
  );
  return rel;
}
const FormItem = Form.Item;
class MyModal extends React.Component {
  @observable row = {};
  addRowMode = false;
  componentWillReceiveProps(nextProps) {
    let nowVisible = this.props.visible;
    let nextVisible = nextProps.visible;
    if (nowVisible == false && nextVisible) {
      if (nextProps.editingRowIndex == -1) {
        this.addRowMode = true;
      }
      // 刚打开
      if (this.addRowMode) {
        this.row = {};
      } else {
        this.row = nextProps.selectedRow;
      }
    }
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  /**
   * 保存信息
   * 
   * @memberof AccountManage
   */
  async handleSaveData(e) {
    e.preventDefault();
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      let newRow = _.assign({}, this.row, values),
        rel = null;
      // 如果是增加模式
      if (this.addRowMode) {
        rel = await updateRowWithServer("put", { editRow: newRow });
        if (rel.state == 1) {
          message.success("操作成功");
        } else {
          message.error(`操作失败,errorMsg:${rel.errorMsg}`);
          return;
        }
        newRow = rel.datas;
        this.props.addRow(newRow);
      } else {
        rel = await updateRowWithServer("post", { editRow: newRow });
        if (rel.state == 1) {
          message.success("操作成功");
        } else {
          message.error(`操作失败,errorMsg:${rel.errorMsg}`);
          return;
        }
        newRow = rel.datas;
        this.props.updateRow(newRow, this.props.editingRowIndex);
      }
      this.handleCancel();
    });
  }
  /**
   * 模态框的取消按钮
   * 
   * @memberof AccountManage
   */
  handleCancel = () => {
    this.addRowMode = false;
    this.row = {};
    this.props.resetChoosedRow();
    this.props.cancelWindow();
  };
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    let formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    let editorRow = this.props.editingRowIndex;
    let columns = this.props.columns;
    let row = this.row;
    return (
      <Modal
        destroyOnClose
        title={this.props.operation}
        width="70%"
        maskClosable
        centered
        visible={this.props.visible}
        onOk={this.handleSaveData.bind(this)}
        onCancel={this.handleCancel.bind(this)}
      >
        <Form>
          {columns.map(column => {
            if (column.dataIndex === "userName") {
              if (this.props.operation === "编辑") {
                return (
                  <FormItem
                    key={column.key}
                    label={column.title}
                    {...formItemLayout}
                  >
                    {this.props.form.getFieldDecorator(column.key, {
                      rules: [
                        {
                          required: true,
                          message: "用户信息不能为空"
                        }
                      ],
                      initialValue: this.row[column.key]
                    })(<Input disabled placeholder="用户信息不能为空" />)}
                  </FormItem>
                );
              } 
              else {
                return (
                  <FormItem
                    key={column.key}
                    label={column.title}
                    {...formItemLayout}
                  >
                    {this.props.form.getFieldDecorator(column.key, {
                      rules: [
                        {
                          required: true,
                          message: "用户信息不能为空"
                        }
                      ],
                      initialValue: ""
                    })(<Input placeholder="用户信息不能为空" />)}
                  </FormItem>
                );
              }
            } else if (column.dataIndex === "isAdime") {
              if (this.props.operation == "编辑") {
                return (
                  <FormItem
                    key={column.key}
                    label={column.title}
                    {...formItemLayout}
                  >
                    {this.props.form.getFieldDecorator(column.key, {
                      rules: [
                        {
                          required: true,
                          message: "管理员信息不能为空"
                        }
                      ],
                      initialValue: this.row[column.key]
                    })(
                      <Select>
                        {column.editWindow.optionList.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>
                              {item.title}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                );
              } else {
                return (
                  <FormItem
                    key={column.key}
                    label={column.title}
                    {...formItemLayout}
                  >
                    {this.props.form.getFieldDecorator(column.key, {
                      rules: [
                        {
                          required: true,
                          message: "管理员信息不能为空"
                        }
                      ],
                      initialValue: ''
                    })(
                      <Select>
                        {column.editWindow.optionList.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>
                              {item.title}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                );
              }
            }
          })}
          <FormItem label="密码" {...formItemLayout}>
            {this.props.form.getFieldDecorator("passWord", {
              rules: [
                {
                  required: true,
                  message: "密码不能为空"
                }
              ],
              initialValue: ""
            })(<Input type="password" placeholder="密码不能为空" />)}
          </FormItem>;
        </Form>
      </Modal>
    );
  }
}
MyModal = Form.create({})(MyModal);
@observer
class AccountManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
  @observable editingRowIndex = -1; // 正在编辑的行在datasource中的下标
  @observable editWindowVisible = false; // 是否打开编辑行窗口
  @observable dataSource = []; // 表体
  @observable columns = []; // 表头
  @observable operation = "";
  @observable
  pagination = {
    showSizeChanger: true,
    current: 1,
    pageSize: 20,
    total: 100,
    showTotal: total => {
      return `共 ${total} 条`;
    },
    pageSizeOptions: ["10", "20", "50", "100"]
  };
  @observable loading = false;
  @observable nowSelectedRows = [];
  @observable datasource =[]
  @computed
  get nowSelectedRow() {
    return _.get(this.dataSource, this.editingRowIndex);
  }
  /**
   * 表头设计
   */
  defineColumn() {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "login_name", // dataIndex 和 key 需要一致
        key: "login_name",
        align: "center", // 列文字排版
        width: "30%"
      },
      {
        title: "是否为管理员",
        dataIndex: "isAdime",
        key: "isAdime",
        align: "center",
        sorter: true,
        render: text => {
          let relText = text == 0 ? "否" : "是";
          return <span>{relText}</span>;
        },
        editWindow: {
          optionList: [
            {
              title: "是",
              value: "1"
            },
            {
              title: "否",
              value: "0"
            }
          ]
        }
      },
      {
        title: "操作",
        key: "action",
        width: "30%",
        align: "center", // 列文字排版
        render: (text, record, index) => {
          return (
            <span>
              <a
                href="javascript:;"
                onClick={this.editAccount.bind(this, text, index)}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="你确定删除此用户的数据么,删除之后无法恢复"
                onConfirm={this.confirm.bind(this, text, index)}
                onCancel={this.cancel.bind(this)}
                okText="确认"
                cancelText="取消"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];
  }

  // 获取数据
  async fetchDataSource(params = {}) {
    this.loading = true;
    let data = await tool.requestAjaxSync(getUrl, "POST", {
      getTableDataParams: params
    });
    console.log('data')
    console.log(data)
    let list = data.data.datas;
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
    let params = {
      pageSize: 10,
      page: 1
    };
    this.defineColumn();
    this.fetchDataSource(params);
  }
  // 复选框的选中
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.nowSelectedRows = selectedRows;
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name
    })
  };
  componentWillMount() {}
  componentDidMount() {
    this.initTable();
    setTimeout(() => {
      this.tableHeight = this.refs.myTables.offsetHeight - 40 - 100 - 20;
    }, 0);
  }
  // 编辑用户信息
  editAccount(text, index, e) {
    this.editWindowVisible = true; // 打开模态对话框
    this.editingRowIndex = index;
    this.operation = "编辑";
  }

  confirm(text, index, e) {
    this.deleteAccount(text, index);
  }

  cancel(e) {
    message.success("取消删除此账号数据");
  }
  /**
   * 删除单行
   * 
   * @param {any} text 
   * @param {any} index 
   * @memberof AccountManage
   */
  async deleteAccount(text, index) {
    let row = this.dataSource[index];
    let rel = await updateRowWithServer("delete", {
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
   * 新增一行
   * 
   * @memberof AccountManage
   */
  addRow() {
    this.operation = "新增";
    this.editWindowVisible = true; // 打开模态对话框
  }
  /**
   * 删除多行操作
   * 
   * @memberof AccountManage
   */
  async handleRowsDelete() {
    let ids = this.nowSelectedRows.map(item => {
      return item.id;
    });
    let rel = await updateRowWithServer("delete", {
      deleteIds: ids
    });
    if (rel.state == 1) {
      if (ids.length <= 0) {
        message.error("请选中要删除的行");
      } else {
        this.dataSource = this.dataSource
          .filter(item => {
            let rel = this.nowSelectedRows.findIndex(subItem => {
              return item.id === subItem.id;
            });
            return rel === -1;
          })
          .slice();
        this.pagination.total = this.dataSource.length;
        this.pagination = _.clone(this.pagination);
        this.nowSelectedRows = [];
      }
    } else {
      message.error("操作失败");
    }
  }
  /**
   * 改变分页内容
   * 
   * @param {any} paginations 
   * @param {any} filters 
   * @param {any} sorter 
   * @memberof AccountManage
   */
  async handleTableChange(paginations, filters, sorter) {
    this.pagination = _.merge(this.pagination, paginations);
    await this.fetchDataSource({
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters
    });
  }
  componentWillReceiveProps(nextProps) {}
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate() {}
  render() {
    return (
      <div className="accountManage">
        <h2>账户权限</h2>
        <div className="tablePanel" ref="myTables">
          <div className="tool">
            <Button type="primary" onClick={this.addRow.bind(this)}>
              增加
            </Button>
            <Button type="danger" onClick={this.handleRowsDelete.bind(this)}>
              删除
            </Button>
          </div>
          <Table
            dataSource={this.dataSource}
            columns={this.columns}
            loading={this.loading}
            bordered
            className="table"
            pagination={this.pagination}
            rowSelection={this.rowSelection}
            onChange={this.handleTableChange.bind(this)}
            scroll={{ y: this.tableHeight }}
          />

          <MyModal
            visible={this.editWindowVisible}
            cancelWindow={() => {
              this.editWindowVisible = false;
            }}
            editingRowIndex={this.editingRowIndex}
            selectedRow={this.nowSelectedRow}
            addRow={newRow => {
              this.dataSource.unshift(newRow);
              this.dataSource = this.dataSource.slice();
              this.pagination.total = this.dataSource.length;
              this.pagination = _.clone(this.pagination);
            }}
            columns={this.columns}
            operation={this.operation}
            updateRow={(newRow, index) => {
              this.dataSource[index] = newRow;
              this.dataSource = this.dataSource.slice();
            }}
            resetChoosedRow={() => {
              this.editingRowIndex = -1;
            }}
          />
        </div>
      </div>
    );
  }
}
export default AccountManage;

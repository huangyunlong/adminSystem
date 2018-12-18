import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import {
  Select,
  message,
  Upload,
  Table,
  Input,
  Button,
  Form,
  Modal
} from "antd";
import "./themeManage.css";
import Mock from "mockjs";
import tool from "../tools/tool.js";

const FormItem = Form.Item;
const tableName = "主题表";

/**
 * 更新表格信息
 */
async function updateRowWithServer(type, datas) {
  let url = "",
    rel = {};
  try {
    rel = await tool.requestAjaxSync(url, "post", {
      type,
      tableName,
      ...datas
    });
  } catch (error) {}
  rel.state = 1;
  rel.datas = _.merge({ key: Math.random() }, datas.editRow);
  return rel;
}

/**
 * 获取图片的base64地址
 *
 * @param {*} img
 * @param {*} callback
 */
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * 上传前对图片的检查
 *
 * @param {*} file
 * @returns
 */
function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

let FormProps = {},
  obj = {};

@observer
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
        this.row = nextProps.relativeRow;
      }
    }
  }

  componentWillMount() {}

  componentWillUpdate(nextProps, nextState) {
    // console.log('will update', this.row, nextProps, nextState);
  }

  componentDidUpdate() {
    // console.log('updated', this.row);
  }

  /**
   * 保存
   */
  async handleEditWindowSave() {
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      let newRow = _.merge({}, this.row, FormProps),
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
      this.handleCancelEditWindow();
    });
  }

  handleCancelEditWindow() {
    this.addRowMode = false;
    this.row = {};
    this.props.resetChoosedRow();
    this.props.cancelWindow();
  }

  /**
   * 上传状态改变时的处理函数
   *
   * @memberof MyModal
   */
  handleFileUploadStatusChange = (rowIndex, info) => {
    if (info.file.status === "uploading") {
      return;
    } else if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageBase64Url => {
        this.row.img = imageBase64Url;
      });
    }
  };

  render() {
    let rowIndex = this.props.editingRowIndex;
    let formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    };
    return (
      <Modal
        destroyOnClose
        title="编辑"
        width="80%"
        maskClosable
        centered
        visible={this.props.visible}
        onOk={this.handleEditWindowSave.bind(this)}
        onCancel={this.handleCancelEditWindow.bind(this)}
      >
        <Form>
          <FormItem label="主题名称" {...formItemLayout}>
            {this.props.form.getFieldDecorator("themeName", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: this.row["themeName"] || ""
            })(<Input placeholder="不能为空" />)}
          </FormItem>
          <FormItem label="图片" {...formItemLayout}>
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={this.handleFileUploadStatusChange.bind(this, rowIndex)}
            >
              <img
                style={{ width: "100px", height: "100px" }}
                src={this.row.img}
                alt=""
              />
            </Upload>
          </FormItem>
          <FormItem label="状态" {...formItemLayout}>
            {this.props.form.getFieldDecorator("state", {
              initialValue: this.row["state"] || "inDisplay"
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="lowerShelf">已下架</Select.Option>
                <Select.Option value="inDisplay">显示中</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="顶部显示" {...formItemLayout}>
            {this.props.form.getFieldDecorator("topping", {
              initialValue: this.row["topping"] || "0"
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="1">是</Select.Option>
                <Select.Option value="0">否</Select.Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

// 用来创建表单验证的必要逻辑
MyModal = Form.create({
  onFieldsChange(props, changedFields) {
    for (let key in changedFields) {
      FormProps[key] = changedFields[key].value;
    }
  }
})(MyModal);

@observer
class ThemeManage extends React.Component {
  @observable tableHeight = 0; // 表格高度
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
  @observable searchContent = ""; // 全局搜索字段
  lastTableRequestParam = {}; // 上一次请求表格数据时的参数
  nowSelectedRows = [];

  @computed get nowSelectedRow() {
    return _.get(this.dataSource, this.editingRowIndex);
  }

  componentWillMount() {
    this.initTable();
  }

  componentDidMount() {
    this.tableHeight =
      this.refs.themeManage.offsetHeight - 20 - 31 - 53 - 32 - 32 - 42;
  }

  handleRowEdit(index) {
    this.editingRowIndex = index;
    this.editWindowVisible = true;
  }

  /**
   * 单行删除
   *
   * @param {*} index
   * @memberof ThemeManage
   */
  async handleRowDelete(index) {
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
   * 多行删除
   *
   * @memberof ThemeManage
   */
  async handleRowsDelete() {
    let ids = this.nowSelectedRows.map(item => {
      return item.id;
    });
    if (ids.length <= 0) {
      message.error("未选中行");
      return;
    }
    let rel = await updateRowWithServer("delete", {
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
    // 表头设计
    this.columns = [
      {
        title: "序号",
        render: (text, row, index) => {
          return <span>{index + 1}</span>;
        },
        width: 100,
        align: "center"
      },
      {
        title: "主题名称",
        dataIndex: "themeName",
        key: "themeName",
        width: 150,
        sorter: true,
        align: "center"
      },
      {
        title: "缩略图",
        dataIndex: "img",
        key: "img",
        align: "center",
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
              <img width="100%" src="${row.img}" />
            </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="smallImg"
              src={row.img}
            />
          );
        }
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = "";
          switch (text) {
            case "inDisplay":
              relText = "显示中";
              break;
            case "lowerShelf":
              relText = "已下架";
              break;
          }
          return (
            <span style={{ color: text == "inDisplay" ? "#237804" : "" }}>
              {relText}
            </span>
          );
        }
      },
      {
        title: "是否顶部显示",
        dataIndex: "topping",
        key: "topping",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = text == 0 ? "否" : "是";
          return <span>{relText}</span>;
        }
      },
      {
        title: "操作",
        width: 150,
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
      }
    ];
  }

  /**
   * 获取表格数据并更新到this.dataSource里
   * @param {*} params = {
      pageSize,  // 每页多少条数据
      page, // 当前页码
      sortField, // 当前排序字段
      sortOrder, // 当前排序方式
      searchContent // 全局搜索字符
    }
   */
  async fetchDataSource(params = {}) {
    this.loading = true;
    let data = [];
    this.lastTableRequestParam = _.cloneDeep(params);
    data = await updateRowWithServer("get", {
      getTableDataParams: {
        ...params
      }
    });
    data = data.datas;

    data = Mock.mock({
      "list|10-100": [
        {
          "key|+1": 0,
          id: "@integer()",
          themeName: "@ctitle()",
          img:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544962465147&di=91a2f0c83ce1ee20733ca0b659a32152&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111023%2F8104044_230939695000_2.jpg",
          "state|1": ["lowerShelf", "inDisplay"],
          "topping|1": ["0", "1"]
        }
      ]
    }).list;

    this.dataSource = data;
    this.pagination.total = data.length;
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  initTable() {
    this.defineColumns();
    this.fetchDataSource();
  }

  addRow() {
    this.editWindowVisible = true;
  }

  handleTableChange(pagination, filters, sorter) {
    const pager = this.pagination;
    pager.current = pagination.current;

    this.fetchDataSource({
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchContent: this.searchContent
    });
  }

  render() {
    return (
      <div className="themeManage" ref="themeManage">
        <h2>主题管理</h2>
        <div className="tool">
          <Input.Search
            placeholder="全局搜索"
            onSearch={value => {
              this.searchContent = value;
              this.fetchDataSource(
                _.merge(this.lastTableRequestParam, {
                  searchContent: value
                })
              );
            }}
            style={{ width: 200, marginRight: 5, position: "relative", top: 1 }}
          />
          <Button type="primary" onClick={this.addRow.bind(this)}>
            增加
          </Button>
          <Button type="danger" onClick={this.handleRowsDelete.bind(this)}>
            删除
          </Button>
        </div>
        <Table
          bordered
          className="table"
          scroll={{ y: this.tableHeight }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.nowSelectedRows = selectedRows;
            }
          }}
          rowClassName={(record, index) => {
            return record.state == "lowerShelf" ? "disable" : "";
          }}
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
        />
      </div>
    );
  }
}

export default ThemeManage;

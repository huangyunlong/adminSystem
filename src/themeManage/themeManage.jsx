import React from "react";
import { observer, inject } from "mobx-react";
import { observable, computed } from "mobx";
import {
  Select,
  Upload,
  Form,
  Modal,
  DatePicker,
  message,
  Icon,
  Table,
  Input,
  Button
} from "antd";
import tool from "../tools/tool.js";
import Mock from "mockjs";
import "./themeManage.css";

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "/api";
let addUrl = publicUrl + "/theme/addData"; // 新增数据接口地址
let updateUrl = publicUrl + "/theme/updateData";
let deleteUrl = publicUrl + "/theme/deleteData";
let getUrl = publicUrl + "/theme/getData";
let uploadImgUrl = "/uploadImgApi/images/uploadImg";

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
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJPG) {
    message.error("只能上传jpg,jpeg,png格式的图片!");
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("上传图片不能大于5M!");
    return false;
  }
  return true;
}

@inject("myGlobal")
@observer
class MyModal extends React.Component {
  @observable row = {}; // 当前编辑行对象，窗口打开时赋值
  addRowMode = false; // 是否是添加模式
  @observable imgList = []; // 图片列表,里面对象格式参见 https://ant.design/components/upload-cn/#onChange

  componentWillMount() {
    let { editingRowIndex, relativeRow } = this.props;
    if (editingRowIndex == -1) {
      this.addRowMode = true;
    }
    if (this.addRowMode) {
      this.row = {
        img_url_list: []
      };
    } else {
      this.row = _.clone(relativeRow);
      this.row.img_url_list = this.row.img_url_list.map(item => {
        return {
          uid: Mock.Random.integer(1, 10000),
          url: item
        };
      });
    }
  }

  /**
   * 保存
   */
  async handleEditWindowSave() {
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      let newRow = _.assign({}, this.row, values),
        rel = null;
      newRow.img_url_list = newRow.img_url_list.map(item => {
        return item.url || _.get(item, "response.data[0]");
      });
      newRow.img_url_list = newRow.img_url_list.filter(item => {
        return item != null;
      });
      // 如果是增加模式
      if (this.addRowMode) {
        rel = await tool.requestAjaxSync(addUrl, "post", {
          addRow: newRow
        });
        rel = rel.data;
        if (rel.state == 1) {
          message.success("操作成功");
        } else {
          message.error(`操作失败,errorMsg:${rel.errorMsg}`);
          return;
        }
        this.props.reFetchDataSource();
      } else {
        // 编辑模式
        rel = await tool.requestAjaxSync(updateUrl, "post", {
          editRow: newRow
        });
        rel = rel.data;
        if (rel.state == 1) {
          message.success("操作成功");
        } else {
          message.error(`操作失败,errorMsg:${rel.errorMsg}`);
          return;
        }
        this.props.reFetchDataSource();
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

  // handleChange = ({ file, fileList }) => {
  //   this.imgList = fileList.map(item => {
  //     return {
  //       uid: item.uid,
  //       url: item.url || _.get(item, "response.data[0]"),
  //       thumbUrl: _.get(item, "response.data[0]") || item.url
  //     };
  //   });
  // };

  render() {
    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      { form } = this.props;
    return (
      <Modal
        destroyOnClose
        title="编辑"
        width="70%"
        maskClosable
        centered
        visible={this.props.visible}
        onOk={this.handleEditWindowSave.bind(this)}
        onCancel={this.handleCancelEditWindow.bind(this)}
      >
        <Form>
          <FormItem label="主题名称" {...formItemLayout}>
            {form.getFieldDecorator("theme_name", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: this.row["theme_name"]
            })(<Input placeholder="不能为空" />)}
          </FormItem>
          <FormItem label="缩略图(2:1)" {...formItemLayout}>
            {form.getFieldDecorator("img_url_list", {
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (value == null || value.length <= 0) {
                      callback("必须成功上传至少一张图片");
                      return;
                    }
                    for (var i = 0; i < value.length; i++) {
                      let item = value[i];
                      if (
                        !(
                          item.url != null ||
                          _.get(item, "response.data.length") > 0
                        )
                      ) {
                        callback("有未成功上传的图片");
                        return;
                      }
                    }
                    callback();
                  }
                }
              ],
              valuePropName: "fileList",
              initialValue: this.row.img_url_list,
              getValueFromEvent: e => {
                let array = [];
                if (Array.isArray(e)) {
                  array = e;
                } else {
                  array = e.fileList;
                }
                array = array.filter(item => {
                  return item.uid;
                });
                return array;
              }
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={beforeUpload}
                multiple
                action={uploadImgUrl}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传</div>
                </div>
              </Upload>
            )}
          </FormItem>
          <FormItem label="状态" {...formItemLayout}>
            {form.getFieldDecorator("status", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: this.row["status"]
            })(
              <Select>
                <Select.Option value="UP">显示中</Select.Option>
                <Select.Option value="DOWN">已下架</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否顶部显示" {...formItemLayout}>
            {form.getFieldDecorator("banner_flag", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: this.row["banner_flag"]
            })(
              <Select>
                <Select.Option value="TRUE">是</Select.Option>
                <Select.Option value="FALSE">否</Select.Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

// 用来创建表单验证的必要逻辑
MyModal = Form.create()(MyModal);

@inject("myGlobal")
@observer
class MyTable extends React.Component {
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
  lastRequestTableParams = {};
  nowSelectedRows = [];
  @observable tableX = "100%";

  @computed get nowSelectedRow() {
    return _.get(this.dataSource, this.editingRowIndex);
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
    let rel = await tool.requestAjaxSync(deleteUrl, "post", {
      ids: [row.id]
    });
    rel = rel.data;
    if (rel.state == 1) {
      this.fetchDataSource();
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
    let rel = await tool.requestAjaxSync(deleteUrl, "post", {
      ids: ids
    });
    rel = rel.data;
    if (rel.state == 1) {
      this.fetchDataSource();
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
    this.columns = [
      {
        title: "主题名称",
        dataIndex: "theme_name", // dataIndex 和 key 需要一致
        key: "theme_name",
        filterType: "string", // 表示过滤字符串,string,date
        width: 150,
        sorter: true, // 是否可排序
        align: "center" // 列文字排版
      },
      {
        title: "缩略图",
        dataIndex: "img_url_list",
        key: "img_url_list",
        align: "center",
        width: 150,
        render: (text, row, index) => {
          let imgUrl = row.img_url_list || [];
          return (
            <a href={imgUrl[0]} target="__blank">
              <img className="smallImg" src={imgUrl[0]} />
            </a>
          );
        }
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = "";
          switch (text) {
            case "UP":
              relText = "显示中";
              break;
            case "DOWN":
              relText = "已下架";
              break;
          }
          return (
            <span style={{ color: text == "UP" ? "#237804" : "" }}>
              {relText}
            </span>
          );
        }
      },
      {
        title: "是否顶部显示",
        dataIndex: "banner_flag",
        key: "banner_flag",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = text == "TRUE" ? "是" : "否";
          return <span>{relText}</span>;
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
                style={{ color: "#1890ff", cursor: "pointer", display: "none" }}
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
  async fetchDataSource(params) {
    this.loading = true;
    params = params || this.lastRequestTableParams;
    let data = await tool.requestAjaxSync(getUrl, "post", {
      getTableDataParams: params
    });
    data = data.data;
    this.dataSource = data.datas.map(item => {
      return {
        key: item.id,
        ...item
      };
    });
    this.pagination.total = data.tableInfo.total;
    this.loading = false;
    this.lastRequestTableParams = params;
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

  addRow() {
    this.editWindowVisible = true;
  }

  async handleTableChange(pagination, filters, sorter) {
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
      <div className="themeManageTable" ref="myTable">
        <div className="tool">
          {this.props.mode == "edit" ? (
            <React.Fragment>
              <Button type="primary" onClick={this.addRow.bind(this)}>
                增加
              </Button>
              <Button
                type="danger"
                style={{ display: "none" }}
                onClick={this.handleRowsDelete.bind(this)}
              >
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
          scroll={{ x: tableX, y: this.tableHeight }}
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
        {this.editWindowVisible ? (
          <MyModal
            editingRowIndex={this.editingRowIndex}
            relativeRow={this.nowSelectedRow}
            visible={this.editWindowVisible}
            cancelWindow={() => {
              this.editWindowVisible = false;
            }}
            reFetchDataSource={() => {
              this.fetchDataSource(this.lastRequestTableParams);
            }}
            resetChoosedRow={() => {
              this.editingRowIndex = -1;
            }}
            columns={this.columns}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

@inject("myGlobal")
@observer
class ThemeManage extends React.Component {
  render() {
    return (
      <div className="themeManage" ref="themeManage">
        <h2>主题管理</h2>
        <div className="tablePanel">
          <MyTable mode="edit" />
        </div>
      </div>
    );
  }
}

export default ThemeManage;

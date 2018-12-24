import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import MyRichText from "../myRichText/myRichText.jsx";
import {
  Select,
  DatePicker,
  message,
  Upload,
  Icon,
  Table,
  Input,
  Button,
  Form,
  Modal
} from "antd";
import "./myTable.css";
import Mock from "mockjs";
import tool from "@/tools/tool.js";

const FormItem = Form.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
let tableName = "",
  updateTableUrl = "", // 更新表格的地址
  FormProps = {}; // 用来存储form表单里编辑过的所有对象的值

/**
 * 更新表格信息
 */
async function updateRowWithServer(type, datas) {
  let rel = {};
  try {
    rel = await tool.requestAjaxSync(updateTableUrl, "post", {
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
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJPG && isLt2M;
}

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

  componentDidMount() {}

  componentDidUpdate() {}

  /**
   * 保存
   */
  async handleEditWindowSave() {
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      console.log(values);
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
      this.handleCancelEditWindow();
    });
  }

  handleCancelEditWindow() {
    this.addRowMode = false;
    this.row = {};
    this.props.resetChoosedRow();
    this.props.cancelWindow();
  }

  render() {
    let rowIndex = this.props.editingRowIndex,
      formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      columns = this.props.columns;

    if (rowIndex == -1 && !this.addRowMode) return <div />;
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
          {columns.map(column => {
            if (column.editWindow == null) return;
            if (column.editWindow.type == "input") {
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
                        message: "不能为空"
                      }
                    ],
                    initialValue: this.row[column.key]
                  })(
                    <Input
                      placeholder="不能为空"
                      {...column.editWindow.moreSet}
                    />
                  )}
                </FormItem>
              );
            } else if (column.editWindow.type == "imgs") {
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
                        message: "必须上传至少一张图片"
                      }
                    ],
                    getValueFromEvent(...args) {
                      // 重新定义返回的值的类型
                      let list = args[0].fileList;
                      list = list.map(item => {
                        let url = _.get(item, 'response["image-url"]');
                        return {
                          url: url || item.thumbUrl,
                          uid: item.uid
                        };
                      });
                      return list;
                    },
                    initialValue: this.row[column.key]
                  })(
                    <Upload
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={column.editWindow.imgCount > 1}
                      beforeUpload={beforeUpload}
                      multiple
                      // customRequest={(option)=>{
                      //   alert('yes');
                      //   console.log(option);
                      // }}
                      action="https://sp.tkfun.site/upload"
                      defaultFileList={this.row[column.key]}
                      onPreview={file => {
                        var html = `<html><body>
          <img width="100%" src="${file.thumbUrl}" />
        </body></html>`;
                        let a = window.open();
                        a.document.write(html);
                      }}
                      onChange={info => {
                        if (info.file.status === "uploading") {
                          return;
                        } else if (
                          info.file.status === "done" ||
                          info.file.status === "error"
                        ) {
                        }
                      }}
                      {...column.editWindow.moreSet}
                    >
                      {column.editWindow.imgCount <= 1 ? (
                        <React.Fragment>
                          {((this.imgUrl = this.props.form.getFieldValue(
                            column.key
                          )),
                          this.imgUrl.length) > 1 ? (
                            <div>
                              <img
                                src={_.get(this, "imgUrl[0].url")}
                                style={{ width: "100%" }}
                                alt="avatar"
                              />
                            </div>
                          ) : (
                            <div>
                              <Icon type="plus" />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          )}
                        </React.Fragment>
                      ) : (
                        <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">上传</div>
                        </div>
                      )}
                    </Upload>
                  )}
                </FormItem>
              );
            } else if (column.editWindow.type == "select") {
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
                        message: "不能为空"
                      }
                    ],
                    initialValue: this.row[column.key]
                  })(
                    <Select {...column.editWindow.moreSet}>
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
            } else if (column.editWindow.type == "richText") {
              return (
                <FormItem
                  key={column.key}
                  label={column.title}
                  {...formItemLayout}
                >
                  <MyRichText
                    value={this.row[column.key]}
                    onChange={(html, text) => {
                      this.row[column.key] = html;
                    }}
                  />
                </FormItem>
              );
            } else {
              return (
                <FormItem
                  key={column.key}
                  label={column.title}
                  {...formItemLayout}
                >
                  {column.editWindow.customRender(
                    this.props.form,
                    this.row,
                    column
                  )}
                </FormItem>
              );
            }
          })}
        </Form>
      </Modal>
    );
  }
}

// 用来创建表单验证的必要逻辑
MyModal = Form.create({
  onFieldsChange(props, changedFields) {
    // for (let key in changedFields) {
    //   if (_.get(changedFields, `[${key}].value.file`) != null) {
    //     FormProps[key] = changedFields[key].value.fileList;
    //   } else {
    //     FormProps[key] = changedFields[key].value;
    //   }
    // }
  }
})(MyModal);

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
    this.initTable();
  }

  componentWillMount() {
    updateTableUrl = this.props.myGlobal.tableUrl;
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
    // alert(this.refs.myTable.offsetHeight);
    // alert(this.refs.myTable.offsetHeight + "-" + this.tableHeight);
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
          "imgs|2-2": [
            {
              uid: "@integer(1,1000)",
              "url|1": [
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544962465147&di=91a2f0c83ce1ee20733ca0b659a32152&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111023%2F8104044_230939695000_2.jpg",
                "http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg"
              ]
            }
          ],
          "state|1": ["lowerShelf", "inDisplay"],
          "topping|1": ["0", "1"]
        }
      ]
    }).list;

    this.dataSource = data;
    this.pagination.total = data.length;
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

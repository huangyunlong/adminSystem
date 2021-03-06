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
  Button,
  Radio
} from "antd";
import tool from "../tools/tool.js";
import Mock from "mockjs";
import admin from "./admin.jpg";
import "./goodsManage.css";
import MyRichText from "../components/myRichText/myRichText.jsx";
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let publicUrl = "https://sp.tkfun.site/mock/14";
publicUrl = "/manage";
publicUrl = "https://sp.roseski.com/manage";
let addUrl = publicUrl + "/goods/addData"; // 新增数据接口地址
let updateUrl = publicUrl + "/goods/updateData";
let deleteUrl = publicUrl + "/theme/deleteData";
let getUrl = publicUrl + "/goods/getData";
let getThems = publicUrl + "/theme/getThemeInfo";
let imagText = publicUrl + "/goods_dtl/getGoodsdtlInfo";
let uploadImgUrl = "/manage/images/uploadImg";

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
  @observable addImageLoading = false;
  @observable editImageLoading = false;
  @observable timeDate = [];
  @observable quantity = 0;
  componentWillMount() {
    let { editingRowIndex, relativeRow } = this.props;
    if (editingRowIndex == -1) {
      this.addRowMode = true;
    }
    if (this.addRowMode) {
      this.row = {};
    } else {
      this.row = _.clone(relativeRow);
      this.row.pic_url = this.row.pic_url;
    }
  }
  componentDidMount() {}

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
      newRow.background_pic_url =
        _.get(newRow, "pic_url.file.url") ||
        _.get(newRow, "pic_url.file.response.data[0]") ||
        newRow.pic_url;
      newRow.pic_url =
        _.get(newRow, "pic_url.file.url") ||
        _.get(newRow, "pic_url.file.response.data[0]") ||
        newRow.pic_url;
      newRow.theme_id = newRow.theme;
      delete newRow.theme;
      console.log("newRow");
      console.log(newRow.ewRow);
      // 如果是增加模式
      if (this.addRowMode) {
        delete newRow.dataTime;
        newRow.begin_time = this.timeDate[0]; // 卡券使用开始时间
        newRow.end_time = this.timeDate[1]; // 卡券使用结束时间
        newRow.quantity = Number(this.quantity);
        newRow.is_show = eval(newRow.is_show.toLowerCase());
        console.log("增加");
        console.log(newRow);
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
        let newRows = {
          is_show: eval(newRow.is_show.toLowerCase()),
          theme_id: newRow.theme_id,
          id: newRow.id
        };
        console.log("newRows");
        console.log(newRows);
        rel = await tool.requestAjaxSync(updateUrl, "post", {
          editRow: newRows
        });
        rel = rel.data;
        console.log("rel");
        console.log(rel);
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
  handleUploadChange(row, info) {
    let { file, fileList } = info;
    this.addImageLoading = true;
    fileList = fileList.map(file => {
      if (file.response) {
        this.addImageLoading = false;
        file.url = file.response.data[0];
        row.pic_url = file.url;
      }
      return file;
    });
  }
  render() {
    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      { form } = this.props;
    let that = this;
    let Option = Select.Option;
    let children = []; // 主题选择
    let cardColorChildren = []; // 卡券颜色选择
    let themesList = this.props.themesList; // 主题列表
    let imgList = this.props.imgList; // 图片列表
    console.log('imglist');
    console.log(imgList)
    for (let i = 0; i < themesList.length; i++) {
      children.push(
        <Option key={Number(themesList[i].id)} value={Number(themesList[i].id)}>
          {themesList[i].theme_name}
        </Option>
      );
    }
    let cardColorList = [
      {
        cardName: "#63B359",
        id: "Color010"
      },
      {
        cardName: "#2C9F67",
        id: "Color020"
      },
      {
        cardName: "#509FC9",
        id: "Color030"
      },
      {
        cardName: "#5885CF",
        id: "Color040"
      },
      {
        cardName: "#9062C0",
        id: "Color050"
      },
      {
        cardName: "#D09A45",
        id: "Color060"
      },
      {
        cardName: "#E4B138",
        id: "Color070"
      },
      {
        cardName: "#EE903C",
        id: "Color080"
      },
      {
        cardName: "#DD6549",
        id: "Color090"
      },
      {
        cardName: "#CC463D",
        id: "Color100"
      }
    ];
    for (let i = 0; i < cardColorList.length; i++) {
      cardColorChildren.push(
        <Option
          key={cardColorList[i].id}
          value={cardColorList[i].id}
          style={{
            width: "100%",
            height: "50px",
            background: cardColorList[i].cardName
          }}
        >
          <input
            type="color"
            key={cardColorList[i].id}
            defaultValue={cardColorList[i].cardName}
          />
          {cardColorList[i].cardName}
        </Option>
      );
    }
    return (
      <Modal
        destroyOnClose
        title={this.addRowMode == true ? "增加" : "编辑"}
        width="70%"
        maskClosable
        centered
        visible={this.props.visible}
        onOk={this.handleEditWindowSave.bind(this)}
        onCancel={this.handleCancelEditWindow.bind(this)}
      >
        <Form>
          {this.addRowMode == true ? (
            <FormItem label="商品名称" {...formItemLayout}>
              {form.getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ],
                initialValue: this.row["title"]
              })(<Input placeholder="不能为空" />)}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="商品价格" {...formItemLayout}>
              {form.getFieldDecorator("price", {
                rules: [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ],
                initialValue: this.row["price"]
              })(<Input placeholder="不能为空,单位为分" />)}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="商品描述" {...formItemLayout}>
              {form.getFieldDecorator("description", {
                rules: [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ],
                initialValue: this.row["description"]
              })(<Input placeholder="不能为空" />)}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="商品使用须知" {...formItemLayout}>
              {form.getFieldDecorator("notice", {
                rules: [
                  {
                    required: true,
                    max: 20,
                    min: 1,
                    message: "不能为空,最多16个字符!"
                  }
                ],
                initialValue: this.row["notice"]
              })(<Input placeholder="不能为空" />)}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="卡券颜色" {...formItemLayout}>
              {form.getFieldDecorator("color", {
                rules: [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ],
                initialValue: this.row["color"]
              })(
                <Select style={{ width: "100%" }} placeholder="请选择卡券的颜色">
                  {cardColorChildren}
                </Select>
              )}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="缩略图(1:1)" {...formItemLayout}>
              {form.getFieldDecorator("pic_url", {
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (value == null) {
                        callback("图片不能为空");
                        return;
                      }
                      callback();
                    }
                  }
                ],
                // valuePropName: "fileList",
                initialValue: this.row.pic_url
                // getValueFromEvent: e => {
                //   console.log('e');
                //   console.log(e)
                //   let array = [];
                //   if (Array.isArray(e)) {
                //     array = e;
                //   } else {
                //     array = e.fileList;
                //   }
                //   array = array.filter(item => {
                //     return item.uid;
                //   });
                //   return array;
                // }
              })(
                <Upload
                  action={uploadImgUrl}
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  onChange={this.handleUploadChange.bind(this, this.row)}
                  onPreview={file => {
                    var html = `<html><body>
                          <img width="100%" src="${file.goods_name}" />
                        </body></html>`;
                    let a = window.open();
                    a.document.write(html);
                  }}
                >
                  {this.row.pic_url ? (
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={this.row.pic_url}
                      alt=""
                    />
                  ) : (
                    <div>
                      <Icon type={this.addImageLoading ? "loading" : "plus"} />
                      <div className="ant-upload-text">上传</div>
                    </div>
                  )}
                </Upload>
              )}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="请选择缩略图" {...formItemLayout}>
              {form.getFieldDecorator("pic_url1", {
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (value == null) {
                        callback("图片不能为空");
                        return;
                      }
                      callback();
                    }
                  }
                ],
                initialValue: this.props.imgList[2].id
              })(
                <RadioGroup name="radiogroup" className="radioSelect">
                  {this.props.imgList.map(item => {
                    console.log('item')
                    console.log(this.imgList)
                    console.log(item)                    
                    return (
                      <Radio value={item.id} key={item.id}>
                        <img src={item.img} alt="1" />
                      </Radio>
                    );
                  })}
                </RadioGroup>
              )}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="图文说明" {...formItemLayout}>
              {form.getFieldDecorator("img_text", {
                rules: [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ],
                initialValue: this.row["img_text"]
              })(<Input placeholder="图文说明" />)}
            </FormItem>
          ) : (
            ""
          )}
          <FormItem label="所属主题" {...formItemLayout}>
            {form.getFieldDecorator("theme", {
              rules: [
                {
                  required: false,
                  message: "不能为空"
                }
              ],
              initialValue: (function() {
                let arr = [];
                let themeList = _.get(that.row, "theme");
                if (themeList) {
                  themeList.map(item => {
                    arr.push(item.id);
                  });
                }
                return arr || [];
              })(),
              getValueFromEvent: e => {
                let array = [];
                if (Array.isArray(e)) {
                  array = e;
                  let crray = array.map(Number);
                  array = [...new Set(crray)];
                } else {
                  array = [];
                }
                return array;
              }
            })(
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择主题名称"
              >
                {children}
              </Select>
            )}
          </FormItem>
          <FormItem label="状态" {...formItemLayout}>
            {form.getFieldDecorator("is_show", {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: this.row["is_show"] == true ? "true" : "false"
            })(
              <Select placeholder="请选择状态">
                <Select.Option value="true" key={Math.random()}>
                  上架
                </Select.Option>
                <Select.Option value="false" key={Math.random()}>
                  下架
                </Select.Option>
              </Select>
            )}
          </FormItem>
          {this.addRowMode == true ? (
            <FormItem label="请选择使用时间段" {...formItemLayout}>
              {form.getFieldDecorator("dataTime", {
                rules: [
                  {
                    required: true,
                    message: "用户信息不能为空"
                  }
                ],
                initialValue: ""
              })(
                <RangePicker
                  onChange={(date, dateString) => {
                    this.timeDate = dateString;
                  }}
                />
              )}
            </FormItem>
          ) : (
            ""
          )}
          {this.addRowMode == true ? (
            <FormItem label="请输入卡券数量" {...formItemLayout}>
              {form.getFieldDecorator("quantity", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: "只能输入数字"
                  }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/\D/g, "");
                },
                initialValue: ""
              })(
                <Input
                  placeholder="卡券数量不能为空"
                  onChange={item => {
                    let quantity = _.get(item, "target.value");
                    this.quantity = quantity;
                  }}
                />
              )}
            </FormItem>
          ) : (
            ""
          )}
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
  @observable themesList = []; // 主题列表
  @observable imgList = (function(){
    let arr = [];
    for(var i=0; i<10; i++){
      arr.push({id:i,img:admin})
    }
    return arr;
  })();
  @observable
  pagination = {
    showSizeChanger: true,
    current: 0,
    pageSize: 10,
    total: 100,
    showTotal: total => {
      return `共 ${total} 条`;
    },
    pageSizeOptions: ["10", "20", "50", "100"]
  };
  @observable tableX = "100%";
  @observable loading = false;
  lastRequestTableParams = {};
  nowSelectedRows = [];

  @computed
  get nowSelectedRow() {
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
    }, 500);
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
   * @memberof goodsManage
   */
  defineColumns() {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "title", // dataIndex 和 key 需要一致
        key: "title",
        filterType: "string", // 表示过滤字符串,string,date
        width: 150,
        sorter: true, // 是否可排序
        align: "center" // 列文字排版
      },
      {
        title: "价格",
        dataIndex: "price", // dataIndex 和 key 需要一致
        key: "price",
        width: 150,
        sorter: true, // 是否可排序
        align: "center", // 列文字排版
        render: text => {
          let yuan = text / 100.0;
          return <span>{yuan.toFixed(2)} 元</span>;
        }
      },
      {
        title: "缩略图",
        dataIndex: "pic_url",
        key: "pic_url",
        align: "center",
        width: 150,
        render: (text, row, index) => {
          let imgUrl = row.pic_url;
          return (
            <a href={imgUrl} target="__blank">
              <img className="smallImg" src={imgUrl} />
            </a>
          );
        }
      },
      {
        title: "商品描述",
        dataIndex: "description", // dataIndex 和 key 需要一致
        key: "description",
        width: 150,
        sorter: true, // 是否可排序
        align: "center" // 列文字排版
      },
      {
        title: "商品使用须知",
        dataIndex: "notice", // dataIndex 和 key 需要一致
        key: "notice",
        width: 150,
        sorter: true, // 是否可排序
        align: "center" // 列文字排版
      },
      {
        title: "卡券颜色",
        dataIndex: "color", // dataIndex 和 key 需要一致
        key: "color",
        width: 150,
        sorter: true, // 是否可排序
        align: "center", // 列文字排版
        render: text => {
          let cardColor = text;
          switch (text) {
            case "Color010":
              cardColor = "#63B359";
              break;
            case "Color020":
              cardColor = "#2C9F67";
              break;
            case "Color030":
              cardColor = "#509FC9";
              break;
            case "Color040":
              cardColor = "#5885CF";
              break;
            case "Color050":
              cardColor = "#9062C0";
              break;
            case "Color060":
              cardColor = "#D09A45";
              break;
            case "Color070":
              cardColor = "#E4B138";
              break;
            case "Color080":
              cardColor = "#EE903C";
              break;
            case "Color090":
              cardColor = "#DD6549";
              break;
            case "Color100":
              cardColor = "#CC463D";
              break;
          }
          return (
            <span
              className="cardColorStyle"
              style={{ background: cardColor }}
            />
          );
        }
      },
      {
        title: "所属主题",
        dataIndex: "theme",
        key: "theme",
        align: "center",
        width: 120,
        render: (text, row, index) => {
          let str = "";
          row.theme.map(item => {
            str += item.title + "、";
          });
          str = str.substring(0, str.length - 1);
          return <span>{str}</span>;
        }
      },
      {
        title: "图文说明",
        dataIndex: "img_text",
        key: "img_text",
        align: "center",
        width: 120
        // render: (text, row, index) => {
        //   let str = "";
        //   row.theme.map(item => {
        //     str += item.title + "、";
        //   });
        //   str = str.substring(0, str.length - 1);
        //   return <span>{str}</span>;
        // }
      },
      {
        title: "状态",
        dataIndex: "is_show",
        key: "is_show",
        align: "center",
        sorter: true,
        width: 150,
        render: text => {
          let relText = "";
          switch (text) {
            case true:
              relText = "上架";
              break;
            case false:
              relText = "下架";
              break;
          }
          return (
            <span style={{ color: text == "true" ? "#237804" : "" }}>
              {relText}
            </span>
          );
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
    let rel = await tool.requestAjaxSync(getThems, "get", {});
    // let rel1 = await tool.requestAjaxSync(getImage,"get",{})
    // this.imgList = _.clone(rel1.data)
    this.themesList = _.clone(rel.data);
    data = data.data;
    console.log("data");
    console.log(data);
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
    let tableX = this.tableX;
    return (
      <div className="goodsManageTable" ref="myTable">
        <div className="tool">
          {this.props.mode == "edit" ? (
            <React.Fragment>
              <Button type="primary" onClick={this.addRow.bind(this)}>
                增加
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
            themesList={this.themesList}
            imgList={this.imgList}
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
class GoodsManage extends React.Component {
  render() {
    return (
      <div className="goodsManage" ref="goodsManage">
        <h2>商品管理</h2>
        <div className="tablePanel">
          <MyTable mode="edit" />
        </div>
      </div>
    );
  }
}
export default GoodsManage;

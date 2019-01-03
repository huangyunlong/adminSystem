import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./goodsManage.css";
import MyTable from "../components/myTable/myTable.jsx";
import { Button, Input, Upload, Select, Icon, message } from "antd";

function beforeUpload(file) {
  console.log(12314);
  console.log(file);
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
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

@observer
class GoodsManage extends React.Component {
  handleChange = (column, row, info) => {
    if (info.file.status === "uploading") {
      return;
    } else if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageBase64Url => {
        row[column.key] = imageBase64Url;
      });
    }
  };
  /**
   * 表头设计
   */
  defineColumn() {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "goodsName", // dataIndex 和 key 需要一致
        key: "goodsName",
        filterType: "string", // 表示过滤字符串,string,date
        width: '10%',
        align: "center", // 列文字排版
        editable: true,
        editWindow: {
          // 编辑窗口中应用什么组件,input:普通文字输入框,img:多图片上传（此时需要传递数组进去）,select:下拉列表
          type: "custom",
          customRender: (form, row, column) => {
            // 自定义渲染，如果不需要验证，也可以直接返回组件，但是需要自行改变row里面此字段的值
            // row 是行信息,form是表单对象，column是列信息
            return form.getFieldDecorator(column.key, {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: row[column.key]
            })(<Input placeholder="请输入商品名称" />);
          },
          moreSet: {} // moreSet里的所有属性都会加到对应的组件中
        }
      },
      {
        title: "价格",
        dataIndex: "goodsPrice", // dataIndex 和 key 需要一致
        key: "goodsPrice",
        filterType: "string", // 表示过滤字符串,string,date
        align: "center", // 列文字排版
        width:'6%',
        editWindow: {
          // 编辑窗口中应用什么组件,input:普通文字输入框,img:多图片上传（此时需要传递数组进去）,select:下拉列表
          type: "custom",
          customRender: (form, row, column) => {
            // 自定义渲染，如果不需要验证，也可以直接返回组件，但是需要自行改变row里面此字段的值
            // row 是行信息,form是表单对象，column是列信息
            return form.getFieldDecorator(column.key, {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: row[column.key]
            })(<Input placeholder="请输入商品价格" />);
          },
          moreSet: {}
        }
      },
      {
        title: "缩略图",
        dataIndex: "goodsImg",
        key: "goodsImg",
        align: "center",
        width: '22%',
        render: (text, row, index) => {
          return (
            <img
              onClick={() => {
                var html = `<html><body>
          <img width="100%" src=${row.goodsImg} />
        </body></html>`;
                let a = window.open();
                a.document.write(html);
              }}
              className="smallImg"
              src={row.goodsImg}
            />
          );
        },
        editWindow: {
          // 编辑窗口中应用什么组件,input:普通文字输入框,img:多图片上传（此时需要传递数组进去）,select:下拉列表
          type: "custom",
          customRender: (form, row, column) => {
            // 自定义渲染，如果不需要验证，也可以直接返回组件，但是需要自行改变row里面此字段的值
            // row 是行信息,form是表单对象，column是列信息
            return form.getFieldDecorator(column.key, {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: row[column.key]
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={this.handleChange.bind(this, column, row)}
                onPreview={file => {
                  var html = `<html><body>
                          <img width="100%" src="${file.goodsImg}" />
                        </body></html>`;
                  let a = window.open();
                  a.document.write(html);
                }}
              >
                {row[column.key] ? (
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={row[column.key]}
                    alt=""
                  />
                ) : (
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传</div>
                  </div>
                )}
              </Upload>
            );
          },
          moreSet: {} // moreSet里的所有属性都会加到对应的组件中
        }
      },
      {
        title: "商品描述",
        dataIndex: "goodsDesc",
        key: "goodsDesc",
        align: "center",
        width: '12%',
        editWindow: {
          type: "richText"
        }
      },
      {
        title: "所属主题",
        dataIndex: "itThems",
        key: "itThems",
        align: "center",
        width:'12%',
        editWindow: {
          type: "custom",
          customRender: (form, row, column) => {
            var Option = Select.Option;
            var children = [];
            for (let i = 10; i < 36; i++) {
              children.push(
                <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
              );
            }
            // 自定义渲染，如果不需要验证，也可以直接返回组件，但是需要自行改变row里面此字段的值
            // row 是行信息,form是表单对象，column是列信息
            return form.getFieldDecorator(column.key, {
              rules: [
                {
                  required: true,
                  message: "不能为空"
                }
              ],
              initialValue: row[column.key]
            })(
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please select"
                defaultValue={["主题二", "主题三", "主题一"]}
              >
                {children}
              </Select>
            );
          }
        }
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        align: "center",
        sorter: true,
        width: '10%',
        render: text => {
          let relText = "";
          switch (text) {
            case "inDisplay":
              relText = "上架";
              break;
            case "lowerShelf":
              relText = "下架";
              break;
          }
          return (
            <span style={{ color: text == "inDisplay" ? "#237804" : "" }}>
              {relText}
            </span>
          );
        },
        editWindow: {
          type: "select",
          optionList: [
            {
              title: "上架",
              value: "inDisplay"
            },
            {
              title: "下架",
              value: "lowerShelf"
            }
          ],
          moreSet: {
            showSearch: false, // 是否需要搜索框，这个属性是antd中的，可自行配置
            filterOption: (input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
          }
        }
      }
    ];
  }
  componentWillMount() {
    this.defineColumn();
  }
  render() {
    return (
      <div className="goodsManage" ref="goodsManage">
        <h2>商品管理</h2>
        <div className="tablePanel">
          <MyTable columns={this.columns} tableName="goodsManage" mode="edit" tableWidth="100%"/>
        </div>
      </div>
    );
  }
}

export default GoodsManage;
// Mock.mock({
//   "list|10-100": [
//     {
//       "key|+1": 0,
//       id: "@integer()",
//       'goodsName': "@ctitle()",
//       'goodsPrice': "@integer(1,500)",
//       "goodsImg|1": [
//             "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544962465147&di=91a2f0c83ce1ee20733ca0b659a32152&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111023%2F8104044_230939695000_2.jpg",
//             "http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg"
//           ],
//       "goodsDesc":"@ctitle",
//       "status|1": ["lowerShelf", "inDisplay"],
//       "itThems|1":["主题一","主题三","主题二"]
//     }
//   ]
// }).list;

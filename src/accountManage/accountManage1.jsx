import React from "react";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import "./accountManage1.css";
import{
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
import _ from "lodash";
/**
* 更新表格信息
*/
async function updateRowWithServer(type,datas) {
leturl="",
rel={};
try{
   rel= await tool.requestOrdinaryAjaxSync(url,"post", {
   type,
   tableName,
    ...datas
   });
}catch(error) {
    
}
rel.state=1;
rel.datas=_.merge(
{
key:Math.random()
},
datas.editRow
);
return rel;
}
constFormItem=Form.Item;
class MyModal extends React.Component {
@observable row={};
addRowMode=false;
componentWillReceiveProps(nextProps) {
letnowVisible=this.props.visible;
letnextVisible=nextProps.visible;
if(nowVisible==false&&nextVisible) {
if(nextProps.editingRowIndex==-1) {
this.addRowMode=true;
}
// 刚打开
if(this.addRowMode) {
this.row={};
}else{
this.row=nextProps.selectedRow;
}
}
}
componentDidMount() {
this.props.form.validateFields();
}



/**
 * 
 * @param {保存信息} e 
 */
asynchandleSaveData(e) {
e.preventDefault();
this.props.form.validateFields(async(error,values)=>{
if(error) {
return;
}
letnewRow=_.assign({}, this.row, values),
rel=null;
// 如果是增加模式
if(this.addRowMode) {
rel=awaitupdateRowWithServer("put", { editRow: newRow });
if(rel.state==1) {
message.success("操作成功");
}else{
message.error(操作失败,errorMsg:</span><span class="colour" style="color: rgb(249, 38, 114);">${</span><span class="colour" style="color: rgb(230, 219, 116);">rel.errorMsg</span><span class="colour" style="color: rgb(249, 38, 114);">}</span><span class="colour" style="color: rgb(230, 219, 116);">);
return;
}
newRow=rel.datas;
this.props.addRow(newRow);
}else{
rel=await updateRowWithServer("post", { editRow: newRow });
if(rel.state==1) {
message.success("操作成功");
}else{
message.error(操作失败,
    errorMsg:</span><span class="colour" style="color: rgb(249, 38, 114);">${</span><span class="colour" style="color: rgb(230, 219, 116);">rel.errorMsg</span><span class="colour" style="color: rgb(249, 38, 114);">}</span><span class="colour" style="color: rgb(230, 219, 116);">);
return;
}
newRow=rel.datas;
this.props.updateRow(newRow, this.props.editingRowIndex);
}
this.handleCancel();
});
}
/
* 模态框的取消按钮
@memberofAccountManage
/
handleCancel=()=>{
this.addRowMode=false;
this.row={};
this.props.resetChoosedRow();
this.props.cancelWindow();
};
render() {
const{
getFieldDecorator,
getFieldsError,
getFieldError,
isFieldTouched
}=this.props.form;
let formItemLayout={
labelCol: { span:4},
wrapperCol: { span:20}
};
let editorRow=this.props.editingRowIndex;
let columns=this.props.columns;
letrow=this.row;
return(
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
{columns.map(column=>{
if(column.dataIndex==="userName") {
if(this.props.operation==="编辑") {
return(
<FormItem
key={column.key}
label={column.title}
{...formItemLayout}
>
{this.props.form.getFieldDecorator(column.key, {
rules: [
{
required:true,
message:"用户信息不能为空"
}
],
initialValue: this.row[column.key]
})(<Inputdisabledplaceholder="用户信息不能为空"/>)}
</FormItem>
);
}
else{
return(
<FormItem
key={column.key}
label={column.title}
{...formItemLayout}
>
{this.props.form.getFieldDecorator(column.key, {
rules: [
{
required:true,
message:"用户信息不能为空"
}
],
initialValue:""
})(<Inputplaceholder="用户信息不能为空"/>)}
</FormItem>
);
}
}else if(column.dataIndex==="isAdime") {
if(this.props.operation=="编辑") {
return(
<FormItem
key={column.key}
label={column.title}
{...formItemLayout}
>
{this.props.form.getFieldDecorator(column.key, {
rules: [
{
required:true,
message:"管理员信息不能为空"
}
],
initialValue: this.row[column.key]
})(
<Select>
{column.editWindow.optionList.map(item=>{
return(
<Select.Optionkey={item.value} value={item.value}>
{item.title}
</Select.Option>
);
})}
</Select>
)}
</FormItem>
);
}else{
return(
<FormItem
key={column.key}
label={column.title}
{...formItemLayout}
>
{this.props.form.getFieldDecorator(column.key, {
rules: [
{
required:true,
message:"管理员信息不能为空"
}
],
initialValue:''
})(
<Select>
{column.editWindow.optionList.map(item=>{
return(
<Select.Optionkey={item.value} value={item.value}>
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
<FormItemlabel="密码"{...formItemLayout}>
{this.props.form.getFieldDecorator("passWord", {
rules: [
{
required:true,
message:"密码不能为空"
}
],
initialValue:""
})(<Inputtype="password"placeholder="密码不能为空"/>)}
</FormItem>;
</Form>
</Modal>
);
}
}
MyModal=Form.create({})(MyModal);
@observer
class AccountManage extendsReact.Component{
@observable tableHeight=0;// 表格高度
@observable editingRowIndex=-1;// 正在编辑的行在datasource中的下标
@observable editWindowVisible=false;// 是否打开编辑行窗口
@observable dataSource=[];// 表体
@observable columns=[];// 表头
@observable operation="";
@observable
pagination={
showSizeChanger:true,
current:1,
pageSize:20,
total:100,
showTotal:total=>{
return共</span><span class="colour" style="color: rgb(249, 38, 114);">${</span><span class="colour" style="color: rgb(230, 219, 116);">total</span><span class="colour" style="color: rgb(249, 38, 114);">}</span><span class="colour" style="color: rgb(230, 219, 116);">条;
},
pageSizeOptions: ["10","20","50","100"]
};
@observable loading=false;
@observable nowSelectedRows=[];
@observable
datasource=Mock.mock({
"accountList|40-100": [
{
userName:"@cname",
"isAdime|1": ["0","1"],
"key|+1":1,
"id|+1":1,
passWord:"@Id"
}
]
}).accountList;
@computed
getnowSelectedRow() {
return_.get(this.dataSource, this.editingRowIndex);
}
defineColumn() {
this.columns=[
{
title:"用户名",
dataIndex:"userName",// dataIndex 和 key 需要一致
key:"userName",
align:"center",// 列文字排版
width:"30%"
},
{
title:"是否为管理员",
dataIndex:"isAdime",
key:"isAdime",
align:"center",
sorter:true,
render:text=>{
letrelText=text==0?"否":"是";
return<span>{relText}</span>;
},
editWindow: {
optionList: [
{
title:"是",
value:"1"
},
{
title:"否",
value:"0"
}
]
}
},
{
title:"操作",
key:"action",
width:"30%",
align:"center",// 列文字排版
render: (text,record,index)=>{
return(
<span>
<a
href="javascript:;"
onClick={this.editAccount.bind(this, text, index)}
>
编辑
</a>
<Dividertype="vertical"/>
<Popconfirm
title="你确定删除此用户的数据么,删除之后无法恢复"
onConfirm={this.confirm.bind(this, text, index)}
onCancel={this.cancel.bind(this)}
okText="确认"
cancelText="取消"
>
<ahref="#">删除</a>
</Popconfirm>
</span>
);
}
}
];
}



// 获取数据
asyncfetchDataSource(params={}) {
this.loading=true;
letdata=[];
data=awaitupdateRowWithServer("get", {
getTableDataParams: {
...params
}
});
data=data.datas;
data=this.dataSource;
this.dataSource=this.datasource;
this.pagination.total=this.dataSource.length;
this.loading=false;
}
initTable() {
letparams={
pageSize: this.pagination.pageSize,
page: this.pagination.current,
sortField: this.pagination.field,
sortOrder: this.pagination.order,
searchContent: this.searchUserName
};
this.defineColumn();
this.fetchDataSource(params);
}
// 复选框的选中
rowSelection={
onChange: (selectedRowKeys,selectedRows)=>{
this.nowSelectedRows=selectedRows;
},
getCheckboxProps:record=>({
disabled: record.name==="Disabled User",// Column configuration not to be checked
name: record.name
})
};
componentWillMount() {}
componentDidMount() {
this.initTable();
setTimeout(()=>{
this.tableHeight=this.refs.myTables.offsetHeight-40-100-20;
},0);
}
// 编辑用户信息
editAccount(text,index,e) {
this.editWindowVisible=true;// 打开模态对话框
this.editingRowIndex=index;
this.operation="编辑";
}



confirm(text,index,e) {
this.deleteAccount(text, index);
}



cancel(e) {
message.success("取消删除此账号数据");
}
/
* 删除单行

@param{any}text
@param{any}index
@memberofAccountManage
*/
asyncdeleteAccount(text,index) {
let row=this.dataSource[index];
let rel=awaitupdateRowWithServer("delete", {
deleteIds: [row.id]
});
if(rel.state==1) {
this.dataSource.splice(index,1);
this.dataSource=this.dataSource.slice();// dataSource是给antd的table组件用的，table组件并没有对mobx数据做响应，所以需要重新赋值
this.pagination.total=this.dataSource.length;
this.pagination=_.clone(this.pagination);
message.success("操作成功");
}else{
message.error(操作失败,errorMsg:</span><span class="colour" style="color: rgb(249, 38, 114);">${</span><span class="colour" style="color: rgb(230, 219, 116);">rel.errorMsg</span><span class="colour" style="color: rgb(249, 38, 114);">}</span><span class="colour" style="color: rgb(230, 219, 116);">);
}
}
/
* 新增一行

@memberofAccountManage
/
addRow() {
this.operation="新增";
this.editWindowVisible=true;// 打开模态对话框
}
asynchandleRowsDelete() {
letids=this.nowSelectedRows.map(item=>{
returnitem.id;
});
letrel=awaitupdateRowWithServer("delete", {
deleteIds: ids
});
if(rel.state==1) {
if(ids.length<=0) {
message.error("请选中要删除的行");
}else{
this.dataSource=this.dataSource
.filter(item=>{
letrel=this.nowSelectedRows.findIndex(subItem=>{
returnitem.id===subItem.id;
});
returnrel===-1;
})
.slice();
this.pagination.total=this.dataSource.length;
this.pagination=.clone(this.pagination);
this.nowSelectedRows=[];
}
}else{
message.error("操作失败");
}
}
handleTableChange(paginations,filters,sorter) {
this.pagination=.merge(this.pagination, paginations);
letparams={
pageSize: this.pagination.pageSize,
page: this.pagination.current,
sortField: this.pagination.field,
sortOrder: this.pagination.order,
searchContent: this.searchUserName
};
this.fetchDataSource({
pageSize: this.pagination.pageSize,
page: this.pagination.current-1,
sortField: this.pagination.field,
sortOrder: this.pagination.order,
searchContent: this.searchUserName
});
}
componentWillReceiveProps(nextProps) {}
componentWillUpdate(nextProps,nextState) {}
componentDidUpdate() {}
render() {
return(
<divclassName="accountManage">
<h2>账户权限</h2>
<divclassName="tablePanel"ref="myTables">
<divclassName="tool">
<Buttontype="primary"onClick={this.addRow.bind(this)}>
增加
</Button>
<Buttontype="danger"onClick={this.handleRowsDelete.bind(this)}>
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
    cancelWindow={()=>{
    this.editWindowVisible=false;
    }}
    editingRowIndex={this.editingRowIndex}
    selectedRow={this.nowSelectedRow}
    addRow={newRow=>{
    this.dataSource.unshift(newRow);
    this.dataSource=this.dataSource.slice();
    this.pagination.total=this.dataSource.length;
    this.pagination=_.clone(this.pagination);
    }}
    columns={this.columns}
    operation={this.operation}
    updateRow={(newRow,index)=>{
    this.dataSource[index]=newRow;
    this.dataSource=this.dataSource.slice();
    }}
    resetChoosedRow={()=>{
    this.editingRowIndex=-1;
}}/>
</div>
</div>
);
}
}
exportdefault AccountManage;

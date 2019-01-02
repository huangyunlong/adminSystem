import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";
import tool from "../tools/tool.js";

import "./invoice.css";

@inject("myGlobal")
@observer
class Invoice extends React.Component {
  componentWillMount() {
    (async () => {
      let data = await tool.requestAjaxSync(
        this.props.myGlobal.mockUrl + "/invoice/getData",
        "get"
      );
      data = data.data;
      this.refs.richText.setHtml(data.data);
    })();
  }

  dealContent(content){
    
  }

  render() {
    return (
      <div className="invoice">
        <h2>发票规定</h2>
        <MyRichText defaultValue="加载中..." ref="richText" />
        <Button
          type="primary"
          onClick={async () => {
            let content = this.refs.richText.getHtml();
            console.log(content);
            let rel = await tool.requestAjaxSync(
              this.props.myGlobal.mockUrl + "/invoice/updateData",
              "post",
              {
                content
              }
            );
            if (rel.data.state == 1) {
              message.success("保存成功");
            }
          }}
        >
          保存
        </Button>
      </div>
    );
  }
}

export default Invoice;

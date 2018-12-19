import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";

import "./invoice.css";

@observer
class Invoice extends React.Component {
  content = "";

  render() {
    return (
      <div className="invoice">
        <h2>发票规定</h2>
        <MyRichText
          value={this.content}
          onChange={(html,text) => {
            this.content = html;
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            message.success("保存成功");
          }}
        >
          保存
        </Button>
      </div>
    );
  }
}

export default Invoice;

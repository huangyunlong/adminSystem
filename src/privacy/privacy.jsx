import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";

import "./privacy.css";

@observer
class Privacy extends React.Component {
  content = "";

  render() {
    return (
      <div className="privacy">
        <h2>隐私权条款</h2>
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

export default Privacy;

import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";
import tool from "../tools/tool.js";

import "./userNotice.css";

@inject("myGlobal")
@observer
class UseNotice extends React.Component {
  componentWillMount() {
    (async () => {
      let data = await tool.requestAjaxSync(
        this.props.myGlobal.mockUrl + "/userNotice/getData",
        "get"
      );
      data = data.data;
      this.refs.richText.setHtml(data.data);
    })();
  }

  render() {
    return (
      <div className="userNotice">
        <h2>使用须知</h2>
        <MyRichText defaultValue="加载中..." ref="richText" />
        <Button
          type="primary"
          onClick={async () => {
            let content = this.refs.richText.getHtml();
            let rel = await tool.requestAjaxSync(
              this.props.myGlobal.mockUrl + "/userNotice/updateData",
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

export default UseNotice;

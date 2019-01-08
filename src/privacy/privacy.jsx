import React from "react";
import { observable, when } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";
import tool from "../tools/tool.js";

import "./privacy.css";

@inject("myGlobal")
@observer
class Privacy extends React.Component {
  @observable richText = null;

  componentDidMount() {
    (async () => {
      let data = await tool.requestAjaxSync("/api/notice/privacy/getData", "get");
      data = data.data;
      await when(() => this.richText != null);
      this.richText.setHtml(data.data);
    })();
  }

  render() {
    return (
      <div className="privacy">
        <h2>隐私权条款</h2>
        <MyRichText defaultValue="加载中..." ref={e => (this.richText = e)} />
        <Button
          type="primary"
          onClick={async () => {
            let content = this.richText.getHtml();
            console.log(content);
            let rel = await tool.requestAjaxSync(
              "/api/notice/privacy/updateData",
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

export default Privacy;

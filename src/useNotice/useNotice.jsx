import React from "react";
import { observable, when } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, message } from "antd";
import MyRichText from "../components/myRichText/myRichText.jsx";
import tool from "../tools/tool.js";

import "./useNotice.css";

@inject("myGlobal")
@observer
class UseNotice extends React.Component {
  @observable richText = null;

  componentDidMount() {
    (async () => {
      let data = await tool.requestAjaxSync("/api/notice/userNotice/getData", "get");
      data = data.data;
      await when(() => this.richText != null);
      this.richText.setHtml(data.data);
    })();
  }

  render() {
    return (
      <div className="useNotice">
        <h2>使用须知</h2>
        <MyRichText defaultValue="加载中..." ref={e => (this.richText = e)} />
        <Button
          type="primary"
          onClick={async () => {
            let content = this.richText.getHtml();
            let rel = await tool.requestAjaxSync(
              "/api/notice/userNotice/updateData",
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

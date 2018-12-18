import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button } from "antd";
import createEditor from "../baseConfig/editorConfig";

import "./invoice.css";

@observer
class Invoice extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.createWangEditor();
  }

  createWangEditor() {
    this.editor = createEditor.initEditor(this.refs.editor);
  }

  saveEditorContent() {
    console.log(this.editor.txt.text());
  }

  render() {
    return (
      <div className="invoice">
        <h2>发票规定</h2>
        <div className="editor" ref="editor" />
        <Button type="primary" onClick={this.saveEditorContent.bind(this)}>
          保存
        </Button>
      </div>
    );
  }
}

export default Invoice;

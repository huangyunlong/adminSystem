import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import tool from "./tools/tool.js";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { renderRoutes } from "react-router-config";

@observer
class MyRoot extends React.Component {
  check() {
    let { history, location } = this.props;
    let toPath = location.pathname;
    if (tool.getCookie("userName") == null) {
      history.replace("/login");
    } else {
      if (toPath == "/") {
        history.replace("/home/useCard");
      } else {
        history.replace(toPath);
      }
    }
  }
  componentWillMount() {
    this.check();
  }

  render() {
    return renderRoutes(this.props.route.childs);
  }
}

export default MyRoot;

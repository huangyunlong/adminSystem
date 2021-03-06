import React from "react";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import ReactDom from "react-dom";
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routerConfig from "./src/baseConfig/routerConfig.js";
import "antd/dist/antd.css";

import "./src/baseStyle.css";
import { Provider } from "mobx-react";

import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

// 全局变量
import myGlobal from './src/store/store.js';

ReactDom.render(
  <HashRouter>
    <Provider myGlobal={myGlobal}>
      <LocaleProvider locale={zh_CN}>
        {renderRoutes(routerConfig)}
      </LocaleProvider>
    </Provider>
  </HashRouter>,
  document.querySelector(".app")
);

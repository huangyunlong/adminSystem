import React from "react";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { Menu, Layout, Icon } from "antd";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import tool from "../tools/tool.js";
import "./home.css";
import { userInfo } from "os";

const SubMenu = Menu.SubMenu;
const { Header, Sider, Content } = Layout;

@observer
class Home extends React.Component {
  @observable userInfo = {};
  @observable states = {
    current: "",
    openKey: ""
  };

  componentWillMount() {
    let userName = tool.getCookie("userName");
    this.userInfo.userName = userName;
    if (!userName) {
      this.logout();
    }
    let curentRoute = this.props.location.pathname.split("/")[2]; //获取当前的路由
    this.states.current = curentRoute;
    if (
      curentRoute == "useNotice" ||
      curentRoute == "privacy" 
    ) {
      this.states.openKey = "sub1";
    } else if (
      curentRoute == "userManage" ||
      curentRoute == "themeManage" ||
      curentRoute == "cardManage" ||
      curentRoute == "orderManage" ||
      curentRoute == "goodsManage"
    ) {
      this.states.openKey = "sub2";
    } else if (curentRoute == "accountManage") {
      this.states.openKey = "sub3";
    } else if (curentRoute == "useCard") {
      this.states.openKey = "sub0";
    }
  }
  menuhandleClick = e => {
    this.states.current = e.key;
  };
  logout() {
    this.props.history.replace('/login');
    tool.delCookie("userName");
  }
  render() {
    return (
      <Layout className="home">
        <Sider style={{ height: "100%", overflow: "auto" }}>
          <div className="logo">浪漫礼管理平台</div>
          {this.userInfo.userName == "admin" ? (
            <Menu
              theme="dark"
              mode="inline"
              onClick={this.menuhandleClick}
              selectedKeys={[this.states.current]}
              defaultOpenKeys={[this.states.openKey]}
            >
              <SubMenu title="卡券核销" key="sub0">
                <Menu.Item key="useCard">
                  <Link to="/home/useCard">使用卡券</Link>
                </Menu.Item>
              </SubMenu>
              {/* <SubMenu title="平台信息" key="sub1">
                <Menu.Item key="useNotice">
                  <Link to="/home/useNotice">使用须知</Link>
                </Menu.Item>
                <Menu.Item key="privacy">
                  <Link to="/home/privacy">隐私权条款</Link>
                </Menu.Item>
              </SubMenu> */}
              <SubMenu title="管理" key="sub2">
                {/* <Menu.Item key="userManage">
                  <Link to="/home/userManage">用户管理</Link>
                </Menu.Item> */}
                <Menu.Item key="themeManage">
                  <Link to="/home/themeManage">主题管理</Link>
                </Menu.Item>
                <Menu.Item key="goodsManage">
                  <Link to="/home/goodsManage">商品管理</Link>
                </Menu.Item>
                <Menu.Item key="orderManage">
                  <Link to="/home/orderManage">订单管理</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu title="设置" key="sub3">
                <Menu.Item key="userPermission">
                  <Link to="/home/accountManage">账户权限</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          ) : (
            <Menu
              theme="dark"
              mode="inline"
              onClick={this.menuhandleClick}
              selectedKeys={[this.states.current]}
              defaultOpenKeys={[this.states.openKey]}
            >
              <SubMenu title="卡券核销" key="sub0">
                <Menu.Item key="useCard">
                  <Link to="/home/useCard">使用卡券</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          )}
        </Sider>
        <Layout>
          <Header className="header" style={{ background: "#fff", padding: 0 }}>
            <div
              className="logout"
              style={{ cursor: "pointer" }}
              onClick={this.logout.bind(this)}
            >
              <Icon type="logout" />
            </div>
            <div className="userName">{this.userInfo.userName}</div>
          </Header>
          <Content ref="content" className="content">
            {renderRoutes(this.props.route.childs)}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Home;

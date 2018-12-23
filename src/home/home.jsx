import React from "react";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { Menu, Layout, Icon } from "antd";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";
import "./home.css";

const SubMenu = Menu.SubMenu;
const { Header, Sider, Content } = Layout;

@observer
class Home extends React.Component {
  @observable states = {
    homeStyle: {
      height: 0
    },
    current: "",
    openKey: ""
  };

  componentWillMount() {
    this.states.homeStyle.height = window.innerHeight;
    let curentRoute = this.props.location.pathname.split("/")[1]; //获取当前的路由
    this.states.current = curentRoute;
    if (
      curentRoute == "useNotice" ||
      curentRoute == "privacy" ||
      curentRoute == "invoice"
    ) {
      this.states.openKey = "sub1";
    } else if (
      curentRoute == "userManage" ||
      curentRoute == "themeManage" ||
      curentRoute == "invoiceManage" ||
      curentRoute == "cardManage" ||
      curentRoute == "orderManage"||
      curentRoute == "goodsManage"
    ) {
      this.states.openKey = "sub2";
    } else if(curentRoute == "accountManage") {
      this.states.openKey = "sub3";
    }
  }
  menuhandleClick = e => {
    this.states.current = e.key;
  };

  render() {
    return (
      <Layout className="home" style={Object.assign({}, this.states.homeStyle)}>
        <Sider>
          <div className="logo">XXX ADMIN SYSTEM</div>
          <Menu
            theme="dark"
            mode="inline"
            onClick={this.menuhandleClick}
            selectedKeys={[this.states.current]}
            defaultOpenKeys={[this.states.openKey]}
          >
            <SubMenu title="平台信息" key="sub1">
              <Menu.Item key="useNotice">
                <Link to="/useNotice">使用须知</Link>
              </Menu.Item>
              <Menu.Item key="privacy">
                <Link to="/privacy">隐私权条款</Link>
              </Menu.Item>
              <Menu.Item key="invoice">
                <Link to="/invoice">发票规定</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu title="管理" key="sub2">
              <Menu.Item key="userManage">
                <Link to="/userManage">用户管理</Link>
              </Menu.Item>
              <Menu.Item key="themeManage">
                <Link to="/themeManage">主题管理</Link>
              </Menu.Item>
              <Menu.Item key="goodsManage">
                <Link to="/goodsManage">商品管理</Link>
              </Menu.Item>
              <Menu.Item key="orderManage">
                <Link to="/orderManage">订单管理</Link>
              </Menu.Item>
              <Menu.Item key="invoiceManage">
                发票管理
                <Link to="/invoiceManage">发票管理</Link>
              </Menu.Item>
              <Menu.Item key="cardManage">
                <Link to="/cardManage">卡券管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu title="设置" key="sub3">
              <Menu.Item key="userPermission">
                <Link to="/accountManage">账户权限</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header className="header" style={{ background: "#fff", padding: 0 }}>
            <div className="logout">
              <Icon type="logout" />
            </div>
            <div className="userName">admin</div>
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

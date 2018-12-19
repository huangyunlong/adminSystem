import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Menu } from "antd";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";
import "./home.css";

const SubMenu = Menu.SubMenu;

@observer
class Home extends React.Component {
  @observable.deep states = {
    homeStyle: {
      height: 0
    }
  };

  componentWillMount() {
    this.states.homeStyle.height = window.innerHeight;
  }
  render() {
    return (
      <div className="home" style={Object.assign({}, this.states.homeStyle)}>
        <div className="head">
          <div className="title">
            <h3>xxx管理平台</h3>
          </div>
          <div className="user">admin</div>
          <div className="logout">退出登录</div>
        </div>
        <div className="content">
          <div className="nav">
            <Menu mode="inline" className="nav__menu">
              <SubMenu title="平台信息">
                <Menu.Item key="1">
                  <Link to="/useNotice">使用须知</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/privacy">隐私权条款</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/invoice">发票规定</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu title="管理">
                <Menu.Item key="4">
                  <Link to="/userManage">用户管理</Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/themeManage">主题管理</Link>
                </Menu.Item>
                <Menu.Item key="6">商品管理</Menu.Item>
                <Menu.Item key="7">
                    <Link to="/orderManage">订单管理</Link>                
                </Menu.Item>
                <Menu.Item key="8">发票管理
                    <Link to="/invoiceManage">发票管理</Link>                
                </Menu.Item>
                <Menu.Item key="9">
                    <Link to="/cardManage">卡券管理</Link>                
                </Menu.Item>
              </SubMenu>
              <SubMenu title="设置">
                <Menu.Item key="10">账户权限</Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div className="body">{renderRoutes(this.props.route.childs)}</div>
        </div>
      </div>
    );
  }
}

export default Home;

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
    },
    current: '',
    openKey: ''
  };

  componentWillMount() {
    this.states.homeStyle.height = window.innerHeight;
    let curentRoute = this.props.location.pathname.split('/')[1]; //获取当前的路由
    this.states.current = curentRoute
    if(curentRoute=='useNotice' || curentRoute=='privacy'|| curentRoute=='invoice'){
       this.states.openKey = 'sub1'
    }else if(curentRoute=='userManage' || curentRoute=='themeManage'|| curentRoute=='orderManage'|| curentRoute=='invoiceManage'|| curentRoute=='cardManage'|| curentRoute=='orderManageMent'){
      this.states.openKey = 'sub2'
    }else{
      this.states.openKey = 'sub3'      
    }
  }
  menuhandleClick=(e)=>{
    this.states.current =  e.key;
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
            <Menu mode="inline" className="nav__menu" onClick={this.menuhandleClick}  selectedKeys={[this.states.current]} defaultOpenKeys={[this.states.openKey]}>
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
                <Menu.Item key="6">商品管理</Menu.Item>
                <Menu.Item key="orderManage">
                    <Link to="/orderManage">订单管理</Link>                
                </Menu.Item>
                <Menu.Item key="invoiceManage">发票管理
                    <Link to="/invoiceManage">发票管理</Link>                
                </Menu.Item>
                <Menu.Item key="cardManage">
                    <Link to="/cardManage">卡券管理</Link>                
                </Menu.Item>
              </SubMenu>
              <SubMenu title="设置" key="sub3">
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

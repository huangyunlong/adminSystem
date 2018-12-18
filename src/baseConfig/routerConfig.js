import Home from '../home/home.jsx';
import UseNotice from '../useNotice/useNotice.jsx';
import Privacy from '../privacy/privacy.jsx';
import Invoice from '../invoice/invoice.jsx';
import userManage from '../userManage/userManage.jsx'
import ThemeManage from '../themeManage/themeManage.jsx';
import orderManage from '../orderManage/orderManage.jsx';
import invoiceManage from '../invoiceManage/invoiceManage.jsx';
import cardManage from '../cardManage/cardManage.jsx';


export default [{
    component: Home,
    childs: [{
        path: '/useNotice',
        component: UseNotice
    }, {
        path: '/privacy',
        component: Privacy
    }, {
        path: '/invoice',
        component: Invoice
    },{
        path: '/userManage', // 用户管理
        component: userManage
    }, {
        path: '/themeManage',
        component: ThemeManage
    },{
        path:'/orderManage', // 订单管理
        component: orderManage
    },{
        path:'/invoiceManage', // 发票管理
        component: invoiceManage
    },{
        path:'/cardManage', // 卡券管理
        component: cardManage
    }]
}];
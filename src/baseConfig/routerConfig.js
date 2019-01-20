import Home from '../home/home.jsx';
import UseNotice from '../useNotice/useNotice.jsx';
import Privacy from '../privacy/privacy.jsx';
// import Invoice from '../invoice/invoice.jsx';
import userManage from '../userManage/userManage.jsx'
import ThemeManage from '../themeManage/themeManage.jsx';
import orderManage from '../orderManage/orderManage.jsx';
// import invoiceManage from '../invoiceManage/invoiceManage.jsx';
import cardManage from '../cardManage/cardManage.jsx';
import goodsManage from '../goodsManage/goodsManage.jsx';
import accountManage from '../accountManage/accountManage.jsx';
import UseCard from '../useCard/useCard.jsx';
import MyRoot from '../myRoot.jsx';
import login from '../login/login.jsx';

export default [{
    path: '/',
    component: MyRoot,
    childs: [{
            path: '/login',
            component: login
        },
        {
            component: Home,
            path: '/home',
            childs: [{
                path: '/home/useCard',
                component: UseCard
            }, {
                path: '/home/useNotice',
                component: UseNotice
            }, {
                path: '/home/privacy',
                component: Privacy
            }, {
                path: '/home/userManage', // 用户管理
                component: userManage
            }, {
                path: '/home/themeManage',
                component: ThemeManage
            }, {
                path: '/home/orderManage', // 订单管理
                component: orderManage
            },{
                path: '/home/cardManage', // 卡券管理
                component: cardManage
            }, {
                path: '/home/goodsManage', // 商品管理
                component: goodsManage
            }, {
                path: '/home/accountManage', // 账户权限问题
                component: accountManage
            }]
        }
    ]
}];
import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '../components/common/Home'
import Login from '../components/pages/Login'
import AccountManage from '../components/pages/AccountManage'
import InfosManage from '../components/pages/InfosManage'
import DetailInfo from '../components/pages/DetailInfo'
import NotFount from '../components/pages/NotFound'
import store from "../store/index.js"
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      // log in
      path: '/login',
      meta: {
        title: 'log in',
        isCheck: false
      },
      component: Login,
    },
    {
      path: '/',
      meta: {
        isCheck: false
      },
      redirect: '/login'
    },
    {
      path: '/overview',
      meta: {
        title: '一覧',
        isCheck: true
      },
      component: Home,
      children: [{
          // infos manage
          path: '/infos',
          meta: {
            isCheck: true
          },
          component: InfosManage,
        },
        {
          // account manage
          path: '/account',
          meta: {
            isCheck: true
          },
          component: AccountManage,
        },
        {
          //detail information
          path: '/detailinfo?id=:id',
          name:'detailinfo',
          meta: {
            isCheck: true
          },
          component: DetailInfo,
        }
      ]
    },
    {
      // notfound
      path: '/notfound',
      meta: {
        // title: 'lost',
        isCheck: false
      },
      component: NotFount
    },
    {
      // redirect to notfound
      path: '*',
      meta: {
        isCheck: false
      },
      redirect: '/notfound'
    },
  ],
  
})

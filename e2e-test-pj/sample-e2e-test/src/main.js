// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import axios from 'axios'; //使ってない
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题　(theme)
import "babel-polyfill";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import store from "./store/index.js"
//moment導入
import Moment from 'moment';
Vue.prototype.$moment=Moment;

Vue.use(iView);
Vue.use(ElementUI, {size: 'small'});

Vue.prototype.$axios = axios;
// axios.defaults.baseURL = '/api/';


// 页面刷新时，重新赋值token和userId（refreshするともう一度userIdの値を代入する）
if (window.sessionStorage.getItem('userId')) {
  // store.commit('storeToken', window.sessionStorage.getItem('token'));
  store.commit('storeUserId', window.sessionStorage.getItem('userId'));

}

//使用钩子函数对路由进行权限跳转　(ページ権限を管理する)
router.beforeEach((to, from, next) => {
  // to and from are both route objects
  if(to.meta.isCheck==true){
    // if (store.state.token&&sessionStorage.getItem('userId')) {
    if (sessionStorage.getItem('userId')) {
      next();
    }
    else {
      next({
          path: '/login',
          query: {redirect: to.fullPath}
      })
    }
  }else{
    next();
  }

})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});



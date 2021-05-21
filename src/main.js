import "babel-polyfill";
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'intro.js/introjs.css'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts


//导入vxetable
import './vxeTable/vxetable'

//添加vue的prototype属性
import './vueprototype'

//扩展elementui组件
import './eleExpand'

//导入自定义组件
import './components'

// 引入文件管理器
import WlExplorer from "wl-explorer";
import "wl-explorer/lib/wl-explorer.css"
Vue.use(WlExplorer);
import '@/assets/icons/iconfont.css'

// 引入树形下拉框
import wl from "wl-vue-select";
import "wl-vue-select/lib/wl-vue-select.css"
Vue.use(wl);

import './assets/css/theme-default/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import "./assets/css/main.less";

import AutoRefreshBasic from './components/common/base/AutoRefreshBasic'
import FlowContextBroadcast from './components/common/base/FlowContextBroadcast'

import {
    readCookie
} from './utils/cookieUtil'

Vue.config.productionTip = false

//用于页面跳转后自动刷新
Vue.mixin(AutoRefreshBasic);

//用于流程页面下组件接收流程信息
Vue.mixin(FlowContextBroadcast);


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

//收集页面资源数据
/*if (process && process.env && process.env.NODE_ENV === 'development') {
    console.log(routeModules);
}*/


//火狐浏览器、去除Backspace默认事件
window.onkeydown = function (e) {
    //debugger
    let ev = document.all ? window.event : e;
    let obj = ev.target || ev.srcElement;
    let t = obj.type || obj.tagName;
    /* if(ev.code=="Backspace"){
         return false;
     }*/
    if (ev.code == "Backspace" && t != "number" && t != "NUMBER" && t != "password" && t != "PASSWORD" && t != "text" && t != "TEXT" &&
        t != "textarea" && t != "TEXTAREA" && obj.getAttribute("class").indexOf("ql-editor") == -1) {
        return false;
    }
}
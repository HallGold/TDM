import Vue from 'vue';
import Router from 'vue-router';
import modules from './modules.js'
import pathUtil from '@/utils/pathUtil.js'
import {readCookie} from "../utils/cookieUtil";
import store from "../store";

Vue.use(Router);
let routeModules = [];
for (let moduleName in modules) {
    let module = modules[moduleName];
    let res = [];
    let appCode = "";
    if (module instanceof Array) {
        res = module;
    } else {
        res = module.res;
        appCode = module.appCode;
    }
    res.forEach(item => {
        routeModules.push({
            path: '/' + moduleName + '/' + item.path,
            name: pathUtil.replaceWildcardPath('/' + moduleName + '/' + item.path),
            name2: '@/pages/' + moduleName + '/' + item.component,
            component: resolve => require(['@/pages/' + moduleName + '/' + item.component], resolve),
            meta: {
                title: item.title,
                refresh: item.refresh ? true : false,
                module: moduleName,
                isForm: item.isForm ? true : false,
                appCode: appCode,
                isShowTag: item.isShowTag ? true : false
            },
            ...(item.children ? {children: item.children} : {})
        })
    })
}


const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '首页'},
            children: [
                ...routeModules,
                {
                    path: '/myTask',
                    name: '/myTask',
                    component: resolve => require(['../pages/common/myTask.vue'], resolve),
                },
                {
                    path: '/myApply',
                    name: '/myApply',
                    component: resolve => require(['../pages/common/myApply.vue'], resolve),
                },
                {
                    path: '/taskPool',
                    name: '/taskPool',
                    component: resolve => require(['../pages/common/taskPool.vue'], resolve),
                }
                ,
                {
                    path: '/myDeliver',
                    name: '/myDeliver',
                    component: resolve => require(['../pages/common/myDeliver.vue'], resolve),
                },
                {
                    path: '/iframe/:pageid',
                    name: '/iframe',
                    component: resolve => require(['../pages/common/IFrameView.vue'], resolve),
                    /*meta: {refresh: true}*/
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../pages/common/Login.vue'], resolve)
        },
        {
            path: '/tdmhome',
            component: resolve => require(['../pages/common/tdmhome.vue'], resolve)
        },
        {
            path: '/showpage',
            component: resolve => require(['../pages/tdm/gxpt/syyy/SelfHelpNavigations.vue'], resolve)
        },
        {
            path: '/BigScreen',
            component: resolve => require(['../pages/tdm/gxpt/xxfb/sygldp/BigScreen.vue'], resolve)
        },
        {
            path: '/home',
            alias: '/syshome',
            component: resolve => require(['../pages/common/UserHome.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../pages/common/404.vue'], resolve),
            meta: {title: '404'}
        },
        {
            path: '/403',
            component: resolve => require(['../pages/common/403.vue'], resolve),
            meta: {title: '403'}
        },
        // {
        //     path: '*',
        //     redirect: '/404'
        // },
    ]
})

let decideApp = ['pms', 'mes', 'pdm','tdm'];
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, routernext) => {
    let host = window.location.host;
    let url = window.location.href;
    // 获取app
    let app = url.split(host)[1].split('#')[0].replace(/\//img, '');
    let cuurentUrl = to.path;
    let sys = cuurentUrl.slice(1).split("/")[0];
    // 如果app 不等于当前路径app 那么就强制跳转
    if ((decideApp.indexOf(sys) != -1 && app != sys) || (sys == 'qis' && app != 'pms')) {
        let newsys = sys == 'qis' ? 'pms' : sys;
        console.log('/' + newsys + '/#' + to.fullPath, '这是地址拼接后的')

        window.location.href = '/' + newsys + '/#' + to.fullPath;
        return;
    }
    // 如果app 不是pms 那么就回到pms 首页
    if (process.env.NODE_ENV !== 'development' && app != 'tdm' && to.path == '/home') {
        window.location.href = '/tdm/#/home';
        return
    }

    if (to.path == '/login') {
        routernext();
        return
    }

    if (to.path == '/403') {
        routernext();
        return
    }

    if (to.path == '/404') {
        routernext();
        return
    }

    if (to.path == '/tdmhome') {
        routernext();
        return
    }

    // if (to.path == '/showpage') {
    //     routernext();
    //     return
    // }

    if (to.path == '/BigScreen' || to.path == '/bigScreen') {
        routernext();
        return
    }


    const cookie = readCookie();//document.cookie;

    let cookieValid = false;
    for (let key in cookie) {
        if (key.startsWith("Authorization")) {
            cookieValid = true;
            break;
        }
    }

    //debugger

    //当前登录用户信息是否有效
    let userValid = Vue.prototype.$userInfo && Vue.prototype.$userInfo.userCode ? true : false;

    //当前是否正在切换用户
    let switchUser = to.query.$temporaryUsername ? true : false;
    if (cookieValid && (userValid || switchUser)) {

        const next = (path) => {
            let pendingPath = path ? path : to.path;
            if (pendingPath.indexOf("?") != -1) {
                pendingPath = pendingPath.split("?")[0]
            }


            store.dispatch('permissionStore/openPage', {
                url: pendingPath,
                next: routernext,
                replaceUrl: path,
                appId: to.params.appId
            })
        }


        /**
         * 携带目标账号，自行判定当前登陆账号是否是目标账号，如果不是执行切换账号操作
         */
        if (to.params.$targetUser) {//需要切换账号

            if (Vue.prototype.$userInfo.userCode == to.params.$targetUser) {
                next();
            } else {
                let path = to.fullPath;
                if (path.indexOf("?") != -1) {
                    path = path + "&$temporaryUsername=" + to.params.$targetUser
                } else {
                    path = path + "?$temporaryUsername=" + to.params.$targetUser
                }
                path += "&_blank=true";
                window.open("#" + path, '_blank')
            }
        } else if (to.query.$temporaryUsername) {//临时切换为目标账号，判定标准是$temporaryUsername
            if (to.query.$temporaryUsername && Vue.prototype.$userInfo && Vue.prototype.$userInfo.userCode == to.query.$temporaryUsername) {//需要切换的账号与已登录的一致
                next()
                return;
            }
            try {
                store.dispatch('userinfoStore/switchLoginUser', {
                    targetUserCode: to.query.$temporaryUsername,
                    next,
                    isTemp: true
                })
            } catch (e) {
                console.error(e);
                Vue.$message.error("登录失败")
            }


            //继续携带$temporaryUsername参数，丢掉此参数代表账号切换为主登录帐号
        } else if (from.query.$temporaryUsername && !to.query.$temporaryUsername) {

            let path = to.fullPath;
            if (path.indexOf("?") != -1) {
                path = path + "&$temporaryUsername=" + from.query.$temporaryUsername
            } else {
                path = path + "?$temporaryUsername=" + from.query.$temporaryUsername
            }
            routernext(path);

        } else {
            next();
        }


    } else {
        routernext({path: `/login?_redirectUrl=${decodeURIComponent(to.fullPath)}`});

    }
    //}


})

router.afterEach((to, from) => {
    //页面跳转后清除上一个页面数据缓存，防止内存泄漏
    store.commit("cacheStore/clearPathCache", from.path)

    //消除上一个页面的tip
    let tipBox = document.querySelector(".vxe-table--tooltip-wrapper.theme--light.is--arrow")
    // console.log(tipBox)
    if (tipBox) {
        tipBox.style = {}
        // console.log(tipBox)
    }
})
export default router;

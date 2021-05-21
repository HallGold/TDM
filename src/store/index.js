import Vue from 'vue'
import Vuex from 'vuex'
import {MessageBox} from 'element-ui';
import menuStore from './menuStore.js'
import datamapStore from './datamapStore.js'
import permissionStore from './permissionStore.js'
import userinfoStore from './userinfoStore.js'
import questionStore from './questionStore.js'
import cacheStore from './cacheStore'
import constant from './constant'
import createPersistedState from "vuex-persistedstate"
import {readCookie} from '../utils/cookieUtil'
import qs from 'qs'
// 判断环境 vuex提示生产环境中不使用
const debug = process.env.NODE_ENV !== 'production'

const getUserCode = () => {
    const href = window.location.href
    if (href.indexOf("?") == -1) {
        return "";
    }

    const params = qs.parse(href.split("?")[1])
    if (params.$temporaryUsername) {
        return params.$temporaryUsername
    }
    return "";

}


const createPersisted = createPersistedState({
    storage: window.localStorage,
    key: 'store',
    /*   filter: store => {
            if (store.type ) {
                if(store.type.startsWith("datamapStore")){
                    return false
                }
            }
            return true
           //console.log("====", store)
       },*/
    getState(key, storage) {
        const userCode = getUserCode()
        let itemKey = ""
        if (userCode) {
            itemKey = key + "." + userCode
        } else {
            itemKey = key
        }


        const cookies = readCookie()
        let hasUserCookie = false;
        if (userCode) {
            if (cookies["Authorization###" + userCode]) {
                hasUserCookie = true;
            }
        } else {
            if (cookies["Authorization"]) {
                hasUserCookie = true;
            }
        }
        if (!hasUserCookie) {
            return null;
        }


        const itemContent = storage.getItem(itemKey)
        if (!itemContent) {
            return null
        }

        return JSON.parse(itemContent).state
    },
    setState(key, state, storage) {
        let userCode = getUserCode()

        /**
         * 用于解决用户不走退出登录流程，直接再次切换账号登录
         */
        let itemKey = "";
        if (userCode) {
            itemKey = key + "." + userCode
        } else {
            itemKey = key
        }


        const cookies = readCookie()
        let hasUserCookie = false;
        if (userCode) {
            if (cookies["Authorization###" + userCode]) {
                hasUserCookie = true;
            }
        } else {
            if (cookies["Authorization"]) {
                hasUserCookie = true;
            }
        }
        if (!hasUserCookie) {
            return;
        }


        userCode = Vue.prototype.$userInfo ? Vue.prototype.$userInfo.userCode : ''

        let obj = JSON.parse(storage.getItem(itemKey))
        obj = obj ? obj : {}

        const beforeUserCode = obj.userCode;
        const beforeState = obj.state


        const userLoginTime = state.userinfoStore.userInfo.loginTime

        const storageLoginTime = beforeState ? beforeState.userinfoStore.userInfo.loginTime : 0


        if (userCode && beforeUserCode && beforeUserCode != userCode && (!userLoginTime || storageLoginTime > userLoginTime)) {

            MessageBox.alert("检测到您已登录其他账户,将自动刷新本页面", "警告", {
                confirmButtonText: '确定',
                type: 'warning',
                callback: action => {
                    window.location.reload(true);
                }
            })
            throw "页面信息已过期"
        } else {
            return storage.setItem(itemKey, JSON.stringify({userCode, state}))
        }

        /*if (!obj || !obj.userCode || obj.userCode == userCode || !userCode) {

                    // console.log(itemKey, {userCode, state})
                } else {

                }*/

    },
    /*filter({type}) {
        if (type.startsWith("cacheStore/")) {
            return false
        }
        return true
    }*/
})
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        menuStore,
        datamapStore,
        permissionStore,
        userinfoStore,
        questionStore,
        cacheStore,
        constant

    },
    plugins: debug ? [/*createLogger(), */createPersisted] : [createPersisted]
})

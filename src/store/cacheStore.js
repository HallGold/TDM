import Vue from 'vue'
import router from "../router";
import XEUtils from "xe-utils";

/**
 * 缓存仓库存储方式（默认按照页面路径存储）
 * 1、可以按照页面路由路径存储数据
 * 2、全局存储，与页面路径无关
 * 3、按页面存储数据在页面回收后自动清除
 *
 */
export default {
    namespaced: true,
    state: {
        cahceLoading: [],//缓存数据加载中的列表
        cacheRepository: {},//全局缓存数据,{key:{data:data,expire:time}}
        cacheRepositoryByUrl: {}//缓存数据,{key:{data:data,expire:time}}
    },
    getters: {
        /**
         * 获取缓存数据
         * @param state
         * @returns {Function}
         */
        getCacheByKey: state => (key, global = false) => {
            let cacheData = null
            if (global) {
                cacheData = state.cacheRepository[key]
            } else {
                cacheData = XEUtils.get(state.cacheRepositoryByUrl, router.currentRoute.path + "." + key, null)
            }

            if (!cacheData) {
                return null
            }
            return cacheData.data;
        },
    },
    mutations: {
        //删除缓存
        /*removeCache(state, key) {

        },*/
        clearAllCache(state) {
            state.cahceLoading = []
            state.cacheRepository = {}
            state.cacheRepositoryByUrl = {}
        },
        clearPathCache(state, path) {
            delete state.cacheRepositoryByUrl[path]
        },
        addCache(state, {key, expire, data, global = false}) {

            state.cahceLoading = state.cahceLoading.filter(item => item !== key);
            if (global) {
                Vue.set(state.cacheRepository, key, {expire, data, ref: 1});
            } else {
                let rep = state.cacheRepositoryByUrl[router.currentRoute.path]
                if (!rep) {
                    rep = {}
                    Vue.set(state.cacheRepositoryByUrl, router.currentRoute.path, rep)
                }
                Vue.set(rep, key, {expire, data, ref: 1})
            }

        },
        //增加缓存引用计数
        /*referenceInc(state, key) {
            const cacheData = state.cacheRepository[key]
            if (!cacheData) {
                return
            }
            cacheData.ref += 1;
        },*/
        /*//减少缓存引用计数
        referenceDec(state, key) {
            const cacheData = state.cacheRepository[key]
            if (!cacheData) {
                return
            }
            cacheData.ref -= 1;
            if (cacheData.ref == 0) {
                if (state.cahceLoading.indexOf(key) != -1) {
                    state.cahceLoading = state.cahceLoading.filter(item => item !== key);
                }

                if (state.cacheRepository[key]) {
                    delete state.cacheRepository[key]
                }
            }
        }*/
    },
    actions: {
        //添加缓存数据
        addCache({commit, dispatch, state, rootGetters}, param) {

            let key = '';
            let global = false;

            if (XEUtils.isString(param)) {
                key = param
            } else {
                key = param['key']
                global = param['global']
            }


            let expire = new Date().getTime() + 10 * 60 * 1000
            if (typeof key !== 'string') {
                expire = new Date().getTime() + Number(key['expire']) * 1000
                key = key['expire']
            }

            let cacheData = null
            if (global) {
                cacheData = state.cacheRepository[key]
            } else {
                cacheData = XEUtils.get(state.cacheRepositoryByUrl, router.currentRoute.path + "." + key, null)
            }
            if (cacheData /*&& cacheData['expire'] >= new Date().getTime()*/) {
                return null
            }

            if (state.cahceLoading.indexOf(key) == -1) {
                state.cahceLoading.push(key)
            } else {
                return null
            }

            return data => {
                commit("addCache", {key, expire, data, global})
            }
        },


        //清理缓存数据
        /*clearExpiredCache({commit, dispatch, state, rootGetters}) {
            for (let key in state.cacheRepository) {
                const cacheData = state.cacheRepository[key]
                if (cacheData['expire'] < new Date().getTime()) {
                    commit("removeCache", key)
                }
            }
        }*/

    }
}

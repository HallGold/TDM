import Vue from 'vue';
import {Message} from 'element-ui'

export default {
    namespaced: true,
    state: {
        pagePermission: {},
        currentUrl: '',
        pageIdUrlMap: {}
    },
    getters: {
        getPageFunAuth: state => (funCode) => {
            const pagePermission = state.pagePermission[state.currentUrl]
            if (!pagePermission) {
                return true;
            }

            //无需授权
            if (pagePermission.funcAuthEnabled == 'N') {
                return true;
            }

            //整体授权
            if (pagePermission.funcAuthMode == 'A') {
                return true;
            }

            return pagePermission.authFuncCodes[funCode]
        },
        getPagePermission(state) {
            return state.pagePermission[state.currentUrl]
        },
        getPagePermissionByUrl: state => (url) => {
            return state.pagePermission[url]
        },
        /**
         * 判定当前页面是否是流程表单页面
         * @param state
         * @returns {boolean}
         */
        isFormPager(state) {
            if (!state.currentUrl) {
                return false
            }
            const pageInfo = state.pagePermission[state.currentUrl]
            if (!pageInfo) {
                return false
            }
            if (pageInfo.pageGroup == '20') {
                return true
            } else {
                return false
            }
        }
    },
    mutations: {
        setCurrentUrl(state, url) {
            state.currentUrl = url;
        },
        addPagePermission(state, {url, permission}) {
            state.pagePermission[url] = permission;
        },
        addPageIdUrlItem(state, {id, url}) {
            state.pageIdUrlMap[id] = url;
        },
        cleanPermissions(state) {
            state.pagePermission = {};
            state.currentUrl = ''
            state.pageIdUrlMap = {}
        }
    },
    actions: {

        /**
         * 加载页面信息
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param id  页面id
         * @param url  或者页面url
         * @returns {Promise<*>}
         */
        async getPageAuthInfo({commit, dispatch, state, rootGetters}, {id, url}) {

            if (!state.pagePermission[url]) {
                let params = {};
                let data = null;
                if (url && url.startsWith("/iframe/")) {
                    id = url.replace("/iframe/", "");
                }

                if (id) {
                    data = await dispatch('getPageAuthInfoById', id)
                } else {
                    params['pageUrl'] = url
                    let result = await Vue.prototype.$axios.get("/permission/auth/user/get_page_auth_info", {
                        params: params,
                        headers: {
                            'resuest-from': 'pageAuth'
                        }
                    })
                    data = result.data

                }

                if (data.pageGroup == '30') {
                    url = `/iframe/${data.pageId}`
                } else {
                    url = data.pageUrl
                }
                data.$url = url;
                commit("addPagePermission", {url, permission: data})
                commit('addPageIdUrlItem', {id: data.pageId, url});
                return data;
            } else {
                return state.pagePermission[url];
            }


        },


        /**
         * 加载页面信息by id
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param id  页面id
         * @param url  或者页面url
         * @returns {Promise<*>}
         */
        async getPageAuthInfoById({commit, dispatch, state, rootGetters}, id) {

            if (state.pageIdUrlMap[id]) {
                return await dispatch('getPageAuthInfo', {url: state.pageIdUrlMap[id]})
            }

            let params = {};
            let data = null;
            params['pageId'] = id
            let result = await Vue.prototype.$axios.get("/permission/auth/user/get_page_auth_info_byid", {
                params: params,
                headers: {
                    'resuest-from': 'pageAuth'
                }
            })
            data = result.data

            return data;
        },


        /**
         * 通过页面id打开页面
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param id
         * @param next
         * @returns {Promise<void>}
         */
        async openPageById({commit, dispatch, state, rootGetters}, {id, next}) {
            let data = null;
            try {
                data = await dispatch("getPageAuthInfo", {id})
                next(data)
            } catch (e) {
                if (e.code == 70001) {
                    next({'$url': "/403"})
                } else {
                    Message.error(e.msg);
                }
            }

        },


        //通过url打开页面
        async openPage({commit, dispatch, state, rootGetters}, {url, next, replaceUrl, appId}) {
            try {

                const pagePermission = await dispatch("getPageAuthInfo", {url})
                commit("setCurrentUrl", url)
                //判断是否有权限进入

                if (pagePermission) {

                    if (appId) {
                        await this.dispatch('menuStore/setAppCode', appId)
                    } else {
                        const appIds = pagePermission.appIds;
                        if (appIds && appIds.length > 0) {

                            if (appIds.indexOf(rootGetters['menuStore/getAppCode']) == -1) {
                                await this.dispatch('menuStore/setAppCode', appIds[0])
                            }
                        }
                    }


                    if (replaceUrl) {
                        console.log(replaceUrl)
                        next(replaceUrl)
                    } else {
                        next()
                    }

                } else {
                    if (process && process.env && process.env.NODE_ENV === 'development') {
                        if (replaceUrl) {
                            console.log(replaceUrl)
                            next(replaceUrl)
                        } else {
                            next()
                        }
                    } else {
                        next("/403")
                    }


                }


            } catch (e) {
                // debugger
                if (e.code == 70001) {
                    next("/403")
                } else {
                    Message.error(e.msg);
                }

            }

        }

    }
}

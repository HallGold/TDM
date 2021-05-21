import Vue from 'vue';
import {Message} from 'element-ui';

export default {
    namespaced: true,
    state: {
        collapse: false,//折叠菜单
        tagsList: [],//已打开tag列表
        menusState: {},//菜单列表appcode:menus
        appcode: '',
        isBlank: false//是否不显示左边菜单及tags
    },
    getters: {
        getAppCode(state) {
            return state.appcode;
        },
        getCachedTagsList(state) {
            return state.tagsList.filter(item => !item.refresh).map(item => item.name);
            ;
        },

        getTagsList(state) {
            return state.tagsList;
        },

        menus(state) {
            if (state.menusState[state.appcode]) {
                return state.menusState[state.appcode]
            } else {
                return []
            }
        },
        flatMenus(state) {
            let flatMenus = [];

            let rootMenus = []

            if (state.menusState[state.appcode]) {
                rootMenus = state.menusState[state.appcode]
            }

            const menuFlat = (flatMenus, menus) => {
                menus.forEach(item1 => {

                    if (item1.children && item1.children.length > 0) {
                        menuFlat(flatMenus, item1.children)
                    } else {
                        flatMenus.push(item1);
                    }
                })
            }

            menuFlat(flatMenus, rootMenus);
            return flatMenus;
        }

    },
    mutations: {
        collapseChage(state, collapse) {
            if (collapse != undefined) {
                state.collapse = collapse;
            } else {
                state.collapse = state.collapse ? false : true;
            }
        },
        setTagsList(state, tagsList) {
            state.tagsList = tagsList//tagsList.map(item => item.path)

        },

        addTags(state, tag) {
            state.tagsList.push(tag)
        },

        shiftTag(state) {
            state.tagsList.shift()
        },

        getTagByPath(state, path) {
            return state.tagsList.find(item => {
                return item.path === path;
            })
        },

        closeTag(state, index) {
            const removedList = state.tagsList.splice(index, 1)
        },

        closeAllTags(state) {
            state.tagsList = []
        },
        closeOtherTags(state, currentTag) {
            console.log(currentTag)
            const current = state.tagsList.find(item => {
                return item.path === currentTag;
            })
            state.tagsList = [current]
        },
        closeTagByurl (state, path) {
            const index = state.tagsList.findIndex(item => {
                return item.path === path;
            })
            const removedList = state.tagsList.splice(index, 1)
        },

        resetState(state) {
            state.collapse = false;//折叠菜单
            state.tagsList = [];//已打开tag列表
            state.menusState = {};//菜单列表
            state.isBlank = false;//是否不显示左边菜单及tags
            state.appcode = ''
        },
        setAppMenus(state, {appCode, menus}) {
            state.menusState[appCode] = menus;
        },
        setActiveAppCode(state, appCode) {
            state.appcode = appCode;
        }
    },
    actions: {
        async loadAppMenus({commit, dispatch, state}, appCode) {
            if (state.menusState[appCode]) {
                return state.menusState[appCode];
            } else {
                try {
                    const {data: menus} = await Vue.prototype.$axios.get("/permission/auth/user/get_auth_appmenu", {params: {appId: appCode}})
                    commit('setAppMenus', {appCode, menus});
                    return menus
                } catch (e) {
                    Message.error("菜单加载失败");
                }
            }


        },
        async getAppMenus({commit, dispatch, state}, appCode) {
            if (state.menusState[appCode]) {
                return state.menusState[appCode]
            } else {
                const menus = await dispatch("loadAppMenus", appCode)
                return menus;
            }
        },

        async setActiveApp({commit, dispatch, state}, appCode) {
            const menus = await dispatch("getAppMenus", appCode)

            if (menus) {
                commit('setTagsList', []);
                commit('setActiveAppCode', appCode);
                return menus;
            } else {
                return null;
            }
        },

        async setAppCode({commit, dispatch, state}, appCode) {

            await dispatch("loadAppMenus", appCode)
            commit('setActiveAppCode', appCode);
        }

    }

}

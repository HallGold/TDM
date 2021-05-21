import Vue from 'vue'
import store from "./index";

let undoTimer = null;
export default {
    namespaced: true,
    state: {
        undotypecodes: [],//数据字典待处理编码
        constants: {},//数据字典缓存数据,{type:{item1:'text1',item2:'text2',}}
        disabledItems: {},//已禁用的数据字典项
    },
    getters: {
        getConstants: state => (typeCode) => {
            return state.constants[typeCode]
        },
    },
    mutations: {
        addUndoTypeCodes(state, params) {
            if (undoTimer) {
                clearTimeout(undoTimer)
                undoTimer = null;
            }
            undoTimer = setTimeout(_ => {
                store.dispatch('constant/loadDataConstant', params)
            }, 400);
        },
    },
    actions: {
        async loadDataConstant({commit, dispatch, state, rootGetters}, params) {
            console.log('执行', params)
            let {appCode, typeCode} = params;
            if (!typeCode) {
                return;
            }
            // 判定是否有值
            if (!params.autoRefresh && state.constants[typeCode]) {
                return;
            }
            const {data} = await Vue.prototype.$axios.get(`permission/app_constant/byCode?appCode=${appCode}&code=${typeCode}`);
            if (data) {
                /*return new Promise((resolve, reject) => {
                   /!* setTimeout(_ => {

                        resolve();
                    }, 0)*!/
                })*/
                let arr = data.value && data.value.split(',');
                // 去除首尾空格
                arr.map(c => {
                    c = c && c.trim();
                })
                // 筛选数据
                let narr = arr.filter(c => {
                    return c != "" && c != undefined && c != null;
                })
                state.constants[typeCode] = narr;
                console.log(state, 'state');
            }
        },
    }
}

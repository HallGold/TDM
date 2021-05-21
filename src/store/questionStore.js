import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        showable: false,//是否显示问卷调查
        /* publishId: "",//问卷发布ID,
         pagerId: "",//问卷ID*/
        publishList: []//问卷发布ID集合
    },
    getters: {
        isShow(state) {
            return state.showable && state.publishList.length > 0
        },
        publishsInfo(state) {
            return state.publishList
        }
    },
    mutations: {
        close(state) {
            state.showable = false;
        },
        show(state, publishList) {
            state.showable = true;
            if (publishList) {
                state.publishList = publishList;
            }
        },
    }
}
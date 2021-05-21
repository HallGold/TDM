import Vue from 'vue'
import {cleanCookie, readCookie, writeCookie} from '../utils/cookieUtil'
import {Notification} from 'element-ui';
import router from '@/router'


const afterLoginedHandler = store => {
    //证书过期提醒
    // setTimeout(_ => {
    //     Vue.prototype.$axios.get("/biz/BlacklistConfig/getCertNotify", {params: {}})
    //         .then(result => {
    //             let data = result.data.certNotify;
    //             if (data && data.length > 0) {
    //                 let date = data[0].certAfterDate;
    //                 let ymd = date.split("-");
    //                 let str = ymd[0] + "年" + ymd[1] + "月" + ymd[2] + "日";
    //                 Notification.error({
    //                     title: '数字证书将过期提醒',
    //                     duration: 0,
    //                     //position: 'bottom-right',
    //                     dangerouslyUseHTMLString: true,
    //                     message: "您的数字证书将于" + str + "过期，为了不影响您的工作，请在过期日前到贵单位的运维部门尽快处理!"
    //                 });
    //             }
    //             let download = result.data.download;
    //             if (download) {
    //                 window.loadFun = id => {
    //                     Vue.prototype.$axios.post("/biz/BlacklistDownload/download", {"id": download.oid}).then(success => {
    //                         Vue.prototype.$downloadFile(download.accessoryId);
    //                     })
    //                 }
    //                 window.openBlackList = _ => {
    //                     router.push("/biz/sys/blackDownload");
    //                 }
    //                 let downStr = '<button  onclick="loadFun()" type="button" class="el-button el-button--text el-button--small">\n' +
    //                     '<span>请点击下载黑名单</span></button>';
    //                 let showList = '<button onclick="openBlackList()"  type="button" class="el-button el-button--text el-button--small">\n' +
    //                     '<span>查看发布列表</span></button>';
    //                 Notification.info({
    //                     title: '数字证书黑名单下载提醒',
    //                     duration: 0,
    //                     //position: 'bottom-right',
    //                     dangerouslyUseHTMLString: true,
    //                     message: "院级数字证书已经发布，</br>" +
    //                         downStr + showList
    //                 });
    //             }
    //         })
    // }, 2000)


    //问卷调查查询

    // setTimeout(_ => {
    //     Vue.prototype.$axios.get("/biz/questionnaire/QuesPublishInfo/getvalid")
    //         .then(({data}) => {
    //             if (data) {
    //                 store.commit('questionStore/show', data)
    //             }
    //         })
    // }, 1000)

}


export default {
    namespaced: true,
    state: {
        userInfo: {},//当前登录用户信息
        tempUsersInfo: {}//切换的兼职账号信息
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getUserInfoByCode: state => (userCode) => {
            return state.tempUsersInfo[userCode]
        }
    },
    mutations: {
        //设置当前登录用户信息
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            if (userInfo.userCode && !state.tempUsersInfo[userInfo.userCode]) {
                state.tempUsersInfo[userInfo.userCode] = userInfo;
            }
        },
        addTempUserInfo(state, userInfo) {
            if (userInfo.userCode) {
                state.tempUsersInfo[userInfo.userCode] = userInfo;
            }
        },
        cleanUserInfo(state) {
            state.userInfo = {};
            state.tempUsersInfo = {};
        }
    },
    actions: {

        async login({commit, dispatch, state}, {userInfo, next, isTemp = false}) {
            let accessToken = userInfo.accessToken;
            delete userInfo.accessToken
            userInfo.loginTime = new Date().getTime()

            //写cookie


            //Vue.prototype.$userInfo = null;

            if (!isTemp) {
                this.commit("menuStore/resetState")
                this.commit("datamapStore/resetStateDataMap")
                this.commit("userinfoStore/cleanUserInfo")
                this.commit("permissionStore/cleanPermissions")
                cleanCookie();
                writeCookie(`Authorization`, accessToken);
                writeCookie(`Authorization`, accessToken);
                commit("setUserInfo", userInfo);
            } else {
                commit("addTempUserInfo", userInfo);
            }
            writeCookie(`Authorization###${userInfo.userCode}`, accessToken);
            //记录登录信息
            // Vue.prototype.$userInfo = userInfo;

            //执行登录成功后置逻辑
            afterLoginedHandler(this)

            next()
        },


        async switchLoginUser({commit, dispatch, state}, {targetUserCode, next, isTemp = false}) {
            if (targetUserCode && state.userInfo.userCode == targetUserCode) {//需要切换的账号与已登录的一致
                next()
                return;
            }

            const targetUserCookie = readCookie({});

            if (!state.tempUsersInfo[targetUserCode] || targetUserCookie[`Authorization###${targetUserCode}`]) {//登录历史中不存在此账号，需要走登录流程


                /**
                 * 请求参数携带兼职账号登陆名，执行兼职账号登陆
                 */
                const {data: userInfo} = await Vue.prototype.$axios.post("/login", {
                    mode: "SYSTEM-INNER",
                    username: targetUserCode
                })

                dispatch("login", {userInfo, next, isTemp})

            } else {
                commit("setUserInfo", state.tempUsersInfo[targetUserCode]);
                // Vue.prototype.$userInfo = state.tempUsersInfo[targetUserCode];
                next();
            }


        }
    }
}
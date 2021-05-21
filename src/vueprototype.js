import Vue from 'vue'
import axios from "axios";
import qs from "qs";
import store from './store'
import moment from "moment";
import router from "./router";
import {writeCookie} from './utils/cookieUtil'
import MD5 from 'md5.js'

Vue.prototype.$apicontext = '/api/'

//获取当前临时用户名
const gettemporaryUsername = () => {
    let hash = window.location.hash

    const pair = hash.split("?")
    if (!pair || pair.length != 2) {
        return null;
    }
    const query = qs.parse(pair[1])

    if (query['$temporaryUsername']) {
        return query['$temporaryUsername']
    } else {
        return null
    }
}


/**
 * 加载用户信息
 * 通过定义Vue原型对象设置用户信息
 */
Object.defineProperty(Vue.prototype, "$userInfo", {
    get() {
        let temporaryUsername = gettemporaryUsername();
        if (temporaryUsername) {
            return store.getters['userinfoStore/getUserInfoByCode'](temporaryUsername);
            // Vue.prototype.$userInfo = store.getters['userinfoStore/getUserInfoByCode'](temporaryUsername)
        } else {
            return store.getters['userinfoStore/getUserInfo'];
            // Vue.prototype.$userInfo = store.getters['userinfoStore/getUserInfo']
        }
    },
    set(val) {
        throw "$userInfo 不允许修改"
    }
})


//设置全局axios

Vue.prototype.$axios = axios.create({
    baseURL: Vue.prototype.$apicontext,
    timeout: 30000,
    withCredentials: true,
    transformRequest: [function (data, headers) {

        let temporaryUsername = gettemporaryUsername();
        if (temporaryUsername) {
            headers["Auth-Cookie"] = temporaryUsername;
        }


        if (data && data.$json) {
            headers['Content-Type'] = 'application/json'
            return JSON.stringify(data.$json);
        }


        if (headers['Content-Type'] == 'application/x-www-form-urlencoded' && !(data instanceof FormData)) {
            return qs.stringify(data, {
                /*arrayFormat: 'repeat',*/
                allowDots: true,
                serializeDate: (date) => {
                    return moment(date).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        } else {
            return data;
        }

    }],
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            /*arrayFormat: 'repeat',*/
            allowDots: true,
            serializeDate: (date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
        })
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // ,'x-forwarded-for':'10.99.12.80'
    }

});


/**
 * 对所有请求进行数据签名，防止伪造请求
 */
Vue.prototype.$axios.interceptors.request.use(function (request) {
    let headers = request.headers;
    let urlArr = request.url.split("?")
    let rootUrl = urlArr.length > 1 ? urlArr[0] : request.url

    if (!rootUrl.startsWith("/")) {
        rootUrl = "/" + rootUrl
    }

    if (headers["Sign-Headers"]) {
        let md5String = `[${rootUrl}]`
        let signHeaders = headers["Sign-Headers"].split(",")
        signHeaders.forEach(item => {
            let value = headers[item]
            if (!value) {
                value = "";
            }
            md5String += `(${value})`;
        })
        headers["Sign"] = new MD5().update(md5String).digest('HEX').toUpperCase()
    }
    return request
})
let logoutAlert = false;

//设置全局返回处理
Vue.prototype.$axios.interceptors.response.use(function (response) {


        if (response.headers['accesstoken'] && response.headers['accesstoken-user']) {//更新cookie
            const accessToken = response.headers['accesstoken']
            const userCode = response.headers['accesstoken-user'];
            const age = Number(response.headers['accesstoken-age']) * 60;

            if (userCode == Vue.prototype.$userInfo.userCode) {
                writeCookie('Authorization', accessToken, {maxAge: age})
            }

            writeCookie(`Authorization###${userCode}`, accessToken, {maxAge: age})
        }

        if (response.headers['content-type'] &&
            (response.headers['content-type'].indexOf('application/x-download') != -1
                || response.headers['content-type'].indexOf('application/ice-xls') != -1)) {


            let filename = decodeURI(response.headers['filename']);


            let data = response.data;
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', filename);
            link.setAttribute('target', '_blank')

            document.body.appendChild(link)
            link.click()

            Vue.prototype.$nextTick(() => {
                link.remove();
            })

        } else if (response.data.code == '1') {
            response.data = response.data.data;
            return response;
        } /*else if (response.data.code == '401') {
            router.replace({path: `/login?_redirectUrl=${window.location.hash.replace("#", '')}`})
            return new Promise(() => {
            });
        }*/ else if (response.data.code == '403' || response.data.code == '401') {
            if (!logoutAlert) {
                Vue.prototype.$alert("检测到您登录已过期,将自动退出", "警告", {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                        // SessionUtil.clearUser();
                        router.replace({path: `/login?_redirectUrl=${encodeURIComponent(window.location.hash.replace("#", ''))}`});
                    }
                })
            }
            logoutAlert = true
            return new Promise(() => {
            });
        } else if (response.data.code == 70001) {
            if (response.config.headers && response.config.headers['resuest-from'] == "pageAuth") {
                return Promise.reject(response.data)
            } else {
                if (response.data.msg != '没有打开流程的权限') {
                    Vue.prototype.$message.error(response.data.msg);
                }
                return new Promise((resolve, reject) => {
                    reject(response.data);
                });
            }
        } else {
            return Promise.reject(response.data)
        }

    },
    function (error) {
        if (error instanceof axios.Cancel) {
            return new Promise(() => {
            });
        }

        if (error.response && error.response.data instanceof Blob) {
            Vue.prototype.$message.error("出错啦");
            return new Promise(() => {
            });
        }

        // debugger
        if (error.message == '401') {
            source.cancel("401");
            router.replace({path: `/login?_redirectUrl=${encodeURIComponent(window.location.hash.replace("#", ''))}`})
            return new Promise(() => {
            });
        } else if (error.message == '404') {
            return Promise.reject({code: 404, msg: '请求地址不存在', data: null, success: false})
        } else if (error.message == '403') {
            return Promise.reject({code: 403, msg: '请求地址无权访问', data: null, success: false})
        } else if (error.message == '500' || error.message == '501' || error.message == '502') {
            return Promise.reject({code: 500, msg: '服务器内部错误', data: null, success: false})
        } else if (error.code === 'ECONNABORTED') {
            return Promise.reject({code: 500, msg: '请求超时，请稍后重试', data: null, success: false})
        } else {
            return Promise.reject(error);
        }
    });


//路由跳转检查，查看目标用户与当前用户是否匹配，不匹配走切换账号流程
Vue.prototype.$routerCheckPush = (targetUser, url) => {
    if (url.indexOf("?") != -1) {
        let urlArr = url.split("?");
        let name = urlArr[0];
        let query = qs.parse(urlArr[1])
        return {path: name, params: {$targetUser: targetUser}, query: query}
    } else {
        return {path: url, params: {$targetUser: targetUser}}
    }
}

//查看图片
Vue.prototype.$showImage = (imageId) => {
    if (!imageId || imageId == 'null') {
        return "data:image/png;base64,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"
    }
    return Vue.prototype.$apicontext + "resources/image.png?id=" + imageId;
}

let downnloadByATag = (downloadKey) => {
    let link = document.createElement('a')
    link.style.display = 'none'

    const tempUsername = gettemporaryUsername();
    if (tempUsername) {
        // resources/attachment/download
        link.href = `${Vue.prototype.$apicontext}pms/XtFj/downLoad?key=${downloadKey}&Auth-Cookie=${tempUsername}`
    } else {
        link.href = `${Vue.prototype.$apicontext}pms/XtFj/downLoad?key=${downloadKey}`
    }


    /*link.setAttribute('download', filename);*/
    //link.setAttribute('target')

    document.body.appendChild(link)
    link.click()

    Vue.prototype.$nextTick(() => {
        link.remove();
    })

}

let createDownloadKey = ({userCode, expire, fileid, showSecret}) => {
    let Base64 = require('js-base64').Base64;
    let MD5 = require('md5.js')
    let sign = new MD5().update(`${userCode}[${fileid}][${expire}]`).digest('HEX').toUpperCase();
    return Base64.encode(JSON.stringify({
        expire, userCode, fileid, sign, showSecret
    }))
}

//下载文件
/**
 * 支持多附件下载，如果选择多附件则自动打包
 * @param fileIds
 * @param showSecret
 */
Vue.prototype.$downloadFile = (fileIds, showSecret = true) => {

    if (fileIds instanceof Array) {

    } else {
        fileIds = [fileIds]
    }

    if (fileIds && fileIds.length) {

        Promise.all(fileIds.map(fileId => new Promise((resolve, reject) => {
            Vue.prototype.$axios.get(`/resources/attachment/get?id=${fileId}`)
                .then(result => {

                    const file = result.data;
                    if (file && file.isSuccess) {
                        if (file.fileSecret) {

                            store.dispatch('datamapStore/getReversedDataMapAsync', {typecode: "USER_DATA_SECRET"})
                                .then(result => {
                                    let userSecret = result[Vue.prototype.$userInfo.securityLevel]
                                    if (!userSecret) {
                                        Vue.prototype.$message.error("没有找到您的密级信息,请联系管理员")
                                        reject()
                                        return
                                    }
                                    userSecret = userSecret.split(",");
                                    if (!userSecret.find(item => item == file.fileSecret)) {
                                        Vue.prototype.$message.error("您的密级不够，无法下载此文件");
                                        reject()
                                    } else {
                                        resolve({fileId: file.oid, expire: file.expire})
                                    }

                                }).catch(error => {
                                console.error(error);
                                Vue.prototype.$message.error("下载文件失败");
                                reject()
                            })

                        } else {
                            resolve({fileId: file.oid, expire: file.expire})
                            //window.open(`${Vue.prototype.$apicontext}resources/attachment/download?id=${fileId}`)
                        }

                    } else {
                        Vue.prototype.$message.error("文件不存在");
                        reject()
                    }
                })
                .catch(error => {
                    Vue.prototype.$message.error("下载文件失败");
                    reject()
                })
        }))).then(files => {
            downnloadByATag(createDownloadKey({
                userCode: Vue.prototype.$userInfo.userCode,
                expire: files[0].expire,
                fileid: files.map(file => file.fileId).join(","),
                showSecret
            }))
            ;
        }).catch(e => {

        })


    } else {
        Vue.prototype.$message.error("未找到可以下载的文件");
    }
}

Vue.prototype.$downloadFileByKey = (key) => {
    downnloadByATag(key)
}

//获取数据字典信息
Vue.prototype.$getDataMap = (...typeCodes) => {
    if (typeCodes && typeCodes.length > 0) {
        return Vue.prototype.$axios.get(`permission/dataDictionary/listByActType?typeCodes=${typeCodes.join(",")}`)
    }

}

//打开流程
Vue.prototype.$openFlow = (url, options) => {
    let signUrl = url.replace('&&', '&');
    let urlPar = signUrl.split("?");

    if (urlPar.length == 1) {
        router.push(signUrl);
        return;
    }
    const query = qs.parse(urlPar[1]);
    if (!query.dataId && !query.actInstId) {
        router.push(signUrl);
        return;
    }
    let md5String = `(${signUrl})[${Vue.prototype.$userInfo.userCode}]<${query.dataId}>`;
    const sign = new MD5().update(md5String).digest('HEX').toUpperCase()
    signUrl += `&sign=${sign}`;
    if (options && options.blank) {
        window.open('#' + signUrl + "&_blank=true", '_blank');
        return;
    }
    if (options && options.collapse) {
        signUrl += `&collapse=true`;
    }
    router.push(signUrl);
}

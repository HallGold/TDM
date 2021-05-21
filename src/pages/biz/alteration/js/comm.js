const SERVER_NAME = "/biz";
const AXIOS_TYPE_ENUM = {
    GET: `get`,
    PATCH: `patch`,
    PUT: `put`,
    DELETE: `delete`,
    POST: `post`
};
export default {
    data() {
        return {
            MESSAGE_INSTANCE: null,
            //网络区域类型分隔符
            netSeparator: "__",
            ENUM: {
                /**
                 * 网络区域类型分隔符
                 */
                NET_SEPARATOR: () => {
                    return "__";
                },
                //全部action
                ACTIONS: {
                    //获取联网类型
                    GET_NET_AREA_TYPE: {
                        URL: () => {
                            return "/pro/ProBaseArea/all";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //变更单状态枚举
                    GET_ENUM_APPR_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/getEnum?type=ApprStatus`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //实施单状态枚举
                    GET_ENUM_EXECUTE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/getEnum?type=ExecuteStatus`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //获取当前登录用户申请的变更列表
                    GET_CURRENT_USER_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/currentUserList`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //新增变更单
                    ADD_ALTERATION: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //根据ID获取变更单详情
                    VIEW_ALTERATION: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/getDetail`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //删除变更单
                    DELETE_ALTERATION: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/del`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    //获取单个实施信息
                    GET_EXECUTE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/get`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //加载其他人员实施
                    GET_OTHER_EXECUTE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteDetail/otherLst`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //加载自己的实施明细和变更对象
                    GET_EXCUTE_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteDetail/myList`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存实施明细和变更对象
                    SAVE_EXECUTE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteDetail/saveOrUpdate`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //根据变更单号获取变更排程列表
                    GET_ALTERATION_EXECUTE_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/getExecListByNum`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //分派
                    ASSIGN: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/saveBatch`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.POST
                    },
                    //删除实施单列表
                    DEL_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/delList`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    //实施查询
                    QUERY_EXECU_PAGE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/page`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据变更单号获取实施list
                    GET_ALL_EXEC_BY_ALTERATION_NUM: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/getAllExecByAlterationNum`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //查询变更审批列表
                    QUERY_ALTERATION_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/listAll`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //查询实施中的变更列表
                    QUERY_EXEC_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/execList`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //受理
                    EXECUTE_ACCEPT: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/accept`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //获取单个实施对象
                    GET_EXECUTE_BY_OID: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/get`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //退回
                    REJECT_EXECUTE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/rejectFlow`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //撤回
                    DESTORY_EXECUTE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/destoryFlow`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //创建子流程
                    CREATE_EXECU_FLOW: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlterationExecuteAf/createExecuFlow`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //根据变更单号获取变更主对象
                    GET_BY_ALTERATION_NUM: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizAlteration/getByAlterationNum`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                //AJAX请求返回代码枚举
                RETURN_VALUE: {
                    SUCCESS: 1,
                    PARAM_IS_INVALID: 10001,
                    properties: {
                        1: {name: "成功", code: 1},
                        10001: {name: "参数无效", code: 10001}
                    }
                },
                BUTTON: {
                    ADD: {name: '新增', icon: 'el-icon-plus', type: 'primary'},
                    ADD_OLD: {name: '补录', icon: 'el-icon-edit', type: 'primary'},
                    CONTACT: {name: '关联', icon: 'el-icon-plus', type: 'primary'},
                    DELETE: {name: '删除', icon: 'el-icon-delete', type: 'primary'},
                    DELETES: {name: '删除', icon: 'el-icon-delete', type: 'primary'},
                    ADD_DEV: {name: '新增变更对象', icon: 'el-icon-plus', type: 'primary'},
                    LOAD_ALL_DEV: {name: '查看所有变更对象', icon: 'el-icon-plus', type: 'primary'},
                    EXPORT: {name: '导出', icon: 'el-icon-upload', type: 'export', selectable: true}
                },
                //操作
                OPERATION: {
                    EDIT: {name: "编辑"},
                    VIEW: {name: "详情", dbclick: true},
                    RETRACT: {name: "撤回"},
                    DELETE: {name: "删除"}
                },
                //是否枚举
                YES_NO: {
                    YES: 1,
                    NO: 0,
                    properties: [
                        {name: "是", code: "1"},
                        {name: "否", code: "0"}
                    ]
                },
                //变更类型
                ALTERATION_TYPE: {
                    BZBG: 0,
                    YBBG: 1,
                    ZYBG: 2,
                    ZDBG: 3,
                    properties: [
                        {code: "0", name: "标准变更"},
                        {code: "1", name: "一般变更"},
                        {code: "2", name: "重要变更"},
                        {code: "3", name: "重大变更"}
                    ]
                },
                //紧急程度
                EMERGENT_DEGREE: {
                    EMERGENT: 0,
                    NO_EMERGENT: 1,
                    properties: [
                        {code: "1", name: "非紧急"},
                        {code: "0", name: "紧急"}
                    ]
                },
                //变更单状态
                APPR_STATUS: {
                    ADMIN_AUDIT: null,
                    APPROVING: null,
                    BEFORE_DELIVERED: null,
                    BEFORE_EXECUTE: null,
                    CANCEL: null,
                    CLOSED: null,
                    CONFIRM_CLOSED: null,
                    DRAFT: null,
                    EXECUTING: null,
                    HANG_UP: null,
                    PLAN_EDIT: null,
                    RISK_EVALUATE: null,
                    SAFETY_AUDIT: null,
                    properties: null
                },
                //执行单状态
                EXECUTE_STATUS: {
                    DRAFT: null,
                    BEFORE_CANCEL: null,
                    BEFORE_RETURN: null,
                    BEFORE_SHIFT: null,
                    CANCEL: null,
                    DISPOSE: null,
                    HANDLING: null,
                    HANG_UP: null,
                    PRE_HANG_UP: null,
                    RETURN: null,
                    REWORK: null,
                    SHIFT: null,
                    START: null,
                    REVOKE: null,
                    properties: null
                },
                AREA: [],
                //打开页面方式
                ACTIONTYPE: {
                    ADD: "add",
                    EDIT: "edit",
                    VIEW: "view",
                },
                //路由
                ROUTER: {
                    //变更编辑页面
                    ALTERATION_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/alteration/alterationEdit", param);
                        }
                    },
                    //变更排程页面
                    ALTERATION_ASSIGN: {
                        URL: () => {
                            return this.assembleUrl("/biz/alteration/alterationAssign", ...arguments);
                        }
                    },
                    ALTERATION_EXECUTE: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/alteration/alterationExecuteEdit", param);
                        }
                    }
                },
                //实施子流程节点ID
                EXECUTE_NODE_ID: {
                    SAVE: 'FirstNode',
                    FINISH: 'finish',
                    AGREEN: 'agree',
                    TURN_ASSIGN: 'turnAssign'
                },
                //主流程节点ID
                ALTERATION_NODE_ID: {
                    ASSIGN: 'assign',
                    SAFETY_AUDIT: 'safetyAudit',
                    AUDIT_PASS: 'auditPass',
                    DO_AGAIN: 'doAgain'
                },
                OPERATE_TYPE: {
                    SUBMIT: 'submit'
                },

                //报障方式
                BREAKDOWN_NAME: {
                    BZBG: 0,
                    YBBG: 1,
                    ZYBG: 2,
                    ZDBG: 3,
                    properties: [
                        {code: "0", name: "标准变更"},
                        {code: "1", name: "一般变更"},
                        {code: "2", name: "重要变更"},
                        {code: "3", name: "重大变更"}
                    ]
                },
            }
        }
    },
    methods: {
        /**
         * 拼装跳转url
         * @param url
         * @returns {*}
         */
        assembleUrl(url) {
            let param = arguments[1];
            if (!!param) {
                let first = true;
                for (let i in param) {
                    if (first) {
                        first = false;
                        url += "?"
                    } else {
                        url += "&";
                    }
                    url += i + "=" + param[i];
                }
            }
            return url;
        },
        axios(action, params, [successHandler, failHandler, exceptionHandler], showMsg) {
            let _this = this;
            let _axiosFn = null;
            let url = action.URL(), requestType = action.TYPE;
            switch (requestType) {
                case AXIOS_TYPE_ENUM.GET:
                    params = {params: params};
                    _axiosFn = this.$axios.get;
                    break;
                case AXIOS_TYPE_ENUM.POST:
                    params = params;
                    _axiosFn = this.$axios.post;
                    break;
                case AXIOS_TYPE_ENUM.PATCH:
                    params = params;
                    _axiosFn = this.$axios.patch;
                    break;
                case AXIOS_TYPE_ENUM.PUT:
                    params = params;
                    _axiosFn = this.$axios.put;
                    break;
                case AXIOS_TYPE_ENUM.DELETE:
                    params = {params: params};
                    _axiosFn = this.$axios.delete;
                    break;
            }
            _axiosFn(url, params).then(res => {
                if (_this.frameAjaxSuccess(res, showMsg)) {
                    if (typeof successHandler == "function") {
                        successHandler(res);
                    }
                } else {
                    if (typeof failHandler == "function") {
                        failHandler(res);
                    }
                }
            }).catch(res => {
                if (typeof exceptionHandler == "function") {
                    exceptionHandler(res);
                }
            });
        },
        frameAjaxSuccess(_ret, showMsg) {
            //ajax请求是否成功判断
            if (!!_ret && !!_ret.data) {
                if (showMsg == undefined || !!showMsg) {
                    /*this.$message.success("请求成功!");*/
                }
                return true;
            }
            if (showMsg == undefined || !!showMsg) {
                this.$message.error("请求失败!");
            }
            return false;
        },
        getEnumName(_enum, _code) {
            if (typeof _code == "undefined") {
                return "";
            }
            if (!!_enum.properties[_code]) {
                return _enum.properties[_code].name;
            }
            return "";
        },
        getNameByCode(pEnumType, pCode) {
            //根据code获取name
            for (var i in pEnumType) {
                if (pEnumType[i].code == pCode) {
                    return pEnumType[i].name;
                }
            }
            return null;
        },
        //批量删除
        deletes(list, deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                list.splice(list.indexOf(deleteList[i]), 1);
            }
        },
        //根据netArea和netType获取区域
        getAreaByNetAreaAndNetType(netArea, netType) {
            let data = this.ENUM.AREA;
            if (!!netArea && !!netType) {
                let _code = netArea + this.netSeparator + netType;
                for (let i in data) {
                    let _cur = data[i];
                    if (_cur.code == _code) {
                        return data[i].name;
                    }
                }
                return netArea + netType;
            }
        },
        /**
         * 加载APPR_STATUS枚举
         */
        initEnumApprStatus() {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.axios(this.ENUM.ACTIONS.GET_ENUM_APPR_STATUS, null, [res => {
                    _this.ENUM.APPR_STATUS = res.data;
                    resolve();
                }]);
            });
        },
        /**
         * 加载EXECUTE_STATUS枚举
         */
        initEnumExecuteStatus() {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.axios(this.ENUM.ACTIONS.GET_ENUM_EXECUTE_STATUS, null, [res => {
                    _this.ENUM.EXECUTE_STATUS = res.data;
                    resolve();
                }]);
            });
        },
        /**
         * 将枚举的code和name装换为value和label
         * @param _enum
         * @returns {Array}
         */
        enumCodeNameToValueLabel(_enum) {
            let _arr = [];
            for (let e in _enum) {
                if (!!_enum[e]) {
                    let o = {
                        label: _enum[e].name,
                        value: _enum[e].code
                    };
                    _arr.push(o);
                }
            }
            return _arr;
        },
        /**
         * 将列表中指定field的值组装成用separator分割的字符串
         * @param fieldName
         * @param dealData
         * @param separator
         * @returns {string}
         */
        convertToString(fieldName, dealData, separator) {
            let returnData = "";
            if (dealData) {
                for (var i = 0; i < dealData.length; i++) {
                    returnData += dealData[i][fieldName] + separator;
                }
                returnData = returnData.substring(0, returnData.length - 1);
            }
            return returnData;
        },
        /**
         * 创建子流程
         */
        createExecuFlow(oid, alterationExecuteVos) {
            return new Promise((resolve, reject) => {
                this.axios(this.ENUM.ACTIONS.CREATE_EXECU_FLOW, {
                    oid: oid,
                    alterationExecuteVos: alterationExecuteVos
                }, [res => {
                    resolve();
                }]);
            });
        },
        /**
         * 获取实施人员列表
         */
        getExecuteUser(alterationNum) {
            return new Promise((resolve, reject) => {
                this.axios(this.ENUM.ACTIONS.GET_ALTERATION_EXECUTE_LIST, {alterationNum: alterationNum}, [res => {
                    resolve(res);
                }, rej => {
                    reject();
                }]);
            });
        },
        /**
         * 组装创建子流程所需要的list
         */
        assembleExecuteFlowList(list) {
            let noFlowList = [];
            for (let i = 0; i < list.length; i++) {
                let _execute = list[i];
                if (_execute.execuStatus == this.ENUM.EXECUTE_STATUS.DRAFT) {
                    noFlowList.push(_execute);
                }
            }
            return noFlowList;
        },
        /**
         * 从服务器获取联网类型
         */
        requestNetAreaData() {
            let _this = this;
            return new Promise((resolve, reject) => {
                _this.axios(this.ENUM.ACTIONS.GET_NET_AREA_TYPE, {}, [res => {
                    _this.ENUM.NET_AREA_TYPE_DATA = [{
                        code: " " + _this.ENUM.NET_SEPARATOR() + " ",
                        name: "无"
                    }];
                    for (let i = 0; i < res.data.length; i++) {
                        _this.ENUM.AREA.push({
                            code: res.data[i].unit + _this.ENUM.NET_SEPARATOR() + res.data[i].network,
                            name: res.data[i].shortname,
                            oid: res.data[i].oid
                        });
                    }
                    resolve();
                }, res => {
                    _this.$message.error("加载联网类型失败!");
                    reject(res);
                }, res => {
                    _this.$message.error("加载联网类型失败!");
                    reject(res);
                }])
            });
        },
        /**
         * 根据code查找相同行
         * @param data
         * @param code
         * @param filedName
         * @returns {number}
         */
        findSameRowByCode(data, code, filedName) {
            for (let i = 0; i < data.length; i++) {
                if (data[i][filedName] == code) {
                    return i;
                }
            }
            return -1;
        }
    },
    mounted() {
        this.$message.warning = (text) => {
            if (!!this.MESSAGE_INSTANCE) {
                this.MESSAGE_INSTANCE.close();
            }
            this.MESSAGE_INSTANCE = this.$message({message: text, type: 'warning'});
        };
        this.$message.info = (text) => {
            if (!!this.MESSAGE_INSTANCE) {
                this.MESSAGE_INSTANCE.close();
            }
            this.MESSAGE_INSTANCE = this.$message({message: text, type: 'info'});
        };
        this.$message.success = (text) => {
            if (!!this.MESSAGE_INSTANCE) {
                this.MESSAGE_INSTANCE.close();
            }
            this.MESSAGE_INSTANCE = this.$message({message: text, type: 'success'});
        };
        this.$message.error = (text) => {
            if (!!this.MESSAGE_INSTANCE) {
                this.MESSAGE_INSTANCE.close();
            }
            this.MESSAGE_INSTANCE = this.$message({message: text, type: 'error'});
        };
    }
}
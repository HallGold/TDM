export const SERVER_NAME = "/biz";
//请求类型
export const AXIOS_TYPE_ENUM = {
    GET: `get`,
    PATCH: `patch`,
    PUT: `put`,
    DELETE: `delete`,
    POST: `post`
};

export default {
    data() {
        return {
            //消息框实例
            MESSAGE_INSTANCE: null,
            //公用枚举
            COMM_ENUMS: {
                ACTION: {
                    //根据fileID删除附件
                    REMOVE_FILE: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizReFile/del");
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
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
                //流程页面按钮名称
                FLOW_BUTTON_NAME: {
                    SAVE: "save",
                    SUBMIT: "submit"
                },
                BUTTON: {
                    ADD: {name: '新增', icon: 'el-icon-plus', type: 'primary'},
                    ADD_OLD: {name: '补录', icon: 'el-icon-edit', type: 'primary'},
                    SAVE: {name: '保存', icon: 'el-icon-success', type: 'primary'},
                    SAVE_COPY: {name: '保存并复制', icon: 'el-icon-success', type: 'primary'},
                    CONTACT: {name: '关联', icon: 'el-icon-plus', type: 'primary'},
                    DELETE: {name: '删除', icon: 'el-icon-delete', type: 'primary'},
                    DELETES: {name: '删除', icon: 'el-icon-delete', type: 'primary'},
                    ADD_DEV: {name: '新增变更对象', icon: 'el-icon-plus', type: 'primary'},
                    LOAD_ALL_DEV: {name: '查看所有变更对象', icon: 'el-icon-plus', type: 'primary'},
                    EXPORT: {name: '导出', icon: 'el-icon-upload2', type: 'export', selectable: true},
                    EDIT: {name: '编辑', icon: 'el-icon-edit', type: 'primary'},
                    DOWNLOAD: {name: '导入', icon: 'el-icon-upload2', type: 'primary'},
                    DEATILS: {name: '详情', icon: 'el-icon-view', type: 'primary'},
                    EDITNOLIMIT: {name: '编辑(无限制)', icon: 'el-icon-edit-outline'},
                    UPLOAD: {name: '导出', icon: 'el-icon-download', type: 'primary'},
                    FORBIDDEN: {name: `禁用`, icon: `el-icon-close`, type: `primary`},
                    USING: {name: `启用`, icon: `el-icon-check`, type: `primary`},
                },
                //操作
                OPERATION: {
                    EDIT: {name: "编辑"},
                    VIEW: {name: "详情", dbclick: true},
                    RETRACT: {name: "撤回"},
                    DELETE: {name: "删除"},
                    USE: {name: "启用"},
                    NO_USE: {name: "禁用"},
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
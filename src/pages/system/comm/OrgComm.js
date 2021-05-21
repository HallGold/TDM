const SERVER_NAME = "/permission";
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
            ROOT_DEPT_CODE: "0",
            ROOT_CODE: "0",
            //全部action
            ACTIONS_ENUM: {
                ORG_TYPE: {//机构类型
                    //列表加载
                    LOAD_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/department_type/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //加载机构级类型
                    LOAD_ORG_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/department_type/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //单个加载
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/department_type/get`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存对象
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/department_type/save_update`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //启用停用
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/department_type/change_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    }
                },
                ORG: {//机构
                    LOAD_TENANT: {
                        //加载租户
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/load_tenant`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据父节点lazy加载机构树
                    LOAD_DEPTS_TREE_BY_PARENT_CODE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/load_table_next_children`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据父节点加载机构列表
                    LOAD_DEPTS_TABLE_BY_PARENT_CODE: {
                        URL: () => {
                            return SERVER_NAME.concat(``)
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //单个加载
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/get_by_code`)
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存对象
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //启用停用
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/enabled_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //管理员可管理的机构树
                    MANAGE_TREE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_org/load_tree`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                USER: {
                    //管理员加载可管理的部门用户
                    LOAD_CONDITION_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/user/users_by_condition`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/user/enabled_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/user/user_code`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存对象
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/user/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                },
                WORK_POSITION_TYPE: {
                    //岗位线
                    LOAD_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position_type/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position_type/get`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position_type/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position_type/enabled_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    }
                }
                ,
                WORK_POSITION: {
                    //岗位
                    LOAD_TREE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position/tree_by_condition`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position/by_id`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position/save_update`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    REMOVE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/work_position/delete`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    }
                },
                WORK_POSITION_USER: {
                    SAVE_USERS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/position_user/save_position_users`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    REMOVE_USERS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/position_user/remove_position_users`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    LOAD_USERS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/position_user/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                ROLE: {
                    LOAD_ORG_ENABLED_ROLES: {
                        //获取当前组织机构下可以用于选择或授权的角色
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_role/search`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_ROLES: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_role/search`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_role/by_id`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_role/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/frame_role/enabled_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    }
                },
                ROLE_USER: {
                    //角色用户授权
                    LOAD: {
                        URL: () => {
                            return SERVER_NAME.concat(`/role_user/users_by_role_id`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    SAVE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/role_user/role_id`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.POST
                    }
                },
                APP: {
                    MANAGE_LOAD: {
                        //系统管理员管理用
                        URL: () => {
                            return SERVER_NAME.concat(`/app/load_page_app`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app/by_id`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app/enabled_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    }
                },
                CONSTANT: {
                    LOAD_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app_constant/list`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    CHANGE_STATUS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app_constant/change_status`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    SAVE_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app_constant/save_update`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    SAVE_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat(`/app_constant/save_updates`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    REMOVE_SINGLE:{
                        URL: () => {
                            return SERVER_NAME.concat(`/app_constant/delete`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    }
                },
                DATA_DICTIONARY:{
                    LOAD_PAGE:{
                        URL: () => {
                            return SERVER_NAME.concat(`/dataDictionary/page`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                }
            },
            //AJAX请求返回代码枚举
            RETURN_VALUE_ENUM: {
                SUCCESS: 1,
                PARAM_IS_INVALID: 10001,
                properties: {
                    1: {name: "成功", code: 1},
                    10001: {name: "参数无效", code: 10001}
                }
            },
            //打开方式枚举
            OPEN_TYPE_ENUM: {
                BLANK: 1,//新窗口
                SELF: 2,//当前页面
                properties: {
                    1: {name: "新窗口", code: 1},
                    2: {name: "当前页面", code: 2}
                }
            },
            //是否枚举
            YES_NO_ENUM: {
                YES: 1,
                NO: 0,
                properties: {
                    1: {name: "是", code: 1},
                    0: {name: "否", code: 0}
                }
            },
            //启用停用枚举
            ENABLED_ENUM: {
                ENABLED: 1,
                DISABLED: 0,
                properties: {
                    0: {name: "停用", code: 0},
                    1: {name: "启用", code: 1}
                }
            },
            //是否机构类型枚举
            ORG_TYPE_ENUM: {
                ORG: 1,
                DEPT: 0,
                properties: {
                    0: {name: "部门级", code: 0},
                    1: {name: "机构级", code: 1}
                }
            },
            BUTTON_ENUM: {
                ADD: {name: '新增', icon: 'el-icon-plus', type: 'primary'},
                EDIT: {name: '编辑', icon: 'el-icon-edit', type: 'primary'},
                ENABLED: {name: '启用', icon: 'el-icon-location', type: 'primary'},
                DISABLED: {name: '停用', icon: 'el-icon-location-outline', type: 'primary'},
                REMOVE: {name: '删除', icon: 'el-icon-delete', type: 'primary'},
                REFRESH: {name: '刷新', icon: 'el-icon-refresh', type: 'primary'},
            },
            AXIOS_TYPE_ENUM: {
                GET: `get`,
                PATCH: `patch`,
                PUT: `put`,
                DELETE: `delete`,
            },
            ROLE_TYPE_ENUM: {
                SYSTEM: 1,
                NON_SYSTEM: 2
            }
        }
    },
    methods: {
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
        isFirstLevelDept(parentCode) {
            //根据parentCode判断是否为一级单位
            if (parentCode == this.ROOT_DEPT_CODE) {
                return true;
            } else {
                return false;
            }
        },
        deepCopy(obj) {
            let result = Array.isArray(obj) ? [] : {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        result[key] = deepCopy(obj[key]);   //递归复制
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
            return result;
        },
        getErrorNameByCode(code) {
            return this.getEnumName(this.RETURN_VALUE_ENUM, code);
        },
        objectValueToArray(_obj) {
            //对象转数组
            let arr = [];
            let i = 0;
            for (let item in _obj) {
                arr[i] = _obj[item];
                i++;
            }
            return arr;
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
        commEnabledRender(_row) {
            //是否启用渲染;
            return this.getEnumName(this.ENABLED_ENUM, _row.enabled);
        },
        commOrgTypeRender(_row) {
            //是否机构类型渲染
            return this.getEnumName(this.ORG_TYPE_ENUM, _row.orgType);
        },
        commCorporationRender(_row) {
            //是否法人单位渲染
            return this.getEnumName(this.YES_NO_ENUM, _row.corporation);
        },
        commViralRender(_row) {
            //是否虚拟部门渲染
            return this.getEnumName(this.YES_NO_ENUM, _row.viral);
        }
    },
}

import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";
import {mapMutations, mapGetters} from 'vuex';

export default {
    data() {
        return {
            //枚举
            ENUMS: {
                //控件页面加载是否完成标志符
                PAGE_INIT_OVER_FLAG: false,
                //请求
                ACTIONS: {
                    GET_ENUM: {
                        URL: () => {
                            return SERVER_NAME.concat(`/enum/searchEnumByCode`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    EXPORT_DEV: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/exportAllDev");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    LOAD_DEV_TREE: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/loadDevTree");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //获取联网类型
                    GET_NET_AREA_TYPE: {
                        URL: () => {
                            return "/pro/ProBaseArea/all";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据设备Id获取变更历史
                    GET_DEV_HISTORY: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevUpdate/treeByOperate");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据设备获取相关流程
                    GET_PROCESS_BY_DEV: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevFlow/list");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存设备
                    SAVE_DEV: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/saveDevInfo");
                        },
                        TYPE: AXIOS_TYPE_ENUM.POST
                    },
                    //获取附件信息
                    GET_ATTACHMENT_INFO: {
                        URL: () => {
                            return "/resources/attachment/get";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //设备规格维护树形
                    STANDARD_TREE_DEV: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/loadDevTree");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //设备规格维护--根据类型加载数据
                    GET_STANDARD_TREE_DEV_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevChildTypeProperty/list");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据设备类型/设备子类查询设备规格
                    GET_STANDARD_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevChildTypeProperty/all");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //设备规格维护--根据oid获取单条数据
                    GET_STANDARD_TREE_DEV_LIST_SINGLE: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevChildTypeProperty/get");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //设备规格维护--根据oid禁用单条或多条数据
                    DISABLED_STANDARD_TREE_DEV_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevChildTypeProperty/modifyStandardState");
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //设备规格维护--根据oid启用单条或多条数据
                    ENABLED_STANDARD_TREE_DEV_LIST: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDevChildTypeProperty/modifyStandardState");
                        },
                        TYPE: AXIOS_TYPE_ENUM.PATCH
                    },
                    //按类别加载设备通用属性列表(分页)
                    SEARCH_DEV_BY_TYPE_PAGE: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/searchDevByTypePage");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据设备ID获取设备详情数据
                    GET_DEV_DATA: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/searchDevById");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //是否院内单位
                    IS_ORG_DEPT: {
                        URL: () => {
                            return "/permission/frame_org/get_dept_list";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //获取院外厂商联系人信息
                    GET_FACTORY_CONTACT: {
                        URL: () => {
                            return "/pro/ProBaseContacter/getUserBycustomerIds";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据设备id删除
                    DELETE_DEV_BY_ID: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/deleteDevById");
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    //根据fileID删除附件
                    REMOVE_FILE: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizReFile/del");
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    /**
                     * 根据设备id获取组装好的关联设备数据
                     */
                    GET_RELE_DEV_BY_IDS: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/searchDependDevByIds");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    /**
                     * 资产编号、保密编号、设备编号的唯一性校验
                     */
                    CHECK_DEV_SN: {
                        URL: () => {
                            return SERVER_NAME.concat("/BizDev/checkDevSn");
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                }
                ,
                //是否枚举
                YES_NO: {
                    YES: 1,
                    NO: 0,
                    properties: [
                        {name: "是", code: 1},
                        {name: "否", code: 0}
                    ]
                },
                //按钮类型
                BTN_TYPE: {
                    ADD: "add",
                    UPLOAD: "upload"
                },
                /**
                 * 是和否的boolean
                 */
                TRUE_AND_FALSE: {
                    TRUE: true,
                    FALSE: false,
                    properties: [
                        {code: true, name: "是"},
                        {code: false, name: "否"}
                    ]
                },
                //设备全状态
                STATE_DATA: {
                    NO_USE: {CODE: 1, NAME: "待启用"},
                    USING: {CODE: 2, NAME: "在用"},
                    STOP_USE: {CODE: 3, NAME: "停用"},
                    REPERTORY: {CODE: 4, NAME: "归库"},
                    USE_LESS: {CODE: 6, NAME: "已报废"},
                    OFF_LINE: {CODE: 7, NAME: "下线"},
                    properties: [
                        {code: 1, name: "待启用"},
                        {code: 2, name: "在用"},
                        {code: 3, name: "停用"},
                        {code: 4, name: "归库"},
                        {code: 6, name: "已报废"},
                        {code: 7, name: "下线"}
                    ]
                },
                //许可类型
                PERMISSION_TYPE_DATA: {
                    NUM: 1,
                    FILE: 2,
                    NULL: 3,
                    properties: [
                        {code: 1, name: "许可序列号"},
                        {code: 2, name: "许可文件"},
                        {code: 3, name: "无"}
                    ]
                },
                //管理员类型
                MANAGER_TYPE_DATA: {
                    SYSTEM: 1,
                    AUTH: 2,
                    AUDIT: 3,
                    properties: [
                        {code: 1, name: "系统管理员"},
                        {code: 2, name: "安全管理员"},
                        {code: 3, name: "审计管理员"}
                    ]
                },
                //用户类型
                USER_TYPE_DATA: {
                    SYSTEM: 1,
                    AUTH: 2,
                    AUDIT: 3,
                    SOFT_SUPPORT: 4,
                    PRINCIPAL_LINKMAN: 5,
                    SERVER_LINKMAN: 6,
                    BUILD_LINKMAN: 7,
                    properties: [
                        {code: 1, name: "系统管理员"},
                        {code: 2, name: "安全管理员"},
                        {code: 3, name: "审计管理员"},
                        {code: 4, name: "软件技术支持人员"},
                        {code: 5, name: "主管部门联系人"},
                        {code: 6, name: "运维部门联系人"},
                        {code: 7, name: "承建单位联系人"}
                    ]
                },
                /**
                 * 网络区域类型分隔符
                 */
                NET_SEPARATOR: () => {
                    return "__";
                },
                //设备子类code标识
                CHILD_CATEGORY_CODE_FLAG: 1000,
                //设备大类code标识
                CATEGORY_CODE_FLAG: 10,
                //路由
                ROUTER: {},
                //设备类型
                CATEGORY_DATA: null,
                //设备大类枚举
                CATEGORY_TYPE: {
                    DEV_TYPE: {CODE: 0, NAME: "设备类型", DTO: ""},
                    SYSTEM: {CODE: 10, NAME: "应用系统", DTO: "systemDTO"},
                    PC: {CODE: 11, NAME: "服务器与计算机", DTO: "pcDTO"},
                    NET: {CODE: 12, NAME: "网络设备", DTO: "netDTO"},
                    STORAGE_DEV: {CODE: 13, NAME: "存储与备份设备", DTO: "storageDTO"},
                    PRODUCT: {CODE: 14, NAME: "安全保密产品", DTO: "productDTO"},
                    STORAGE_MEDIA: {CODE: 15, NAME: "存储介质", DTO: "storageMediumDTO"},
                    EQUIPMENT: {CODE: 16, NAME: "外部设施与办公自动化设备", DTO: "equipmentDTO"},
                    MEDIA: {CODE: 17, NAME: "声像设备", DTO: "mediumDTO"}
                },
                /*
                 * 设备类型子类字段名
                 */
                CATEGORY_CHILDREN_FIELD: () => {
                    return "children"
                },
                //设备类型map
                CATEGORY_MAP: null,
                //联网类型(其他模块)
                //应用系统使用情况(枚举)
                SYSTEM_STATE_DATA: null,
                //通用使用情况(枚举)
                COMM_STATE_DATA: null,
                //关联方式
                DEPEND_TYPE_DATA: null,
                //设备形态(枚举)
                SHAPE_TYPE_DATA: null,
                //系统级别(数据字典)
                SYSTEM_LEVEL_DATA: [],
                //经费来源(数据字典)
                FUNDS_SOURCE_DATA: [],
                //部署模式(数据字典)
                DEPLOY_MODE_DATA: [],
                //用途(数据字典,联网类型为无)
                USE_FOR_DATA: [],
                //用途(数据字典,联网类型不为无)
                USE_FOR_TWO_DATA: [],
                //厂商类型(数据字典)
                FACTORY_TYPE_DATA: [],
                //操作系统安装版本(数据字典)
                DEV_VERSION_DATA: [],
                //数据密级(数据字典)
                DATA_SECRET_LEVEL_DATA: [],
                //附件类别(数据字典)
                ATTACHMENT_TYPE_DATA: [],
                //用户密级
                USER_SECRET_LEVEL_DATA: [],
                //应用系统来源
                APP_SYSTEM_ORIGIN_DATA: [],
                //设备维修(数据字典)
                DEV_REPAIR_DATA: [],
                //设备维修价格参考表数据(数据字典)
                DEV_REPAIR_PRICE_REF_DATA: [],
                //网络类型(数据字典)
                PRO_NETWORK_DATA: [],
                //数据字典对应的编码
                DATA_DICTIONARY: {
                    FUNDS_SOURCE: {
                        CODE: "fundsSource",
                        CORRESPONDING: () => {
                            return this.ENUMS.FUNDS_SOURCE_DATA;
                        }
                    },
                    DEPLOY_MODE: {
                        CODE: "deployModeData", CORRESPONDING: () => {
                            return this.ENUMS.DEPLOY_MODE_DATA;
                        },
                        DATA_TYPE: Number
                    },
                    USE_FOR: {
                        CODE: "useFor", CORRESPONDING: () => {
                            return this.ENUMS.USE_FOR_DATA;
                        }
                    },
                    USE_FOR_TWO: {
                        CODE: "useForTwo", CORRESPONDING: () => {
                            return this.ENUMS.USE_FOR_TWO_DATA;
                        }
                    },
                    DEV_VERSION: {//操作系统安装版本
                        CODE: "operatingSystem", CORRESPONDING: () => {
                            return this.ENUMS.DEV_VERSION_DATA;
                        }
                    },
                    PRO_NETWORK: {//网络类型
                        CODE: "PRO_NETWORK", CORRESPONDING: () => {
                            return this.ENUMS.PRO_NETWORK_DATA;
                        }
                    },
                    SYSTEM_LEVEL: {//应用系统级别
                        CODE: "systemLevel", CORRESPONDING: () => {
                            return this.ENUMS.SYSTEM_LEVEL_DATA;
                        }, DATA_TYPE: Number
                    },
                    //厂商类型(数据字典)
                    FACTORY_TYPE: {
                        CODE: "manufacturer_type", CORRESPONDING: () => {
                            return this.ENUMS.FACTORY_TYPE_DATA;
                        }
                    },
                    //数据密级
                    DATA_SECRET_LEVEL: {
                        CODE: "devSecretLevel", CORRESPONDING: () => {
                            return this.ENUMS.DATA_SECRET_LEVEL_DATA;
                        }, DATA_TYPE: Number
                    },
                    //附件类别
                    ATTACHMENT_TYPE: {
                        CODE: "ATTACHMENT_TYPE", CORRESPONDING: () => {
                            return this.ENUMS.ATTACHMENT_TYPE_DATA;
                        }
                    },
                    //用户密级
                    USER_SECRET_LEVEL: {
                        CODE: "OR_SECRET_LEVEL", CORRESPONDING: () => {
                            return this.ENUMS.USER_SECRET_LEVEL_DATA;
                        }
                    },
                    APP_SYSTEM_ORIGIN: {
                        CODE: "appSystemOrigin", CORRESPONDING: () => {
                            return this.ENUMS.APP_SYSTEM_ORIGIN_DATA;
                        }
                    },
                    DEV_REPAIR: {
                        CODE: "REPAIR_SPEND_TIME", CORRESPONDING: () => {
                            return this.ENUMS.DEV_REPAIR_DATA;
                        }
                    },
                    //设备维修价格参考表
                    DEV_REPAIR_PRICE_REFERENCE: {
                        CODE: "HW_EX_REPAIR_PRICE_TABLE", CORRESPONDING: () => {
                            return this.ENUMS.DEV_REPAIR_PRICE_REF_DATA;
                        }
                    }

                },
                //枚举名称编码
                REQUEST_ENUM_NAME: {
                    SYSTEM_STATE: "systemStatus",
                    COMM_STATE: "commonStatus",
                    CHILD_CATEGORY: "childCategory",
                    SHAPE_TYPE: "enumsShapeType",
                    DEPEND_TYPE: "dependType"
                },
                //设备类型定义
                DEV_TYPE_DEFINE: {
                    BEHIND_TYPE: {
                        NAME: '后端设备类型',
                        TYPES: [
                            {CODE: '1101', NAME: '服务器'},
                            {CODE: '1106', NAME: '操作终端'},
                            {CODE: '1107', NAME: '工业控制机'},
                            {CODE: '1108', NAME: '小型机'},
                            {CODE: '1109', NAME: '中型机'},
                            {CODE: '1110', NAME: '大型机'},
                            {CODE: '1111', NAME: '巨型机'},
                            {CODE: '1112', NAME: '虚拟服务器'},
                            {CODE: '1113', NAME: '虚拟桌面'},
                            {CODE: '1201', NAME: '交换机'},
                            {CODE: '1202', NAME: '路由器'},
                            {CODE: '1203', NAME: 'KVM设备'},
                            {CODE: '1204', NAME: '刀箱设备'},
                            {CODE: '1301', NAME: '存储设备'},
                            {CODE: '1302', NAME: '磁带库'},
                            {CODE: '1413', NAME: '安全网关'},
                            {CODE: '1403', NAME: '身份鉴别设备'},
                            {CODE: '1402', NAME: '密码产品'},
                            {CODE: '1404', NAME: '访问控制设备'},
                            {CODE: '1405', NAME: '输入输出控制产品'},
                            {CODE: '1407', NAME: '入侵检测与防御系统'},
                            {CODE: '1416', NAME: '堡垒机'},
                        ]
                    },
                    TERMINAL_TYPE: {
                        NAME: '终端设备',
                        TYPES: [
                            {CODE: '1102', NAME: '台式计算机'},
                            {CODE: '1103', NAME: '便携式计算机'},
                            {CODE: '1104', NAME: '工作站'},
                            {CODE: '1105', NAME: '打印终端'}
                        ]
                    }
                },
                SAFE_SECRECY_PRODUCT_TYPE: {
                    NAME: '安全保密产品类型',
                    TYPES: [
                        {CODE: '0001', NAME: '防病毒软件'},
                        {CODE: '0002', NAME: '网络准入软件'},
                        {CODE: '0003', NAME: '登录保护软件'},
                        {CODE: '0004', NAME: '主机监控与审计软件'},
                        {CODE: '0005', NAME: '打印监控与审计软件'},
                        {CODE: '0006', NAME: '三合一软件'}
                    ]
                },
                HARDWARE_REPLACE_TYPE: {
                    NAME: '设备硬件更换',
                    UNINSTALL_HARDWARE_STATUS: {
                        NAME: '拆卸部件-拟新状态',
                        TYPES: [
                            {CODE: '0001', NAME: '入库'},
                            {CODE: '0002', NAME: '报废'},
                            {CODE: '0003', NAME: '销毁'}
                        ]
                    },
                    OPERATE_TYPE: {
                        NAME: '操作类型',
                        TYPES: [
                            {CODE: '0001', NAME: '新增'},
                            {CODE: '0002', NAME: '删除'}
                        ]
                    }
                },
                ATTACHMENT_MAP: {
                    dev_cpjl: "cpjl",//测评结论
                    dev_xkwj: "xkwj",//许可文件
                    dev_cpbg: "cpbg",//测评报告
                    dev_jcbg: "dev_jcbg"//检查报告
                }
            }
        }
    },
    methods: {
        ...mapMutations("datamapStore", ["addDataMap", "addUndoTypeCodes"]),
        ...mapGetters("datamapStore", ["getDataMap"]),
        /**
         * 在DataDictionary中查找typeCode，找到后执行handler
         * @param typeCode
         * @param handler
         */
        searchDataDictionary(typeCode, handler) {
            for (let i in this.ENUMS.DATA_DICTIONARY) {
                let _type = this.ENUMS.DATA_DICTIONARY[i];
                let _code = _type.CODE;
                let _dataType = _type.DATA_TYPE;
                let _enum = _type.CORRESPONDING(this);
                if (typeCode == _code) {
                    if (handler) {
                        handler(_type, _dataType, _enum);
                    }
                    break;
                }
            }
        },
        assembleTypeCodeKey(typeCode) {
            return typeCode;
        },
        /**
         * 数据字典的加载
         * @param typeCodes
         */
        assembleEnumByDataDictionary(...typeCodes) {
            let _this = this;
            return new Promise((resolve, reject) => {
                //未加载的数据字典类型编码
                let tmpTypeCode = [];
                typeCodes.forEach(typeCode => {
                    let value = _this.getDataMap()(_this.assembleTypeCodeKey(typeCode));
                    if (!value) {
                        // console.log("请求装配" + typeCode);
                        tmpTypeCode.push(typeCode);
                    } else {
                        //本地已经存在,直接装配
                        // console.log("本地已经存在,直接装配" + typeCode);
                        _this.searchDataDictionary(typeCode, (_type, _dataType, _enum) => {
                            for (let v in value) {
                                _enum.push({
                                    code: !!_dataType ? _dataType(v) : v,
                                    name: !!value[v].name ? value[v].name : value[v]
                                });
                            }
                        });
                    }
                });
                if (tmpTypeCode.length == 0) {
                    resolve();
                } else {
                    this.$getDataMap(...tmpTypeCode).then(res => {
                        if (!!res.data) {
                            for (let k in res.data) {
                                let curCode = res.data[k].code;
                                if (!!curCode) {
                                    _this.searchDataDictionary(curCode, (_type, _dataType, _enum) => {
                                        if (!!_dataType) {
                                            for (let j = 0; j < res.data[k].appDataList.length; j++) {
                                                res.data[k].appDataList[j].code = _dataType(res.data[k].appDataList[j].code);
                                                _enum.push(res.data[k].appDataList[j]);
                                            }
                                        } else {
                                            _enum.push(...res.data[k].appDataList);
                                        }
                                        let obj = {}, value = {};
                                        _enum.forEach(item => {
                                            value[item.code] = item.name;
                                        });
                                        obj[_this.assembleTypeCodeKey(curCode)] = value;
                                        _this.addDataMap(obj);
                                    });
                                }
                            }
                            resolve();
                        } else {
                            _this.$message.error("数据字典" + typeCodes.toString() + "加载失败!");
                            reject();
                        }
                    }).catch(res => {
                        _this.$message.error("数据字典" + typeCodes.toString() + "加载失败!");
                        reject();
                    });
                }
            });
        },
        /**
         * 从服务器获取应设备形态枚举
         * @returns {Promise<T | never>}
         */
        requestEnumsShapeTypeData() {
            let _this = this;
            return this.requestEnums(this.ENUMS.REQUEST_ENUM_NAME.SHAPE_TYPE).then(res => {
                _this.ENUMS.SHAPE_TYPE_DATA = res.data;
            }).catch(res => {
                _this.$message.error("加载设备形态失败!");
            });
        },
        /**
         * 从服务器获取应用系统的使用情况枚举
         * @returns {Promise<T | never>}
         */
        requestSystemStateData() {
            let _this = this;
            return this.requestEnums(this.ENUMS.REQUEST_ENUM_NAME.SYSTEM_STATE).then(res => {
                _this.ENUMS.SYSTEM_STATE_DATA = res.data;
            }).catch(res => {
                _this.$message.error("加载应用系统的使用情况失败!");
                this.localAssembleSystemStateData();
            });
        },
        /**
         * 从服务器获取通用的使用情况枚举
         */
        requestCommStateData() {
            let _this = this;
            return this.requestEnums(this.ENUMS.REQUEST_ENUM_NAME.COMM_STATE).then(res => {
                _this.ENUMS.COMM_STATE_DATA = res.data;
            }).catch(res => {
                _this.$message.error("加载通用的使用情况失败!");
                _this.localAssembleCommStateData();
            });
        },
        /**
         *从服务器获取关联方式枚举
         * @returns {Promise<T | never>}
         */
        requestDependTypeData() {
            let _this = this;
            return this.requestEnums(this.ENUMS.REQUEST_ENUM_NAME.DEPEND_TYPE).then(res => {
                _this.ENUMS.DEPEND_TYPE_DATA = res.data;
            }).catch(res => {
                _this.$message.error("加载关联方式失败!");
            });
        },
        /**
         * 本地组装SystemState(以后会删)
         */
        localAssembleCommStateData() {
            this.ENUMS.SYSTEM_STATE_DATA = [{code: 1, name: "待启用"},
                {code: 2, name: "在用"},
                {code: 3, name: "停用"},
                {code: 7, name: "下线"}];
        },
        /**
         * 本地组装CommState(以后会删)
         */
        localAssembleSystemStateData() {
            this.ENUMS.COMM_STATE_DATA = [{code: 1, name: "待启用"},
                {code: 2, name: "在用"},
                {code: 3, name: "停用"},
                {code: 4, name: "归库"},
                {code: 6, name: "已报废"}];
        },
        /**
         * 从服务器获取联网类型
         */
        requestNetAreaTypeData() {
            let _this = this;
            return new Promise((resolve, reject) => {
                _this.axios(this.ENUMS.ACTIONS.GET_NET_AREA_TYPE, {}, [res => {
                    _this.ENUMS.NET_AREA_TYPE_DATA = [{
                        code: " " + _this.ENUMS.NET_SEPARATOR() + " ",
                        name: "无"
                    }];
                    for (let i = 0; i < res.data.length; i++) {
                        _this.ENUMS.NET_AREA_TYPE_DATA.push({
                            code: res.data[i].unit + _this.ENUMS.NET_SEPARATOR() + res.data[i].network,
                            name: res.data[i].shortname
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
         * 根据类型请求枚举数据
         * @param type
         */
        requestEnums(type) {
            let _this = this;
            return new Promise((resolve, reject) => {
                _this.axios(this.ENUMS.ACTIONS.GET_ENUM, {type: type}, [res => {
                    resolve(res);
                }, res => {
                    reject(res);
                }, res => {
                    reject(res);
                }]);
            });
        },
        /**
         * 尝试从服务器请求设备分类信息
         * @returns {Promise<any>}
         */
        requestCategoryData() {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.axios(this.ENUMS.ACTIONS.LOAD_DEV_TREE, {}, [res => {
                    _this.ENUMS.CATEGORY_DATA = _this.assembleCategoryData(res.data);
                    _this.assembleCategoryMap();
                    resolve();
                }, res => {
                    _this.$message.error("加载设备分类信息失败!使用本地配置!");
                    _this.localAssembleCategoryData();
                    _this.assembleCategoryMap();
                    resolve();
                }]);
            });

        },
        /**
         * 组装设备类型
         * @param data
         */
        assembleCategoryData(data) {
            for (let i = 0; i < data.length; i++) {
                let cur = data[i];
                cur.code = Number(cur.code);
                if (!cur.children) {
                    cur.children = cur.childCategory;
                }
                if (!!cur.children) {
                    this.assembleCategoryData(cur.children);
                }
            }
            return data;
        },
        /**
         * 组装CATEGORY_MAP
         */
        assembleCategoryMap() {
            let childrenField = this.ENUMS.CATEGORY_CHILDREN_FIELD();
            if (!!!this.ENUMS.CATEGORY_MAP) {
                this.ENUMS.CATEGORY_MAP = [];
                for (let i in this.ENUMS.CATEGORY_DATA) {
                    let obj = this.ENUMS.CATEGORY_DATA[i];
                    this.ENUMS.CATEGORY_MAP[obj.code] = obj.name;
                    for (let j in obj) {
                        if (childrenField == j) {
                            let childs = obj[j];
                            for (let k = 0; k < childs.length; k++) {
                                this.ENUMS.CATEGORY_MAP[childs[k].code] = childs[k].name;
                            }
                        }
                    }
                }
            }
        },
        /**
         * 本地组装CategoryData
         */
        localAssembleCategoryData() {
            this.ENUMS.CATEGORY_DATA = [{
                children: [{code: 1001, name: "应用系统"}],
                code: 10,
                name: "应用系统"
            }, {
                children: [{code: 1101, name: "服务器"}, {code: 1102, name: "台式计算机"}, {
                    code: 1103,
                    name: "便携式计算机"
                }, {code: 1104, name: "工作站"}, {code: 1105, name: "打印终端"}, {
                    code: 1106,
                    name: "操作终端"
                }, {code: 1107, name: "工业控制机"}, {code: 1108, name: "小型机"}, {
                    code: 1109,
                    name: "中型机"
                }, {code: 1110, name: "大型机"}, {code: 1111, name: "巨型机"}, {
                    code: 1112,
                    name: "虚拟服务器"
                }, {code: 1113, name: "虚拟桌面"}, {
                    code: 1114, name: "刀片服务器"
                }], code: 11, name: "服务器与计算机"
            }, {
                children: [{code: 1201, name: "交换机"}, {code: 1202, name: "路由器"}, {
                    code: 1203,
                    name: "KVM设备"
                }, {code: 1204, name: "刀箱设备"}], code: 12, name: "网络设备"
            }, {
                children: [{code: 1301, name: "存储设备"}, {code: 1302, name: "磁带库"}],
                code: 13,
                name: "存储与备份设备"
            }, {
                children: [{code: 1401, name: "计算机病毒查杀工具"}, {
                    code: 1402,
                    name: "密码产品"
                }, {code: 1403, name: "身份鉴别设备"}, {code: 1404, name: "访问控制设备"}, {
                    code: 1405,
                    name: "输入输出控制产品"
                }, {code: 1406, name: "安全审计系统"}, {code: 1407, name: "入侵检测与防御系统"}, {
                    code: 1408,
                    name: "电磁辐射和传导泄露发射防护产品"
                }, {code: 1409, name: "存储保护系统"}, {code: 1410, name: "信息消除工具"}, {
                    code: 1411,
                    name: "移动存储设备销毁工具"
                }, {code: 1412, name: "检查工具"}, {code: 1413, name: "安全网关"}, {
                    code: 1414,
                    name: "漏洞扫描工具"
                }, {code: 1415, name: "单向导入系统"}, {code: 1416, name: "堡垒机"}, {
                    code: 1417,
                    name: "操作系统安全增强系统"
                }], code: 14, name: "安全保密产品"
            }, {
                children: [{code: 1501, name: "磁介质硬盘"}, {code: 1502, name: "固态硬盘"}, {
                    code: 1503,
                    name: "移动硬盘"
                }, {code: 1504, name: "专用软件光盘"}, {code: 1505, name: "通用软件光盘"}, {
                    code: 1506,
                    name: "其他光盘"
                }, {code: 1507, name: "U盘"}, {code: 1508, name: "软盘"}, {
                    code: 1509,
                    name: "存储卡"
                }, {code: 1510, name: "记忆棒"}, {code: 1511, name: "磁带"}, {
                    code: 1512,
                    name: "录音带"
                }, {code: 1513, name: "录像带"}], code: 15, name: "存储介质"
            }, {
                children: [{code: 1601, name: "打印机"}, {code: 1602, name: "扫描仪"}, {
                    code: 1603,
                    name: "只读移动光驱"
                }, {code: 1604, name: "读写移动光驱"}, {code: 1605, name: "磁带机"}, {
                    code: 1606,
                    name: "读卡器"
                }, {code: 1607, name: "打字机"}, {code: 1608, name: "复印机"}, {
                    code: 1609,
                    name: "传真机"
                }, {code: 1610, name: "多功能一体机"}, {code: 1611, name: "碎纸机"}, {
                    code: 1612,
                    name: "速印机"
                }, {code: 1613, name: "晒图机"}, {code: 1614, name: "制图机"}, {
                    code: 1615,
                    name: "绘图机"
                }, {code: 1616, name: "传感器系统"}], code: 16, name: "外部设施与办公自动化设备"
            }, {
                children: [{code: 1701, name: "照相机"}, {code: 1702, name: "摄像机"}, {
                    code: 1703,
                    name: "录音机"
                }, {code: 1704, name: "投影仪"}, {code: 1705, name: "非线性编辑机"}, {
                    code: 1706,
                    name: "扩音设备"
                }, {code: 1707, name: "视频会议设备"}, {code: 1708, name: "数字化会议设备"}, {
                    code: 1709,
                    name: "专用显示器或电视机"
                }, {code: 1710, name: "音视频矩阵"}], code: 17, name: "声像设备"
            }];
        },
        /**
         * 根据code获取其分类下第一个子类编码
         * @returns {number}
         */
        getChildType(code) {
            return code > this.ENUMS.CHILD_CATEGORY_CODE_FLAG ? code : (code * 100 + 1)
        },
        /**
         * 根据code获取其父类编码
         * @param code
         */
        getParentType(code) {
            return code < this.ENUMS.CHILD_CATEGORY_CODE_FLAG ? code : Math.floor(code / 100);
        },
        /**
         * 批量删除
         * @param list
         * @param deleteList
         */
        deletes(list, deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                list.splice(list.indexOf(deleteList[i]), 1);
            }
        },
        /**
         * 根据code获取name
         * @param pEnumType
         * @param pCode
         * @returns {null|*}
         */
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
         * 根据code查找相同行
         * @param data
         * @param code
         * @param filedName
         * @returns {number}
         */
        findSameRowByCode(data, code, filedName) {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i][filedName] == code) {
                        return i;
                    }
                }
                return -1;
            }
            return -1;
        },
        /**
         * 加载dev数据
         */
        loadDevById: function (devId) {
            return new Promise((resolve, reject) => {
                this.axios(this.ENUMS.ACTIONS.GET_DEV_DATA, {devId: devId}, [res => {
                    resolve(res.data);
                }, res => {
                    reject(res.code);
                }, res => {
                    reject("请求异常!");
                }]);
            });
        },
        /**
         * manage页面分类初始化附件序号
         * @param data 附件数组
         */
        addSnForFiles(data) {
            if (!!data) {
                let fileIndex = {};
                data.forEach(item => {
                    if (!fileIndex[item.childType1]) {
                        fileIndex[item.childType1] = 1;
                    }
                    item.sn = fileIndex[item.childType1]++;
                });
            }
        },
        /**
         * 根据规则模板初始化页面组件
         */
        initPageByTemplate() {
            // this.PROPERTY_LAW_TEMPLATE[10].u
        },
        /**
         *
         * @returns {boolean}
         */
        initPageOver() {
            this.ENUMS.PAGE_INIT_OVER_FLAG = true;
        },
        isInitPageOver() {
            return this.ENUMS.PAGE_INIT_OVER_FLAG;
        },
        /**
         * 保密编号，设备编号，资产编号唯一性的校验
         * @param obj
         * @return {Promise<unknown>}
         */
        validateSn(obj) {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.axios(this.ENUMS.ACTIONS.CHECK_DEV_SN, obj, [res => {
                    resolve(res.data);
                }, res => {
                    reject();
                }]);
            });
        }
    }
}
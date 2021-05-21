import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";

export default {
    data() {
        return {
            //枚举
            ENUMS: {
                //流程类型编码
                DEV_FLOW_TYPE: "",
                //请求
                ACTIONS: {
                    //获取APP为businessprocess中的常量BIZ_FLOW_CODE
                    GET_DEV_FLOW_TYPE: {
                        URL: () => {
                            return "/permission/app_constant/byCode";
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //获取当前用户可以发起的所有设备相关流程类型
                    GET_PROCESS_TYPE: {
                        URL: () => {
                            return (`bpm/definition/allowFlow`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //获取当前用户发起的所有设备相关流程
                    GET_DEV_PROCESS: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizDevFlow/listSelf`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    DELETE_BIZ_OBJ: {
                        URL: () => {
                            return SERVER_NAME.concat(`/`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    }
                }, MAP: {
                    //流程类型与url对照map
                    FLOW_KEY_URL: {},
                    //设备流程管理路径map
                    DEV_FLOW_ROUTE: {}
                },
                //数据字典对应的编码
                DATA_DICTIONARY: {
                    //流程对应表单
                    FLOW_FORM_URL: {
                        CODE: "BIZ_FORM_URL",
                        assemble: (data) => {
                            for (let i = 0; i < data.appDataList.length; i++) {
                                let cur = data.appDataList[i];
                                this.ENUMS.MAP.FLOW_KEY_URL[cur.name] = cur.code;
                            }
                        }
                    },
                    DEV_FLOW_URL:{
                        CODE: "DEV_FLOW_ROUTE",
                        assemble: (data) => {
                            for (let i = 0; i < data.appDataList.length; i++) {
                                let cur = data.appDataList[i];
                                this.ENUMS.MAP.DEV_FLOW_ROUTE[cur.value] = cur.remark;
                            }
                        }
                    }
                },
                //流程状态
                FLOW_AF_STATUS: {
                    //草稿
                    DRAFT: -1
                }
            }
        }
    },
    methods: {
        /**
         * 请求设备业务流程编码
         */
        requestDevFlowType() {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.axios(this.ENUMS.ACTIONS.GET_DEV_FLOW_TYPE, {
                    appCode: "businessprocess",
                    code: "BIZ_FLOW_CODE"
                }, [res => {
                    _this.ENUMS.DEV_FLOW_TYPE = res.data.value;
                    resolve();
                }, res => {
                    this.$message.error("获取业务流程编码失败!")
                    reject();
                }, res => {
                    this.$message.error("获取业务流程编码失败!")
                    reject();
                }])
            });
        },
        /**
         * 数据字典的加载
         * @param typeCodes
         */
        assembleEnumByDataDictionary(...typeCodes) {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.$getDataMap(...typeCodes).then(res => {
                    if (!!res.data) {
                        for (let k in res.data) {
                            let curCode = res.data[k].code;
                            if (!!curCode) {
                                for (let i in _this.ENUMS.DATA_DICTIONARY) {
                                    let _type = _this.ENUMS.DATA_DICTIONARY[i];
                                    let _code = _type.CODE;
                                    if (!!_type.CORRESPONDING) {
                                        let _enum = _type.CORRESPONDING(_this);
                                        if (curCode == _code) {
                                            _enum.push(...res.data[k].appDataList);
                                            break;
                                        }
                                    } else if (!!_type.assemble) {
                                        _type.assemble(res.data[k]);
                                    }
                                }
                            }
                        }
                        resolve();
                    } else {
                        _this.$message.error("数据字典" + typeCodes.toString() + "加载失败!");
                        reject();
                    }
                }).catch(res=>{
                    _this.$message.error("数据字典" + typeCodes.toString() + "加载失败!");
                    reject();
                });
            });
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
        }
    }
}
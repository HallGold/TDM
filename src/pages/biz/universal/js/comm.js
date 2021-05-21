import bizComm from "@/pages/biz/js/comm";
import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";

export default {
    mixins: [bizComm],
    data() {
        return {
            UNIVERSAL: {
                ENUM: {
                    STATUS: {
                        DRAFT: "1",
                        PROCESSING: "2",
                        FINISH: "3",
                        WORKING: "4",
                        properties: [
                            {code: "1", name: "起草"},
                            {code: "2", name: "审批中"},
                            {code: "3", name: "办结"},
                            {code: "4", name: "实施中"}
                        ]
                    },
                    //是否枚举
                    YES_NO: {
                        YES: 1,
                        NO: 0,
                        properties: [
                            {name: "是", code: 1},
                            {name: "否", code: 0}
                        ]
                    },
                    ROUTE: {
                        UNIVERSAL_EDIT: {
                            URL: (param) => {
                                return this.assembleUrl("/biz/universal/edit", param);
                            }
                        },
                    },
                    ACTIONS: {
                        //删除
                        DELETE_UNIVERSAL: {
                            URL: () => {
                                return SERVER_NAME.concat("/universal/del");
                            },
                            TYPE: AXIOS_TYPE_ENUM.DELETE
                        },
                        SEARCH_UNIVERSAL: {
                            URL: () => {
                                return SERVER_NAME.concat("/universal/list");
                            },
                            TYPE: AXIOS_TYPE_ENUM.GET
                        },
                    }
                },
                bizData: {
                    applyRemark: "",
                    applyTime: "",
                    applyUser: "",
                    applyUserCode: "",
                    applyUserDept: "",
                    applyUserDeptCode: "",
                    applyUserMail: "",
                    applyUserPhone: "",
                    applyUserTel: "",
                    createDate: "",
                    createUser: "",
                    dataDeptCode: "",
                    dataDeptId: "",
                    dataDeptLevcode: "",
                    dataOrgCode: "",
                    dataOrgId: "",
                    dataOrgLevcode: "",
                    dataSecretLevcode: "",
                    dataTenantId: "",
                    deleteStatus: 0,
                    doResult: 0,
                    dutyUser: "",
                    dutyUserCode: "",
                    dutyUserDept: "",
                    dutyUserDeptCode: "",
                    dutyUserMail: "",
                    dutyUserPhone: "",
                    dutyUserTel: "",
                    formCode: "",
                    itemType: "",//申请项
                    apprRoute: "",//审批路径
                    lockedStatus: 0,
                    oid: "",
                    orgCode: "",
                    serverId: "",
                    status: "",
                    systemUser: 1,//是否系统用户
                    tenantCode: "",
                    updateDate: "",
                    updateUser: "",
                    version: 0,
                    reFileVoList: []
                }
            }
        };
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
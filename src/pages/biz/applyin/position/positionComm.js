import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";

export default {
    data() {
        return {
            POSITION_ENUMS: {
                ACTIONS: {
                    //加载列表数据
                    LOAD_DATA: {
                        URL: () => {
                            return SERVER_NAME.concat(`/manage/searchByTypePage`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //保存
                    SAVE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/manage/save`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.PUT
                    },
                    //删除
                    DELETE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/manage/delete`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.DELETE
                    },
                    //启用
                    USE: {
                        URL: () => {
                            return SERVER_NAME.concat(``);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //禁用
                    NO_USE: {
                        URL: () => {
                            return SERVER_NAME.concat(``);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    },
                    //根据id加载数据
                    SEARCH_BY_ID: {
                        URL: () => {
                            return SERVER_NAME.concat(`/manage/searchById`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                //是否枚举
                YES_NO: {
                    YES: '1',
                    NO: '0',
                    properties: [
                        {name: "是", code: '1'},
                        {name: "否", code: '0'}
                    ]
                },
                //启用禁用
                USE_NO_USE: {
                    USE: '1',
                    NO_USE: '0',
                    properties: [
                        {name: "已启用", code: '1'},
                        {name: "已禁用", code: '0'}
                    ]
                },
                //类型枚举
                TYPE: {
                    DEPT: '1',
                    POSITION: '0',
                    properties: [{
                        value: '0',
                        label: '部位',
                        children: [{
                            value: '2',
                            label: '主机房'
                        }, {
                            value: '3',
                            label: '辅助区'
                        }, {
                            value: '4',
                            label: '支持区'
                        }]
                    }, {
                        value: '1',
                        label: '部门'
                    }]
                }
            }
        }
    },
    methods: {
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
         * 根据value获取label
         * @param pEnumType
         * @param pCode
         * @return {null|*}
         */
        getLabelByValue(pEnumType, pCode) {
            //根据code获取name
            for (var i in pEnumType) {
                if (pEnumType[i].value == pCode) {
                    return pEnumType[i].label;
                }
            }
            return null;
        },
        /**
         * 部位类型的渲染
         * @param typeCode
         */
        onTypeRenderer(typeCode) {
            let _type = typeCode.split(",");
            if (_type.length > 1) {
                //部位类型为部位
                let child = this.getLabelByValue(this.POSITION_ENUMS.TYPE.properties[0].children, _type[1]);
                return this.POSITION_ENUMS.TYPE.properties[0].label + "/" + child;
            } else {
                //部位类型为部门
                return this.POSITION_ENUMS.TYPE.properties[1].label;
            }
        }
    }
}
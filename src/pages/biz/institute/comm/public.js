import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";
import color from "element-ui/packages/color-picker/src/color";

export default {
    data() {
        return {
            INSTITUTE_ENUMS: {
                ACTIONS: {
                    SEARCH_BY_TYPE_CODE: {
                        URL: () => {
                            return SERVER_NAME.concat(`/BizDevSystemApply/searchSystemByTypePage`);
                        },
                        TYPE: AXIOS_TYPE_ENUM.GET
                    }
                },
                INSTITUTE_TYPE: {
                    ONLINE: "online",
                    UPDATE: "update",
                    POWER: "power",
                    OFFLINE: "offline",
                    MODIFY: "modify"
                },
                DEV_SELECT: {REF: "devSelect", SHOW: false},//设备选择
                FILTER_TREE_DATA: () => {
                    return [this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE]
                },//设备节点的过滤
                QUERY_DEV: [],//设备查询条件
                DEV_COLUMNS: [],
                TYPE_CODE: "",
                //变更有效期
                EXPIRATION_TYPE_DATA: {
                    FREE: 6,
                    properties: [
                        {code: 1, name: "1年"},
                        {code: 2, name: "2年"},
                        {code: 3, name: "3年"},
                        {code: 4, name: "4年"},
                        {code: 5, name: "5年"},
                        {code: 6, name: "自主选择时间"}
                    ]
                },
                //变更类型
                CHANGE_TYPE_DATA: [
                    {code: 1, name: "业务开通"},
                    {code: 2, name: "业务回收"},
                    {code: 3, name: "业务变更"},
                    {code: 4, name: "网络开通"},
                    {code: 5, name: "网络回收"},
                    {code: 6, name: "网络变更"}
                ],
                //数据处理方式
                DATA_DEAL_TYPE_DATA: {
                    COMPONENT_SAVE: 3,
                    properties: [
                        {code: 1, name: "销毁"},
                        {code: 2, name: "交由业务主管部门存档"},
                        {code: 3, name: "运维部门存档"}
                    ]
                },
                //应用系统申请类型
                SYSTEM_APPLY_TYPE_DATA: {
                    online: {code: 1, name: "上线"},
                    update: {code: 2, name: "更新"},
                    power: {code: 3, name: "权限变更"},
                    offline: {code: 4, name: "下线"},
                    modify: {code: 5, name: "业务数据修改"}

                },
                //提示数据(数据字典)
                TIPS_DATA: [],
                APP_SYSTEM_PROMPT_DATA: [],
                //数据字典编码
                DATA_DICTIONARY: {
                    TIPS: {
                        CODE: "updateTips", CORRESPONDING: () => {
                            return this.INSTITUTE_ENUMS.TIPS_DATA;
                        }
                    },
                    APP_SYSTEM_PROMPT: {
                        CODE: "appSystemPrompt", CORRESPONDING: () => {
                            return this.INSTITUTE_ENUMS.APP_SYSTEM_PROMPT_DATA;
                        }
                    }
                },
                STATE_DATA: {
                    DRAFT: 1,
                    APPROVING: 2,
                    END: 3,
                    EXECUTE: 4,
                    CREATE_DEV: 5,
                    properties: [
                        {code: 1, name: "起草"},
                        {code: 2, name: "审批中"},
                        {code: 3, name: "办结"},
                        {code: 4, name: "实施中"},
                        {code: 5, name: "建账中"}
                    ]
                },
                //路由
                ROUTER: {
                    //上线编辑页面
                    ONLINE_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/institute/online/editOnline", param);
                        }
                    },
                    UPDATE_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/institute/update/editUpdate", param);
                        }
                    },
                    POWER_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/institute/power/editPower", param);
                        }
                    },
                    OFFLINE_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/institute/offline/editOffline", param);
                        }
                    },
                    MODIFY_EDIT: {
                        URL: (param) => {
                            return this.assembleUrl("/biz/institute/modify/editModify", param);
                        }
                    },
                }
            }
        }
    },
    methods: {
        /**
         * 选择设备
         */
        chooseDev(type) {
            this.INSTITUTE_ENUMS.TYPE_CODE = type;
            this.INSTITUTE_ENUMS.DEV_SELECT.SHOW = true;
            this.$nextTick(() => {
                this.$refs[this.INSTITUTE_ENUMS.DEV_SELECT.REF].openDialog();
            });
        },
        /**
         * 设备选择后触发
         */
        selectDev(data) {
            let _this = this;
            return new Promise((resolve, reject) => {
                if (data && data.length > 0) {
                    _this.loadDevById(data[0].oid).then(res => {
                        _this.setInstituteData(res.dataDTO);
                    });
                }
                _this.INSTITUTE_ENUMS.DEV_SELECT.SHOW = false;
            });
        },
        /**
         * 设置页面数据
         * @param data
         */
        setInstituteData(data) {
            if (this.INSTITUTE_ENUMS.TYPE_CODE == this.INSTITUTE_ENUMS.INSTITUTE_TYPE.UPDATE) {
                this.assembleDevData(this.updateData, data);
            } else if (this.INSTITUTE_ENUMS.TYPE_CODE == this.INSTITUTE_ENUMS.INSTITUTE_TYPE.POWER) {
                this.assembleDevData(this.powerData, data);
            } else if (this.INSTITUTE_ENUMS.TYPE_CODE == this.INSTITUTE_ENUMS.INSTITUTE_TYPE.OFFLINE) {
                this.assembleDevData(this.offlineData, data);
            } else if (this.INSTITUTE_ENUMS.TYPE_CODE == this.INSTITUTE_ENUMS.INSTITUTE_TYPE.MODIFY) {
                this.assembleDevData(this.modifyData, data);
            }
        },
        /**
         * 组装更新data
         * @param list
         * @param data
         */
        assembleDevData(list, data) {
            list.name = data.commDTO.name;
            list.systemLevel = data.extendData.systemLevel;
            list.secretLevel = data.commDTO.secretLevel;
            list.netArea = data.commDTO.netArea;
            list.netType = data.commDTO.netType;
            list.deployMode = data.extendData.deployMode;
            list.secretSn = data.commDTO.secretSn;
            list.devId = data.commDTO.oid;
            list.source = data.extendData ? data.extendData.origin : 1;
            list.netAreaAndType = this.onNetAndTypeRenderer(data.commDTO.netArea, data.commDTO.netType);
            list.competentDeptName = data.commDTO.deptName;
            list.competentDeptCode = data.commDTO.deptCode;
            list.competentUserList = [{
                userType: this.ENUMS.USER_TYPE_DATA.PRINCIPAL_LINKMAN,
                userCode: data.commDTO.dutyCode,
                userName: data.commDTO.dutyName,
                deptName: "",
                deptCode: "",
                orgCode: data.commDTO.orgCode,
                orgName: "",
                contact: data.commDTO.dutyPhone
            }];
            list.factoryList = data.factoryReleDTOList;
            list.factoryUserList = data.factoryUserDTOList;
            list.useDeptList = data.useRangeDTOList;
            list.managerUserList = data.dutyDTOList;
        },
        /**
         * 设置附件list
         * @param data
         * @param childType
         */
        setReFileVoList(data, childType, list) {
            this.deletes(list, this.findSameChildTypeList(childType, list));
            list.push(...data);
        },
        /**
         * 删除childType一样的附件list
         * @param childType
         * @returns {[]}
         */
        findSameChildTypeList(childType, list) {
            let _list = [];
            for (let i = 0; i < list.length; i++) {
                let fileInfo = list[i];
                if (fileInfo.childType1 == childType) {
                    _list.push(fileInfo);
                }
            }
            return _list;
        },
        /**
         * 组装附件map
         */
        assembleAttachmentMap(list, attachmentMap) {
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    let _attachment = list[i];
                    if (!attachmentMap[_attachment.childType1]) {
                        attachmentMap[_attachment.childType1] = [_attachment];
                    } else {
                        attachmentMap[_attachment.childType1].push(_attachment);
                    }
                }
            }
        },
        /**
         * 联网类型的渲染
         * @param netArea
         * @param netType
         * @param useFor
         * @returns {*}
         */
        onNetAndTypeRenderer(netArea, netType) {
            let _data = this.ENUMS.NET_AREA_TYPE_DATA;
            if (!!netArea) {
                let _value = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                for (let i in _data) {
                    let _cur = _data[i];
                    if (_cur.code == _value) {
                        return _data[i].name;
                    }
                }
                return netArea + netType;
            }
            return _data[0].name;
        },
        /**
         * 数据字典的加载
         * @param typeCodes
         */
        assembleInstitueEnumByDataDictionary(...typeCodes) {
            let _this = this;
            return new Promise((resolve, reject) => {
                this.$getDataMap(...typeCodes).then(res => {
                    if (!!res.data) {
                        for (let k in res.data) {
                            let curCode = res.data[k].code;
                            if (!!curCode) {
                                for (let i in _this.INSTITUTE_ENUMS.DATA_DICTIONARY) {
                                    let _type = _this.INSTITUTE_ENUMS.DATA_DICTIONARY[i];
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
                }).catch(res => {
                    _this.$message.error("数据字典" + typeCodes.toString() + "加载失败!");
                    reject();
                });
            });
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
         * 根据code找备注
         * @param datas
         * @param code
         * @returns {null|*}
         */
        findRemarkByCode(datas, code) {
            for (let i = 0; i < datas.length; i++) {
                let _data = datas[i];
                if (_data.code == code) {
                    return _data.remark;
                }
            }
            return null;
        },
        initColumns() {
            let _this = this;
            this.INSTITUTE_ENUMS.DEV_COLUMNS = [
                {
                    label: '设备类型', code: 'category', width: 120, renderCell(h, data) {
                        return _this.onCategoryRenderer(data.row.category);
                    }
                },
                {label: '设备名称', code: 'name', width: 180},
                {
                    label: '设备子类', code: 'childType', width: 120, renderCell(h, data) {
                        return _this.onChildTypeRenderer(data.row.childType);
                    }
                }, {label: '保密编号', code: 'secretSn', width: 180},
                {
                    label: '密级', code: 'secretLevel', width: 100, formatter(data) {
                        return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, data.secretLevel);
                    }
                },
                {label: '责任人', code: 'dutyName', width: 100},
                {
                    label: '联网类型/用途', code: 'netAreaAndType', width: 150, ignore: true, formatter: row => {
                        return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                    }
                },
                {
                    label: '使用情况', code: 'state', width: 80, formatter(data) {
                        return _this.onStateRenderer(data.state, data.category);
                    }
                },
                {
                    label: '系统级别', code: 'systemLevel', width: 100, formatter(data) {
                        return _this.onSystemLevelRenderer(data.systemLevel);
                    }
                },
            ];
        },
        initQuery() {
            let _this = this;
            this.INSTITUTE_ENUMS.QUERY_DEV = [
                {
                    type: 'static', label: '使用情况', code: 'state', width: 80, value: () => {
                        return this.ENUMS.STATE_DATA.USING.CODE;
                    }
                },
                {
                    type: 'select', label: '系统级别', code: 'systemLevel', textProp: 'name',
                    codeProp: 'code', options: _this.ENUMS.SYSTEM_LEVEL_DATA
                }
            ];
        },
        /**
         * 管理页面文件的渲染
         * @param type
         * @param fileList
         */
        onFileRenderer(type, fileList) {
            let _list = [];
            let _this = this;
            for (let i = 0; i < fileList.length; i++) {
                if (type == fileList[i].childType1) {
                    _list.push(fileList[i]);
                }
            }
            return <div class="test">{_list.map(function (item, index) {
                return <div style="text-decoration: underline;color:blue; text-align: center;cursor: pointer" {...{
                    "on": {
                        "click": () => {
                            _this.$downloadFile(item.fileId);
                        }
                    }
                }}>{item.fileName}</div>
            })}</div>;
        }
    },
    mounted() {
        this.initColumns();
        this.initQuery();
    }
}
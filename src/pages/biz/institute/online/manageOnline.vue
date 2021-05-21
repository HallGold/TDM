<template>
    <div class="content-filled">
        <ice-query-grid title="应用系统上线管理"
                        :data-url="INSTITUTE_ENUMS.ACTIONS.SEARCH_BY_TYPE_CODE.URL()+'?typeCode='+this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.online.code"
                        :query="ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.QUERY"
                        :columns="ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.COLUMNS"
                        :ref="ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.REF"
                        :operations="ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.OPERATIONS"
                        :operationsWidth=100
                        :minHeight="530"
                        :buttons="ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.BUTTONS"></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import attachment from "../comm/attachment";
    import institutePublic from "../comm/public";

    export default {
        name: "manageOnline",
        components: {IceQueryGrid},
        mixins: [bizComm, devComm, attachment, institutePublic],
        data() {
            return {
                ONLINE_MANAGE_PAGE_ENUM: {
                    MANAGE_GRID: {
                        REF: "onlineManage",
                        QUERY: [],
                        COLUMNS: [],
                        OPERATIONS: [],
                        BUTTONS: []
                    }
                }
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initColumns();
                this.initButtons();
                this.initQuerys();
                this.initOperations();
            },
            /**
             * 初始化列
             */
            initColumns() {
                let _this = this;
                this.ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {label: '申请时间', code: 'applyTime', width: 150},
                    {label: '申请人', code: 'creatorName', width: 100},
                    {label: '系统名称', code: 'name', width: 120},
                    {label: '申请单号', code: 'formCode', width: 120},
                    {
                        label: '系统级别', code: 'systemLevel', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.ENUMS.SYSTEM_LEVEL_DATA, row.systemLevel);
                        }
                    },
                    {
                        label: '密级', code: 'secretLevel', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, row.secretLevel);
                        }
                    },
                    {label: '保密编号', code: 'secretSn', width: 150},
                    {
                        label: '状态', code: 'state', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.INSTITUTE_ENUMS.STATE_DATA.properties, row.state);
                        }
                    },
                    {
                        label: '系统来源', code: 'source', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.ENUMS.APP_SYSTEM_ORIGIN_DATA, row.source);
                        }
                    },
                    {
                        label: '部署模式', code: 'deployMode', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.ENUMS.DEPLOY_MODE_DATA, row.deployMode);
                        }
                    },
                    {label: '使用单位', code: 'useDeptNameList', width: 150},
                    {label: '主管部门', code: 'competentDeptName', width: 100},
                    {label: '承建单位', code: 'factoryNameList', width: 150},
                    {label: '申请单位', code: 'creatorDeptName', width: 100},
                    {
                        label: '建设方案', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_jsfa, row.bizReFileVos);
                        }
                    },
                    {
                        label: '评审意见', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_psyj, row.bizReFileVos);
                        }
                    },
                    {
                        label: '离线测评报告', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_cpbg, row.bizReFileVos);
                        }
                    },
                    {
                        label: '安装配置手册', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_pzsc, row.bizReFileVos);
                        }
                    },
                    {
                        label: '资源需求说明书', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_zyxq, row.bizReFileVos);
                        }
                    },
                    {
                        label: '日常运维手册', width: 150, showTips: false, formatter: row => {
                            return _this.onFileRenderer(_this.ATTACHMENT_ENUMS.institute_ywsc, row.bizReFileVos);
                        }
                    }
                ];
            },
            /**
             * 初始化查询条件
             */
            initQuerys() {
                let _this = this;
                this.ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.QUERY = [
                    {type: 'date', label: '申请时间(起)', code: 'applyTime', exp: ">"},
                    {type: 'date', label: '申请时间(止)', code: 'applyTime', exp: "<"},
                    {type: 'input', label: '申请人', code: 'creatorName', value: ''},
                    {type: 'input', label: '申请单号', code: 'formCode', value: ''},
                    {
                        type: 'select',
                        label: '系统级别',
                        code: 'systemLevel',
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                        value: ''
                    },
                    {
                        type: 'select',
                        label: '密级',
                        code: 'secretLevel',
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                        value: ''
                    },
                    {type: 'input', label: '保密编号', code: 'secretSn', value: ''},
                    {
                        type: 'select',
                        label: '状态',
                        code: 'state',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.INSTITUTE_ENUMS.STATE_DATA.properties
                    },
                    {
                        type: 'select',
                        label: '系统来源',
                        code: 'source',
                        mapTypeCode: "appSystemOrigin",
                        value: ''
                    },
                    {
                        type: 'select',
                        label: '部署模式',
                        code: 'deployMode',
                        mapTypeCode: "deployModeData",
                        value: ''
                    },
                    {type: 'input', label: '使用单位', code: 'useDeptList', value: ''},
                    {type: 'input', label: '申请单位', code: 'creatorDeptName', value: ''}
                ];
            },
            /**
             * 初始化按钮
             */
            initButtons() {

            },
            /**
             * 初始化操作列
             */
            initOperations() {
                this.ONLINE_MANAGE_PAGE_ENUM.MANAGE_GRID.OPERATIONS = [
                    Object.assign({}, this.COMM_ENUMS.OPERATION.VIEW, {callback: this.view})
                ];
            },
            /**
             * 查看按钮响应事件
             * @param e
             */
            view(row) {
                this.$router.push(this.INSTITUTE_ENUMS.ROUTER.ONLINE_EDIT.URL() + "?dataId=" + row.oid + "&readOnly=true");
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(
                    this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE,
                    this.ENUMS.DATA_DICTIONARY.APP_SYSTEM_ORIGIN.CODE)
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>
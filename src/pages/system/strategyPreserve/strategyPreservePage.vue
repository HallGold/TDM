<template>
    <div class="outer">
        <div class="inner">
            <ice-query-grid data-url="/permission/datapriv/outer/get/all_priv_type"
                            @selection-change="handleSelectionChange"
                            chooseItem="single"
                            style="height: 100%"
                            ref="gridGroup"
                            :query="query"
                            :pagination="false"
                            :columns="columns"
                            :buttons="buttons"
                            :operations="operations"></ice-query-grid>
        </div>
        <div class="inner inner_cls">
            <ice-query-grid :data-url="'/permission/datapriv/outer/get/privdefs_by_groupid?privTypeId='+this.privTypeId"
                            :gridAutoRefresh="false"
                            ref="girdStrategy"
                            style="height: 100%"
                            :pagination="false"
                            :query="queryQ"
                            :columns="columnsQ"
                            :buttons="buttonsQ"
                            :operations="operationsQ"></ice-query-grid>
        </div>
        <group-edit ref="groupEdit" :mainDataForm="groupData" :isSuccess="isSuccessGroup"
                    :is-edit="isEditGroup"></group-edit>
        <strategy-edit ref="strategyEdit" :mainDataForm="mainDataForm" :isSuccess="isSuccess"
                       :is-edit="isEditStrategy"></strategy-edit>
        <strategy-new-edit ref="strategyNewEdit" :mainDataForm="mainDataForm" :isSuccess="isSuccess"
                           :is-edit="isEditStrategy"></strategy-new-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import GroupEdit from "./groupEdit";
    import StrategyEdit from "./strategyEdit";
    import StrategyNewEdit from "./strategyNewEdit";

    export default {
        name: "strategyPreservePage",
        components: {StrategyNewEdit, StrategyEdit, GroupEdit, IceQueryGrid},
        data() {
            return {
                query: [],       //组件查询-分组
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '分组编码', code: 'privtypeCode', width: 80},
                    {label: '分组名称', code: 'privtypeName', width: 150,align:'left'},
                    {label: '类型', code: 'privtypeType', mapTypeCode: 'PRIVTYPE_TYPE', width: 70,align:'left'},
                ],    //组件table列展示-分组
                buttons: [],     //组件按钮-分组
                operations: [],  //组件table列按钮-分组
                queryQ: [],       //组件查询-策略
                columnsQ: [
                    {code: 'oid', hidden: true},
                    {label: '策略名称', code: 'privilegeName', width: 200, align:'left'},
                    {label: '策略编码', code: 'privilegeCode', align:'left'},
                    {
                        label: '状态', code: 'isEnabled', width: 80, renderCell(h, data) {
                            return data.row.isEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                ],     //组件table列展示-策略
                buttonsQ: [],     //组件按钮-策略
                operationsQ: [],  //组件table列按钮-策略，
                privTypeId: '',   //策略配置列表查询参数
                curSelectGroup: {},//当前选中的策略分组
                groupData: {//策略分组
                    privtypeName: '',
                    privtypeCode: '',
                    privtypeType: 'G'
                },
                mainDataForm: {//策略配置
                    privilegeCode: '',
                    privilegeName: '',
                    privilegeConfig: {
                        privType: '10',//根据左边的数据带出
                        grpMergeType: 'AND',//根据左边的列表数据带出
                        privMergeType: 'OR',//下拉选，默认OR
                        condMergeType: 'OR',//下拉选，默认OR
                        conditions: {
                            fieldTypeCode: 'DeptLevCode',//选择框
                            defaultFieldName: 'DATA_DEPT_LEVCODE_',//根据上面的选择自动带出数据，可修改
                            binaryOp: 'IN',//可选值=/in，默认=
                            parameter: {
                                inputType: '20',
                                valueType: '10',
                                value: '',
                                isMulti: 'Y'
                            }
                        }
                    }
                },
                isEditGroup: false,
                isEditStrategy: false,
            }
        },
        methods: {
            initComponent() {
                this.query = [
                    /*{type: 'input', label: '分组名称', code: 'privtypeName', value: ''},*/
                ];

                this.buttons = [
                    {name: '新增策略分组', icon: 'el-icon-plus', callback: this.add},
                    // {name: '刷新缓存', callback: this.refresh}
                ];
                this.operations = [
                    {name: '编辑', callback: this.updateGroup},
                    {name: '删除', callback: this.deleteGroup}
                ];
                this.queryQ = [
                    /*{type: 'input', label: '策略名称', code: 'privilegeName', value: ''},*/
                    /*{
                        type: 'static', code: 'privTypeId', exp: '=', value: () => {
                            return this.privTypeId;
                        }
                    },*/
                ];

                this.buttonsQ = [
                    {name: '新增策略', icon: 'el-icon-plus', callback: this.addItem},
                ];
                this.operationsQ = [
                    {name: '编辑', callback: this.editPageFuncItem},
                    {name: '删除', callback: this.deleteItem},
                    /*{
                        name: '启用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.isEnabled == 'N') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.isEnabled == 'Y') {
                                return true;
                            }
                            return false;
                        }
                    },*/
                ];
            },
            /**
             * 新增--分组
             */
            add() {
                this.isEditGroup = false;
                this.$refs.groupEdit.openDialog();
            },
            /**
             * 刷新缓存
             */
            refresh() {
                alert("待接口");
            },
            /**
             * 编辑--分组
             */
            updateGroup(row) {
                this.isEditGroup = true;
                let obj = {};
                Object.assign(obj, row);
                this.$refs.groupEdit.openDialog();
                this.$nextTick(() => {
                    this.groupData = obj;
                });
            },
            /**
             * 删除--分组
             */
            deleteGroup(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/datapriv/outer/delete/privtype_info", {
                        params: {
                            "privTypeId": row.oid,
                            "version": row.version
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.$refs.gridGroup.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    })
                });
            },
            /**
             * 新增--策略
             */
            addItem() {
                this.isEditStrategy = false;
                //this.$refs.strategyEdit.openDialog(this.privTypeId, this.curSelecGroup);

                this.mainDataForm = {//策略配置
                    privilegeCode: '',
                    privilegeName: '',
                    privilegeConfig: {
                        privType: '10',//根据左边的数据带出
                        grpMergeType: 'AND',//根据左边的列表数据带出
                        privMergeType: 'OR',//下拉选，默认OR
                        condMergeType: 'OR',//下拉选，默认OR
                        conditions: {
                            fieldTypeCode: 'DeptLevCode',//选择框
                            defaultFieldName: 'DATA_DEPT_LEVCODE_',//根据上面的选择自动带出数据，可修改
                            binaryOp: 'IN',//可选值=/in，默认=
                            parameter: {
                                inputType: '20',
                                valueType: '10',
                                value: '',
                                isMulti: 'Y'
                            }
                        }
                    },
                    privilegetypeId:this.privTypeId
                };
                this.$refs.strategyNewEdit.openDialog(this.curSelecGroup);
            },
            /**
             * 编辑--策略
             */
            editPageFuncItem(row) {
                this.isEditStrategy = true;
                let clone = require('clone');
                let obj = clone(row);
                obj.privilegeConfig = obj.dataPrivilegeConfig;
                console.log(obj, 'obj')
                let list = [];
                if(obj.privilegeConfig.conditions){
                    list = [...obj.privilegeConfig.conditions];
                }
                obj.privilegeConfig.conditions = obj.privilegeConfig.conditions && obj.privilegeConfig.conditions.length > 0 ? obj.privilegeConfig.conditions[0] : {
                    fieldTypeCode: 'DeptLevCode',//选择框
                    defaultFieldName: 'DATA_DEPT_LEVCODE_',//根据上面的选择自动带出数据，可修改
                    binaryOp: 'IN',//可选值=/in，默认=
                    parameter: {
                        inputType: '20',
                        valueType: '10',
                        value: '',
                        isMulti: 'Y'
                    }
                };
                this.$refs.strategyNewEdit.openDialog();
                this.mainDataForm = obj;
                this.mainDataForm.gridData = list;
            },
            /**
             * 删除--策略
             */
            deleteItem(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/datapriv/outer/delete/privdef_info_byid", {
                        params: {
                            "privDefId": row.oid,
                            "version": row.version
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.$refs.girdStrategy.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 停用或启用--策略
             */
            enabledOrDisabled(row) {
                alert("待接口或者用其他页面的接口");
                /*let isEnabled = false;
                if(row.isEnabled == 'N'){
                    isEnabled = true;
                }
                this.$axios.post("/permission/res/ds/outer/save/set_enabled",{dsId:row.oid,isEnabled:isEnabled,version:row.version}).then(success=>{
                    this.$message.success("操作成功");
                    this.isSuccess();
                }).catch(error=>{
                    this.$message.error(error.msg);
                })*/
            },
            /**
             * 点击table列获取当行数据
             * @param row
             */
            handleSelectionChange(row) {
                if (!row || row.length == 0) {
                    this.curSelecGroup = {};
                    this.privTypeId = '';
                }
                if (row.length > 0) {
                    this.$set(this.buttonsQ[0], 'disabled', false);
                } else {
                    this.$set(this.buttonsQ[0], 'disabled', true);
                }
                this.privTypeId = row[0].oid;
                this.curSelecGroup = row[0];
            },
            /**
             * 策略配置保存成功后的回调
             */
            isSuccess() {
                this.$refs.girdStrategy.refresh();
            },
            /**
             * 策略分组保存成功后的回调
             */
            isSuccessGroup() {
                this.$refs.gridGroup.refresh();
            }

        },
        mounted() {
            this.initComponent();
            this.$set(this.buttonsQ[0], 'disabled', true);
        }
    }
</script>

<style scoped>
    .outer {
        display: flex;
        width: 100%;
    }

    .inner {
        height: 100%;
        flex-grow: .8;
    }

    .inner_cls {
        margin-left: 5px;
        flex-grow: 1.2;
    }
</style>

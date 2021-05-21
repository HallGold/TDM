<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid load-url="/permission/res/page/outer/get_project_tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="oid"
                       :lazy="false"
                       data-url="/permission/res/service/outer/search_base_info"
                       :pagination="true"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       :chooseItem="chooseItem"
                       @selection-change="selectionChange"
                       @node-click="dataTree"
                       :operations-width="180">
        </ice-tree-grid>
        <service-information-edit :is-edit="isEdit" ref="serviceInformationEdit"
                                  :isSuccess="isSuccess"></service-information-edit>
        <service-correlation-edit ref="serviceCorrelationEdit"></service-correlation-edit>
        <service-log-edit ref="serviceLogEdit" :mainDataForm="logMainDataForm"></service-log-edit>
    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import ServiceInformationEdit from "../serviceEdit/serviceInformationEdit";
    import ServiceCorrelationEdit from "../serviceEdit/serviceCorrelationEdit";
    import ServiceLogEdit from "../serviceEdit/serviceLogEdit";
    import {Loading} from 'element-ui';

    export default {
        name: "serviceManage",
        components: {ServiceLogEdit, ServiceCorrelationEdit, ServiceInformationEdit, IceTreeGrid},
        props: {
            chooseItem: {//是否为多选状态
                type: String,
                default: 'single'
            },
            isDialog: {
                type: Boolean,
                default: false
            },
            loadAll: {
                type: String,
                default: "Y"
            }
        },
        data() {
            return {
                query: [//组件查询
                    {type: 'input', label: '服务名称', code: 'serviceName', value: ''},
                    {type: 'input', label: 'Url', code: 'serviceUrl', value: ''},
                    {
                        type: 'static', code: 'projectId', exp: '=', value: () => {
                            return this.projectId;
                        }
                    },
                    {
                        type: 'static', code: 'modelId', exp: '=', value: () => {
                            return this.modelId;
                        }
                    },
                    {
                        type: 'static', code: 'subModelId', exp: '=', value: () => {
                            return this.subModelId;
                        }
                    },
                    {
                        type: 'static', code: 'loadAll', exp: '=', value: () => {
                            return this.loadAll == 'Y' ? "Y" : 'N';
                        }
                    }
                ],
                columns: [//组件table列
                    {code: 'oid', hidden: true},
                    {label: '模块', code: 'modelName', width: 180, showTips:true, align:'left'},
                    {label: '子模块', code: 'submodelName', width: 180, showTips:true, align:'left'},
                    {label: '服务名称', code: 'serviceName', width: 300, align:'left', showTips:true},
                    {label: '服务类型', code: 'serviceType', width: 85, mapTypeCode: 'serviceType'},
                    {
                        label: '状态', code: 'isEnabled', width: 70, renderCell(h, data) {
                            return data.row.isEnabled == 'Y' ? '启用' : (data.row.isEnabled == 'N' ? '停用' : '')
                        }
                    },
                    {label: '服务Url', code: 'serviceUrl', width: 300, align:'left', showTips:true},
                    {label: '服务描述', code: 'remark', width: 300, align:'left'},
                    {label: '日志模板', code: 'logTemplate', width: 90},
                    {
                        label: '更新状态', code: 'updateStatus', width: 85, renderCell(h, data) {
                            return data.row.updateStatus == 10 ? '待同步' : (data.row.updateStatus == 20 ? '已同步' : '')
                        }
                    }
                ],
                operations: [
                    {name: '编辑', callback: this.editPageFuncItem, ctrlCode: 'BBJ'},
                    // {name: '审计配置', callback: this.logItem, ctrlCode: 'BSJPZ'},
                    {name: '数据表维护', callback: this.preserveItem, ctrlCode: 'BSJBWH'},
                    {
                        name: '启用', ctrlCode: 'BQY', callback: this.enabledOrDisabled, isShow: (row) => {
                            if (this.isDialog) {
                                return false;
                            }
                            if (row.isEnabled == 'N') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', ctrlCode: 'BTY', callback: this.enabledOrDisabled, isShow: (row) => {
                            if (this.isDialog) {
                                return false;
                            }
                            if (row.isEnabled == 'Y') {
                                return true;
                            }
                            return false;
                        }
                    }
                ],     //组件table列操作按钮
                buttons: [{
                    name: '更新服务信息',
                    icon: 'el-icon-plus',
                    type: 'primary',
                    callback: this.upDateInformation,
                    ctrlCode: 'BGXFWXX',
                    hidden: () => {
                        return this.isDialog;
                    }
                },
                    {
                        name: '更改立即生效',
                        icon: 'el-icon-plus',
                        type: 'primary',
                        callback: this.atOnceEffect,
                        ctrlCode: 'BZZYMHC',
                        hidden: () => {
                            return this.isDialog;
                        }
                    }],        //组件页面按钮
                isEdit: true,        //是否为编辑状态
                projectId: '',
                modelId: '',
                subModelId: '',
                informationMainDataForm: {//表单对象
                    serviceName: '',
                    serviceType: '',
                    isInner: '0',
                    isOuter: '0',
                    serviceUrl: '',
                    remark: ''
                },
                logMainDataForm: {//表单对象
                    logEnabled: '',
                    logtemplId: '',
                    logTemplate: '',

                },
            }
        },
        methods: {
            /**
             * 回调
             */
            isSuccess() {
                this.refresh();
            },
            selectionChange(row) {
                this.$emit('selection-change', row);
            },
            /**
             * 刷新
             */
            refresh() {
                this.$nextTick(() => {
                    this.$refs.iceGrid.$refs.queryGrid.refresh();
                })

            },
            /**
             * 启用或停用的调用方法
             */
            enabledOrDisabled(row) {
                let isEnabled = false;
                if (row.isEnabled == 'Y') {
                    isEnabled = false;
                } else {
                    isEnabled = true;
                }
                this.$axios.post("/permission/res/service/outer/set_enabled", {
                    "isEnabled": isEnabled,
                    "serviceId": row.oid,
                    "version": row.version
                }).then(success => {
                    this.refresh();
                }).catch(error => {
                    console.error(error)
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },
            /**
             * 更新服务信息
             */
            upDateInformation() {
                this.$axios.post("/permission/res/service/outer/update_from_registinfo", {
                    modelId: this.modelId
                }).then(success => {
                    this.$message({
                        message: '服务信息更新成功！',
                        type: 'success'
                    });
                    this.isSuccess();
                }).catch(error => {
                    this.$message({
                        message: error.msg ? error.msg : '操作出错了',
                        type: 'warning'
                    });
                });
            },
            /**
             * 更改立即生效
             */
            atOnceEffect() {
                alert("待接口");
            },
            /**
             * 编辑
             */
            editPageFuncItem(row) {
                let obj = {};
                Object.assign(obj, row);
                this.$refs.serviceInformationEdit.openDialog(row.oid);//打开服务信息维护
                this.$nextTick(() => {
                    this.informationMainDataForm = obj;
                    this.informationMainDataForm.isInner = this.informationMainDataForm.isInner.toString();
                    this.informationMainDataForm.isOuter = this.informationMainDataForm.isOuter.toString();
                });
            },
            /**
             * 审计配置
             */
            logItem(row) {
                let obj = {};
                Object.assign(obj, row);
                this.$refs.serviceLogEdit.openDialog();//打开日志配置维护
                this.$nextTick(() => {
                    this.logMainDataForm = obj;
                });
            },
            /**
             * 数据表维护
             */
            preserveItem(row) {
                this.$nextTick(() => {
                    this.$refs.serviceCorrelationEdit.openDialog(row.oid);
                })

            },
            /**
             * 点击树节点，获取节点信息
             */
            dataTree(data, node) {
                if (node.data.type == 0) {
                    this.projectId = node.data.oid;
                    this.modelId = "";
                    this.subModelId = "";
                } else if (node.data.type == 1) {
                    this.projectId = "";
                    this.modelId = node.data.oid;
                    this.subModelId = "";
                } else if (node.data.type == 2) {
                    this.projectId = "";
                    this.modelId = "";
                    this.subModelId = node.data.oid;
                }
                let isTrue = false;
                if (!this.modelId || node.data.children.length == 0) {
                    isTrue = true;
                }
                if (this.buttons && this.buttons.length > 0) {
                    this.$set(this.buttons[0], 'disabled', isTrue);
                }
            },
            initDialog() {
                if (this.isDialog) {
                    this.operations = [];
                    this.buttons = [];
                }
            },
        },
        mounted() {
            this.initDialog();
        }
    }
</script>

<style scoped>

</style>

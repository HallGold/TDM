<template>
    <div>
        <el-dialog v-dialog-drag
                   title="数据表字段维护"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="70%"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div class="outer">
                <div class="inner">
                    <div class="inner_input inner_text">
                        <span>表名</span>
                    </div>
                    <div class="inner_input input_cls" style="width: 70%">
                        <el-input v-model="tableCode" readonly></el-input>
                    </div>
                </div>
                <div class="inner">
                    <div class="inner_input inner_text">
                        <span>表中文名</span>
                    </div>
                    <div class="inner_input input_cls" style="width: 70%">
                        <el-input v-model="tableName" readonly></el-input>
                    </div>
                </div>
            </div>
            <ice-query-grid :gridData="gridData"
                            ref="grid"
                            :query="query"
                            :columns="columns"
                            :operations="operations"
                            :pagination="false"
                            :buttons="buttons"></ice-query-grid>
            <div class="ice-button-bar butt">
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
        <filed-edit :title="title" ref="filedEdit" :isSuccess="refresh" :is-edit="isEdit"></filed-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import FiledEdit from "./filedEdit";
    import {Loading} from 'element-ui';

    export default {
        name: "fieldPreserveEdit",
        components: {FiledEdit, IceQueryGrid},
        data() {
            return {
                dialogVisible: false,    //弹窗开关属性
                tableCode: '',            //表名
                tableName: '',            //表中文名
                tableId: '',
                columns: [],
                buttons: [],
                operations: [],
                title: '',
                query: [],
                gridData: [],
                isEdit: false,               //是否为编辑状态
            }
        },
        methods: {
            /**
             * 初始化组件部分
             */
            initComponent() {
                this.columns = [
                    {label: '字段名', code: 'columnCode', width: 180},
                    {label: '中文名', code: 'columnName', width: 180},
                    {
                        label: '是否主键', code: 'isPriKey', width: 80, renderCell(h, data) {
                            return data.row.isPriKey == 1 ? '是' : '否';
                        }
                    },
                    {label: '字段类型', code: 'datatype', width: 80},
                    {label: '列类型', code: 'columnType', width: 80},
                    {label: '长度', code: 'columnLenth', width: 80},
                    {label: '精度', code: 'precision', width: 80},
                    {label: '最小值', code: 'minValue', width: 80},
                    {label: '最大值', code: 'maxValue', width: 80},
                    {
                        label: '可否为空', code: 'nullable', width: 80, renderCell(h, data) {
                            return data.row.nullable == 1 ? '是' : '否';
                        }
                    },
                    {label: '默认值', code: 'defaultValue', width: 100},
                ];
                this.operations = [
                    {name: '编辑', callback: this.editPageFuncItem},
                    {name: '删除', callback: this.deleteItem},
                ];
                this.buttons = [
                    {name: '新增', callback: this.addItem},
                    {
                        name: '全部删除', callback: this.allDeleteItem, disabled: () => {
                            return !this.gridData || this.gridData.length === 0
                        }
                    },
                    // {name: '保存', callback: this.saveItem},
                    {name: '自动添加通用字段', callback: this.selfMotionItem},
                ];
                this.query = [
                    {
                        type: 'static', code: 'tableId', exp: '=', value: () => {
                            return this.tableId;
                        }
                    }
                ]
            },
            /**
             * 保存
             */
            save() {


            },
            /**
             * 取消
             */
            closeDialog() {
                // this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(row) {
                this.tableId = row.oid;
                this.tableCode = row.tableCode;
                this.tableName = row.tableName;
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.refresh();
                });
            },
            refresh() {
                this.$axios.get("/permission/res/table/outer/get_table_cols", {params: {"tableCode": this.tableCode}}).then(success => {
                    this.gridData = success.data;
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 编辑
             */
            editPageFuncItem(row) {
                this.isEdit = true;
                this.title = '表字段信息维护';
                this.$refs.filedEdit.openDialog(this.tableId, row);
            },
            /**
             * 删除
             */
            deleteItem(row) {
                this.$axios.delete('/permission/res/table/outer/del_table_col_byid', {
                    params: {
                        "tableId": this.tableId,
                        "columnId": row.oid
                    }
                }).then(result => {
                    this.$message.success('删除成功');
                    this.refresh()
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },

            /**
             * 新增
             */
            addItem() {
                this.isEdit = false;
                this.title = '新增表字段信息';
                this.$refs.filedEdit.openDialog(this.tableId);
            },
            /**
             * 全部删除
             */
            allDeleteItem() {
                this.$axios.delete('/permission/res/table/outer/del_table_col_byid', {
                    params: {
                        "tableId": this.tableId,
                        "columnId": ''
                    }
                }).then(result => {
                    this.$message.success('删除成功');
                    this.refresh()
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },
            /**
             * 保存
             */
            saveItem() {
                let obj = {};
                obj.frameDbColumnInfoList = this.gridData;
                this.$axios.post("/permission/res/table/outer/save_table_info", obj).then(success => {
                    this.$message.success("保存成功");
                    this.closeDialog();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 自动添加通用字段
             */
            selfMotionItem() {
                let loading = Loading.service({fullscreen: true});
                this.$axios.post("/permission/res/table/outer/auto_gen_common_col", {tableId: this.tableId}).then(success => {
                    this.$message.success("添加成功");
                    this.refresh()
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loading.close();
                    });
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loading.close();
                    });
                })

            },
            // resetForm() {
            //     this.$refs.form.resetFields();
            // }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>
    .outer {
        width: 100%;
        display: flex;
        background-color: #ffffff;
    }

    .inner {
        margin: 7px 5px;
        height: 100%;
        flex-grow: 1;
    }

    .inner_input {
        display: inline-block;
    }

    .inner_text {
        margin-left: 10%;
    }

    .input_cls {
        margin-left: 10px;
    }

    .butt {
        background-color: #ffffff;
    }
</style>

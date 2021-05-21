<template>
    <div style="width: 100%;height: 100%;background: white">

        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-query-grid title="服务标注"
                            data-url="/biz/ProEvtServiceLabel/list"
                            :query="query"
                            :columns="columns"
                            :operationsWidth=150
                            :operations="operations"
                            ref="mainQueryGrid">
            </ice-query-grid>
            <ice-dialog v-dialogDrag title="服务标准编辑" :visible.sync="VisibleItemLabel"
                        width="50%" remounted>
                <el-form :model="labelForm" :rules="formRules" ref="saveLabelForm">
                    <el-form-item label="服务单号:" label-width="105px">
                        {{labelForm.serviceTicket}}
                    </el-form-item>
                    <el-form-item label="标注:" label-width="105px" prop="labelContent">
                        <el-input type="textarea" maxlength="1024" v-model="labelForm.labelContent"></el-input>
                        <el-input type="hidden" v-model="labelForm.serviceTicket"></el-input>
                    </el-form-item>
                </el-form>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="saveLabel">确定</el-button>
                    <el-button type="info" @click="closeLabel">取消</el-button>
                </div>

            </ice-dialog>
        </div>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "serviceTicketLabel",
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '服务单号', code: 'serviceTicket', width:155},
                {type: 'date',label: '创建时间', code: 'createDate', width:300},
                {type: 'date',label: '修改时间', code: 'updateDate', width:300},
                {label: '标注内容', code: 'labelContent',},]
            return {
                query:[
                    {type: 'input',label: '服务单号', code: 'serviceTicket', width: 155},
                    {type: 'input',label: '标注内容', code: 'labelContent'}
                    ],
                columns: ncolumns,
                VisibleItemLabel: false,
                labelContent: '',//标注
                formRules: {//标注表单字段规则
                    labelContent: [{required: true, message: '请输入标注内容', trigger: 'blur'}]
                },
                labelForm: {
                    labelContent: "",
                    serviceTicket: ""
                },
                // buttons: [{name: '导出', icon: 'el-icon-upload2', type: 'primary',callBack:this.add}],
                editData: common.toInitData(ncolumns, {fund: 0}),
                editRules: common.toFormRules(ncolumns),
                operations: [
                    {name: '删除', callback: this.deleteLabel},
                    {name: '编辑', callback: this.updateLabel}
                ],
            }
        },
        methods: {
            /**
             *服务单标注保存
             */
            deleteLabel(row) {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/ProEvtServiceLabel/del", {params: {"id": row.oid}}).then(success => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg);
                    })
                })
            },
            updateLabel(row) {
                let obj = {};
                Object.assign(obj, row);
                this.VisibleItemLabel = true;
                this.$nextTick(() => {
                    this.labelForm = obj;
                })

            },
            saveLabel() {
                this.$refs['saveLabelForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/biz/ProEvtServiceLabel/saveOrUpdate", this.labelForm)
                        .then(result => {
                            this.$message.success(result.data == null ? "保存成功" : result.data);
                            this.VisibleItemLabel = false;
                            this.$refs.mainQueryGrid.refresh();
                        }).catch(error => {

                    });
                });
            },
            /**
             *
             */
            closeLabel() {
                this.VisibleItemLabel = false;
            },
        },
        watch: {
            dialogEditVisible() {
                this.$refs.mainQueryGrid.refresh();
            }
        },
        components: {IceDialog, IceSelect, IceQueryGrid},
        mounted() {
            this.$on('success',()=>{
                this.$refs.mainQueryGrid.refresh();
            })
        },
    }
</script>

<style scoped>

</style>
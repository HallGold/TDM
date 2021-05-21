<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title=""
                        data-url="/pro/ProBaseUserExtention/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}用户信息`"
                   custom-class="ice-dialog" center :visible.sync="dialogEditVisible"
                   width="1000px" append-to-body :close-on-click-modal="false" remounted>
            <pro-base-user-extention-store ref="$userStore"
                                           :edit-data="editData"
                                           :editRules="editRules"
                                           :unitCode="unitCode" :unitName="unitName" :source="source"
                                           :dialogEditReadonly="dialogEditReadonly"
                                           @userStoreCannel="userStoreCannel"
                                           @userStoreSave="userStoreSave"
            ></pro-base-user-extention-store>
        </el-dialog>


    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBaseUserExtentionStore from "../module/ProBaseUserExtentionStore";
    import {validateTelphone,validatePhone,validateEMail,isInteger} from  "./Validator.js"

    export default {
        name: "ProBaseUserExtention",
        props: {
            unitCode: String,
            unitName: String,
            source: {
                type: Number,
                default: -999
            }
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: 'remark', code: 'remark', hidden: true},
                {label: '联系方式', code: 'contact', hidden: true},
                {label: '性别', code: 'sex', hidden: true, required: true},
                {label: '证件类型', code: 'certType', hidden: true},
                {label: '证件号', code: 'certId', hidden: true},
                {label: '单位', code: 'unitCode', hidden: true},

                {label: '用户名', code: 'username', width: 180, required: true},
                {label: '用户来源', code: 'source',width:120, required: true},
                {label: '单位', code: 'unitName', width: 150, required: true },
                {label: '用户星级', code: 'userLevel', width: 100,functions:isInteger, required: true,},
                {label: '座机', code: 'telephone', width: 160,functions:validateTelphone},
                {label: '手机', code: 'cellphone', width: 160,functions:validatePhone},
                {label: '邮箱', code: 'email', width: 160,functions:validateEMail},
                {label: '是否启用', code: 'status', width: 100, mapTypeCode: "enabled", required: true, sortable: true}];

            let staticQuery = [];
            if (typeof (this.unitCode) != undefined) {
                staticQuery.push({
                    type: 'static', value: () => {
                        return this.unitCode
                    }, code: 'unitCode'
                })
            }
            if (this.source != -999) {
                staticQuery.push({
                    type: 'static', value: () => {
                        return this.source
                    }, code: 'source'
                })
            }

            return {
                query: common.toQuery(ncolumns, staticQuery),
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem},
                    {name: '删除', callback: this.delItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                editData: common.toInitData(ncolumns, {sex: 1}),
                editRules: common.toFormRules(ncolumns, {
                    'unitName': [{required: true, whitespace: true, message: '请选择用户单位', trigger: 'change'}],
                    'sex': [{required: true, message: '请选择性别', trigger: 'blur'}],
                    'userLevel': [{required: true, message: '请填写用户星级', trigger: 'blur'}],
                }),
                dialogVisibleProBaseCustUnitChoose: false
            }
        },
        methods: {
            refreshGrid() {
                this.$refs.mainQueryGrid.refresh();
            },
            userStoreSave() {
                this.dialogEditVisible = false;
            },
            userStoreCannel() {
                this.dialogEditVisible = false;
            },
            addCallback() {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = common.toInitData(this.columns, {userLevel: 1});
                this.$nextTick(() => {
                    this.$refs.$userStore.show();
                    this.$refs.$userStore.canelT();
                })
            },
            viewItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
                this.editData.source = this.editData.source + '';
                this.$nextTick(() => {
                    this.$refs.$userStore.show();
                })
            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                this.editData.source = this.editData.source + '';
                this.$nextTick(() => {
                    this.$refs.$userStore.show();
                })
            },
            delItem(row) {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProBaseUserExtention/del", {"params": {"id": row.oid}})
                        .then(result => {
                            console.log(result);
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            }

        },
        watch: {
            dialogEditVisible() {
                this.$refs.mainQueryGrid.refresh();
            },

        },
        components: {ProBaseUserExtentionStore, IceSelect, IceQueryGrid}
    }
</script>

<style scoped>

</style>
<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title=""
                        data-url="/pro/ProBaseContacter/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>
        <el-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}用户信息`" custom-class="ice-dialog" center
                   :visible.sync="dialogEditVisible"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <pro-base-contacter-store ref="$userStore"
                                      :editData="editData"
                                      :editRules="editRules"
                                      :customerId="customerId"
                                      :isEdit="isEdit"
                                      :dialogEditReadonly="dialogEditReadonly"
                                      @userStoreCannel="userStoreCannel"
                                      @userStoreSave="userStoreSave"
            ></pro-base-contacter-store>
        </el-dialog>

    </div>
</template>

<script>

    import common from '@/utils/common.js';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBaseContacterStore from "../module/ProBaseContacterStore";

    export default {
        name: "ProBaseContacter",
        props: {
            customerId: String,
            unitName:String,
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '备注', code: 'remark', hidden: true},
                // {label: '合作单位ID', code: 'customerId', hidden: true},

                {label: '合作单位id', code: 'customerId', width: 190, hidden: true, required: true},
                {label: '合作单位名称', code: 'unitname', width: 190},
                {label: '联系人', code: 'username', width: 100, required: true},
                {label: '性别', code: 'sex', width: 100, mapTypeCode: "SEX", required: true},
                {label: '联系方式', code: 'contact', width: 100, required: true},
                {label: '证件类型', code: 'certType', width: 100, mapTypeCode: "PRO_CERT_TYPE"},
                {label: '证件号', code: 'certId', width: 190}];
            let staticQuery = [];
            if (typeof (this.customerId) != undefined) {
                staticQuery.push({
                    type: 'static', value: () => {
                        return this.customerId
                    }, code: 'customerId'
                })
            }
            return {
                query: common.toQuery(ncolumns, staticQuery),
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem},
                    {name: '删除', callback: this.delItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                editData: common.toInitData(ncolumns),
                editRules: common.toFormRules(ncolumns, {
                    'customerId': [{required: true, message: '请选择合作单位', trigger: 'change'}]
                }),
                dialogEditVisible: false,
                dialogEditReadonly: false,
                isEdit:false,
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
                this.isEdit = false;
                this.editData = common.toInitData(this.columns);
                if(!!this.unitName){
                    this.editData.unitname = this.unitName
                }
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.$nextTick(() => {
                    this.$refs.$userStore.show();
                });
            },
            viewItem(row) {
                this.isEdit = false;
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
                this.$nextTick(() => {
                    this.$refs.$userStore.show();
                })
            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                if(!!this.editData.certType){
                    this.isEdit = true;
                }
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
                    this.$axios.delete("/pro/ProBaseContacter/del", {"params": {"id": row.oid}})
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
            }
        },
        components: {ProBaseContacterStore, IceSelect, IceQueryGrid}
    }
</script>

<style scoped>

</style>
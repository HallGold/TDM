<template>
    <div class="grid-container" v-show="show">
        <el-dialog v-dialogDrag title="查看最终数据权限" custom-class="ice-dialog" center :visible.sync="show"
        width="960px" append-to-body :close-on-click-modal="false" v-if="mode == 'dialog'">
            <ice-query-grid title="查看最终数据权限"
                            :data-url="url"
                            :query="query"
                            :columns="columns"
                            :operationsWidth=200
                            :operations="operations">
            </ice-query-grid>
        </el-dialog>

        <ice-query-grid title="查看最终数据权限"
                        data-url="url"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        v-if="mode == 'page'">
        </ice-query-grid>

        <tsys-role-perm-field ref="permFieldRef" mode="dialog"></tsys-role-perm-field>
        <tsys-role-perm-policy ref="permPolicyRef"></tsys-role-perm-policy>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import TsysRolePermField from "./TsysRolePermField";
    import TsysRolePermPolicy from "./TsysRolePermPolicy";

    export default {
        name: "TsysRolePermTable",
        props:{
            mode  :{
                type: String,
                default: 'dialog',
                validator: function (value) {
                    return ['page', 'dialog'].indexOf(value) !== -1
                }
            }
        },
        data (){
            return{
                userCode:"",
                show:false,
                url:"",
                query:[{label: '表编码', code: 'tableCode', width: 190}],
                columns:[{label: '表编码', code: 'tableCode', width: 190},
                    {label: '查询权限', code: 'permSelect', width: 68,renderCell(h, data){ return data.row.permSelect==0?"否":"是"}},
                    {label: '修改权限', code: 'permUpdate', width: 68,renderCell(h, data){ return data.row.permUpdate==0?"否":"是"}},
                    {label: '新增权限', code: 'permInsert', width: 68,renderCell(h, data){ return data.row.permInsert==0?"否":"是"}},
                    {label: '删除权限', code: 'permDelete', width: 68,renderCell(h, data){ return data.row.permDelete==0?"否":"是"}},
                    {label: '来自角色', code: 'dataroleName', width: 190}],
                operations:[{name: "列级隔离", callback: this.fieldCallback},{name: "行级隔离", callback: this.policyCallback}]
            }
        },
        methods:{
            open(userCode){
                this.userCode = userCode;
                this.url = '/datamanage/TsysRolePerm/tableList?userCode='+userCode;
                this.show = true;
            },
            fieldCallback(row){
                this.$refs.permFieldRef.open(this.userCode,row.tableCode);
            },
            policyCallback(row){
                this.$refs.permPolicyRef.open(this.userCode,row.tableCode);
            }
        },
        components: {IceQueryGrid,TsysRolePermField,TsysRolePermPolicy}
    }
</script>

<style scoped>

</style>
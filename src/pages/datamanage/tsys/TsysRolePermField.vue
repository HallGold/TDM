<template>
    <div class="grid-container" v-show="show">
        <el-dialog v-dialogDrag title="查看列级隔离字段" custom-class="ice-dialog" center :visible.sync="show"
                   width="960px" append-to-body :close-on-click-modal="false" v-if="mode == 'dialog'">
            <ice-query-grid title="查看列级隔离字段"
                            :data-url="url"
                            :query="query"
                            :columns="columns"
                            :pagination="false">
            </ice-query-grid>
        </el-dialog>

        <ice-query-grid title="查看列级隔离字段"
                        data-url="url"
                        :query="query"
                        :columns="columns"
                        :pagination="false"
                        v-if="mode == 'page'">
        </ice-query-grid>

    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "TsysRolePermField",
        props:{
            mode  :{
                type: String,
                default: 'dialog',
                validator: function (value) {
                    return ['page', 'dialog'].indexOf(value) !== -1
                }
            }
        },
        data(){
            return{
                show:false,
                url:"",
                query:[{label: '字段编码', code: 'columnCode', width: 190}],
                columns:[{label: '表编码', code: 'tableCode', width: 190,hidden:true},{label: '字段编码', code: 'columnCode', width: 190},
                    {label: '字段分类', code: 'columnCls', width: 90, mapTypeCode:  "globalFieldType"},
                    {label: '字段名称', code: 'columnName', width: 190},
                    {label: '数据类型', code: 'datatype', width: 190},{label: '来自角色', code: 'dataroleName', width: 190}
                ]
            }
        },
        methods:{
            open(userCode,tableCode){
                this.url = '/datamanage/TsysRolePerm/fieldList?userCode='+userCode+'&tableCode='+tableCode;
                this.show = true;
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
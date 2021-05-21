<template>
    <div class="grid-container">
        <!-- 主表格 -->
        <ice-query-grid title="字段选择"
                        :data-url="'/datamanage/TsysFieldLib/list?tableId='+tableId"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :pagination=false
                        ref="gridRef"
                        :choose-item="chooseItem">
        </ice-query-grid>
        <el-row style="text-align: center;">
            <el-button @click="selectCannel">取消</el-button>
            <el-button type="primary" @click="selectConfirm">确定选择</el-button>
        </el-row>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "TsysFieldLibChoose",
        props:{
            tableId:String,
            chooseItem:String
        },
        data(){
            return{
                query: [{type: 'input', label: '字段编码', code: 'columnCode'},
                    {type: 'input', label: '字段名称', code: 'columnName'},
                    {type: 'select', label: '变量类型', code: 'columnCls', mapTypeCode:  "globalFieldType"}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: 'tableId', code: 'tableId', hidden:true},
                    {label: '字段编码', code: 'columnCode', width: 190},
                    {label: '字段名称', code: 'columnName', width: 190},
                    {label: '字段分类', code: 'columnCls', width: 190, mapTypeCode:  "globalFieldType"}]
            };
        },
        methods:{
            selectConfirm(){
                let rows = this.$refs.gridRef.getSelections();
                if(rows.length == 0){
                    this.$message.error("请选择字段。");
                    return;
                }
                this.$emit("select-confirm", rows);
            },
            selectCannel(){
                this.$emit("select-cannel");
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>

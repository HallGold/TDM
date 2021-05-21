<template>
    <div class="grid-container">
        <!-- 主表格 -->
        <ice-query-grid title="全局变量选择"
                        data-url="/datamanage/TsysCfgGlobalvar/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :choose-item="chooseItem"
                        @select-confirm="selectConfirm"
                        ref="gridRef"
                        @select-cannel="selectCannel">
        </ice-query-grid>
        <el-row style="text-align: center;">
            <el-button @click="selectCannel">取消</el-button>
            <el-button type="primary" @click="selectConfirm">确定选择</el-button>
        </el-row>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "TsysCfgGlobalValChoose",
        props:{
            chooseItem:String
        },
        data(){
            return{
                query: [{type: 'input', label: '变量编码', code: 'globalVarCode'},
                    {type: 'input', label: '变量名称', code: 'globalVarName'},
                    {type: 'select', label: '变量类型', code: 'globalVarType', mapTypeCode:  "globalFieldType"}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: '全局变量编码', code: 'globalVarCode', width: 190},
                    {label: '全局变量名称', code: 'globalVarName', width: 190},
                    {label: '变量类型', code: 'globalVarType', width: 190, mapTypeCode:  "globalFieldType"},
                    {label: '配置描述', code: 'globalVarDesc', width: 190}]
            };
        },
        methods:{
            selectConfirm(){
                let rows = this.$refs.gridRef.getSelections();
                if(rows.length == 0){
                    this.$message.error("请选择全局变量。");
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

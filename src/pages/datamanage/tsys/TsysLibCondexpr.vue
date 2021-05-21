<template>
    <div class="grid-container">
        <!-- 主表格 -->
        <ice-query-grid title="表达式管理"
                        :data-url="'/datamanage/TsysLibCondexpr/list?datapolicyId='+datapolicyId"
                        :query="query"
                        :columns="columns"
                        :pagination=false
                        :buttons="buttons">
        </ice-query-grid>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "TsysLibCondexpr",
        props:{datapolicyId:String, closePage:Boolean},
        data(){
            return {query: [{type: 'input',label: '表达式编码', code: 'exprCode', width: 190},
                    {type: 'input',label: '表达式名称', code: 'exprName', width: 190}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: '表达式编码', code: 'exprCode', width: 190},
                    {label: '表达式名称', code: 'exprName', width: 190},
                    {label: '表达式类型', code: 'exprType', width: 100},
                    {label: '字段名', code: 'fieldCode', width: 100},
                    {label: '操作符', code: 'operator', width: 100},
                    {label: '策略合并方式', code: 'datapolicyOperator', width: 100},
                    {label: '参数', code: 'param', width: 100},
                    {label: '表达式', code: 'expr', width: 100}],
                buttons:[]}
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
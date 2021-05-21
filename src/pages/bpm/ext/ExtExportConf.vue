<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="流程配置导入记录"
                        data-url="/bpm/ExtExportConf/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        ref="grid">
        </ice-query-grid>
    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'ExtExportConf',
        data() {
            return {
                query: [
                    {type: 'input', label: '流程定义ID', code: 'actDefId'},
                    {type: 'input', label: '内容', code: 'actDefName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '流程定义ID', code: 'actDefId', width: 100,},
                    {label: '流程定义名', code: 'actDefName', width: 140,},
                    {label: '内容', code: 'confContext', width: 240}
                    ],
                operations: [
                    {name: '查看', callback: this.export},
                ]
            }
        },
        methods: {
            export(row) {
                window.open(this.$apicontext+"bpm/ExtExportConf/download?actDefId="+item.actDefId,"_blank");
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

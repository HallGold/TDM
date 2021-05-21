<template>
    <div class="ice-full-relative">
        <ice-query-grid data-url="/devtool/PageDefinition/list"
                        style="height: 100%"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons"
                        ref="grid">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "PageDefinitionList",
        data() {
            return {
                query: [
                    {type: 'input', label: '页面名称', code: 'pageName', value: '', exp: 'like'},
                    {type: 'input', label: '页面编码', code: 'pageCode', value: '', exp: 'like'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '页面名称', code: 'pageName', width: 160, sortable: true},
                    {label: '页面编码', code: 'pageCode', width: 160, sortable: true},
                    {label: '所属APP', code: 'appModule', width: 100, sortable: true},
                    {label: '所属功能', code: 'funModule', width: 100},
                    {label: '页面描述', code: 'desc', width: 180,},
                    {label: '最后操作人', code: 'updateUser', width: 150},
                    {label: '最后操作时间', code: 'updateDate', width: 125, sortable: true}],
                operations: [
                    {name: '设计', callback: this.designItem},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem},
                ]
            }
        },
        methods: {
            addItem() {
                this.$router.push("/devtool/PageDesinger")
            },
            designItem(item) {
                this.$router.push("/devtool/PageDesinger?id=" + item.oid)
            },
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
<template>
    <div class="ice-container">
        <ice-query-grid
                chooseItem="single"
                data-url="/pms/PmsViewCpk/list"
                :columns="columns"
                :query="query"
                @selection-change="select"
                ref="grid">
        </ice-query-grid>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        components: {IceSelect, IceDialog, IceQueryGrid},
        data() {
            return {
                loading: false,
                query: [
                    {type: 'input', code: 'cpname', label: '产品名称'},
                    {type: 'input', code: 'cpcode', label: '产品编号'},
                ],
                columns: [
                    {code: 'cpid', hidden: true},
                    {label: '产品编号', code: 'cpcode', width: 140},
                    {label: '产品名称', code: 'cpname', width: 160},
                ],
            }
        },
        methods: {
            select(item) {
                this.$emit("select", item);
            }
        }
        ,
        computed: {}
        ,
        watch: {}
        ,
        mounted() {

        }
        ,
    }

</script>

<style scoped>

</style>
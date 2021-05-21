<template>
    <div class="ice-container">
        <ice-query-grid
                chooseItem="single"
                data-url="/pms/PmsWbs/list"
                :columns="columns"
                :query="query"
                @selection-change="select"
                ref="grid">
        </ice-query-grid>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        components: {IceQueryGrid},
        props: {
            oidXm:{
                default: ""
            }
        },
        data() {
            return {
                loading: false,
                query: [
                    {type: 'input', code: 'rwname', label: '任务名称'},
                    {type: 'input', code: 'rwgq', label: '工期'},
                    {type: 'input', code: 'rwfzr', label: '任务负责人'},
                    {type: 'input', code: 'rwdept', label: '责任部门'},
                    //过滤掉任务状态为未下发的
                    {type: 'static', code: 'rwzt', value: 'RWZT10', exp: '!='},
                    {
                        type: 'static', code: 'oidXm', value: () => {
                            return this.oidXm
                        }, exp: '='
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidXm', hidden: true},
                    {label: 'WBS编号', code: 'wbscode', width: 200},
                    {label: '任务名称', code: 'rwname', width: 200,},
                    {label: '前置任务', code: 'qzrw', width: 200},
                    {label: '工期', code: 'rwgq', width: 100},
                    {label: '实际开始日期', code: 'dateSjStar', width: 200},
                    {label: '实际完成日期', code: 'dateSjEnd', width: 200,},
                    {label: '部门', code: 'rwdept', width: 140,},
                    {label: '任务负责人', code: 'rwfzr', width: 140},
                    {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: 'DATA_SECRET_LEVEL'},

                ],
            }
        },
        methods: {
            select(item) {
                this.$emit("select", item);
            },
            refresh () {
                this.$refs.grid.refresh();
            }
        }
    }

</script>

<style scoped>

</style>

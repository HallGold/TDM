<template>
    <ice-grid-layout :columns="3" name="回访信息">
        <ice-query-grid
                data-url="biz/ProUserFeedback/list"
                :gridAutoRefresh="false"
                :columns=columns
                :query=query
                ref="grid"
        ></ice-query-grid>
    </ice-grid-layout>
</template>

<script>

    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "returnVisit",
        components: {IceQueryGrid, IceGridLayout},
        data() {
            return {
                NumData: [],
                columns: [
                    {label: '解决情况', code: 'isDone', mapTypeCode: "YES_NO"},
                    {label: '处理速度', code: 'disposeSpeed'},
                    {label: '响应速度', code: 'responseSpeed'},
                    {label: '服务态度', code: 'servSpeed'},
                    {label: '专业能力', code: 'ability'},
                    {label: '评价时间', code: 'gmtCreate'},
                    {label: '总分', code: 'totalScore'},
                    {label: '说明', code: 'evaluation'},
                ],
                query: [
                    {
                        type: 'static', code: 'ticketNumber', exp: '=', value: () => {
                            return this.number;
                        }
                    },
                ]
            }
        },
        methods: {
            returnVisit(data) {
                this.number = data;
                this.$refs.grid.refresh();
            }
        },
    }
</script>

<style scoped>

</style>
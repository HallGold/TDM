<template>
    <div class="ice-full-absolute">
        <ice-query-grid :pagination="false"
                        :gridAutoRefresh="false"
                        ref="grid"
                        :operations-width="120"
                        :columns="columns"
                        :operations="operations"
                        :data-url="`/biz/questionnaire/QuesPublishInfo/list?id=${pagerId}`">

        </ice-query-grid>
        <ice-dialog :visible.sync="publishDirect" width="900px" title="直接发布" remounted>
            <question-publish-direct ref="direct" :directData="directData"></question-publish-direct>
            <div class="ice-button-bar">
                <el-button @click="publishDirect=false" type="info">取消</el-button>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import QuestionPublishDirect from "../questionPublishDirect";

    export default {
        name: "questionPublishedHistory",
        components: {QuestionPublishDirect, IceQueryGrid},
        props: {
            pagerId: String
        },
        data() {
            return {
                publishDirect: false,
                directData: {},
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '生效时间从', code: 'startTime', width: 150, sortable: true},
                    {label: '生效时间至', code: 'endTime', width: 150},
                    {
                        label: '流程状态',
                        code: 'afStatus',
                        width: 100,
                        sortable: true,
                        renderCell: (h, data) => {
                            if (!data.row.afNo) {
                                return "直接发布"
                            } else if (1 == data.row.afStatus) {
                                return "运行中"
                            } else if (2 == data.row.afStatus) {
                                return "已完成"
                            } else if (3 == data.row.afStatus) {
                                return "驳回"
                            } else if (-1 == data.row.afStatus) {
                                return "草稿"
                            }
                        }
                    },
                    {
                        label: '发布状态', code: 'status', width: 100, formatter: row => {
                            return row.status == '1' ? '已发布' : '未发布'
                        }
                    },
                    {label: '申请时间', code: 'afDate', width: 160, sortable: true},
                    {label: '申请人', code: 'afUserName', width: 125},
                    {code: 'afNo', width: 180, hidden: true},
                    {code: 'deptScopes', width: 180, hidden: true},
                    {code: 'persionScopes', width: 180, hidden: true},
                    {code: 'remark', width: 180, hidden: true},],
                operations: [
                    {name: '查看', code: "BXZ1", callback: this.view},
                ]
            }
        },
        methods: {
            refresh() {
                if (this.pagerId && this.$refs.grid) {
                    this.$refs.grid.refresh();
                }
            },
            view(item) {
                if (item.afNo) {
                    this.$emit("view");
                    this.$openFlow(`/questionnaire/publish?pagerId=${this.pagerId}&dataId=${item.oid}`)
                } else {
                    this.directData = item;
                    this.publishDirect = true;
                }

            }
        },
        watch: {
            pagerId: {
                handler() {
                    this.refresh()
                },
                immediate: true
            }
        },
        mounted() {
            this.refresh()
        }
    }
</script>

<style scoped>

</style>

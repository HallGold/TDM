<template>
    <div>
        <ice-query-grid
                v-if="initOver"
                :data-url="ENUMS.ACTIONS.GET_DEV_HISTORY.URL()"
                :query="PAGE_ENUM.QUERY"
                :columns="PAGE_ENUM.COLUMNS"
                :operations="PAGE_ENUM.OPERATIONS"
                :pagination="false"
                :ref="PAGE_ENUM.REFS.GRID">
        </ice-query-grid>
    </div>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import IceQueryGrid from '@/components/common/base/IceQueryGrid';

    export default {
        name: "devHistory",
        mixins: [bizComm, devComm],
        components: {IceQueryGrid},
        props: {
            //设备Id
            devId: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {GRID: "grid"},
                    QUERY: [],
                    COLUMNS: [],
                    OPERATIONS: []
                },
                initOver: false,
            };
        },
        methods: {
            /**
             * 初始化查询条件
             */
            initQuery() {
                this.PAGE_ENUM.QUERY = [
                    {type: 'static', label: '设备ID', code: 'devId', width: 80, value: () => this.devId}
                ];
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.PAGE_ENUM.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {label: '变更人', code: 'createUser', width: 100},
                    {label: '变更原因', code: 'reason', width: 300},
                    {
                        label: '明细',
                        code: 'detail',
                        width: 400,
                        align: "left",
                        formatter: (row, column, cellValue, index) => {
                            return _this.renderDetail(row.detail);
                        }
                    },
                    {label: '变更时间', code: 'changeUpdateDate', width: 200}
                ];
            },
            /**
             * 渲染明细
             * @param data
             */
            renderDetail(details) {
                return <div class="detail-div">
                    <ul class="detail-ul">
                        {details.map(item => {
                            return (<li class="detail-li">
                                {item.updateField} : [{item.oldValue}] => [{item.newValue}]
                            </li>)
                        })}
                    </ul>
                </div>
            }
        },
        mounted() {
            this.initColumns();
            this.initQuery();
            this.initOver = true;
        }
    }
</script>

<style scoped>
    .detail-div{
        width:400px;
        height: 100px;
        maxHeight: 300px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: white
    }
    .detail-ul {

    }

    .detail-li {
    }
</style>
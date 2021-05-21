<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;">
        <ice-query-grid title="变更审批查询"
                        :data-url="ENUM.ACTIONS.QUERY_ALTERATION_LIST.URL()"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :operationsWidth=60
                        :minHeight="530"
                        :buttons="buttons">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import comm from "./js/comm";
    import renderer from "./js/renderer";

    export default {
        name: "alterationTrace",
        mixins: [comm, renderer],
        data() {
            return {
                buttons: [],
                query: [],
                columns: [],
                operations: []
            }
        },
        methods: {
            initControls() {
                this.initOperation();
                this.initQuery();
                this.initButtons();
                this.initColumns();
            },
            //初始化表格操作列
            initColumns() {
                let that = this;
                this.columns = [
                    {code: 'oid', hidden: true},
                    {
                        label: '变更类型', code: 'alterationType', width: 100, renderCell(h, data) {
                            return that.onTypeRenderer(data.row);
                        }
                    },
                    {label: '变更单号', code: 'alterationNum', width: 140},
                    {
                        label: '区域', code: 'area', width: 150, formatter: row => {
                            return that.onNetAndTypeRenderer(row);
                        }
                    },
                    /*  {label: '区域type', code: 'netType', hidden: true},
                      {label: '区域code', code: 'netArea', hidden: true},*/
                    // {label: '服务目录', width: 150},
                    {label: '申请内容', code: 'applyCont', width: 220},
                    {
                        label: '变更来源', code: 'alterationSource', width: 100, mapTypeCode: "SOURCE"
                    },
                    {
                        label: '状态', code: 'apprStatus', width: 120, renderCell(h, data) {
                            return that.onStateRenderer(data.row);
                        }
                    },
                    {label: '申请日期', code: 'gmtApply', width: 100},
                    {label: '服务项申请用户', code: 'proposerName', width: 120},
                    {label: '服务项申请单位', code: 'applyUnit', width: 120}
                ];
            },
            //初始化表格查询
            initQuery() {
                this.query = [{type: 'input', label: '变更单号', code: 'alterationNum', value: ''},
                    {type: 'input', label: '申请用户', code: 'proposerName', value: ''},
                    {
                        type: 'select', label: '区域', code: 'area', options: this.ENUM.AREA, textProp: 'name',
                        codeProp: 'code'
                    },
                    {
                        type: 'select',
                        label: '状态',
                        code: 'apprStatus',
                        textProp: 'label',
                        codeProp: 'value',
                        options: this.enumCodeNameToValueLabel(this.ENUM.APPR_STATUS.properties)
                    },
                    {type: 'date', label: '申请日期(开始)', code: 'gmtApply', exp: ">"},
                    {type: 'date', label: '申请日期(结束)', code: 'gmtApply', exp: "<"}];
            },
            //初始化表格操作按钮
            initOperation() {

                this.operations = [
                    Object.assign({}, this.ENUM.OPERATION.VIEW, {callback: this.view})
                ]
            },
            //初始化表格按钮
            initButtons() {
                this.buttons = [
                    Object.assign({}, this.ENUM.BUTTON.EXPORT)
                ]
            },
            //查看
            view(row) {
                this.openEditPage(row.oid, this.ENUM.ACTIONTYPE.VIEW);
            },
            //打开编辑页面
            openEditPage(id, actionType) {
                this.$router.push(this.ENUM.ROUTER.ALTERATION_EDIT.URL({
                    dataId: id,
                    actionType: actionType
                }));
            }
        },
        mounted() {
            let _this = this;
            Promise.all([_this.initEnumApprStatus(), _this.requestNetAreaData()]).then(res => {
                if (typeof _this.initControls == "function") {
                    _this.initControls();
                }
            });
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;">
        <ice-query-grid title="变更实施查询"
                        :data-url="ENUM.ACTIONS.QUERY_EXECU_PAGE.URL()"
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
        name: "alterationExecu",
        mixins: [comm, renderer],
        data() {
            return {
                query: [],
                columns: [],
                operations: [],
                buttons: []
            }
        },
        methods: {
            initControls() {
                this.initOperation();
                this.initQuery();
                this.initColumns();
                this.initButton();
            },
            initButton() {
                this.buttons = [Object.assign({}, this.ENUM.BUTTON.EXPORT)];
            },
            //初始化表格操作列
            initColumns() {
                let that = this;
                this.columns = [
                    {code: 'oid', hidden: true},
                    // {
                    //     label: '变更类型', code: 'alterationType', width: 80, renderCell(h, data) {
                    //         return that.onTypeRenderer(data.row);
                    //     }
                    // },
                    {label: '变更单号', code: 'alterationNum', width: 140},
                    {
                        label: '状态', code: 'execuStatus', width: 120, renderCell(h, data) {
                            return that.getNameByCode(that.ENUM.EXECUTE_STATUS.properties, data.row.execuStatus);
                        }
                    },
                    {label: '区域', code: 'area', width: 120},
                    {label: '服务大类', code: 'categoryName', width: 150},
                    {label: '服务分类', code: 'catalogName', width: 150},
                    {label: '服务项', code: 'itemName', width: 90},
                    {label: '变更对象', code: 'devName', width: 120},
                    {label: '对象编号', code: 'devNum', width: 100},
                    {label: '对象IP', code: 'devIp', width: 80},
                    // {label: '配置相关信息', code: 'setting', width: 100},
                    {label: '实施内容', code: 'content', width: 160},
                    {
                        label: '是否自动化', code: 'isAuto', width: 120, renderCell(h, data) {
                            return that.onYesOrNoRenderer(data.row);
                        }
                    },
                    {label: '完成时间', code: 'gmtComplete', width: 150},
                    {label: '耗时(分钟)', code: 'execuTime', width: 120},
                    {label: '实施人', code: 'eoCreatorName', width: 120},
                    // {label: '实施人单位', code: 'executorUnit', hidden: true}
                ];
            },
            //初始化表格查询
            initQuery() {
                this.query = [{type: 'input', label: '变更单号', code: 'alterationNum', value: ''},
                    {type: 'input', label: '实施人', code: 'eoCreatorName', value: ''},
                    {type: 'date', label: '完成时间', code: 'gmtComplete', exp: ">"},
                    {
                        type: 'select', label: '区域', code: 'area', options: this.ENUM.AREA, textProp: 'name',
                        codeProp: 'name'
                    },
                    {
                        type: 'select',
                        label: '状态',
                        code: 'execuStatus',
                        textProp: 'label',
                        codeProp: 'value',
                        options: this.enumCodeNameToValueLabel(this.ENUM.EXECUTE_STATUS.properties)
                    }];
            },
            //初始化表格操作按钮
            initOperation() {
                this.operations = [
                    Object.assign({}, this.ENUM.OPERATION.VIEW, {callback: this.view})
                ]
            },
            //查看
            view(row) {
                this.openEditPage(row.oid, this.ENUM.ACTIONTYPE.VIEW);
            },
            //打开编辑页面
            openEditPage(id, actionType) {
                this.$router.push(this.ENUM.ROUTER.ALTERATION_EXECUTE.URL({
                    dataId: id,
                    actionType: actionType
                }));
            },
        },
        mounted() {
            let _this = this;
            Promise.all([_this.initEnumExecuteStatus(), _this.requestNetAreaData()]).then(res => {
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
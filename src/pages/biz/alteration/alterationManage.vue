<template>
    <div class="content-filled">
        <ice-query-grid title="变更台账管理"
                        :data-url="ENUM.ACTIONS.GET_CURRENT_USER_LIST.URL()"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :operationsWidth=120
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
        name: "alterationManage",
        mixins: [comm, renderer],
        components: {IceQueryGrid},
        data() {
            return {
                buttons: [],
                query: [],
                columns: [],
                gridData: [{
                    netArea: "yjg",
                    netType: "B",
                    content: "11",
                    gmtApply: "11",
                    proposerName: "123",
                    alterationSource: "234",
                    applyUnit: "2112",
                    alterationNum: "5555",
                    apprStatus: "0",
                    alterationType: "0"
                }],
                operations: []
            }
        },
        methods: {
            initControls() {
                //初始化页面按钮
                this.initButtons();
                //初始化表格操作按钮
                this.initOperation();
                //初始化查询
                this.initQuery();
                //初始化表格列
                this.initColumns();
            },
            //初始化表格查询
            initQuery() {
                let that = this;
                this.query = [{type: 'input', label: '变更单号', code: 'alterationNum', value: ''},
                    {type: 'input', label: '申请用户', code: 'proposerName', value: ''},
                    {
                        type: 'select', label: '区域', code: 'area', textProp: 'name',
                        codeProp: 'code',
                        options: that.ENUM.AREA,
                    },
                    {
                        type: 'select',
                        label: '状态',
                        code: 'apprStatus',
                        textProp: 'label',
                        codeProp: 'value',
                        options: that.enumCodeNameToValueLabel(that.ENUM.APPR_STATUS.properties)
                    },
                    {type: 'date', label: '申请日期(开始)', code: 'gmtApply', exp: ">"},
                    {type: 'date', label: '申请日期(结束)', code: 'gmtApply', exp: "<"}];
            },
            //初始化表格操作按钮
            initOperation() {
                let that = this;
                this.operations = [
                    Object.assign({}, this.ENUM.OPERATION.EDIT, {callback: this.edit}, {
                        isShow(row) {
                            return that.isOperationShow(row.apprStatus);
                        }
                    }),
                    Object.assign({}, this.ENUM.OPERATION.VIEW, {callback: this.view}),
                    Object.assign({}, this.ENUM.OPERATION.DELETE, {callback: this.delete}, {
                        isShow(row) {
                            return that.isOperationShow(row.apprStatus);
                        }
                    })
                ];
            },
            //操作按钮是否显示
            isOperationShow(value) {
                if (value == this.ENUM.APPR_STATUS.DRAFT) {//草稿状态
                    return true;
                }
                return false;
            },
            //初始化表格按钮
            initButtons() {
                this.buttons = [
                    Object.assign({}, this.ENUM.BUTTON.ADD, {callback: this.addItem}),
                    Object.assign({}, this.ENUM.BUTTON.ADD_OLD, {callback: this.addOld}),
                    Object.assign({}, this.ENUM.BUTTON.EXPORT)
                ]
            },
            initColumns() {
                let that = this;
                this.columns = [
                    {code: 'oid', hidden: true},
                    {
                        label: '变更类型', code: 'alterationType', width: 100, renderCell(h, data) {
                            return that.onTypeRenderer(data.row);
                        }
                    },
                    {label: '变更单号', code: 'alterationNum', width: 180},
                    {
                        label: '区域', code: 'area', width: 100, formatter: row => {
                            return that.onNetAndTypeRenderer(row);
                        }
                    },
                    /*{label: '区域type', code: 'netType', hidden: true},
                    {label: '区域code', code: 'netArea', hidden: true},*/
                    {label: '申请内容', code: 'applyCont', width: 230},
                    {
                        label: '变更来源', code: 'alterationSource', width: 100, mapTypeCode: "SOURCE"
                    },
                    {
                        label: '状态', code: 'apprStatus', width: 100, renderCell(h, data) {
                            return that.onStateRenderer(data.row);
                        }
                    },
                    {label: '申请日期', code: 'gmtApply', width: 150},
                    {label: '服务项申请用户', code: 'proposerName', width: 120},
                    {label: '服务项申请单位', code: 'applyUnit', width: 120}
                ];
            },
            //导出
            export() {

            },
            //补录按钮响应事件
            addOld() {

            },
            //编辑按钮
            edit(row) {
                this.openEditPage(row.oid, this.ENUM.ACTIONTYPE.EDIT);
            },
            //新增按钮响应事件
            addItem() {
                this.$router.push(this.ENUM.ROUTER.ALTERATION_EDIT.URL({
                    actionType: this.ENUM.ACTIONTYPE.ADD
                }));
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
            },
            //删除
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let id = row.oid;
                    this.axios(this.ENUM.ACTIONS.DELETE_ALTERATION, {oid: id}, [res => {
                        this.$message.success("删除成功");
                        this.$refs.mainQueryGrid.refresh();
                    }]);
                });
            }
        },
        mounted() {
            let _this = this;
            Promise.all([_this.initEnumApprStatus(), _this.requestNetAreaData()]).then(res => {
                if (typeof _this.initControls == "function") {
                    _this.initControls();
                }
            });
        }
    }
</script>

<style scoped>

</style>
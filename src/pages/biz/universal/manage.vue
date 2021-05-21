<template>
    <div class="content-filled">
        <ice-query-grid title="通用流程台账管理"
                        :data-url="UNIVERSAL.ENUM.ACTIONS.SEARCH_UNIVERSAL.URL()"
                        :query="UNIVERSAL_ENUM.GRID.QUERY"
                        :columns="UNIVERSAL_ENUM.GRID.COLUMNS"
                        :ref="UNIVERSAL_ENUM.GRID.REF"
                        :operations="UNIVERSAL_ENUM.GRID.OPERATION"
                        :operationsWidth=100
                        :minHeight="530"
                        :gridAutoRefresh="true"
                        :buttons="UNIVERSAL_ENUM.GRID.BUTTON"></ice-query-grid>
    </div>
</template>

<script>
    import universalComm from "./js/comm";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";

    export default {
        name: "universalManage",
        components: {IceQueryGrid},
        mixins: [universalComm],
        data() {
            return {
                UNIVERSAL_ENUM: {
                    GRID: {
                        REF: "grid",
                        QUERY: [],
                        COLUMNS: [],
                        OPERATION: [],
                        BUTTON: []
                    }
                }
            };
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initQuery();
                this.initButtons();
                this.initColumns();
                this.initOperation();
            },
            /**
             * 初始化表格查询条件
             */
            initQuery() {
                let _this = this;
                this.UNIVERSAL_ENUM.GRID.QUERY = [{type: 'date', label: '申请日期(开始)', code: 'applyTime', exp: ">"},
                    {type: 'date', label: '申请日期(结束)', code: 'applyTime', exp: "<"},
                    {type: 'input', label: '申请单号', code: 'formCode', value: ''},
                    {type: 'input', label: '申请项', code: 'itemType', value: ''},
                    {
                        type: 'select', label: '状态', code: 'status', textProp: 'name',
                        codeProp: 'code',
                        options: _this.UNIVERSAL.ENUM.STATUS.properties
                    }, {
                        type: 'select', label: '是否系统用户', code: 'systemUser', textProp: 'name',
                        codeProp: 'code',
                        options: _this.UNIVERSAL.ENUM.YES_NO.properties
                    },
                    {type: 'input', label: '申请人', code: 'applyUser', value: ''},
                    {type: 'input', label: '申请人单位', code: 'applyUserDept', value: ''},
                    {type: 'input', label: '责任人', code: 'dutyUser', value: ''},
                    {type: 'input', label: '责任人单位', code: 'dutyUserDept', value: ''}
                ];
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.UNIVERSAL_ENUM.GRID.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {label: '申请日期', code: 'applyTime', width: 120, fixed: true},
                    {label: '申请单号', code: 'formCode', width: 120, fixed: true},
                    {label: '申请项', code: 'itemType', width: 100},
                    {
                        label: '状态', code: 'status', width: 80, formatter: row => {
                            return _this.getNameByCode(_this.UNIVERSAL.ENUM.STATUS.properties, row.status);
                        }
                    },
                    {
                        label: '是否系统用户', code: 'systemUser', width: 100, formatter: row => {
                            return _this.getNameByCode(_this.UNIVERSAL.ENUM.YES_NO.properties, row.systemUser);
                        }
                    },
                    {label: '申请人', code: 'applyUser', width: 90},
                    {label: '申请人单位', code: 'applyUserDept', width: 100},
                    {label: '申请人座机', code: 'applyUserTel', width: 120},
                    {label: '申请人手机', code: 'applyUserPhone', width: 120},
                    {label: '责任人', code: 'dutyUser', width: 90},
                    {label: '责任人单位', code: 'dutyUserDept', width: 100},
                    {label: '责任人座机', code: 'dutyUserTel', width: 120},
                    {label: '责任人手机', code: 'dutyUserPhone', width: 120}
                ];
            },
            /**
             * 初始化表格操作按钮
             * @return {*|boolean}
             */
            initOperation() {
                let _this = this;
                this.UNIVERSAL_ENUM.GRID.OPERATION = [Object.assign({}, this.COMM_ENUMS.OPERATION.EDIT, {callback: _this.edit}, {
                    isShow(row) {
                        return _this.isOperationShow(row.status);
                    }
                }),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.VIEW, {callback: _this.view}),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.DELETE, {callback: _this.delete}, {
                        isShow(row) {
                            return _this.isOperationShow(row.status);
                        }
                    })];
            },
            /**
             * 初始化表格按钮
             */
            initButtons() {
                this.UNIVERSAL_ENUM.GRID.BUTTON = [
                    Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addItem}),
                    Object.assign({}, this.COMM_ENUMS.BUTTON.EXPORT)
                ];
            },
            /**
             * 操作按钮是否显示
             * @param value
             * @return {boolean}
             */
            isOperationShow(value) {
                if (value == this.UNIVERSAL.ENUM.STATUS.DRAFT) {//草稿状态
                    return true;
                }
                return false;
            },
            /**
             * 编辑按钮响应事件
             * @param row
             */
            edit(row) {
                this.openEditPage(true, row.oid);
            },
            /**
             * 查看按钮响应事件
             * @param row
             */
            view(row) {
                this.openEditPage(false, row.oid);
            },
            /**
             * 删除按钮响应事件
             * @param row
             */
            delete(row) {
                let _this = this;
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    _this.axios(this.UNIVERSAL.ENUM.ACTIONS.DELETE_UNIVERSAL, {id: row.oid}, [res => {
                        _this.$message.success("删除成功");
                        _this.$refs[_this.UNIVERSAL_ENUM.GRID.REF].refresh();
                    }, res => {
                        _this.$message.warning("删除失败");
                    }]);
                });
            },
            /**
             * 新增按钮响应事件
             */
            addItem() {
                this.openEditPage(true, "");
            },
            /**
             * 打开编辑页面
             * @param isEdit
             * @param oid
             */
            openEditPage(isEdit, oid) {
                this.$router.push(this.UNIVERSAL.ENUM.ROUTE.UNIVERSAL_EDIT.URL({
                    dataId: oid,
                    readOnly: !isEdit
                }));
            }
        },
        mounted() {
            this.initControls();
        }
    }
</script>

<style scoped>

</style>
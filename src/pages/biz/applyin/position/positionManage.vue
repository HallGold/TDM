<template>
    <div class="content-filled">
        <ice-query-grid title="要害部位台账管理"
                        :data-url="POSITION_ENUMS.ACTIONS.LOAD_DATA.URL()"
                        :query="MANAGE_ENUMS.QUERY_GRID.QUERY"
                        :columns="MANAGE_ENUMS.QUERY_GRID.COLUMNS"
                        :ref="MANAGE_ENUMS.QUERY_GRID.REF"
                        :operations="MANAGE_ENUMS.QUERY_GRID.OPERATIONS"
                        :operationsWidth=180
                        :minHeight="530"
                        :buttons="MANAGE_ENUMS.QUERY_GRID.BUTTONS"></ice-query-grid>
        <position-edit :title="title" :oid="oid" :on-close-handler="onCloseHandler" :is-edit="isEdit"
                       :ref="MANAGE_ENUMS.EDIT.REF" v-if="MANAGE_ENUMS.EDIT.SHOW"></position-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import positionComm from "./positionComm";
    import PositionEdit from "./positionEdit";

    export default {
        name: "positionManage",
        components: {PositionEdit, IceQueryGrid},
        mixins: [bizComm, positionComm],
        data() {
            return {
                MANAGE_ENUMS: {
                    QUERY_GRID: {
                        REF: "manageGrid",
                        QUERY: [],
                        COLUMNS: [],
                        OPERATIONS: [],
                        BUTTONS: []
                    },
                    EDIT: {REF: "positionEdit", SHOW: false}
                },
                oid: "",
                title: "",
                isEdit: true
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initColumns();
                this.initQuery();
                this.initButtons();
                this.initOperations();
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.MANAGE_ENUMS.QUERY_GRID.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {code: 'dept', hidden: true},
                    {code: 'unit', hidden: true},
                    {label: '部位名称', code: 'name', width: 150},
                    {label: '受控类型', code: 'manageType', width: 150, mapTypeCode: "controlledType"},
                    {label: '部位类型', code: 'type', width: 150, mapTypeCode: "specificType"},
                    {label: '是否要害部位', code: 'isCrucial', width: 150, mapTypeCode: "YES_NO"},
                    {label: '责任部门', code: 'deptName', width: 200},
                    {label: '责任单位', code: 'unitName', width: 180},
                    {label: '是否启用', code: 'isStart', width: 150, mapTypeCode: "enabled"},
                ]
            },
            /**
             * 初始化查询条件
             */
            initQuery() {
                let _this = this;
                this.MANAGE_ENUMS.QUERY_GRID.QUERY = [
                    {type: 'input', label: '部位名称', code: 'name', value: ''},
                    {
                        type: 'select',
                        label: '部位类型',
                        code: 'manageType',
                        value: '',
                        textProp: 'label',
                        codeProp: 'value',
                        options: _this.POSITION_ENUMS.TYPE.properties
                    },
                    {
                        type: 'select',
                        label: '是否要害部位',
                        code: 'isCrucial',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.POSITION_ENUMS.YES_NO.properties
                    },
                    {type: 'input', label: '责任部门', code: 'deptName', value: ''},
                    {
                        type: 'select',
                        label: '是否启用',
                        code: 'isStart',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.POSITION_ENUMS.USE_NO_USE.properties
                    }
                ];
            },
            /**
             * 初始化按钮
             */
            initButtons() {
                let _this = this;
                this.MANAGE_ENUMS.QUERY_GRID.BUTTONS = [Object.assign({}, _this.COMM_ENUMS.BUTTON.ADD, {callback: this.add}),
                    Object.assign({}, _this.COMM_ENUMS.BUTTON.EXPORT)];
            },
            /**
             * 初始化操作列
             */
            initOperations() {
                let _this = this;
                this.MANAGE_ENUMS.QUERY_GRID.OPERATIONS = [
                    Object.assign({}, this.COMM_ENUMS.OPERATION.EDIT, {callback: this.edit}, {
                        isShow: (row) => {
                            return row.isStart == this.POSITION_ENUMS.YES_NO.YES ? false : true;
                        }
                    }),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.VIEW, {callback: this.view}),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.USE, {callback: this.setUse}, {
                        isShow: (row) => {
                            return row.isStart == _this.POSITION_ENUMS.USE_NO_USE.NO_USE ? true : false;
                        }
                    }),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.NO_USE, {callback: this.setNoUse}, {
                        isShow: (row) => {
                            return row.isStart == _this.POSITION_ENUMS.USE_NO_USE.USE ? true : false;
                        }
                    }),
                ];
            },
            /**
             * 组装选中列的数据
             * @param data
             * @param value
             * @return data
             */
            assembleRowData(data, value) {
                data.isStart = value;
                return data;
            },
            /**
             * 启用
             * @param row
             */
            setUse(row) {
                let _this = this;
                this.axios(this.POSITION_ENUMS.ACTIONS.SAVE, _this.assembleRowData(Object.assign({}, row), _this.POSITION_ENUMS.USE_NO_USE.USE), [res => {
                    _this.$message.success("启用要害部位成功!");
                    row.isStart = _this.POSITION_ENUMS.USE_NO_USE.USE;
                }]);
            },
            /**
             * 禁用
             * @param row
             */
            setNoUse(row) {
                let _this = this;
                this.axios(this.POSITION_ENUMS.ACTIONS.SAVE, _this.assembleRowData(Object.assign({}, row), _this.POSITION_ENUMS.USE_NO_USE.NO_USE), [res => {
                    _this.$message.success("禁用要害部位成功!");
                    row.isStart = _this.POSITION_ENUMS.USE_NO_USE.NO_USE;
                }]);
            },
            /**
             * 查看
             * @param row
             */
            view(row) {
                this.isEdit = false;
                this.title = "要害部位详情页面";
                this.oid = row.oid;
                this.openEditPage();
            },
            /**
             * 编辑
             * @param row
             */
            edit(row) {
                this.isEdit = true;
                this.title = "要害部位编辑页面";
                this.oid = row.oid;
                this.openEditPage();
            },
            /**
             * 新增
             */
            add() {
                this.isEdit = true;
                this.title = "要害部位新增页面";
                this.oid = "";
                this.openEditPage();
            },
            /**
             * 打开编辑页面
             */
            openEditPage() {
                this.MANAGE_ENUMS.EDIT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.MANAGE_ENUMS.EDIT.REF].openDialog();
                    this.$nextTick(() => {
                        this.$refs[this.MANAGE_ENUMS.EDIT.REF].refreshData();
                    })

                });
            },
            /**
             * 编辑要害部位关闭响应事件
             */
            onCloseHandler() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.MANAGE_ENUMS.EDIT.SHOW = false;
                    _this.$refs[this.MANAGE_ENUMS.QUERY_GRID.REF].refresh();
                    resolve();
                });
            }
        },
        mounted() {
            this.initControls();
        }
    }
</script>

<style scoped>

</style>
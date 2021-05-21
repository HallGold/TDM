<template>
    <ice-dialog :visible.sync="visibleDialog" :title="title" :width="width" remounted>
        <ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true"
                       label-prop="deptName"
                       value-prop="oid"
                       :lazy="false"
                       parent-prop="deptId"
                       data-url="/permission/user/users_by_condition"
                       :columns="columnsDef"
                       :query="query"
                       :chooseItem="chooseItem"
                       @selection-change="selectionChange"
                       ref="iceGrid">
        </ice-tree-grid>
        <div class="ice-button-bar">
            <el-button type="primary" @click="save" :disabled="tableList.length===0">{{btnName}}</el-button>
            <el-button type="info" @click="closeDialog">{{btnClose}}</el-button>
        </div>
    </ice-dialog>

</template>

<script>
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import IceDialog from "@/components/common/base/IceDialog";
    import devComm from "@/pages/biz/dev/js/comm/devComm";

    export default {
        name: "userSelector",
        components: {IceDialog, IceTreeGrid},
        mixins:[devComm],
        props: {
            width: {//弹窗的宽度
                type: String || Number,
                default: '900px'
            },

            title: {//弹窗标题
                type: String,
                default: '请选择'
            },

            columns: Array,//table表头的展示列，用此属性则table列展示填写的内容

            chooseItem: {//single为单选，multiple为多选
                type: String,
                default: 'single'
            },

            btnName: {//弹窗-确定-按钮名称
                type: String,
                default: '确定'
            },
            btnClose: {//弹窗-取消-按钮名称
                type: String,
                default: '取消'
            }

        },
        data() {
            return {
                query: [
                    {type: 'static', code: "cascade", exp: "=", value: true},
                    {type: 'static', code: "enabled", exp: "=", value: 2},
                    {type: 'input', code: "name", label: '姓名'},
                    {type: 'input', code: "code", label: '账号'},
                ],
                columnsDef: [],//table表头
                visibleDialog:false,//弹窗的开关属性
                tableList:[],//选中行的数据
            }
        },
        methods: {
            /**
             * 初始化表头
             */
            initColumns() {
                if (!!this.columns) {
                    this.columnsDef = this.columns;
                } else {
                    let _this = this;
                    this.columnsDef = [
                        {code: 'oid', hidden: true},
                        {label: '账号', code: 'code', width: 100},
                        {label: '姓名', code: 'name', width: 100},
                        {label: '部门', code: 'deptShortName', width: 100},
                        {label: '工作单位', code: 'orgShortName', width: 100},
                        {label: '部门编码', code: 'deptCode', hidden: true},
                        {label: '身份证编号', code: 'idCard', hidden: true},
                        {label: '用户密级', code: 'securityLevel', width: 80,formatter: row => {
                                return _this.getUserLevelName(row.securityLevel);
                            }},
                        {label: '工作卡号', code: 'workCard', width: 100},
                    ];
                }
            },
            /**
             *选择的行数据
             * @param rows
             */
            selectionChange(rows) {
                this.tableList = rows;
            },

            /**
             * 确定
             */
            save(){
                this.$emit('getData',this.tableList);
                this.closeDialog();
            },

            /**
             * 取消
             */
            closeDialog(){
                this.visibleDialog = false;
                this.tableList = [];
            },

            /**
             * 打开弹窗
             */
            openDialog(){
                this.visibleDialog = true;
            },
            /**
             * 获取用户密级名称
             * @param code
             * @returns {*}
             */
            getUserLevelName(code) {
                for (let i = 0; i < this.ENUMS.USER_SECRET_LEVEL_DATA.length; i++) {
                    if (Number(this.ENUMS.USER_SECRET_LEVEL_DATA[i].code) == code) {
                        return this.ENUMS.USER_SECRET_LEVEL_DATA[i].name;
                    }
                }
                return '';
            },
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USER_SECRET_LEVEL.CODE)
            ];
            Promise.all(prepareTaskChain).then(this.initColumns);
        }
    }
</script>

<style scoped>

</style>
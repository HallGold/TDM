<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/permission/app/load_page_app"
                :operationsWidth="200"
                :query="query"
                :pagination="true"
                :columns="columns"
                :operations="operations"
                :buttons="buttons"></ice-query-grid>
        <!--<template v-if="openFlag">

        </template>-->
        <app-edit ref="edit" @beforeClose="close"/>
        <template v-if="ConstantOpenFlag">
            <constant-manage ref="constantEdit" @beforeClose="closeConstant"></constant-manage>
        </template>
        <template v-if="dictionaryOpenFlag">
            <el-dialog
                    custom-class="ice-dialog"
                    v-dialogDrag
                    :visible.sync="dictionaryOpenFlag"
                    :append-to-body="true"
                    :close-on-click-modal="false"
                    @close="closeDictionary"
                    width="1000px"
                    left>
                <data-map-list ref="dictionaryEdit" @beforeClose="closeDictionary"></data-map-list>
            </el-dialog>
        </template>
        <el-dialog v-dialogDrag title="APP菜单" custom-class="ice-dialog" center :visible.sync="funcDialogVisible"
                   width="1100px" append-to-body :close-on-click-modal="false" height=500px>
            <func-edit ref="func" :appCode="appCode"></func-edit>
            <div class="ice-button-bar ">
                <el-button type="info" @click="ret">返回</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import AppEdit from "./AppEdit";
    import DataMapList from "@/pages/system/datamap/DatamapList";
    import ConstantManage from "@/pages/system/constant/ConstantManage";
    import OrgComm from "@/pages/system/comm/OrgComm";
    import FuncEdit from './FuncEdit.vue'

    export default {
        name: "AppManage",
        mixins: [OrgComm],
        components: {ConstantManage, IceQueryGrid, AppEdit, DataMapList, FuncEdit},
        data() {
            return {
                ConstantOpenFlag: false,
                dictionaryOpenFlag: false,
                funcDialogVisible: false,
                openFlag: false,
                dataUrl: "",
                curTableData: {},
                columns: [],
                query: [{type: 'input', label: 'APP', code: 'name', model: ``, placeholder: `输入APP名称搜索`},],
                buttons: [],
                operations: [],
                appCode: '',
            };
        },
        methods: {
            initControls() {
                this.initButtons();
                this.initColumns();
                /*this.dataUrl = this.ACTIONS_ENUM.APP.MANAGE_LOAD.URL();*/
            },
            initButtons() {
                this.buttons = [
                    Object.assign({}, this.BUTTON_ENUM.ADD, {callback: this.add}),
                    Object.assign({}, this.BUTTON_ENUM.REFRESH, {callback: this.refresh}),
                ];
            },
            initColumns() {
                this.columns = [
                    {label: '图标', code: 'smallIconUrl', width: 60,renderCell(h, data){
                        return <img src={this.$showImage(data.row.smallIconUrl)} width="22px" height="22px" />
                        }
                    },
                    {
                        label: '名称', code: 'name', width: 200, render: (record) => {
                            if (record.enabled == this.ENABLED_ENUM.ENABLED) {
                                return (<span class="enabled-word">{record.name}</span>);
                            } else {
                                return (<span class="disabled-word">{record.name}</span>);
                            }
                        }
                    },
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '编码', code: 'appCode', width: 150},
                    /*{label: '打开方式', code: 'openType', width: 80},*/
                    {label: '启用状态', code: 'enabled', width: 80,renderCell(h, data){
                            return (data.row.enabled==1?"是":(data.row.enabled==0?"否":""))}},
                    /*{label: '是否显示', code: 'visible', width: 80},*/
                    {label: 'URL', code: 'url', width: 200},
                    {label: '描述', code: 'desp', width: 200},
                ];
                let _this = this;
                this.operations = [
                    {
                        name: '编辑', callback: this.edit/*, isShow: (row) => {
                            return row.doEdit;
                        }*/
                    },
                    {name: '菜单', callback: this.funcEdit},
                    {name: '常量', callback: this.constantEdit},
                    {
                        name: '启用', callback: this.changeStatus, isShow: (row) => {
                            /* if (!row.doEdit) {
                                 return false;
                             }*/
                            return row.enabled == _this.ENABLED_ENUM.DISABLED;
                        }
                    },
                    {
                        name: '停用', callback: this.changeStatus, isShow: (row) => {
                            /*if (!row.doEdit) {
                                return false;
                            }*/
                            return row.enabled == _this.ENABLED_ENUM.ENABLED;
                        }
                    }
                ];
            },
            openEdit(record) {
                /*this.openFlag = true;*/
                this.$nextTick(() => {
                    this.$refs.edit.open(record);
                });

            },
            closeEdit() {
                this.openFlag = false;
            },
            add() {
                let _newRow = {
                    oid: null,
                    name: "",
                    appCode: "",
                    doEdit: true,
                    visible: this.YES_NO_ENUM.YES,
                    openType: this.OPEN_TYPE_ENUM.BLANK,
                    enabled: this.ENABLED_ENUM.ENABLED
                };
                this.openEdit(_newRow);
            },
            afterAdd(_returnData) {
                let newRow = {};
                Object.assign(newRow, _returnData);
                this.$refs.iceGrid.getDataList().unshift(newRow);
            },
            edit(_row) {
                this.curTableData = _row;
                this.openEdit(Object.assign({}, _row));
            },
            afterEdit(_returnData) {
                Object.assign(this.curTableData, _returnData);
            },
            changeStatus(_row) {
                let newEnabled = _row.enabled == this.ENABLED_ENUM.ENABLED ? this.ENABLED_ENUM.DISABLED : this.ENABLED_ENUM.ENABLED;
                this.axios(this.ACTIONS_ENUM.APP.CHANGE_STATUS, {
                    id: _row.oid,
                    status: newEnabled
                }, [res => {
                    _row.enabled = newEnabled;
                }, res => {
                    this.$message.error("状态切换失败! errorCode = " + res.code)
                }, res => {
                    this.$message.error("状态切换失败! errorCode = " + res.code)
                }]);
            },
            close(_returnData) {
                if (!!_returnData) {
                    if (this.curTableData.oid == _returnData.oid) {
                        //编辑模式
                        this.afterEdit(_returnData);
                    } else {
                        //新增模式
                        this.afterAdd(_returnData);
                    }
                }
                this.closeEdit();
            },
            refresh() {
                this.$refs.iceGrid.refresh();
            },
            funcEdit(row) {
                //功能编辑
                this.appCode = row.appCode;
                this.funcDialogVisible = true;
                this.$nextTick(()=>{
                    this.$refs.func.init();
                })
            },
            ret(){
                this.funcDialogVisible = false;
            },
            constantEdit(_row) {
                //常量
                this.curTableData = _row;
                this.ConstantOpenFlag = true;
                this.$nextTick(() => {
                    this.$refs.constantEdit.open(_row.appCode);
                });
            },
            closeConstant() {
                this.ConstantOpenFlag = false;
            },
            dictionaryEdit(_row) {
                //字典
                this.curTableData = _row;
                this.dictionaryOpenFlag = true;
                this.$nextTick(() => {
                    this.$refs.dictionaryEdit.open(_row.appCode,_row.name);
                });
            },
            closeDictionary() {
                this.dictionaryOpenFlag = false;
            }
        },
        mounted() {
            this.initControls();
        },
    }
</script>

<style scoped>

</style>

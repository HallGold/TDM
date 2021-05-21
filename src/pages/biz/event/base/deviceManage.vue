<template>
    <div class="content-filled">
        <el-dialog v-dialogDrag
                   width="60%"
                   title="选择服务对象"
                   center
                   append-to-body
                   :close-on-press-escape="false"
                   :visible.sync="dialogVisible">
            <dev-grid v-if="PAGE_ENUM.GRID.CATEGORY_TREE_DATA"
                      :chooseItem="chooseItem"
                      :buttons="PAGE_ENUM.GRID.BUTTONS"
                      :operations="PAGE_ENUM.GRID.OPERATIONS"
                      :columns="PAGE_ENUM.GRID.COLUMNS"
                      :querys="PAGE_ENUM.GRID.QUERY"
                      @nodeClick="categoryTreeSelectedHandler"
                      :ref="PAGE_ENUM.GRID.REF"
                      :selectFirst="false"
                      :filterTreeData="filterTreeData"
                      @rowDbClick="rowDbClick">
            </dev-grid>
            <template slot="footer">
                <div class="ice-button-bar">
                    <el-button type="primary" @click="enterClickHandler">确定</el-button>
                    <el-button type="info" @click="closeClickHandler">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import bizComm from "../../js/comm";
    import devComm from "../../dev/js/comm/devComm";
    import renderer from "../../dev/js/comm/renderer"
    import DevGrid from "../../dev/devGrid";

    export default {
        name: "devSelect",
        mixins: [bizComm, devComm, renderer],
        components: {DevGrid},
        props: {
            //页面关闭的回调
            onCloseHandler: {
                type: Function,
                default: () => {
                    return Promise.resolve();
                }
            },
            //默认单选
            multiple: {
                type: Boolean,
                defaults: false,
            },
            //查询条件
            querys: {
                type: Array,
                default: () => []
            },
            //需要显示的设备分类数组 :filterTreeData="[10,1405,1101,1102]"
            filterTreeData: {
                type: Array
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    GRID: {
                        REF: "gird",
                        COLUMNS: [],
                        QUERY: [],
                        OPERATIONS: [],
                        BUTTONS: [],
                        CATEGORY_TREE_DATA: null
                    }
                },
                //选中的数据
                selectData: null,
                //grid选择模式
                chooseItem: "multiple",
                //当前树节点
                currentTreeKey: {},
                //列表数据
                tableData: [],
                //页面显示状态
                dialogVisible: true,
            };
        },
        methods: {
            /**
             * 打开窗口
             */
            openDialog() {
                this.dialogVisible = true;
            },
            /**
             * 关闭窗口
             */
            closeDialog(needReturnData) {
                if (needReturnData) {
                    // if (this.multiple) {
                    this.selectData = this.$refs[this.PAGE_ENUM.GRID.REF].$refs.devManageTable.$refs.queryGrid.getSelections();
                    /*  } else {
                          this.selectData = this.$refs[this.PAGE_ENUM.GRID.REF].$refs.queryGrid.curRow;
                      }*/
                } else {
                    this.selectData = [];
                }
                this.onCloseHandler(this.selectData).then(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 数据双击响应
             **/
            rowDbClick() {
            },
            /**
             * 初始化表格按钮
             */
            initButtons() {
            },
            /**
             * 初始化表格查询
             */
            initQuery() {
                let _this = this;
                this.PAGE_ENUM.GRID.QUERY = [

                ];
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                this.PAGE_ENUM.GRID.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {code: 'netArea', hidden: true},
                    {code: 'netType', hidden: true},
                    {type: 'static', label: '设备名称', code: 'category', width: 80, value: () => {return _this.currentTreeKey < _this.ENUMS.CHILD_CATEGORY_CODE_FLAG ? _this.currentTreeKey : null;}},
                    {label: '设备子类', code: 'childType', width: 120, formatter(data) {return _this.onChildTypeRenderer(data.childType);}},
                    {label: '保密编号', code: 'secretSn', width: 100},
                    {label: 'IP地址', code: 'masterIp', width: 80, hidden: true, export: true},
                    {label: '责任人', code: 'dutyName', width: 60},
                    {label: '密级', code: 'secretLevel', width: 50, mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE},
                    {label: '联网区域', code: 'netAreaAndType', width: 80, ignore: true, formatter: row => {return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);}},
                    {type: 'select', label: '使用情况', code: 'state', value: '', textProp: 'name', codeProp: 'code', options: _this.ENUMS.STATE_DATA.properties},
                    {label: '系统级别', code: 'systemLevel', width: 80, hidden: false, export: false},
                ];
            },
            /**
             * 初始化设备类型树
             */
            initCategoryTreeData() {
                //初始化加载类别树的基础数据
                this.PAGE_ENUM.GRID.CATEGORY_TREE_DATA = [{
                    code: this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE, name: "设备类型", children: this.ENUMS.CATEGORY_DATA
                }];
            },
            /**
             *  树节点点击响应
             */
            categoryTreeSelectedHandler(node) {
                this.currentTreeKey = node;
                this.tableData.category = this.getParentType(node);
                this.tableData.childType = this.getChildType(node);
            },
            /**
             * 确定按钮点击事件
             */
            enterClickHandler() {
                this.closeDialog(true);
            },
            /**
             * 关闭按钮点击响应
             */
            closeClickHandler() {
                this.closeDialog(false);
            },
            /**
             * 初始化grid
             */
            initGrid() {
                if (this.multiple) {
                    this.chooseItem = "multiple"
                } else {
                    this.chooseItem = "single"
                }
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initButtons();
                this.initColumns();
                this.initGrid();
                this.initQuery();
                this.initCategoryTreeData();
            }
        }, mounted() {
            //预处理任务链
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE, this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE),
                this.requestCategoryData(),
                this.requestCommStateData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>
</style>

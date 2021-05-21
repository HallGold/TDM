<template>
    <el-container>
        <ice-tree-grid v-if="initOver"
                       :treeData="processTypeData"
                       label-prop="bpmDefName"
                       value-prop="actDefKey"
                       tree-width="220px"
                       :lazy="false"
                       :columns="PAGE_ENUM.COLUMNS"
                       :query="PAGE_ENUM.QUERY"
                       :operations="PAGE_ENUM.OPERATIONS"
                       :buttons="PAGE_ENUM.BUTTONS"
                       :ref="PAGE_ENUM.REFS.GRID"
                       :data-url="ENUMS.ACTIONS.GET_DEV_PROCESS.URL()"
                       chooseItem="single"
                       @selection-change="selectionChangeHandle"
                       @node-click="treeNodeClickHandler"
                       @dbClick="view"
                       :operations-width="200">
        </ice-tree-grid>
        <comm-apply :ref="PAGE_ENUM.REFS.APPLY" v-if="showApply" :applyNo="applyNo"
                    :flowUrl="flowUrl"></comm-apply>
    </el-container>
</template>

<script>
    import IceTreeGrid from '@/components/common/base/IceTreeGrid';
    import bizComm from "@/pages/biz/js/comm";
    import BPComm from "./js/bpComm.js";
    import CommApply from "./commApply"

    export default {
        name: "devProcessApplyManage",
        mixins: [bizComm, BPComm],
        components: {IceTreeGrid, CommApply},
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        GRID: "grid",
                        APPLY: "apply"
                    },
                    COLUMNS: [],
                    BUTTONS: [],
                    OPERATIONS: [],
                    QUERY: []
                },
                //审批单号
                applyNo: null,
                //流程页面
                flowUrl: null,
                //是否显示申请页面
                showApply: false,
                //流程类型
                processTypeData: [
                    {
                        actDefKey: 0, bpmDefName: "流程分类", children: []
                    }
                ],
                //列表当前选中行
                curTableData: {
                    formNo: "",
                    flowUrl: ""
                },
                //树当前选中节点key
                curTreeKey: null,
                //初始化完成标志符
                initOver: false
            }
        },
        watch: {
            curTreeKey: {
                handler(newValue, oldValue) {
                    if (!newValue) {
                        //当前选中的为根节点,加载全部自己相关的流程数据
                    } else {
                    }

                }
            },
            curTableData: {
                handler(newValue, oldValue) {
                    if (this.initOver) {

                    }
                }
            }
        },
        methods: {
            /**
             * 列表点击事件响应
             */
            selectionChangeHandle(row) {
                this.curTableData = row[0];
            },
            /**
             * 树节点点击响应
             */
            treeNodeClickHandler(key) {
                this.curTreeKey = key;
            },
            /**
             * 向服务器请求当前用户的可申请的设备流程分类
             */
            requestProcessType() {
                return new Promise((resolve, reject) => {
                    this.axios(this.ENUMS.ACTIONS.GET_PROCESS_TYPE, {typeId: this.ENUMS.DEV_FLOW_TYPE}, [
                        res => {
                            this.processTypeData[0].children.push(...res.data);
                            resolve();
                        }
                    ])
                });
            },
            /**
             * 打开流程页面
             */
            openFlowPage(flowUrl, applyNo, isEdit) {
                this.flowUrl = flowUrl;
                this.applyNo = applyNo;
                this.showApply = true;
                console.log(this.flowUrl);
                this.$nextTick(()=>{
                    //修复不能再点申请的bug
                    this.showApply = false;
                });
            },
            /**
             * 申请
             */
            add() {
                if (this.ENUMS.MAP.FLOW_KEY_URL[this.curTreeKey] != null && this.ENUMS.MAP.FLOW_KEY_URL[this.curTreeKey] != "") {
                    this.openFlowPage(this.ENUMS.MAP.FLOW_KEY_URL[this.curTreeKey], null);
                } else {
                    this.$message.info("请在流程分类树上选择需要发起的流程类型!");
                }
            },
            /**
             * 编辑
             */
            edit(row) {
                this.openFlowPage(row.flowUrl, row.formNo, true);
            },
            /**
             * 删除
             */
            delete(row, index) {
                let _this = this;
                this.tableData.splice();
                this.axios(this.ENUMS.ACTIONS.DELETE_BIZ_OBJ, {oid: row.oid}[res => {
                    _this.$refs[this.PAGE_ENUM.REFS.GRID].$refs["queryGrid"].getDataList().splice(index, 1);
                }, res => {
                    _this.$message.error("执行删除操作失败!");
                }, res => {
                    _this.$message.error("执行删除操作失败!");
                }]);
            },
            /**
             * 查看
             */
            view(row, index) {
                this.openFlowPage(row.flowUrl, row.formNo, false);
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.PAGE_ENUM.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {code: 'flowUrl', hidden: true},
                    {label: '审批单号', code: 'formNo', width: 200},
                    {label: '流程名称', code: 'flowName', width: 200},
                    {label: '服务单号', code: 'serviceTicket', width: 150},
                    {label: '状态', code: 'status', width: 150},
                    {label: '创建时间', code: 'createDate', width: 180},
                ];
            },
            initOperations() {
                this.PAGE_ENUM.OPERATIONS = [
                    Object.assign({}, this.COMM_ENUMS.OPERATION.EDIT, {
                        callback: this.edit, isShow: row => {
                            if (row.afStatus == this.ENUMS.FLOW_AF_STATUS.DRAFT) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.VIEW, {
                        callback: this.view
                    }),
                    Object.assign({}, this.COMM_ENUMS.OPERATION.DELETE, {
                        callback: this.delete, isShow: row => {
                            if (row.afStatus == this.ENUMS.FLOW_AF_STATUS.DRAFT) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }),
                ];
            },
            /**
             * 初始化表格查询
             */
            initQuery() {
                this.PAGE_ENUM.QUERY = [
                    {
                        type: 'static',
                        label: '流程类型',
                        code: 'flowKey',
                        options: [],
                        value: () => !this.curTreeKey ? "" : this.curTreeKey
                    },
                    {type: 'input', label: '申请单号', code: 'afNo', value: ''},
                    {type: 'date', label: '申请日期(起)', code: 'createDate', exp: ">"},
                    {type: 'date', label: '申请日期(止)', code: 'createDate', exp: "<"}
                ]
            },
            /**
             * 初始化功能按钮
             */
            initButtons() {
                this.PAGE_ENUM.BUTTONS = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {
                    name: '申请',
                    callback: this.add
                })];
            },
            /**
             * 初始化控件
             */
            initControls() {
                this.initButtons();
                this.initColumns();
                this.initQuery();
                this.initOperations();
                this.initOver = true;
            },
            /**
             * 获取枚举的流程对应表单url
             * @returns {Promise<T | never>}
             */
            requestFlowKeyUrl() {
                let _this = this;
                return this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FLOW_FORM_URL.CODE).catch(res => {
                    _this.$message.error("加载对应表单url失败,导致无法发起申请!");
                });
            },
        },
        mounted() {
            Promise.all([this.requestFlowKeyUrl(), this.requestDevFlowType()]).then(this.requestProcessType).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>
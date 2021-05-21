<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/PmsCgJxsb/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid"
                        @dbClick="edit"
                        @selection-change="selectionChange">

        </ice-query-grid>
        <ice-dialog :visible.sync="visibleProject" width="800px">
            <el-tabs>
                <el-row>
                    <xm-selector @select="selectProject"></xm-selector>
                </el-row>
            </el-tabs>
        </ice-dialog>
        <pms-table-tree ref="tableTree" :unbrid="unbrid" :dialogConfig="dialogConfig"
                        :tableObject="tableObject" :inpWidth="width"
                        :transfer="transfer" @handleCallback="handleCallback"
                        @handleClose="handleToggleDialog"
                        @handleTreeCallback="handleTreeCallback"></pms-table-tree>
        <cg-detail ref="detail" :to-flow="watch"></cg-detail>

    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XmSelector from "../common/XM_SELECT";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import moment from 'moment';
    import ATTACHMENT from "../common/ATTACHMENT";
    import {SBZT, SPZT} from "../../../utils/constant";
    import cgDetail from './cgDetail'

    export default {
        components: {
            IceFlowForm,
            IceDialog,
            IceQueryGrid,
            isLetterAndNumber,
            IceSelect,
            IceSingleUpload,
            XmSelector,
            PmsTableTree
            ,
            ATTACHMENT,
            cgDetail
        },
        name: "JLSB",
        data() {
            return {
                name: 'PmsCgJxsb',
                activeName: 'first',
                title: '',
                title2: 'sfssdg',
                titleTop: '',
                visible: false,
                loading: false,
                disabled: false,
                isHandleer: false,
                selectData: [],
                //流程start
                percent: 0,
                flowColumns: [],
                selector: '',
                bizdata: {a: 0, softwareInfoList: [{"fileMD5": "123456"}]},
                instProcessVar: {a: 10},
                flowRules: {
                    typeDesc: [{required: true}],
                    bpmDefName: [{required: true}]
                },
                //流程end
                attaTableData: [],
                visibleProject: false,
                //左树右表start
                dialogVisible: true,
                input2: '',
                value: '',
                width: '300px',
                unbrid: true,
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/Xminfo/listByYear',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {
                            years: this.nearFiveYears()
                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,

                },
                tableObject: {
                    buttons: [],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'oidXm', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', width: 200},
                        {label: '任务名称', code: 'rwname', width: 200,},
                        {label: '前置任务', code: 'qzrw', width: 200},
                        {label: '工期', code: 'rwgq', width: 100},
                        {label: '实际开始日期', code: 'dateSjStar', width: 200},
                        {label: '实际完成日期', code: 'dateSjEnd', width: 200,},
                        {label: '部门', code: 'rwdept', width: 140,},
                        {label: '任务负责人', code: 'rwfzr', width: 140},
                        {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: 'DATA_SECRET_LEVEL'},

                    ],
                    query: [
                        {type: 'static', code: 'oidXm', value: '0'},
                    ],
                    treeFocusData: [],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                //左树右表end
                formModel: {
                    oid: '',//
                    cgname: '',//成果奖励名称
                    xmname: '',//项目名称
                    oidXm: '',//项目库主键ID
                    xmcode: '',//所内项目编号
                    rwname: '',//任务名称
                    oidRw: '',//WBSID
                    wbscode: '',//WBS编号
                    dataSecretLevcode: '',//密级
                    sqr: '',//主要完成人
                    sqdw: '',//主要完成单位
                    cgly: '',//成果来源
                    jxlx: '',//申报奖项类型
                    tjdj: '',//推荐等级
                    zypsz: '',//专业评审组
                    cglx: '',//成果类型
                    xmdateStart: '',//项目起始时间
                    xmdateEnd: '',//项目完成时间
                    sqdate: '',//申请日期
                    sqly: '',//申请说明
                    dateRemark: '',//备注
                    sbzt: 'SBZT10',//上报状态
                    spzt: 'SPZT10',//审批状态

                    xtFjs: [],//协同附件
                },
                query: [
                    {type: 'input', code: 'xmname', label: '项目名称', value: ""},
                    {type: 'input', code: 'rwname', label: '任务名称', value: ""},

                    {type: 'select', code: 'jxlx', label: '申报奖项类型', mapTypeCode: "JXLX"},
                    {type: 'select', code: 'cglx', label: '成果类型', mapTypeCode: "CGLX"},
                    {type: 'input', code: 'cgly', label: '成果来源', value: ""},
                    {type: 'select', code: 'tjdj', label: '推荐等级', mapTypeCode: "TJDJ"},


                    {type: 'input', code: 'sqr', label: '申请人', value: ""},
                    {type: 'input', code: 'sqdw', label: '申请单位', value: ""},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '项目名称', code: 'xmname', width: 200,},
                    {label: '项目库主键ID', code: 'oidXm', hidden: true},
                    {label: '所内项目编号', code: 'xmcode', hidden: true},
                    {label: 'WBSID', code: 'oidRw', hidden: true},
                    {label: 'WBS编号', code: 'wbscode', hidden: true},
                    {label: '任务名称', code: 'rwname', width: 200},
                    {label: '成果奖励名称', code: 'cgname', hidden: true, width: 200,},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '主要完成人', code: 'sqr', width: 100},
                    {label: '主要完成单位', code: 'sqdw', width: 200, hidden: true},
                    {label: '主要完成单位', code: 'sqdwCode', width: 200, cusMapTypeCode: 'DEPT'},
                    {label: '申请日期', code: 'sqdate', width: 200, hidden: true},
                    {label: '申请说明', code: 'sqly', hidden: true},
                    {label: '备注 ', code: 'dateRemark', hidden: true},
                    {label: '申报奖项类型', code: 'jxlx', width: 200, mapTypeCode: 'JXLX'},
                    {label: '成果类型', code: 'cglx', width: 200, mapTypeCode: 'CGLX'},
                    {label: '成果来源', code: 'cgly', width: 200},
                    {label: '推荐等级', code: 'tjdj', width: 200, mapTypeCode: 'TJDJ'},
                    {label: '上报状态', code: 'sbzt', width: 200, mapTypeCode: 'SBZT'},
                    {label: '审批状态', code: 'spzt', width: 200, mapTypeCode: 'SPZT'},
                    {label: '专业评审组', code: 'zypsz', hidden: true, width: 200, mapTypeCode: 'ZYPSZ'},
                    {label: '项目起始时间', code: 'xmdateStart', hidden: true, width: 200,},
                    {label: '项目完成时间 ', code: 'xmdateEnd', hidden: true, width: 200,},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-right',
                        type: 'primary',
                        ctrlCode: "BSX",
                        callback: this.buttonRefresh
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow: this.isShow3},
                    {name: '查看', callback: this.showDetail, ctrlCode: "BCK"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC", isShow: this.isShow},
                ],
            }
        }
        , methods: {
            // 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            watch(row){
                this.$router.push("/pms/cggl/jlsb_flow?oid=" + row.oid + '&dataId=' + row.oid)
            },
            //左树右表start
            // 获取近5年的年份
            nearFiveYears() {
                let date = new Date();
                let currentYear = date.getFullYear();
                let arr = [];
                for (let i = 0; i < 5; i++) {
                    arr.push(currentYear);
                    currentYear -= 1;
                }
                return arr.join(',');
            },
            handleToggleDialog() {
                this.dialogConfig.visible = !this.dialogConfig.visible;
            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {
                // 回调后数据操作
                this.formModel.rwname = data[0].rwname
                this.formModel.oidRw = data[0].oid
                this.formModel.wbscode = data[0].wbscode

                this.formModel.xmname = this.tableObject.treeFocusData.xmname
                this.formModel.oidXm = this.tableObject.treeFocusData.oid
                this.formModel.xmcode = this.tableObject.treeFocusData.xmcode
            },
            // 树组件选中回调
            handleTreeCallback(data) {
                this.tableObject.treeFocusData = data
                if (data.oid === '') return;
                this.tableObject.query[0].value = data.oid;
                this.$refs.tableTree.refresh();
            },

            getColumn() {
                return this.tableObject.columns.map((item) => {
                    return item.code;
                })
            },
            //左树右表end
            selectionChange(data) {
                this.selectData = data;
            },
            addItem(row) {
                this.$router.push("/pms/cggl/jlsb_flow")
            },

            edit(row) {
                if (row.spzt === 'SPZT20' || row.spzt === 'SPZT30') {
                    this.$router.push("/pms/cggl/jlsb_flow?oid=" + row.oid + '&dataId=' + row.oid)
                } else {
                    this.$router.push("/pms/cggl/jlsb_flow?oid=" + row.oid)
                }
            },
            isShow(row) {
                if (row.spzt === null || row.spzt === SPZT.WSP)//未审批状态
                    return true
                else
                    return false
            },
            isShow2(row) {
                if (row.spzt === null || row.spzt === SPZT.WSP)//未审批状态
                    return false
                else
                    return true
            },
            isShow3(row) {
                if (row.spzt === null || row.spzt === SPZT.WSP)//未审批状态
                    return true
                else
                    return false
            },
            delete(row) {
                this.formModel = {...row}
                this.formModel.xtFjs = [];
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.$axios.post("/pms/PmsCgJxsb/delOne", this.formModel)
                        .then(data => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        }).catch(error => {
                        this.$message.error("删除失败");
                    })
                })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            deleteAtta() {
                this.$refs.attaTable.removeSelecteds()
            },
            // 获取奖项申报附件数据
            getXtfj(oidJxsb) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {oidJxsb: oidJxsb}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取奖项申报数据失败！")
                    })
            },
            // --------- 项目关联 start ----------
            selectProject(item) {
                this.formModel.xmname = item[0].xmname
                this.formModel.oidXm = item[0].oid
                this.formModel.xmcode = item[0].xmcode
                this.visibleProject = false;
            },
            showXm() {
                this.visibleProject = true;
            },
            showRw() {
                this.dialogConfig.visible = true;
            },
            // --------- 项目关联 end ----------
        },
        watch: {
            $route(New, old) {
                if (New.path === '/pms/cggl/jlsb' && old.path === '/pms/cggl/jlsb_flow') {
                    this.buttonRefresh();
                }
            }
        },

    }
</script>

<style scoped>

</style>

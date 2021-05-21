<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="callBackSuccess">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="bizdata" status-icon :rules="rules" ref="form" label-width="140px">

                    <ice-grid-layout :columns="2" name="业务表单">
                        <el-form-item label="合同名称" prop="htname">
                            <el-input maxlength="33" v-model="bizdata.htname" autocomplete="off"
                                      :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="密级" prop="dataSecretLevcode">
                            <ice-select :controlMjPar="controlMjPar" v-model="bizdata.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        autocomplete="off" :disabled="formReadonly"></ice-select>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="htcode">
                            <el-input v-model="bizdata.htcode" autocomplete="off" :disabled="formReadonly"
                                      readonly="readonly" placeholder="系统自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="甲方" prop="htjf">
                            <el-input maxlength="33" v-model="bizdata.htjf" autocomplete="off"
                                      :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="乙方" prop="htyf">
                            <el-input maxlength="33" v-model="bizdata.htyf" autocomplete="off"
                                      :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="合同金额" prop="htje">

                            <pms-input v-model="bizdata.htje" maxlen="10" precision="2" unit="元"
                                       :disabled="formReadonly"></pms-input>

                        </el-form-item>
                        <el-form-item label="合同签订日期" prop="dateCreate">
                            <el-date-picker v-model="bizdata.dateCreate" autocomplete="off"
                                            :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同生效日期" prop="dateStart">
                            <el-date-picker :picker-options="pickerOptions(1)" @change="handleSectStart" v-model="bizdata.dateStart"
                                            :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同终止日期" prop="dateEnd">
                            <el-date-picker :picker-options="pickerOptions(2)" v-model="bizdata.dateEnd"
                                            :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同类型" prop="htlx">
                            <ice-select v-model="bizdata.htlx" map-type-code="HTLX" autocomplete="off"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                        <el-form-item label="份数" prop="htNum">
                            <el-input-number :min="1" v-model="bizdata.htNum" autocomplete="off"
                                             :disabled="formReadonly"></el-input-number>
                        </el-form-item>
                        <el-form-item label="登记部门" prop="htdept">
                            <ice-dept-selector chooseItem="single"
                                               :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                               v-model="bizdata.htdept"
                                               @select-confirm="depts=>bizdata.htdeptCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1">
                        <el-form-item label="合同概要" prop="htrw">
                            <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model="bizdata.htrw" autocomplete="off"
                                      :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="dateRemark">
                            <el-input type="textarea" v-model="bizdata.dateRemark" placeholder="不超过650个字"
                                      maxlength="650"
                                      show-word-limit autocomplete="off" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1" name="关联数据">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="合同附件" name="first">
                                <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" :data="attaTableData"
                                            ref="attachment"
                                            :is-handleer="!formReadonly"></ATTACHMENT>
                            </el-tab-pane>
                            <el-tab-pane label="关联任务" name="three">
                                <div v-show="!formReadonly">
                                    <el-button type="primary" @click="addTask">添加</el-button>
                                    <el-button type="danger" @click="deleteTask">删除</el-button>
                                </div>
                                <div style="position: relative;height: 300px;">
                                    <div style="position: absolute;top: 0;right: 0;left: 0;">

                                        <vxe-table border show-overflow
                                                   ref="taskTable"
                                                   height="300px"
                                                   auto-resize
                                                   :data="taskTableData">
                                            <vxe-table-column type="checkbox" width="60"
                                                              v-if="!flowScope.formReadonly"></vxe-table-column>
                                            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                            <vxe-table-column field="xmcode" title="所内项目编号"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="xmname" title="项目名称"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="wbscode" title="任务编号"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="rwname" title="任务名称"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="rwzt" title="任务状态"
                                                              width="200" :cell-render="{name:'mapTypeCode', mapTypeCode: 'RWZT'}"></vxe-table-column>
                                            <vxe-table-column field="rwmb" title="任务目标"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="rwfzr" title="责任人"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="rwdept" title="责任单位"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="jjcd" title="紧急程度"
                                                              width="200" :cell-render="{name:'mapTypeCode', mapTypeCode: 'JJCD'}"></vxe-table-column>
                                            <vxe-table-column field="dataSecretLevcode" title="密级" width="100"
                                                              :cell-render="{name:'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>
                                        </vxe-table>
                                    </div>
                                </div>

                            </el-tab-pane>
                            <el-tab-pane label="关联项目" name="second">
                                <div v-show="!formReadonly">
                                    <el-button type="primary" @click="addProject">添加</el-button>
                                    <el-button type="danger" @click="deleteProject">删除</el-button>
                                </div>
                                <div style="position: relative;height: 300px;">
                                    <div style="position: absolute;top: 0;right: 0;left: 0;">
                                        <vxe-table border show-overflow
                                                   ref="projectTable"
                                                   height="300px"
                                                   auto-resize
                                                   :data="projectTableData">
                                            <vxe-table-column type="checkbox" width="60"
                                                              v-if="!flowScope.formReadonly"></vxe-table-column>
                                            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                            <vxe-table-column field="xmname" title="项目名称"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="xmcode" title="所内项目编号"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="xmcodeSw" title="所外项目编号"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="xmlb" title="项目类别" width="200"
                                                              :cell-render="{name:'mapTypeCode', mapTypeCode: 'XMLB'}"></vxe-table-column>
                                            <vxe-table-column field="xmlyName" title="项目来源"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="xmxkfx" title="学科方向" width="200"
                                                              :cell-render="{name:'mapTypeCode', mapTypeCode: 'XMXKFX'}"></vxe-table-column>
                                            <vxe-table-column field="xmzgbm" title="业务主管部门"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="orgname" title="责任单位"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="gmtLx" title="立项日期" width="200"></vxe-table-column>
                                            <vxe-table-column field="finishDate" title="完结日期"
                                                              width="200"></vxe-table-column>
                                            <vxe-table-column field="dataSecretLevcode" title="密级" width="100"
                                                              :cell-render="{name:'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>

                                        </vxe-table>
                                    </div>

                                </div>

                            </el-tab-pane>
                        </el-tabs>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @closeVisible="closeVisible" @select="selectProject"
                       :dataSecretLevcode="bizdata.dataSecretLevcode" ref="xmsect"></XM_SELECT>
        </ice-dialog>
        <!--选择-->
        <pms-table-tree ref="tabletree" :unbrid="unbrid"
                        :dialogConfig="dialogConfig"
                        :tableObject="tableObject"
                        :inpWidth="width"
                        :transfer="transfer"
                        @handleCallback="handleCallback"
                        @handleClose="handleToggleDialog"
                        @handleTreeCallback="handleTreeCallback">
        </pms-table-tree>
    </div>
</template>

<script>

    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "../../../components/common/base/IceSelect";
    import ATTACHMENT from "../common/ATTACHMENT";
    import IceDialog from "../../../components/common/base/IceDialog";
    import XM_SELECT from "../common/XM_SELECT";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import PmsInput from '@/components/common/pms/PmsInput'
    import moment from 'moment'

    // 获取近5年的年份
    function nearFiveYears() {
        let date = new Date();
        let currentYear = date.getFullYear();
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push(currentYear);
            currentYear -= 1;
        }
        return arr.join(',');
    }

    export default {
        mixins: [codeConfigRequest],
        data() {
            return {
                percent: 0,
                columns: [],
                selector: '',
                bizdata: {
                    a: 0,
                    softwareInfoList: [{"fileMD5": "123456"}],
                    htcode: '',
                    dataSecretLevcode: '',
                    dateStart: '',
                    dateEnd: '',

                },
                instProcessVar: {a: 10},
                formReadonly: false,

                oid: this.$route.query.dataId,
                activeName: 'first',
                visibleProject: false,
                attaTableData: [],
                projectTableData: [],

                taskTableData: [],

                rules: {
                    htname: [
                        {required: true, whitespace: true, message: '请输入合同名称', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    htjf: [
                        {required: true, whitespace: true, message: '请输入甲方名称', trigger: 'blur'}
                    ],
                    htyf: [
                        {required: true, whitespace: true, message: '请输入乙方名称', trigger: 'blur'}
                    ],
                    htje: [
                        {required: true, message: '请输入合同金额', trigger: 'blur'}
                    ],
                    dateCreate: [
                        {required: true, message: '请选择合同签订日期', trigger: 'blur'}
                    ],
                    dateStart: [
                        {required: true, message: '请选择合同生效日期', trigger: 'blur'}
                    ],
                    dateEnd: [
                        {required: true, message: '请选择合同终止日期', trigger: 'blur'}
                    ],
                    htrw: [
                        {required: true, message: '请输入合同概要', trigger: 'blur'}
                    ],
                },

                width: '300px',
                unbrid: false,
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,
                },
                transfer: {
                    nodeKey: 'oid',
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
                            years: nearFiveYears()
                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
                tableObject: {
                    buttons: [],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'oidXm', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', width: 200},
                        {label: '任务名称', code: 'rwname', width: 200,},
                        {label: '任务目标', code: 'rwmb', width: 200},
                        {label: '任务状态', code: 'rwzt', width: 200, mapTypeCode: "RWZT"},
                        {label: '前置任务', code: 'qzrw', width: 200},
                        {label: '工期', code: 'rwgq', width: 100, hidden: true},
                        {label: '实际开始日期', code: 'dateSjStar', width: 200, hidden: true},
                        {label: '实际完成日期', code: 'dateSjEnd', width: 200, hidden: true},
                        {label: '部门', code: 'rwdept', width: 140, },
                        {label: '任务负责人', code: 'rwfzr', width: 140},
                        {label: '紧急程度', code: 'jjcd', width: 200, mapTypeCode: "JJCD"},
                        {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: "DATA_SECRET_LEVEL"},
                        // {label: '创建日期', code: 'createDate', width: 140, sortable: true, formatter(row) {
                        //         return moment(row.createDate).format('YYYY-MM-DD')
                        //     }
                        // },


                    ],
                    query: [
                        {type: 'static', code: 'oidXm', value: '0'},
                        {
                            type: 'static', code: 'dataSecretLevcode', exp: 'in', value: () => {
                                let str = [];
                                let se = this.bizdata.dataSecretLevcode ? this.bizdata.dataSecretLevcode : 4;
                                for (let i = 1; i <= se; i++) {
                                    str.push(i);
                                }
                                return str.join(",");
                            }
                        },
                        {
                            type: 'static', code: 'createDate', exp: '=', value: ""
                        },
                    ],
                    gridData: [],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                // 任务展示数据
                taskData: [],
                // 项目展示数据
                xmData: [],
                // 附件展示数据
                fjdata: []
            }
        },
        methods: {
            // 日期控制
            pickerOptions (type) {
                if (type == 1) {
                    let end = this.bizdata.dateEnd;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.bizdata.dateStart;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            changeFj(data) {
                this.fjdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'ht'}).then(res => {
                    this.bizdata.htcode = res.number;
                })
            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                Object.assign(this.bizdata, bizdata);

                console.log('init', bizdata);
                console.log('flowContext', flowContext);

                if (flowContext.nodeId == 'FirstNode') {
                    this.formReadonly = false;
                } else {
                    this.formReadonly = true;
                    this.rules = {};
                }
                if (bizdata.oid) {

                } else {
                    this.getCode();
                }
            },
            flowOperateBtn(flowContext, bizdata) {


                let result = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        result = true;
                    } else {
                        result = false;
                    }
                });
                return result;
            },
            flowBizData() {
                //获取业务表单数据
                // 项目数据
                let insertProjectData = this.$refs.projectTable.getInsertRecords();
                let removeProjectData = this.$refs.projectTable.getRemoveRecords();
                let updateProjectData = this.$refs.projectTable.getUpdateRecords();
                removeProjectData.map(o => {
                    o.version = -1;
                    o.pmsHtinfoList = [];
                    o.pmsXminfoCyList = [];
                    o.pmsXmRwFjListXmsr = [];
                    o.pmsFxqdList = [];
                    o.xtFjList = [];
                    o.pmsXmRwFjListXmsc = [];
                    o.oidXm = o.oid;
                    o.oidHt = this.bizdata.oid;
                });

                // 任务数据
                let insertTaskData = this.$refs.taskTable.getInsertRecords();
                let removeTaskData = this.$refs.taskTable.getRemoveRecords();
                let updateTaskData = this.$refs.taskTable.getUpdateRecords();

                removeTaskData.map(o => {
                    o.version = -1;
                    o.oidRw = o.oid;
                    o.oidHt = this.bizdata.oid;
                });
                let tastarr = [...insertTaskData, ...removeTaskData, ...updateTaskData];
                console.log(insertTaskData)
                console.log(removeTaskData)
                console.log(updateTaskData)

                this.bizdata.xtFjs = this.$refs.attachment.getData();
                this.bizdata.xmHts = insertProjectData.concat(removeProjectData, updateProjectData, tastarr);
                console.log(this.bizdata, 'bizdata')
                return this.bizdata;
            },
            handleSectStart(val) {
                if (this.bizdata.dateEnd && this.bizdata.dateEnd.getTime() < val.getTime()) {
                    this.bizdata.dateEnd = "";
                }

            },

            callBackSuccess(data) {
                if (data) {
                    this.bizdata = data;
                    //this.attaTableData = data.xtFjs;
                    //this.projectTableData = data.xminfos;
                    this.getHtXmData(data.oid);
                    this.getHtFjData(data.oid);
                    this.getHtRwData(data.oid);
                }
            },

            // --------- 项目关联 start ----------
            addProject() {
                this.visibleProject = true;
                this.$nextTick(_ => {
                    this.$refs.xmsect.refresh();
                })

            },
            deleteProject() {
                if (this.$refs.projectTable.getCheckboxRecords().length <= 0) {
                    this.$message.error('请选择');
                    return
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.projectTable.removeSelecteds();
                    this.$nextTick(_ => {
                        this.taskData = this.$refs.taskTable.getTableData().visibleData;
                        this.xmData = this.$refs.projectTable.getTableData().visibleData;
                    })
                }).catch(() => {
                    console.log('取消成功')
                })

            },
            // 获取合同项目数据
            getHtXmData(oidHt) {
                console.log(1223456)
                this.projectTableData = [];
                this.$axios.get("/pms/Xminfo/listByOidHt", {params: {oidHt: oidHt}})
                    .then(result => {
                        let data = result.data;
                        data.map(c=>{
                            c.oidXm = c.oid;
                        })

                        this.projectTableData = data;
                        console.log(data, 'data');
                        this.xmData = this.projectTableData;

                    })
                    .catch(error => {
                        this.$message.error("获取合同项目数据失败！")
                    })

            },
            // 获取合同附件数据
            getHtFjData(oidHt) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByOidHt", {params: {oidHt: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.fjdata = this.attaTableData;
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取合同附件数据失败！")
                    })
            },
            selectProject(item) {
                let tableData = this.$refs.projectTable.getTableData().tableData;

                item.forEach((c, i) => {
                    let flag = true;
                    tableData.forEach((d, i) => {
                        if (c.oid == d.oidXm) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        c.oidXm = c.oid;
                        c.oid = null;
                        this.$refs.projectTable.insertAt(c, -1)
                            .then(({row}) => this.$refs.projectTable.setActiveCell(row))
                    }
                })
                this.visibleProject = false;
                this.$nextTick(_ => {
                    this.xmData = this.$refs.projectTable.getTableData().visibleData;
                })
            },
            closeVisible() {
                this.visibleProject = false;
            },
            // --------- 项目关联 end ----------

            // --------- 任务关联 start ----------
            addTask() {
                this.dialogConfig.visible = true;
                this.$nextTick(_=>{
                    this.$refs.tabletree.refresh();
                })
            },
            deleteTask() {
                if (this.$refs.taskTable.getCheckboxRecords().length <= 0) {
                    this.$message.error('请选择');
                    return
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.taskTable.removeSelecteds();
                    this.$nextTick(_ => {
                        this.taskData = this.$refs.taskTable.getTableData().visibleData;
                        this.xmData = this.$refs.projectTable.getTableData().visibleData;
                    })
                }).catch(() => {
                    console.log('取消成功')
                })
            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {
                let tableData = this.$refs.taskTable.getTableData().tableData;
                let pdata = this.$refs.projectTable.getTableData().tableData;
                console.log(tableData, pdata, data)
                let finditem = tableData.filter(c => {
                    return c.oidRw === data[0].oid
                })
                if (finditem && finditem.length > 0) {
                    this.visibleProject = false;
                    return;
                }
                this.$axios.get("/pms/Xminfo/get", {params: {id: data[0].oidXm}})
                    .then(result => {
                        // 回调后数据操作
                        let recordRw = JSON.parse(JSON.stringify(data[0]));
                        recordRw.oidRw = recordRw.oid;
                        recordRw.xmname = result.data.xmname;
                        recordRw.xmcode = result.data.xmcode;
                        recordRw.oid = null;
                        this.$refs.taskTable.insertAt(recordRw, -1)
                            .then(({row}) => this.$refs.taskTable.setActiveCell(row));
                        this.$nextTick(_ => {
                            this.taskData = this.$refs.taskTable.getTableData().visibleData;
                            this.xmData = this.$refs.projectTable.getTableData().visibleData;
                        })
                        // 判定密级
                        if (this.bizdata.dataSecretLevcode && result.data.dataSecretLevcode > this.bizdata.dataSecretLevcode) {
                            return
                        }
                        let recordXm = result.data;
                        recordXm.oidXm = recordXm.oid;
                        recordXm.oid = null;
                        let projectarr = pdata.filter(c => {
                            return c.oidXm === data[0].oidXm
                        })
                        if (projectarr && projectarr.length > 0) {
                            return;
                        }
                        this.$refs.projectTable.insertAt(recordXm, -1)
                            .then(({row}) => this.$refs.projectTable.setActiveCell(row))
                        this.$nextTick(_ => {
                            this.taskData = this.$refs.taskTable.getTableData().visibleData;
                            this.xmData = this.$refs.projectTable.getTableData().visibleData;
                        })
                    })
                    .catch(error => {
                        this.$message.error("获取项目信息数据失败！")
                    })

            },
            // 点击弹出选择任务
            handleDialog() {
                this.dialogConfig.visible = true;
            },
            // 树组件选中回调
            handleTreeCallback(data) {
                console.log(data);
                this.tableObject.query[0].value = data.oid;
                this.tableObject.query[2].value = data.oid?"" : data.xmname ;

                // 刷新表格
                this.$refs.tabletree.refresh();
            },
            handleToggleDialog() {
                this.dialogConfig.visible = !this.dialogConfig.visible;
                if (this.dialogConfig.visible) {
                    this.$nextTick(_ => {
                        this.$refs.tabletree.refresh();
                    })

                }
            },

            // 获取合同任务数据
            getHtRwData(oidHt) {
                this.taskTableData = [];
                this.$axios.get("/pms/PmsWbs/listByOidHt", {params: {oidHt: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            d.oidRw = d.oid;
                            this.taskTableData.push(d);
                        });
                        this.taskData = this.taskTableData;
                    })
                    .catch(error => {
                        this.$message.error("获取合同任务数据失败！")
                    })
            },
            // --------- 任务关联 end ----------
        },

        created() {
            if (this.oid) {
                this.$axios.get("/pms/PmsHtinfo/get", {params: {id: this.oid}})
                    .then(result => {
                        this.bizdata = {...result.data}
                        this.bizdata.id = this.oid;
                        this.getHtFjData(this.oid);
                        this.getHtXmData(this.oid);
                        this.getHtRwData(this.oid);
                    })
                    .catch(error => {
                        this.$message.error("查询失败")
                    })

            }
        },

        watch: {},
        computed: {
            controlMj() {
                return [];
            },
            controlMjFj() {

                return this.bizdata.dataSecretLevcode ? [...this.controlMj, this.bizdata.dataSecretLevcode] : this.controlMj;
            },
            controlMjPar() {
                // 任务密级集合
                let tastarr = this.taskData.map(c => {
                    return c.dataSecretLevcode
                })
                // 项目密级集合
                let xmarr = this.xmData.map(c => {
                    return c.dataSecretLevcode
                })


                let arr = this.fjdata.map(c => {
                    return c.dataSecretLevcode
                })
                console.log([...tastarr, ...xmarr, ...arr], '[...tastarr, ...xmarr]')
                return [...tastarr, ...xmarr, ...arr];
            }
        },
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },
        components: {
            PmsTableTree,
            IceFlowForm,
            XM_SELECT,
            IceDialog,
            ATTACHMENT,
            IceSelect,
            IceGridLayout,
            IceDeptSelector,
            PmsInput
        }
    }
    /**
     * 流程数据提交验证
     * 申请人。。。没有加载出来
     * 流程保存
     * 获取当前登陆人：前后端
     */

</script>


<style scoped>

</style>

<template>
    <div>
        <ice-dialog title="合同详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="交付基本信息" name="first">
                    <div class="item">
                        <el-form :model="bizdata" status-icon ref="form" label-width="140px">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="合同名称" prop="htname">
                                            <el-input maxlength="33" v-model="bizdata.htname" autocomplete="off"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="密级" prop="dataSecretLevcode">
                                            <ice-select  v-model="bizdata.dataSecretLevcode"
                                                         map-type-code="DATA_SECRET_LEVEL"
                                                         autocomplete="off" :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="合同编号" prop="htcode">
                                            <el-input v-model="bizdata.htcode" autocomplete="off" :disabled="flowScope.formReadonly"
                                                      readonly="readonly" placeholder="系统自动生成"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="甲方" prop="htjf">
                                            <el-input maxlength="33" v-model="bizdata.htjf" autocomplete="off"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="乙方" prop="htyf">
                                        <el-input maxlength="33" v-model="bizdata.htyf" autocomplete="off"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="合同金额" prop="htje">

                                        <pms-input v-model="bizdata.htje" maxlen="12" precision="2" unit="元"
                                                   :disabled="flowScope.formReadonly"></pms-input>

                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="合同签订日期" prop="dateCreate">
                                        <el-date-picker v-model="bizdata.dateCreate" autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="合同生效日期" prop="dateStart">
                                        <el-date-picker v-model="bizdata.dateStart" autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="合同终止日期" prop="dateEnd">
                                        <el-date-picker  v-model="bizdata.dateEnd" autocomplete="off"
                                                         :disabled="flowScope.formReadonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="合同类型" prop="htlx">
                                        <ice-select v-model="bizdata.htlx" map-type-code="HTLX" autocomplete="off"
                                                    :disabled="flowScope.formReadonly"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="份数" prop="htNum">
                                        <el-input-number :min="1" v-model="bizdata.htNum" autocomplete="off"
                                                         :disabled="flowScope.formReadonly"></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="登记部门" prop="htdept">
                                        <ice-dept-selector chooseItem="single"
                                                           :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                           v-model="bizdata.htdept"
                                                           @select-confirm="depts=>bizdata.htdeptCode=depts[0].deptCode">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <el-form-item label="合同概要" prop="htrw">
                                                <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                                          show-word-limit v-model="bizdata.htrw" autocomplete="off"
                                                          :disabled="flowScope.formReadonly"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <el-form-item label="备注" prop="dateRemark">
                                                <el-input type="textarea" v-model="bizdata.dateRemark" placeholder="不超过650个字"
                                                          maxlength="650"
                                                          show-word-limit autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="关联任务" name="second">
                    <div class="item">
                        <vxe-table border show-overflow
                                   ref="taskTable"
                                   height="500px"
                                   auto-resize
                                   :data="taskData">
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

                </el-tab-pane>
                <el-tab-pane label="关联项目" name="three">
                    <div class="item">
                        <vxe-table border show-overflow
                                   ref="projectTable"
                                   height="500px"
                                   auto-resize
                                   :data="xmData">
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
                </el-tab-pane>
                <!--点击编辑打开项目输入-->
                <el-tab-pane label="附件" name="xmsr">
                    <div class="item">
                        <ATTACHMENT Height="500px"  :data="fjdata"
                                    ref="attachment"
                                    :is-handleer="!flowScope.formReadonly"></ATTACHMENT>
                    </div>


                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar">
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../utils/constant"


    export default {
        name: "htDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector
        },
        props: {
            jhjhId: {
                default: ""
            },
            toFlow: {
                type: Function,
            }
        },
        data() {
            return {
                SPZT,
                xtFj: [],
                activeName: "first",
                loading: false,
                bizdata: {},
                flowScope: {
                    formReadonly: true
                },
                visible: false,
                previd: "",
                taskData: [],
                fjdata: [],
                xmData:[]
            }
        },
        methods: {
            toFlow1 () {
                this.visible = false;
                this.toFlow(this.bizdata);
            },
            // 获取详情
            getDetail(oid) {
                if (oid && this.previd != oid) {
                    this.previd = oid;
                    this.$axios.get("/pms/PmsHtinfo/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = {...result.data}
                            this.bizdata.id = this.oid;
                            this.getHtFjData(oid);
                            this.getHtXmData(oid);
                            this.getHtRwData(oid);
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


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
                        console.log(data, 'data1231241324123412');
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
            // tab 标签页点击
            handleClick() {

            }
        }
    }
</script>

<style scoped>
    .item {
        height: 500px;
    }
    .toFlow {
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 10000;
    }
</style>
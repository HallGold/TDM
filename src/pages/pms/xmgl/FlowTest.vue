<template>
    <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData" :btn-extend1="alterationAssign">
            <div slot-scope="flowScope ">
                <el-form :model="formModel" ref="form">
                    <el-row :gutter="20">
                        <input :value="formModel.oid" type="hidden">
                        <input :value="formModel.oidXm" type="hidden">
                        <input :value="formModel.pid" type="hidden">
                        <!--模态框内容-->
                        <!--第一行内容-->
                        <el-col :span="12">
                            <el-form-item label="任务名称" label-width="100px" prop="rwname">
                                <el-input v-model="formModel.rwname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="WBS编号" label-width="100px" prop="wbscode">
                                <el-input disabled :value="formModel.wbscode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="前置任务" label-width="100px" prop="qzrw">
                                <el-input v-model="formModel.qzrw"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="任务模式" label-width="100px" prop="rwms" map>
                                <ice-select v-model="formModel.rwms" map-type-code="RWMS">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="任务类型" label-width="100px" prop="rwlx" map>
                                <ice-select v-model="formModel.rwlx" map-type-code="RWLX"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="任务条件" label-width="100px" prop="rwtj" map>
                                <ice-select v-model="formModel.rwtj" map-type-code="RWTJ"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工期" label-width="100px" prop="rwgq">
                                <el-input-number :min=0 v-model="formModel.rwgq"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="计划开始日期" label-width="100px" prop="dateJhStar">
                                <el-date-picker v-model="formModel.dateJhStar"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计划完成日期" label-width="100px" prop="dateJhEnd">
                                <el-date-picker v-model="formModel.dateJhEnd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="部门" label-width="100px" prop="rwdept">
                                <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.rwdeptName" @select-confirm="depts=>formModel.rwdept=depts[0].deptCode">
                                </ice-dept-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="任务负责人" label-width="100px" prop="rwfzr">
                                <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formModel.rwdept" v-model="formModel.rwfzr">
                                </ice-persion-selector>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            
                            <el-form-item label="资源类型" label-width="100px" prop="zylx" map>
                                <ice-select v-model="formModel.zylx" map-type-code="ZYLX">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="资源名称" label-width="100px" prop="zynqme">
                                <el-input v-model="formModel.zynqme"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="任务状态" label-width="100px" prop="rwzt" map>
                                <ice-select v-model="formModel.rwzt" map-type-code="RWZT">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="固定日期" label-width="100px" prop="gdrq">
                                <ice-select v-model="formModel.gdrq" map-type-code="IS_YES_NO"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="限制类型" label-width="100px" prop="xzlx" map>
                                <ice-select v-model="formModel.xzlx" map-type-code="XZLX">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="限制日期" label-width="100px" prop="xzdate">
                                <el-date-picker v-model="formModel.xzdate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="里程碑任务" label-width="100px" prop="isLcb">
                                <ice-select v-model="formModel.isLcb" map-type-code="IS_YES_NO"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关键任务" label-width="100px" prop="isGj">
                                <ice-select v-model="formModel.isGj" map-type-code="IS_YES_NO"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
    </ice-flow-form>
</template>
<script>
import IceFlowForm from '@/components/common/base/IceFlowForm.vue';
import IceSelect from "../../../components/common/base/IceSelect";
import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";
import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
import IcePopSelector from "../../../components/common/base/IcePopSelector";
export default {
    data() {
        return {
            formModel: {
                    oid: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    rwms: 'RWMS01',
                    rwlx: 'SS',
                    qzrw: '',
                    rwjd: '',
                    rwgq: '1',
                    rwgs: '',
                    dateJhStar: '',
                    dateJhEnd: '',
                    dateSjStar: '',
                    dateSjEnd: '',
                    rwfzr: '',
                    rwcjr: '',
                    dateCj: '',
                    rwdept: '',
                    rwdeptName: '',
                    zylx: '',
                    zynqme: '',
                    rwzt: 'RWZT01',
                    gdrq: '',
                    xzlx: 'XZLX01',
                    xzdate: '',
                    isLcb: '',
                    isGj: '',
                    version: '',
                    dataSecretLevcode: '2',
                    rwysJfSum: '',
                    rwysRl: '',
                    rwysYcl: '',
                    rwysYclfy: '',
                    rwysZy: '',
                    rwysZyfy: '',
                    rwysWx: '',
                    rwysWxfy: '',
                    rwysSw: '',
                    rwysSwfy: '',
                    rwysQt: '',
                    rwysQtfy: '',
                    rwtj: 'FS',
                    dataPxh: ''
                }
        }
    },
    methods: {
        alterationAssign(flowContext, bizdata) {
            console.log(flowContext)
            console.log(bizdata)
        },
        flowReady(flowcont, bizdata) {
            console.log(flowcont)
            console.log(bizdata)
            Object.assign(this.formModel,bizdata);
        },
        flowOperateBtn(flowContext, bizdata) {
            console.log(flowContext)
            console.log(bizdata)
            flowContext.processVar={a:10,ab12:1001,ab1:2};
            return true;
        },
        flowBizData() {
            return this.formModel;
        }
    },
    components: {
        IceFlowForm,
        IceSelect, 
        IceDeptSelector,
        IcePersionByDeptSelector,
        IcePersionSelector,
        IcePopSelector
    }
}
</script>
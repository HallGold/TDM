<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="padding: 10px 20px;" slot-scope="flowScope">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="first" style="height: 300px;">
                        <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                            <div class="formItem">
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                                            <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                                <el-button v-if="flowScope.formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                           @click="showSectJh"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="编辑部门" label-width="140px" prop="depRelName">
                                            <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                                      placeholder="请选择"
                                            >
                                                <el-button v-if="flowScope.formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                           @click="showSectBm"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                            <ice-select :controlMjPar="controlMjPar" :disabled="flowScope.formReadonly"
                                                        v-model="formModel.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL"
                                                        filterable placeholder="请选择">
                                            </ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第一行-->
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="小组编号" label-width="140px" prop="qcCode">
                                            <el-input disabled v-model="formModel.qcCode" placeholder="自动生成"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="小组名称" label-width="140px" prop="qcName">
                                            <el-input maxlength="16" v-model="formModel.qcName" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="课题名称" label-width="140px" prop="ktName">
                                            <el-input maxlength="16" v-model="formModel.ktName" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第二行-->
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="申报单位" label-width="140px" prop="sbdwName">
                                            <ice-dept-selector :selections="sectDetp" chooseItem="single"
                                                               :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                               v-model="formModel.sbdwName"
                                                               @select-confirm="depts=>{formModel.sbdwCode=depts[0].deptCode;formModel.sbdwId=depts[0].oid}">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                    <!--                                    <el-col :span="8">-->
                                    <!--                                        <el-form-item label="小组组长" label-width="140px" prop="zzName">-->
                                    <!--                                            <el-input disabled v-model="formModel.zzName"  placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>-->
                                    <!--                                        </el-form-item>-->
                                    <!--                                    </el-col>-->

                                </el-row>
                                <!--第三行-->

                                <!--第四行-->
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="申请理由" label-width="140px" prop="sqly">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.sqly"
                                                      placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                      type="textarea" :rows="2">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第五行-->
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="内容及目标" label-width="140px" prop="content">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.content"
                                                      placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                      type="textarea" :rows="2">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第五行-->
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="进度安排" label-width="140px" prop="jdap">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.jdap"
                                                      placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                      type="textarea" :rows="2">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--底部按钮-->
                            </div>


                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="小组成员" name="xzcy" style="height: 300px;">
                        <div class="formItem">
                            <div class="addXzcy" v-if="!flowScope.formReadonly">
                                <el-button type="success" @click="addCy"><i class="el-icon-circle-plus"
                                                                            style="margin-right: 5px;"></i>添加
                                </el-button>
                            </div>
                            <vxe-table
                                    auto-resize
                                    ref="xzcy"
                                    border="inner"
                                    :align="allAlign"
                                    :data="tableData">
                                <vxe-table-column type="seq" width="60"></vxe-table-column>
                                <vxe-table-column field="cyName" title="姓名">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <!--{{flowScope.formReadonly}}-->
                                        <el-input maxlength="16" v-model="row.cyName"
                                                  :disabled="editDisabled"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="cySex" title="性别"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SEX'}">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <ice-select :disabled="editDisabled" v-model="row.cySex"
                                                    map-type-code="SEX"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="cyAge" title="年龄">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-input maxlength="16" :disabled="editDisabled"
                                                  v-model="row.cyAge"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="cyPositon" title="职务">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-input maxlength="16" :disabled="editDisabled"
                                                  v-model="row.cyPositon"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="isHead" title="是否组长"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SFZZ'}">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <ice-select :disabled="editDisabled" v-model="row.isHead"
                                                    map-type-code="SFZZ"
                                                    @change="(val)=>{zzChange(row, val)}"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column title="操作" v-if="!editDisabled">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-button type="text" @click="delRow(row)">删除</el-button>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="附件" name="fj" style="height: 300px;">
                        <div class="formItem">
                            <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj"
                                        :isHandleer="!flowScope.formReadonly" Height="250px" :data="xtFjList"
                                        ref="qisAqJj"></ATTACHMENT>
                        </div>

                    </el-tab-pane>
                </el-tabs>
            </div>

        </ice-flow-form>
        <jh-common :jhType="jhType" ref="jhcommon" :jhOid="formModel.oidZljh?formModel.oidZljh:''" @jhConfirm="jhConfirm"
                   @bmConfirm="bmConfirm"></jh-common>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IceSelect from "@/components/common/base/IceSelect";

    import codeConfigRequest from '@/utils/codeConfigRequest'
    import mixins from '../../components/mixins'
    import jhCommon from '../../components/jhCommon'
    import {ZLJHZT} from '../../../../utils/constant'


    export default {
        name: "qcxzhdhz_flow",
        mixins: [codeConfigRequest, mixins],
        components: {
            IceFlowForm, ATTACHMENT, IceDeptSelector, IceSelect, jhCommon
        },
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.ZLHD,
                allAlign: null,
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    oid: '',
                    qcCode: '',//小组编号
                    qcName: '',//小组名称
                    ktName: '',//课题名称
                    sbdwCode: '',//申报单位编号
                    sbdwName: '',//申报单位名称
                    cybZzId: '',//组长在成员表中的ID
                    zzName: '',//组长名称
                    sqly: '',//申请理由
                    content: '',//内容和目标
                    jdap: '',//进度安排
                    docIds: '',//附件ID集合
                    sbdwDate: '',//申报日期
                    qcNumber: 0,//小组人数
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                },
                sectDetp: [
                    {
                        deptCode: ''
                    }
                ],
                //验证不能为空
                rules: {
                    hdName: [
                        {required: true, message: '课题名称不能为空'}
                    ],
                    dataSecretLevcode: [{required: true, message: '密级', trigger: 'blur'}],
                },
                activeName: 'first',
                loading: false,
                tableData: [
                    {
                        cyName: '',
                        cySex: '',
                        cyAge: '',
                        cyPositon: '',
                        isHead: 'N',
                    }
                ],
                xtFjList: [],
                disabled: false,
                editDisabled: false,
                changeFjSrdata: [],
                // 流程
                isFlow: true
            }
        },
        created() {
            this.sectDetp = [
                {
                    deptCode: this.formModel.sbdwCode
                }
            ]
        },
        computed: {
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar() {
                // 附件
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr2];
            }
        },
        methods: {
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'QCxz'}).then(res => {
                    this.formModel.qcCode = res.number;
                })
            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                this.editDisabled = flowContext.getFormReadonly();
                if (bizdata.oid) {
                    this.edit(bizdata)
                } else {
                    this.$refs.form.resetFields();
                    this.getCode();
                    this.fuzhiData();
                }
                let flowData = this.$refs.flow.flowInstData;
                if (flowData.proOperates != null) {
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return this.$refs.form.validate();
            },
            flowBizData() {
                // 传递数据整合
                //获取业务表单数据  formModel 传给控件处理
                let fj = this.$refs.qisAqJj.getVisibleDataAndDelData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];

                let cy = this.$refs.xzcy.getTableData().tableData;
                let deldata = this.$refs.xzcy.getRemoveRecords();
                deldata.map((c) => {
                    c.version = -1;
                })
                cy = cy.concat(deldata);
                this.formModel.qisQcXzcyList = cy.length != 0 ? cy : [];
                this.formModel.qisQcXzcyList.map((c) => {
                    c.dataSecretLevcode = 2;
                })
                // console.log(this.formModel, 'formmodel')
                return this.formModel;
            },
            // 禁用表格编辑
            activeRowMethod() {
                return true;
            },
            // 查询小组成员
            searchXzcy(oid) {
                this.$axios.get("pms/QisQcxzhd/querylistByOidQcCy", {params: {oid: oid}})
                    .then(result => {
                        this.tableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 查询附件
            getFj(oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.xtFjList = result.data;
                        this.changeFjSrdata = this.xtFjList;

                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //选中一行进行编辑
            edit(row) {
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                    this.searchXzcy(row.oid)
                    this.getFj(row.oid)
                    this.$refs.qisAqJj.resize();
                })
                //this.getFjData(row);
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                this.formModel = data;
                this.xtFjList = this.formModel.xtFjList;
                this.tableData = this.formModel.qisQcXzcyList;
                // console.log(data);
            },

            handleClick(e) {
                if (e.name == 'fj') {
                    this.$refs.qisAqJj.resize();
                }
                if (e.name == 'xzcy') {
                    this.$nextTick(() => {
                        this.$refs.xzcy.recalculate();
                    })
                }
            },
            // 新增成员
            addCy() {
                let record = {
                    cyName: '',
                    cySex: '',
                    cyAge: '',
                    cyPositon: '',
                    isHead: 'N',
                };
                this.formModel.qcNumber = this.formModel.qcNumber * 1 + 1;
                // console.log('人数：', this.formModel.qcNumber)
                this.$refs.xzcy.insertAt(record, -1)
                    .then(({row}) => this.$refs.xzcy.setActiveCell(row))
            },
            delRow(row) {
                this.$refs.xzcy.remove([row]);
                if (this.formModel.qcNumber > 0) {
                    this.formModel.qcNumber = this.formModel.qcNumber * 1 - 1;
                    // console.log('人数：', this.formModel.qcNumber)
                }

            },
            zzChange(row, value) {
                let cy = this.$refs.xzcy.getTableData().tableData;
                if (value == 'N') {
                    return
                }
                //一个组长
                cy.map(c => {
                    if (c.ROW_ID != row.ROW_ID) {
                        c.isHead = 'N'
                    }
                })
                this.tableData = cy;

            },
        },

    }
</script>

<style scoped>

</style>

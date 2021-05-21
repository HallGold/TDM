<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="height: 500px;" slot-scope="flowScope">
                <div class="flow" style="padding: 10px 20px;">
                    <el-form :model="formModel" ref="form" :rules="rules">
                        <!--第一行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="论证编号" label-width="140px" prop="lzCode">
                                    <el-input disabled v-model="formModel.lzCode" placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="活动名称" label-width="140px" prop="hdName">
                                    <el-input maxlength="30" v-model="formModel.hdName" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第二行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="承担单位" label-width="140px" prop="cddw">
                                    <ice-dept-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                       :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                       v-model="formModel.cddw"
                                                       @select-confirm="depts=>formModel.cddwCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="任务来源" label-width="140px" prop="rwly">
                                    <el-input maxlength="30" v-model="formModel.rwly" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第三行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目负责人" label-width="140px" prop="xmbzr">
                                    <ice-persion-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                          :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                          v-model="formModel.xmbzr"
                                                          @select-confirm="depts=>formModel.xmbzrCode=depts[0].code">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系电话" label-width="140px" prop="lxdd">
                                    <el-input v-model="formModel.lxdd" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第四行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="作业场所" label-width="140px" prop="zycs">
                                    <el-input maxlength="30" v-model="formModel.zycs" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="作业人数" label-width="140px" prop="zyrs">
                                    <el-input v-model="formModel.zyrs" type="number" step="1" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第五行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="操作资质" label-width="140px" prop="czyq">
                                    <el-input maxlength="65" v-model="formModel.czyq" placeholder="请输入"
                                              :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                    <ice-select :controlMjPar="controlMjPar" :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第六行-->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="简要描述" label-width="110px" prop="jyms">
                                    <el-input v-model="formModel.jyms" placeholder="简要描述填写不超过500个字"
                                              :disabled="flowScope.formReadonly"
                                              maxlength="500" show-word-limit type="textarea" :rows="4">
                                    </el-input>
                                    <check-item :formReadonly="flowScope.formReadonly" :mapTypeCode="mapTypeCode"
                                                v-model="jymsTags"></check-item>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第七行-->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input :disabled="flowScope.formReadonly" v-model="formModel.dateRemark"
                                              placeholder="备注填写不超过500个字" type="textarea"
                                              maxlength="500" show-word-limit :rows="4">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" :isHandleer="!flowScope.formReadonly" Height="200px" :data="xtFjList"
                                            ref="qisAqJj"></ATTACHMENT>
                            </el-col>
                        </el-row>
                        <!--&lt;!&ndash;底部按钮&ndash;&gt;-->
                        <!--<el-row>-->
                        <!--<div class="ice-button-bar">-->
                        <!--<el-button type="primary" @click="conserve" ctrlCode="confirm" :disabled="disabled">保存-->
                        <!--</el-button>-->
                        <!--<el-button type="info" @click="visible=false" ctrlCode="return">返回</el-button>-->
                        <!--</div>-->
                        <!--</el-row>-->
                    </el-form>
                </div>
            </div>

        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import {mapGetters, mapMutations} from 'vuex';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import checkItem from "../../components/checkItem";
    import {validatePassTel} from '../../../../utils/validator'
    import codeConfigRequest from '@/utils/codeConfigRequest'

    export default {
        name: "aqlzsb_flow",
        mixins: [codeConfigRequest],
        data() {
            return {
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    hdName: '',
                    oid: '',
                    lzCode: '',//论证编号
                    whplx: '',//活动名称
                    cddw: '',//承担单位
                    rwly: '',//任务来源
                    xmbzr: '',//项目负责人
                    lxdd: '',//联系电话
                    zycs: '',//作业场所
                    zyrs: '',//作业人数
                    czyq: '',//操作要求
                    jyms: '',//简要描述
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                    jymsTags: [], // 简要描述
                    docIds: [] // 附件
                },
                jymsTags: [],
                xtFjList: [],
                loading: false,
                mapTypeCode: 'QIS_JYMSBQ',
                //验证不能为空
                rules: {
                    hdName: [
                        {required: true, message: '名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],
                    lxdd: [
                        {validator: validatePassTel, trigger: 'blur'}
                    ]
                },
                disabled: false,
                changeFjSrdata: []
            }
        },
        components: {
            IceFlowForm,
            ATTACHMENT,
            IceSelect,
            IceDeptSelector,
            IcePersionSelector,
            checkItem,
        },
        computed: {
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode);
                } else {
                    return this.selectList;
                }

            },
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
        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
        },
        methods: {
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'zlxdgbz'}).then(res => {
                    this.formModel.lzCode = res.number;
                })
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMapList']),
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'bizdata')
                if (bizdata.oid) {
                    this.$nextTick(_ => {
                        this.$refs.form.resetFields();
                        this.formModel = {...bizdata};
                        const a = this.formModel.jymsTags;
                        if (a) {
                            this.jymsTags = a.split(',')
                        }
                        this.getFj(this.formModel.oid);
                        this.$refs.qisAqJj.resize();
                    })
                } else {
                    this.$refs.form.resetFields();
                    this.getCode();
                }

                //流程初始化
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
                this.loading = true;
                let fj = this.$refs.qisAqJj.getVisibleDataAndDelData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];
                // return
                const a = this.jymsTags
                this.formModel.jymsTags = a.join(',');
                return this.formModel
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                console.log(data, 'data')
                this.formModel = data;
                this.xtFjList = this.formModel.xtFjList
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
        }
    }
</script>

<style scoped>

</style>

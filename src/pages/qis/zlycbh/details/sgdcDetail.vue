<template>
    <div>
        <ice-dialog title="质量事故调查处理详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName"  type="border-card">
                <el-tab-pane label="基础信息" name="first">
                    <el-form :model="bizdata" status-icon ref="form">
                        <el-row :gutter="0">
                            <el-col :span="7">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="选择不合格品" label-width="140px" prop="bhgp">
                                            <el-input v-model="bizdata.bhgp" placeholder="点击选择"
                                                      :disabled="flowScope.formReadonly" type="textarea" :rows="8"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="17">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="质量事故处理单编号" label-width="140px" prop="sgCode">
                                            <el-input v-model="bizdata.sgCode" placeholder="自动生成" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="事故名称" label-width="140px" prop="sgName">
                                            <el-input maxlength="30" v-model="bizdata.sgName" placeholder="请输入" :disabled="flowScope.formReadonly" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="事故类别" label-width="140px" prop="sgType">
                                            <ice-select v-model="bizdata.sgType" map-type-code="ZLSGDCCL_SGLB"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="责任人" label-width="140px" prop="zrr">
                                            <ice-persion-selector  chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                   v-model="bizdata.zrr"
                                                                   >
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="责任单位" label-width="140px" prop="zrdw">
                                            <el-input v-model="bizdata.zrdw" placeholder="自动带出" :disabled="flowScope.formReadonly" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                            <ice-select v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="附件" label-width="140px" prop="fj">
                                            <ice-single-upload   v-model="bizdata.dataid" :doSecret="true"
                                                                 ref="fileUpload" :disabled="flowScope.formReadonly" ></ice-single-upload>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="事故描述" label-width="140px" prop="situation">
                                            <el-input v-model="bizdata.situation" :disabled="flowScope.formReadonly" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="处理意见" label-width="140px"  prop="options">
                                            <el-radio-group
                                                    :disabled="flowScope.formReadonly"
                                                    v-model="bizdata.options">
                                                <el-radio v-for="idea in ideas" :label="idea.label" :key="idea.label">{{idea.value}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="责任认定结论" label-width="140px" prop="duty">
                                            <el-input v-model="bizdata.duty" :disabled="flowScope.formReadonly" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form>


                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar">
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../../pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../../utils/constant";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";



    export default {
        name: "sgdcDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector,
            IcePersionSelector
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
                activeName: "first",
                loading: false,
                bizdata: {},
                flowScope: {
                    formReadonly: true
                },
                visible: false,
                previd: "",
                ideas: [
                    {label:'ZLSGDCCL_OPTION0', value:'组织事故调查组'},
                    {label:'ZLSGDCCL_OPTION1', value:'以质量问题归零'},
                ],
                bhgOptions: []
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
                    this.$axios.get("/pms/QisZlsg/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = {...result.data}
                            this.bizdata.id = this.oid;
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


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

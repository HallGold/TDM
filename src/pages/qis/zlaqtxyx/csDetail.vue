<template>
    <div>
        <ice-dialog title="纠正措施详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card" >
                <el-tab-pane label="基础信息" name="first">
                    <el-form :model="bizdata" ref="form">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="型号" label-width="100px" prop="xh">
                                    <el-input maxlength="65" v-model="bizdata.xh" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="责任单位" label-width="100px" prop="zrdw">
                                    <ice-dept-selector   chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                         v-model="bizdata.zrdw"
                                                         @select-confirm="depts=>bizdata.zrdwCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理期限" label-width="100px" prop="clqx">
                                    <el-date-picker :disabled="flowScope.formReadonly"  v-model="bizdata.clqx"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="问题描述" label-width="100px" prop="wtms">
                                    <el-input type="textarea" :disabled="flowScope.formReadonly"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.wtms"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="原因分析" label-width="100px" prop="yyfx">
                                    <el-input type="textarea" :disabled="flowScope.formReadonly"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.yyfx"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="纠正措施" label-width="100px" prop="jzcs">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.jzcs"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="所审查意见" label-width="100px" prop="scyj">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.scyj"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="纠正措施效果" label-width="100px" prop="jzcsxg">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.jzcsxg"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="有效性验证" label-width="100px" prop="yxxyz">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.yxxyz"></el-input>
                                </el-form-item>
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
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../utils/constant";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";



    export default {
        name: "csDetail",
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
                    this.$axios.get("/pms/QisJzcscl/get", {params: {id: oid}})
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
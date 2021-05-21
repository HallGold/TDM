<template>
    <div>
        <ice-dialog title="安全论证申报详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="formModel.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="基础信息" name="first">
                    <div style="height: 500px;overflow: auto;">
                        <el-form :model="formModel" ref="form">
                            <ice-grid-layout :columns="1" name="业务表单">
                                <!--第一行-->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="论证编号" label-width="100px" prop="lzCode">
                                            <el-input disabled v-model="formModel.lzCode" placeholder="自动生成"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="活动名称" label-width="100px" prop="hdName">
                                            <el-input maxlength="30" v-model="formModel.hdName" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第二行-->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="承担单位" label-width="100px" prop="cddw">
                                            <ice-dept-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                               :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                               v-model="formModel.cddw"
                                                               @select-confirm="depts=>formModel.cddwCode=depts[0].deptCode">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="任务来源" label-width="100px" prop="rwly">
                                            <el-input maxlength="30" v-model="formModel.rwly" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第三行-->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="项目负责人" label-width="100px" prop="xmbzr">
                                            <ice-persion-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                                  :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                  v-model="formModel.xmbzr"
                                                                  @select-confirm="depts=>formModel.xmbzrCode=depts[0].code">
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="联系电话" label-width="100px" prop="lxdd">
                                            <el-input v-model="formModel.lxdd" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第四行-->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="作业场所" label-width="100px" prop="zycs">
                                            <el-input maxlength="30" v-model="formModel.zycs" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="作业人数" label-width="100px" prop="zyrs">
                                            <el-input v-model="formModel.zyrs" type="number" step="1" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第五行-->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="操作资质" label-width="100px" prop="czyq">
                                            <el-input maxlength="65" v-model="formModel.czyq" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                            <ice-select  :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
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
                            </ice-grid-layout>
                                <ice-grid-layout :columns="1" name="关联数据">
                                    <el-tabs v-model="activeName">
                                        <el-tab-pane label="附件" name="first">
                                            <ATTACHMENT :isHandleer="!flowScope.formReadonly" :data="fjdata" ref="attachment"></ATTACHMENT>
                                        </el-tab-pane>
                                    </el-tabs>
                            </ice-grid-layout>
                        </el-form>
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
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";

    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../../pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../../utils/constant";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import checkItem from "../../components/checkItem";




    export default {
        name: "lzsbDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector,
            IcePersionSelector,
            IceGridLayout,
            checkItem
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
                mapTypeCode: 'QIS_JYMSBQ',
                SPZT,
                xtFj: [],
                activeName: "first",
                loading: false,
                formModel: {},
                flowScope: {
                    formReadonly: true,

                },
                visible: false,
                previd: "",
                options: [],
                fjdata: [],
                jymsTags: []

            }
        },
        created () {

        },
        methods: {
            toFlow1 () {
                this.visible = false;
                this.toFlow(this.formModel);
            },
            // 获取详情
            getDetail(oid) {
                if (oid && this.previd != oid) {
                    this.previd = oid;
                    this.$axios.get("/pms/QisAqlzsb/get", {params: {id: oid}})
                        .then(result => {
                            this.formModel = {...result.data}
                            this.formModel.id = this.oid;
                            const a = this.formModel.jymsTags;
                            if (a) {
                                this.jymsTags = a.split(',')
                            }
                            this.getXtfj(oid);
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


            },
            // 查询协同附件
            getXtfj(fjOid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: fjOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.fjdata = this.attaTableData;
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取协同附件数据失败！");
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

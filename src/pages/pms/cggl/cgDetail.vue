<template>
    <div>
        <ice-dialog title="奖励及成果详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="奖励申请" name="first">
                    <el-form :model="bizdata" status-icon ref="form">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务" label-width="140px" prop="rwname">
                                    <el-input v-model="bizdata.rwname" placeholder="点击选择" readonly
                                              autocomplete="off" :disabled="flowScope.formReadonly">
                                        <el-button v-if="!flowScope.formReadonly" slot="append"
                                                   icon="el-icon-edit-outline" @click="showRw"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目" label-width="140px" prop="xmname">
                                    <el-input v-model="bizdata.xmname" placeholder="点击选择" readonly
                                              autocomplete="off" :disabled="flowScope.formReadonly">
                                        <el-button v-if="!flowScope.formReadonly" slot="append"
                                                   icon="el-icon-edit-outline" @click="showXm"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目起始时间" label-width="140px" prop="xmdateStart">
                                    <el-date-picker v-model="bizdata.xmdateStart" type="date"
                                                    placeholder="请选择日期"
                                                    :disabled="flowScope.formReadonly"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目完成时间" label-width="140px" prop="xmdateEnd">
                                    <el-date-picker v-model="bizdata.xmdateEnd" type="date" placeholder="请选择日期"
                                                    :disabled="flowScope.formReadonly"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="成果奖励名称" label-width="140px" prop="cgname">
                                    <el-input maxlength="33" v-model="bizdata.cgname" placeholder="请输入"
                                              autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                    <ice-select
                                                v-model="bizdata.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL" autocomplete="off"
                                                :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="主要完成人" label-width="140px" prop="sqr">
                                    <!--<el-input v-model="bizdata.sqr" placeholder="请输入"  autocomplete="off"-->
                                    <!--:disabled="flowScope.formReadonly" @focus="showRy"></el-input>-->
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          v-model="bizdata.sqr"
                                                          @select-confirm="depts=>{bizdata.sqrCode=depts[0].code;bizdata.sqdw=depts[0].deptShortName;bizdata.sqdwCode=depts[0].deptCode}">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="主要完成单位" label-width="140px" prop="sqdw">
                                    <ice-dept-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                       :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                       v-model="bizdata.sqdw"
                                                       @select-confirm="depts=>{bizdata.sqdwCode=depts[0].deptCode;}">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="申报奖项类型" label-width="140px" prop="jxlx">
                                    <ice-select v-model="bizdata.jxlx" map-type-code="JXLX" placeholder="请选择"
                                                autocomplete="off"
                                                :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="推荐等级" label-width="140px" prop="tjdj">
                                    <ice-select v-model="bizdata.tjdj" map-type-code="TJDJ" placeholder="请选择"
                                                autocomplete="off"
                                                :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="专业评审组" label-width="140px" prop="zypsz">
                                    <ice-select v-model="bizdata.zypsz" map-type-code="ZYPSZ" placeholder="请选择"
                                                autocomplete="off"
                                                :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="成果类型" label-width="140px" prop="cglx">
                                    <ice-select v-model="bizdata.cglx" map-type-code="CGLX" placeholder="请选择"
                                                autocomplete="off"
                                                :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="成果来源" label-width="140px" prop="cgly">
                                    <el-input maxlength="33" v-model="bizdata.cgly" placeholder="请输入"
                                              autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="申请日期" label-width="140px" prop="sqdate">
                                    <el-date-picker v-model="bizdata.sqdate" type="date" placeholder="请选择日期"
                                                    autocomplete="off"
                                                    :disabled="flowScope.formReadonly"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="申请说明" label-width="140px" prop="sqly">
                                    <el-input v-model="bizdata.sqly" type="textarea" autocomplete="off"
                                              :disabled="flowScope.formReadonly" maxlength="650"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                    <el-input v-model="bizdata.dateRemark" type="textarea" autocomplete="off"
                                              :disabled="flowScope.formReadonly" maxlength="650"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="附件上传" name="first4">
                    <ATTACHMENT :isHandleer="!flowScope.formReadonly" :data="fjdata" ref="attachment"></ATTACHMENT>
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
    import { SPZT} from "../../../utils/constant";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";



    export default {
        name: "htDetail",
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
                    this.$axios.get("/pms/PmsCgJxsb/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = {...result.data}
                            this.bizdata.id = this.oid;
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
            // 获取合同附件数据
            getXtfj(oid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
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

<template>
    <div>
        <ice-dialog title="项目问题详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="问题上报" name="first">
                    <el-form :model="bizdata" ref="form">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目" prop="xmname" label-width="140px">
                                    <el-input readonly v-model="bizdata.xmname" :disabled="flowScope.formReadonly" placeholder="选择项目">
                                        <el-button v-if="!flowScope.formReadonly&&!bizdata.oidProgressFeedback"  slot="append" icon="el-icon-search"
                                                   @click="showSectXm"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="任务" prop="rwname" label-width="140px">
                                    <el-input v-model="bizdata.rwname" readonly :disabled="flowScope.formReadonly">
                                        <el-button :disabled="bizdata.oidXM?false:true" v-if="!flowScope.formReadonly&&!bizdata.oidProgressFeedback"  slot="append" icon="el-icon-search"
                                                   @click="shouMissionDialog"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="问题编号" prop="wtLsm" label-width="140px">
                                    <el-input disabled v-model="bizdata.wtLsm" readonly placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" prop="dataSecretLevcode" label-width="140px">
                                    <ice-select v-model="bizdata.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL" :disabled="flowScope.formReadonly"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="问题接受部门" prop="wtjsDept" label-width="140px">
                                    <ice-dept-selector chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                       v-model="bizdata.wtjsDept"
                                                       @select-confirm="depts=>bizdata.deptCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="问题接收人" prop="wtjsr" label-width="140px">
                                    <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                          :dept-code="bizdata.deptCode"
                                                          v-model="bizdata.wtjsr">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="上报人" prop="wtSbr" label-width="140px">
                                    <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                          v-model="bizdata.wtSbr"></ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="上报日期" prop="wtSbDate" label-width="140px">
                                    <el-date-picker :disabled="flowScope.formReadonly" v-model="bizdata.wtSbDate" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="期望反馈日期" prop="wtjsDate" label-width="140px">
                                    <el-date-picker :disabled="flowScope.formReadonly" v-model="bizdata.wtjsDate" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否公开" prop="isOpen" label-width="140px">
                                    <el-select :disabled="flowScope.formReadonly" v-model="bizdata.isOpen">
                                        <el-option value="0" label="否"></el-option>
                                        <el-option value="1" label="是"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="问题类型" prop="wtlx" label-width="140px">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="bizdata.wtlx" map-type-code="WTLX"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="问题描述" prop="wtms" label-width="140px">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="bizdata.wtms"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="处理意见" prop="handlingOpinions" label-width="140px">
                                    <el-input type="textarea" placeholder="不超过330个字" maxlength="330"
                                              show-word-limit v-model="bizdata.handlingOpinions"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" prop="dateRemark" label-width="140px">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="bizdata.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="附件详情" name="second">
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
                    this.$axios.get("/pms/PmsGtWtinfo/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = {...result.data}
                            this.bizdata.id = this.oid;
                            this.getHtFjData(oid);
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
            getHtFjData(oidHt) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oidHt}})
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

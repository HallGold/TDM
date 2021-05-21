<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years" v-if="years">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in flowDataQuery"
                             :key="item.bpmDataId" @click="handleClickLeft(item, index)">
                            {{item.bpmName}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main>
                <div class="form-content" @valited="">
                    <ice-flow-form left-prop="255" name :SJID="SJID" valiate ref="flow" :flowReady="flowReady"
                                   :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
                        <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;"
                             slot-scope="flowScope">
                            <div class="con">
                                <div class="basic">
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <label for="">
                                                所属项目：
                                            </label>
                                            <span>{{flowData.xmname}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                计划编码：
                                            </label>
                                            <span>{{flowData.scJhcode}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                生产计划：
                                            </label>
                                            <span>{{flowData.scJhname}}</span>
                                        </el-col>
                                    </el-row>
                                    <!--第二行-->
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <label for="">
                                                计划类型：
                                            </label>
                                            <span><analysis-map-type-code mapTypeCode="JHLX20"
                                                                          :analysisValue="flowData.scJhlx"
                                                                          v-slot="{oldanalysisVal}">
                                                    {{oldanalysisVal}}
                                                </analysis-map-type-code>
                                            </span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                计划状态：
                                            </label>
                                            <span><analysis-map-type-code mapTypeCode="JHZT"
                                                                          :analysisValue="flowData.jhzt"
                                                                          v-slot="{oldanalysisVal}">
                                                    {{oldanalysisVal}}
                                                </analysis-map-type-code></span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                外部计划文号：
                                            </label>
                                            <span>{{flowData.scJhcode}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <label for="">
                                                紧急程度：
                                            </label>
                                            <span>
                                                <analysis-map-type-code mapTypeCode="JJCD"
                                                                        :analysisValue="flowData.jjcd"
                                                                        v-slot="{oldanalysisVal}">
                                                    {{oldanalysisVal}}
                                                </analysis-map-type-code>
                                            </span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                密级：
                                            </label>
                                            <span>
                                                <analysis-map-type-code mapTypeCode="DATA_SECRET_LEVEL"
                                                                        :analysisValue="flowData.dataSecretLevcode"
                                                                        v-slot="{oldanalysisVal}">
                                                    {{oldanalysisVal}}
                                                </analysis-map-type-code>
                                            </span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                附件：
                                            </label>
                                            <span><el-button type="text"
                                                             @click="downloadFile(flowData.oidFj)">下载</el-button></span>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <label for="">
                                                编制人：
                                            </label>
                                            <span>{{createUser}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                编制时间：
                                            </label>
                                            <span>{{flowData.createDate}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                生效时间：
                                            </label>
                                            <span>{{flowData.updateDate}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" v-if="flowData.change">
                                        <el-col :span="8">
                                            <label for="">
                                                变更人：
                                            </label>
                                            <span>{{updateUser}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label for="">
                                                变更时间：
                                            </label>
                                            <span>{{flowData.updateDate}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" v-if="flowData.change">
                                        <el-col :span="24">
                                            <label for="">
                                                变更说明：
                                            </label>
                                            <span>{{flowData.change}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                                <SCJH_ITEM :jhData="flowData" :isFlowShow="false"></SCJH_ITEM>
                            </div>
                        </div>
                    </ice-flow-form>
                </div>

            </el-main>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import analysisMapTypeCode from '../common/analysisMapTypeCode.vue'

    import SCJH_ITEM from "../common/SCJH_ITEM";

    export default {
        name: "SCJH_SHOW_FLOW",
        data() {
            return {
                active: 0,
                years: [
                    '立项记录',
                    '变更记录'
                ],
                /**
                 * 传递给流程组件的数据id
                 * */
                SJID: '',
                oidScjh: '',
                flowData: {},
                createUser: '',
                updateUser: ''
            }
        },
        components: {
            IceFlowForm,
            SCJH_ITEM,
            analysisMapTypeCode
        },
        computed: {
            flowDataQuery() {
                return this.$route.query.data ? JSON.parse(this.$route.query.data) : []
            },
        },
        created() {
            console.log(this.flowDataQuery, 'flowDataQuery')
        },
        methods: {
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'bizdata--------------')
                let flowData = this.$refs.flow.flowInstData;
                // this.$refs.xmform.handleCallbackFlow(bizdata);
                this.flowData = bizdata;
                this.getUserMsg(1,bizdata.createUser);
                this.getUserMsg(2,bizdata.updateUser);

            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件

            },
            flowBizData() {
            },
            // handleClickYear
            handleClickLeft(row, index) {
                this.active = index;
                this.SJID = row.bpmDataId;
            },
            downloadFile(dataid) {
                this.$downloadFile(dataid);
            },
            // 获取用户信息
            getUserMsg(type, userCode) {
                this.$axios.get("/permission/user/get_employee_users", {params: {userCodes: userCode}})
                    .then(result => {
                        if (type==1) {
                            this.createUser = result.data[0].name;
                        } else {
                            this.updateUser = result.data[0].name;
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取失败")
                    })
            }
        }
    }
</script>

<style lang="less" scoped>
    .form-content {
        position: relative;
        height: 100%;
    }

    .asideLeft {
        border: 1px solid #ddd;
        box-shadow: 0px 1px 1px 1px #ddd;
    }

    .con_tainer {
        padding: 15px;
        button {
            font-size: 20px;
            line-height: 25px;
            span {
                color: #666;
                font-size: 16px;
                vertical-align: top;
            }
            i {
                color: #59fb22;
                display: inline;
            }
        }
        .years {
            margin-left: 10px;
            margin-top: 20px;
            .year {
                cursor: pointer;
                padding-left: 20px;
                font-size: 14px;
                margin-bottom: 10px;
                color: #555;
                line-height: 30px;
                position: relative;
                &:hover {
                    background: rgba(0, 209, 108, 0.5);
                }
                .sanjiao {
                    position: absolute;
                    right: -15px;
                    width: 0;
                    height: 0;
                    border-top: 15px solid transparent;
                    border-right: 0;
                    border-bottom: 15px solid transparent;
                    border-left: 15px solid #00D1B2;
                    top: 0;
                    display: none;

                }
            }
            .yearSected {
                background: #00D1B2;
                color: #eeeeee;
                .sanjiao {
                    display: block;
                }
            }
        }
    }

    .form-content /deep/ .operation-area {
        left: 455px;
    }

    .basic {
        font-size: 14px;
        color: #000;
        .el-row {
            margin-bottom: 10px;
        }
        label {
            display: inline-block;
            text-align: right;
            width: 120px;
            color: #555;
            margin-right: 3px;
        }
    }
</style>
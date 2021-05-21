<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in flowDataQuery"
                             :key="item.bpmDataId" @click="handleClickLeft(item, index)">
                            {{item.bpmName}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main style="padding: 0;">
                <div class="form-content" @valited="">
                    <ice-flow-form leftProp="255" name :SJID="SJID" valiate ref="flow" :flowReady="flowReady"
                                   :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData"
                                   @callBackSuccess="handleCallbackFlow">
                        <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;"
                             slot-scope="flowScope">
                            <xm-form ref="xmform" :flowScope="flowScope" v-if="name!='项目收尾审批'"></xm-form>
                            <xm-close :flowData="flowData" ref="xmend" :flowScope="flowScope"v-else></xm-close>
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
    import XmForm from './components/XmForm'
    import xmClose from './components/xmClose'


    import {mapGetters, mapMutations} from 'vuex'

    import moment from 'moment';

    export default {
        name: "XmLookFlow",
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
                name: '',
                flowData: {}
            }
        },
        computed: {
            // 行数据id
            rowDataId() {
                if (this.$route.query.oid) {
                    return this.$route.query.oid
                } else {
                    return '';
                }
            },
            flowDataQuery() {
                return this.$route.query.data ? JSON.parse(this.$route.query.data) : []
            },
        },
        methods: {
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'bizdata--------------')
                //流程初始化
                // Object.assign(this.bizdata,bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getBizData()))

                let flowData = this.$refs.flow.flowInstData;
                this.flowData = bizdata;
                if (this.name=='项目收尾审批') {
                    return;
                }
                if (flowData.proOperates != null) {
                    if (bizdata.xminfos) {
                        console.log(this.flowDataQuery, 'this.flowDataQuery.oid')
                        let arr = bizdata.xminfos.filter(c=>{
                            console.log(c, 'c')
                            return c.oid == this.rowDataId
                        })
                        console.log(arr, 'arr')
                        this.$refs.xmform.handleCallbackFlow(arr[0]);
                        return;
                    }
                    this.$refs.xmform.handleCallbackFlow(bizdata);
                } else {
                    if (this.rowDataId) {
                        this.$refs.xmform.dbClick(this.rowDataId);
                    }

                }

            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return this.$refs.xmform.getyzResult();
            },
            flowBizData() {
                // 传递数据整合
                //获取业务表单数据  formModel 传给控件处理
                return this.$refs.xmform.getData();
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                if (this.name!='项目收尾') {
                    this.$refs.xmform.handleCallbackFlow(data);
                }

            },
            // handleClickYear
            handleClickLeft(row, index) {
                this.active = index;
                this.SJID = row.bpmDataId;
                this.name = row.bpmName;
            }
        },
        components: {
            IceFlowForm,
            XmForm,
            xmClose
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
</style>
<template>
    <div class="form-content" style="width: 100%;">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">

            <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;" slot-scope="flowScope">
                <div style="margin: 0 20px;">
                    <el-form :v-loading="loading" :model="formModel" status-icon ref="definition"
                             label-width="140px">
                        <!--第一行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="所内项目编号" label-width="110px" prop="xmcode">
                                    <el-input disabled v-model="formModel.xmcode" placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所外项目编号" label-width="110px" prop="xmcodeyn">
                                    <el-input disabled v-model="formModel.xmcodeSw" placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目名称" label-width="110px" prop="xmname">
                                    <el-input disabled v-model="formModel.xmname"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select disabled v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <ice-grid-layout :columns="1" name="验收材料">
                        <!--<el-container>-->
                            <!--<el-aside width="250px" class="aside">-->
                                <!--<div class="item"  :class="{currSelect: active == index}"-->
                                     <!--v-for="(item, index) in par.pmsXmRwFjListXmjw" :key="index"-->
                                     <!--@click="getContent(item, index)">{{item.filename}}-->
                                <!--</div>-->
                            <!--</el-aside>-->
                            <!--<el-main class="mainContent">-->
                                <!--<div>显示附件内容，基于相关插件，暂先提供<span style="color: #3366ff; cursor: pointer"-->
                                                             <!--@click="downloadFile">下载</span>附件功能-->
                                <!--</div>-->
                            <!--</el-main>-->
                        <!--</el-container>-->
                        <ATTACHMENT :data="par.pmsXmRwFjListXmjw" ref="enddata" :fun="handleToXmClose" :isHandleer=false></ATTACHMENT>
                    </ice-grid-layout>
                    <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
                    <!--<el-tab-pane label="用户管理" name="first">-->
                    <!--<el-container>-->
                    <!--<el-aside width="auto">-->
                    <!--<el-tabs :tab-position="tabPosition" style="height: 200px;" @tab-click="handleClick">-->
                    <!--<el-tab-pane v-for="(item, index) in par.pmsXmRwFjListXmjw" :label="item.filename">-->

                    <!--</el-tab-pane>-->
                    <!--</el-tabs>-->
                    <!--</el-aside>-->
                    <!--<el-main>-->
                    <!--<el-input v-model="formModel.change"-->
                    <!--placeholder="占个位置，后期调用PDM系统组件展示附件！" maxlength="650"-->
                    <!--show-word-limit type="textarea"-->
                    <!--:rows="10">-->
                    <!--</el-input>-->
                    <!--<div style="text-align: right;">-->
                    <!--<el-button type="text" @click="downloadFile">下载</el-button>-->
                    <!--</div>-->
                    <!--</el-main>-->
                    <!--</el-container>-->

                    <!--</el-tab-pane>-->
                    <!--</el-tabs>-->
                </div>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue';
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import ATTACHMENT from "../common/ATTACHMENT";

    export default {
        name: "XmEnd",
        components: {
            IceSelect,
            IceFlowForm,
            IceGridLayout,
            ATTACHMENT
        },
        data() {
            return {
                active: 0,
                loading: false,
                formModel:
                    {
                        xmname: '',
                        xmcode:
                            '',
                        xmcodeyn:
                            '',
                        xmcodeSw:
                            '',
                        dataSecretLevcode:
                            '2',
                        pmsXmRwFjListXmjw:
                            [],
                        xmzt:
                            '',
                    }
                ,
                activeName: 'first',
                tabPosition:
                    'left',
                par:
                    {}
                ,
                sectFj: {}
            }
        },
        computed: {},
        created() {

        },
        watch: {},
        methods: {
            handleToXmClose () {

            },
            getContent (item, index) {
                this.active = index;
                this.sectFj = item;
            },
            downloadFile() {
                this.$downloadFile(this.sectFj.dataid);
            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                let flowData = this.$refs.flow.flowInstData;
                if (flowData.proOperates != null) {
                    this.formModel = bizdata;
                    this.par = bizdata;
                    this.sectFj = this.par['pmsXmRwFjListXmjw'][0];
                } else {
                    if (this.$route.params.row) {
                        this.par = JSON.parse(this.$route.params.row);
                        for (let i in this.formModel) {
                            this.formModel[i] = this.par[i];
                        }
                        this.formModel.oidXm = this.par.oid;
                        this.sectFj = this.par['pmsXmRwFjListXmjw'][0];
                    }
                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                // console.log(this.formModel,"formodel");
                // return false;
                return await this.$refs.definition.validate();
            },
            flowBizData() {
                // 传递数据整合
                // console.log(this.formModel)
                return this.formModel;
            },
            handleCallbackFlow() {

            },
            handleClick(e) {
                let index = e.index;
                this.sectFj = this.par.pmsXmRwFjListXmjw[index];
            },
        }
    }
</script>

<style lang="less" scoped>
    .currSelect {
        background: #07d196;
        color: #eee;
    }
    .mainContent {
        border: 1px solid #ddd;
        overflow: auto;
        padding: 0;
        margin-left: 5px;
        height: 300px;
    }
    .aside {
        .item {
            padding: 5px 10px;
            cursor: pointer;
        }
    }
</style>
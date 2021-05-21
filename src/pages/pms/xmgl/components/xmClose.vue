<template>
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
                        <el-input disabled  v-model="formModel.xmcodeSw" placeholder="自动生成"></el-input>
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
                        <ice-select disabled  v-model="formModel.dataSecretLevcode"
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
            <ATTACHMENT :data="flowData.pmsXmRwFjListXmjw" ref="enddata" :isHandleer=false></ATTACHMENT>
        </ice-grid-layout>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import ATTACHMENT from "../../common/ATTACHMENT";
    export default {
        name: "xmClose",
        components: {
            IceGridLayout,
            ATTACHMENT
        },
        props: {
            // 流程数据
            flowData: {
                default: ()=>{
                    return {}
                }
            },
        },
        data () {
            return {
                loading: false,
                formModel: {
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    xmcodeSw: '',
                    dataSecretLevcode: '2',
                    pmsXmRwFjListXmjw: [],
                    xmzt: ''
                },
                activeName: 'first',
                tabPosition: 'left',
                par: {},
                sectFj: {}
            }
        },
        watch: {
            flowData () {
                for(let i in this.formModel) {
                    this.formModel[i] = this.flowData[i];
                }
            }
        },
        created () {
            for(let i in this.formModel) {
                this.formModel[i] = this.flowData[i];
            }
        },
        methods: {

        }

    }
</script>

<style scoped>

</style>
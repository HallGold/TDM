<template>
    <div class="form-content">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div style="" slot-scope="flowScope">
                <el-form :model="formModel" ref="form">
                    <ice-grid-layout :columns="2" name="业务表单">
                        <el-row :gutter="24">
                            <el-col>
                                <el-form-item label="WBS编号" label-width="110px" prop="wbscode">
                                    <el-input v-model="formModel.wbscode" autocomplete="off" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="所属项目" label-width="110px" prop="xmname">
                                    <el-input v-model="formModel.xmname" autocomplete="off" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col>
                                <el-form-item label="任务名称" label-width="110px" prop="rwname">
                                    <el-input v-model="formModel.rwname" autocomplete="off" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" autocomplete="off" disabled></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="任务交付物">
                        <el-container>
                            <el-aside width="250px">
                                <div :class="{asideLeft: true, currSelect: active == index}" v-for="(cgyd, index) in cgydList" :key="index" :title="cgyd.cgmc" @click="getContent(cgyd, index)">{{cgyd.cgmc}}</div>
                            </el-aside>
                            <el-main class="mainContent">
                                <!--<div>显示附件内容，基于相关插件，暂先提供<span style="color: #3366ff; cursor: pointer" @click="download">下载</span>附件功能</div>-->
                                <accessory :row="row" :isHandleer=false></accessory>
                            </el-main>
                        </el-container> 
                    </ice-grid-layout>
                </el-form>
            </div>
            
        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue';
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import accessory from './components/accessory'

    export default {
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                tableData: [],
                cgydIds: this.$route.query.cgydIds,
                //附件下载ID
                dataid: '',
                active: 0,
                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    dataSecretLevcode: '2',

                },
                row: {}
            }
        },
        created () {

        },
        mounted() {
            // this.$nextTick(() => {
            //     this.querySingleWbsByOid()
            // })
        },
        //触发事件方法
        methods: {
            async querySingleWbsByOid() {
                await this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: this.$route.query.oid}})
                .then(result => {
                    this.$nextTick(_ => {   //事件循环
                        let {data} = result
                        console.log(data)
                        this.formModel = data;
                        this.formModel.oid = null;
                    })
                })
                .catch(error => {
                    this.$message.error("获取数据失败！")
                })
            },
            getContent(obj, index) {
                console.log(obj)
                this.active = index
                this.dataid = obj.dataid
                this.row = obj;
            },
            download() {
                this.$downloadFile(this.dataid);
            },
            flowReady(flowcont, bizdata) {
                console.log(bizdata, 'biz')
                let flowData = this.$refs.flowForm.flowInstData;

                if(flowData.proOperates != null){
                    // bizData = JSON.parse(flowData.currentBizData.bizData);
                    this.formModel = bizdata;

                    this.row = this.formModel.cgydList[0];
                } else {
                    this.formModel = this.sjdata;

                    this.row = this.sjdata.cgydList[0]
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                console.log('按钮操作事件')
                return true;
            },
            flowBizData() {
                console.log(this.formModel)
                return this.formModel;
            },
            callBackSuccess(data) {
                console.log(data)
            }
        },
        watch: {
        },
        computed: {
            sjdata() {
                // let cgydList = this.formModel.cgydList
                // if(!cgydList) return
                // console.log(cgydList)
                // let result = []
                // for(let i = 0; i < cgydList.length; i++) {
                //     if(i == 0) {
                //         this.dataid = cgydList[i].dataid
                //     }
                //     if(this.cgydIds.indexOf(cgydList[i].oid) !== -1) {
                //         result.push(cgydList[i])
                //     }
                // }
                // this.formModel.cgydList = result
                console.log(this.$route.params.data, 'this.$route.params.data')
                return this.$route.params.data?JSON.parse(this.$route.params.data):{}
            },
            cgydList () {
                return this.formModel.cgydList
            }
        },
        //这个是你引用插件生成的,不用管它
        components: {
            IceFlowForm,
            IceSelect, 
            IceGridLayout,
            accessory
        }
    }
</script>
<style lang="less" scoped>
    .asideLeft {
        border: 1px solid #ddd;
        padding: 5px 0 5px 5px;
        width: 240px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        cursor: pointer;
    }
    .currSelect {
        background: #eef4fe;
    }
    .mainContent {
        border: 1px solid #ddd;
        height: 600px;
        -ms-flex: 1;
        flex: 1;
        -ms-flex-preferred-size: auto;
        flex-basis: auto;
        overflow: auto;
        box-sizing: border-box;
        padding: 0px; 
    }
</style>

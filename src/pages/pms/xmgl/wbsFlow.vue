<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div slot-scope="flowScope" class="abb" style="height: 100%;">
                <div class="vxe-full-main">
                    <div class="vxe-full-container">
                        <vxe-table
                                :tree-config="treeConfig"
                                resizable
                                border="inner"
                                height="500px"
                                :align="allAlign"
                                :data="tableData"
                        >
                            <vxe-table-column field="dataPxh" title="序号" width="50"></vxe-table-column>
                            <vxe-table-column field="wbscode" title="WBS编号" width="80px" ></vxe-table-column>
                            <vxe-table-column field="rwzt" width="110px" title="任务状态"
                                              :cell-render="{name: 'mapTypeCode', mapTypeCode: 'RWZT'}">

                            </vxe-table-column>
                            <vxe-table-column field="rwname" title="任务内容" width="500px">

                            </vxe-table-column>
                            <vxe-table-column field="qzrw" title="前置任务" width="70px">

                            </vxe-table-column>
                            <!-- <vxe-table-column field="rwgq" title="工期" width="130px" :edit-render="{type: 'visible'}">
                                <template v-slot:edit="{ row }">
                                    <el-input-number v-model="row.rwgq" :disabled="row.rwzt=='RWZT40'" @change="rwgqChangeEvent({ row })"></el-input-number>
                                </template>
                            </vxe-table-column> -->
                            <vxe-table-column field="dateJhStar" title="开始日期" width="150px">
                                <template v-slot="{ row }">
                                    {{row.dateJhStar?moment(row.dateJhStar).format('YYYY-MM-DD'):''}}
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="dateJhEnd" title="完成日期" width="150px">
                                <template v-slot="{ row }">
                                    {{row.dateJhEnd?moment(row.dateJhEnd).format('YYYY-MM-DD'):''}}
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="rwlx" title="任务成果形式" width="150" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'RWLX'}">

                            </vxe-table-column>
                            <vxe-table-column field="jjcd" width="100px" title="紧急程度" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'JJCD'}">

                            </vxe-table-column>
                            <vxe-table-column field="rwdept" title="责任单位" width="100">

                            </vxe-table-column>
                            <vxe-table-column field="rwfzr" title="责任人" width="100">

                            </vxe-table-column>
                            <vxe-table-column field="dataSecretLevcode" title="密级" width="60" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}">

                            </vxe-table-column>
                            <vxe-table-column fixed="right" title="操作" width="100">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-button type="text" @click="handleLook(row)">查看</el-button>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                    </div>
                </div>


            </div>
        </ice-flow-form>
        <WbsEdit ref="wbsGrid"></WbsEdit>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import WbsEdit from "./wbsEdit";
    import moment from 'moment'

    export default {
        name: "wbsFlow",
        components: {
            IceFlowForm,
            WbsEdit
        },
        data() {
            return {
                allAlign: null,
                moment,
                tableData: [],
                treeConfig: {
                    // trigger: 'default',
                    // children: 'children',
                    // indent: '10',
                    // expandAll: true
                },
                change: false

            }
        },
        computed: {
            tableDataPar() {
                return this.$route.params.data ? JSON.parse(this.$route.params.data) : []
            },
            xmoid () {
                return this.$route.params.xmoid
            }
        },
        created() {

        },
        methods: {
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'biz')
                if (bizdata.oid) {
                    console.log(bizdata)
                    this.tableData = bizdata.updateEntity;
                    this.change = bizdata.change?true:false;
                } else {
                    this.tableData = this.tableDataPar;
                    this.change = this.$route.params.change?true:false;
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                // return this.$refs.xmform.getyzResult();
                return true
            },
            flowBizData() {
                // 传递数据整合
                // console.log(this.$refs.xmform.getData())
                // return
                //获取业务表单数据  formModel 传给控件处理
                // let data = this.$utils.filterTree(this.tableData, item => item, this.treeConfig)
                // let children = data.map((c) => {
                //     return {
                //         wbscode: c.wbscode,
                //         rwzt: c.rwzt,
                //         rwname: c.rwname,
                //         oid: c.oid
                //     }
                // })

                let obj = {
                    updateEntity: this.tableData,
                    change: this.change
                    // tabData: this.tableData
                }
                if (this.xmoid) {
                    obj.xmOid = this.xmoid
                }
                console.log(obj, 'obj')
                // return
                return obj

            },
            // 保存成功后的回调
            handleCallbackFlow(data) {


            },
            async handleLook(row) {
                // console.log(row)
                // // await this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: row.oid}})
                // //     .then(result => {
                // //         this.wbsData = result.data;
                // //     })
                this.$refs.wbsGrid.getPeripheralParams("详情", row)
            }
        }
    }
</script>

<style lang="less" scoped>
    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;
        .vxe-full-container {
            position: absolute;
            top: 0px;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>

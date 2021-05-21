<template>
    <div v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="psc in pscs" :label="psc.jhpc" :name="psc.jhpc">
                <el-row>
                    <table class="abbb">
                        <tr>
                            <td>数量：{{psc.jhsl}}</td>
                            <td>齐套时间：{{psc.jhdateQt ? psc.jhdateQt.substring(0,10) : ''}}</td>
                            <td>交付时间：{{psc.jhdateJf ? psc.jhdateJf.substring(0,10) : ''}}</td>
                            <td v-if="isFlowShow" style="display: flex;">
                                <span>完成进度：</span>
                                <div style="width: 250px;">
                                    <el-progress :text-inside="true" :stroke-width="20"
                                                 :percentage="psc.schedule" :color="statusAgrument(psc.jhdateJf)"></el-progress>
                                </div>
                            </td>
                            <td v-if="isFlowShow" >
                                <div style="display: flex;">
                                    <span>工时进度：</span>
                                    <div style="width: 250px;">
                                        <el-progress :text-inside="true" :stroke-width="20"
                                                     :percentage="psc.workingHoursSchedule" :color="statusAgrument(psc.workingHoursSchedule)"></el-progress>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </el-row>
            </el-tab-pane>
            <vxe-table border resizable
                       size="small"
                       ref="vxeTable"
                       :expand-config="{expandAll: true}"
                       :data="vxetableData">
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="expand" width="60">
                    <template v-slot="{ row, rowIndex }">
                        <div style="margin-left: 40px;">
                            <vxe-table border resizable
                                       size="small"
                                       @toggle-row-expand="handleExpand"
                                       :data="row.gylx.gxes">
                                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                                <vxe-table-column type="expand" width="60" v-if="isFlowShow">
                                    <template v-slot="{ row, rowIndex }">
                                        <div style="margin-left: 40px;">
                                            <vxe-table border resizable
                                                       size="small"
                                                       :data="row.Feedbacks">
                                                <vxe-table-column field="feedback" title="反馈" width="300"></vxe-table-column>
                                                <vxe-table-column field="feedbackUsername" title="反馈人"></vxe-table-column>
                                                <vxe-table-column field="feedbackDate" title="反馈时间"></vxe-table-column>
                                                <vxe-table-column field="handleContent" title="处理"
                                                                  width="300"></vxe-table-column>
                                                <vxe-table-column field="handlerUsername" title="处理人"></vxe-table-column>
                                                <vxe-table-column field="handleDate" title="处理时间"></vxe-table-column>
                                                <vxe-table-column title="操作" width="60">
                                                    <template v-slot="{ row, rowIndex }">
                                                        <template>
                                                            <el-link v-if="row.feedback" type="primary" :underline="false"
                                                                     @click="handler(row)">
                                                                处理
                                                            </el-link>
                                                        </template>
                                                    </template>
                                                </vxe-table-column>
                                            </vxe-table>
                                        </div>

                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="gxCode" title="工序编码" width="100"></vxe-table-column>
                                <vxe-table-column field="gxName" title="工序名称" width="100"></vxe-table-column>
                                <vxe-table-column field="gxdept" title="承制单位" width="100"></vxe-table-column>
                                <vxe-table-column field="startTime" title="开始时间" width="120">
                                    <template v-slot="{ row, rowIndex }">
                                        {{moment(row.startTime).format('YYYY-MM-DD')}}
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="endTime" title="结束时间" width="120">
                                    <template v-slot="{ row, rowIndex }">
                                        {{moment(row.endTime).format('YYYY-MM-DD')}}
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="jhsl" title="计划数量" width="100"></vxe-table-column>
                                <vxe-table-column field="wcsl" title="完成数量" width="100"></vxe-table-column>
                                <vxe-table-column field="workHour" title="工时" width="100"></vxe-table-column>
                                <vxe-table-column field="gxzt" title="工序状态"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'PLAN_STATUS'}"
                                                  width="100"></vxe-table-column>
                                <vxe-table-column field="sfsjjd" title="是否首件鉴定"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'FIRST_IDENTIFIED'}"
                                                  width="100"></vxe-table-column>
                                <vxe-table-column field="sfsjcqjc" title="是否所级产前检查"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'ANTENATAL_PREPARATION'}"
                                                  width="100"></vxe-table-column>
                                <vxe-table-column field="schedule" title="生产进度" v-if="isFlowShow" width="150">
                                    <template v-slot="{ row, rowIndex }">
                                        <el-progress :percentage="(row.wcsl&&row.jhsl?((row.wcsl / row.jhsl) > 1 ? 1 : (row.wcsl /
                                    row.jhsl)):0).toFixed(4)*100" :color="statusAgrument(row.endTime)"></el-progress>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </div>

                    </template>
                </vxe-table-column>
                <vxe-table-column field="cpCode" title="产品编码"></vxe-table-column>
                <vxe-table-column field="cpName" title="产品名称"></vxe-table-column>
                <vxe-table-column field="gylx" title="工艺路线">
                    <template v-slot="{row}">
                        {{row.gylx.gylxname}}
                    </template>
                </vxe-table-column>
                <vxe-table-column field="cpjfsl" title="生产计划数量" width="80"></vxe-table-column>
<!--                <vxe-table-column field="cpbjsl" title="备件数量" width="80"></vxe-table-column>-->
                <vxe-table-column field="cpscsl" title="完工数量" width="80"></vxe-table-column>

                <vxe-table-column field="kcsl" title="库存"></vxe-table-column>
                <vxe-table-column field="cpzrdw" title="责任单位"></vxe-table-column>
                <vxe-table-column field="cpzrr" title="责任人"></vxe-table-column>
                <vxe-table-column field="jhdateStart" title="开始时间">
                    <template v-slot="{ row, rowIndex }">
                        {{moment(row.jhdateStart).format('YYYY-MM-DD')}}
                    </template>
                </vxe-table-column>
                <vxe-table-column field="jhdateEnd" title="结束时间">
                    <template v-slot="{ row, rowIndex }">
                        {{moment(row.jhdateEnd).format('YYYY-MM-DD')}}
                    </template>
                </vxe-table-column>
                <vxe-table-column field="schedule" title="完成进度" v-if="isFlowShow" width="150">
                    <template v-slot="{ row, rowIndex }">
                        <!--{{(row.cpscsl / (row.cpjfsl + row.cpbjsl) > 1 ? 1 : row.cpscsl / (row.cpjfsl + row.cpbjsl)).toFixed(2) * 100}}%-->
                        <el-progress :percentage="row.cpjfsl==0?0:((row.cpscsl / row.cpjfsl > 1 ? 1 : row.cpscsl /
                        row.cpjfsl)).toFixed(4)*100"
                                     :color="statusAgrument(row.jhdateEnd)"></el-progress>
                    </template>
                </vxe-table-column>
                <vxe-table-column title="操作">
                    <template v-slot="{ row, rowIndex }">
                        <template>
                            <el-link type="primary" :underline="false" @click="showDoc(row)">图纸</el-link>
                        </template>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </el-tabs>
        <ice-dialog title="图纸" :visible.sync="visibleDoc" width="800px">
            <div class="ice-container">
                <vxe-table border show-overflow
                           :auto-resize=true
                           ref="docTable"
                           :height="300"
                           :data="tableData"
                           width="100%">
                    <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
                    <vxe-table-column field="docname" title="图纸名称"></vxe-table-column>
                    <vxe-table-column field="doccode" title="图纸编号"></vxe-table-column>
                    <vxe-table-column field="docver" title="图纸版本"></vxe-table-column>
                    <vxe-table-column title="操作">
                        <template v-slot="{ row, rowIndex }">
                            <template>
<!--                                <el-button type="text" @click="downloadFile(row)">下载</el-button>-->
                                <el-button type="text" @click="lookFile(row)">查看</el-button>
                            </template>
                        </template>
                    </vxe-table-column>
                </vxe-table>
                <el-footer>
                    <div class="ice-button-bar">
                        <el-button type="info" @click="visibleDoc=false">关闭</el-button>
                    </div>
                </el-footer>
            </div>
        </ice-dialog>
        <ice-dialog title="反馈处理" :visible.sync="visibleFeedBack" width="800px">
            <div class="ice-container">
                <el-form ref="form" style="margin: 0 20px" :loading="loading">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="处理信息：" label-width="140px" prop="handlerContent">
                                <el-input v-model="handleContent" type="textarea"
                                          placeholder="不超过650个字" maxlength="650"
                                          show-word-limit
                                          :rows="6"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-footer>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="commitContent">确认</el-button>
                        <el-button type="info" @click="visibleFeedBack=false">关闭</el-button>
                    </div>
                </el-footer>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import IceDialog from "../../../components/common/base/IceDialog";
    import docConstants from '../../../utils/docConstants'

    export default {
        name: "SCJH_ITEM",
        mixins: [docConstants],
        components: {IceDialog},
        data() {
            return {
                activeName: 'first',
                pscs: [],
                moment: moment,
                visibleDoc: false,
                loading: false,
                visibleFeedBack: false,
                handleContent: '',
                gxid: '',
                readonly: false,
                tableData: [],
                vxetableData: [],
                rowFk: {}
            }
        },

        methods: {
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            statusAgrument (end) {
                let now = (new Date()).getTime();
                return moment(end).valueOf() > now ? '#409eff' : '#f30213'
            },
            handleExpand({row, rowIndex}) {
                console.log(row, 'row')
                if (!row.Feedbacks) {
                    this.getFeedback(row);
                }
            },
            // 获取反馈
            getFeedback(row) {
                this.$axios.get("/pms/PmsCpkFeedback/listByOidGx", {params: {oidGx: row.oid}})
                    .then(result => {
                        this.$set(row, 'Feedbacks', result.data)
                    })
                    .catch(error => {
                        this.$message.error("获取失败")
                    })
                    .finally(_ => {

                    })
            },
            showDoc(row) {
                this.visibleDoc = true;
                this.$axios.get("/pms/PmsViewDocList/getByIds", {params: {ids: row.docIds}})
                    .then(result => {
                        this.tableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询产品图纸失败")
                    })
                    .finally(_ => {

                    })
            },

            handler(row) {
                this.gxid = '';
                this.handleContent = '';
                this.handleContent = row.handleContent;
                this.gxid = row.oid;
                this.visibleFeedBack = true;
                this.rowFk = row;
            },
            commitContent() {
                this.loading = true;
                this.$axios.post('/pms/PmsCpkGx/handle', {id: this.gxid, handleContent: this.handleContent})
                    .then(reault => {
                        this.$message.success("处理成功！")
                        this.visibleFeedBack = false;
                        // 操作的当前工序数据
                        let currentGx = {};
                        // 找个
                        this.vxetableData.forEach(c => {
                            let item = c.gylx.gxes.find(g => {
                                return g.oid == this.rowFk.oidGx;
                            })
                            if (item) {
                                currentGx = item;
                            }
                        })
                        this.getFeedback(currentGx);
                    })
                    .catch(error => {
                        this.$message.error('处理失败');
                    })
                    .finally(_ => {
                        this.loading = false;
                    });
            },
            getDetail() {
                this.loading = true;
                this.$axios.get("/pms/PmsScJh/detail", {params: {id: this.oidScjh}})
                    .then(result => {
                        this.pscs = result.data.pscs;
                        this.activeName = this.pscs[0].jhpc;
                        this.vxetableData = this.pscs[0].psccps;
                        this.loading = false;
                    })
                    .catch(error => {
                        this.$message.error("查询生产计划详情失败")
                    })
                    .finally(_ => {

                    })
            },
            // 赋值
            assignment() {
                if (this.jhData && this.jhData.pscs) {
                    this.pscs = this.jhData.pscs;
                    this.activeName = this.pscs[0].jhpc ? this.pscs[0].jhpc : '';
                    this.vxetableData = this.pscs[0].psccps;
                }
            },
            handleClick(a) {
                let index = a.index;
                this.vxetableData = this.pscs[index].psccps;
                this.resize();
            },
            // 表格重新计算
            resize() {
                this.$nextTick(() => {
                    this.$refs.vxeTable.recalculate();
                })
            },
        },
        created() {
            console.log('00', this.jhData)
            if (this.oidScjh) {
                this.getDetail();
            } else {
                this.assignment();
            }

        },
        watch: {
            oidScjh() {
                this.getDetail();
            },
            jhData() {
                console.log('11', this.jhData)
                this.assignment();

            }
        },
        props: {
            oidScjh: String,
            jhData: Object,
            isFlowShow: {
                default: true
            }
        },
    }
</script>

<style lang="less" scoped>
    .abbb {
        td {
            padding-right: 30px;
        }
    }
</style>

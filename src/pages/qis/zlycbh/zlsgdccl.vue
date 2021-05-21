<template>
    <div class="ice-container">
        <div class="buttons">
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-button type="primary" @click="initiationProcess"><i class="el-icon-plus"></i>新增</el-button>
                    <el-button type="primary" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>
                </el-col>
                <el-col :span="8">
                    <search-input :query="query" @search = "search"></search-input>
                </el-col>
            </el-row>
        </div>
        <div style="height: 100%">
            <vxe-table border resizable
                       width="100%"
                       height="92%"
                       size="small"
                       @toggle-row-expand="getBhgp"
                       :data="tableData">
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="expand" width="60">
                    <template v-slot="{ row, rowIndex }">
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <vxe-table border resizable
                                           size="small"
                                           ref="child"
                                           :data="row.childData">
                                    <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                                    <vxe-table-column field="scjhName" title="所属计划"></vxe-table-column>
                                    <vxe-table-column field="jhzc" title="所属组次"></vxe-table-column>
                                    <vxe-table-column field="cpScCode" title="生产序号"></vxe-table-column>
                                    <vxe-table-column field="gxCode" title="工序编号"></vxe-table-column>
                                    <vxe-table-column field="scDate" title="生产日期">
                                        <template v-slot="{ row, rowIndex }">
                                            {{dateFormatter(row.scDate)}}
                                        </template>
                                    </vxe-table-column>
                                    <vxe-table-column field="fxdd" title="发现地点"></vxe-table-column>
                                    <vxe-table-column field="fxPerson" title="发现人"></vxe-table-column>
                                    <vxe-table-column field="fxDate" title="发现时间">
                                        <template v-slot="{ row, rowIndex }">
                                            {{dateFormatter(row.fxDate)}}
                                        </template>
                                    </vxe-table-column>
                                </vxe-table>
                            </el-col>
                            <el-col :span="8">
                                <el-tabs :tab-position="tabPosition" style="height: 200px;">
                                    <el-tab-pane label="事故描述">{{row.situation}}</el-tab-pane>
                                    <el-tab-pane label="处理意见">{{matching(row.options)}}</el-tab-pane>
                                    <el-tab-pane label="责任认定">{{row.duty}}</el-tab-pane>
                                </el-tabs>
                            </el-col>
                        </el-row>

                    </template>
                </vxe-table-column>
                <vxe-table-column field="sgCode" title="质量事故调查单编号" width="160px"></vxe-table-column>
                <vxe-table-column field="sgName" title="事故名称"></vxe-table-column>
                <vxe-table-column field="sgType" title="事故类别" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'ZLSGDCCL_SGLB'}"></vxe-table-column>
                <vxe-table-column field="zrdwcode" title="责任单位" :cell-render="{name: 'mapTypeCode', cusMapTypeCode: 'DEPT'}"></vxe-table-column>
                <vxe-table-column field="zrr" title="责任人"></vxe-table-column>
                <vxe-table-column field="filledBy" title="填报人"></vxe-table-column>
                <vxe-table-column field="createDate" title="填报时间">
                    <template v-slot="{ row, rowIndex }">
                        {{dateFormatter(row.createDate)}}
                    </template>
                </vxe-table-column>
                <vxe-table-column field="dataSecretLevcode" title="密级" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>
                <vxe-table-column field="sbzt" title="上报状态" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SBZT'}"></vxe-table-column>
                <vxe-table-column field="spzt" title="审批状态" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SPZT'}"></vxe-table-column>
                <vxe-table-column title="操作">
                    <template v-slot="{ row, rowIndex }">
                        <template>
                            <el-link type="primary" :underline="false" @click="fj(row)"><span style="margin-right:5px;">附件</span></el-link>
                            <el-link v-if="row.spzt === SPZT.WSP" type="primary" :underline="false" @click="edit(row, rowIndex)"><span style="margin-right:5px;">编辑</span></el-link>
                            <el-link v-else type="primary" :underline="false" @click="showDetail(row)">查看</el-link>
                        </template>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <vxe-pager
                    :loading="loading"
                    :current-page="tablePage.current"
                    :page-size="tablePage.size"
                    :total="tablePage.total"
                    :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                    @page-change="data=>{handlePageChange(data[0])}">
            </vxe-pager>
        </div>
        <sgdc-detail ref="detail" :to-flow="see"></sgdc-detail>

    </div>
</template>

<script>
    import IcePagination from '@/components/common/base/IcePagination.vue'
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDrawer from "../../../components/common/base/IceDrawer";
    import IceDialog from "../../../components/common/base/IceDialog";
    import bhgpSelector from "./bhgp";
    import moment from 'moment';
    import searchInput from "./searchInput";
    import {SBZT, SPZT} from "../../../utils/constant";
    import sgdcDetail from './details/sgdcDetail'


    export default {
        name: "zlsgdccl",
        components: {
            IcePagination,
            IceDatePicker,
            IceDrawer,
            IceDialog,
            bhgpSelector,
            moment,
            searchInput,
            sgdcDetail
        },
        computed:{
            staticQuerys() {
                let arr = this.query.filter(item => item.type == "static")
                return arr.map(c => {
                    return {
                        column: c.code,
                        exp: c.exp,
                        value: typeof c.value == "function" ? c.value() : c.value
                    }
                });
            },
        },
        created() {
            this.refresh()
        },
        data() {
            return {SPZT,
                tabPosition: 'left',
                fileInfo: {},
                visibleBhgp: false,
                visibleBhgpcl: false,
                visibleBhgpcl2: false,
                disabled: true,
                bhgpSelectedItems: [],
                loading: false,
                currentRow: {},
                tableData: [],
                cp: {},
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    columns: [
                        'oid',
                        'bhgp',//不合格品
                        'sgCode',//事故编号
                        'sgName',//事故名称
                        'sgType',//事故类别
                        'sgly',//事故来源
                        'sglyId',//事故来源关联ID
                        'zrdw',//责任单位
                        'zrdwcode',//责任单位编码
                        'zrr',//责任人
                        'zrrcode',//责任人编码
                        'createUser',//填报人
                        'createDate',//填报时间
                        'dataSecretLevcode',//密级
                        'situation',//事故描述
                        'options',//处理意见
                        'duty',//责任认定结论
                        'dataid',//附件数据ID
                        'filename',//附件名称
                        'qisCpBhgOidList',//不合格品oid
                        'sbzt',//上报状态
                        'spzt',//审批状态
                        'businessDataId',//BPM_PRO_BIZ_DATA.BIZ_DATA_ID
                        'actInstId',//流程实例ID
                        'filledBy'
                    ],
                    conditions:[],
                    conditionLink:'OR',
                },
                query: [
                    {type: 'input', column: 'sgCode', label: '事故编号', exp: 'like', value: ''},
                    {type: 'input', column: 'sgName', label: '事故名称', exp: 'like', value: ''},
                    {type: 'input', column: 'zrdw', label: '责任单位', exp: 'like', value: ''},
                    {type: 'input', column: 'zrr', label: '责任人', exp: 'like', value: ''},
                    {type: 'input', code: 'zrr', label: '填报人', exp: 'like', value: ''},
                    {type: 'date', code: 'zrr', label: '填报时间', exp: 'like', value: ''},
                    {type: 'select', code: 'dataSecretLevcode', label: '项目密级', value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                rules: {
                    // cpth: [
                    //     {required: true, message: '产品图号不能为空'}
                    // ],
                },
                formModel: {},

                sectCp: []
            }
        },
        methods: {
            refresh() {
                this.loading = true
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/QisZlsg/list", {params: this.tablePage}).then(result => {
                    // console.log(result)
                    this.tableData = result.data.records;
                    this.tablePage.total = result.data.total;
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            initiationProcess(){
                this.$router.push("/qis/zlycbh/zlsgdccl_flow")
            },
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage
                this.tablePage.size = pageSize
                this.refresh()
            },
            async getBhgp({row, rowIndex}) {
                this.currentRow = row;
                if (row.childData != undefined) return;
                // this.$axios.get("/pms/QisCpBhg/list",{params: {
                await this.$axios.get("/pms/QisCpBhg/listByOidSg", {
                    params: {
                        oidsg: row.oid,
                        current: 1,
                        size: 100,
                        conditionLink: 'AND',
                        columns: ['oid','scjhName', 'jhzc', 'cpScCode', 'gxCode', 'scDate', 'fxdd', 'fxPerson', 'fxDate', 'oidCp', 'cpCode', 'cpName'],
                        // staticConditions:[{column:'oidBhg',exp:'=',value:row.oid}],
                    }
                }).then(result => {
                    row.childData = result.data.records;
                    this.$set(this.tableData, rowIndex, row);
                    this.$refs.child.refresh();
                }).catch(error => {

                })
            },
            fj(row) {
                if (row.dataid) {
                    this.$downloadFile(row.dataid);
                } else {
                    this.$message.warning("没有附件！");
                }
            },
            edit(row, rowIndex) {
                this.$router.push("/qis/zlycbh/zlsgdccl_flow?dataId=" + row.oid)
            },
            see(row, rowIndex) {
                var dataId = row.businessDataId ? row.businessDataId : row.oid;
                this.$router.push("/qis/zlycbh/zlsgdccl_flow?oid=" + row.oid + "&dataId=" + dataId)
            },
            // 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            del(row) {

            },
            matching(option){
                var newOption = '';
                switch(option){
                    case "ZLSGDCCL_OPTION0":
                        newOption = '组织事故调查';
                        break;
                    case "ZLSGDCCL_OPTION1":
                        newOption = '以质量问题归零';
                        break;
                    default:
                }
                return newOption;
            },
            dateFormatter(cellValue){
                if(cellValue == undefined){return ''};
                return moment(cellValue).format('YYYY-MM-DD');
            },
            search(data){
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
        },
        watch: {
            $route(New, old) {
                if(New.path === '/qis/zlycbh/zlsgdccl' && old.path === '/qis/zlycbh/zlsgdccl_flow'){
                    this.refresh();
                }
            }
        },
        props: [],
    }
</script>

<style scoped>
    .pagination {
        float: right;
        flex-shrink: 0;
    }
</style>
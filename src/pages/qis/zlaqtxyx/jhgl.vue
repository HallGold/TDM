<template>
    <div class="ice-container">
        <div class="buttons" style="padding: 0 20px;">
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-button type="primary" @click="initiationProcess"><i class="el-icon-plus"></i>新增</el-button>
                    <el-button type="primary" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>
                </el-col>
                <el-col :span="8">
                    <search-input :query="query" @search="search"></search-input>
                </el-col>
            </el-row>
        </div>
        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <vxe-table border resizable
                           width="100%"
                           height="100%"
                           size="small"
                           :expand-config="{accordion: true}"
                           @toggle-row-expand="getJhDepRel"
                           :data="tableData">
                    <vxe-table-column type="expand" title="计划执行">
                        <template v-slot="{ row, rowIndex }">
                            <div style="width: 80%;">
                                <vxe-table border resizable
                                           size="small"
                                           v-loading="cloading"
                                           auto-resize
                                           ref="child"
                                           :data="row.childData">
                                    <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                                    <vxe-table-column field="depCode" title="执行部门"
                                                      :cell-render="{name: 'mapTypeCode', cusMapTypeCode: 'DEPT'}"></vxe-table-column>
                                    <vxe-table-column field="zrr" title="部门负责人" width="100"></vxe-table-column>
                                    <vxe-table-column field="jhStatus" title="分配 " width="100">
                                        <template v-slot="{ row, rowIndex }">
                                            <el-button type="text" @click="allocation(row)" :disabled="isDisabledFun(row)">
                                                分配
                                            </el-button>
                                        </template>
                                    </vxe-table-column>
                                    <vxe-table-column field="executor" title="任务执行人">

                                    </vxe-table-column>
                                    <vxe-table-column field="stage" title="执行阶段"
                                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'QIS_ZLJHBM_STATUS'}"
                                                      width="100"></vxe-table-column>
                                    <vxe-table-column field="wj" title="详情" width="100">
                                        <template v-slot="{ row, rowIndex }">
                                            <el-button type="text" @click="lookDetail(row)"
                                                       :disabled="noRelevance.indexOf(currentRow.jhType)!=-1?true:false">详情
                                            </el-button>

                                        </template>
                                    </vxe-table-column>
                                    <vxe-table-column field="wj" title="操作" width="250" fixed="right">
                                        <template v-slot="{ row, rowIndex }">
                                            <el-button v-if="row.stage=='ZXZT03'" type="text" @click="execute(row)"
                                                       :disabled="noRelevance.indexOf(currentRow.jhType)!=-1||row.executorCode!=$userInfo.userCode">执行
                                            </el-button>
                                            <!--<el-button type="text" @click="toOption(row, 1)">征求建议</el-button>-->
                                            <!--<el-button type="text" @click="toOption(row)">评审意见</el-button>-->
                                            <el-button type="text" @click="toIns(row)">检查和评价</el-button>
                                        </template>
                                    </vxe-table-column>
                                </vxe-table>
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="jhCode" title="计划编号"></vxe-table-column>
                    <vxe-table-column field="jhName" title="计划名称"></vxe-table-column>
                    <vxe-table-column field="jhType" title="计划类型"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'QIS_ZLJH_TYPE'}"
                                      width="200"></vxe-table-column>
                    <vxe-table-column field="jhStatus" title="计划状态"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'QIS_JHGL_JHZT'}"></vxe-table-column>

                    <vxe-table-column field="startDate" title="计划开始日期"></vxe-table-column>
                    <vxe-table-column field="endDate" title="计划完成日期"></vxe-table-column>
                    <vxe-table-column field="jhRemark" title="编制要求"></vxe-table-column>
                    <vxe-table-column field="dataSecretLevcode" title="密级"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>

                    <vxe-table-column field="sbzt" title="上报状态"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SBZT'}"></vxe-table-column>
                    <vxe-table-column field="spzt" title="审批状态"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SPZT'}"></vxe-table-column>
                    <vxe-table-column title="操作" width="200">
                        <template v-slot="{ row, rowIndex }">
                            <template>
                                <el-link type="primary" :underline="false" @click="fj(row)"><span style="margin-right:5px;">附件</span>
                                </el-link>
                                <el-link v-if="row.spzt === 'SPZT10'" type="primary" :underline="false"
                                         @click="edit(row, rowIndex)"><span style="margin-right:5px;">编辑</span></el-link>
                                <el-link v-if="row.spzt === 'SPZT10'" type="primary" :underline="false" @click="del(row)">
                                    删除
                                </el-link>
                                <el-link v-else type="primary" :underline="false" @click="showDetail(row)"><span
                                        style="margin-right:5px;">详情</span></el-link>
                            </template>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
        </div>
        <vxe-pager
                :loading="loading"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChange(data[0])}">
        </vxe-pager>

        <ice-dialog title="查看附件" :visible.sync="fjVisible" width="1000px">
            <el-row>
                <ATTACHMENT :is-handleer=false :data="attaTableData" ref="attachment"></ATTACHMENT>
            </el-row>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="info" @click="fjVisible=false">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>
        <!--分配-->
        <PmsSelectPerson
                :checkedCodes="checkedCodes"
                chooseItem="multiple"
                disCode="deptCode"
                :parDeptCode="parDeptCode"
                ref="pmsSelectPerson"
                @select-emit="selectEmit"></PmsSelectPerson>
        <jh-detail ref="detail" :to-flow="see"></jh-detail>
    </div>
</template>

<script>
    import IcePagination from '@/components/common/base/IcePagination.vue'
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDrawer from "../../../components/common/base/IceDrawer";
    import IceDialog from "../../../components/common/base/IceDialog";
    import moment from 'moment';
    import searchInput from "../zlycbh/searchInput";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import PmsSelectPerson from "../../../components/common/pms/PmsSelectPerson";
    import jhDetail from './jhDetail'

    export default {
        name: "jhgl",
        components: {
            IcePagination,
            IceDatePicker,
            IceDrawer,
            IceDialog,
            moment,
            searchInput,
            ATTACHMENT,
            PmsSelectPerson,
            jhDetail
        },
        computed: {
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
            checkedCodes() {
                return []
            },
        },
        created() {
            this.refresh();
        },
        data() {
            return {
                parDeptCode: '9003',
                fjVisible: false,
                attaTableData: [],
                tabPosition: 'left',
                bhgpSelectedItems: [],
                loading: false,
                currentRow: {},
                tableData: [],
                cp: {},
                planTypeMap: {
                    'WJZXDJH': '文件制修订计划',
                    'GLPSJH': '管理评审计划',
                    'NBSHJH': '内部审核计划',
                    'GKGTJH': '顾客沟通计划',
                    'BFHXJZJH': '不符合项纠正计划',
                    'CXGJJH': '持续改进计划',
                    'JDJCJH': '监督检查计划',
                    'GCJSYCLJH': '过程监视与测量计划',
                    'ZLPXJH': '质量培训计划',
                    'ZLHDJH': '质量活动计划',
                },
                planStatusMap: {'WKS': '未开始', 'JXZ': '进行中', 'YWC': '已完成',},
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    columns: [
                        'oid',
                        'deptNames',//责任单位
                        'jhCode',//计划编号
                        'jhName',//计划名称
                        'jhType',//计划类型
                        'jhStatus',//计划状态
                        'jhRemark',//编制要求
                        'dataSecretLevcode',//密级
                        'sbzt',//上报状态
                        'spzt',//审批状态
                        'businessDataId',//BPM_PRO_BIZ_DATA.BIZ_DATA_ID
                        'actInstId',//流程实例ID
                        'startDate',
                        'endDate',
                    ],
                    conditions: [],
                    conditionLink: 'OR',
                },
                query: [
                    {type: 'input', code: 'jhCode', label: '计划编号', exp: 'like', value: ''},
                    {type: 'input', code: 'jhName', label: '计划名称', exp: 'like', value: ''},
                    {
                        type: 'select',
                        code: 'jhType',
                        label: '计划类型',
                        exp: 'like',
                        value: '',
                        mapTypeCode: "QIS_ZLJH_TYPE"
                    },
                    {
                        type: 'select',
                        code: 'jhStatus',
                        label: '计划状态',
                        exp: 'like',
                        value: '',
                        mapTypeCode: "QIS_JHGL_JHZT"
                    },
                    {type: 'input', code: 'jhRemark', label: '编制要求', exp: 'like', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                rules: {
                    // cpth: [
                    //     {required: true, message: '产品图号不能为空'}
                    // ],
                },
                formModel: {},

                sectCp: [],
                childrenRow: {},
                cloading: false,
                // 根据计划类型跳转
                jumpUrl: {
                    // 文件编制修订计划
                    "ZLJH01": {
                        type: 'OID_WJGL',
                        api: '/qis/wjgl/addFile'
                    },
                    // 管理评审计划
                    "ZLJH02": {
                        type: 'OID_GLPS',
                        api: '/qis/wjgl/addFile'
                    },
                    // 内部审核计划
                    "ZLJH03": {
                        type: null,
                        api: '/qis/zlaqtxyx/nsgl'
                    },
                    // 顾客沟通计划
                    "ZLJH04": {
                        type: null,
                        api: '/qis/zlaqtxyx/mydgl'
                    },
                    // （质量工作）持续改进计划
                    "ZLJH06": {
                        type: null,
                        api: '/qis/zlaqtxyx/bfhx'
                    },
                    // 日常监督
                    "ZLJH07": {
                        type: null,
                        api: '/qis/zlaqjdfx/rczxjd'
                    },
                    // 过程监视测量管理
                    "ZLJH08": {
                        type: null,
                        api: '/qis/zlaqtxyx/gcjs'
                    },
                    // qc小组活动
                    "ZLJH10": {
                        type: null,
                        api: '/qis/zlaqzcyw/qcxzhdhz_flow'
                    },
                },
                jumpDetailUrl: {
                    "ZLJH01": "/qis/wjgl/wjgl",
                    "ZLJH02": "/qis/wjgl/glps",
                    "ZLJH03": "/qis/zlaqtxyx/nsgl",
                    "ZLJH04": "/qis/zlaqtxyx/mydgl",
                    "ZLJH06": "/qis/zlaqtxyx/bfhx",
                    "ZLJH07": "/qis/zlaqjdfx/rczxjd",
                    "ZLJH08": "/qis/zlaqtxyx/gcjs",
                    "ZLJH10": "/qis/zlaqzcyw/qcxzhdhz",
                },
                // 无关联页面数据
                noRelevance: ['ZLJH05', 'ZLJH09']
            }
        },
        methods: {
            // 查看
            showDetail(row) {
                this.$refs.detail.getDetail(row.oid)
            },
            isDisabledFun(row) {
                if (this.noRelevance.indexOf(this.currentRow.jhType) != -1) {
                    return true;
                }
                return this.$userInfo.userCode == row.zrrCode ? false : true;
            },
            // 查看详情
            lookDetail(row) {
                console.log(row, 'row')
                let url = this.jumpDetailUrl[this.currentRow.jhType];
                let obj = {
                    oid: row.jhOid,
                    jhCode: row.jhCode,
                    depCode: row.depCode,
                    depName: row.depName,
                    depOid: row.oid,
                    isDetail: true
                };
                console.log(obj, 'obj')
                this.$router.push({
                    name: url, query: {
                        jhdata: JSON.stringify(obj)
                    }
                })

            },
            // 进入意见和范围
            toOption(row, type) {
                if (type == 1) {
                    this.$router.push('/qis/zlaqtxyx/suggest?oid=' + row.oid)
                } else {
                    this.$router.push('/qis/zlaqtxyx/commentAndSug?oid=' + row.oid)
                }
            },
            // 进入执行页面
            execute(row) {
                let o = this.jumpUrl[this.currentRow.jhType];
                let obj = {
                    oid: row.jhOid,
                    jhCode: row.jhCode,
                    depCode: row.depCode,
                    depName: row.depName,
                    depOid: row.oid,
                    type: o.type,
                    dataSecretLevcode: row.dataSecretLevcode
                };
                this.$router.push({
                    name: o.api, query: {
                        jhdata: JSON.stringify(obj)
                    }
                })
            },
            // toINS
            toIns(row) {
                this.$router.push('/qis/zlaqtxyx/inspectionAndEvaluation?oid=' + row.oid)
            },
            // 分配
            allocation(row) {
                this.parDeptCode = row.depCode;
                this.$refs.pmsSelectPerson.visible = true;

                this.childrenRow = row;
            },
            // 选中回调
            selectEmit(data) {
                let arr = data.map(c => {
                    return {
                        userCode: c.code,
                        userName: c.name,
                        dataSecretLevcode: this.childrenRow.dataSecretLevcode
                    }
                })
                this.allocationSave(arr);
            },
            // 分配保存
            allocationSave(data) {
                let childrenRow = JSON.parse(JSON.stringify(this.childrenRow))
                if (data.length <= 0) {
                    return;
                }
                if (data.length == 1) {
                    childrenRow.executorCode = data[0].userCode;
                    childrenRow.executor = data[0].userName;
                } else {
                    childrenRow.userInformationVoList = data;
                }
                this.cloading = true;
                this.$axios.post("/pms/QisJhDepRel/distribution", childrenRow).then(result => {
                    // console.log(result)
                    this.$message.success("分配成功");
                    this.getList(childrenRow.jhOid)
                }).catch(e => {
                    if (!e.success) {
                        this.$message.error("部门执行状态是未下发的才能分配！");
                    } else {
                        this.$message.error("分配失败！");
                    }
                }).finally(() => {
                    this.cloading = false;
                    this.loading = false;
                })
            },
            refresh() {
                console.log(this.tablePage);
                this.loading = true;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/QisJhgl/list", {params: this.tablePage}).then(result => {
                    // console.log(result)
                    this.tableData = result.data.records;
                    this.tablePage.total = result.data.total;
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            initiationProcess() {
                this.$router.push("/qis/zlaqtxyx/jhgl_flow")
            },
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage
                this.tablePage.size = pageSize
                this.refresh()
            },
            async getJhDepRel({row, rowIndex}) {
                this.currentRow = row;
                if (row.childData != undefined) return;
                await this.getList(row.oid);
            },
            getList(jhOid) {
                this.$axios.get("/pms/QisJhDepRel/list", {
                    params: {
                        current: 1,
                        size: 100,
                        conditionLink: 'AND',
                        columns: ['oid', 'depCode', 'depName', 'jhStatus', "stage", 'zrr', 'executor', 'dataSecretLevcode', 'type', 'jhOid', 'jhCode', 'zrrCode', 'executorCode'],
                        staticConditions: [{column: 'jhOid', exp: '=', value: jhOid}, {
                            column: 'type',
                            exp: '=',
                            value: 0
                        }],
                    }
                }).then(result => {
                    this.currentRow.childData = result.data.records;
                    let index = this.tableData.findIndex(c => {
                        return c.oid == this.currentRow.oid
                    })
                    this.$set(this.tableData, index, this.currentRow);
                    this.$refs.child.refresh();
                }).catch(error => {

                })
            },
            fj(row) {
                this.fjVisible = true;
                this.getFjData(row.oid);
                // if (row.dataid) {
                //     this.$downloadFile(row.dataid);
                // } else {
                //     this.$message.warning("没有附件！");
                // }
            },
            edit(row) {
                this.$router.push("/qis/zlaqtxyx/jhgl_flow?dataId=" + row.oid)
            },
            see(row) {
                var dataId = row.businessDataId ? row.businessDataId : row.oid;
                this.$router.push("/qis/zlaqtxyx/jhgl_flow?oid=" + row.oid + "&dataId=" + dataId)
            },
            del(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    row.deleteStatus = 1;
                    this.$axios.delete("/pms/QisJhgl/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功！")
                            this.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败！")
                        })
                })
            },
            dateFormatter(cellValue) {
                if (cellValue == undefined) {
                    return ''
                }
                ;
                return moment(cellValue).format('YYYY-MM-DD');
            },
            search(data) {
                console.log(data, 'data')
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            getFjData(oid) {
                this.attaTableData = [];
                this.$axios.get('/pms/XtFj/listByBoid', {params: {boid: oid}})
                    .then(result => {
                        if (result.data.length != 0) {
                            this.attaTableData = result.data;
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取附件失败！");
                    })
            },
        },
        watch: {
            $route(New, old) {
                if (New.path === '/qis/zlaqtxyx/jhgl' && old.path === '/qis/zlaqtxyx/jhgl_flow') {
                    this.refresh();
                }
            }
        },
        props: [],
    }
</script>

<style lang="less" scoped>
    .pagination {
        float: right;
        flex-shrink: 0;
    }
    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;

        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>

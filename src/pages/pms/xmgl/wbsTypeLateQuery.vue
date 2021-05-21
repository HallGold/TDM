<template>
    <el-container>
        <el-aside width="250px" class="asidelayout">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree
                    class="filter-tree"
                    style="height: 400px; overflow-y:auto"
                    @node-click="rwmbClick"
                    :data="data"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree">
            </el-tree>

            <div>
                <el-tag style="width: 250px">模板详情
                    <div style="float: right">
                        <i v-show="!disabled" style="cursor: pointer" title="保存" class="el-icon-check"
                           @click="saveModel"></i>
                        <span style="margin: 0 5px"></span>
                        <i v-show="!disabled" style="cursor: pointer" title="删除" class="el-icon-delete"
                           @click="deleteModel"></i>
                    </div>
                </el-tag>
                <el-form :model="formModel" ref="form" :v-loading="loading">
                    <input :value="formModel.oid" type="hidden">
                    <el-form-item label="模板编号" label-width="100px" prop="wbsTypelateCode">
                        <el-input disabled :value="formModel.wbsTypelateCode"></el-input>
                    </el-form-item>
                    <el-form-item label="模板名称" label-width="100px" prop="wbsTypelateName">
                        <el-input :disabled="disabled" v-model="formModel.wbsTypelateName"></el-input>
                    </el-form-item>
                    <el-form-item label="模板设置人" label-width="100px" prop="wbsTypelateSzr">
                        <el-input disabled v-model="formModel.wbsTypelateSzr"></el-input>
                    </el-form-item>
                    <el-form-item label="生效日期" label-width="100px" prop="wbsTypelateDateStart">
                        <el-date-picker :disabled="disabled" v-model="formModel.wbsTypelateDateStart"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="停用日期" label-width="100px" prop="wbsTypelateDateEnd">
                        <el-date-picker :disabled="disabled" v-model="formModel.wbsTypelateDateEnd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                        <ice-select v-model="formModel.dataSecretLevcode"
                                    map-type-code="DATA_SECRET_LEVEL" filterable placeholder="请选择">
                        </ice-select>
                    </el-form-item>


                </el-form>
            </div>
        </el-aside>
        <el-main>
            <el-tag style="width: 100%">任务信息</el-tag>
            <vxe-table
                    border
                    resizable
                    show-overflow
                    ref="xGrid"
                    highlight-current-row
                    highlight-hover-row
                    :height="screenHeight-300"
                    @cell-dblclick="itemInfo"
                    :data="tableData"
                    :tree-config="treeConfig"
                    :keyboard-config="{isArrow: false}">
                <vxe-table-column field="dataPxh" title="序号" width="50px"></vxe-table-column>
                <vxe-table-column field="wbscode" title="WBS编号" width="100px" tree-node></vxe-table-column>
                <vxe-table-column field="rwname" title="任务内容" width="500px" show-overflow="title"></vxe-table-column>
                <vxe-table-column field="qzrw" title="前置任务" width="100px"></vxe-table-column>
                <!-- <vxe-table-column field="rwgq" title="工期" width="150px"></vxe-table-column> -->
                <vxe-table-column field="dateJhStar" title="开始日期" :formatter="['toDateString', 'yyyy-MM-dd']" width="150px">
                </vxe-table-column>
                <vxe-table-column field="dateJhEnd" title="完成日期" :formatter="['toDateString', 'yyyy-MM-dd']" width="150px">
                </vxe-table-column>
                <vxe-table-column field="rwdeptcode" title="责任单位" show-overflow="title"
                                  width="150px" :cell-render="{name: 'mapTypeCode', cusMapTypeCode: 'DEPT'}">
                </vxe-table-column>
                <vxe-table-column field="rwfzr" title="责任人" width="150px">
                </vxe-table-column>
            </vxe-table>
        </el-main>
        <!--弹出模态框-->
        <WbsEdit ref="myWbsEdit"></WbsEdit>
    </el-container>
</template>
<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import WbsEdit from "./wbsEdit";

    export default {
        props: {
            // 子组件接收函数
            getModelData: {
                type: Function
            },
            visible: {
                type: Boolean
            },
            isUseModel: {
                type: Boolean
            }
        },
        data() {
            return {
                filterText: '',
                tableData: [],
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    indent: '10',
                    expandAll: true
                },
                formModel: {
                    oid: '',
                    wbsTypelateCode: '',
                    wbsTypelateName: '',
                    wbsTypelateSzr: '',
                    wbsTypelateDateStart: '',
                    wbsTypelateDateEnd: '',
                    wbsTypelateZt: '',
                    dataSecretLevcode: '',
                    dateRemark: ''
                },
                backupData: {},
                //定义弹出框为false，隐藏状态
                loading: false,
                disabled: false,
                data: [{
                    oid: 1,
                    wbsTypelateName: '任务模板',
                    children: [],
                }],
                recordModel: {
                    oid: '',
                    oidTypelate: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    rwms: '',
                    rwlx: '',
                    qzrw: '',
                    rwjd: '',
                    jjcd: '',
                    rwgq: '1',
                    rwgs: '',
                    dateJhStar: '',
                    dateJhEnd: '',
                    dateSjStar: '',
                    dateSjEnd: '',
                    rwfzr: '',
                    rwcjr: '',
                    dateCj: '',
                    rwdept: '',
                    zylx: '',
                    zynqme: '',
                    rwzt: '',
                    gdrq: '',
                    xzlx: '',
                    xzdate: '',
                    isLcb: '',
                    isGj: '',
                    yscode: '',
                    xmjfqd: '',
                    cwtmdm: '',
                    version: '',
                    rwfzrcode: '',
                    dataSecretLevcode: '',
                    rwysJfSum: '',
                    rwysRl: '',
                    rwysYcl: '',
                    rwysYclfy: '',
                    rwysZy: '',
                    rwysZyfy: '',
                    rwysWx: '',
                    rwysWxfy: '',
                    rwysSw: '',
                    rwysSwfy: '',
                    rwysQt: '',
                    rwysQtfy: '',
                    rwtj: '',
                    rwmb: '',
                    dataPxh: '',
                    rwdeptcode: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'wbsTypelateName'
                },
                screenHeight: window.innerHeight
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.disabled = this.visible
            this.initTreeData()
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.screenHeight = window.innerHeight
                })()
            }
        },
        methods: {
            initTreeData() {
                let columns = Object.keys(this.formModel)
                const query = {columns}
                console.log(this.isUseModel)
                let url = "/pms/PmsBaseWbsTypelate/list"
                if (this.isUseModel) {
                    url = "/pms/PmsBaseWbsTypelate/useList"
                }
                this.$axios.get(url, {params: query})
                    .then(result => {
                        const data = result.data;
                        this.data[0].children = data
                        this.$nextTick(() => {
                            this.$refs.xGrid.setAllTreeExpansion(true)
                        })
                    })
            },
            query() {
                //获取查询框的值
                const queryParam = this.queryParam
                let iceQueryCondition = [{
                    column: 'oidTypelate',
                    exp: '=',
                    value: this.formModel.oid
                }]
                if (queryParam != '') {
                    iceQueryCondition.push({
                        column: 'rwname',
                        exp: 'like',
                        value: queryParam
                    })
                }
                let columns = Object.keys(this.recordModel)
                const query = {columns, conditions: iceQueryCondition}
                this.pageList(query)
            },
            pageList(queryParam) {
                this.$axios.get("/pms/PmsWbsTypelate/treeList", {params: queryParam})
                    .then(result => {
                        console.log(result)
                        const data = result.data
                        this.tableData = data
                        console.log(this.tableData)
                    })
            },
            select() {
                console.log(this.tableData)
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.wbsTypelateName.indexOf(value) !== -1;
            },
            rwmbClick(obj, node, VueComponent) {
                this.formModel = JSON.parse(JSON.stringify(obj))

                this.query()
            },
            getParentParams() {
                this.getModelData(this.tableData)
            },
            saveModel() {
                this.$confirm('是否确认保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/pms/PmsBaseWbsTypelate/saveOrUpdate", {$json: this.formModel})
                        .then(result => {
                            this.$message.success("保存成功")
                            let children = this.data[0].children
                            if (children) {
                                children.forEach((val, index, arr) => {
                                    if (val.oid === this.formModel.oid) {
                                        arr.splice(index, 1, this.formModel)
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            this.$message.error("保存失败")
                        })
                }).catch(_ => {
                })
            },
            deleteModel() {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsBaseWbsTypelate/del", {params: {id: this.formModel.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            let children = this.data[0].children
                            if (children) {
                                children.forEach((val, index, arr) => {
                                    if (val.oid === this.formModel.oid) {
                                        arr.splice(index, 1)[0]
                                        this.formModel = {}
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },
            itemInfo() {
                this.title = "详情"
                //获取选中的数据
                let selectRecords = this.$refs.xGrid.getCurrentRow()
                console.log(selectRecords)
                if (!selectRecords) {
                    this.$message.warning("请选择一条数据！")
                    return
                }
                let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
                let {item} = matchObj
                console.log(item, 'item')
                this.$refs.myWbsEdit.getWbsModelParams(this.title, item, this.tableData)
            },
        },
        components: {
            IceSelect,
            WbsEdit
        }
    };
</script>
<style>
    .asidelayout /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #1892b3;
        color: #fff;
    }
    .asidelayout /deep/  .el-tree-node:focus > .el-tree-node__content {
        background-color: #1892b3;
        color: #fff;
    }
</style>

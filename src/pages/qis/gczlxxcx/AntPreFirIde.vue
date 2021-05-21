<template>
    <div class="ice-container">
        <div class="btns">
            <div class="right" style="width: 400px;">
                <search-input :query="query" @search="search"></search-input>
            </div>
            <div class="left">
                <el-button type="primary" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>
            </div>
        </div>
        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <vxe-table
                        v-loading="vxeloading"
                        resizable
                        :align="allAlign"
                        border
                        height="100%"
                        align='center'
                        class="vxe"
                        @toggle-row-expand="getRow"
                        :data="tableData">
                    <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                    <vxe-table-column type="expand" width="60">
                        <template v-slot:content="{ row, rowIndex }">
                            <div style="width: 50%;">
                                <ice-query-grid :data-url="'/MES/ProPreFirstIndenti/list?processId='+row.planId"
                                                title="产前准备和首件鉴定附件"
                                                ref="insideGrid"
                                                :columns="insideColumns"
                                                :operations="insideOperations"
                                                :minHeight="iceHeight"
                                                :mesHeight="false"
                                                @selection-change="onTableSelect"
                                >
                                </ice-query-grid>
                            </div>

                        </template>
                    </vxe-table-column>
                    <vxe-table-column v-for="(item, index) in outerColumns" :key="index" :col="item"
                                      is="qis-vxe-columns"></vxe-table-column>
                </vxe-table>
            </div>
        </div>

        <vxe-pager
                perfect
                :loading="loading"
                size="mini"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="handlePageChange">
        </vxe-pager>
        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="attachmentData" :rules="formRules" label-position="right" class="conditon-bar"
                         ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item label="附件名称" label-width="100px" prop="name">
                                <el-input placeholder="附件名称" v-model="attachmentData.name"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上传附件" label-width="100px" prop="firstIdentifiedApplyFor">
                                <IceSingleUpload :on-success="success" :doSecret="true"
                                                 ref="fileUpload"></IceSingleUpload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item label="类型" label-width="100px" prop="attachmentType">
                                <ice-select v-model="attachmentData.attachmentType" map-type-code="APIF" clearable
                                            filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="save">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import qisVxeColumns from '../../basePage/VxeColumns';
    import searchInput from "../zlycbh/searchInput"
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import IceSelect from "@/components/common/base/IceSelect";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";

    export default {
        name: "AntPreFirIde",
        components: {
            IceQueryGrid, qisVxeColumns, searchInput, IcePersionSelector, IceSelect, ATTACHMENT
        },
        data() {
            return {
                //查询
                query: [
                    {type: 'input', code: 'planName', label: '计划名称', exp: 'like', value: ''},
                    {type: 'input', code: 'planCode', label: '计划编号', exp: 'like', value: ''},
                    {type: 'input', code: 'productName', label: '产品名称', exp: 'like', value: ''},
                ],
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions: [],
                    conditionLink: 'OR'
                },
                allAlign: [],
                tableData: [],
                loading: false,

                iceHeight: 300,
                queryModel: "normal",
                multipleSelection: [],
                outerQuery: [
                    {type: 'input', label: '计划名称', code: 'planName', value: "", exp: "like"},
                    {type: 'input', label: '计划编号', code: 'planCode', value: ""},
                    {type: 'input', label: '产品名称', code: 'productName', value: "", exp: "like"}
                ],
                outerColumns: [
                    {code: 'planId', hidden: true},
                    {code: 'processId', hidden: true},
                    {label: '计划名称', code: 'planName', width: 200},
                    {label: '计划编号', code: 'planCode', width: 200},
                    {label: '组次', code: 'groupTime', width: 100},
                    {label: '产品名称', code: 'productName', width: 100},
                    {label: '产品编号', code: 'productCode', width: 200},
                    {label: '开始时间', code: 'startTime', width: 150},
                    {
                        label: '结束时间', code: 'endTime', width: 150, renderCell(h, data) {
                            let endDate = data.row.endTime;
                            let currentDate = new Date().dateFormat("yyyy-MM-dd hh:mm:ss");
// 如果结束时间比当前时间大显示为红色日期
                            return endDate > currentDate ? <span style="color: red;">{endDate}</span> : endDate;
                        }
                    },
                    {label: '承制单位', code: 'processName', width: 100},
                    {label: '交付数量', code: 'processQuantity', width: 80},
                    {label: '产品单位', code: 'productUnits', width: 80},
                    {label: '紧急程度', code: 'emergencyDegree', width: 80, mapTypeCode: 'JJCD'},
                    {label: '密级', code: 'dataSecretLevcode', width: 80, mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                insideColumns: [
                    {code: 'oid', hidden: true},
                    {label: '附件ID', code: 'fileId', hidden: true},
                    {label: '附件名称', code: 'name', width: 150},
                    {label: '上传时间', code: 'upTime', width: 150},
                    {label: '附件类型', code: 'attachmentType', width: 100, mapTypeCode: 'APIF', sortable: true},
                    {label: '密级', code: 'dataSecretLevcode', width: 80, mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                insideButtons: [
                    {
                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                            this.tittle = '新增附件';
                            this.dialogVisible = true;
// 当先修改再添加时需要清除oid的值
                            this.attachmentData.oid = null;
// 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick
                            this.$nextTick(_ => {
                                this.$refs.form.resetFields();
                            })
                        }
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', callback: this.delete
                    }
                ],
                insideOperations: [
                    {
                        name: '下载附件', callback: (row) => {
                            this.downloadFile(row.fileId)
                        }
                    },
//           {
//             name: '修改', callback: (row) => {
// // 获取工序Id(用于计划分解的工步修改)
//               row.planId = this.expandableRow.planId;
//               this.tittle = '附件修改';
//               this.dialogVisible = true;
//               this.$nextTick(_ => {
//                 this.$refs.form.resetFields();
//                 this.attachmentData = {...row};
//               })
//             }
//           },
                ],
                dialogVisible: false,
                attachmentData: {
                    oid: '',
                    name: '',
                    upTime: '',
                    attachmentType: '',
                    fileId: '',
                    dataSecretLevcode: '2',
                    planId: ''
                },
                formRules: {
                    name: [{required: true, message: '请输入附件名称', trigger: 'blur'}],
                    attachmentType: [{required: true, message: '请选择类型', trigger: 'blur'}],
                },
                tittle: '',
                selectRow: [],
                selectIDS: [],
                selected: false,  // 判断用户是否有
                visibleExpand: false,
                expandableRow: {},    // 展开时获取行数据
                vxeloading: false
            }
        },
        created() {
            this.getList();
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
        },
        methods: {
            search(data) {
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            refresh() {
                this.getList();
            },
            downloadFile(id) {
                this.$downloadFile(id);
            },
            getRow({row, expanded}) {
// 获取展开的计划数据
                this.expandableRow = row;
                this.attachmentData.planId = row.planId;
                this.attachmentData.dataSecretLevcode = row.dataSecretLevcode;
            },
            // 删除按钮
            delete() {
                if (this.selectRow.length === 0) {
                    this.$message.error('请选择需要删除的数据');
                    return;
                }
                this.delAcl = true;
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    for (let IDS of this.selectRow) {
                        this.selectIDS.push(IDS.oid);
                    }
                    this.$axios.delete('/MES/ProPreFirstIndenti/del', {params: {id: this.selectIDS.toString()}}).then(result => {
                        this.$message.success("删除成功");
                        // this.$refs.outerGrid.refresh();
                        this.$refs.insideGrid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦~")
                    })
                });
            }
            ,
            success(response, file) {
                this.attachmentData.fileId = response.data;
                this.attachmentData.name = file.name;
                this.$refs.fileUpload.reset();
            }
            ,
            closeDialog() {
                this.dialogVisible = false;
                this.$refs.form.resetFields();
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let obj = this.attachmentData;
                        this.$axios.post('/MES/ProPreFirstIndenti/saveOrUpdate', obj).then(result => {
                            this.$message.success("新增成功");
                            this.$refs.form.resetFields();
                            this.dialogVisible = false;
                            this.$refs.insideGrid.refresh();
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
                    } else {
                        return false;
                    }
                });
            }
            ,
            // 判断用户是否有勾选表格数据
            onTableSelect(rows) {
                this.selectRow = rows;
            },

            // 请求数据
            getCol(data) {
                data.forEach((c) => {
                    if (c.columns && c.columns.length > 0) {
                        this.getCol(c.columns);
                    } else {
                        this.requestData.push(c.code);
                    }
                })
            },
            getList() {
                this.vxeloading = true;
                this.requestData = [];
                this.getCol(this.outerColumns);
                this.loading = true
                this.tablePage.staticConditions = this.staticQuerys;
                this.tablePage.columns = this.requestData;
                this.$axios.get("/MES/ProPreFirstIndenti/findByAntPreFirIdeList", {params: this.tablePage})
                    .then(result => {
                        this.tableData = result.data.records;
                        this.tablePage.total = result.data.total;
                        this.vxeloading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            handlePageChange(e) {
                console.log(e);
                this.tablePage.current = e[0].currentPage;
                this.tablePage.size = e[0].pageSize;
                this.refresh();
            },
        }
    }
</script>

<style lang="less" scoped>
    .btns {
        padding: 10px 15px;

        .right {
            float: right;
        }

        .btn {
            margin-right: 10px;
        }
    }

    .vxe {
        flex-grow: 1;
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

<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/QisZljhAppraise/list"
                :columns="columns"
                chooseItem="single"
                :buttons="buttons"
                ref="gridList"
                :operations="operations"
                :query="querys"
                :operationsWidth=100
                exportTitle="检查与评价"
        >
        </ice-query-grid>
        <ice-dialog title="检查与评价" :visible.sync="visible" width="1000px">
            <div>
                <el-form :v-loading="loading" :model="formModel" status-icon :rules="rules" ref="definition"
                         label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="选择计划" label-width="110px" prop="jhName">
                                <el-input readonly v-model="formModel.jhName" placeholder="请选择">
                                    <el-button v-if="!executeOid||isAdd" slot="append" icon="el-icon-search"
                                               @click="showSectJh"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="执行部门" label-width="110px" prop="jhDeptName">
                                <el-input readonly v-model="formModel.jhDeptName" maxlength="16" placeholder="请选择"
                                >
                                    <el-button :disabled="!formModel.jhName" v-if="!executeOid||isAdd" slot="append"
                                               icon="el-icon-search"
                                               @click="showSectBm"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="评价类型" label-width="110px" prop="appraiseType">
                                <ice-select v-model="formModel.appraiseType" map-type-code="QIS_PJ_TYPE"
                                            autocomplete="off"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="评价内容" label-width="110px" prop="appraiseContent">
                                <el-input type="textarea" v-model="formModel.appraiseContent"
                                          placeholder="不超过650个字" maxlength="650"
                                          show-word-limit
                                          :rows="6">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
                    <el-button type="info" @click="visible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog title="选择计划" :visible.sync="jhVisible" width="1000px">
            <div>
                <ice-query-grid
                        data-url="/pms/QisJhgl/list3"
                        :columns="jhColumns"
                        chooseItem="single"
                        ref="grid"
                        :query="jhQuerys"
                        @selection-change="selectChange"
                        exportTitle="选择计划"
                ></ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleAddJh">确认</el-button>
                    <el-button type="info" @click="jhVisible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog title="获取部门执行信息" :visible.sync="bmVisible" width="1000px">
            <div>
                <ice-query-grid
                        :grid-data="tableData"
                        :columns="bmColumns"
                        chooseItem="single"
                        ref="grid"
                        :pagination="false"
                        @selection-change="selectChangeBm"
                        exportTitle="选择部门执行"
                ></ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleAddBm">确认</el-button>
                    <el-button type="info" @click="bmVisible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "@/components/common/base/IceDialog";

    export default {
        name: "commentAndSug",
        components: {
            IceQueryGrid,
            IceDialog,
            IceSelect
        },
        data() {
            return {
                columns: [
                    {label: "计划编号", code: "jhCode", width: 100, sortable: true},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                    {label: "计划名称", code: "jhName", width: 100, sortable: true},
                    {label: "执行单位", code: "jhDeptName", width: 100, sortable: true, hidden: true},
                    {label: "执行单位", code: "jhDeptCode", width: 100, sortable: true, cusMapTypeCode: 'DEPT'},
                    {label: "评价类型", code: "appraiseType", width: 200, sortable: true, mapTypeCode: "QIS_PJ_TYPE"},
                    {label: "评价内容", code: "appraiseContent", width: 100, sortable: true},
                    {label: "评价人", code: "advanceName", width: 100, sortable: true},
                    {label: "评价部门", code: "advanceDeptName", width: 100, sortable: true, hidden: true},
                    {label: "创建人", code: "createUser", width: 100, sortable: true, hidden: true},
                    {
                        label: "评价部门",
                        code: "acvanceDeptCode",
                        width: 100,
                        sortable: true,
                        hidden: true,
                        cusMapTypeCode: 'DEPT'
                    },
                    {label: "评价时间", code: "createDate", width: 150, sortable: true},
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                visible: false,
                loading: false,

                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        ctrlCode: "BSXXMLB",
                        type: 'success',
                        size: 'mini',
                        callback: this.refreshGrid
                    },
                    {
                        name: '新增',
                        ctrlCode: "BNDRWJH",
                        icon: 'el-icon-circle-plus-outline',
                        type: 'primary',
                        size: 'mini',
                        callback: this.add
                    },
                ],
                operations: [
                    {
                        name: '撤销评价', callback: this.deleteList, ctrlCode: "BBJ",
                        isShow: (row)=> {
                            return row.createUser == this.$userInfo.userCode
                        }
                    },
                ],
                querys: [],
                formModel: {
                    appraiseContent: "",
                    appraiseType: "",
                    jhCode: '',
                    jhName: '',
                    jhDeptCode: '',
                    jhDeptName: '',
                    jhDeptCharge: '',
                },
                rules: {
                    jhName: [
                        {required: true, message: '计划名称不能为空', trigger: 'blur'},
                    ],
                    jhDeptName: [
                        {required: true, message: '计划执行部门不能为空', trigger: 'blur'},
                    ],
                    appraiseContent: [
                        {required: true, message: '评价内容不能为空', trigger: 'blur'},
                    ],
                    appraiseType: [
                        {required: true, message: '选择评价类型', trigger: 'blur'},
                    ],
                },
                // 选择计划配置项
                jhVisible: false,
                jhQuerys: [
                    {type: 'input', code: 'jhCode', label: '计划编码', value: ''},
                    {type: 'input', code: 'jhName', label: '计划名称', value: ''},


                ],
                jhColumns: [
                    {label: "计划编号", code: "jhCode", width: 100, sortable: true},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                    {label: "计划名称", code: "jhName", width: 100, sortable: true},
                    {label: "计划类型", code: "jhType", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJH_TYPE'},
                    {label: "计划状态", code: "jhStatus", width: 100, sortable: true, mapTypeCode: 'QIS_JHGL_JHZT'},
                    {label: "开始日期", code: "startDate", width: 100, sortable: true},
                    {label: "完成日期", code: "endDate", width: 100, sortable: true},
                    {label: "编辑要求", code: "jhRemark", width: 100, sortable: true},
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                jhData: [],
                // bm 执行信息
                bmVisible: false,
                tableData: [],
                bmQuerys: [
                    {type: 'input', code: 'depName', label: '执行部门', value: ''},
                    {type: 'input', code: 'zrr', label: '部门负责人', value: ''},
                    {
                        type: 'static', code: 'jhOid', exp: '=', value: () => {
                            return this.formModel.jhOid;
                        }
                    },
                ],
                bmColumns: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "负责人编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "负责人名称", code: "zrr", width: 100, sortable: true},
                    {label: "执行阶段", code: "stage", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJHBM_STATUS'},
                ],
                bmjhData: [],
                // 意见采纳
                formModelAccept: {
                    acceptSituation: '',
                    accepted: '',
                    oid: ''
                },
                visibleAccept: false,
                rulesAccept: {
                    acceptSituation: [
                        {required: true, message: '采纳说明不能为空', trigger: 'change'},
                    ],
                },
                loadingAccept: false,
                isAdd: false
            }
        },
        computed: {
            executeOid() {
                return this.$route.query.oid ? this.$route.query.oid : '';
            }
        },
        created() {
            if (this.executeOid) {
                console.log("获取")
                this.getExecute();
            }
            console.log(this.$userInfo, 'userinfo')

        },
        methods: {
            // 获取单个
            getExecute() {
                this.$axios.get("/pms/QisJhDepRel/get", {params: {id: this.executeOid}}).then(result => {
                    let data = result.data;
                    // formModel: {
                    //     opinionContent: "",
                    //         jhCode: '',
                    //         jhName: '',
                    //         jhDeptCode: '',
                    //         jhDeptName: '',
                    //         jhDeptCharge: '',
                    //         exeStage: ''
                    // },
                    console.log(data, 'data');
                    this.formModel.jhCode = data.jhCode;
                    this.formModel.jhName = data.jhName;
                    this.formModel.jhOid = data.jhOid;
                    this.formModel.jhId = data.jhOid;
                    this.formModel.jhDeptCode = data.depCode;
                    this.formModel.jhDeptName = data.depName;
                    this.formModel.jhDeptCharge = data.zrrName;
                    this.formModel.exeStage = data.stage;
                    this.formModel.dataSecretLevcode = data.dataSecretLevcode;
                    this.visible = true;
                }).catch(e => {
                    this.loading = false
                })
            },
            // 刷新
            refreshGrid() {
                this.$refs.gridList.refresh();
            },
            // 选择计划展示
            showSectJh() {
                this.jhVisible = true;
            },
            selectChange(data) {
                this.jhData = data;
            },

            handleAddJh() {
                this.formModel.jhName = this.jhData[0].jhName;
                this.formModel.dataSecretLevcode = this.jhData[0].dataSecretLevcode;
                this.formModel.jhOid = this.jhData[0].oid;
                this.formModel.jhId = this.jhData[0].oid;
                this.jhVisible = false;
            },
            // 意见征求范围
            showSectBm() {
                this.bmVisible = true;
                this.getDeptList();
            },
            selectChangeBm(data) {
                this.bmjhData = data;
            },
            handleAddBm() {
                this.formModel.jhDeptCode = this.bmjhData[0].depCode;
                this.formModel.jhDeptName = this.bmjhData[0].depName;
                this.formModel.jhDeptCharge = this.bmjhData[0].zrrName;
                this.bmVisible = false;
            },
            // 获取部门执行数据
            getDeptList() {
                this.$axios.get("/pms/QisJhDepRel/selectedListForOther", {params: {oidJh: this.formModel.jhOid}}).then(result => {
                    this.tableData = result.data;
                }).catch(e => {
                    this.loading = false
                })
            },
            add() {
                this.visible = true;
                this.isAdd = true;
                this.formModel = {
                    appraiseContent: "",
                    appraiseType: "",
                    jhCode: '',
                    jhName: '',
                    jhDeptCode: '',
                    jhDeptName: '',
                    jhDeptCharge: '',
                };
            },
            handleConfirmAdd() {
                this.$refs.definition.validate(vilidate => {
                    if (vilidate) {
                        this.loading = true;
                        this.formModel.advanceDeptCode = this.$userInfo.deptCode;
                        this.formModel.advanceDeptName = this.$userInfo.deptShortName;
                        this.formModel.advanceName = this.$userInfo.userName;
                        this.$axios.post("/pms/QisZljhAppraise/saveOrUpdate", this.formModel).then(result => {
                            this.$message.success("保存成功");
                            this.refreshGrid();
                            this.visible = false;
                        }).catch(e => {

                        }).finally(() => {
                            this.loading = false;
                        })
                    }
                })
            },
            deleteList(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pms/QisZljhAppraise/del", {"params": {"id": row.oid}}).then(
                        result => {
                            this.$message.success("删除成功");
                            this.refreshGrid();
                        })
                        .catch(error => {
                            this.$message.error("删除报错");
                        })
                        .finally(_ => {

                        })


                });
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/QisZljhOpinion/list"
                :columns="columns"
                chooseItem="single"
                :buttons="buttons"
                ref="gridList"
                :operations="operations"
                :query="querys"
                :operationsWidth=200
                exportTitle="意见和建议信息"
        >
        </ice-query-grid>
        <ice-dialog :title="title" :visible.sync="visible" width="1000px">
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
                                    <el-button v-if="!executeOid||isAdd" slot="append" icon="el-icon-search"
                                               @click="showSectBm"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="附件" label-width="110px" prop="fileName">
                                <!--<ice-single-upload :disabled="true" v-model="formModel.oidFj"-->
                                <!--@fileData="fileData"-->
                                <!--:do-secret="true" ref="fileUpload"></ice-single-upload>-->
                                <span>{{formModel.fileName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="问题章节" label-width="110px" prop="fileChapter">
                                <el-input v-model="formModel.fileChapter" maxlength="16" placeholder="请输入"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item :label="content" label-width="110px" prop="appraiseContent">
                                <el-input type="textarea" v-model="formModel.opinionContent"
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
                        :data-url="uris.jhuri"
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
        <!--意见采纳-->
        <ice-dialog :title="exceptTitle" :visible.sync="visibleAccept" width="800px">
            <div>
                <el-form :v-loading="loading" :model="formModelAccept" status-icon :rules="rulesAccept"
                         ref="definitionAccept"
                         label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item :label="exceptTitle" label-width="150px" prop="acceptSituation">
                                <el-input type="textarea" v-model="formModelAccept.acceptSituation"
                                          placeholder="不超过650个字" maxlength="650"
                                          show-word-limit
                                          :rows="6">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleConfirmAccept">确认</el-button>
                    <el-button type="info" @click="visibleAccept=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "@/components/common/base/IceDialog";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";


    export default {
        name: "commentAndSug",
        components: {
            IceQueryGrid,
            IceDialog,
            IceSingleUpload
        },
        props: {
            suggestionsComments: {
                default: 0
            },
            title: {
                default: '新增评审意见'
            },
            content: {
                default: '建议内容'
            }
        },
        data() {
            return {
                querys: [
                    {
                        type: 'static', code: 'suggestionsComments', label: '父ID', value: () => {
                            return this.suggestionsComments
                        }
                    },
                    {type: 'input', code: 'jhName', label: '计划名称', value: ''},
                    {type: 'input', code: 'jhDeptName', label: '执行单位', value: ''},
                ],
                columns: [
                    {label: "计划编号", code: "jhCode", width: 100, sortable: true},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                    {label: "计划名称", code: "jhName", width: 100, sortable: true},
                    {label: "执行单位", code: "jhDeptName", width: 100, sortable: true, hidden: true},
                    {label: "执行单位", code: "jhDeptCode", width: 100, sortable: true, cusMapTypeCode: 'DEPT'},
                    {label: "执行阶段", code: "exeStage", width: 100, sortable: true, mapTypeCode: "QIS_ZLJHBM_STATUS"},
                    {label: "文件名称", code: "fileName", width: 100, sortable: true},
                    {label: "问题章节", code: "fileChapter", width: 100, sortable: true},
                    {label: "计划执行单位负责人", code: "jhDeptCharge", width: 100, sortable: true},
                    {label: "建议", code: "opinionContent", width: 100, sortable: true},
                    {label: "提出人", code: "advanceName", width: 100, sortable: true},
                    {label: "提出部门", code: "acvanceDeptName", width: 100, sortable: true, hidden: true},
                    {
                        label: "提出部门",
                        code: "acvanceDeptCode",
                        width: 100,
                        sortable: true,
                        hidden: true,
                        cusMapTypeCode: 'DEPT'
                    },
                    {label: "提出时间", code: "createDate", width: 100, sortable: true},
                    {label: "采纳状态", code: "accepted", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJH_CNQK'},
                    {label: "采纳情况", code: "acceptSituation", width: 100, sortable: true},
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
                        name: '采纳', callback: this.accept, ctrlCode: "BBJ"
                    },
                    {
                        name: '不采纳', callback: this.noaccept, ctrlCode: "BBJ"
                    },
                ],

                formModel: {
                    opinionContent: "",
                    jhCode: '',
                    jhName: '',
                    jhDeptCode: '',
                    jhDeptName: '',
                    jhDeptCharge: '',
                    exeStage: '',
                    fileChapter: '',
                    fileCode: '',
                    fileName: "",
                    suggestionsComments: this.suggestionsComments
                },
                rules: {
                    jhName: [
                        {required: true, message: '计划名称不能为空', trigger: 'change'},
                    ],
                    jhDeptName: [
                        {required: true, message: '执行部门不能为空', trigger: 'change'},
                    ],
                    opinionContent: [
                        {required: true, message: '意见和建议不能为空', trigger: 'blur'},
                    ],
                    fileChapter: [
                        {required: true, message: '章节不能为空', trigger: 'blur'},
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
                            console.log(this.formModel, 'formModel')
                            return this.formModel.jhOid;
                        }
                    },
                ],
                bmColumns: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "负责人编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "负责人名称", code: "zrr", width: 100, sortable: true},
                    {label: "阶段", code: "stage", width: 100, sortable: true, mapTypeCode: "QIS_TXWJBB"},
                    {label: "状态", code: "jhStatus", width: 100, sortable: true, hidden: true},
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
                isAdd: false,
                bmOid: '',
                exceptTitle: "填写采纳情况说明"
            }
        },
        computed: {
            executeOid() {
                return this.$route.query.oid ? this.$route.query.oid : '';
            },
            // 选择计划或者部门 判定链接地址
            uris() {
                if (this.suggestionsComments == 0) {
                    return {
                        jhuri: '/pms/QisJhgl/selectedList',
                        bmuri: '/pms/QisJhDepRel/selectedList'
                    }
                } else {
                    return {
                        jhuri: '/pms/QisJhgl/selectedListForReview',
                        bmuri: '/pms/QisJhDepRel/selectedListForReview'
                    }
                }
            }
        },
        watch: {
            executeOid() {
                this.getExecute();
            }
        },
        created() {

        },
        mounted() {

            let tid = setTimeout(() => {
                this.$nextTick(_ => {
                    if (this.executeOid) {
                        this.getExecute();
                    }
                })
                clearTimeout(tid);
            }, 20)
        },
        methods: {
            // 请求当前选中部门下的主附件
            getMainFileByDept() {
                let uri = this.suggestionsComments == 0 ? "/pms/QisFileinfo/fileByOidRepdel" : "/pms/QisFileinfo/reviewFileByOidRepdel"
                this.$axios.get(uri, {params: {oidDeprel: this.bmOid}}).then(result => {
                    if (result.data) {
                        this.formModel.fileName = result.data.filename;
                        this.formModel.fileCode = result.data.filecode;
                    }

                    console.log(this.formModel)
                }).catch(e => {
                    this.$message.error("获取附件失败！");
                })
            },
            // 获取单个
            getExecute() {
                this.$axios.get("/pms/QisJhDepRel/get", {params: {id: this.executeOid}}).then(result => {
                    console.log(result);
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
                    this.formModel.jhCode = data.jhCode;
                    this.formModel.jhName = data.jhName;
                    this.formModel.jhDeptCode = data.depCode;
                    this.formModel.jhDeptName = data.depName;
                    this.formModel.jhDeptCharge = data.zrrName;
                    this.formModel.exeStage = data.stage;
                    this.formModel.dataSecretLevcode = data.dataSecretLevcode;
                    this.visible = true;
                    this.bmOid = this.executeOid;
                    this.getMainFileByDept();
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
                this.formModel.jhCode = this.jhData[0].jhCode;
                this.formModel.dataSecretLevcode = this.jhData[0].dataSecretLevcode;
                this.formModel.jhOid = this.jhData[0].oid;
                this.jhVisible = false;
            },
            // 意见征求范围
            showSectBm() {
                this.bmVisible = true;
                this.tableData = [];
                this.getDeptList();
            },
            selectChangeBm(data) {
                this.bmjhData = data;
            },
            handleAddBm() {
                let item = this.bmjhData[0];
                this.formModel.jhDeptCode = item.depCode;
                this.formModel.jhDeptName = item.depName;
                this.formModel.jhDeptCharge = item.zrr;
                // 如果阶段有值去阶段否则去状态值
                this.formModel.exeStage = item.stage ? item.stage : item.jhStatus;
                this.bmVisible = false;
                this.bmOid = item.oid;
                this.getMainFileByDept();
            },
            // 获取部门执行数据
            getDeptList() {
                this.$axios.get(this.uris.bmuri, {params: {oidJh: this.formModel.jhOid}}).then(result => {
                    this.tableData = result.data;
                }).catch(e => {
                    this.loading = false
                })
            },
            add() {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.definition.resetFields();
                    this.formModel.jhName = "";
                    this.formModel.jhDeptName = "";
                    this.formModel.opinionContent = "";
                })
                this.isAdd = true;
            },
            handleConfirmAdd() {
                this.$refs.definition.validate(vilidate => {
                    if (vilidate) {
                        this.loading = true;
                        this.formModel.acvanceDeptCode = this.$userInfo.deptCode;
                        this.formModel.acvanceDeptName = this.$userInfo.deptShortName;
                        this.formModel.advanceName = this.$userInfo.userName;
                        this.$axios.post("/pms/QisZljhOpinion/saveOrUpdate", this.formModel).then(result => {
                            this.$message.success("保存成功");
                            this.visible = false;
                            this.refreshGrid();
                        }).catch(e => {

                        }).finally(() => {
                            this.loading = false
                        })
                    }
                })
            },
            /**
             *
             *  意见采纳
             *
             *
             * */
            handleConfirmAccept() {
                this.$refs.definitionAccept.validate(vilidate => {
                    if (vilidate) {
                        this.loadingAccept = true;
                        this.$axios.post("/pms/QisZljhOpinion/adopt", this.formModelAccept).then(result => {
                            this.$message.success("保存成功");
                            this.visibleAccept = false;
                            this.refreshGrid();
                        }).catch(e => {

                        }).finally(() => {
                            this.loadingAccept = false
                        })
                    }
                })
            },
            accept(row) {
                this.formModelAccept.oid = row.oid;
                this.formModelAccept.accepted = 1;
                this.visibleAccept = true;
                this.exceptTitle = "填写采纳情况说明"
            },
            noaccept (row) {
                this.formModelAccept.oid = row.oid;
                this.formModelAccept.accepted =0;
                this.visibleAccept = true;
                this.exceptTitle = "填写不采纳情况说明"

            }
        }
    }
</script>

<style scoped>

</style>

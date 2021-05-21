<template>
    <div>
        <el-form :v-loading="loading" :model="formModel" status-icon :rules="rules" ref="definition"
                 label-width="140px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                        <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                            <el-button v-if="!flowScope.formReadonly&&!jhdata.jhCode" slot="append"
                                       icon="el-icon-search"
                                       @click="showSectJh"></el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                        <el-input readonly v-model="formModel.depRelName" maxlength="16" placeholder="请选择"
                        >
                            <el-button v-if="!flowScope.formReadonly&&!jhdata.jhCode" slot="append"
                                       icon="el-icon-search"
                                       @click="showSectBm"></el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="文件版本" label-width="140px" prop="fileVersion">
                        <el-select v-model="formModel.fileVersion" placeholder="请选择">
                            <el-option
                                    v-for="(item, index) in dataMap"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文件类型" label-width="140px" prop="filetype">
                        <pms-select-tree :disabled="flowScope.formReadonly" v-model="formModel.filetype"
                                         :isemptyBtn=true
                                         :showChecked=false
                                         :unbrid=true
                                         :treeData="treeData"
                                         :transfer="transferTree.treeData"
                                         :iscanLevel1=false
                                         trigger="click"
                                         @select-xmly="getTreeData"
                        >
                        </pms-select-tree>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="askingForAdvice">
                <el-col :span="12">
                    <el-form-item label="征求建议起始时间" label-width="140px" prop="startingTimeOfConsultation">
                        <el-date-picker v-model="formModel.startingTimeOfConsultation" type="date" placeholder="请选择"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="征求建议终止时间" label-width="140px" prop="endTimeOfConsultation">
                        <el-date-picker v-model="formModel.endTimeOfConsultation" type="date" placeholder="请选择"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="主附件上传" label-width="140px">
                        <span slot="label"><i class="hint">*</i> 主附件上传</span>
                        <ice-single-upload v-model="formModel.oidFj"
                                           :on-success="fileUploadSuccess"
                                           @change="change"
                                           :do-secret="true" ref="fileUpload"></ice-single-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--计划执行部门-->
        <el-tabs>
            <el-tab-pane label="体系文件上传">
                <span slot="label"><i class="hint">*</i> 文件上传</span>
                <ATTACHMENT
                        :controlMj="conMj"
                        :isHandleer="!flowScope.formReadonly" :data="queryListFiles"
                        ref="pmsXmRwFjListXmsr1" @change="changeFj"></ATTACHMENT>

            </el-tab-pane>
        </el-tabs>

        <ice-dialog title="选择计划" :visible.sync="jhVisible" width="1000px">
            <div>
                <ice-query-grid
                        data-url="/pms/QisJhgl/selectForUploadFile"
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
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import PmsSelectTree from '../../../components/common/pms/PmsSelectTree'
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import {mapMutations, mapGetters} from "vuex";
    import {ZLJHZT} from '../../../utils/constant'


    export default {
        name: "fileCommon",
        components: {
            IceSelect,
            IceDeptSelector,
            ATTACHMENT,
            IceQueryGrid,
            PmsSelectTree,
            IceSingleUpload
        },
        props: {
            flowScope: {
                default: function () {
                    return {}
                }
            },
            oidType: {
                default: ''
            },
            assignmentData: {
                default: () => {
                    return []
                }
            },
            jhdata: {
                default: () => {
                    return {}
                }
            },
            constantCode: {
                // OID_WJGL 文件管理   OID_GLPS 管理评审
                default: 'OID_WJGL'
            }
        },
        data() {
            return {
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
                    {label: "执行阶段", code: "stage", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJHBM_STATUS'},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                ],
                formModel: {
                    filetype: '',
                    fileVersion: '',
                    oidZljh: '',
                    zljhCode: '',
                    depName: '',
                    oidDepRel: '',
                    // 根节点
                    oidType: '',
                    depRelCode: '',
                    depRelName: '',
                    startingTimeOfConsultation: '',
                    endTimeOfConsultation: '',
                    askingForAdvice: 0,
                },
                rules: {
                    fileVersion: [{required: true, message: '请选择文件版本', trigger: 'blur'}],
                    filetype: [{required: true, message: '请选择文件类型', trigger: 'change'}],
                    startingTimeOfConsultation: [{required: true, message: '请选择起始时间', trigger: 'change'}],
                    endTimeOfConsultation: [{required: true, message: '请选择终止时间', trigger: 'change'}],
                },
                loading: false,
                queryListFiles: [],
                // 选择计划配置项
                jhVisible: false,
                jhQuerys: [
                    {type: 'input', code: 'jhCode', label: '计划编码', value: ''},
                    {type: 'input', code: 'jhName', label: '计划名称', value: ''},
                    {
                        type: 'static', code: 'jhType', label: '计划名称', value: () => {
                            return this.constantCode == 'OID_WJGL' ? ZLJHZT.WJBZXD : ZLJHZT.GLPS;
                        }
                    },


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
                transferTree: {
                    treeData: {
                        // 请求树接口地址
                        api: '',
                        lazy: false,
                        nodeKey: 'code',
                        // 配置字段
                        props: {
                            label: 'name',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {},
                        code: 'code',
                        // 返回解析字段
                        callback: this.getTreeData
                    },

                },
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                // 主附件数据
                hostFile: {},
                // minVersion
                minVersion: null
            }
        },
        computed: {
            treeUrl() {
                if (this.oidType) {
                    return "/pms/FrameAppDataDictionaryType/tree?oidType=" + this.oidType;
                } else {
                    return ''
                }
            },
            askingForAdvice() {
                return this.formModel.fileVersion == 'WJBB01' ? 1 : 0;
            },
            dataMap() {
                let data = this.getDataMap()('QIS_TXWJBB');
                let obj = {};
                if (this.minVersion) {
                    console.log(this.minVersion, 'minversion')
                    if (data) {
                        for (let i in data) {
                            if (i > this.minVersion) {
                                obj[i] = data[i];
                            }
                        }
                    }
                } else {
                    obj = data;
                }
                return obj ? obj : []
            },
            // 选择附件密级控制
            conMj() {
                console.log(this.jhdata, 'jhdata')
                return [this.jhdata.dataSecretLevcode]
            }
        },
        watch: {
            treeUrl() {
                this.transferTree.treeData.api = this.treeUrl;
            },
            assignmentData() {
                if (this.assignmentData[0]) {
                    this.formModel = this.assignmentData[0];
                    this.formModel.oidFj = this.formModel.dataid;
                    this.getFfFiles(this.formModel);
                    console.log(this.formModel, 'this.assignmentData')
                }
            },
            'formModel.oidFj'() {
                console.log(this.formModel.oidFj, 'formModel.oidFj')
                if (!this.formModel.oidFj) {
                    this.hostFile = {};
                }
            }
        },
        created() {
            this.transferTree.treeData.api = this.treeUrl;
            if (this.assignmentData[0]) {
                this.formModel = this.assignmentData[0];
                this.formModel.oidFj = this.formModel.dataid;
                this.getFfFiles(this.formModel);
                console.log(this.formModel, 'this.assignmentData')
            }
            this.addUndoTypeCodes('QIS_TXWJBB');
            console.log(this.dataMap, 'dataMap')
        },
        methods: {
            ...mapMutations("datamapStore", ["addUndoTypeCodes"]),
            ...mapGetters("datamapStore", ["getDataMap"]),
            // 主附件上传
            fileUploadSuccess(data, file) {
                let obj = {
                    filename: file.name,
                    dataid: data.data,
                    dataSecretLevcode: data.securityLevel,
                    fileSize: file.size,
                    main: 1
                };
                this.hostFile = obj;
            },
            // 查询副附件
            getFfFiles (row) {
                this.$axios.get("/pms/QisFileinfo/listFile2", {
                    params: {
                        dataid: row.dataid,
                    }
                }).then(resault => {
                    this.queryListFiles = resault.data;
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            change(data) {
                if (!data) {
                    this.hostFile = {};
                }
            },
            // 获取文件版本可选范围
            choosableVersion() {
                this.$axios.get("/pms/QisFileinfo/maxVersion", {
                    params: {
                        oidDeprel: this.formModel.oidDepRel,
                    }
                }).then(result => {
                    this.minVersion = result.data;
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            // 重置formModel
            resetFormModel() {
                this.$nextTick(_ => {
                    this.$refs.definition.resetFields();
                    if (this.jhdata.jhCode) {
                        this.formModel = {
                            filetype: '',
                            fileVersion: '',
                            oidZljh: this.jhdata.oid,
                            zljhCode: this.jhdata.jhCode,
                            depName: '',
                            oidDepRel: this.jhdata.depOid,
                            // 根节点
                            oidType: '',
                            depRelCode: this.jhdata.depCode,
                            depRelName: this.jhdata.depName
                        };
                        this.choosableVersion();
                    } else {
                        this.formModel = {
                            filetype: '',
                            fileVersion: '',
                            oidZljh: '',
                            zljhCode: '',
                            depName: '',
                            oidDepRel: '',
                            // 根节点
                            oidType: '',
                            depRelCode: '',
                            depRelName: '',
                            oidFj: ""

                        };
                        this.minVersion = null;
                    }
                })
            },
            // 验证
            async formValidate() {
                if (!this.hostFile.dataid) {
                    this.$message.warning("请选择主附件");
                    return false;
                }
                let a = await this.$refs.definition.validate();
                return a;
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
                this.formModel.depRelCode = this.bmjhData[0].depCode;
                this.formModel.depRelName = this.bmjhData[0].depName;
                this.formModel.oidDepRel = this.bmjhData[0].oid;
                this.bmVisible = false;
                this.choosableVersion();
            },
            // 获取部门执行数据
            getDeptList() {
                let comumns = this.bmColumns.map(c => {
                    return c.code;
                })
                let staticConditions = [
                    {'column': 'jhOid', exp: '=', value: this.formModel.oidZljh},
                    {'column': 'type', exp: '=', value: 0},
                ]
                this.$axios.get("/pms/QisJhDepRel/selectForUploadFile", {
                    params: {
                        oidJh: this.formModel.oidZljh
                    }
                }).then(result => {
                    this.tableData = result.data;
                }).catch(e => {
                    this.loading = false
                })
            },
            changeFj() {

            },
            getTreeData(data) {
                console.log(data);
                this.formModel.oidType = data.parentId;
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
                this.formModel.oidZljh = this.jhData[0].oid;
                this.formModel.zljhCode = this.jhData[0].jhCode;
                this.jhVisible = false;
            },
            // 获取数据
            getData() {
                let data = this.$refs.pmsXmRwFjListXmsr1.getData();
                this.formModel.askingForAdvice = this.askingForAdvice;
                let arr = [];
                this.hostFile = {...this.hostFile, ...this.formModel}
                data.forEach(c => {
                    c = {...c, ...this.formModel};
                    c.main = 0;
                    c.oidParent = this.hostFile.dataid;
                    arr.push(c);
                })
                arr.push(this.hostFile);
                return arr;
            }
        }
    }
</script>

<style scoped>
    .hint {
        color: #f30213;
        font-size: 14px;
    }
</style>

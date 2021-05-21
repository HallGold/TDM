<template>
    <div>
        <el-container>
            <el-main>
                <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="合同名称" label-width="110px" prop="htname">
                                    <el-input v-model="formModel.htname"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同编号" label-width="110px" prop="htcode">
                                    <el-input v-model="formModel.htcode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="甲方" label-width="110px" prop="htjf">
                                    <el-input v-model="formModel.htjf"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="乙方" label-width="110px" prop="htyf">
                                    <el-input v-model="formModel.htyf"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同金额" label-width="110px" prop="htje">
                                    <el-input type="number" v-model="formModel.htje" :precision="2" :step="1" >
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="合同签订日期" label-width="110px" prop="dateCreate">
                                    <el-date-picker v-model="formModel.dateCreate"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同生效日期" label-width="110px" prop="dateStart">
                                    <el-date-picker v-model="formModel.dateStart"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同终止日期" label-width="110px" prop="dateEnd">
                                    <el-date-picker v-model="formModel.dateEnd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="合同类型" label-width="110px" prop="htlx">
                                    <ice-select v-model="formModel.htlx" map-type-code="HTLX"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="份数" label-width="110px" prop="htNum">
                                    <el-input-number v-model="formModel.htNum"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="登记部门" label-width="110px" prop="htdept">
                                    <el-input v-model="formModel.htdept"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="合同概要" label-width="110px" prop="htrw">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.htrw"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea" v-model="formModel.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    <el-row>
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="合同附件" name="first">
                                <ATTACHMENT :data="attaTableData" ref="attachment"></ATTACHMENT>
                            </el-tab-pane>
                            <el-tab-pane  v-if="isvisibleBtn" label="关联项目" name="second">
                                <el-button type="primary" @click="addProject">添加</el-button>
                                <el-button type="danger" @click="deleteProject">删除</el-button>
                                <vxe-table border show-overflow
                                           ref="projectTable"
                                           auto-resize
                                           max-height="200"
                                           :data="projectTableData">
                                    <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                                    <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                    <vxe-table-column field="xmname" title="项目名称" width="200"></vxe-table-column>
                                    <vxe-table-column field="xmcode" title="所内项目编号" width="200"></vxe-table-column>
                                </vxe-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-row>
                </el-form>
            </el-main>
            <el-footer v-if="isvisibleBtn">
                <div class="ice-button-bar">
                    <el-button type="primary" @click="confirm">确认</el-button>
                    <el-button type="info" @click="back">关闭</el-button>
                </div>
            </el-footer>
        </el-container>
        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @closeVisible="closeVisible" @select="selectProject"></XM_SELECT>
        </ice-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import XM_SELECT from "../common/XM_SELECT";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import UploadAttachment from "../../biz/dev/comm/uploadAttachment";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../common/ATTACHMENT";

    export default {
      props: {
        isvisibleBtn: {
          default: true
        }
      },
        components: {
            ATTACHMENT,
            IceSingleUpload, UploadAttachment, IceMultipleUpload, XM_SELECT, IceSelect, IceDialog, IceQueryGrid},
        data() {
            return {
                loading: false,
                activeName: 'first',
                visibleProject: false,
                attaTableData: [],
                projectTableData: [],
                oid: this.$route.query.oid,

                formModel: {
                    oid: '',
                    htname: '',
                    htcode: '',
                    htjf: '',
                    htyf: '',
                    htje: '',
                    dateCreate: '',
                    dateStart: '',
                    dateEnd: '',
                    htwz: '',
                    htlx: '',
                    htNum: '',
                    htrw: '',
                    htfj: '',
                    htbctk: '',
                    htdept: '',
                    dataSecretLevcode: '2',
                    dateRemark: '',

                    xtFjs: [],
                    xminfos: [],
                },
                rules: {
                    htname: [
                        {required: true, whitespace: true, message: '请输入合同名称', trigger: 'blur'}
                    ],
                    htcode: [
                        {required: true, whitespace: true, message: '请输入合同编号', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    htjf: [
                        {required: true, whitespace: true, message: '请输入甲方名称', trigger: 'blur'}
                    ],
                    htyf: [
                        {required: true, whitespace: true, message: '请输入乙方名称', trigger: 'blur'}
                    ],
                    htje: [
                        {required: true, message: '请输入合同金额', trigger: 'blur'}
                    ],
                    dateCreate: [
                        {required: true, message: '请选择合同签订日期', trigger: 'blur'}
                    ],
                    dateStart: [
                        {required: true, message: '请选择合同生效日期', trigger: 'blur'}
                    ],
                    dateEnd: [
                        {required: true, message: '请选择合同终止日期', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC"},
                ],
            }
        },
        methods: {
            confirm() {
                // 项目数据
                let insertProjectData = this.$refs.projectTable.getInsertRecords();
                let removeProjectData = this.$refs.projectTable.getRemoveRecords();
                let updateProjectData = this.$refs.projectTable.getUpdateRecords();
                console.log(removeProjectData)
                removeProjectData.map(o => {
                    o.version = -1;
                    o.pmsHtinfoList = [];
                    o.pmsXminfoCyList = [];
                    o.pmsXmRwFjListXmsr = [];
                    o.pmsFxqdList = [];
                    o.xtFjList = [];
                    o.pmsXmRwFjListXmsc = [];
                });

                this.formModel.xtFjs = this.$refs.attachment.getData();
                this.formModel.xminfos = insertProjectData.concat(removeProjectData,updateProjectData);

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsHtinfo/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                //this.$refs.grid.refresh();
                                this.back();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                            })
                    }
                })

            },
            // 清空数据
          emptyFormModel () {
            this.$refs.form.resetFields();
            this.attaTableData = [];
          },

          // 确定选择数据
            confirmSave () {
// 项目数据
              this.formModel.xtFjs = this.$refs.attachment.getData();

              this.$refs.form.validate((valid) => {
                if (valid) {
                  this.$emit('handleCallback', this.formModel);
                }
              })
            },

            back () {
                this.$router.go(-1);
            },

            // --------- 项目关联 start ----------
            addProject () {
                this.visibleProject = true;
            },
            deleteProject () {
                this.$refs.projectTable.removeSelecteds()
            },
            // 获取合同项目数据
            getHtXmData(oidHt){
                this.$axios.get("/pms/Xminfo/listByOidHt", {params: {oidHt: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            this.projectTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取合同项目数据失败！")
                    })
            },
            // 获取合同附件数据
            getHtFjData(oidHt){
                this.$axios.get("/pms/XtFj/listByOidHt", {params: {oidHt: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取合同附件数据失败！")
                    })
            },
            selectProject(item) {
              item.forEach((c ,i)=>{
                let record = {oid: c.oid, xmcode: c.xmcode, xmname:c.xmname}
                this.$refs.projectTable.insertAt(record, -1)
                  .then(({ row }) => this.$refs.projectTable.setActiveCell(row))
              })
                this.visibleProject = false;
            },
          closeVisible () {
              this.visibleProject = false;
          }
            // --------- 项目关联 end ----------

        },

        created () {
            if(this.oid){
                this.$axios.get("/pms/PmsHtinfo/get", {params: {id: this.oid}})
                    .then(result => {
                        this.formModel = {...result.data}
                        this.getHtFjData(this.oid);
                        this.getHtXmData(this.oid);
                    })
                    .catch(error => {
                        this.$message.error("查询失败")
                    })

            }

        },

        computed: {}
        ,
        watch: {}
        ,
        mounted() {

        }
        ,
    }
</script>


<style scoped>

</style>
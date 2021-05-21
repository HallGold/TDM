<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/PmsCgZlinfo/list"
                exportTitle="合同信息登记"
                :operations-width="120"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                ref="grid"
                chooseItem="single"
                @selection-change="handleSectItem">
        </ice-query-grid>
        <ice-dialog title="新增专利清单" :visible.sync="visible" width="800px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="专利申请" name="first">
                    <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务" label-width="110px" prop="rwname">
                                    <el-input ref="rwInp" @focus="handleDialog" v-model="formModel.rwname"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目" label-width="110px" prop="xmname">
                                    <el-input ref="xmInp" @focus="addProject" v-model="formModel.xmname"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="专利号" label-width="110px" prop="zlcode">
                                    <el-input v-model="formModel.zlcode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="专利名称" label-width="110px" prop="zlname">
                                    <el-input v-model="formModel.zlname"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="申请人" label-width="110px" prop="sqr">
                                    <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                          v-model="formModel.sqr"
                                                          @select-confirm="depts=>formModel.sqrCode=depts[0].code">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="专利类型" label-width="110px" prop="zllx">
                                    <ice-select v-model="formModel.zllx" map-type-code="ZLLX"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select :control-mj="controlMj" :controlMjPar="controlMjPar"
                                                v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item label="申请单位" label-width="110px" prop="sqdw">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                       v-model="formModel.sqdw"
                                                       @select-confirm="depts=>formModel.sqdwCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="申请理由" label-width="110px" prop="sqly">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.sqly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="专利批复意见" label-width="110px" prop="pfyj">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.pfyj"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="附件上传" name="second">
                    <el-row>
                        <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" ref="attachment"
                                    :data="attaTableData"></ATTACHMENT>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="选择项目" :visible="visibleProject" width="1000px">
            <XM_SELECT choose-item="single" @select="selectProject" @closeVisible="visibleProject=false"></XM_SELECT>
        </ice-dialog>

        <!--选择-->
        <pms-table-tree ref="tabletree" :unbrid="unbrid"
                        :dialogConfig="dialogConfig"
                        :tableObject="tableObject"
                        :inpWidth="width"
                        :transfer="transfer"
                        @handleCallback="handleCallback"
                        @handleClose="handleToggleDialog"
                        @handleTreeCallback="handleTreeCallback">
        </pms-table-tree>
        <!--<ice-dialog :visible.sync="visibleProject" width="800px">-->
        <!--<el-tabs>-->
        <!--<el-row>-->
        <!--<xm-selector  @select="selectProject"></xm-selector>-->
        <!--</el-row>-->
        <!--</el-tabs>-->
        <!--</ice-dialog>-->
    </div>
</template>

<script>
    import ATTACHMENT from '../common/ATTACHMENT' // 附件上传
    import PmsTableTree from '@/components/common/pms/group/PmsTableTree' // 选择
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import XM_SELECT from "../common/XM_SELECT";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import UploadAttachment from "../../biz/dev/comm/uploadAttachment";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";

    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import {mapGetters, mapMutations} from 'vuex'

    // 获取近5年的年份
    function nearFiveYears() {
        let date = new Date();
        let currentYear = date.getFullYear();
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push(currentYear);
            currentYear -= 1;
        }
        return arr.join(',');
    }

    export default {
        components: {
            IceSingleUpload,
            UploadAttachment,
            IceMultipleUpload,
            XM_SELECT,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsTableTree,
            IceDeptSelector,
            IcePersionSelector
        },
        data() {
            return {
                loading: false,
                visible: false,
                activeName: 'first',

                visibleProject: false,
                attaTableData: [],
                projectTableData: [],
                formModel: {
                    oid: '',
                    rwname: '', // 任务名称
                    sqdate: '', // 申请日期
                    sqdw: '', // 申请单位
                    sqly: '', // 申请理由
                    sqr: '', // 申请ren
                    xmname: '', // 项目名称
                    zllx: '', // 专利类型
                    zlcode: '', // 专利号
                    zlname: '', // 专利类型
                    dataSecretLevcode: '', // 密级
                    pfyj: '', // 批复意见
                    dateRemark: '',// 备注,
                    oidRw: '',
                    wbscode: '',
                    oidXm: '',
                    xmcode: '',
                    fjs: []
                },
                formData: {},
                query: [
                    {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                    {type: 'input', code: 'rwname', label: '任务名称', value: ''},
                    {type: 'input', code: 'sqr', label: '申请人', value: ''},
                    {type: 'input', code: 'sqdw', label: '申请单位', value: ''},
                    {type: 'date', code: 'sqdate', label: '申请日期', value: ''},
                    {type: 'input', code: 'zlname', label: '专利名称', value: ''},
                    {type: 'input', code: 'zlcode', label: '专利号', value: ''},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'dateRemark', hidden: true},
                    {label: '项目名称', code: 'xmname', width: 160},
                    {label: '任务名称', code: 'rwname', width: 140},
                    {label: '申请人', code: 'sqr', width: 120},
                    {label: '申请单位', code: 'sqdw', width: 120, hidden: true},
                    {label: '申请单位', code: 'sqdwCode', width: 120, cusMapTypeCode: 'DEPT'},
                    {
                        label: '申请日期', code: 'sqdate', width: 130, sortable: true, formatter(row) {
                            return moment(row.dateCreate).format('YYYY-MM-DD');
                        }
                    },
                    {label: '申请专利名称', code: 'zlname', width: 100,},
                    {label: '专利号', code: 'zlcode', width: 80},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                ],
                buttons: [
                    {name: '刷新', icon: 'el-icon-refresh', type: 'primary', ctrlCode: "BSX", callback: this.refreshGrid},
                    {name: '新增', icon: 'el-icon-plus', type: 'success', ctrlCode: "BXZ", callback: this.addItem},
                    // {name: '删除', icon: 'el-icon-delete', type: 'danger', ctrlCode: "BXZ", callback: this.delItems},
                ],
                // rwname: '', // 任务名称
                // sqdate: '', // 申请日期
                // sqdw: '', // 申请单位
                // sqly: '', // 申请理由
                // sqr: '', // 申请ren
                // xmname: '', // 项目名称
                // zllx: '', // 专利类型
                // zlname: '', // 专利类型
                // dataSecretLevcode: '', // 密级
                // pfyj: '', // 批复意见
                // dateRemark: ''// 备注
                rules: {
                    // rwname: [
                    //     {required: true, whitespace: true, message: '请输入任务名称', trigger: 'blur'}
                    // ],
                    xmname: [
                        {required: true, whitespace: true, message: '请输入项目名称', trigger: 'blur'}
                    ],
                    zlcode: [
                        {required: true, whitespace: true, message: '请输入专利号', trigger: 'blur'}
                    ],
                    zlname: [
                        {required: true, whitespace: true, message: '请输入专利名称', trigger: 'blur'}
                    ],
                    sqr: [
                        {required: true, whitespace: true, message: '请输入申请人', trigger: 'blur'}
                    ],
                    zllx: [
                        {required: true, whitespace: true, message: '请选择专利类型', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    sqdw: [
                        {required: true, message: '请输入申请单位', trigger: 'blur'}
                    ],
                    sqdate: [
                        {required: true, message: '请选择申请日期', trigger: 'blur'}
                    ],
                    sqly: [
                        {required: true, message: '请选择申请理由', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.dbClick, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC"},
                ],
                // 选择---------
                width: '300px',
                unbrid: false,
                transfer: {
                    nodeKey: 'oid',
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/Xminfo/listByYear',
                        lazy: false,

                        // 配置字段
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {
                            years: nearFiveYears()
                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,

                },
                tableObject: {
                    buttons: [],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'oidXm', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', width: 200},
                        {label: '任务名称', code: 'rwname', width: 200,},
                        {label: '前置任务', code: 'qzrw', width: 200},
                        {label: '工期', code: 'rwgq', width: 100},
                        {label: '实际开始日期', code: 'dateSjStar', width: 200},
                        {label: '实际完成日期', code: 'dateSjEnd', width: 200,},
                        {label: '部门', code: 'rwdept', width: 140,},
                        {label: '任务负责人', code: 'rwfzr', width: 140},
                        {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: 'DATA_SECRET_LEVEL'},

                    ],
                    query: [
                        {type: 'static', code: 'oidXm', value: '0'},
                        //过滤掉任务状态为未下发的
                        {type: 'static', code: 'rwzt', value: 'RWZT10', exp: '!='},
                    ],
                    gridData: [],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                // 项目密级
                xmMj: 100,
                // 任务密级
                rwMj: 100,
                fjdata: [],
            }
        },
        computed: {
            controlMj () {
                console.log([this.xmMj, this.rwMj], '[this.xmMj, this.rwMj]')
                return [this.xmMj, this.rwMj]
            },
            controlMjFj () {
                return this.formModel.dataSecretLevcode?[...this.controlMj, this.formModel.dataSecretLevcode]: this.controlMj;
            },
            controlMjPar () {
                return this.fjdata.map(c=>{
                    return c.dataSecretLevcode
                })
            }
        },
        created() {

        },
        methods: {
            changeFj (data) {
                this.fjdata = data;
            },

            ...mapMutations('menuStore', ['closeTagByurl']),
            // 双击行
            dbClick(data) {
                console.log(data)
                this.getZlDetail(data.oid);
                this.getZlFj(data.oid);
            },
            // 获取单个附件关联列表
            getZlFj(id) {
                this.loading = true
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: id}})
                    .then(result => {
                        // this.formModel = result.data;
                        //this.visible = true;
                        this.attaTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 获取单个
            getZlDetail(id) {
                this.loading = true
                this.$axios.get("/pms/PmsCgZlinfo/get", {params: {id: id}})
                    .then(result => {
                        this.$nextTick(_ => {
                            this.formModel = {...result.data}
                        })
                        this.visible = true;
                    })
                    .catch(error => {
                        this.$message.error("保存失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 选择项目
            selectProject(data) {
                console.log(data);
                this.$refs.xmInp.focus();
                this.formModel.xmname = data[0].xmname;
                this.formModel.oidXm = data[0].oid;
                this.formModel.xmcode = data[0].xmcode;
                this.visibleProject = !this.visibleProject;
                this.xmMj = item[0].dataSecretLevcode
                console.log(this.visibleProject)

            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {

                console.log('11', data)

                // 回调后数据操作
                this.formModel.rwname = data[0].rwname;
                this.formModel.oidRw = data[0].oid;
                this.formModel.wbscode = data[0].wbscode;
                this.rwMj = data[0].dataSecretLevcode
                this.formModel.xmname = data[0].xmname;
                this.formModel.oidXm = data[0].oidXm;
                this.formModel.xmcode = data[0].xmcode;

                this.$refs.rwInp.focus();
            },
            // 点击弹出选择任务
            handleDialog() {
                this.dialogConfig.visible = true;
            },
            // 树组件选中回调
            handleTreeCallback(data) {
                this.tableObject.query[0].value = data.oid;
                // 刷新表格
                this.$refs.tabletree.refresh();
            },
            handleToggleDialog() {
                this.dialogConfig.visible = !this.dialogConfig.visible;
            },
            // 选中的清单
            handleSectItem(data) {
            },
            // 添加专利
            addItem() {
                this.attaTableData = [];
                this.projectTableData = [],
                    this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.attaTableData = [];
                })
            },
            //刷新按钮
            refreshGrid() {
                this.$refs.grid.refresh();
            },
            // 提交
            confirm() {
                // 附件数据
                this.formModel.fjs = this.$refs.attachment.getData();
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsCgZlinfo/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
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
            // 编辑
            edit(row) {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                })
                this.projectTableData = [];
                this.attaTableData = [];
                this.getHtFjData(row.oid);
                this.getHtXmData(row.oid);
            }
            ,
            // 批量删除
            delItems() {

            },
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsCgZlinfo/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },

            // --------- 附件关联 start ----------
            addAtta(response, file, fileList) {
                console.log(response)
                console.log(file)
                console.log(fileList)
                let record = {filename: file.name, fileSize: file.size}
                this.$refs.attaTable.insertAt(record, -1)
                    .then(({row}) => this.$refs.attaTable.setActiveCell(row))

            },
            deleteAtta() {
                this.$refs.attaTable.removeSelecteds()
            },
            // --------- 附件关联 end ----------

            // --------- 项目关联 start ----------
            addProject() {
                console.log(123)
                this.visibleProject = true;
            },
            deleteProject() {
                this.$refs.projectTable.removeSelecteds()
            },
            // 获取合同项目数据
            getHtXmData(oidHt) {
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
            getHtFjData(oidHt) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取合同附件数据失败！")
                    })
            },
            // --------- 项目关联 end ----------
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                //this.$downloadFile(fileId);
                this.$refs.fileUpload.reset();
                this.$refs.attaTable.insertAt(record, -1)
                    .then(({row}) => this.$refs.attaTable.setActiveCell(row));
            },

            downloadFile(row) {
                this.$downloadFile(row.dataid);
            }
        }
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

<template>
    <div class="ice-container">
        <!--《安全论证申报》列表展示页面-->
        <ice-query-grid
                data-url="pms/QisYhgl/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="隐患管理"
        >
        </ice-query-grid>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible"  width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="隐患编号" label-width="140px" prop="yhCode">
                            <el-input  v-model="formModel.yhCode" placeholder="自动生成" readonly :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检查形式" label-width="140px" prop="jcxs">
                            <el-input maxlength="30" v-model="formModel.jcxs" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="责任单位" label-width="140px" prop="zrdwName">
                            <ice-dept-selector  chooseItem="single" mode="onlySelect"
                                                v-model="formModel.zrdwName"
                                                @select-confirm="depts=>formModel.zrdwCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="隐患位置" label-width="140px" prop="yhwz">
                            <el-input maxlength="30" v-model="formModel.yhwz" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第三行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检查时间" label-width="140px" prop="jcsj">
                            <el-date-picker v-model="formModel.jcsj"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                            <ice-select :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第四行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="隐患描述" label-width="110px" prop="yhms">
                            <el-input v-model="formModel.yhms" placeholder="填写不超过500个字" maxlength="500" show-word-limit type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第五行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="治理要求" label-width="110px" prop="zlyq">
                            <el-input v-model="formModel.zlyq" placeholder="填写不超过500个字" maxlength="500" show-word-limit type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第五行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="隐患类型" label-width="110px" prop="zlyq">
                            <check-item :mapTypeCode="mapTypeCode" v-model="formModel.yhlx"></check-item>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="申报人填写不超过500个字" type="textarea" :rows="2" maxlength="650" show-word-limit>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" Height="200px" :data="xtFjList" ref="qisAqJj"></ATTACHMENT>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="conserve" :disabled = "disabled">保存</el-button>
                        <el-button type="info" @click="visible=false">返回</el-button>
                    </div>
                </el-row>

            </el-form>

        </ice-dialog>
    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //隐患管理
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import checkItem from "../components/checkItem";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import codeConfigRequest from '@/utils/codeConfigRequest'
    export default {
        name: "yhgl",
        mixins: [codeConfigRequest],
        components: {IceQueryGrid, ATTACHMENT, checkItem, IceSelect, IceDeptSelector},

        data(){
            return{
              queryListXmsc: [],
                //默认模态框标题为空
                title:'',
                //默认模态框状态为“关闭”
                visible:false,
                //加载动态转圈
                loading:false,

                disabled: true,
                yhValue:[
                    {label:'一般隐患', value:'YH001'},
                    {label:'重大隐患', value:'YH002'},
                    ],
                //查询
                query: [
                    {type: 'input', code: 'yhCode', label: '隐患编号', value: ""},
                    {type: 'input', code: 'jcsj', label: '检查时间', value: ""},
                    {type: 'input', code: 'jcxs', label: '检查形式', value: ""},
                    {type: 'input', code: 'zrdwName', label: '责任单位名称', value: ""},
                    {type: 'input', code: 'zlyq', label: '治理要求', value: ""},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],

                //调用网格数据
                columns:[
                    {code: "oid", hidden: true},
                    {label: "隐患编号", code: "yhCode",sortable: true},
                    {label: "检查时间", code: "jcsj", },
                    {label: "检查形式", code: "jcxs", },
                    {label: "隐患位置", code: "yhwz",  hidden: true},
                    {label: "隐患类型", code: "yhlx", hidden: true},
                    {label: "隐患描述", code: "yhms", sortable: true},
                    {label: "责任单位名称", code: "zrdwName", hidden: true},
                    {label: "责任单位", code: "zrdwCode", cusMapTypeCode: 'DEPT'},
                    {label: "治理要求", code: "zlyq", },
                    {label: "备注", code: "dateRemark", hidden: true},
                    {label: "密级", code: "dataSecretLevcode",mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "承担单位", code: "cddw",hidden: true },
                ],
                //按钮操作
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refreshGrid
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    //{name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "add",callback: this.refresh},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC",type: 'danger'},
                ],

                //验证不能为空
                rules:{
                    hdName: [
                        { required: true, message: '名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        { required: true, message: '密级不能为空'}
                    ],
                },

                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel:{
                    oid:'',
                    yhCode:'',//隐患编号
                    jcxs:'',//检查形式
                    jcsj:new Date(),//检查时间
                    zrdwCode:'',//责任单位编号
                    zrdwName:'',//责任单位名称
                    yhwz:'',//隐患位置
                    yhlx:'',//隐患类型
                    yhms:'',//隐患描述
                    zlyq:'',//治理要求
                    cddw:'',//承担单位
                    dataSecretLevcode:'',//密级
                    dateRemark:'',//备注
                },
                mapTypeCode: 'YHLX',
              xtFjList: [],
                changeFjSrdata: []

            }
        },
      computed: {
          controlFjMj() {
              return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
          },
          controlMjPar() {
              // 附件
              let arr2 = this.changeFjSrdata.map(c => {
                  return c.dataSecretLevcode
              })
              return [...arr2];
          }
      },
      created () {

      },
        //专门写方法的区域
        methods:{
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 刷新
            refreshGrid () {
                this.$refs.grid.refresh();
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'yhgl'}).then(res => {
                    this.formModel.yhCode = res.number;
                })
            },
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh(){
                this.$refs.grid.refresh();
            },

            //新增安全论证申报模态框
            addItem(){
                this.title = '新增安全隐患治理通知单';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                        this.xtFjList = [];
                    }
                    this.getCode();
                })
            },

            //调用保存方法
            conserve(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var files = [];
                        files.push(this.fileInfo)
                        this.save('保存成功！','保存失败！');
                    }
                })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            save(success, fail){
                this.loading = true;
                  let fj = this.$refs.qisAqJj.getData();
                  this.formModel.xtFjList = fj.length != 0 ? fj : [];
                this.$axios.post("/pms/QisYhgl/saveOrUpdateByMultiTableYhgl", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        this.$refs.grid.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
          // 查询附件
          getFj (oid) {
            this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
              .then(result => {
                this.xtFjList = result.data;
                  this.changeFjSrdata = this.xtFjList;
              })
              .catch(error => {
                this.$message.error(fail)
              })
              .finally(_ => {
                this.loading = false
              })
          },
            //选中一行进行编辑
            edit(row){
                this.title = '编辑安全隐患治理通知单';
                this.visible = true;
                this.disabled = false;
                this.xtFjList = [];
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                    this.getFj(row.oid)
                    this.$refs.qisAqJj.resize();
                })

                //this.getFjData(row);
            },

            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisYhgl/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取单个失败！")
                    })
            },
            //选中一行进行删除
            delete(row){
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.formModel.deleteStatus = 1;
                    console.log(this.formModel)
                    // return
                    this.save('删除成功！','删除失败！');
                })
            },


        },
    }
</script>
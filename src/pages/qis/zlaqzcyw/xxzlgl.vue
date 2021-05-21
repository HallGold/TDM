<template>
    <div class="ice-container">
        <!--《学习资料管理》列表展示页面-->
        <ice-query-grid
                data-url="pms/QisZytj/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="职业体检台账"
        >
        </ice-query-grid>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible"  height="260px" width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="人员姓名" label-width="140px" prop="ryName">
                            <el-input v-model="formModel.ryName" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="台账分类" label-width="140px" prop="tzlx">
                            <el-input v-model="formModel.tzlx" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属单位" label-width="140px" prop="rydwName">
                            <el-input v-model="formModel.rydwName" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体检项目" label-width="140px" prop="tjxmIds">
                            <el-input v-model="formModel.tjxmIds" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第三行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="体检费用" label-width="140px" prop="tjfy">
                            <el-input v-model="formModel.tjfy" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体检时间" label-width="140px" prop="tjDate">
                            <el-input v-model="formModel.tjDate" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第四行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="申报人填写不超过500个字" type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
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
    //学习资料管理
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    export default {
        name: "xxzlgl",
        components: {IceQueryGrid},

        data(){
            return{
                //默认模态框标题为空
                title:'',
                //默认模态框状态为“关闭”
                visible:false,
                //加载动态转圈
                loading:false,

                disabled: true,

                //查询
                query: [
                    {type: 'input', code: 'lzCode', label: '论证编号'},
                    {type: 'input', code: 'hdName', label: '活动名称'},
                ],

                //调用网格数据
                columns:[
                    {code: "oid", hidden: true},
                    {label: "体检人员名称", code: "ryName",},
                    {label: "所属单位名称", code: "rydwCode", },
                    {label: "体检年份", code: "tjYear", },
                    {label: "体检时间", code: "tjDate", hidden: true},
                    {label: "体检费用", code: "tjfy", hidden: true},
                    {label: "体检项目ID集合", code: "tjxmIds", hidden: true},
                    {label: "台账类型", code: "tzlx", hidden: true},
                    {label: "所属单位编号", code: "rydwCode", hidden: true},
                    {label: "简要描述", code: "jyms", hidden: true},
                    {label: "备注", code: "dateRemark", hidden: true},
                    {label: "密级", code: "dataSecretLevcode", hidden: true},
                ],
                //按钮操作
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "refresh", callback: this.addItem},
                    //{name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "add",callback: this.refresh},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BXZ1"},
                    {name: '删除', callback: this.delete, ctrlCode: "del",type: 'danger'},
                ],

                //验证不能为空
                rules:{
                    hdName: [
                        { required: true, message: '名称不能为空'}
                    ],
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel:{
                    oid:'',
                    ryName:'',//体检人员名称
                    rydwCode:'',//所属单位编号
                    rydwName:'',//所属单位名称
                    tzlx:'',//台账类型
                    tjxmIds:'',//体检项目ID集合
                    tjfy:'',//体检费用
                    tjDate:'',//体检时间
                    tjYear:'',//体检年份
                    dataSecretLevcode:'',//密级
                    dateRemark:'',//备注
                },


            }
        },

        //专门写方法的区域
        methods:{
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh(){
                this.$refs.grid.refresh();
            },

            //新增安全论证申报模态框
            addItem(){
                this.title = '新增职业体检台账';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
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
                this.formModel.dataSecretLevcode = 2;
                this.$axios.post("/pms/QisZytj/saveOrUpdate", this.formModel)
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
            //选中一行进行编辑
            edit(row){
                this.title = '编辑职业体检台账';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                    this.$refs.fileUpload.reset();
                })
                //this.getFjData(row);
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
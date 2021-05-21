<template>
    <div>
        <!--弹出模态框-->
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" :v-loading="loading">
                <el-row :gutter="20">
                    <input :value="formModel.oid" type="hidden">
                    <input :value="formModel.oidRw" type="hidden">
                    <input :value="formModel.oidXm" type="hidden">
                    <!--模态框内容-->
                    <!--第一行内容-->
                    <el-col :span="12">
                        <el-form-item label="反馈类型" label-width="100px" prop="feedbackType">
                            <ice-select v-model="formModel.feedbackType"
                                        map-type-code="RW_FKLX"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select disabled v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="反馈描述" label-width="100px" prop="rzms">
                            <el-input placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model="formModel.rzms" type="textarea" :rows="5">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <!--模态框底部定义按钮-->
            <div class="ice-button-bar">
                <!-- <slot name="footer" :row="formModel"></slot> -->
                <el-button type="primary" @click="save">确定</el-button>
                <el-button type="info" @click="visible=false">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        props: {
            // 子组件接收函数
            pcomputeDate: {
                type: Function
            },
            dataSecretLevcode: {
                default: ''
            }
        },
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                rules: {
                    feedbackType: [
                        {required: true, whitespace: true, message: '请选择反馈类型', trigger: 'change'}
                    ],
                    rzms: [
                        {required: true, whitespace: true, message: '请输入反馈描述', trigger: 'blur'}
                    ],
                },
                //定义弹出框为false，隐藏状态
                visible: false,
                //true 不能编辑 false 可以编辑
                isEdit: false,
                isModel: false,
                isRwjf: false,
                title: '进展反馈',
                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    oidRw: '',
                    oidXm: '',
                    rztxr: '',
                    dataSecretLevcode: this.dataSecretLevcode,
                    rztxDate: '',
                    rzms: '',
                    feedbackType: '',
                    sbzt: '',
                    spzt: '',
                    handlingOpinions: '',
                    xmcode: '',
                    xmname: '',
                    wbscode: '',
                    rwname: ''
                },
                //定义模态框 转圈加载过程
                loading: false
            }
        },

        created() {

        },
        //计算属性
        computed: {},
        //触发事件方法
        methods: {

            save() {
                console.log(this.formModel)

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsRwRz/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.$emit("queryWorkLog")
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                                this.visible = false
                            })
                    }
                })
            },
            getParentParams(row) {
                this.formModel.oidRw = row.oid;
                this.formModel.oidXm = row.oidXm;
                this.formModel.rwname = row.rwname;
                this.formModel.wbscode = row.wbscode;
                this.formModel.xmname = row.xmname;
                this.formModel.xmcode = row.xmcode;
                this.visible = true;
                this.$nextTick(c => {
                    this.$refs.form.resetFields();
                    this.formModel.dataSecretLevcode = this.dataSecretLevcode;
                })
            },

        },
        watch: {},
        //这个是你引用插件生成的,不用管它
        components: {
            IceDialog,
            IceSelect
        }
    }
</script>

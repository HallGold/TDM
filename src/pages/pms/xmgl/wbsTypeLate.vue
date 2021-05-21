<template>
	<!--弹出模态框-->
	<ice-dialog :title="title" :visible.sync="visible" width="1000px">
        <div v-loading="loading">
            <el-form :model="formModel" :rules="rules" ref="form">
                <el-row>
                    <input :value="formModel.oid" type="hidden">
                    <!--模态框内容-->
                    <!--第一行内容-->
                    <el-col :span="12">
                        <el-form-item label="模板编号" label-width="100px" prop="wbsTypelateCode">
                            <el-input disabled :value="formModel.wbsTypelateCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="模板名称" label-width="100px" prop="wbsTypelateName">
                            <el-input v-model="formModel.wbsTypelateName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生效日期" label-width="100px" prop="wbsTypelateDateStart">
                            <el-date-picker v-model="formModel.wbsTypelateDateStart"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="停用日期" label-width="100px" prop="wbsTypelateDateEnd">
                            <el-date-picker v-model="formModel.wbsTypelateDateEnd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" filterable
                                        placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
            <!--模态框底部定义按钮-->
            <div class="ice-button-bar">
                <!-- <slot name="footer" :row="formModel"></slot> -->
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="visible=false">返回</el-button>
            </div>
        </div>

	</ice-dialog>
</template>

<script>
	import IceDialog from "../../../components/common/base/IceDialog";
	import IceSelect from "../../../components/common/base/IceSelect";

	export default {
		props: {},
		//为了不让多处的组件共享同一data对象，只能返回函数。
		data() {
			return {
				tableData: [],
				fileList: [],
				rules: {
					wbsTypelateName: [
						{required: true, whitespace: true, message: '请输入任务模板名称', trigger: 'blur'}
					],
					dataSecretLevcode: [
						{required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
					],
                    wbsTypelateDateStart: [
                        {required: true, message: '请选择生效日期', trigger: 'change'}
                    ],
                    wbsTypelateDateEnd: [
                        {required: true, message: '请选择停用日期', trigger: 'change'}
                    ]
				},
				//定义弹出框为false，隐藏状态
				visible: false,
				title: '',
				//定义模态框里面的新增内容字段
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
				//定义模态框 转圈加载过程
				loading: false,
				treeConfig: {
					children: 'children'
				},
				visibleAttachment: false
			}
		},
		created() {
		},
		//计算属性
		computed: {},
		//触发事件方法
		methods: {
			//父组件调用，传入参数
			getParentParams(title, tableData) {

				//前端封装的格式
				let params = {'code': 'T_PMS_WBS_TYPELATE_WBS_TYPELATE_CODE', "iba": []};
				this.$axios.post("/pdm/PdmObject/generateObjectNumber", params).then(result => {
					//返回为json，如果errorMsg的值不为空，表示生成失败，需要自己抛出异常
                    const { data } = result
					this.formModel.wbsTypelateCode = data.number
				}).catch(error => {

				}).finally(_ => {

				})
              this.visible = true
                this.$nextTick(_=>{
                  console.log(this.$refs.form)
                  this.$refs.form.resetFields();
                  this.title = title
                  //获取选中的数据
                  this.tableData = JSON.parse(JSON.stringify(tableData))

                })

			},
			save() {

				this.$refs.form.validate((valid) => {
					if (valid) {
						this.loading = true
						const tableData = this.tableData
						const jsonData = {...this.formModel, ...{entity: tableData}}
						console.log(jsonData)
						this.$axios.post("/pms/PmsBaseWbsTypelate/save", {$json: jsonData})
							.then(result => {
								this.$message.success("保存成功");
								//this.$refs.grid.refresh();
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
			}
		},
		watch: {},
		//这个是你引用插件生成的,不用管它
		components: {
			IceDialog,
			IceSelect
		}
	}
</script>

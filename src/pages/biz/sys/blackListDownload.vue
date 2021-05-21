<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="数字黑名单下载"
                        data-url="/biz/BlacklistAf/all"
                        :query="query"
                        :columns="columns"
                        :operationsWidth="300"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

        <el-dialog v-dialogDrag title="修改黑名单文件" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="50%" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="mainData" :rules="dialogRules"  label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-form-item label="黑名单文件" prop="accessoryId"  layout="2">
                        <ice-single-upload  styleType="input" :on-success="success" v-model="mainData.accessoryId">
                        </ice-single-upload>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="saveDialog">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";

    export default {
        name: 'blackList',
        data() {
            return {
                dialogVisible:false,
                mainData:{accessoryId:""},
                dialogRules:{accessoryId: [{required: true,message:"请上传附件"}]},
                query: [
                    {type: 'static', label: '状态', code: 'afStatus',value:"2"},
                    {type: 'input', label: '文件名称', code: 'accessory',value:""},
                    {type: 'input', label: '发布人', code: 'afUserName',value:""},
                    {type: 'input', label: '发布部门', code: 'afDepartmentName',value:""},
                    {type: 'date', label: '发布日期从', code: 'afDate', value: '', exp: '>=',value:""},
                    {type: 'date', label: '至', code: 'afDate', value: '', exp: '<=',value:""},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'accessoryId', hidden: true},
                    {label: '文件名称', code: 'accessory', width: 200,sortable:true},
                    {label: '发布人', code: 'afUserName', width: 140,sortable: true},
                    {label: '发布部门', code: 'afDepartmentName', width: 140,sortable:true},
                    {label: '发布日期', code: 'afDate', width: 180,sortable:true},
                    {label: '备注', code: 'remark'}
                ],
                operations: [
                    {
                        name: '黑名单文件下载',ctrlCode:"BHMDWJXZ", callback: (row) => {
                            this.downloadFile(row);
                        }
                    },
                    {
                        name: '黑名单文件修改',ctrlCode:"BHMDWJXG", callback: (row) => {
                            this.dialogVisible = true;
                            this.mainData.oid=row.oid;
                            this.mainData.accessoryId=row.accessoryId;
                        }
                    }
                ],
                buttons: [
                ]
            }
        },
        methods: {
            saveDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/biz/BlacklistAf/saveOrUpdate', this.mainData).then(result => {
                            this.$message.success("成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            downloadFile(row) {
                this.$axios.post("/biz/BlacklistAf/download",{"id":row.oid}).then(success=>{
                    this.$downloadFile(row.accessoryId);
                })
            },
            success(response, file, fileList) {
                this.mainData.accessory = file.name;
                this.mainData.accessoryId = response.data;
            }
        },
        components: {
            IceSingleUpload,
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>
<style scoped>
</style>

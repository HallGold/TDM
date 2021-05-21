<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="流程定义管理"
                        data-url="/bpm/definition/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <!--<ice-grid-layout :columns="4" gutter="20px">

        </ice-grid-layout>-->

        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="400px" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-upload
                        :on-success="onUploadSuccess"
                        :on-error="onUploadError"
                        list-type="txt"
                        class="upload-demo"
                        drag
                        :action="dialogUploadUrl"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">{{uploadTip}}</div>
                </el-upload>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'FlowDefinition',
        data() {
            return {
                tittle:"上传配置",
                uploadTip:"",
                dialogVisible:false,
                dialogUploadUrl:this.$apicontext+"bpm/definition/upload",
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'status',
                        value: 'all',
                        tablist: [{label: '全部', value: 'all'}, {label: '已发布', value: '1'}, {label: '未发布', value: '0'}]
                    },
                    {type: 'select', label: '流程分类', code: 'typeId', mapTypeCode: 'FlowType', value: '',},
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: '', exp: 'like'},
                    {type: 'input', label: '流程KEY', code: 'actDefKey', value: '', exp: 'like',exp:"upperLike"},
                    {type: 'select', label: '状态', code: 'status', mapTypeCode: 'PUBLISH_STATE', value: '', multiple: true},
                    {type: 'date', label: '操作时间从', code: 'updateDate', value: '', exp: '>=', max: 'weeks:1'},
                    {type: 'date', label: '至', code: 'updateDate', value: '', exp: '<=', max: 'weeks:1'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {label: '流程分类', code: 'typeId', width: 140, mapTypeCode: 'FlowType',sortable: true,align:'left'},
                    {label: '流程名称', code: 'bpmDefName', width: 240,sortable: true,align:'left'},
                    {label: '流程KEY', code: 'actDefKey', width: 200, sortable: true,align:'left'},
                    {label: '流程版本', code: 'versionNo', width: 80,align:'left'},
                    {label: '状态', code: 'status', width: 80, mapTypeCode: 'PUBLISH_STATE',sortable: true},
                    {label: '是否禁用', code: 'lockedStatus', width: 100, mapTypeCode: 'YES_NO',sortable: true},
                    {label: '最后操作人', code: 'updateUser', width: 100,align:'left'},
                    {label: '最后操作时间', code: 'updateDate', width: 125, sortable: true}],
                operations: [
                    {name: '设计', callback: this.designItem,ctrlCode:"BXZ"},
                    {name: '配置', callback: this.confItem,ctrlCode:"BPZ", isShow: function (row) {
                            if (row.status == 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '导出发布',ctrlCode:"BDCFB", callback: this.exportDeployItem, isShow: function (row) {
                        if (row.status == 1) {
                            return true;
                        }
                        return false;
                     }
                    }/*,{
                        name: '导出配置',ctrlCode:"BDCPZ", callback: this.exportConfItem, isShow: function (row) {
                            if (row.status == 1) {
                                return true;
                            }
                            return false;
                        }
                    }*//*,{
                        name: '启用',ctrlCode:"BDCPZ", callback: this.exportConfItem, isShow: function (row) {
                            if (row.status == 1) {
                                return true;
                            }
                            return false;
                        }
                    }*/
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary',ctrlCode:"BXZ", callback: this.addItem},
                    {name: '发布配置', icon: 'el-icon-plus',ctrlCode:"BFBPZ", type: 'primary', callback: this.importItem}/*,
                   {name: '导入配置', icon: 'el-icon-plus',ctrlCode:"BDRPZ",  type: 'primary', callback: this.uploadConf}*/
                ]
            }
        },
        methods: {
            designItem(item) {
                this.$router.push("/bpm/floweditor?id=" + item.oid)
            },
            confItem(item) {
                this.$router.push("/bpm/processConfiguration?id=" + item.oid)
            },
            exportDeployItem(item) {
                window.open(this.$apicontext+"bpm/definition/deploy?actDefId="+item.actDefId,"_blank");
            },
            exportConfItem(item) {
                window.open(this.$apicontext+"bpm/definition/conf?actDefId="+item.actDefId,"_blank");
            },
            deployItem(item) {
                let obj = Object.assign({}, item);
                obj.status = 1;
                this.$axios.post('/bpm/definition/publish', obj).then(result => {
                    this.$message.success("发布成功")
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message.error("出错啦")
                })
            },
            addItem() {
                this.$router.push("/bpm/floweditor")
            },
            importItem(){
                this.dialogVisible=true;
                this.uploadTip="请先导出发布再使用发布配置(已发布的流程不能再次发布)";
            },
            uploadConf(){
                this.uploadTip="请先导出配置再使用导入配置(已导入过的流程不能覆盖)";
                this.dialogUploadUrl=this.$apicontext+"bpm/definition/uploadConf";
                this.dialogVisible=true;
            },
            onUploadSuccess(response, file, fileList){
                console.log('==> onUploadSuccess: response.code = %o', response.code);
                if(response.code == '1'){
                    this.dialogVisible=false;
                    this.$message.success(""+response.msg);
                }
                else if (response.code!=200){
                    this.dialogVisible=false;
                    this.$message.error(""+response.msg);
                    return
                }
                this.$confirm('导入成功啦,还要继续导入吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then((data) => {
                }).catch((data) => {
                    this.dialogVisible=false;
                });

                //calert(确认stringify(file)+"-------------"+JSON.stringify(fileList))
            },
            onUploadError(err, file, fileList){
                this.$message.error("出错啦")
                //alert(JSON.stringify(err)+"------错误错误错误错误-------"+JSON.stringify(file))
            },
            $refresh(){
                this.$refs.grid.refresh();
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>
.el-upload__tip{
    color: red;
}
</style>

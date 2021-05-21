<template>
    <div class="content-filled">
        <ice-query-grid
                :pagination="true"
                ref="iceGrid"
                data-url="/biz/BizSoftwareDownloadHistory/list"
                :query="query"
                :buttons="buttons"
                :columns="columns"></ice-query-grid>
        <el-dialog v-dialogDrag title="软件评分" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div style="margin: 0;padding: 0;max-height: 500px;overflow-x: hidden;overflow-y: scroll;">
                <ice-grid-layout :columns="2" style="padding: 0">
                    <el-card shadow="hover" class="box-card" style="height: 115px;position: relative;width: 45%;margin-left: 5px;" v-for="item in dataTable">
                        <div >
                            <div class="textShow">
                                <div class="textBody">
                                    {{'软件名称: ' + item.SOFT_NAME }}
                                </div>
                                <div  class="textBody" >
                                    {{'软件版本: ' + item.SOFT_VERSION }}
                                </div>
                                <div class="textBody">
                                    {{'下载时间: ' + item.CREATE_DATE_ }}
                                </div>
                                <div v-if="item.GRADE_NUM == null">
                                    <el-button @click="saveGrade(item.SOFTWARE_ID,item.grade)" style="border: 0;padding: 0">
                                        <el-rate
                                                v-model="item.grade">
                                        </el-rate>
                                    </el-button>
                                </div>
                                <div v-if="typeof(item.GRADE_NUM) == 'number'">
                                    <el-button style="border: 0;padding: 0" >
                                        <el-rate
                                                disabled
                                                v-model="item.GRADE_NUM">
                                        </el-rate>
                                    </el-button>
                                </div>
                            </div>

                            <div class="imgDiv">
                                <img style="width: 100px;height: 100px;" class="soft-icon" :src="$showImage(item.SOFT_ICON_ID)">
                            </div>
                        </div>
                    </el-card>
                    <div v-if="isNall">暂无数据</div>
                </ice-grid-layout>
            </div>
            <el-footer style="background-color: #FFFFFF">
                <div class="ice-button-bar" layout="2"  style="float: right;text-decoration:underline;">
                    <el-button type="info" @click="closeDetailDialog">返回</el-button>
                </div>
            </el-footer>
        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "ApplicationUpDownHistory",
        components: {IceGridLayout, IceEditableTableColumn, IceEditableTable, IceQueryGrid},
        data() {
            return {
                query: [
                    {type: 'input', label: '软件名称', code: 'softName', value: ''}
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '软件名称', code: 'softName', width: 300},
                    {label: '软件版本', code: 'softVersion', width: 200},
                    {label: '下载时间', code: 'createDate', width: 300},
                ],
                buttons: [
                    {name: '返回软件中心', icon: 'el-icon-back', type: 'primary', callback: this.rollBack},
                    {name: '软件评分', icon: 'el-icon-edit-outline', type: 'primary', callback: this.evaluate}
                ],
                dataTable: [],
                dialogVisible: false,
                isNall:false
            }
        },
        methods: {
            /**返回软件中心*/
            rollBack() {
                this.$router.push("/biz/software/applicationrepertory");
            },
            /**评分---弹框开启按钮*/
            evaluate() {
                this.isNall = false;
                this.$axios.get("/biz/BizSoftwareGrade/waitGrade",{"params":{
                        size: 200,
                        current: 1
                    }}).then(success => {
                    this.dataTable = success.data.records;
                    if(success.data.records.length==0){
                        this.isNall = true;
                    }
                    this.dialogVisible = true;
                }).catch(error => {
                })
            },
            /**评分弹框--返回*/
            closeDetailDialog(){
                this.dialogVisible = false;
            },
            /*/!**批量保存*!/
            closeDetailSave(){

            },*/
            /**评价的保存按钮*/
            saveGrade(id,grade){
                this.$confirm('确定要保存你的评价吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.post("/biz/BizSoftwareGrade/submit",{"grade":grade,"id":id}).then(success=>{
                        this.$message.success("保存成功，感谢你的评分!");
                        this.evaluate();
                    }).catch(error=>{
                        console.log(error);
                        if (error.status == 200) {
                            this.$message({
                                type: 'warning',
                                message: error.data.msg
                            });
                        } else {
                            this.$message.error("评分出错了");
                        }
                    });
                })

            }
        },
        mounted() {
        }
    }
</script>

<style scoped>
.box-card{
    position: relative;
}
    .imgDiv{
        position: absolute;
        margin-left: 220px;
        margin-top: -90px;
    }
    .textShow{
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
    }
    .textBody{
        text-align: initial;
        width: 100%;
        text-overflow: ellipsis;
        overflow: inherit;
    }
</style>
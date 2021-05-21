<template>
<!--
新建服务申请，新建故障申报，办理，详情
附件上传
-->
        <el-row :gutter="10">
            <el-col :span="22" class="ice-upload">
                <el-form-item label="附件上传:" label-width="105px" prop="remark">
                   <ice-multiple-upload></ice-multiple-upload>
                </el-form-item>
            </el-col>
        </el-row>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    export default {
        name: "AccessoryMessage",
        components:{
            IceGridLayout,IceEditableTable,IceMultipleUpload
        },
        data(){
            return{
                Form:{
                    remark:''
                },
            }
        }
    }
</script>

<style scoped>

</style>
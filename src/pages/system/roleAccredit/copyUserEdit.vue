<template>
    <el-dialog v-dialog-drag
               title="角色复制页面"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-table :data="tableData">
            <el-table-column prop="name"
                             label="角色名称"></el-table-column>
            <el-table-column prop="code"
                             label="角色编码"></el-table-column>
            <el-table-column prop="isPublic"
                             label="全局角色"></el-table-column>
            <el-table-column prop="enabled"
                             label="是否启用"></el-table-column>
            <el-table-column prop="desp"
                             label="角色描述"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="closeDialog">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "copyUserEdit",
        data(){
            return{
                tableData:[],           //列表数据
                dialogVisible:false,    //弹窗开关属性
            }
        },
        methods:{
            /**
             * 取消
             */
            closeDialog(){
                this.dialogVisible = false;
            },
            /**
             * 打开弹出
             */
            openDialog(){
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>

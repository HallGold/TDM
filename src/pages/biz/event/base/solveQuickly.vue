<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <el-form :model="from" :disabled="aclKeyReadonly">
                        <el-col :span="8">
                                <el-form-item></el-form-item>
                        </el-col>
                        <el-form-item label="起因:" label-width="105px">
                                <el-col :span="8">
                                        <el-select  placeholder="请选择..." v-model="from.date1">
                                                <el-option>1</el-option>
                                                <el-option>2</el-option>
                                        </el-select>
                                </el-col>
                        </el-form-item>
                        <el-col :span="8">
                                <el-form-item></el-form-item>
                        </el-col>
                        <el-form-item label="处置情况:" label-width="105px">
                                <el-col :span="8">
                                        <el-input placeholder="申请描述" v-model="from.date2" rows="6"
                                                  type="textarea"></el-input>
                                </el-col>
                        </el-form-item>
                </el-form>
                <el-form style="text-align: center">
                        <el-button type="primary">确定</el-button>
                        <el-button type="info" >取消</el-button>
                </el-form>
        </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";

    export default {
        name: "solveQuickly",
        components: {IceDialog},
        data() {
            return {
                from: {
                    date1: "",
                    date2: ""
                },
                aclKeyReadonly: false,
            }
        }
    }
</script>

<style scoped>

</style>
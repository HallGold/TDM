<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <ice-grid-layout :columns="3" name="回访信息">
                        <el-form-item label="解决情况:" label-width="105px" prop="remark">
                                <el-input placeholder="已解决" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="处理速度:" label-width="105px" prop="remark">
                                <el-input placeholder="5.0分" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="解决情况:" label-width="105px" prop="remark">
                                <el-input placeholder="5.0分" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务速度:" label-width="105px" prop="remark">
                                <el-input placeholder="5.0分" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="专业能力:" label-width="105px" prop="remark">
                                <el-input placeholder="5.0分" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="总分:" label-width="105px" prop="remark">
                                <el-input placeholder="5.0分" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="说明:" label-width="105px" prop="remark">
                                <el-input placeholder="" :disabled="true"></el-input>
                        </el-form-item>
                </ice-grid-layout>
        </div>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    export default {
        name: "returnInformation",
        components: {IceGridLayout}
    }
</script>

<style scoped>

</style>
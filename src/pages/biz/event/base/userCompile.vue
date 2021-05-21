<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <el-form>
                        <el-row :gutter="10">
                                <el-col :span="12">
                                        <el-form-item label="投诉人：" label-width="105px">
                                                <el-input></el-input>
                                        </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                        <el-form-item label="投诉时间：" label-width="105px">
                                                <el-input></el-input>
                                        </el-form-item>
                                </el-col>
                        </el-row >
                        <el-row :gutter="10">
                                <el-col :span="12">
                                        <el-form-item label="投诉人部门" label-width="105px">
                                                <el-input></el-input>
                                        </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                        <el-form-item label="联系方式：" label-width="105px">
                                                <el-input></el-input>
                                        </el-form-item>
                                </el-col>
                        </el-row>
                        <el-row :gutter="10">
                                <el-col :span="24">
                                        <el-form-item label="主题：" label-width="105px">
                                                <el-input type="textarea"></el-input>
                                        </el-form-item>
                                </el-col>
                        </el-row>
                        <el-row :gutter="10">
                                <el-col :span="24">
                                        <el-form-item label="内容：" label-width="105px">
                                                <el-input type="textarea"></el-input>
                                        </el-form-item>
                                </el-col>
                        </el-row>
                        <accessory-message></accessory-message>
                        <el-row style="text-align: center" :gutter="10">
                                <el-button type="primary">保存</el-button>
                                <el-button type="primary">提交</el-button>
                                <el-button>关闭</el-button>
                        </el-row>
                </el-form>
        </div>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import AccessoryMessage from "./AccessoryMessage";
    export default {
        name: "userCompile",
        components: {IceGridLayout,AccessoryMessage}
    }
</script>

<style scoped>

</style>
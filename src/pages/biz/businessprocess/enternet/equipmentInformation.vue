<template>
    <el-form :model="mainData"  :rules="formRules" ref="bizForm" label-width="100px" disabled>
        <ice-grid-layout :columns="2" name="设备信息" >
            <el-form-item label="设备ID" prop="devId">
                <el-input v-model="mainData.devId"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="mainData.name"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="category">
                <el-input v-model="mainData.category"></el-input>
            </el-form-item>
            <el-form-item label="设备子类" prop="childtype">
                <el-input v-model="mainData.childtype"></el-input>
            </el-form-item>
            <el-form-item label="设备编号" prop="devsn">
                <el-input v-model="mainData.devsn"></el-input>
            </el-form-item>
            <el-form-item label="入网类型" prop="devType">
                <el-radio v-model="mainData.devType" label='TERMINAL'>终端设备</el-radio>
                <el-radio v-model="mainData.devType" label='BACKEND'>后端设备</el-radio>
            </el-form-item>
            <el-form-item label="设备责任人" prop="dutyname">
                <el-input v-model="mainData.dutyname"></el-input>
            </el-form-item>
            <el-form-item label="设备责任部门" prop="dutyDeptName">
                <el-input v-model="mainData.dutyDeptName"></el-input>
            </el-form-item>
            <el-form-item label="安装时间" prop="installDate">
                <el-input v-model="mainData.installDate"></el-input>
            </el-form-item>
            <el-form-item label="安装人" prop="afUserName">
                <el-input v-model="mainData.afUserName"></el-input>
            </el-form-item>
        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    export default {
        name: "equipmentInformation",
        components: {IceGridLayout},
        props:{
            mainData:{}
        },
        data(){
            return{
                formRules:{//表单字段规则

                }
            }
        }
    }
</script>

<style scoped>

</style>
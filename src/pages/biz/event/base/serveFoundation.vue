<template>
    <!--服务受理==》办理==》基础信息-->
    <div>
        <el-form :model="mainData">
            <ice-grid-layout :columns="3" name="服务单基础信息">
                <el-form-item label="性质:" label-width="105px" prop="serviceProperty">
                    <ice-datamap-translater :value="mainData.serviceProperty?mainData.serviceProperty:''" mapTypeCode="servicePropertie" model="input" :disabled="true">
                    </ice-datamap-translater>
                </el-form-item>
                <el-form-item label="类别:" label-width="105px" prop="isBreakdownTex">
                    <ice-select v-model="mainData.isBreakdown" mapTypeCode="Category" :disabled="true" ></ice-select>
                </el-form-item>
                <el-form-item label="区域:" label-width="105px" prop="areaShortname">
                    <el-input v-model="mainData.areaShortname" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务名称:" label-width="105px" prop="psbcname">
                    <el-input v-model="mainData.psbcname" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务项:" label-width="105px" prop="sname">
                    <el-input v-model="mainData.sname" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请级别:" label-width="105px" prop="lvText" v-show="juet">
                    <el-input v-model="mainData.lvText" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务级别:" label-width="105px" prop="lvText" v-show="!juet">
                    <el-input v-model="mainData.lvText" :disabled="true"></el-input>
                </el-form-item>
                   <!--      状态不同添加的项          -->
                <el-form-item label="是否0级:" label-width="105px" prop="isLevelZeroText" v-show="juet">
                    <!--<ice-select v-model="mainData.isLevelZero"
                                map-type-code="islZero" :disabled="true"></ice-select>-->
                    <ice-datamap-translater :value="mainData.isLevelZero" mapTypeCode="YES_NO" model="input" :disabled="true">
                    </ice-datamap-translater>
                </el-form-item>
                <el-form-item label="预计处置时长:"  label-width="105px" prop="durationDoneExpected">
                    <el-col :span="14">
                        <el-input :disabled="true"
                                  v-model="mainData.durationDoneExpected"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <ice-datamap-translater :disabled="true"
                                                model="input"
                                                :value="mainData.durationDoneUnit"
                                                mapTypeCode="Time"></ice-datamap-translater>
                    </el-col>
                    <!--<el-input v-model="mainData.durationDoneExpected" :disabled="true"></el-input>-->
                </el-form-item>
                <el-form-item label="描述:" label-width="105px" prop="description" layout="3">
                    <el-input v-model="mainData.description" type="textarea" :disabled="true" rows="6"></el-input>
                </el-form-item>
                <el-form-item label="附件信息:" label-width="105px" prop="targetId" layout="3" >
                                <span
                                        v-show="mainData.targetId == null">
                                        没有上传附件！
                                </span>
                    <ice-multiple-upload v-model="mainData.targetId" value-model="string"
                                         disabled
                                         v-show="mainData.targetId !== null"></ice-multiple-upload>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    export default {
        name: "serveFoundation",
        components: {IceMultipleUpload, IceDatamapTranslater, IceSelect, IceGridLayout},
        props: {
            mainData: {},
        },
        data(){
            return{
                juet: false,
            }

        },
       mounted(){
            if(this.mainData.isLevelZero == 0){
                this.juet = true
            }else {
                this.juet = false
            }
       },

    }
</script>

<style scoped>

</style>
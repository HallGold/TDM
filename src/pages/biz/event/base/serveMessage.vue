<template>
    <div style="width: 100%">
        <el-form :model="mainData" style="width: 100%">
            <ice-grid-layout :columns="3" name="服务申请信息">
                <el-form-item label="用户:" label-width="105px" prop="user">
                    <el-input v-model="mainData.userName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户单位:" label-width="105px" prop="remark">
                    <el-input v-model="mainData.userDeptName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户星级:" label-width="105px" prop="userGrade">
                    <ice-datamap-translater :value="mainData.userLevel?mainData.userLevel.toString():'1'"
                                            mapTypeCode="userLevel"
                                            model="input"></ice-datamap-translater>
                </el-form-item>
                <el-form-item label="用户座机:" label-width="105px" prop="userTelephone">
                    <el-input v-model="mainData.userTelephone" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户手机:" label-width="105px" prop="userMobile">
                    <el-input v-model="mainData.userMobile" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱:" label-width="105px" prop="userMail">
                    <el-input v-model="mainData.userMail" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人:" label-width="105px" prop="creatorName">
                    <el-input v-model="mainData.creatorName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人单位:" label-width="105px" prop="creatorDeptName">
                    <el-input v-model="mainData.creatorDeptName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人座机:" label-width="105px" prop="creatorTelephone">
                    <el-input v-model="mainData.creatorTelephone" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人手机:" label-width="105px" prop="creatorMobile">
                    <el-input v-model="mainData.creatorMobile" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人邮箱:" label-width="105px" prop="creatorMail">
                    <el-input v-model="mainData.creatorMail" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请时间:" label-width="105px" prop="gmtCreate">
                    <el-input v-model="mainData.gmtCreate" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开始时间:" label-width="105px" prop="gmtBegin" v-show="juet">
                    <el-input v-model="mainData.gmtBegin" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="来源:" label-width="105px" prop="source">
                    <ice-datamap-translater :value="mainData.source" mapTypeCode="eventSource" model="input"
                                            :disabled="true"></ice-datamap-translater>
                </el-form-item>
                <el-form-item label="批量数:" label-width="105px" prop="gmtBegin">
                    <el-input v-model="mainData.num" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请描述:" label-width="105px" prop="description" layout="3">
                    <el-input v-model="mainData.description" type="textarea" rows="6" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="附件信息:" label-width="105px" prop="targetId" layout="3">
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
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";

    export default {
        name: "serveMessage",
        components: {IceMultipleUpload, IceDatamapTranslater, IceGridLayout},
        props: {
            mainData: {},
            isSuccess: Function,
        },
        data() {
            return {
                juet: false,
                workstauts: "",
            }
        },

        mounted() {
        },
        watch: {
            "mainData.isBreakdownEntry": function (newVal) {
                if (newVal == 0) {
                    this.juet = false;
                } else {
                    this.juet = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>
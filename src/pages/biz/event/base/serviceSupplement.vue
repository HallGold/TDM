<template>
    <div class="grid-container">
        <!--新建服务申请补录-->
        <el-form :model="mainDataForm" style="width: 100%" :disabled="true">
            <ice-grid-layout :columns="3" name="服务申请信息">
                <el-form-item label="用户:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户单位:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userDeptName"></el-input>
                </el-form-item>
                <el-form-item label="用户星级:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userLevel+'星级'"></el-input>
                </el-form-item>
                <el-form-item label="用户座机:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userTelephone"></el-input>
                </el-form-item>
                <el-form-item label="用户手机:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userMobile"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.userMail"></el-input>
                </el-form-item>
                <el-form-item label="申请人:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.creatorName"></el-input>
                </el-form-item>
                <el-form-item label="申请人单位:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.creatorDeptName"></el-input>
                </el-form-item>
                <el-form-item label="申请人座机:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.creatorTelephone"></el-input>
                </el-form-item>
                <el-form-item label="申请人手机:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.creatorMobile"></el-input>
                </el-form-item>
                <el-form-item label="申请人邮箱:" label-width="105px">
                    <el-input
                            v-model="mainDataForm.proEvtUserTicket.creatorMail"></el-input>
                </el-form-item>
                <el-form-item label="申请时间:" label-width="105px">
                    <ice-date-picker
                            type="datetime"
                            v-model="mainDataForm.proEvtUserTicket.gmtCreate"></ice-date-picker>
                </el-form-item>
                <el-form-item label="故障开始时间:" label-width="105px"
                              v-show="this.I==1">
                    <ice-date-picker
                            type="datetime"
                            v-model="mainDataForm.proEvtUserTicket.gmtBegin"></ice-date-picker>
                </el-form-item>
                <el-form-item label="来源:" label-width="105px">
                    <ice-select v-model="mainDataForm.proEvtUserTicket.source"
                                mapTypeCode="eventSource"></ice-select>
                </el-form-item>
                <el-form-item label="申请描述:" label-width="105px"
                              layout="3">
                    <el-input
                            :value="mainDataForm.proEvtUserTicket.description?this.mainDataForm.proEvtUserTicket.description.replace('\\n', '\n'):''"
                            type="textarea" rows="6"
                            :maxlength="256"
                            resize="none"></el-input>
                </el-form-item>

                <el-form-item label="附件信息:" label-width="105px" layout="3">
                                <span
                                        v-show="mainDataForm.proEvtUserTicket.targetId == null">
                                        没有上传附件！
                                </span>
                    <ice-multiple-upload v-model="mainDataForm.proEvtUserTicket.targetId" value-model="string" doSecret
                                         v-show="mainDataForm.proEvtUserTicket.targetId !== null"></ice-multiple-upload>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>


    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import IceSelect from "../../../../components/common/base/IceSelect";

    export default {
        name: 'serviceSupplement',
        props: {
            mainDataForm: {}
        },
        data() {
            return {
                I: ""
            }
        },
        components: {
            IceSelect,
            IceMultipleUpload,
            IceDatePicker,
            IceGridLayout
        },
        methods: {
            timeShow(data) {
                if (data == "1") {
                    this.I = 1;
                } else {
                    this.I = 0;
                }
            }
        },
        mounted() {
            let tabs = this.$route.query['tabs'];
            if (tabs == "0") {
                this.I = 0;
            } else if (tabs == "1") {
                this.I = 1;
            }
        }
    }
</script>

<style scoped>
    .grid-container {
        width: 100%;
    }
</style>
<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="callBackSuccess">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="bizdata" status-icon :rules="rules" ref="definition" label-width="140px">

                    <ice-grid-layout :columns="2" name="业务表单">
                        <el-form-item label="生产组次" prop="jhzcArr">
                            <el-cascader v-model="bizdata.jhzcArr" placeholder="关键字搜索" :options="options" filterable clearable ref="cascader" :disabled="formReadonly"></el-cascader>
                        </el-form-item>
                        <el-form-item label="报告名称" prop="scbg">
                            <el-input maxlength="65" v-model="bizdata.scbg" autocomplete="off" :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="编制单位" prop="bzdw">
                            <ice-dept-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'" v-model="bizdata.bzdw" @select-confirm="selectDept"></ice-dept-selector>
                        </el-form-item>
                        <el-form-item label="编制人" prop="bzr">
                            <ice-persion-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'" @select-confirm="selectPerson" v-model="bizdata.bzr"></ice-persion-selector>
                        </el-form-item>
                        <el-form-item label="编制时间" prop="bzsj">
                            <el-date-picker v-model="bizdata.bzsj" autocomplete="off" :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="密级" prop="dataSecretLevcode">
                            <ice-select :controlMjPar="controlMjPar" v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" autocomplete="off" :disabled="formReadonly"></ice-select>
                        </el-form-item>
                        <el-form-item label="审查内容" prop="scnr">
                            <el-input type="textarea" v-model="bizdata.scnr" autocomplete="off" :disabled="formReadonly"
                                      placeholder="不超过650个字" maxlength="650" show-word-limit=""></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1" name="关联数据">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="附件" name="first">
                                <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" :data="attaTableData" ref="attachment" :is-handleer="!formReadonly"></ATTACHMENT>
                            </el-tab-pane>
                        </el-tabs>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>

    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";

    export default {
        data() {
            return {
                changeFjSrdata: [],
                bizdata: {},
                formReadonly: false,
                activeName: 'first',
                attaTableData: [],

                options: [],

                rules: {
                    jhzcArr: [
                        {required: true, message: '请选择生产计划组次', trigger: 'blur'}
                    ],
                    scbg: [
                        {required: true, message: '请输入报告名称', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                //Object.assign(this.bizdata,bizdata);
                console.log(bizdata, 'biz')
                if (bizdata.oid) {
                    this.bizdata = bizdata;
                    this.bizdata.jhzcArr = [bizdata.scxmId,bizdata.scjhId,bizdata.jhzcId];
                    this.getXtFjData(bizdata.oid)
                }

                if (flowContext.nodeId == 'FirstNode') {
                    this.formReadonly = false;
                } else {
                    this.formReadonly = true;
                    this.rules = {};
                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                this.bizdata.xtFjs = this.$refs.attachment.getData();
                let result = this.$refs.definition.validate();
                return await result;
            },
            flowBizData() {
                //获取业务表单数据
                let selectCascaderData = this.$refs.cascader.getCheckedNodes();
                let path = selectCascaderData[0].path;
                let pathLabels = selectCascaderData[0].pathLabels;
                this.bizdata.scxmId = path[0];
                this.bizdata.scxmName = pathLabels[0];
                this.bizdata.scjhId = path[1];
                this.bizdata.jhName = pathLabels[1];
                this.bizdata.jhzcId = path[2];
                this.bizdata.jhzc = pathLabels[2];
                this.bizdata.xtFjs = this.$refs.attachment.getVisibleDataAndDelData();
                return this.bizdata;
            },
            callBackSuccess(data){
                this.bizdata.oid = data.oid;
                this.attaTableData = data.xtFjs;
            },
            // 获取系统附件数据
            getXtFjData(boid){
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.changeFjSrdata = this.attaTableData;
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取系统附件数据失败！")
                    })
            },

            selectDept (depts) {
                this.bizdata.bzdwCode = depts[0].deptCode;
            },

            selectPerson (p) {
                this.formModelReform.bzrCode = p[0].code;
            },

        },

        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },

        created() {
            this.$axios.get("/pms/JhPsc/selectPscTree")
                .then(result => {
                    this.options = result.data;
                })
                .catch(error => {
                    console.log(error)
                    this.$message.error("获取系统附件数据失败！")
                })
        },
        computed: {
            controlFjMj () {
                return this.bizdata.dataSecretLevcode?[this.bizdata.dataSecretLevcode]:[]
            },
            controlMjPar () {
                // 附件
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [ ...arr2];
            }

        },
        components: {
            IcePersionSelector,
            IceDeptSelector,
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            IceSelect,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

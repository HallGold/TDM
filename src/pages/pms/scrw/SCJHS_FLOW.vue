<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="callBackSuccess">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="bizdata" status-icon ref="form" label-width="140px">
                    <input type="hidden" v-model="bizdata.oids" />
                </el-form>

                <el-container style="background: #fff;">
                    <el-aside width="250px" style="position: relative; height: 700px;">
                        <ice-tree :load-url="loadUrl"
                                  label-prop="scJhname"
                                  value-prop="oid"
                                  @node-click="nodeClick"
                                  style="height: 400px; width: 250px;">
                        </ice-tree>
                        <pms-project-msg title="计划信息" :label-name="labelName" :msgdata="msgData"></pms-project-msg>
                    </el-aside>
                    <el-main style="padding: 0 0 0 5px;">
                        <SCJH_ITEM :oid-scjh="oidScjh"></SCJH_ITEM>
                    </el-main>
                </el-container>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>

    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "../../../components/common/base/IceSelect";
    import ATTACHMENT from "../common/ATTACHMENT";
    import IceDialog from "../../../components/common/base/IceDialog";
    import XM_SELECT from "../common/XM_SELECT";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceTree from "../../../components/common/base/IceTree";
    import PmsProjectMsg from "../../../components/common/pms/PmsProjectMsg";
    import SCJH_ITEM from "../common/SCJH_ITEM";

    export default {
        data() {
            return {
                percent: 0,
                columns: [],
                selector: '',
                bizdata: {
                    a: 0,
                    softwareInfoList:[{"fileMD5":"123456"}],
                    oids: this.$route.query.oids,
                },
                instProcessVar: {a: 10},
                formReadonly: false,
                loadUrl: 'pms/PmsScJh/queryTree?oids='+this.$route.query.oids,
                oids: this.$route.query.oids,

                msgData: {},
                oidScjh: '',
                scjhTableData: [],

                DATA_DICT_JHLX: [],
                DATA_DICT_JHZT: [],
                DATA_DICT_JJCD: [],
                DATA_DICT_DATASECRET: [],
            }
        },
        methods: {
            flowReady(flowContext, bizdata) {
                //流程初始化
                Object.assign(this.bizdata,bizdata);

                console.log('init', bizdata);
                console.log('flowContext', flowContext);

                if(flowContext.nodeId == 'FirstNode'){
                    this.formReadonly = false;
                }else{
                    this.formReadonly = true;
                }

                if (!this.oids) {
                    this.oids = bizdata.oids;
                    this.loadUrl = 'pms/PmsScJh/queryTree?oids='+bizdata.oids;
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                console.log(1111121212)
                console.log(this.bizdata)
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                this.bizdata.addOrNot = true;
                return this.bizdata;
            },

            // 保存回调方法
            callBackSuccess (data) {

            },

            nodeClick (id, row) {
                if(row.data.type == '0'){
                    this.msgData = {};
                }else{
                    this.msgData = row.data;
                    this.oidScjh = row.data.oid;
                    this.DATA_DICT_JHLX.map(o => {
                        if (o.code == this.msgData.scJhlx) {
                            this.msgData.scJhlxName = o.name;
                        }
                    })
                    this.DATA_DICT_JHZT.map(o => {
                        if (o.code == this.msgData.jhzt) {
                            this.msgData.jhztName = o.name;
                        }
                    })
                    this.DATA_DICT_JJCD.map(o => {
                        if (o.code == this.msgData.jjcd) {
                            this.msgData.jjcdName = o.name;
                        }
                    })
                    this.DATA_DICT_DATASECRET.map(o => {
                        if (o.code == this.msgData.dataSecretLevcode) {
                            this.msgData.dataSecretLevcodeName = o.name;
                        }
                    })
                }
            },

        },

        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },

        created () {
            this.$axios.get("permission/dataDictionary/listByActType?typeCodes=JHLX20,JHZT,JJCD,DATA_SECRET_LEVEL")
                .then(result => {
                    result.data.map(o => {
                        if (o.code == 'JHLX20') {
                            this.DATA_DICT_JHLX = o.appDataList;
                        }else if (o.code == 'JHZT') {
                            this.DATA_DICT_JHZT = o.appDataList;
                        }else if (o.code == 'JJCD') {
                            this.DATA_DICT_JJCD = o.appDataList;
                        }else if (o.code == 'DATA_SECRET_LEVEL') {
                            this.DATA_DICT_DATASECRET = o.appDataList;
                        }
                    })
                })
                .catch(error => {
                    this.$message.error("查询字典数据失败")
                })
        },

        props: {
            labelName: {
                default: function () {
                    return [
                        {
                            name: '计划编号',
                            label: 'scJhcode',
                        },
                        {
                            name: '计划类型',
                            label: 'scJhlxName',
                        },
                        {
                            name: '计划状态',
                            label: 'jhztName',
                        },
                        {
                            name: '紧急程度',
                            label: 'jjcdName',
                        },
                        {
                            name: '外部文号',
                            label: 'scJhwhWb',
                        },
                        {
                            name: '密级',
                            label: 'dataSecretLevcodeName',
                        },
                    ]
                },
            },
        },

        components: {
            SCJH_ITEM,
            PmsProjectMsg,
            IceTree,
            IceFlowForm,
            XM_SELECT,
            IceDialog,
            ATTACHMENT,
            IceSelect,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

<template>
    <el-form style="width: 100%;">
        <!--服务申请信息，不可修改-->
        <service-supplement :mainDataForm="mainDataForm" ref="serviceSupplement"></service-supplement>
        <!--基础信息，可修改-->
        <base-message :Form="Form" ref="baseItem"
                      :mainDataForm="mainDataForm"
                      :serviceStatu="mainDataForm.proEvtUserTicket.serviceStatus"
                      :serviceTicket="mainDataForm.proEvtUserTicket.serviceTicket"></base-message>
        <!--附件上传-->
        <ice-grid-layout name="附件信息" :columns="1">
            <ice-multiple-upload value-model="string" v-model="Form.centerServiceVo.targetId"
                                 :disabled="haveYN"></ice-multiple-upload>
        </ice-grid-layout>
        <!--附属信息-->
        <el-form style="width: 100%;" :disabled="LYC">
            <ice-grid-layout :columns="1" name="附属信息">
                <el-tabs v-model="activeName">
                    <!-- 关联服务单列表 -->
                    <el-tab-pane label="关联服务单" name="first">
                        <ice-query-grid
                                :data-url="urlWith"
                                :columns=columnsWith
                                :buttons="buttons"
                                :query="queryWith"
                                chooseItem="multiple"
                                @selection-change="selectse"
                                ref="auxGrid">
                        </ice-query-grid>
                    </el-tab-pane>
                    <!--  操作记录列表 -->
                    <el-tab-pane label="操作记录" name="second">
                        <ice-query-grid
                                :data-url="urlRecord"
                                :columns="columnsRecord"
                                :query="queryRecord"
                                ref="grid">
                        </ice-query-grid>
                    </el-tab-pane>
                </el-tabs>
                <!--关联弹窗-->
                <ice-dialog title="关联" :visible.sync="VisibleWith" remounted width="1200px">
                    <relevance @selection-change="child"></relevance>
                    <el-form-item label-width="105px" class="footer">
                        <el-button type="primary" @click="confirmWith">确定</el-button>
                        <el-button type="info" @click="close">取消</el-button>
                    </el-form-item>
                </ice-dialog>
            </ice-grid-layout>
        </el-form>
        <el-form-item label-width="105px" class="footer-center">
            <el-button :disabled="clickType" type="primary" @click="submitData">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import ServiceSupplement from "./serviceSupplement";
    import BaseMessage from "./baseMessage";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import Relevance from "./relevance";

    export default {
        name: "serviceChange",
        components: {
            Relevance,
            IceDialog, IceQueryGrid, IceMultipleUpload, IceGridLayout, BaseMessage, ServiceSupplement
        },
        data() {
            return {
                activeName: "first",
                serviceTicket: "",
                urlWith: "",
                urlRecord: "",
                VisibleWith: false,
                delSum: [],
                haveYN: false,
                LYC: false,
                bizData: {},
                clickType: false,
                mainDataForm: {
                    proEvtUserTicket: {
                        userPhone: "",
                        userMail: "",
                        sysuser: "0",
                        source: "",
                        description: "",
                        creatorName: "",
                        //用户
                        serviceTicket: "",
                        userCode: "",
                        userName: "",
                        userLevel: "",
                        userDeptCode: "",
                        userDeptName: "",
                        userTelephone: "",
                        userMobile: "",
                        //申请人
                        creatorDeptName: "",
                        creatorMobile: "",
                        creatorMail: "",
                        creatorTelephone: '',
                        //页面属性
                        creatorRole: "1",
                        isBreakdownEntry: "",
                        gmtBegin: "",
                        gmtCreate: "",
                        serviceStatus: "",
                        //附件id
                        targetId: "",
                    },
                    centerServiceVo: {},
                    proEvtWorkTicketLog: {},
                    proEvtServiceTicketLog: {},
                    assignVo: {},
                    proUserFeedback: {},
                    childBizData: {},//子流程的map对象
                    serviceTicketCatalogs: [],
                },
                Form: {
                    centerServiceVo: {
                        serviceTicket: "",
                        serviceProperty: "",
                        isBreakdown: 0,
                        serviceRange: 0,
                        serviceEmergency: 0,
                        servicePriority: 0,
                        areaShortname: "",
                        areaCode: "",
                        psbcname: "",
                        sname: "",
                        lvTitle: 0,
                        durationDoneExpected: "10",
                        description: "",
                        isServiceBreakdown: "0",
                        durationDoneUnit: "2",
                        isLevelZero: "0",
                        durationDoneCustom: "",
                        targetId: "",
                        areaId: "",
                        catalogId: ""
                    },
                    techId: ""
                },
                columnsWith: [
                    {code: 'oid', hidden: true},
                    {label: '服务单号', code: 'serviceTicketRelevant'},
                    {
                        label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"
                    },
                    {label: '用户描述', code: 'description',},
                ],
                buttons: [
                    {
                        name: '关联', icon: 'el-icon-plus', type: 'primary', callback: this.rel
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.del
                    },
                ],
                queryWith: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.serviceTicket;
                        }
                    },

                ],
                columnsRecord: [
                    {label: '操作类型', code: 'operationType', mapTypeCode: "ServiceOperateType"},
                    {label: '原因', code: 'reason',},
                    {label: '说明', code: 'detail',},
                    {label: '确认人', code: 'creatorName',},
                    {label: '确认时间', code: 'gmtCreate',},
                ],
                queryRecord: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.serviceTicket;
                        }
                    },

                ],
            }
        },
        methods: {
            rel() {
                this.aclKeyReadonly = false;
                this.VisibleWith = true;
            },
            /**
             * 删除，关联服务单中的数据
             * */
            del() {
                if (this.delArr.length == 0) {
                    this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    this.$refs.auxGrid.refresh();
                    this.delArr = [];
                } else {
                    this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.delArr.length; i++) {
                            this.delSum.push(this.delArr[i].oid)
                        }
                        this.delSum = this.delSum.join(",");
                        this.$axios.delete("biz/ProEvtServiceTicketRelevan/del", {params: {id: this.delSum}}).then(result => {
                            this.$message.success("删除成功");
                            this.$refs.auxGrid.refresh();
                            this.delSum = [];
                        });
                    })
                }
                this.$refs.grid.refresh();
            },
            child(data) {
                this.arr = data;
            },
            close() {
                this.VisibleWith = false;
            },
            selectse(row) {
                this.delArr = row;
            },
            /**
             保存，关联弹窗中的保存
             */
            confirmWith() {
                let selectArr = [];
                if (this.arr.length != "0") {
                    for (let i = 0; i < this.arr.length; i++) {
                        selectArr.push(this.arr[i].serviceTicket);
                    }
                    if (selectArr.indexOf(this.serviceTicket) == "-1") {
                        this.$axios.post("biz/ProEvtServiceTicketRelevan/save", {
                            serviceTicket: this.serviceTicket,
                            serviceTicketRelevant: selectArr.join(",")
                        }).then(result => {
                            this.arr = [];
                            selectArr = [];
                            this.$message.success("关联成功！");
                            this.$refs.auxGrid.refresh();
                            this.VisibleWith = false;
                        });
                    } else {
                        this.$confirm('不可以关联自己！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        });
                    }
                } else {
                    this.$confirm('请选择想要关联的数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                }
            },
            /*所有数据的提交*/
            submitData() {
                Object.assign(this.bizData, this.Form.centerServiceVo);
                Object.assign(this.bizData, this.mainDataForm);
                let proEvtWorkTicketLog = [];
                Object.assign(this.bizData, proEvtWorkTicketLog);
                /*serviceTicketCatalogs*/
                // this.bizData = this.mainDataForm.proEvtUserTicket;
                this.$axios.post('biz/ProEvtServiceTicket/updateFormData', this.bizData).then(result => {
                    this.$message.success("保存成功!");
                    this.$router.go(-1);
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            /*取消*/
            cancel() {
                this.$router.go(-1);
            }
        },
        created() {
            let oid = this.$route.query['dataId'];
            let click = this.$route.query['click'];
            this.$axios.get('biz/ProEvtUserTicket/getByServiceId', {params: {id: oid}}).then(result => {
                this.mainDataForm.proEvtUserTicket = result.data;
                this.urlWith = "biz/ProEvtServiceTicketRelevan/list";
                this.urlRecord = "biz/ProEvtServiceTicketLog/list";
                this.serviceTicket = result.data.serviceTicket;
                this.$refs.baseItem.startUrl();
                this.$axios.get('biz/ProEvtServiceTicket/getData', {params: {serviceTicket: this.mainDataForm.proEvtUserTicket.serviceTicket}}).then(result => {
                    this.Form.centerServiceVo = result.data;
                    if (this.Form.centerServiceVo.durationDoneUnit != null) {
                        this.Form.centerServiceVo.durationDoneUnit = result.data.durationDoneUnit + '';
                    } else {
                        this.Form.centerServiceVo.durationDoneUnit = "2";
                    }
                    this.Form.centerServiceVo.lvTitle = result.data.lvText;
                    if (result.data.serviceStatus > "1") {
                        this.$refs.baseItem.isLevelZeroShow(result.data);
                        this.$refs.baseItem.templateData(this.Form.centerServiceVo.catalogId, this.Form.centerServiceVo.areaId);
                    }
                })
            })
            if (click == "look") {
                this.haveYN = true;
                this.LYC = true;
                this.clickType = true;
            } else {
                this.haveYN = false;
                this.LYC = false;
                this.clickType = false;
            }
        }
    }
</script>

<style scoped>
    .footer {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }

    .footer-center {
        width: 20%;
        margin: auto;
    }
</style>
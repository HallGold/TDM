<template>
    <div style="width: 100%;display: flex;flex-direction: column;background: #fff">
        <el-tabs v-model="activeName" style="display: flex;flex-flow: column">
            <el-tab-pane label="用户首页" name="first" style="align-content:stretch"></el-tab-pane>
            <el-tab-pane label="处理中的服务单" name="second" style="flex: 1;"></el-tab-pane>
            <el-tab-pane label="已关闭的服务单" name="third"></el-tab-pane>
            <el-tab-pane label="我的关注" name="fourth"></el-tab-pane>
            <el-tab-pane label="我的阅知" name="fifth"></el-tab-pane>
        </el-tabs>
        <!--处理中的服务单-->
        <ice-query-grid
                v-if="activeName == 'second'"
                :data-url="secondUrl"
                :columns=secondColumns
                :buttons=secondButtons
                chooseItem="single"
                :query="queryDispose"
                @selection-change="traceSecond"
                ref="secondGrid"
        ></ice-query-grid>
        <!--已关闭的服务单-->
        <ice-query-grid
                v-if="activeName == 'third'"
                :data-url="thirdUrl"
                :columns=thirdColumns
                :query="queryClose"
                :buttons="thirdButtons"
                chooseItem="single"
                @selection-change="traceThird"
                ref="thirdGrid">
        </ice-query-grid>
        <!--我的关注-->
        <ice-query-grid
                v-if="activeName == 'fourth'"
                :data-url="fourthUrl"
                :columns=fourthColumns
                ref="fourthGrid"
                @selection-change="traceFourth"
        ></ice-query-grid>
        <!--我的阅知-->
        <ice-query-grid
                v-if="activeName == 'fifth'"
                :data-url="fifthUrl"
                :columns=columns4
                ref="fifthGrid"
        ></ice-query-grid>
        <ice-dialog v-dialogDrag title="用户评价"
                    remounted
                    :visible.sync="VisibleE"
                    width="1000px">
            <ice-grid-layout :columns="1">
                <evaluate :form="form" ref="sure"></evaluate>
                <div class="footer">
                    <el-button type="primary" @click="save">确定</el-button>
                    <el-button type="info" @click="close">取消</el-button>
                </div>
            </ice-grid-layout>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import Bus from "./base/bus.js"
    import userCompile from "./base/userCompile";
    import Evaluate from "./base/evaluate";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "serviceAcceptance",
        components: {IceDialog, IceGridLayout, Evaluate, IceQueryGrid, userCompile, Bus},
        data() {
            return {
                activeName: "first",
                thirdUrl: "",
                secondUrl: "",
                fourthUrl: "",
                fifthUrl: '',
                VisibleE: false,
                aclKeyReadonly: true,
                secondData: [],
                malfunction: "7",
                lookDetail: [],
                /**
                 * 评价
                 * */
                form: {
                    ticketNumber: "",
                    ticketType: "0",
                    feedbackType: "0",
                    totalScore: "",
                    responseSpeed: 0,
                    disposeSpeed: 0,
                    servSpeed: 0,
                    ability: 0,
                    evaluation: "",
                },
                secondColumns: [
                    {label: '服务单号', code: 'serviceTicket', width: 160},
                    {label: '类型', code: 'isBreakdown', width: 160, mapTypeCode: "Category"},
                    {label: '状态', code: 'serviceStatus', width: 120, mapTypeCode: 'serviceStatus'},
                    {label: '内容', code: 'description', width: 160},
                    {label: '创建时间', code: 'gmtCreate', width: 200},
                ],
                queryDispose: [
                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                    {type: 'select', label: '类型', code: 'isBreakdown', value: '', mapTypeCode: "Category"},
                    {type: 'input', label: '内容', code: 'DESCRIPTION', value: '',},
                    {type: 'date', label: '创建时间(开始)', code: 'gmtCreate', value: '', exp: ">=",compare:1},
                    {type: 'date', label: '创建时间(结束)', code: 'gmtCreate', value: '', exp: "<=",compare:2},
                ],
                thirdColumns: [
                    {label: '服务单号', code: 'serviceTicket',},
                    {label: '', code: 'oid', hidden: true},
                    {label: '类型', code: 'isBreakdown', mapTypeCode: "Category"},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: 'serviceStatus'},
                    {label: '内容', code: 'description',},
                    {label: '创建时间', code: 'gmtCreate',},
                ],
                queryClose: [
                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                    {type: 'select', label: '类型', code: 'isBreakdown', value: '', mapTypeCode: "Category"},
                    {type: 'input', label: '内容', code: 'DESCRIPTION', value: '',},
                    {type: 'date', label: '建单时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                    {type: 'date', label: '建单时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                ],
                thirdButtons: [
                    {
                        name: '详情', icon: 'el-icon-info', type: 'primary', callback: this.details
                    },
                    {
                        name: '评价', icon: 'el-icon-star-on', type: '', callback: this.evaluate
                    },
                ],
                fourthColumns: [
                    {
                        label: '单据类型', code: 'ticketType', renderCell(h, data) {
                            if (data.row.ticketType == "1") {
                                return "服务单"
                            }
                            return "工单"
                        }
                    },
                    {label: '单据号码', code: 'ticket',},
                    {label: '单据状态', code: 'status',},
                    {label: '描述', code: 'description',},
                    {label: '申请人', code: 'userName',},
                    {label: '申请时间', code: 'gmtRequest',},
                    {label: '关注时间', code: 'gmtCreate',},
                ],
                columns4: [
                    {label: '服务单号', code: 'serviceTicket',},
                    {
                        label: '单据状态', code: 'serviceStatus', mapTypeCode: 'serviceStatus'
                    },
                    {label: '描述', code: 'description',},
                    {label: '申请时间', code: 'gmtRequest',},
                    {label: '申请人', code: 'userName',},
                    {label: '抄送人', code: 'creatorName',},
                    {label: '抄送时间', code: 'gmtCreate',},
                    {
                        label: '是否已读', code: 'isRead', renderCell(h, data) {
                            if (data.row.isRead == "0") {
                                return "否"
                            }
                            return "是"
                        }
                    },
                ],
                secondButtons: [
                    {
                        name: '编辑', icon: 'el-icon-edit', type: '', callback: this.compile
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: '', callback: this.secondDel
                    },
                ],
            }
        },
        methods: {
            /**
             * 已关闭服务单详情
             * */
            details() {
                if (this.lookDetail.length == "0") {
                    this.$confirm('请选择一条数据进行查看！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    if (this.lookDetail[0].isBreakdown == "0") {
                        /*服务*/
                        this.$router.push("serviceTicket/transaction?dataId=" + this.lookDetail[0].oid + "&tabs=0&type=detail");
                    } else {
                        /*故障*/
                        this.$router.push("serviceTicket/transaction?dataId=" + this.lookDetail[0].oid + "&tabs=1&type=detail");
                    }
                }
            },
            /**
             * 处理中的服务单
             * */
            //编辑
            compile() {
                if (this.secondData.length === 0 || this.secondData.length > 1) {
                    this.$confirm('请选择一条数据进行编辑！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    if (this.secondData[0].serviceStatus == "0") {
                        this.$router.push("serviceTicket/transaction?tabs=" + this.malfunction + "&dataId=" + this.secondData[0].oid);
                    }
                }
            },
            //删除
            secondDel() {
                if (this.secondData.length == 0) {
                    this.$confirm('请选择一条数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    if (this.secondData[0].serviceStatus != "0") {

                    } else {
                        this.$confirm('确定删除！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            this.$axios.get('biz/ProEvtUserTicket/deleteTicket', {params: {id: this.secondData[0].serviceTicket}}).then(result => {
                                this.$refs.secondGrid.refresh();
                                this.$message.success("删除成功");
                            }).catch(error => {
                                this.$refs.secondGrid.refresh();
                                this.$message.error("出错啦");
                            })
                        })
                    }
                }
            },
            //取消评价
            close() {
                this.$refs.sure.refNum();
                this.VisibleE = false;
            },
            //用户保存评价
            save() {
                this.$refs.sure.isOK();
                if (this.$refs.sure.isOK() == true) {
                    this.$confirm('确定保存！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.post('biz/ProUserFeedback/saveFeedBack', this.form).then(result => {
                            this.$refs.sure.refNum();
                            this.VisibleE = false;
                            this.$message.success("保存成功");
                        }).catch((e) => {
                            this.$message.error(e.msg);
                        })
                    }).catch(() => {
                        this.$message.warning("取消保存");
                        this.$refs.sure.refNum();
                        this.VisibleE = false;
                    })
                }
            },
            //用户评价
            evaluate() {
                if (this.lookDetail.length == 0) {
                    this.$confirm('请选择一条数据进行评价！', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'info'
                    })
                } else {
                    this.form.ticketNumber = this.lookDetail[0].serviceTicket;
                    this.VisibleE = true;
                    this.$nextTick(() => {
                        this.$refs.sure.refNum();
                    })
                }
            },
            /**
             *处理中的服务单选中数据回调
             * */
            traceSecond(data) {
                this.secondData = data;
                if (this.secondData[0].serviceStatus == "0") {
                    this.secondButtons[0].type = "primary";
                    this.secondButtons[1].type = "primary";
                } else if (this.secondData[0].serviceStatus == "4") {
                    this.secondButtons[0].type = "info";
                    this.secondButtons[1].type = "info";
                } else {
                    this.secondButtons[0].type = "info";
                    this.secondButtons[1].type = "info";
                }
            },
            /**
             *已关闭的服务单选中数据回调
             * */
            traceThird(data) {
                this.lookDetail = data;
            },
            /**
             *处理中的服务单选中数据回调
             * */
            traceFourth(data) {
            },
        },
        beforeUpdate() {
            if (this.activeName == "second") {
                this.secondUrl = "biz/ProEvtServiceTicket/searchServiceList";
            } else if (this.activeName == "third") {
                this.thirdUrl = "biz/ProEvtServiceTicket/searchCloseServiceList";
            } else if (this.activeName == "fourth") {
                this.fourthUrl = "biz/ProEvtServiceTicket/searchVOByPage";
            } else if (this.activeName == "fifth") {
                this.fifthUrl = "biz/ProEvtServiceTicketCc/myRead";
            }
        },
        mounted() {
            Bus.$on("focus", (data => {
                if (data == "true") {
                    this.$refs.fourthGrid.refresh();
                }
            }))
        }
    }
</script>

<style scoped>
    .footer {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: center;
    }
</style>
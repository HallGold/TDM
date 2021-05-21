<template>
    <el-form>
        <!--服务单补录-->
        <!--基础信息-->
        <ice-grid-layout :columns="1" name="服务申请信息">
            <service-ask @change="formChange"></service-ask>
        </ice-grid-layout>
        <add-to-message></add-to-message>
        <!--基础信息-->
        <!--        <ice-grid-layout :columns="1" name="附件信息">-->
        <!--            <ice-single-upload :progress="progress" :on-success="success"-->
        <!--                               :beforeUpload="uploadBeforeUpload"></ice-single-upload>-->
        <!--        </ice-grid-layout>-->
    </el-form>

</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import ServiceAsk from "./base/serviceAsk";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import ServeMessage from "./base/serveMessage"
    import AccessMessage from "./base/AccessoryMessage"
    import affiliatedMessage from "./base/affiliatedMessage"
    import serviceApplyFor from "./base/serviceApplyFor"
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import {EventEmitter as $} from "events";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import addToMessage from "./base/addToMessage"
    import Add from "./base/Add";

    export default {
        name: "breakdownTicketTracking",
        components: {
            Add,
            addToMessage,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            IceSingleUpload,
            ServiceAsk,
            IceGridLayout,
            IceEditableTable,
            ServeMessage,
            AccessMessage,
            affiliatedMessage,
            serviceApplyFor,
            IceFlowForm,
            IceDeptSelector,
            IcePersionSelector,
            IceMultipleUpload,
            IceDatePicker
        },
        data() {
            return {
                Visible: false,
                activeName: "first",
                value1: null,
                value2: null,
                value3: null,
                value4: null,
                no: "",
                yes: true,
                aclKeyReadonly: false,
                aclKeyRead: false,
                message: "",
                change1: "input",
                change2: "readonly",
                only: false,
                label: "自定义处置时长:",
                labels: "",
                area: [],
                information: [],
                dataArr: [],
                //所选区域oid
                areaOid: "",
                first:"",
                second:"",
                Forms: {
                    proEvtUserTicket: {
                        isDone: "0",
                        userNameFeed: "",
                        totalScore: "",
                        evaluation: "",
                        undoneReason: "",
                        undoneDetail: ""
                    }
                },
                Form: {
                    proEvtUserTicket: {
                        //性质
                        serviceProperty: "",
                        //类别
                        isBreakdown: "0",
                        //影响度
                        serviceRange: "",
                        //紧急度
                        serviceEmergency: "",
                        //优先级
                        servicePriorityText: "",
                        //区域
                        areaCode: "请选择",
                        //服务名称
                        psbcname: "",
                        //服务名称
                        sname: "",
                        //服务级别
                        lvTitle: "",
                        //预计处置时长
                        durationDoneExpected: "",
                        //调度中心事件描述
                        description: "",
                        //是否影响服务
                        isServiceBreakdown: "0",
                        //处置时长单位（小时，分钟，天）
                        durationDoneUnit: "",
                        //是否0级
                        isLevelZero: "0"
                    }
                },
                mainDataForm: {
                    proEvtUserTicket: {
                        userPhone: "",
                        userMail: "",
                        sysuser: "0",
                        source: "",
                        description: "",
                        createrName: "",
                        //用户
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
                        isBreakdownEntry: "0",
                        //附件id
                        targetId: "",
                    },
                },
                workForm: {
                    proEvtUserTicket: {
                        id: '',
                        workTicket: "",
                        workTicketStatus: "",
                        serviceWay: "",
                        engineerRole: '',
                        engineerName: '',
                        engineerCode: '',
                        reason: '',
                        gmtBegin: '',
                        gmtEnd: '',
                        resolveStatus: '',
                        measure: ''
                    }
                },
                columnsB: [
                    {label: '工单号', code: 'workTicket', width: 200},
                    {label: '工单状态', code: 'workTicketStatus',},
                    {label: '工程师角色', code: 'engineerRole',},
                    {label: '工程师名称', code: 'engineerName',},
                    {label: '起因', code: 'reason',},
                    {label: '服务方式', code: 'serviceWay',},
                    {label: '开始处理时间', code: 'gmtBegin',},
                    {label: '问题解决时间', code: 'gmtEnd',},
                    {label: '解决状态', code: 'resolveStatus',},
                ],
                buttonsB: [
                    {
                        name: '添加工单', icon: 'el-icon-plus', type: 'primary', callback: this.addThing
                    },
                ],
                columnsBs: [
                    {label: '区域', code: 'areaName',},
                    {label: '技术服务目录ID', code: 'techId', hidden: true},
                    {label: '是否默认', code: 'isDefault', hidden: true},
                    {label: '服务大类', code: 'parentName',},
                    {label: '服务名称', code: 'categoryName',},
                    {label: '服务项', code: 'catalogName',},
                    {label: '技术手册', code: 'manual',},
                    {label: '服务对象', code: 'devName',},
                    {label: '操作内容', code: 'operation',},
                    {label: '操作时间', code: 'gmtCreate',},
                ],
                buttonsBs: [
                    {
                        name: '新增目录', icon: 'el-icon-plus', type: 'primary', callback: this.addCata
                    },
                    {
                        name: '新增对象', icon: 'el-icon-plus', type: 'primary', callback: this.addObj
                    },
                    {
                        name: '删除目录', icon: 'el-icon-close', type: 'primary', callback: this.delCata
                    },
                    {
                        name: '删除对象', icon: 'el-icon-close', type: 'primary', callback: this.delObj
                    },
                ],
                columns: [
                    {label: '业务服务目录ID', code: 'techId', hidden: true},
                    {label: '是否默认', code: 'isDefault', hidden: true},
                    {label: '区域', code: 'shortname',},
                    {label: '服务大类', code: 'parentName',},
                    {label: '服务分类', code: 'techCategoryName',},
                    {label: '服务项', code: 'techSname',},
                    {label: '技术手册', code: 'manual',},
                ],
                query: [],
                buttons: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: 'primary', callback: this.add
                    },
                    {
                        name: '删除', icon: 'el-icon-plus', type: 'primary', callback: this.del
                    },
                ],
                querys: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: '',
                        value: '0',
                        click: value => {
                            if (value === '0') {
                                this.columnsBs = [
                                    {label: '区域', code: 'areaName',},
                                    {label: '技术服务目录ID', code: 'techId', hidden: true},
                                    {label: '是否默认', code: 'isDefault', hidden: true},
                                    {label: '服务大类', code: 'parentName',},
                                    {label: '服务名称', code: 'categoryName',},
                                    {label: '服务项', code: 'catalogName',},
                                    {label: '技术手册', code: 'manual',},
                                    {label: '服务对象', code: 'devName',},
                                    {label: '操作内容', code: 'operation',},
                                    {label: '操作时间', code: 'gmtCreate',},
                                ];
                                this.buttonsBs = [
                                    {
                                        name: '新增目录', icon: 'el-icon-plus', type: 'primary', callback: this.addCata
                                    },
                                    {
                                        name: '新增对象', icon: 'el-icon-plus', type: 'primary', callback: this.addObj
                                    },
                                    {
                                        name: '删除目录', icon: 'el-icon-close', type: 'primary', callback: this.delCata
                                    },
                                    {
                                        name: '删除对象', icon: 'el-icon-close', type: 'primary', callback: this.delObj
                                    },
                                ]
                            } else if (value === "1") {
                                this.columnsBs = [
                                    {label: '参与人', code: 'engineerName',},
                                    {label: '贡献度(%)', code: 'contribution',},
                                    {label: '参与事项', code: 'detail',},
                                    {label: '操作', code: 'operation',},
                                ]
                                this.buttonsBs = [
                                    {
                                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addNum
                                    },
                                    {
                                        name: '删除', icon: 'el-icon-close', type: 'primary', callback: this.delNum
                                    }
                                ]
                            } else if (value === "2") {
                                this.columnsBs = [
                                    {label: '申请编号', code: 'applyCode',},
                                    {label: '申请人', code: 'applyerName',},
                                    {label: '申请单位', code: 'applyerDepartment',},
                                    {label: '申请时间', code: 'applyTime',},
                                    {label: '陪同人', code: 'companionName',},
                                    {label: '申请进入部位', code: 'inLocation',},
                                    {label: '状态', code: 'state',},
                                ]
                                this.buttonsBs = [
                                    {
                                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addNum
                                    },
                                    {
                                        name: '删除', icon: 'el-icon-close', type: 'primary', callback: this.delNum
                                    }
                                ]
                            } else if (value === "3") {
                                this.columnsBs = [
                                    {label: '第三方厂商', code: 'unitname',},
                                    {label: '企业性质', code: 'quality',},
                                    {label: '响应速度', code: 'responseSpeed',},
                                    {label: '处理速度', code: 'disposeSpeed',},
                                    {label: '服务速度', code: 'servSpeed',},
                                    {label: '专业能力', code: 'ability',},
                                    {label: '总分', code: 'totalScore',},
                                    {label: '评价', code: 'evaluation',},
                                    {label: '处理人信息', code: 'contacterInfos',},
                                    {label: '操作', code: 'operate',},
                                ];
                                this.buttonsBs = []
                            }
                        },
                        tablist: [
                            {label: '技术服务目录信息', value: '0',},
                            {label: '参与人信息', value: '1'},
                            {label: '进入申请信息', value: '2',},
                            {label: '第三方厂商', value: '3'},
                        ]
                    }
                ],
                formRules: {
                    Tel: [{required: true, message: '请输入', trigger: 'blur'}],
                    Mobile: [{required: true, message: '请输入', trigger: 'blur'}],
                    Mail: [{required: true, message: '请输入', trigger: 'blur'}],
                    cTel: [{required: true, message: '请输入', trigger: 'blur'}],
                    cMobile: [{required: true, message: '请输入', trigger: 'blur'}],
                    cMail: [{required: true, message: '请输入', trigger: 'blur'}],
                },
            }
        },
        //收集数据 服务单补录
        //mainDataForm 服务申请信息
        //Form 基础信息
        //工单补录
        //Forms
        //添加工单弹窗
        methods: {
            addThing() {
                this.Visible = true;
            },
            addCata() {
                this.$confirm('暂无信息！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            addObj() {
                this.$confirm('请选择需要添加服务对象的技术服务目录!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            delCata() {
                this.$confirm('请选择一条或多条数据!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            delObj() {
                this.$confirm('请选择一条或多条数据!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            addNum() {
                this.$confirm('暂无数据!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            delNum() {
                this.$confirm('请选择一条或多条数据!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                });
            },
            success(response, file, fileList) {
                this.mainDataForm.proEvtUserTicket.targetId = response.data;
                console.log(this.mainDataForm.proEvtUserTicket);
                alert("上传成功！");
            },
            progress(event, file, fileList) {
            },
            uploadBeforeUpload(file) {
            },
            //技术目录新增
            add() {
                if (this.Form.proEvtUserTicket.areaCode == "请选择" || this.Form.proEvtUserTicket.areaCode == "") {
                    this.$confirm('请先选择区域！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    // this.$axios.delete('pro/ProScBizTech/tree', {params: {oid: this.areaOid}}).then(result => {
                    //     console.log(result)
                    // })
                    this.$confirm('暂无数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            //技术服务目录删除
            del() {
                if (this.dataArr.length != "0") {
                    this.$confirm('确定删除操作吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete('biz/ProEvtUserTicket/del', {params: {id: row.id}}).then(result => {
                            this.$message.success("删除成功");
                        }).catch(error => {
                            this.$message.error("出错啦");
                        })
                    });
                } else {
                    this.$confirm('请选择一条或者多条数据进行操作！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            change(row) {
                this.dataArr = row;
            },
            selectSome() {
                if (this.Form.proEvtUserTicket.areaCode == "请选择" || this.Form.proEvtUserTicket.areaCode == "") {
                    this.$confirm('请先选择区域！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$confirm('暂无数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            formChange(){
                console.log("OK");
            }
        },
        beforeUpdate() {
            if (this.Forms.proEvtUserTicket.isDone === "1") {
                this.no = true;
                this.yes = false;
            } else {
                this.no = false;
                this.yes = true;
            };
            //影响度*紧急度=N；N<4,优先级=1；N<9,优先级=2；N<16，优先级=3；N=16,优先级=4；
            if (this.Form.proEvtUserTicket.serviceRange == "" || this.Form.proEvtUserTicket.serviceEmergency == "") {

            } else {
                let N = this.Form.proEvtUserTicket.serviceRange * this.Form.proEvtUserTicket.serviceEmergency;
                if (N < 4) {
                    this.Form.proEvtUserTicket.servicePriorityText = "1级";
                } else if (N > 4 && N < 9) {
                    this.Form.proEvtUserTicket.servicePriorityText = "2级";
                } else if (N > 9 && N < 16) {
                    this.Form.proEvtUserTicket.servicePriorityText = "3级";
                } else if (N == 16) {
                    this.Form.proEvtUserTicket.servicePriorityText = "4级";
                }
            }
            //判断是否0级
            if (this.Form.proEvtUserTicket.isLevelZero == "0") {
                this.label = "自定义处置时长:";
                this.labels = false;
            } else if (this.Form.proEvtUserTicket.isLevelZero == "1") {
                this.label = "预计处置时长:";
                this.labels = true;
                this.Form.proEvtUserTicket.durationDoneUnit = "1";
            }
            //服务申请与故障申报的区别
            if (this.Form.proEvtUserTicket.isBreakdown == "0") {
                this.aclKeyReadonly = true;
                this.only = false;
            } else {
                this.aclKeyReadonly = false;
                this.only = true;
            }
            //区域与技术服务目录
            if (this.Form.proEvtUserTicket.areaCode !== "请选择") {
                for (let i = 0; i < this.area.length; i++) {
                    if (this.area[i].code === this.Form.proEvtUserTicket.areaCode) {
                        this.areaOid = this.area[i].oid;
                    }
                }
            }
            if (this.mainDataForm.proEvtUserTicket.sysuser == 1) {
                this.change1 = "readonly";
                this.change2 = "input";
                this.mainDataForm.proEvtUserTicket.userName = "";
                this.mainDataForm.proEvtUserTicket.userCode = "";
                //用户单位及code
                this.mainDataForm.proEvtUserTicket.userDeptName = "";
                this.mainDataForm.proEvtUserTicket.userDeptCode = "";
                //用户手机号码
                this.mainDataForm.proEvtUserTicket.userMobile = "";
                //用户座机号码
                this.mainDataForm.proEvtUserTicket.userPhone = "";
            } else {
                this.change1 = "input";
                this.change2 = "readonly";
            }
        },
        watch: {
            mainDataForm() {
                this.$emit("change", this.mainDataForm)
            }
        },
        beforeCreate() {
            this.$axios.get('/pro/ProBaseArea/tree').then(result => {
                this.area = result.data[0].children;
                // console.log(this.area);
            });
            //前一页面所传值
            let tabs = this.$route.query['tabs'];
            //前一页面所传属性
            let type = this.$route.query['type'];
            // if (type === "detail"){
            //     console.log(type,tabs);
            if (tabs == "0" && type == "detail") {
                this.keyRea = true;
                this.showD = false;
            } else if (tabs === "1") {
                this.keyRea = true;
                this.showD = false;
            } else if (tabs === "2") {
                this.keyRea = true;
                this.showD = false;
            } else if (tabs === "3") {
                this.keyRea = true;
                this.showD = false;
            } else {
                this.keyRea = false;
                this.showD = true;
            }
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
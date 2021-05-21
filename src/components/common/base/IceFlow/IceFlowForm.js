import {Loading} from 'element-ui';
import {
    addResizeListener,
    removeResizeListener
} from 'element-ui/lib/utils/resize-event';
import {mapGetters, mapMutations} from 'vuex';
import IceFlowBtn from './IceFlowBtn';
import qs from 'qs'
import MD5 from 'md5.js'

export default {
    mixins: [IceFlowBtn],
    props: {
        showsecrethint: false,
        extendTabs: {
            type: Array,
            default: function () {
                return [
                    /* {name: '附加1'},
                               {name: '附加2'}*/
                ];
            }
        },
        tabShow: {
            //是否隐藏审批信息
            type: Boolean,
            default: true
        },
        loadBtn: {
            //流程按钮的加载
            type: Boolean,
            default: true
        },
        isSecret: {type: Boolean, default: false}, //是否涉密
        oneTabName: {type: String, default: '申请信息'},
        twoTabName: {type: String, default: '审批信息'},
        callActTransmitVar: {type: Object},
        flowReady: {type: Function},
        flowOperateBtn: {type: Function},
        flowValidate: {type: Function},
        flowBizData: {type: Function, required: true},
        btnExtend1: {type: Function},
        btnExtend2: {type: Function},
        btnExtend3: {type: Function},
        btnExtend4: {type: Function},
        btnExtend5: {type: Function},
        btnExtend6: {type: Function},
        btnExtend7: {type: Function},
        btnExtend8: {type: Function},
        btnExtend9: {type: Function},
        btnExtend10: {type: Function},
        applyType: [Boolean, String], //1、formGroup  使用iceFormGroup 布局     2、elRow  使用el-row 布局  3、true:默认使用el-row
        urlRender: {
            type: Boolean,
            default: true
        },
        renderComponentString: {
            type: String,
            default: ''
        },
        SJID: {
            type: String,
            default: ''
        },
        // 传进来的左偏移量附加值 默认值0
        leftProp: {
            default: 0
        }
    },
    data() {
        return {
            // 计算做偏移量
            formLeft: '200px',
            //showUserOptionsDialog: false,
            flowReadyIsLoadOk: false, //flowReady方法是否已经加载
            userOptions: [],
            closeWindows: true,
            reloadWindows: false,
            appendText: {before: '加签在我之前', after: '加签在我之后'},
            //showTag: ["请检查", "同意", "反对"],
            showTag: [
                {type: 'warning', content: '请检查'},
                {type: 'success', content: '同意'},
                {
                    type: 'danger',
                    content: '反对'
                }
            ],
            /* tags: {
                       "submit": [{type: "warning", text: "请检查"}, {type: "success", text: "同意"}],
                       "reject": [{type: "danger", text: "反对"}, {type: "warning", text: "不同意"}]
                   },*/
            width: 0,
            activeTabIndex: 0,
            popSelectColumns: [
                {label: '姓名', code: 'name', width: 120},
                {label: '部门', code: 'dept', width: 120},
                {label: '岗位', code: 'city', width: 120}
            ],
            popSelectData: [],
            movingColumns: [
                {label: '环节名称', code: 'nodeName', width: 120},
                {label: '环节类型', code: 'nodeType', width: 120},
                {label: '开始时间', code: 'nodeBeginTime', width: 200},
                {label: '完成时间', code: 'nodeEndTime', width: 200}
            ],
            movingGridDataUrl: '',
            taskGridDataUrl: '',
            operationsBtn: [
                //remark by rocky 2020-03-19 FIXBUG #4858 取消操作记录的查看按钮
                //{name: '查看', callback: this.showOperationDetail}
            ],
            operateColumns: [
                {label: '操作时间', code: 'operateTime', width: 200},
                {label: '操作人', code: 'operaterName', width: 150},
                {label: '操作类型', code: 'operateName', width: 120},
                {label: '操作环节', code: 'nodeName', width: 120},
                {label: '流向环节', code: 'flowNodeName', width: 120}
            ],
            taskColumns: [
                {label: '任务环节', code: 'nodeName', width: 100},
                {label: '环节类型', code: 'nodeType', width: 80},
                {label: '开始时间', code: 'beginTime', width: 150},
                {label: '预定处理人', code: 'assignerName', width: 150},
                {label: '完成时间', code: 'endTime', width: 150},
                {label: '实际处理人', code: 'realAssignerName', width: 150},
                {label: '意见', code: 'opinion', width: 120, showOverflow: 'title'}
            ],
            suggestionColumns: [
                {label: '处理人', code: 'operaterName', width: 150},
                {label: '处理环节', code: 'nodeName', width: 120},
                {label: '处理类型', code: 'operateName', width: 100},
                {label: '处理时间', code: 'operateTime', width: 150},
                {label: '处理结果', code: 'opinion'}
            ],
            operateDataList: [], //操作记录
            operateDataMsgList: [],
            viewFlowDialog: false,
            nextNodeShow: true,
            nextUserShow: true,
            dataSecretText: '非密', //名字
            fileSecretObj: {}, //文件密级
            submitFlowDialog: false,
            collectorAssigners: false,
            replacePersonUser: [],
            flowAssignerMap: {},
            flowNodesStatus: '{}',
            flowNodesInfo: {},
            flowContext: {
                dataSecretLevcode: '1',
                actDefName: '',
                actInstId: '',
                actDefId: '',
                dataId: null,
                nodeId: 'FirstNode',
                // formId: this.$route.fullPath,

                formId: this.urlRender
                    ? this.$route.fullPath
                    : this.renderComponentString,
                executionId: null,
                taskUserId: null,
                nextNodeId: null,
                nextNodeName: null,
                operater: null,
                applyer: null,
                operateType: 'submit',
                operateName: null,
                subOperateType: null,
                subOperateName: null,
                targetNodeId: null,
                authorAssigner: null,
                appendType: null,
                appendAuthors: null,
                notifyReceivers: null,
                targetTaskPoolId: null,
                claimNumber: 0,
                claimType: null,
                //流程处理意见
                flowComment: null,
                //流程消息提示
                flowMessage: null,
                deliverUser: '',
                assigners: {},
                //processVar: {},
                bizCallClass: '',
                callActTransmitVar: '',
                preAssigners: {},
                getFormReadonly: _ => this.formReadonly,
                getIsAuthor: _ => this.isAuthor
            },
            nextUserLabel: '下一处理人',
            nextUserLabelLy: '例外',
            nextUserName: '',
            nextUserNameLy: "",
            nextPersons: [],
            nextUserId: '',
            // nextUserMode: "readonly",
            nextUserRead: false,
            flowInstData: {
                isNewFlow: true,
                actDefId: '',
                currentTask: {oid: ''},
                nodeButtons: [
                    {
                        key: 'save',
                        text: '保存',
                        type: null,
                        value: null,
                        accessKey: null
                    }
                ],
                actInstId: '',
                definition: {
                    id: '',
                    key: '',
                    version: 1,
                    name: '',
                    description: '',
                    type: 't1',
                    bizDataRule: null
                },
                isAuthor: true,
                nodeUserSetList: []
            },
            bizdata: {},
            submiting: false,
            formGroupRepostory: {}, //form组信息列表
            formGroupRepostoryList: [],
            formGroupLeft: 0, //分组左边对齐偏移量
            userActived: false, //用户点击了分组信息
            activedForm: 0, //当前激活的form组
            activeTimeOut: -1,
            resizeEventListener: e => {
                this.formGroupLeft = this.$refs['flow-form-wrapper']
                    ? Number(this.$refs['flow-form-wrapper'].offsetLeft) - 128 + 'px'
                    : '-128px';
            },
            applyRules: {
                //申请人信息校验
                afPhone: [
                    {
                        required: true,
                        whitespace: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }
                ]
            },
            printItems: {}, //打印元素收集
            showInvalid: false,
            showInvalidTimer: null,
            showInvalidEnhance: false,
            showInvalidEnhanceTimer: null,
            callActTransmitVarComm: {},
            pageModified: false,//页面数据已被修改
            // 任务记录
            taskRecord: []
        };
    },
    methods: {
        // 任务记录
        tableChange(data) {
            this.taskRecord = data;
        },
        selectConfirmPersons(data) {
            console.log(data)
            this.nextPersons = data;
        },
        ...mapMutations('datamapStore', ['addUndoTypeCodes']),
        ...mapGetters('datamapStore', ['getDataMap', 'getReversedDataMap']),
        taskRowSpanMethod({row, column, rowIndex, columnIndex, data}) {
            /*  if (columnIndex === 4) {
                        if (row.nodeType == "单签多人" && data[rowIndex + 1] && data[rowIndex + 1].nodeId == row.nodeId) {
                            //data[rowIndex+1].endTime="";
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        }
                    }
                    if (columnIndex === 5) {
                        if (row.nodeType == "单签多人" && data[rowIndex + 1] && data[rowIndex + 1].nodeId == row.nodeId) {
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        }
                    }*/
        },
        selectConfirmAppendUser(rows) {
            this.nextUserName = rows[0].name;
            this.flowContext.appendAuthors = rows[0].code;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        selectConfirmHandover(rows) {
            this.flowContext.newAssigner = rows[0].code;
            this.nextUserName = rows[0].name;
            this.nextNodeShow = false;
            this.submitFlowDialog = true;
        },
        selectConfirmDeliver(rows) {
            this.flowContext.deliverUser = JSON.stringify(rows);
            this.closeWindows = false;
            this.flowOperate();
        },
        flowNodesStatusInit() {
            // console.log(this.flowInstData)
            if (this.flowInstData.proOperates) {
                let nodeStatus = {},
                    flowNodesInfo = {};
                this.flowInstData.proOperates.forEach(item => {
                    nodeStatus[item.nodeId] = 'success';
                    if (item.operateKey == 'reject') {
                        nodeStatus[item.nodeId] = 'reject';
                    }
                    flowNodesInfo[item.nodeId] = {
                        operaterName: item.operaterName,
                        operateName: item.operateName,
                        operateTime: item.operateTime,
                        opinion: item.opinion,
                        status: nodeStatus[item.nodeId]
                    };
                });
                if (this.flowInstData.proNodeList) {
                    this.flowInstData.proNodeList.forEach(item => {
                        nodeStatus[item.nodeId] = 'runing';
                        let task = this.flowInstData.currentTask;
                        let assignerName = '';
                        if (task && this.currentAssignersList && this.currentAssignersList.length > 0) {
                            this.currentAssignersList.forEach(assigner => {
                                if (item.nodeId == assigner.nodeId && assigner.status == 0) {
                                    if (assignerName === '') {
                                        assignerName = assigner.assignerName;
                                    } else {
                                        assignerName += ',' + assigner.assignerName;
                                    }
                                }
                            });
                        }
                        flowNodesInfo[item.nodeId] = {
                            operaterName: assignerName ? assignerName : task ? task.assignerName : '',
                            beginTime: task.beginTime,
                            operateName: '',
                            operateTime: '',
                            opinion: '',
                            status: nodeStatus[item.nodeId]
                        };
                    });
                }
                this.flowNodesStatus = JSON.stringify(nodeStatus);
                this.flowNodesInfo = flowNodesInfo;
                console.log(this.flowNodesInfo, 'flowNodesInfo2341231')
            }
        },
        showOperationDetail(row) {
            let formId = '';
            if (this.flowInstData.proRun && this.flowInstData.proRun.formId) {
                formId = this.flowInstData.proRun.formId;
            }
            formId = formId + '&operateId=' + row.oid;
            //this.openWin("#" + formId, "环节历史数据查看");
            this.$openFlow(formId, {blank: true});
            //this.$router.push( );
        },
        openWin(url, name) {
            var iWidth = window.screen.availWidth - 10; //弹出窗口的宽度;
            var iHeight = window.screen.availHeight - 30; //弹出窗口的高度;
            //获得窗口的垂直位置
            var iTop = 0; // (window.screen.availHeight - 30 - iHeight) / 2;
            //获得窗口的水平位置
            var iLeft = 0; // (window.screen.availWidth - 10 - iWidth) / 2;
            window.open(url); //,'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
            // window.open("AddScfj.aspx", "newWindows", 'height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        },
        handleClick(tab, event) {
            this.activeTabIndex = tab.index;
        },
        selectConfirm(rows, key, texts, nodeId) {
            // alert(JSON.stringify(rows))
            // debugger
            let assginIds = '',
                assginNames = '';
            rows.forEach(item => {
                assginIds += ',' + item.code;
                assginNames += ',' + item.name;
            });
            assginIds = assginIds.substr(1);
            assginNames = assginNames.substr(1);
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == nodeId
            );
            obj.assignerId = assginIds;
            obj.assignerName = assginNames;
            this.collectorAssigners = true;
        },
        showButton() {
            for (let i = 0; i < this.flowButtons.length; i++) {
                //隐藏所有
                if (
                    !(
                        this.flowButtons[i].key == 'quit' ||
                        this.flowButtons[i].key == 'view'
                    )
                ) {
                    this.flowButtons[i].isShow = false;
                }
                //驳回
                if (this.flowButtons[i].key == 'reject') {
                    let nodeSet = this.flowInstData.flowNodes['FirstNode'];
                    let list = [
                        {
                            text: nodeSet.nodeName ? nodeSet.nodeName : '填写申请',
                            key: 'FirstNode',
                            clickFun: this.btnReject
                        }
                    ];
                    this.$set(this.flowButtons[i], 'list', list);
                }
                //跳转
                if (this.flowButtons[i].key == 'jump') {
                    let nodeSet = this.flowInstData.flowNodes['FirstNode'];
                    let list = [
                        {
                            text: nodeSet.nodeName ? nodeSet.nodeName : '填写申请',
                            key: 'FirstNode',
                            clickFun: this.btnJump
                        }
                    ];
                    this.$set(this.flowButtons[i], 'list', list);
                }
            }
            let buttons = this.flowInstData.nodeButtons
                ? this.flowInstData.nodeButtons.btnList
                : [];
            //  alert(JSON.stringify(this.flowContext))
            let task = this.flowInstData.currentTask;
            if (task && task.classify == 'HANGUP' && this.flowInstData.isAuthor) {
                buttons = ['cancelHangup'];
            }
            if (task && task.classify != 'HANGUP') {
                let index = buttons.indexOf('cancelHangup');
                if (index != -1) {
                    buttons.splice(index, 1);
                }
            }
            if (task && task.groupTask == '1' && this.flowInstData.isAuthor) {
                buttons = ['claim'];
            }
            if (
                task &&
                task.groupTask == '2' &&
                task.status == 0 &&
                this.flowInstData.isAuthor
            ) {
                buttons.push('backpool');
                if (buttons.indexOf('claim') != -1) {
                    buttons.splice(buttons.indexOf('claim'), 1);
                }
            }
            if (
                task &&
                task.inOperateType == 'reject' &&
                this.flowContext.nodeId == 'FirstNode' &&
                this.flowInstData.isAuthor
            ) {
                buttons.push('stop');
            }
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.nodeType == 'SubProcessNode'
            ) {
                buttons = [];
            }
            if (buttons) {
                //当前为处理人
                buttons.forEach(key => {
                    for (let i = 0; i < this.flowButtons.length; i++) {
                        if (this.flowButtons[i].key == key) {
                            if (this.flowInstData.isNewFlow) {
                                let isNewBtn = key == 'save' || key == 'submit';
                                if (!isNewBtn) {
                                    continue;
                                }
                            }
                            this.flowButtons[i].isShow = true;
                            if (
                                this.flowInstData.nodeButtons &&
                                this.flowInstData.nodeButtons[key]
                            ) {
                                this.flowButtons[i].text = this.flowInstData.nodeButtons[key];
                            }
                        }
                    }
                });
            }
        },
        hiddenBtn(btns) {
            // 根据btnkey隐藏按钮  keys逗号间隔 支持多个
            this.optButton(btns, false);
        },
        hiddenBtnChild(btn, codes) {
            // 隐藏按钮的下级按钮
            for (let i = 0; i < this.flowButtons.length; i++) {
                if (this.flowButtons[i].key == btn) {
                    if (this.flowButtons[i].list && this.flowButtons[i].list.length > 1) {
                        let list = this.flowButtons[i].list.filter(
                            item => codes.indexOf(item.key) == -1
                        );
                        this.flowButtons[i].list = list;
                    }
                }
            }
        },
        optButton(btns, bol) {
            if (btns) {
                let keys = btns.split(',');
                keys.forEach(key => {
                    for (let i = 0; i < this.flowButtons.length; i++) {
                        if (this.flowButtons[i].key == key) {
                            this.flowButtons[i].isShow = bol;
                        }
                    }
                });
            }
        },
        showBtn(btns) {
            this.optButton(btns, true);
        },
        isAdmin() {
            let isAdmin = false;
            if (this.flowInstData.isAdmin) {
                isAdmin = true;
            }
            return isAdmin;
        },
        async callBizFlowBtn(call, type) {
            if (type == 1) {
                call();
                return;
            }
            if (this.showInvalidEnhanceTimer) {
                clearTimeout(this.showInvalidEnhanceTimer);
            }
            this.showInvalidEnhanceTimer = null;
            if (this.showInvalidTimer) {
                clearTimeout(this.showInvalidTimer);
            }
            this.showInvalidTimer = null;
            this.showInvalid = false;
            this.showInvalidEnhance = false;
            if (this.flowOperateBtn) {
                //流程操作按钮
                //校验申请人信息
                let applyValid = true;
                if (
                    this.applyShowRule == 'gridLayout' ||
                    this.applyShowRule == 'elRow'
                ) {
                    const applyForm = this.$refs.applyForm;
                    try {
                        applyValid = await applyForm.validate();
                    } catch (e) {
                        applyValid = false;
                    }
                }

                let operateValid = true;
                const operate = this.flowOperateBtn(this.flowContext, this.bizdata);
                try {
                    operateValid = await operate;
                } catch (e) {
                    operateValid = false;
                    if (operate.catchHandler) {
                        operate.catchHandler(e);
                    } else {
                        // this.$message.error("按钮出错!");
                    }
                }

                let result = {success: false, break: false};

                if (
                    typeof operateValid === 'object' &&
                    !(operateValid instanceof Array)
                ) {
                    result = operateValid;
                } else {
                    result = {
                        success: operateValid,
                        break: false
                    };
                }

                if ((result.success && result.break === false && applyValid)) {
                    call();
                    return;
                }

                if (result.break === false) {
                    this.showInvalid = true;
                    this.showInvalidEnhance = true;
                    this.showInvalidEnhanceTimer = setTimeout(_ => {
                        this.showInvalidEnhance = false;
                        this.showInvalidEnhanceTimer = null;
                    }, 1000);
                    this.showInvalidTimer = setTimeout(_ => {
                        this.showInvalid = false;
                        this.showInvalidTimer = null;
                    }, 10000);
                }

                return false;

                /*
                                        if (operate instanceof Promise) {
                                            operate.then((result) => {
                                                if (result) {
                                                    if (call) call();
                                                } else {
                                                    // this.$message.error("请检查表单数据，存在校验未通过的数据")
                                                }
                                            }).catch((res) => {

                                            });
                                        } else {
                                            if (!operate) {
                                                // this.$message.error("请检查表单数据，存在校验未通过的数据")
                                                return false;
                                            }
                                            if (call) call();
                                        }*/
            } else {
                if (call) call();
            }
        },
        __flowOperate() {
            if (this.flowBizData) {
                let data = this.flowBizData();
                if (!data.oid) {
                    data.oid = this.bizdata.oid ? this.bizdata.oid : '';
                }
                this.bizdata = {...this.bizdata, ...data};
                // 请输入密级
                if (this.bizdata.jhglVo) {
                    if (!this.bizdata.jhglVo.dataSecretLevcode) {
                        this.$message.error("请输入密级！");
                        return;
                    }
                } else if (!this.bizdata.dataSecretLevcode) {
                    this.$message.error("请输入密级！");
                    return;
                }

            }
            this.$confirm('确定保存操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            })
                .then(() => {
                    this.flowOperate();
                })
                .catch(() => {
                });
        },
        validateFlowAssigners() {
            ////1.本环节处理人不允许为空 2.下一环节处理人不鞥为空3.后端配置为必填不允许为空
            let auto = true;
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == this.flowContext.nodeId
            );
            let nodeSet = this.flowInstData.flowNodes[this.flowContext.nodeId];
            if (obj && !obj.assignerId && nodeSet && !nodeSet.autoSkipNull) {
                this.$message.error(obj.nodeName + '：环节审批人为空');
                auto = false;
                return auto;
            }
            let next = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == this.flowContext.nextNodeId
            );
            nodeSet = this.flowInstData.flowNodes[this.flowContext.nextNodeId];
            if (next && !next.assignerId && nodeSet && !nodeSet.autoSkipNull) {
                this.$message.error(next.nodeName + '：环节审批人为空');
                auto = false;
                return auto;
            }

            this.flowInstData.nodeUserSetList.forEach(item => {
                let roleFormula = item.roleFormula;
                if (typeof item.roleFormula == 'string') {
                    roleFormula = JSON.parse(item.roleFormula);
                }
                if (!item.assignerId && roleFormula.required) {
                    this.$message.error(item.nodeName + '：环节审批人为空');
                    auto = false;
                    return auto;
                }
            });

            //校验表单密级
            if (this.showSecret) {
                if (!this.flowContext.dataSecretLevcode) {
                    this.$message.error('必须选择密级');
                    auto = false;
                }
                if (this.flowContext.dataSecretLevcode < this.minSecret) {
                    this.$message.error('表单密级必须大于上传的附件密级');
                    auto = false;
                }
            }
            return auto;
        },
        validateNodeSet() {
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.isRequiredCommont
            ) {
                if (!this.flowContext.flowComment && this.submitFlowDialog) {
                    this.$message.error('处理意见必填');
                    return false;
                }
            }
            return true;
        },
        flowOperate() {
            if (this.flowBizData) {
                let data = this.flowBizData();
                if (!data.oid) {
                    data.oid = this.bizdata.oid ? this.bizdata.oid : '';
                }
                this.bizdata = {...this.bizdata, ...data};
            }
            if (!this.validateFlowAssigners()) {
                return;
            }
            if (!this.validateNodeSet()) {
                return;
            }
            let loadingInstance = this.showLoading();
            let obj = Object.assign({}, this.flowContext);
            let ass = {};
            let assigners = {};//FIX 选人无效问题
            this.flowInstData.nodeUserSetList.forEach(item => {
                if (item.assignerId && item.nodeId == this.flowContext.nextNodeId) {
                    let o = {
                        assignerId: item.assignerId,
                        assignerName: item.assignerName
                    };
                    assigners[item.nodeId] = item.assignerId;//FIX 选人无效问题
                    ass[item.nodeId] = o;
                }
            });

            if (obj.processVar) {
                obj.processVar = JSON.stringify(obj.processVar);
            }
            if (this.collectorAssigners) {
                obj.assigners = JSON.stringify(assigners);//FIX 选人无效问题
                obj.preAssigners = JSON.stringify(ass);
            }
            if (this.isFirstNode && this.flowInstData.isNewFlow) {
                //obj.applyer = ass[this.flowContext.nodeId].assignerId;
            }
            if (this.callActTransmitVar) {
                obj.callActTransmitVar = JSON.stringify(this.callActTransmitVar);
            }
            if (!this.isSecret) {
                //不涉密数据
                this.flowContext.dataSecretLevcode = '1';
            }
            this.submiting = true;
            this.submitFlowDialog = false;

            this.$axios
                .post('/bpm/pro/run', {
                    bizData: JSON.stringify(this.bizdata),
                    flowContext: obj
                })
                .then(result => {

                    if (result.data) {
                        this.bizdata = result.data;
                    }
                    this.pageModified = false


                    // loadingInstance.close();
                    if (this.reloadWindows) {
                        this.$$loadData();
                        this.reloadWindows = false;
                        return;
                    }
                    if (this.closeWindows) {
                        this.btnExit();
                    }
                    this.closeWindows = true;
                    this.$emit("callBackSuccess", result.data);
                    if (this.nextPersons && this.nextPersons.length > 0) {
                        this.setLy();
                    }

                    this.$message.success('成功');

                })
                .catch(error => {
                    loadingInstance.close();
                    try {
                        this.$message.error(error.msg);
                    }catch(e)
                    {
                        this.$message.error('链接超时，请稍后再试！');

                    }
                })
                .finally(() => {
                    this.submiting = false;
                    // this.$emit('callBackSuccess')
                    console.log(loadingInstance, 'load')
                    loadingInstance.close();
                });
        },
        setLy() {
            let arr = [];
            this.nextPersons.forEach(c => {
                let obj = {
                    personId: c.code,
                    personName: c.name
                }
                arr.push(obj);
            })

            let params = {
                actInstId: this.flowContext.actInstId,
                personStr: JSON.stringify(arr),
            }
            this.$axios.post("/pms/BpmProTaskUser/addNextNodeApprovePerson", params)
                .then(resault => {

                }).catch(error => {

            }).finally(_ => {

            })
        },
        flowGetNexNode() {
            if (this.flowBizData) {
                let data = this.flowBizData();
                if (!data.oid) {
                    data.oid = this.bizdata.oid ? this.bizdata.oid : '';
                }
                this.bizdata = {...this.bizdata, ...data};
            }
            this.nextUserName = '';
            let loadingInstance = this.showLoading();
            this.$axios
                .post('/bpm/pro/getNextNode', {
                    actDefId: this.flowContext.actDefId,
                    nodeId: this.flowContext.nodeId,
                    processParams: JSON.stringify(
                        this.flowContext.processVar
                            ? this.flowContext.processVar
                            : this.bizdata
                    ),
                    proTaskUserId: this.flowInstData.currentTask
                        ? this.flowInstData.currentTask.oid
                        : ''
                })
                .then(result => {
                    let nextNodeIds = '',
                        nextNodeNames = '';
                    result.data.forEach(item => {
                        nextNodeIds += ',' + item.id;
                        nextNodeNames += ',' + item.name;
                        if (item.assigners && item.assigners.length > 0) {
                            let nextUserId = '',
                                nextUserName = '';
                            item.assigners.forEach(user => {
                                if (this.nextUserName) {
                                    this.nextUserName += ',' + user.name;
                                } else {
                                    this.nextUserName = user.name;
                                }
                                nextUserId += ',' + user.code;
                                nextUserName += ',' + user.name;
                            });
                            if (item.isCollect == 0) {
                                this.nextUserRead = true;
                            } else {
                                let obj = this.flowInstData.nodeUserSetList.find(
                                    ii => ii.nodeId == item.id
                                );
                                obj.assignerId = nextUserId.substr(1);
                                obj.assignerName = nextUserName.substr(1);
                            }
                            this.setReplacePersonUser(item.assigners);
                        } else {
                            let obj = this.flowInstData.nodeUserSetList.find(
                                it => it.nodeId == item.id
                            );
                            if (obj && obj.assignerName) {
                                if (this.nextUserName) {
                                    this.nextUserName += ',' + obj.assignerName;
                                } else {
                                    this.nextUserName = obj.assignerName;
                                }
                                //this.nextUserMode = obj.modifiable ? "input" : "readonly";
                            }
                            this.flowGetNextUser(obj);
                        }
                    });
                    this.flowContext.nextNodeId = nextNodeIds.substr(1);
                    this.flowContext.nextNodeName = nextNodeNames.substr(1);
                    loadingInstance.close();
                })
                .catch(error => {
                    console.error(error);
                    loadingInstance.close();
                    this.$message.error(error.msg);
                });
        },
        flowGetNextUser(next) {
            //debugger
            // let next = this.flowInstData.nodeUserSetList.find(item => item.nodeId == this.flowContext.nextNodeId);
            if (next && next.nodeAssigners && next.nodeAssigners.length > 0) {
                next.nodeAssigners.forEach(item => {
                    //debugger
                    let obj = Object.assign({}, item);
                    if (this.isHasVariable(obj)) {
                        // debugger
                        this.setVariable(obj);
                        if (this.isHasVariable(obj)) {
                            this.$message.error(
                                next.nodeName + ':获取审批人失败，业务中无相关参数-'
                            ); // + JSON.stringify(obj));
                            return;
                        }
                        obj.nodeId = next.nodeId;
                        delete obj.nodeMap;
                        delete obj.persons;
                        this.$axios
                            .post('/bpm/pro/getAssigners', obj)
                            .then(result => {
                                let persons = result.data.nodeAssignerPersons;
                                if (persons && persons.length > 0) {
                                    // let next = this.flowInstData.nodeUserSetList.find(item => item.nodeId == next.nodeId);
                                    let ids = '',
                                        names = '';
                                    persons.forEach(item => {
                                        ids += ',' + item.code;
                                        names += ',' + item.name;
                                    });
                                    ids = ids.substr(1);
                                    names = names.substr(1);
                                    next.assignerId = ids;
                                    next.assignerName = names;

                                    if (
                                        this.nextUserName &&
                                        this.flowContext.nextNodeId &&
                                        this.flowContext.nextNodeId.indexOf(',') != -1
                                    ) {
                                        this.nextUserName += ',' + names;
                                    } else {
                                        this.nextUserName = names;
                                    }
                                    this.setReplacePersonUser(persons);
                                    //this.collectorAssigners = true;
                                }
                            })
                            .catch(error => {
                                this.$message.error(error.msg);
                            });
                    }
                });
            } else {
                if (next) {
                    this.setNextNodeUser(next.nodeId);
                }
            }
        },
        loadButtonExt() {
            this.$axios
                .get('/bpm/nodeButtonExt/list', {
                    params: {
                        actDefId: this.flowContext.actDefId,
                        nodeId: this.flowContext.nodeId,
                        current: 1,
                        size: 100
                    }
                })
                .then(result => {
                    let extList = result.data;
                    if (!extList) {
                        return;
                    }
                    this.flowButtons.forEach(obj => {
                        extList.forEach(item => {
                            if (obj.key == item.buttonKey) {
                                if (item.value) {
                                    let list = [];
                                    let btnKeys = item.value.split(',');
                                    btnKeys.forEach(btn => {
                                        let text = this.flowInstData.flowNodes[btn]
                                            ? this.flowInstData.flowNodes[btn].nodeName
                                            : '';
                                        if (btn == 'toPreNode') {
                                            if (this.flowInstData.upProNode) {
                                                text = this.flowInstData.upProNode.nodeName;
                                                btn = this.flowInstData.upProNode.nodeId;
                                            }
                                        }
                                        if (!text) {
                                            text = this.appendText[btn];
                                        }
                                        let b = {text: text, key: btn, clickFun: obj.clickFun};
                                        list.push(b);
                                    });
                                    let res = new Map();
                                    this.$set(
                                        obj,
                                        'list',
                                        list.filter(a => !res.has(a.key) && res.set(a.key, 1))
                                    ); //去重
                                }
                            }
                        });
                    });
                });
        },
        loadAssigners() {
            this.$axios
                .get('/bpm/pro/loadAssigners', {
                    params: {
                        actDefId: this.flowContext.actDefId,
                        actInstId: this.flowContext.actInstId
                    }
                })
                .then(result => {
                    let assignerMap = result.data;
                    this.flowAssignerMap = assignerMap;
                    if (!assignerMap || !assignerMap['FirstNode']) {
                        return;
                    }
                    this.flowInstData.nodeUserSetList.forEach(item => {
                        let nodeAssigner = assignerMap[item.nodeId];
                        // debugger
                        if (nodeAssigner && nodeAssigner.nodeAssignerPersons && nodeAssigner.nodeAssignerPersons.length > 0) {
                            let ids = '', names = '';
                            nodeAssigner.nodeAssignerPersons.forEach(item => {
                                ids += ',' + item.code;
                                names += ',' + item.name;
                            });
                            ids = ids.substr(1);
                            names = names.substr(1);
                            item.assignerId = ids;
                            item.assignerName = names;
                        } else {
                            item.assignerId = '';
                            item.assignerName = '';
                        }
                        item.nodeAssigners = nodeAssigner.nodeAssigners;
                    });
                })
                .catch(data => {
                    this.$alert(data.msg, '警告-加载审批人异常', {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                            this.$router.back();
                        }
                    });
                });
        },
        isHasVariable(obj) {
            let has = false;
            for (let k in obj) {
                if (obj[k] && typeof obj[k] == 'string' && obj[k].indexOf('{') != -1) {
                    if (
                        obj[k] != '{applierPerson}' &&
                        obj[k] != '{currentPerson}' &&
                        obj[k] != '{applierLeader}' &&
                        obj[k] != '{currentLeader}' &&
                        obj[k] != '{applierOrganization}' &&
                        obj[k] != '{currentOrganization}'
                    ) {
                        has = true;
                        return has;
                    }
                }
            }
            return has;
        },
        setVariable(item) {
            for (let k in item) {
                if (
                    item[k] &&
                    typeof item[k] == 'string' &&
                    item[k].indexOf('{') != -1
                ) {
                    let key = item[k].substr(1, item[k].length - 2);
                    let value = this.bizdata[key];
                    if (value) {
                        item[k] = value;
                    }
                }
            }
        },
        setBizData(data) {
            this.bizdata = data;
        },
        getBizData() {
            return this.bizdata;
        },
        setNextNodeUser(nodeId) {
            //设置下一步处理人
            if (!nodeId) {
                nodeId = this.flowContext.nextNodeId;
            }
            let obj = this.flowInstData.nodeUserSetList.find(
                item => item.nodeId == nodeId
            );
            if (obj && obj.assignerId) {
                /*  let assignerId="",assignerName="";
                           obj.nodeAssignerPersons.forEach(it=>{
                               assignerId+=","+it.code;
                               assignerName+=","+it.name;
                           })
                          assignerId=assignerId.substr(1);
                          assignerName=assignerName.substr(1);*/
                this.nextUserName = obj.assignerName;
                this.nextUserId = obj.assignerId;
            }
        },
        getFormRole() {
            //获取规则
            var role = {};
            ////全局字段规则
            if (
                this.flowInstData.definition &&
                this.flowInstData.definition.bizFormRule
            ) {
                let data = JSON.parse(this.flowInstData.definition.bizFormRule);
                this.filterProperty(role, data);
            }
            //环节字段规则
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.formRole
            ) {
                let data = JSON.parse(this.flowInstData.currentNodeSet.formRole);
                this.filterProperty(role, data);
            }
            return role;
        },
        getFormProperty() {
            //获取属性
            var role = {};
            //环节字段规则
            if (
                this.flowInstData.currentNodeSet &&
                this.flowInstData.currentNodeSet.formTemplate
            ) {
                let data = JSON.parse(this.flowInstData.currentNodeSet.formTemplate);
                this.filterProperty(role, data);
            }
            return role;
        },
        filterProperty(role, data) {
            //过滤属性
            for (let i = 0; i < data.length; i++) {
                //debugger
                if (data[i].isAuth == undefined || data[i].isAuth == '0') {
                    //默认
                    role[data[i].code] = data[i];
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].isAuth == '1') {
                    //处理人
                    if (this.isAuthor) {
                        role[data[i].code] = data[i];
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                // debugger
                if (data[i].isAuth == '2') {
                    //管理员
                    if (this.isAdmin()) {
                        role[data[i].code] = data[i];
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].isAuth == '3') {
                    //其他人员
                    if (!this.isAdmin() && !this.isAuthor) {
                        role[data[i].code] = data[i];
                    }
                }
            }
        },
        $$loadData(id) {
            //初始化
            let actInstId, dataId, taskUserId, sign, routeUrl;
            // console.log(this.urlRender);
            if (this.urlRender) {
                let queryObj = {...this.$route.query}
                actInstId = this.$route.query['actInstId'];
                delete queryObj.actInstId;
                dataId = id ? id : this.$route.query['dataId'];
                delete queryObj.dataId;
                taskUserId = this.$route.query['taskUserId'];
                delete queryObj.taskUserId;
                sign = this.$route.query['sign'];
                delete queryObj.sign;
                routeUrl = this.$route.fullPath;
                delete queryObj[""];
                this.callActTransmitVarComm = {...queryObj, ...this.callActTransmitVar}
            }
            else {
                let url = this.renderComponentString
                let urlPar = url.split("?");
                const query = qs.parse(urlPar[1]);
                let md5String = `(${url})[${this.$userInfo.userCode}]<${query.dataId}>`;
                sign = new MD5().update(md5String).digest('HEX').toUpperCase()
                url += `&sign=${sign}`;
                let index = url.indexOf('?');
                let str = url.substr(index);
                var obj = qs.parse(str, {ignoreQueryPrefix: true});
                actInstId = obj['actInstId'];
                delete obj.actInstId;
                dataId = obj['dataId'];
                delete obj.dataId;
                taskUserId = obj['taskUserId'];
                delete obj.taskUserId;
                sign = obj['sign'];
                delete obj.sign;
                routeUrl = url;
                this.callActTransmitVarComm = {...obj, ...this.callActTransmitVar}

            }
            //console.log('====> this.callActTransmitVar = %o', this.callActTransmitVar)
            let loadingInstance = this.showLoading();
            this.$axios
                .get('/bpm/pro/init', {
                    params: {
                        sign: sign,
                        dataId: dataId,
                        actInstId: actInstId,
                        routeUrl: routeUrl,
                        callActTransmitVar: this.callActTransmitVarComm
                            ? JSON.stringify(this.callActTransmitVarComm)
                            : '',
                        taskUserId: taskUserId
                    }
                })
                .then(result => {
                    if (result.data.nodeUserSetList) {
                        result.data.nodeUserSetList.forEach(item => {
                            let roleFormula = JSON.parse(item.roleFormula);
                            if (result.data.proOperates) {
                                result.data.proOperates.forEach(is2 => {
                                    if (is2.operateKey == 'submit' && item.nodeId == is2.nodeId) {
                                        roleFormula.modifiable = false;
                                    }
                                });
                                if (
                                    result.data.currentNode &&
                                    item.nodeId == result.data.currentNode.nodeId
                                ) {
                                    roleFormula.modifiable = false;
                                }
                            }
                            item.roleFormula = roleFormula;
                        });
                    }
                    this.flowInstData = result.data;
                    this.flowContext.actDefName = this.flowInstData.definition.name;
                    this.flowContext.bizCallClass = this.flowInstData.definition.bizCallClass;
                    this.flowContext.actInstId = result.data.actInstId
                        ? result.data.actInstId
                        : '';
                    this.flowContext.actDefId = result.data.actDefId;
                    this.flowContext.isNewFlow = result.data.isNewFlow;
                    this.flowContext.isAuthor = result.data.isAuthor;
                    this.flowContext.isAdmin = result.data.isAdmin;
                    //TODO add by Rocky.R 为获取当前任务是否是加签
                    this.flowContext.inOperateType =
                        result.data.currentTask && result.data.currentTask.inOperateType
                            ? result.data.currentTask.inOperateType
                            : '';
                    this.flowContext.isFlowParticipant = result.data.isFlowParticipant;
                    this.flowContext.taskUserId = result.data.currentTask
                        ? result.data.currentTask.oid
                        : '';
                    if (result.data.currentNode) {
                        this.flowContext.nodeId = result.data.currentNode.nodeId;
                        this.flowContext.dataSecretLevcode = result.data.proRun
                            .dataSecretLevcode
                            ? result.data.proRun.dataSecretLevcode
                            : '1';
                    }
                    if (!result.data.currentNode && result.data.currentNodeSet) {
                        this.flowContext.nodeId = result.data.currentNodeSet.nodeId;
                    }
                    this.operateDataList = result.data.proOperates
                        ? result.data.proOperates.filter(
                            item => item.nodeId != 'StartEvent'
                        )
                        : [];
                    this.operateDataMsgList = result.data.proOperates
                        ? result.data.proOperates.filter(
                            item =>
                                item.nodeId != 'StartEvent' &&
                                item.operateKey != 'save' &&
                                item.opinion != null &&
                                item.opinion != ''
                        )
                        : [];
                    if (result.data.currentBizData) {
                        this.bizdata = JSON.parse(result.data.currentBizData.bizData);
                    }
                    this.showButton();
                    if (this.isFirstNode) {
                        this.collectorAssigners = true;
                    }
                    if (result.data.proRun) {
                        this.flowContext.actDefName = result.data.proRun.bpmDefName;
                        if (result.data.proRun.value2) {
                            this.callActTransmitVarComm = JSON.parse(result.data.proRun.value2);
                        }
                    }
                    this.movingGridDataUrl =
                        '/bpm/proNode/list?actInstId=' + this.flowContext.actInstId;
                    this.taskGridDataUrl =
                        '/bpm/proTaskUser/searchTasks?actInstId=' +
                        this.flowContext.actInstId;

                    this.loadButtonExt();
                    this.loadAssigners();

                    //广播流程上下文信息，向父组件发送信息
                    this.$parent.$emit('FlowContextBroadcastEvent', this);

                    if (this.flowReady) {
                        this.$nextTick(_ => {
                            let formRole = this.getFormRole();
                            let formProperty = this.getFormProperty();

                            this.flowReady(
                                this.flowContext,
                                this.bizdata,
                                {
                                    formRole: formRole,
                                    formProperty: formProperty
                                },
                                this.flowInstData.definition.bizDataRule
                            ); //业务事件

                            //TODO向下广播权限数据，支持isHidden、isDisabled
                            this.broadcast('ElFormItem', 'ice-flow-form-ready', formRole);
                            this.broadcast('IceFormGroup', 'ice-flow-form-ready', formRole);
                            this.flowReadyIsLoadOk = true;
                            this.$nextTick(_ => {
                                this.pageModified = false
                            })
                        });
                    }
                    this.showUserOptions();
                    this.flowNodesStatusInit();
                    //debugger
                    this.broadcast(
                        'IceMultipleUpload',
                        'ice-flow-secret-ready',
                        this.isSecret
                    ); //广播表单密级
                    this.broadcast(
                        'IceSingleUpload',
                        'ice-flow-secret-ready',
                        this.isSecret
                    ); //广播表单密级
                    loadingInstance.close();

                    this.$nextTick(_ => {
                        this.formGroupRepostoryList = [...this.formGroupRepostoryList];
                    });
                })
                .catch(data => {
                    console.error(data);
                    // debugger
                    let str = data.msg ? (data.msg == '没有打开流程的权限' ? '你不是此流程节点上相关人员，无此流程查看权限！' : data.msg) : '流程加载失败';
                    this.$alert(
                        str,
                        '警告',
                        {
                            confirmButtonText: '确定',
                            type: 'error',
                            callback: action => {
                                loadingInstance.close();
                                this.$router.back();
                            }
                        }
                    );

                    // this.$message.error(data.data.msg);
                });
        },
        showLoading() {
            //显示遮罩
            const contentDiv = document.getElementById('$base-content');
            let $el = null;
            if (contentDiv) {
                $el = contentDiv.parentElement;
            } else {
                $el = this.$el.parentElement;
            }
            return Loading.service({target: $el});
        },
        showUserOptions(callback) {
            //显示标记
            //let loadingInstance = this.showLoading();
            this.$axios
                .get('/bpm/UserOpinion/getByUser', {params: {operateType: ''}})
                .then(result => {
                    let data = result.data;
                    if (data && data.length > 0) {
                        this.showTag = data;
                    }
                    this.userOptions = data;
                    if (callback) callback(data);
                    //loadingInstance.close();
                });
        },
        saveUserOptions(obj, griddata) {
            //保存标记
            this.showTag = griddata;
            this.$axios
                .post('/bpm/UserOpinion/saveList', {userOpinions: griddata})
                .then(result => {
                });
        },
        showUserOptionsDialog() {
            //显示用户意见标记框
            this.showUserOptions(() => {
                this.$refs.flowOpinion.showDialog();
                this.$nextTick(() => {
                    this.$refs.flowOpinion.setGridData(this.userOptions);
                });
            });
        },
        //分组快捷跳转
        goGroup(panel) {
            let name = panel.label;
            const el = this.formGroupRepostory[name];
            const y =
                Number(el.offsetTop) -
                Number(this.$refs.fixed ? this.$refs.fixed.offsetHeight : 0) -
                100;
            this.userActived = true;

            const group = this.formGroupRepostoryList.find(
                item => item.name == panel.name
            );
            if (group && group.$vue) {
                group.$vue.setExpanded(true);
            }
            this.$nextTick(_ => {
                this.$refs.scroll.scrollTo({x: 0, y}, true);
                this.activedForm = this.formGroupList.indexOf(name);
            });
        },
        goItemEl(el) {
            this.$nextTick(_ => {
                this.$refs.scroll.scrollIntoView(el, true);
            });
        },
        //滚动条滚动监听
        handleScroll(v) {
            // console.log(v)
            for (let i = this.formGroupList.length - 1; i >= 0; i--) {
                const groupName = this.formGroupList[i];
                const el = this.formGroupRepostory[groupName];
                const y =
                    Number(el.offsetTop) -
                    Number(this.$refs.fixed ? this.$refs.fixed.offsetHeight : 0) -
                    100;
                if (y - 120 <= v.scrollTop) {
                    if (!this.userActived && this.activedForm != i) {
                        this.activedForm = i;
                    }
                    if (this.activeTimeOut) {
                        clearTimeout(this.activeTimeOut);
                    }
                    this.activeTimeOut = setTimeout(_ => {
                        this.userActived = false;
                    }, 500);
                    return;
                }
            }
        },

        setReplacePersonUser(nodeAssignerPersons) {
            //设置可替换人员
            //debugger
            if (nodeAssignerPersons && nodeAssignerPersons.length > 0) {
                let user = [];
                nodeAssignerPersons.forEach(item => {
                    // 判定是否存在相同编码的人员  集合中
                    let ur = user.find(c => {
                        return c.code == item.code;
                    })
                    if (ur) {
                        return;
                    }
                    let u = {
                        oid: item.oid,
                        name: item.name,
                        code: item.code,
                        phone: item.handphoneTel,
                        deptShortName: item.department ? item.department.deptShortName : '',
                        orgShortName: item.department ? item.department.orgShortName : '',
                        deptCode: item.deptCode
                    };
                    user.push(u);
                });
                this.replacePersonUser = user;
            }
        }
    },
    computed: {
        formReadonly() {
            //柯确认 只在当前作者并且为第一环节时可编辑
            if (
                this.flowInstData.isAuthor &&
                this.flowContext.nodeId == 'FirstNode'
            ) {
                return false;
            }
            return true;
        },
        isAuthor() {
            if (this.flowInstData.isAuthor) {
                return true;
            }
            return false;
        },
        isFirstNode() {
            if (
                this.flowContext.nodeId == 'FirstNode' &&
                this.flowInstData.isNewFlow
            ) {
                return true;
            }
            return false;
        },
        isEndNode() {
            if (this.flowContext.nodeId == 'EndEvent') {
                return true;
            }
            if (
                this.flowInstData.proRun &&
                this.flowInstData.proRun.currentNodeId == 'EndEvent'
            ) {
                return true;
            }
            return false;
        },
        nextIsEndNode() {
            if (this.flowContext.nextNodeId == 'EndEvent') {
                return true;
            }
            return false;
        },
        showNextUser() {
            if (!this.nextUserShow) {
                return false;
            }
            if (this.nextIsEndNode) {
                return false;
            }
            if (this.flowContext.operateType == 'backpool') {
                return false;
            }
            return true;
        },
        nextUserMode() {
            if (this.nextUserRead) {
                return 'readonly';
            }
            if (this.flowInstData && this.flowInstData.flowNodes) {
                let obj = this.flowInstData.flowNodes[this.flowContext.nextNodeId];
                if (obj && obj.replacePerson) {
                    //debugger
                    let nodeSet = this.flowAssignerMap[this.flowContext.nextNodeId];
                    if (this.replacePersonUser && this.replacePersonUser.length <= 0) {
                        this.setReplacePersonUser(nodeSet.nodeAssignerPersons);
                    }
                    return 'onlySelect';
                }
            }
            return 'readonly';
        },
        showSecret() {
            if (this.isSecret) {
                if (
                    this.flowInstData.isNewFlow ||
                    this.flowContext.nodeId == 'FirstNode'
                ) {
                    return true;
                }
            }
            return false;
        },
        //分组列表
        formGroupList() {
            return this.formGroupRepostoryList
                .filter(item => item.el.style.display != 'none')
                .map(item => item.name);
        },
        //附加密级列表
        secrets() {
            const userDataSecrets = this.getReversedDataMap()('USER_DATA_SECRET');
            if (!userDataSecrets) {
                return [];
            }
            const userEnabledSecret = userDataSecrets[this.$userInfo.securityLevel];
            if (!userEnabledSecret) {
                return [];
            }
            let userSecret = userEnabledSecret.split(',');

            const fileSecrets = this.getDataMap()('DATA_SECRET_LEVEL');
            if (!fileSecrets) {
                return [];
            }
            const list = [];
            for (let key in fileSecrets) {
                if (key >= this.minSecret) {
                    list.push({
                        name: fileSecrets[key],
                        value: key,
                        sequence: Number(key),
                        disable: userSecret.indexOf(key) == -1
                    });
                }
            }
            return list;
        },
        //最小密级
        minSecret() {
            let max = 1;
            for (let key in this.fileSecretInfo) {
                if (this.fileSecretInfo[key] > max) {
                    max = this.fileSecretInfo[key];
                }
            }
            return max;
        },
        applyShowRule() {
            if (this.applyType === 'true' || this.applyType === true) {
                return 'elRow';
            }

            if (typeof this.applyType === 'string') {
                return this.applyType;
            }
        }
    },
    watch: {
        $route(newVlaue, old) {
            if (newVlaue.path == old.path) {
                this.$$loadData();
            }
        },
        SJID() {
            this.$$loadData(this.SJID);
        }
    },
    mounted() {
        this.$$loadData();
        this.$nextTick(_ => {
            addResizeListener(this.$refs['window'], this.resizeEventListener);
        });
    },
    beforeDestroy() {
        removeResizeListener(this.$refs['window'], this.resizeEventListener);
    },
    created() {
        // 计算做偏移值
        this.$nextTick(_ => {
            // 计算菜单宽度
            let tid = setTimeout(() => {
                let slideWidth = document.querySelector('.sidebar').clientWidth;
                console.log(slideWidth, this.leftProp)
                this.formLeft = (slideWidth * 1 + this.leftProp * 1) + 'px';
                console.log(this.formLeft);
                clearTimeout(tid);
            }, 20)

        })
        //分组信息注册
        this.$on('ice-flow-group-regist', data => {
            const {name, el} = data;
            this.formGroupRepostory[name] = el;
            this.formGroupRepostoryList.push(data);
            this.$nextTick(_ => {
                this.formGroupRepostoryList.sort(
                    (t1, t2) => t1.el.offsetTop - t2.el.offsetTop
                );
            });
        });
        this.$on('ice-flow-group-destory', data => {
            // debugger
            const {name, el} = data;
            delete this.formGroupRepostory[name];
            const deleteIndex = this.formGroupRepostoryList.findIndex(
                item => item.name == name
            );
            this.formGroupRepostoryList.splice(deleteIndex, 1);
            // console.log( this.formGroupRepostoryList)
            this.$nextTick(_ => {
                this.formGroupRepostoryList.sort(
                    (t1, t2) => t1.el.offsetTop - t2.el.offsetTop
                );
            });
        });
        //通过导航条定位
        this.$on('validateGO', data => {
            this.goGroup({label: data});
        });

        //通过表单元素定位
        this.$on('validateGOItemEl', el => {
            this.goItemEl(el);
        });

        this.addUndoTypeCodes(['DATA_SECRET_LEVEL', 'USER_DATA_SECRET']);
        //接收单文件附件密级
        this.$on('ice-upload-secret', data => {
            //console.log(data)
            const fileSecretInfo = {...this.fileSecretInfo};

            if (data['delFiles']) {
                const files = data['delFiles'];
                files.forEach(file => {
                    delete fileSecretInfo[file.fileid];
                });
            }
            if (data['addFiles']) {
                const files = data['addFiles'];
                files.forEach(file => {
                    fileSecretInfo[file.fileid] = file.secret;
                });
            }
            if (data['modifyFiles']) {
                const files = data['modifyFiles'];
                files.forEach(file => {
                    fileSecretInfo[file.fileid] = file.secret;
                });
            }

            this.fileSecretInfo = fileSecretInfo;
        });

        this.$on('printFormItemRegist', ({key, ref}) => {
            try {
                this.printItems[key] = ref;
            } catch (e) {
                // debugger;
            }
        });

        this.$on('page-item-modified', _ => {
            this.pageModified = true
        });

    }
};

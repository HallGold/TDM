import {notHanzi} from "@/pages/system/comm/Validator";
import {Loading} from 'element-ui';

export default {
    data() {
        return {
            scriptDefalutObj:{type:"formRole"},
            templateQuery: [
                /*  {type: 'input', label: '类型', code: 'msgType'},*/
                {type: 'input', label: '标题', code: 'msgTitle'}

            ],
            templateColumns: [
                {code: 'oid', hidden: true},
                {label: '类型', code: 'msgType', width: 120, mapTypeCode: 'msgType'},
                {label: '标题', code: 'msgTitle', width: 140,},
                {label: '模板内容', code: 'msgContext', width: 240}
            ],
            assignerQuery: [
                {label: '名称', type: 'input', code: 'assignerName', value: '', width: 200}
            ],
            columnsAssigner: [
                {code: 'oid', hidden: true},
                {label: '类型', code: 'assignerType', width: 100, mapTypeCode: "assignerRoleType", sortable: true},
                {label: '名称', code: 'assignerName', width: 200, sortable: true},
                {label: '规则公式', code: 'roleFormula', hidden: true, width: 100, sortable: true},
                {label: '描述', code: 'description', width: 400, align: "left", sortable: true}
            ],
            bizDataRuleGrid:[],
            selectAssignerFromVisible: false,
            refBizDataUrl: "",
            refBizEditVisible: false,
            refBizForm: {pageName:"",roleType:"",roleText:"",callClass:""},
            refBizFormRules: {
                pageName: [{required: true, message: '请输入页面名字', trigger: 'change',length:80,transform:function (val) {
                        if(val){
                            return val.trim();
                        }
                        return val;
                    }
                }],
                roleType: [{required: true, message: '请输入合法关联url', trigger: 'change',transform:function (val) {
                        if(val){
                            return val.trim();
                        }
                        return val;
                    },validator:notHanzi
                }],
                roleText: [{required: true, message: '请输入规则值', trigger: 'change',transform:function (val) {
                        if(val){
                            return val.trim();
                        }
                        return val;
                    }
                }],
                callClass: [{required: true, message: '请输入回调class', trigger: 'change',transform:function (val) {
                        if(val){
                            return val.trim();
                        }
                        return val;
                    },validator:notHanzi
                }]
            },
            refBizColumns: [
                {label: '页面名字', code: 'pageName', width: 140},
                {label: '关联url', code: 'roleType', width: 240},
                {label: '规则值', code: 'roleText', width: 120},
                {label: '回调class', code: 'callClass', width: 100}
            ],
            refBizOperations: [
                {
                    name: '编辑', callback: (row) => {
                        this.refBizEditVisible = true;
                        this.refBizForm = row;
                    }
                },
                {name: '删除', callback: this.refBizDel}

            ],
            refBizButtons: [{
                name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                    let hasFlowUser=true,hasSignConfig=true;
                    if(this.gridNodeUserList){
                        for(let i=0;i<this.gridNodeUserList.length;i++){
                            if(!this.gridNodeUserList[i].roleFormula){
                                hasFlowUser=false;
                            }
                        }
                    }
                    if(!hasFlowUser){
                        this.$message.error("请先配置流程环节人员再关联业务");
                        return;
                    }
                    if(this.tableSignTypeData){
                        for(let i=0;i<this.tableSignTypeData.length;i++){
                            let isNotNull=this.tableSignTypeData[i].decisionType&&this.tableSignTypeData[i].voteType
                                &&this.tableSignTypeData[i].amount;
                            if(!isNotNull){
                                hasSignConfig=false;
                            }
                        }
                    }
                    if(!hasSignConfig){
                        this.$message.error("请先配置会签规则再关联业务");
                        return;
                    }

                    this.refBizEditVisible = true;
                    this.refBizForm = {roleText:"0",pageName:"",pageType:"",roleType:""};
                    this.refBizForm.actDefId = this.definition.actDefId;
                    this.$nextTick(()=>{
                        this.$refs.refBizForm.clearValidate();
                    })
                }
            }],
            isShowNodeAclForm: false,
            delAcl: false,
            message: 'first',
            showHeader: true,
            editVisible: false,
            delVisible: false,
            configureCopyVisible: false,
            configureCopyForm: {actDefId: "", copyVersionNo: "", copyItems: []},
            multipleSelection: [],
            formInline: {
                user: '',
                region: ''
            },
            form: {
                name: '',
                date: '',
                address: ''
            },
            gateWayForm: {},
            nodeAclForm: {},
            buttonKey: [],
            titleMap: {
                add: '新建',
                edit: '修改'
            },
            dialogTittle: '',
            aclMap: {
                add: 'ACL按钮',
                edit: '编辑ACL按钮'
            },
            aclTittle: '',
            idx: -1,
            tableData: [],
            options: [
                {
                    value: 'true',
                    lable: '是'
                },
                {
                    value: 'false',
                    lable: '否'
                }
            ],
            value: '',
            definition: {
                    actDefKey: 'a',
                    bpmDefName: 'hah',
                    typeDesc: '1',
                    bpmDescribe: '1',
                    status: '1',
                    createDate: '1',
                    updateDate: '1',
                    createUser: '1',
                    oid: "",
                    dept: '1',
                    post: '1',
                    prossversion: '1',
                    permissionsCheck: 'true',
                    taskNameRule: '呵呵',
                    bizInfoRule: '1'
                },
            aclEdit: [],
            gridDataList: [],
            nodeSetList: [],
            gridNodeUserList: [],
            nodeaAsignerRole: "",
            selectAssignerFromId: "",
            selectAssignerColumns: [{label: '姓名', code: 'name', width: 120},
                {label: '部门', code: 'dept', width: 120,},
                {label: '岗位', code: 'city', width: 120,}],
            selectAssignerListData: [],
            tableHistoryData: [],
            tableGatewayData: [],
            tableSignTypeData: [],
            gatewayOptions: [],
            nodeAclBtnData: [],
            flowNodeButtonExtList: [],
            appendList: [{"value": "before", "text": "加签到我之前"}, {"value": "after", "text": "加签到我之后并提交"}],
            checked: [],
            nodeMsgData: [],
            msgCheckList: [],
            sysAclList: [],
            aclButtonList: [],
            space: [
                {user: '1333', name: 'ddd2', tt: 'dddd3'}
            ],
            expands: [],
            getRowKeys(row) {
                return row.oid;
            },
            defButton: {
                AF_APPLY: ["save", "submit"],
                AF_ASSIGNER: ["save", "submit", "reject"],
                AF_ADMIN: ["save", "submit", "reject"],
                SYS_ADMIN: ["save", "submit", "reject"]
            },
            defButtonTxt: {
                AF_APPLY: "保存,提交", AF_ASSIGNER: "保存,提交,驳回", AF_ADMIN: "保存,提交,驳回", SYS_ADMIN: "保存,提交,驳回"
            }
        }
    },
    methods: {
        pageFromRole(row,gridData){
            //debugger
            this.definition.bizFormRule=JSON.stringify(gridData);
            let saveData={
                oid:this.definition.oid,
                bizFormRule:this.definition.bizFormRule
            };
            this.updateDefinition(saveData);
        },
        updateDefinition(updateObj){
            this.$axios.post('/bpm/definition/update', updateObj).then(result => {
                this.$message.success("保存成功")
            }).catch(error => {
                this.$message.error("出错啦");
            })
        },
        selectedRefBizPage(rows) {
            this.refBizForm.pageName = rows[0].pageName;
            //this.refBizForm.pageId = rows[0].oid;
            this.refBizForm.roleType = rows[0].pageUrl;
        },
        /**
         * 选择页面
         */
        chooseRefBizPage() {
            this.$refs.pageEdit.openDialog();
            this.$nextTick(()=>{
                this.$refs.pageEdit.setPageType("20");
            });
        },
        formTemplateClick(row){
            this.$refs.formTemplate.showDialog(row);
            if(row.formTemplate){
                this.$nextTick(() => {
                    this.$refs.formTemplate.setGridData(row.formTemplate);
                })
            }
        },
        formTemplateBack(row,script){
            row.formTemplate=JSON.stringify(script);
            this.saveOneNodeSet({
                oid:row.oid,formTemplate:row.formTemplate
            });
        },
        formRoleClick(row){
            this.$refs.formRole.showDialog(row);
            if(row.formRole||this.definition.bizFormRule){
                this.$nextTick(() => {
                    this.$refs.formRole.setGridData(row.formRole,this.definition.bizFormRule);
                })
            }
        },
        formRoleBack(row,script){
            row.formRole=JSON.stringify(script);
            this.saveOneNodeSet({
                oid:row.oid,formRole:row.formRole
            });
        },
        scriptBefore(row){
            this.$refs.jsBefore.showDialog(row);
            if(row.classPreScript){
                this.$nextTick(() => {
                    this.$refs.jsBefore.setScriptValue(row.classPreScript);
                })
            }
            else{
                this.$nextTick(() => {
                    this.$refs.jsBefore.setScriptValue('');
                })
            }
        },
        scriptBeforeBack(row,script){
            row.classPreScript=script;
            this.saveOneNodeSet({
                oid:row.oid,classPreScript:row.classPreScript
            });
        },
        scriptAfter(row){
            this.$refs.jsAfter.showDialog(row);
            if(row.classAftScript){
                this.$nextTick(() => {
                    this.$refs.jsAfter.setScriptValue(row.classAftScript);
                })
            }
            else{
                this.$nextTick(() => {
                    this.$refs.jsAfter.setScriptValue('');
                })
            }
        },
        scriptAfterBack(row,script){
            row.classAftScript=script;
            this.saveOneNodeSet({
                oid:row.oid,classAftScript:row.classAftScript
            });
        },
        aclChange(value) {
            let texts = this.sysAclList.find(bt => bt.aclKey == value).aclName
            this.nodeAclForm.aclKey = texts;
            if (this.nodeAclForm.nodeId == "FirstNode" || this.nodeAclForm.nodeId == "StartEvent") {
                value = "AF_APPLY";
            }
            if (this.defButton[value]) {
                this.nodeAclForm.buttonKey = this.defButton[value];
            }
            if (this.defButtonTxt[value]) {
                this.nodeAclForm.buttonName = this.defButtonTxt[value];
            }
        },
        aclBtnChange(value) {
            let texts = value.map(item => {
                return this.aclButtonList.find(bt => bt.key == item).text
            });
            let t = texts.join(",");
            this.nodeAclForm.buttonName = t;
            //   alert(JSON.stringify(texts))
        },
        saveDef() {
            let saveObj={...this.definition};
            delete saveObj.bpmDefJson;
            delete saveObj.createDate;
            delete saveObj.bizFormRule;
            delete saveObj.bpmDefXml;
            saveObj.lockedStatus=saveObj.lockedStatus?1:0;
            if(this.bizDataRuleGrid.length>0){
                saveObj.bizDataRule=JSON.stringify(this.bizDataRuleGrid);
            }
            this.updateDefinition(saveObj);
        },
        returnUper(){
            this.$router.go(-1);
        },
        saveNodeSet() {
            let list = this.nodeSetList;
            for (let i = 0; i < list.length; i++) {
                list[i].createDate = new Date();
                list[i].updateDate = new Date();
                delete list[i].createDate;
                delete list[i].updateDate;
                delete list[i].flowSubProcess;
            }
            //  this.$axios.headers( {'Content-Type': 'application/json'});
            this.$axios.post('/bpm/nodeSet/saveList', {nodeSetList: list},
            ).then(result => {
                this.$message.success("保存成功")
            }).catch(error => {
                this.$message.error("出错啦")
            })
        },
        saveOneNodeSet(obj) {
            this.$axios.post('/bpm/nodeSet/saveOrUpdate', obj,
            ).then(result => {
                this.$message.success("保存成功")
            }).catch(error => {
                this.$message.error("出错啦")
            })
        },
        refBizSaveOrUpdate() {
            this.$refs['refBizForm'].validate((valid) => {
                if (valid) {
                    this.$axios.post('/bpm/refBiz/saveOrUpdate', this.refBizForm).then(result => {
                        this.$message.success("保存成功");
                        this.$refs.refBizGrid.refresh();
                        this.refBizEditVisible = false;
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                } else {
                    return false;
                }
            });

        },
        refBizDel(row) {
            this.$confirm('确定删除操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$axios.delete('/bpm/refBiz/del', {params: {id: row.oid}}).then(result => {
                    this.$message.success("删除成功");
                    this.$refs.refBizGrid.refresh();
                }).catch(error => {
                    this.$message.error("出错啦")
                })
            });
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, true);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        autoExceptionChange(val){
            this.nodeSetList = Object.assign([],this.nodeSetList)
        },
        //保存流程会签
        saveSign() {
            let obj = {};
            obj.nodeSignData = JSON.stringify(this.tableSignTypeData);
            this.$axios.put('/bpm/nodeSignType/updates', obj).then(result => {
                this.$message.success(`保存成功`);
            }).catch(error => {
                this.$message.error("出错啦")
            });
        },
        onSaveCopy() {
            this.configureCopyVisible = false;
            this.configureCopyForm.actDefId = this.definition.actDefId;
            this.$axios.post('/bpm/definition/copyTo', this.configureCopyForm).then(result => {
                this.$message.success(`保存成功`);
                let obj = {};
                this.configureCopyForm = obj;
            }).catch(error => {
                this.$message.error("出错啦")
            });
            console.log('submit!');
        },
        addNodeAclBtn(index, row) {
            this.isShowNodeAclForm = true;
            let obj = {};
            obj.oid = "";
            obj.nodeId = row.nodeId;
            obj.nodeName = row.nodeName;
            obj.nodeSetId = row.oid;
            obj.actDefId = row.actDefId;

            obj.aclKey = "";
            obj.buttonName = "";
            obj.buttonKey = [];
            obj.aclId = "";
            this.nodeAclForm = obj;
        },
        editNodeAclBtn(index, row) {
            this.isShowNodeAclForm = true;
            if (row.buttonKey) {
                row.buttonKey = row.buttonKey.split(",");
            }
            this.nodeAclForm = row;
        },
        deleteNodeAclBtn(index, row) {
            this.$confirm('确定删除操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$axios.delete('/bpm/nodeAclButton/delete', {params: {oid: row.oid}}).then(result => {
                    this.$message.success("删除成功");
                    this.loadNodeAclBtnData();
                }).catch(error => {
                    this.$message.error("出错啦")
                });
            })
        },
        cancelNodeAclForm() {
            this.isShowNodeAclForm = false;
            this.loadNodeAclBtnData();
        },
        saveOrUpdateNodeAclBtn() {
            this.isShowNodeAclForm = false;
            this.$axios.post('/bpm/nodeAclButton/saveOrUpdate', this.nodeAclForm).then(result => {
                this.$message.success("保存成功");
                this.loadNodeAclBtnData();
            }).catch(error => {
                this.$message.error("出错啦");
            });

        },
        tableRowClassName({row, rowIndex}) {
            if (row.isAdd) {
                return 'warning-row';
            } else {
                return 'success-row';
            }
        },
        //环节消息checkbox变化事件
        msgCheckClick(e, ref) {
            ref.msgTypes = e;
        },
        //加载环节
        loadNodeSetData(actDefId) {
            this.$axios.get("/bpm/nodeSet/list", {params: {actDefId: actDefId}}).then(result => {
                this.nodeSetList = result.data;

                this.loadGateways(actDefId);
                this.loadSignTypes(actDefId);
                this.loadNodeUsers(actDefId);
                this.loadNodeMsg(actDefId);
                this.loadHistory();
                this.loadNodeAclBtnData();
                this.loadButtonExt(actDefId);
                this.loadSysAclData();
                this.loadButtonData();
                let flowNodes = [];
                flowNodes.push({"nodeId": "toPreNode", "nodeName": "上一环节"})
                this.flowNodeButtonExtList = flowNodes.concat(result.data).filter(item => item.nodeId != "StartEvent")
                this.loadButtonExt(actDefId);
            });
        },
        //加载分支
        loadGateways(actDefId) {
            this.$axios.get("/bpm/defGatewayParam/list", {params: {actDefId: actDefId}}).then(result => {
                this.tableGatewayData = result.data;
            });
        },
        //加载流程会签
        loadSignTypes(actDefId) {
            this.$axios.get("/bpm/nodeSignType/listByActDefId", {params: {actDefId: actDefId}}).then(result => {
                this.tableSignTypeData = result.data;
            });
        },
        //加载环节acl按钮
        loadNodeAclBtnData() {
            this.$axios.get("/bpm/nodeAclButton/listByActDefId", {params: {actDefId: this.definition.actDefId}}).then(result => {
                let nodeAclBtnList = [];
                let dbDataList = result.data;
                this.nodeSetList.forEach(obj => {
                    obj.isAdd = true;
                    obj.nodeText = obj.nodeId + "(" + obj.nodeName + ")";
                    nodeAclBtnList.push(obj);
                    dbDataList.forEach(db => {
                        if (obj.nodeId == db.nodeId) {
                            db.isAdd = false;
                            nodeAclBtnList.push(db);
                        }
                    })
                })
                this.nodeAclBtnData = nodeAclBtnList;
            });
        },
        //加载ACL定义
        loadSysAclData() {
            this.$axios.get("/bpm/sysAcl/sysAclList").then(result => {
                this.sysAclList = result.data;
            });
        },
        //加载按钮数据字典
        loadButtonData() {
            this.$axios.get("/bpm/nodeAclButton/btnList").then(result => {
                this.aclButtonList = result.data;
            });
        },

        selectTemplateConfirm(rows) {
            // alert(JSON.stringify(rows));
            let newRows = this.nodeMsgData;
            newRows.forEach(row => {
                let a = row.nodeMsgSetting;
                a[0].msgTitle = rows[0].msgTitle;
                a[0].msgContent = rows[0].msgContext;
                row.nodeMsgSetting = a;
            })
            // this.$set(this.nodeMsgData,newRows)
            this.nodeMsgData = newRows;
        },
        //环节消息设置行状态（保存前）
        nodeMsgRowStatus() {
            this.nodeMsgData.forEach(row => {
                let setting = row.nodeMsgSetting[0];
                let msgType = setting.msgTypes;
                if (msgType.length > 0) {
                    if (setting.oid) {
                        row._state = "_modify";
                    } else if (!setting.oid) {
                        row._state = "_add";
                    }
                } else if (!!setting.oid) {
                    row._state = "_del";
                }
            });
        },
        //加载环节消息
        loadNodeMsg(actDefId) {
            this.$axios.get("/bpm/nodeTaskMsg/listByActDefId", {params: {actDefId: actDefId}}).then(result => {
                this.nodeMsgData = result.data;
                if(this.nodeMsgData){
                    this.nodeMsgData.forEach((item, key)=>{
                        let nodeId = this.nodeMsgData[key].nodeId;
                        let msgTypeList = item.nodeMsgSetting[0].msgTypes;
                        let msgContext=item.nodeMsgSetting[0].msgContent;
                        let msgTitle=item.nodeMsgSetting[0].msgTitle;
                        item.nodeMsgSetting[0].msgContent =msgContext?msgContext:"{taskName}{createDate}";
                        item.nodeMsgSetting[0].msgTitle = msgTitle?msgTitle:"新任务消息提醒";
                        this.$set(this.checked, nodeId, msgTypeList);
                    })
                }
            });
        },
        //保存环节消息th
        saveNodeMsg() {
            let isSave=true;
            if(this.nodeMsgData){
                for(let i=0;i<this.nodeMsgData.length;i++){
                    let obj=this.nodeMsgData[i].nodeMsgSetting[0];
                    if(obj.msgTitle&&obj.msgTitle.length>30){
                        this.$message.error(this.nodeMsgData[i].nodeInfo+"-标题文字长度不能超过30个字符")
                        isSave=false;return;
                    }
                    if(obj.msgContent&&obj.msgContent.length>200){
                        this.$message.error(this.nodeMsgData[i].nodeInfo+"-内容文字长度不能超过200个字符")
                        isSave=false;
                        return;
                    }
                }
            }
            if(!isSave){
                return;
            }
            this.nodeMsgRowStatus();
            let obj = {};
            obj.nodeMsgData = JSON.stringify(this.nodeMsgData);
            this.$axios.patch('/bpm/nodeTaskMsg/save', obj).then(result => {
                this.$message.success("保存成功");
                this.loadNodeMsg(this.definition.actDefId);
            }).catch(error => {
                this.$message.error("出错啦")
            })
        },
        selectTemplate() {
            this.$refs.selectTemplate.openDialog();
        },

        //加载历史
        loadHistory() {
            this.$axios.get("/bpm/definition/historyList", {
                params: {
                    actDefKey: this.definition.actDefKey/*,
                    versionNo: this.definition.versionNo*/
                }
            }).then(result => {
                this.tableHistoryData = result.data;
            });

        },
        //查看历史
        showHistory(item) {
            this.$router.push("/bpm/processConfiguration?id=" + item.oid)
        }
        ,//保存按钮扩展配置
        saveButtonExt(index, row) {
            let obj = Object.assign({}, row);
            if (row.reject) {
                obj.reject = row.reject.join(",");
            }
            if (row.append) {
                obj.append = row.append.join(",");
            }
            if (row.jump) {
                obj.jump = row.jump.join(",");
            }
            this.$axios.post('/bpm/nodeButtonExt/saveVo', obj).then(result => {
                this.$message.success("保存成功")
            }).catch(error => {
                this.$message.error("出错啦")
            })
        },//加载按钮扩展配置
        loadButtonExt(actDefId) {
            this.$axios.get("/bpm/nodeButtonExt/list", {
                params: {
                    actDefId: actDefId,
                    current: 1,
                    size: 100
                }
            }).then(result => {
                let extList = result.data;
                if (!extList) {
                    return;
                }
                this.nodeSetList.forEach(obj => {
                    extList.forEach(item => {
                        if (obj.nodeId == item.nodeId) {
                            if (item.value) {
                                if (item.buttonKey == "autoException") {
                                    obj[item.buttonKey] = item.value;
                                } else {
                                    obj[item.buttonKey] = item.value.split(",");
                                }
                            }
                        }
                    })
                })
            });
        },
        selectAssignerList(idx, row) {
            // this.$refs.selectUser.openDialog();
            this.selectAssignerFromVisible = true;
            this.selectAssignerFromId = row.oid;
        },
        saveNodeUserSet(idx, row) {
            this.$axios.post("/bpm/nodeUserSet/saveOrUpdate", row).then(result => {
                this.$message.success("保存成功");
            }).catch(error => {
                this.$message.error("出错啦");
            });
        },
        saveAllNodeUserSet() {
            this.$axios.post("/bpm/nodeUserSet/saveList", {nodeUserSetList: this.gridNodeUserList}).then(result => {
                this.$message.success("保存成功");
            }).catch(error => {
                this.$message.error("出错啦");
            });
        },
        handleClick(){
            if(this.message === 'fifth'){
                this.$nextTick(()=>{
                    this.$refs.table.doLayout();
                });
            }
        },
        setRoleFormula(data) {
            let obj = this.gridNodeUserList.find(item => item.oid == this.selectAssignerFromId);
            obj.roleFormula = JSON.stringify(data);

            //直接保存
            this.saveNodeUserSet(1, obj);
        },
        editNodeUserSet(idx, row) {
            this.selectAssignerFromId = row.oid;
            this.nodeaAsignerRole = row.roleFormula;

            //this.$set(this.mainDataForm,"roleFormula",JSON.stringify(data));
            this.$refs.assignerEditor.dialogVisiblem = true;
            this.$nextTick(() => {
                this.$refs.assignerEditor.init();
            })

        },
        selectAssignerListConfirm(rows, texts, values) {
            let obj = this.gridNodeUserList.find(item => item.oid == this.selectAssignerFromId);
            let ass = this.$refs.assignerRoleList.getSelections();
            obj.assignerType = ass[0].assignerType;
            obj.roleFormula = ass[0].roleFormula;
            obj.assignerName = ass[0].assignerName;
            obj.assignerId = ass[0].oid;
            this.selectAssignerFromVisible = false;
            //直接保存
            this.saveNodeUserSet(1, obj);
        },
        cancelSelectUser() {
            this.selectAssignerFromVisible = false;
            //this.$refs.selectUser.cleanColumnSelect();
        },
        //加载环节人员
        loadNodeUsers(actDefId) {
            this.$axios.get("/bpm/nodeUserSet/list", {
                params: {
                    actDefId: actDefId,
                    current: 1,
                    size: 100
                }
            }).then(result => {
                this.gridNodeUserList = result.data;
                if (!result.data || result.data.length <= 0) {
                    this.gridNodeUserList = this.nodeSetList.filter(item => item.nodeId != "StartEvent" && item.nodeId != "EndEvent")
                }
            });
        },
        $loadData(){
            // 在这里你想初始化的时候展开哪一行都可以了
            let id = this.$route.query['id'];
            if (id) {
                let loadingInstance = Loading.service({target: this.$el});
                this.id = id;
                this.$axios.get("/bpm/definition/get", {params: {id: this.id}})
                    .then(result => {
                        let data = result.data;
                        if (data.status == 1) {
                            data.statusDes = "发布";
                        } else {
                            data.statusDes = "未发布";
                        }
                        this.definition = data;
                        this.definition.lockedStatus=data.lockedStatus?true:false;
                        this.loadNodeSetData(data.actDefId);
                        this.$refs.pageFormRole.setGridData(data.bizFormRule);
                        this.refBizDataUrl = "/bpm/refBiz/list?current=1&size=100&actDefId=" + data.actDefId;
                        if(this.definition.bizDataRule&&this.definition.bizDataRule.length>0){
                            this.bizDataRuleGrid=JSON.parse(this.definition.bizDataRule);
                        }
                        loadingInstance.close();
                    })
            }
        }
    },
}

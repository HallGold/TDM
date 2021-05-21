<template>
    <div class="content-filled">
        <dev-grid v-if="showTreeTable" :chooseItem="chooseItem" :buttons="buttons" :operations="operations"
                  :columns="columns" :querys="query" :export-info="exportInfo"
                  @nodeClick="categoryTreeSelectedHandler" :ref="PAGE_ENUM.REFS.MANAGE.REF"
                  @selectionChange="handleSelectionChange" @rowDbClick="rowDbClick">
            <div class="ice-full-relative" style="height:170px" slot="bottom">
                <div class="ice-full-absolute">
                    <detail-manage v-if="selectDevData.oid" :category-type.sync="selectDevData.category"
                                   :dev-id="selectDevData.oid"></detail-manage>
                </div>

            </div>
        </dev-grid>
        <dev-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.DEV_EDIT.REF" :category-type="mainData.category"
                  :dev-id="selectDevId" :title="editTitle" :child-type="mainData.childType"
                  v-if="PAGE_ENUM.REFS.DEV_EDIT.SHOW" :on-close-handler="closeEditHandler"></dev-edit>
        <category-select :ref="PAGE_ENUM.REFS.CATEGORY_SELECT.REF" :close-handler="categorySelectClosed"
                         v-if="PAGE_ENUM.REFS.CATEGORY_SELECT.SHOW"></category-select>
        <dev-uploader :category-type="mainData.category" :on-close-handler="closeUploaderHandler"
                      :ref="PAGE_ENUM.REFS.UPLOADER.REF" v-if="PAGE_ENUM.REFS.UPLOADER.SHOW"></dev-uploader>
    </div>
</template>

<script>
    import CategorySelect from "@/pages/biz/dev/comm/categorySelect";
    import devEdit from "@/pages/biz/dev/devEdit"
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import DetailManage from "./detailManage";
    import DevUploader from "./devUploader";
    import DevGrid from "./devGrid";

    export default {
        name: "devManage",
        mixins: [bizComm, devComm, renderer],
        components: {DevGrid, DevUploader, DetailManage, CategorySelect, devEdit},
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        DEV_EDIT: {REF: "devEdit", SHOW: false},
                        CATEGORY_SELECT: {REF: "selectCategory", SHOW: false},
                        UPLOADER: {REF: "upload", SHOW: false},
                        MANAGE: {REF: "manage"}
                    }
                },
                buttons: [],
                operations: [],
                query: [],
                columns: [],
                isEdit: true,
                mainData: {},
                //当前选中的设备类别
                currentSelectCategory: 0,
                //当前选中行的设备数据
                selectDevData: {},
                selectDevId: "",
                //按钮类型
                btnType: "",
                chooseItem: "single",
                showTreeTable: false,
                categoryTreeData: null,//设备类型树
                exportInfo: {
                    exportTitle: "设备信息",
                    exportUrl: "",
                    exportAllColumns: "",
                    exportColumns: {
                        16: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                        17: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "useFor", "devPv", "mac", "factoryName"],
                        15: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "qualityDate", "useFor", "license", "softWareNo", "trayNo", "capacity", "softwareAccount", "devPv", "mac", "dependSn", "factoryName"],
                        14: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "masterIp", "qualityDate", "useFor", "softVersion", "checkCertsignName", "checkCertsignCode", "checkCertsignDate", "checkDeptName", "devPv", "mac", "dependSn", "factoryName"],
                        13: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                        12: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                        11: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                            "price", "buyDate", "masterIp", "qualityDate", "useFor", "shape", "osVersion", "setupDate", "terminal", "devPv", "mac", "dependSn", "factoryName"],
                        10: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                            "remark", "dutyCode", "dutyName", "deptName",
                            "origin", "functionaldesc", "deployMode", "checkDeptName", "passOfflineValid", "onlinevalid", "onlineValidDate",
                            "systemAdmin", "systemAdminCode", "authAdmin", "authAdminCode", "auditAdmin", "auditAdminCode", "devPv", "dependSn", "factoryName"]
                    },
                    exportSelectCategory: 0
                },
                editTitle: ""
            }
        },
        methods: {
            /**
             * 打开设备编辑页面
             */
            openDevEdit(isEdit, title) {
                this.editTitle = title;
                this.isEdit = isEdit;
                if (this.mainData.category == this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE) {
                    this.mainData.category = this.selectDevData.category;
                    this.mainData.childType = this.selectDevData.childType;
                }
                this.PAGE_ENUM.REFS.DEV_EDIT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_EDIT.REF].openDialog();
                });
            },
            /**
             * 打开设备选择页面
             */
            openCategorySelect() {
                this.PAGE_ENUM.REFS.CATEGORY_SELECT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.CATEGORY_SELECT.REF].openDialog();
                });
            },
            /**
             * 设备类型选择页面关闭事件
             */
            categorySelectClosed(categoryCode) {
                this.mainData.category = categoryCode;
                this.mainData.childType = this.getChildType(categoryCode);
                this.PAGE_ENUM.REFS.CATEGORY_SELECT.SHOW = false;
                if (this.btnType == this.ENUMS.BTN_TYPE.ADD) {
                    this.openDevEdit(true, "设备编辑");
                } else if (this.btnType == this.ENUMS.BTN_TYPE.UPLOAD) {
                    this.openUploader();
                }
            },
            /**
             * 新增按钮响应事件
             */
            add() {
                this.btnType = this.ENUMS.BTN_TYPE.ADD;
                this.selectDevId = "";
                if (this.currentSelectCategory == this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE) {
                    this.openCategorySelect();
                    return;
                }
                this.openDevEdit(true, "设备编辑");
            },
            /**
             * 编辑按钮响应事件
             */
            edit() {
                if (!this.selectDevData.oid) {
                    this.$alert("请选择需要编辑的设备", "提示");
                    return;
                }
                if (this.selectDevData.state != this.ENUMS.STATE_DATA.NO_USE.CODE) {
                    this.$alert("请选择状态为[" + this.ENUMS.STATE_DATA.NO_USE.NAME + "]的设备", "提示");
                    return;
                }
                this.selectDevId = this.selectDevData.oid;
                this.openDevEdit(true, "设备编辑");
            },
            /**
             * 删除按钮响应事件
             */
            delete() {
                let _this = this;
                if (!this.selectDevData.oid) {
                    this.$alert("请选择需要删除的设备", "提示");
                    return;
                }
                if (this.selectDevData.state != this.ENUMS.STATE_DATA.NO_USE.CODE) {
                    this.$alert("请选择状态为[" + this.ENUMS.STATE_DATA.NO_USE.NAME + "]的设备进行删除", "提示");
                    return;
                }
                this.$confirm('确定删除当前选中数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.axios(this.ENUMS.ACTIONS.DELETE_DEV_BY_ID, {devId: this.selectDevData.oid}, [res => {
                        _this.$refs[_this.PAGE_ENUM.REFS.MANAGE.REF].refreshTable();
                        this.$message.success("删除成功!");
                    }, res => {
                        this.$message.error(res.code);
                    }, res => {
                        this.$message.error("请求异常!");
                    }]);
                }).catch(res=>{
                    this.$message.info('已取消删除');
                });
            },
            /**
             * 编辑无限制按钮响应事件
             */
            editIgnore() {
                if (!this.selectDevData.oid) {
                    this.$alert("请选择需要编辑的设备", "提示");
                    return;
                }
                this.selectDevId = this.selectDevData.oid;
                this.openDevEdit(true, "设备编辑", this.selectDevData.oid);
            },
            /**
             * 详情按钮响应事件
             */
            view() {
                this.selectDevId = this.selectDevData.oid;
                this.openDevEdit(false, "设备查看");
            },
            //导入按钮响应事件
            upload() {
                this.btnType = this.ENUMS.BTN_TYPE.UPLOAD;
                if (this.currentSelectCategory == this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE) {
                    this.openCategorySelect();
                    return;
                }
                this.openUploader();
            },
            /**
             * 打开导入页面
             */
            openUploader() {
                this.PAGE_ENUM.REFS.UPLOADER.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.UPLOADER.REF].openDialog();
                });
            },
            /**
             * 设备类型树节点选择事件
             */
            categoryTreeSelectedHandler(currentNode, row) {
                this.selectDevData = [];
                this.currentSelectCategory = currentNode;
                this.setMainData(currentNode);
                this.exportInfo.exportSelectCategory = currentNode;
                this.exportInfo.exportTitle = row.label;
                if (row.level == 3) {
                    this.exportInfo.exportSelectCategory = row.parent.data.code;
                }
                this.changeExportColumns();
            },
            /**
             * 设置miandata，向编辑页面传数据
             */
            setMainData(currentNode) {
                if (currentNode > this.ENUMS.CHILD_CATEGORY_CODE_FLAG) {
                    //选中节点为设备子类
                    this.mainData.category = this.getParentType(currentNode);
                    this.mainData.childType = currentNode;
                } else {
                    //选中节点为设备大类
                    this.mainData.category = currentNode;
                    this.mainData.childType = this.getChildType(currentNode);
                }
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initColumns();
                this.initQuery();
                this.initButtons();
                this.setExportAllColumnsStr();
                this.$nextTick(() => this.showTreeTable = true);
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.columns = [{code: 'oid', hidden: true},
                    {code: 'netArea', hidden: true},
                    {code: 'netType', hidden: true},
                    {
                        label: '设备类型', code: 'category', width: 80, formatter(data) {
                            return _this.onCategoryRenderer(data.category);
                        }
                    },
                    {
                        label: '设备子类', code: 'childType', width: 120, formatter(data) {
                            return _this.onChildTypeRenderer(data.childType);
                        }
                    },
                    {label: '保密编号', code: 'secretSn', width: 100},
                    {label: '资产编号', code: 'sn', width: 100},
                    {label: '名称', code: 'name', width: 90},
                    {
                        label: '联网类型', code: 'netAreaAndType', width: 80, ignore: true, formatter: row => {
                            return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                        }
                    },
                    {
                        label: '放置地点', code: 'currentPlace', width: 90, formatter: row => {
                            return _this.onCurrentPlaceRenderer(row.currentPlace);
                        }
                    },
                    {
                        label: '密级', code: 'secretLevel', width: 50, formatter: row => {
                            return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, row.secretLevel);
                        }
                    },
                    {
                        label: '涉密属性', code: 'secret', width: 80, formatter(data) {
                            return _this.onSecretRenderer(data.secret);
                        }
                    },
                    {
                        label: '自主可控', code: 'controllable', width: 80, formatter(data) {
                            return _this.onYesNoRenderer(data.controllable);
                        }
                    },
                    {
                        label: '使用情况', code: 'state', width: 80, formatter(data) {
                            return _this.onStateRenderer(data.state, data.category);
                        }
                    },
                    {label: '启用日期', code: 'useDate', width: 80},
                    {label: '备注', code: 'remark', width: 80},

                    {label: '责任人编码', code: 'dutyCode', width: 60, hidden: true, export: true},
                    {label: '责任人', code: 'dutyName', width: 60},
                    {label: '责任部门', code: 'deptName', width: 80},

                    {label: '使用人编码', code: 'userCode', width: 80, hidden: true, export: true},
                    {label: '使用人', code: 'userName', width: 80, hidden: true, export: true},
                    {label: '使用部门', code: 'userDeptName', width: 80, hidden: true, export: true},
                    {label: '设备编号', code: 'devSn', width: 80, hidden: true, export: true},
                    {label: '设备型号', code: 'model', width: 80, hidden: true, export: true},

                    {label: '出厂编号', code: 'birthSn', width: 80, hidden: true, export: true},
                    {label: '出厂日期', code: 'birthDate', width: 80, hidden: true, export: true},
                    {label: '购置价格', code: 'price', width: 80, hidden: true, export: true},
                    {label: '购置日期', code: 'buyDate', width: 80, hidden: true, export: true},
                    {label: 'IP地址（主）', code: 'masterIp', width: 80, hidden: true, export: true},

                    {label: '质保期', code: 'qualityDate', width: 80, hidden: true, export: true},
                    {label: '用途', code: 'useFor', width: 80, hidden: true, export: true},
                    //设备_存储介质扩展表
                    {label: '序列号', code: 'license', width: 80, hidden: true, export: false},
                    {label: '软件识别编号', code: 'softWareNo', width: 80, hidden: true, export: false},
                    {label: '盘柜编号', code: 'trayNo', trayNo: 80, hidden: true, export: false},
                    {label: '容量', code: 'capacity', width: 80, hidden: true, export: false},
                    {label: '授权账号', code: 'softwareAccount', width: 80, hidden: true, export: false},

                    //设备_安全保密产品扩展表
                    {label: '软件版本', code: 'softVersion', width: 80, hidden: true, export: false},
                    {label: '检测证书', code: 'checkCertsignName', width: 80, hidden: true, export: false},
                    {label: '证书编号', code: 'checkCertsignCode', trayNo: 80, hidden: true, export: false},
                    {label: '有效期', code: 'checkCertsignDate', width: 80, hidden: true, export: false},
                    {label: '检测单位', code: 'checkDeptName', width: 80, hidden: true, export: false},

                    //计算机与服务器
                    {label: '设备形态', code: 'shape', width: 80, hidden: true, export: false},
                    {label: '操作系统版本', code: 'osVersion', width: 80, hidden: true, export: false},
                    {label: '安装日期', code: 'setupDate', trayNo: 80, hidden: true, export: false},
                    {label: '是否终端', code: 'terminal', width: 80, hidden: true, export: false, mapTypeCode: "YES_NO"},
                    //应用系统  10
                    {
                        label: '来源',
                        code: 'origin',
                        width: 80,
                        hidden: true,
                        export: false,
                        mapTypeCode: "appSystemOrigin"
                    },
                    {label: '功能描述', code: 'functionaldesc', width: 80, hidden: true, export: false},
                    {label: '许可验证-检测单位', code: 'appCheckDeptName', width: 80, hidden: true, export: false},
                    {
                        label: '是否通过离线安全测评',
                        code: 'passOfflineValid',
                        width: 80,
                        hidden: true,
                        export: false,
                        mapTypeCode: "YES_NO"
                    },
                    {
                        label: '许可验证-是否在线验证',
                        code: 'onlinevalid',
                        width: 80,
                        hidden: true,
                        export: false,
                        mapTypeCode: "YES_NO"
                    },
                    {label: '验证时间', code: 'onlineValidDate', width: 80, hidden: true, export: false},
                    {
                        label: '部署模式',
                        code: 'deployMode',
                        width: 80,
                        hidden: true,
                        export: false,
                        mapTypeCode: "deployModeData"
                    },
                    {label: '系统管理员', code: 'systemAdmin', width: 80, hidden: true, export: false},
                    {label: '系统管理员用户编码', code: 'systemAdminCode', width: 80, hidden: true, export: false},
                    {label: '安全管理员', code: 'authAdmin', width: 80, hidden: true, export: false},
                    {label: '安全管理员用户编码', code: 'authAdminCode', width: 80, hidden: true, export: false},
                    {label: '审计管理员', code: 'auditAdmin', width: 80, hidden: true, export: false},
                    {label: '审计管理员用户编码', code: 'auditAdminCode', width: 80, hidden: true, export: false},

                    //公共
                    {label: '设备规格[规格类型:规格明细][逗号，分隔]', code: 'devPv', width: 80, hidden: true, export: false},
                    {label: 'MAC地址[MAC地址:是否启用][逗号，分隔]', code: 'mac', width: 80, hidden: true, export: false},
                    {label: '关联设备的保密编号[逗号，分隔]', code: 'dependSn', width: 80, hidden: true, export: false},
                    {label: '相关厂商[单位名称：单位性质][逗号，分隔]', code: 'factoryName', width: 80, hidden: true, export: false}
                ];
            },
            /**
             * 初始化表格查询
             */
            initQuery() {
                let _this = this;
                this.query = [/*{
                    type: 'select',
                    label: '设备类型',
                    code: 'category',
                    value: '',
                    textProp: 'name',
                    codeProp: 'strCode',
                    options: _this.ENUMS.CATEGORY_DATA
                },
                    {
                        type: 'select', label: '设备子类', code: 'childType', textProp: 'name',
                        codeProp: 'strCode', options: _this.getChildType()
                    },*/
                    {
                        type: 'static', label: '设备类型', code: 'category', width: 80, value: () => {
                            return _this.currentSelectCategory < _this.ENUMS.CHILD_CATEGORY_CODE_FLAG ? _this.currentSelectCategory : null;
                        }
                    },
                    {
                        type: 'static', label: '设备子类', code: 'childType', width: 90, value: () => {
                            return _this.currentSelectCategory >= _this.ENUMS.CHILD_CATEGORY_CODE_FLAG ? _this.currentSelectCategory : null;
                        }
                    },
                    {type: 'input', label: '保密编号', code: 'secretSn', value: ''},
                    {type: 'input', label: '资产编号', code: 'sn', value: ''},
                    {type: 'input', label: '设备编号', code: 'devSn', value: ''},
                    {type: 'input', label: '出厂编号', code: 'birthSn', value: ''},
                    {type: 'date', label: '启用日期(起)', code: 'useDate', exp: ">"},
                    {type: 'date', label: '启用日期(止)', code: 'useDate', exp: "<"},
                    {type: 'input', label: '设备名称', code: 'name', value: ''},
                    {type: 'input', label: 'IP地址', code: 'masterIp', value: ''},
                    {
                        type: 'select',
                        label: '系统级别',
                        code: 'systemLevel',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.SYSTEM_LEVEL_DATA
                    },
                    {
                        type: 'select',
                        label: '联网类型',
                        code: 'netAreaAndType',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.NET_AREA_TYPE_DATA
                    },
                    {type: 'input', label: '放置地点', code: 'currentPlace', value: ''},
                    {
                        type: 'select',
                        label: '使用情况',
                        code: 'state',
                        value: '',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.STATE_DATA.properties
                    },
                    {
                        type: 'select',
                        label: '密级',
                        code: 'secretLevel',
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                        value: ''
                    },
                    {
                        type: 'select',
                        label: '涉密属性',
                        code: 'secret',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.YES_NO.properties
                    },
                    {
                        type: 'select',
                        label: '自主可控',
                        code: 'controllable',
                        textProp: 'name',
                        codeProp: 'code',
                        options: _this.ENUMS.YES_NO.properties
                    },
                    {type: 'input', label: '责任人', code: 'dutyName', value: ''},
                    {type: 'input', label: '责任部门', code: 'deptName', value: ''},
                    {type: 'input', label: '责任单位', code: 'dutyOrgName', value: ''}
                ];
            },
            /**
             * 初始化表格按钮
             */
            initButtons() {
                this.buttons = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.add}),//新增
                    Object.assign({}, this.COMM_ENUMS.BUTTON.EDIT, {callback: this.edit}),//编辑
                    Object.assign({}, this.COMM_ENUMS.BUTTON.DELETE, {callback: this.delete}),//删除
                    Object.assign({}, this.COMM_ENUMS.BUTTON.DOWNLOAD, {callback: this.upload}),//导入
                    Object.assign({}, this.COMM_ENUMS.BUTTON.UPLOAD, {type: "export"}),//导出
                    Object.assign({}, this.COMM_ENUMS.BUTTON.DEATILS, {callback: this.view}),//详情
                    Object.assign({}, this.COMM_ENUMS.BUTTON.EDITNOLIMIT, {callback: this.editIgnore})//编辑(无限制)
                ];
            },
            /**
             * 编辑页面关闭回调按钮
             * @param e
             */
            closeEditHandler(e) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    if (!e) {//直接关闭回调
                    } else {//保存成功的回调
                        _this.$refs[_this.PAGE_ENUM.REFS.MANAGE.REF].refreshTable();
                    }
                    _this.PAGE_ENUM.REFS.DEV_EDIT.SHOW = false;
                    resolve();
                });
            },
            /**
             * 导入页面关闭回调按钮
             * @param e
             */
            closeUploaderHandler(e) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.PAGE_ENUM.REFS.UPLOADER.SHOW = false;
                    resolve();
                });
            },
            /**
             * 点击行，manage的值发生变化
             */
            handleSelectionChange(row) {
                this.selectDevData = row[0];
            },
            /**
             * 行双击事件
             * @param row
             */
            rowDbClick(row) {
                this.selectDevData = row;
                this.view();
            },
            /**
             * 更改导出的列
             */
            changeExportColumns() {
                this.exportInfo.exportUrl = "";
                this.exportInfo.exportAllColumns = "";
                if (this.exportInfo.exportSelectCategory == 0) {
                    this.setExportAllColumnsStr();
                    return;
                }
                for (let i = 0; i < this.columns.length; i++) {
                    this.columns[i].export = false;
                }

                let exps = this.exportInfo.exportColumns[this.exportInfo.exportSelectCategory];
                for (let j = 0; !!exps && j < exps.length; j++) {
                    for (let i = 0; i < this.columns.length; i++) {
                        if (exps[j] == this.columns[i].code) {
                            this.columns[i].export = true;
                        }
                    }
                }

            },
            setExportAllColumnsStr() {
                let allStr = "";
                let titles = "";
                this.exportInfo.exportUrl = this.ENUMS.ACTIONS.EXPORT_DEV.URL();
                for (let k in this.exportInfo.exportColumns) {
                    let exps = this.exportInfo.exportColumns[k];
                    titles += "##" + k;
                    let str = "";
                    for (let j = 0; !!exps && j < exps.length; j++) {
                        for (let i = 0; i < this.columns.length; i++) {
                            if (exps[j] == this.columns[i].code) {
                                let column = this.columns[i];
                                let col = column.code + "::" + column.label + "::" + (column.mapTypeCode ? column.mapTypeCode : '');
                                str += "," + col;
                            }
                        }
                    }
                    str = str.substr(1);
                    allStr += "##" + str;
                }
                allStr = allStr.substr(2);
                titles = titles.substr(2);
                this.exportInfo.exportTitle = titles;
                this.exportInfo.exportAllColumns = allStr;
            }
        },
        mounted() {
            let _this = this;
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE, this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE, this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestNetAreaTypeData(),
                this.requestCommStateData(),
                this.requestSystemStateData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>
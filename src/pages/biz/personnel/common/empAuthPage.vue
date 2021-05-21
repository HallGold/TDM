<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid load-url="/biz/bizEmpAuthorized/tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="categoryId"
                       :lazy="false"
                       data-url="/biz/bizEmpAuthorized/list"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       treeWidth="300px"
                       @node-click="dataTree"
                       @pagClick="beforeBindData"
                       :operations-width="140">
            <div style="display: flex;justify-content:space-around" slot="prefix">
                <el-button icon="el-icon-circle-plus" type="text" :style="{'color':treeAddEdit?'#333': '#85ce61'}"
                           @click="addNode" :disabled="treeAddEdit">
                    <span style="color: #222222">新增</span>
                </el-button>
                <el-button icon="el-icon-edit" type="text" :style="{'color': treeUpdateEdit?'#333':'#ebb563'}"
                           @click="updateNode" :disabled="treeUpdateEdit">
                    <span style="color: #222222">编辑</span>
                </el-button>
                <el-button icon="el-icon-delete" type="text" :style="{'color': treeDelEdit?'#333':'red'}"
                           @click="deleteDicType" :disabled="treeDelEdit">
                    <span style="color: #222222">删除</span>
                </el-button>
            </div>
        </ice-tree-grid>
        <ice-dialog width="620px" :visible.sync="dialogVisible" :title="title">
            <el-form :model="mainData" :rules="formRules" label-width="100px" ref="form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="角色" prop="roleName">
                            <el-input v-model="mainData.roleName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="系统类别" prop="category">
                            <el-input v-model="mainData.category" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="系统名称" prop="systemName">
                            <el-input v-model="mainData.systemName" readonly>
                                <i class="el-icon-edit el-input__icon" slot="suffix" @click="chooseSysName"
                                   title="点我选择系统名称"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" prop="secretLevel">
                            <ice-select v-model="mainData.secretLevel" map-type-code="devSecretLevel"
                                        placeholder="选择系统名称后自动带出" :disabled="true"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="closeDialog('form')" type="info">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog width="500px" :visible.sync="dialogVisibleType" :title="titleType">
            <el-form :model="mainDataType" :rules="formRulesType" label-width="100px" ref="formType">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="类别名称" prop="name">
                            <el-input v-model="mainDataType.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="类别编码" prop="code">
                            <el-input v-model="mainDataType.code" :disabled="isEditType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button @click="saveType" type="primary">保存</el-button>
                <el-button @click="closeDialogType('formType')" type="info">取消</el-button>
            </div>
        </ice-dialog>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="false"
                    :columns="columnsDev"
                    width="1050px"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>
</template>

<script>
    import IceTreeGrid from "../../../../components/common/base/IceTreeGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import DevSelect from "../../dev/devSelect";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "empAuthPage",
        components: {IceSelect, DevSelect, IceDialog, IceTreeGrid},
        mixins: [bizComm, devComm, renderer],
        data() {
            return {
                treeData: [],
                gridData: [],
                categoryId: '',//列表的查询条件
                query: [
                    {label: '角色', code: 'roleName', type: 'input', value: '', exp: 'like'},
                    {label: '系统类别', code: 'category', type: 'input', value: '', exp: 'like'},
                    {label: '系统名称', code: 'systemName', type: 'input', value: '', exp: 'like'},
                    {
                        label: '密级',
                        code: 'secretLevel',
                        type: 'select',
                        value: '',
                        mapTypeCode: 'devSecretLevel',
                        exp: '='
                    },
                    {
                        type: 'static', code: 'categoryId', exp: '=', value: () => {
                            return this.categoryId
                        }
                    }
                ],
                columns: [],
                operations: [],
                buttons: [],
                roleName: '',
                roleCode: '',
                sysTypeCode: '',//系统类别code
                sysType: '',//系统类别
                title: '',//列表弹窗标题
                titleType: '',//类型弹窗标题
                devSelectShow: false,    //设备选择弹窗的开关属性
                columnsDev: [],//服务对象数据展示列
                isEdit: false,
                isEditType: false,
                treeAddEdit: false,
                treeUpdateEdit: false,
                treeDelEdit: false,
                dialogVisible: false,
                dialogVisibleType: false,
                treeNodeObj: {},
                mainData: {//列表对象
                    roleName: '',
                    category: '',
                    systemName: '',
                    secretLevel: '',
                },
                mainDataType: {//类别对象
                    name: '',
                    code: '',
                    parentId: ''
                },
                formRules: {//列表字段验证
                    systemName: [{required: true, message: '请选择系统名称', trigger: 'change'}]
                },
                formRulesType: {//类别字段验证
                    name: [{required: true, whitespace: true, message: '请填写类别名称', trigger: 'blur'}],
                    code: [{required: true, whitespace: true, message: '请填写类别编码', trigger: 'blur'}]
                },
            }
        },
        methods: {
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    if (data.length > 0) {
                        let sysTypeName = this.onCategoryRenderer(data[0].category);
                        if (sysTypeName == '应用系统') {
                            this.mainData.systemName = data[0].name;
                            this.mainData.systemCode = data[0].category;
                        } else {
                            this.mainData.systemName = this.onChildTypeRenderer(data[0].childType);
                            this.mainData.systemCode = data[0].childType
                        }
                        this.mainData.secretLevel = data[0].secretLevel ? data[0].secretLevel.toString() : data[0].secretLevel;
                    }
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                })
            },
            beforeBindData(data) {
                if (data.length > 0 || this.categoryId == '') {
                    this.treeDelEdit = true;
                } else {
                    this.treeDelEdit = false;
                }
            },
            /**
             * 点击树节点获取的数据
             * @param data
             * @param node
             */
            dataTree(data, node) {
                this.roleName = node.parent.data.name;
                this.roleCode = node.parent.data.code;
                this.sysType = node.data.name;
                this.sysTypeCode = node.data.code;
                this.categoryId = data == 0 ? '' : data;
                this.treeNodeObj = node.data;
                if (data == '0') {
                    this.treeUpdateEdit = true;
                    this.treeDelEdit = true;
                } else {
                    this.treeUpdateEdit = false;
                    this.treeDelEdit = false;
                }
                if (node.level == '1' || node.level == '2') {
                    this.treeAddEdit = false;
                    this.$set(this.buttons[0], 'disabled', true);
                } else {
                    this.treeAddEdit = true;
                    this.$set(this.buttons[0], 'disabled', false);
                }
            },
            /**
             * 树形---新增
             */
            addNode() {
                this.titleType = '新增';
                this.isEditType = false;
                this.dialogVisibleType = true;
                this.mainDataType = {
                    name: '',
                    code: '',
                    parentId: this.categoryId
                };
            },
            /**
             * 树形---编辑
             */
            updateNode() {
                this.titleType = '编辑';
                this.isEditType = true;
                this.dialogVisibleType = true;
                Object.assign(this.mainDataType, this.treeNodeObj);
                this.mainDataType.oid = this.mainDataType.categoryId;
            },
            /**
             * 树形---删除
             */
            deleteDicType() {
                this.$confirm('确定要删除该类型吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/bizEmpAuthorized/delTreeNode", {params: {id: this.categoryId}}).then(res => {
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.deleteNode();
                    }).catch(e => {
                        this.err(e);
                    })

                })
            },
            /**
             * 初始化
             */
            initTemplate() {
                this.columns = [
                    {code: 'oid', hidden: true},
                    {code: 'roleCode', hidden: true},
                    {code: 'systemCode', hidden: true},
                    {code: 'categoryCode', hidden: true},
                    {label: '角色', code: 'roleName'},
                    {label: '系统类别', code: 'category'},
                    {label: '系统名称', code: 'systemName'},
                    {label: '密级', code: 'secretLevel', mapTypeCode: 'devSecretLevel'},
                ];
                this.operations = [
                    {name: '编辑', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                ];
                this.buttons = [
                    {name: '新增', callback: this.addItem}
                ];
                let _this = this;
                this.columnsDev = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {
                        label: '设备名称', code: 'name', width: 150
                    },
                    {
                        label: '设备子类', code: 'childType', width: 90, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {
                        label: '设备类型', code: 'category', renderCell(h, data) {
                            return _this.onCategoryRenderer(data.row.category);
                        }, width: 120
                    },
                    {label: '责任人', code: 'dutyName', width: 120},
                    {
                        label: '密级',
                        code: 'secretLevel',
                        width: 100,
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
                    },
                    {
                        label: '涉密属性', code: 'secret', width: 100, renderCell(h, data) {
                            return _this.onSecretRenderer(data.row.secret);
                        }
                    },];
            },
            /**
             * 选择系统名称
             */
            chooseSysName() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 列表--保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/biz/bizEmpAuthorized/saveOrUpdate", this.mainData).then(res => {
                            this.$message.success("保存成功");
                            this.refresh();
                            this.closeDialog('form');
                        }).catch(e => {
                            this.err(e);
                        })
                    }
                })
            },
            /**
             * 列表--取消
             */
            closeDialog(ref) {
                this.resetForm(ref);
                this.$nextTick(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 类别--保存
             */
            saveType() {
                this.$refs.formType.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/biz/bizEmpAuthorized/saveOrUpdateTreeNode", this.mainDataType).then(res => {
                            this.$message.success("保存成功");
                            if (this.isEditType) {
                                this.$refs.iceGrid.updateNode(res.data);
                                this.treeNodeObj = res.data;
                            } else {
                                this.$refs.iceGrid.addNode(res.data);
                            }
                            this.closeDialogType('formType');
                        }).catch(e => {
                            this.err(e);
                        })
                    }
                })

            },
            /**
             * 类别--取消
             */
            closeDialogType(ref) {
                this.resetForm(ref);
                this.$nextTick(() => {
                    this.dialogVisibleType = false;
                });
            },
            /**
             * 列表--新增
             */
            addItem() {
                this.title = '新增';
                this.dialogVisible = true;
                this.mainData = {
                    roleName: '',
                    roleCode: '',
                    category: '',
                    categoryCode: '',
                    systemName: '',
                    systemCode: '',
                    secretLevel: '',
                    parentId: ''
                };
                this.mainData.roleName = this.roleName;
                this.mainData.roleCode = this.roleCode;
                this.mainData.category = this.sysType;
                this.mainData.categoryCode = this.sysTypeCode;
                this.mainData.parentId = this.categoryId;

            },
            /**
             * 列表--删除
             * @param row
             */
            deleteItem(row) {
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/bizEmpAuthorized/del", {params: {id: row.oid}}).then(res => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(e => {
                        this.err(e);
                    })
                })
            },
            /**
             * 列表--编辑
             * @param row
             */
            updateItem(row) {
                this.title = '编辑';
                Object.assign(this.mainData, row);
                this.dialogVisible = true;
            },
            resetForm(ref) {
                this.$refs[ref].resetFields();
            },
            err(e) {
                if (e.msg) {
                    this.$message.error(e.msg);
                } else {
                    this.$message.error(e);
                }
            },
            refresh() {
                this.$refs.iceGrid.$refs.queryGrid.refresh();
            },
        },
        mounted() {
            this.requestCategoryData();
            this.initTemplate();
        }
    }
</script>

<style scoped>

</style>
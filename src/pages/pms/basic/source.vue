<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <el-container>
            <el-aside width="250px" class="treeWrap" style="position: relative">
                <el-card class="ice-full-absolute">
                    <div class="tree">
                        <ice-tree :load-url="url"
                                  label-prop="name"
                                  value-prop="oid"
                                  node-key="oid"
                                  style="height: 100%"
                                  @node-click="dataTree"
                                  :lazy="false"
                                  ref="tree"
                        >
                            <div style="display: flex;justify-content:space-around" slot="prefix">
                                <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode">
                                    <span style="color: #222222">新增</span>
                                </el-button>
                                <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode"
                                           :disabled="!curTreeNode.doEdit">
                                    <span style="color: #222222">编辑</span>
                                </el-button>
                                <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteDicType"
                                           :disabled="!curTreeNode.doEdit">
                                    <span style="color: #222222">删除</span>
                                </el-button>
                            </div>
                        </ice-tree>
                    </div>

                </el-card>
            </el-aside>
            <el-main class="main">
                <ice-query-grid data-url="/pms/FrameAppDataDictionaryType/rightList"
                                :query="query"
                                :columns="columns"
                                :buttons="buttons"
                                :operations="operations"
                                ref="grid"
                                :operationsWidth="width"
                                exportTitle="项目来源维护"
                                @selection-change="selectionChange">

                </ice-query-grid>
            </el-main>
        </el-container>

        <el-dialog v-dialogDrag :title="typeTitle" custom-class="ice-dialog" center :visible.sync="dialogVisibleType"
                   width="800px" append-to-body :close-on-click-modal="false" :show-close="true"
                   :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="类型名称:" label-width="100px" prop="name">
                                <el-input placeholder="不超过20个字" v-model="mainDataForm.name" maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型编码:" label-width="100px" prop="code">
                                <el-input placeholder="由数字英文字母或者下划线组成"
                                          v-model="mainDataForm.code"
                                          @blur="checkDicTypeUnique"
                                          maxlength="30"
                                          @keyup.native="codeItem"
                                          :disabled="isUpData"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                <el-checkbox v-model="mainDataForm.enabled"
                                             :true-label=1
                                             :false-label=0></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:" label-width="100px" prop="sequencing">
                                <el-input-number v-model="mainDataForm.sequencing" :min="0" :max="99"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60" v-if="($userInfo.userType & 33) === 33">
                        <el-col :span="12">
                            <el-form-item label="是否可见:" label-width="100px" prop="isVisiblable">
                                <el-checkbox v-model="mainDataForm.isVisiblable"
                                             true-label="Y"
                                             false-label="N"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否可编辑:" label-width="100px" prop="isEditable">
                                <el-checkbox v-model="mainDataForm.isEditable"
                                             true-label="Y"
                                             false-label="N"></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="描述说明:" label-width="100px" prop="desp">
                                <el-input placeholder="不超过256个字" type="textarea" :rows="4"
                                          v-model="mainDataForm.desp" maxlength="256"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <div class="ice-button-bar ">
                    <el-button type="primary" @click="saveType">保存</el-button>
                    <el-button type="info" @click="closeDialogType">返回</el-button>
                </div>
                <div class="ice-streak"></div>
            </div>
        </el-dialog>

        <!--导入-->
        <ice-dialog title="项目导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader @uploadSuccess="uploadSuccess"
                                service="XminfoProjectSourceExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import ApplicationIceTreeGrid from "../../../pages/biz/software/ApplicationIceTreeGrid"
    import IceTree from "../../../components/common/base/IceTree";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";

    export default {
        name: "DatamapList",
        data() {
            return {
                visibleImport: false,
                width: 180,
                query: [
                    {type: 'static',  code: 'oid', value: '1f8c26476fb516bc12c43c9d4df349cf'},
                    {type: 'input', label: '类型编码', code: 'code'},
                    {type: 'input', label: '类型名称', code: 'name'},
                ],
                columns: [
                    {label: '类型名称', code: 'name', width: 200},
                    {label: '类型编码', code: 'code', width: 180},
                    {label: '状态', code: 'enabled', width: 100, mapTypeCode: 'enabled'},
                    {label: '描述说明', code: 'desp', align: 'left'},
                ],
                operations: [],
                buttons: [
                    {
                        name: '导入',
                        icon: 'el-icon-upload2',
                        ctrlCode: "BDR",
                        size: 'mini',
                        callback: this.handleImport,
                        // disabled: () => {
                        //     return this.crewCodes.indexOf(this.$userInfo.userCode) == -1 ? true : false
                        // }
                    },
                    {name: '导出', ctrlCode: "BDC", icon: 'el-icon-download', size: 'mini', type: 'export'},  //导出Excel表需要定义一个组件就行，这里声明就可以使用

                ],
                dialogVisible: false,
                dialogVisibleType: false,
                mainDataForm: {
                    appCode: '',
                    code: '',
                    name: '',
                    parentid: '',
                    enabled: '1',
                    desp: '',
                },
                dicDataForm: {
                    oid: "",
                    code: "",
                    name: "",
                    value: "",
                    remark: '',
                    enabled: 1,
                    sequencing: '0',
                    isSystem: "N",
                    isVisiblable: "Y",
                    isEditable: "Y",
                    orgCode: "",
                    typeId: "",
                    doEdit: false
                },
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入类型编码', trigger: 'change'}],
                    name: [{required: true, whitespace: true, message: '请输入类型名称', trigger: 'blur'}],
                },
                detailGridData: [
                    {name: '', code: '', value: '', enabled: '1', remark: ''}
                ],
                nodeType: '',
                curTreeNode: {
                    doEdit: false
                },
                isUpData: false,
                funCode: '',
                typeTitle: '数据字典类型维护',
                oidXmly:'',
            }
        },
        methods: {
            ...mapActions('menuStore', ['getAppMenus']),
            async getZiyAppcode() {
                // console.log(this.getAppCode, 'getAppCode')
                if (this.getAppCode) {
                    this.getAppMenus(this.getAppCode).then(res => {
                        if (res && res.length > 0) {
                            // console.log('appCode：',res[0].appCode)
                            this.initOidXmly(res[0].appCode);
                        }
                    })
                }
            },
            async initOidXmly(appcode){
                await   this.$axios.get("/permission/app_constant/byCode",{params:{
                            appCode: appcode,
                            code: 'OID_XMLY',
                        }}).then(resault =>{
                            if(resault.data != null){
                                this.oidXmly = resault.data.value;
                                // console.log('项目来源oid', this.oidXmly)
                            }else {
                                this.$message.error("初始化项目来源数据字典oid失败！请确保是否配置了OID_XMLY常量！")
                            }
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
            },
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisibleType = false;
            },
            /**树形节点获取*/
            dataTree(nodeDataOid) {
                this.nodeType = nodeDataOid;
                let tid = setTimeout(() => {
                    this.$nextTick(() => {
                        // console.log(nodeDataOid, 'nodeDataOid')
                        let node = this.$refs.tree.getNode(nodeDataOid);
                        // console.log(node, 'node')
                        this.curTreeNode = node.data;
                        this.curTreeNode.doEdit = this.curTreeNode.isEditable
                        // console.log(this.curTreeNode.doEdit)
                        this.setTreeCurrentKey(nodeDataOid);

                    })
                }, 20)
            },

            handleImport() {
                this.visibleImport = true;
            },
            uploadSuccess() {
                // this.refreshTree();
                this.$refs.tree.refresh();
                this.visibleImport = false;
            },
            /**新增到树形结构*/
            addNode() {
                this.typeTitle = '新增数据字典类型';
                this.mainDataForm = {enabled: 1, isVisiblable: 'Y', isEditable: 'Y', sequencing: '0'};
                this.dialogVisibleType = true;
                this.isUpData = false;
                this.funCode = '';
            },
            /**验证编码值是否重复*/
            checkDicTypeUnique() {
                if (this.mainDataForm.code) {
                    this.$axios.get("/permission/dataDictionary/repeat_dictionary_type", {"params": {"typeCode": this.mainDataForm.code}}).then(success => {
                        if (!success.data) {
                            if (this.funCode != this.mainDataForm.code) {
                                this.$message.warning("该编码已存在，请换一个");
                                this.mainDataForm.code = '';
                            }
                        }
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })

                    });
                }
            },
            /**修改类型*/
            updateNode() {
                this.typeTitle = '编辑数据字典类型';
                this.$axios.get("/permission/dataDictionary/byId", {"params": {"typeId": this.nodeType}})
                    .then(success => {
                        this.dialogVisibleType = true;
                        this.mainDataForm = success.data;
                        // this.mainDataForm.enabled = this.mainDataForm.enabled == 1 ? "是" : (this.mainDataForm.enabled == 0 ? "否" : this.mainDataForm.enabled);
                        this.isUpData = true;
                        this.funCode = this.mainDataForm.code;
                    }).catch(error => {
                    this.$message.error("加载数据字典类型出错了");
                })

            },
            /**删除类型*/
            deleteDicType() {
                if (this.nodeType == 0) {
                    this.$message({
                        message: '该节点为根节点，不可删除',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除该类型吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let key = this.curTreeNode.parentId;
                        this.$axios.delete("/pms/FrameAppDataDictionaryType/delOne", {"params": {"oid": this.nodeType}})
                            .then(success => {
                                this.$refs.tree.deleteNode();
                                this.$message.success("删除数据字典类型成功");
                                if (!key) {
                                    key = '0';
                                }
                                this.setTreeCurrentKey(key);
                            }).catch(error => {
                                this.$message({
                                    type: 'error',
                                    message: error.msg ? error.msg : error
                                })
                            })
                    });
                }
            },
            /*通过 key 设置某个树节点的当前选中状态*/
            setTreeCurrentKey(key) {
                this.$refs.tree.setCurrentKey(key);
                this.query[0].value = key;
                this.$nextTick(() => {
                    this.$refs.grid.refresh();
                })
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                if (this.mainDataForm.code === null || this.mainDataForm.code === undefined || this.mainDataForm.code === '') {

                } else {
                    this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/, '');
                }
            },
            /**新增与更新数据字典类型的保存*/
            saveType() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.nodeType == 0) {
                            this.mainDataForm.parentId = null;
                        } else {
                            if (!this.isUpData) {
                                this.mainDataForm.parentId = this.nodeType;
                            }
                        }
                        this.$axios.post("/pms/FrameAppDataDictionaryType/saveOrUpdate", this.mainDataForm).then(success => {
                            this.$message.success("保存数据字典类型成功");
                            this.dialogVisibleType = false;
                            // console.log(this.isUpData)
                            if (!this.isUpData) {
                                this.$refs.tree.addNode(success.data);
                            } else {
                                this.$nextTick(() => {
                                    this.$refs.tree.updateNode(success.data);
                                });

                            }
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                });

            },
            /**关闭新增弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            },
            /**关闭新增类型弹窗*/
            closeDialogType() {
                this.$refs.form.clearValidate();
                this.dialogVisibleType = false;
            },
            selectionChange(row){
                // console.log(row);
            },
        },
        computed: {
            ...mapGetters('menuStore', ['getAppCode']),
            url(){
                return '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidXmly;
            }
        },
        watch: {},
        mounted() {
        },
        created() {
            this.getZiyAppcode();
        },
        components: {
            IceTreeGrid,
            IceSelect,
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout,
            IceQueryGrid,
            ApplicationIceTreeGrid,
            IceTree,
            IceExcelUploader,
        }
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;

        .button-area {
            display: flex;
            justify-content: flex-end;
        }

    }
    .treeWrap {
        .tree {
            position: absolute;
            left: 15px;
            right: 15px;
            bottom: 0;
            top: 0;
            z-index: 10;
        }
    }
</style>

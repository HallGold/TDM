<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid load-url="/biz/BizSoftwareClassify/tree"
                       label-prop="label"
                       value-prop="oid"
                       :lazy="false"
                       data-url="/biz/BizSoftwareInfo/admin/list"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :operationsWidth=150
                       :buttons="buttons"
                       @pagClick="pagClick"
                       chooseItem="multiple"
                       :vif="true"
                       ref="multipleTable"
                       quickQueryWidth="300px"
                       @selection-change="handleSelectionChange"
                       @node-click="handleNodeClick"
                       :operations-width="230">
            <div style="display: flex;justify-content:space-around" slot="prefix" v-if="isManger">
                <el-button type="text" @click="addNode" :disabled="clsOptBtnNew">
                    <i class="el-icon-circle-plus" style="color: #85ce61"></i>
                    <span :class="clsOptBtnNew?'dis-btn':'nml-btn'">新增</span>
                </el-button>
                <el-button type="text" @click="updateNode" :disabled="clsOptBtnEdit">
                    <i class="el-icon-edit" style="color: #ebb563"></i>
                    <span :class="clsOptBtnEdit?'dis-btn':'nml-btn'">编辑</span>
                </el-button>
                <el-button type="text" @click="deleteNode" :disabled="clsOptBtnDel">
                    <i class="el-icon-delete" style="color: red"></i>
                    <span>删除</span>
                </el-button>
            </div>
        </ice-tree-grid>
        <el-dialog v-dialogDrag :title="titleType" custom-class="ice-dialog" center :visible.sync="dialogVisibleType"
                   width="500px" append-to-body :close-on-click-modal="false">
            <el-form :model="mainDataFormClass" :rules="formRules" class="conditon-bar" ref="classifyForm"
                     style="margin-top: 20px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="类型名称:" label-width="90px" prop="classifyName">
                            <el-input placeholder="只能输入最多20个字的名称" v-model="mainDataFormClass.classifyName"
                                      maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="排序:" label-width="90px" prop="sort">
                            <el-input-number :max="999" :min="0" size="small"
                                             v-model="mainDataFormClass.sort"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isRegion">
                        <el-form-item label="类型级别" prop="region" label-width="90px">
                            <el-select :disabled="parentNode.grade>1" placeholder="请选择"
                                       v-model="mainDataFormClass.region">
                                <el-option
                                        v-for="item in softRegions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="dialogVisibleDetails"
                   width="800px" append-to-body :close-on-click-modal="false">
            <appcation-details ref="details" :isLoad="isLoad" :activeName="activeName"
                               :mainDataForm="mainData"></appcation-details>
            <div class="ice-button-bar ">
                <el-button type="info" @click="closeDialogDetails">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="软件编辑" custom-class="ice-dialog" center :visible.sync="dialogVisibleEdit"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-form :model="mainDataForm" status-icon :rules="EditRules" ref="definition" label-width="100px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="软件名称" prop="softName">
                            <el-input v-model="mainDataForm.softName" maxlength="64" :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分类" prop="classifyId">
                            <el-cascader
                                    expand-trigger="hover"
                                    v-model="classifyId"
                                    :options="options"
                                    :props="classifyIdProps"
                                    change-on-select
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="软件版本" prop="softVersion">
                            <el-input v-model="mainDataForm.softVersion" maxlength="64"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="软件来源" prop="fromYon">
                            <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                        v-model="mainDataForm.fromYon">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="发布者" prop="keywords">
                            <el-input v-model="mainDataForm.publishAuthor" placeholder="发布者" maxlength="64"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图标" prop="softIconId">
                            <ice-image-uploader :height="85" :width="85"
                                                class="avatar-uploader"
                                                v-model="mainDataForm.softIconId">
                            </ice-image-uploader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="关键字" prop="keywords">
                            <el-input :showWordLimit="true" maxlength="128" placeholder="关键字之间用逗号间隔"
                                      v-model="mainDataForm.keywords"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="软件描述" prop="softDescribe">
                            <el-input :rows="5" :showWordLimit="true"
                                      maxlength=300 placeholder="请输入内容" ref="myTextEditor" type="textarea"
                                      v-model="mainDataForm.softDescribe"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button type="info" @click="closeDialogEdit">返回</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AppcationDetails from "./AppcationDetails"
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import ApplicationIceTreeGrid from "./ApplicationIceTreeGrid";
    import AppcationEdit from "./AppactionEdit"
    import IceSelect from "../../../components/common/base/IceSelect";
    import ApplicationClassifySelector from "./ApplicationClassifySelector";
    import fileUtil from '@/utils/fileUtil.js';
    import IceImageUploader from "../../../components/common/base/IceImageUpload";

    export default {
        name: "ApplicationHouse",
        components: {
            IceImageUploader,
            ApplicationIceTreeGrid,
            IceTreeGrid,
            IceQueryGrid,
            AppcationDetails,
            AppcationEdit,
            IceSelect,
            ApplicationClassifySelector,
            quillEditor
        },

        data() {
            let validateSoftDescribe = (rule, value, callback) => {
                let obj = document.createElement("div");
                obj.innerHTML = value;
                let val = obj.innerText;
                if (val.length > 64) {
                    callback(new Error('软件描述不能超过64个字'));
                } else if (val.length == 0) {
                    callback(new Error('软件描述不能为空'));
                } else {
                    callback();
                }
            };
            return {
                clsOptBtnEdit: true, clsOptBtnNew: true, clsOptBtnDel: true,
                query: [
                    {type: 'input', label: '名称/关键字', exp: 'like', code: 'searchKey'},
                    {
                        type: 'static', exp: 'like', value: () => {
                            return this.checkedClassifyIdPath
                        }, code: 'classifyIdPath'
                    }
                ],
                columns: [
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '关键字', code: 'keywords', hidden: true},
                    // { label: '软件版本',code: 'softVersion', hidden: true},
                    {label: '软件来源', code: 'fromYon', hidden: true},
                    {label: '软件ID', code: 'softwareId', hidden: true},
                    {label: '软件描述', code: 'softDescribe', hidden: true},
                    {label: '申请单号', code: 'afId', hidden: true},
                    {label: '软件入库类型', code: 'putType', hidden: true},
                    // { label: '部门编码',code: 'dataDeptCode', hidden: true},
                    {label: '部门ID', code: 'dataDeptId', hidden: true},
                    {label: '总流量', code: 'downloadSize', hidden: true},
                    // { label: '流量',code: 'flowTotal', hidden: true},
                    {label: '软件级别', code: 'softRegion', hidden: true},
                    {label: '软件图标ID', code: 'softIconId', hidden: true},
                    {label: '发布时间', code: 'publishDate', hidden: true},
                    // { label: '申请人',code: 'afUserName', hidden: true},
                    // { label: '申请部门',code: 'afDepartmentName', hidden: true},
                    // { label: '申请人电话',code: 'afPhone', hidden: true},
                    {label: '发布者', code: 'publishAuthor', hidden: true},
                    {label: '分类路径', code: 'classifyIdPath', hidden: true},
                    {
                        label: '名称', code: 'softName', width: 230, align: 'left', renderCell(h, data) {
                            if (data.row.softRegion == 0) {
                                return <div class="cell" style="line-height:27px;" title={data.row.softName}>
                                    <el-tag size="mini" type="danger">院</el-tag>
                                    <div
                                        style="max-width:190px;word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{data.row.softName}</div>
                                </div>;
                            }
                            return <div class="cell" title={data.row.softName}>{data.row.softName}</div>;
                        }
                    },
                    {
                        label: '所属分类', code: 'classifyNamePath', sortable: true, width: 250, align: 'left'
                    },
                    {label: '版本', code: 'softVersion', width: 100, align: 'left'},
                    {
                        label: '文件大小', code: 'softSize', width: 100, hidden: true, renderCell(h, data) {
                            return fileUtil.fileSizeFormat(data.row.softSize)
                        }
                    },
                    {
                        label: '状态', code: 'status', width: 60, renderCell(h, data) {
                            return (data.row.status == "NORMAL" ? "启用" : (data.row.status == "INVALID" ? "禁用" : ""))
                        }
                    },
                    {label: '下载次数', code: 'downloadTotal', sortable: true, width: 100},
                    {label: '更新时间', code: 'updateDate', sortable: true, width: 160},
                    {
                        label: '评分', code: 'gradeTotal', width: 100, sortable: true, renderCell(h, data) {
                            return <div style="color:rgb(255,153,0)"
                                        title={data.row.gradeTotal}>{data.row.gradeTotal}</div>;
                        }
                    }
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem},
                    {name: '批量新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItemMore},
                    {
                        name: '禁用',
                        disabled: true,
                        icon: 'el-icon-location-outline',
                        type: 'primary',
                        callback: this.forbiddenItem
                    },
                    {
                        name: '启用',
                        disabled: true,
                        icon: 'el-icon-location-outline',
                        type: 'primary',
                        callback: this.startUsingItem
                    },
                    {name: '删除', disabled: true, icon: 'el-icon-delete', type: 'primary', callback: this.deleteItem},
                    {name: '授权', icon: 'el-icon-star-on', type: 'primary', callback: this.authItem},
                    {
                        name: '更多',
                        icon: 'el-icon-plus',
                        type: 'dropdown',
                        callback: this.moreItem,
                        items: [
                            {name: '我的入库申请', code: 'intoDepot'},
                            {name: '我的升级申请', code: 'upGrade'},
                            {name: '我的更新申请', code: 'upData'},
                            {name: '我的启用/禁用申请', code: 'activeOrDisabled'},
                            {name: '我的软件授权申请', code: 'authList'},
                        ]
                    },
                ],
                operations: [
                    {name: '编辑', callback: this.editItem},
                    {name: '查看', callback: this.viewItem, dbclick: true},
                    {
                        name: '更新', callback: this.refreshItem, isShow: function (row) {
                            if (row.status == 'NORMAL') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '升级', callback: this.upgradeItem, isShow: function (row) {
                            if (row.status == 'NORMAL') {
                                return true;
                            }
                            return false;
                        }
                    },
                ],
                softRegions: [{
                    value: 1,
                    label: '所级'
                }],
                mainDataForm: {
                    'classifyIdPath': '',
                    afUserName: '',
                    afDepartmentName: '',
                    afPhone: '',
                },
                options: [],
                classifyId: [],
                classifyIdProps: {
                    value: 'oid',
                    label: 'classifyName',
                    children: 'children'
                },
                mainDataFormClass: {region: 1, sort: 0},
                valName: '',
                upDate: false,
                isChild: false,
                isLoad: false,
                dataNode: {},
                dialogVisible: false,
                dialogVisibleEdit: false,
                dialogVisibleDetails: false,
                treeItem: '',
                treeName: '',
                objItem: {},         //用于查看
                isCflySelYN: false,//是否可以选择分类院级
                parentNode: {}, //选中节点
                title: '',
                titleType: '',
                elTable: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                quillOptions: {
                    placeholder: '请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                formRules: {
                    classifyName: [{required: true, whitespace: true, message: '请输入类型名称', trigger: 'blur'}]
                },
                EditRules: {
                    softName: [{required: true, whitespace: true, message: '请输入软件名称', trigger: 'blur'}],
                    /*classifyId:[{required: true, message: '请输入所属分类', trigger: 'blur'}],*/
                    softVersion: [{required: true, whitespace: true, message: '请输入软件版本', trigger: 'blur'}],
                    keywords: [{required: true, whitespace: true, message: '请输入关键字', trigger: 'blur'}],
                    /*fromYon:[{required: true, message: '请输入软件来源', trigger: 'blur'}],*/
                    softDescribe: [{required: true, whitespace: true, message: '请输入软件描述', trigger: 'change'}]
                },
                dialogVisibleType: false,
                checkedClassifyIdPath: '',
                checkedRegion: 1,
                objTree: {},
                mainData: {},
                activeName: '',                                  /*查看页面-每次弹框展示时-显示那个tab页*/
                isManger: false,                                 /*是否为运维管理员*/
                treeData: [],                                    /*接收最新的树形数据，用来判断节点是否为第三级*/
                isNumThree: '',                                /*当前树形节点是否为第三级节点*/
                isRegion: false,                                 /*是否院级运维人员*/
            }
        },
        methods: {
            authItem(){
                this.$router.push("/biz/software/ApplicationAuth")
            },
            pagClick(data) {
                this.elTable = [];
                this.$set(this.buttons[2], 'disabled', true);
                this.$set(this.buttons[3], 'disabled', true);
                this.$set(this.buttons[4], 'disabled', true);
            },
            /**更多*/
            moreItem(code) {
                if (code == 'intoDepot') {//我的入库申请
                    this.$router.push("/biz/software/ApplicationIntoDepotManger");
                } else if (code == 'upGrade') {//我的升级申请
                    this.$router.push("/biz/software/ApplicationUpgradeManger");
                } else if (code == 'upData') {//我的更新申请
                    this.$router.push("/biz/software/ApplicationUpDataManger");
                } else if (code == 'activeOrDisabled') {//我的禁用或启用申请
                    this.$router.push("/biz/software/ApplicationActiveOrDisabledManger");
                }else if(code == 'authList'){
                    this.$router.push("/biz/software/ApplicationAuthList");
                }
            },
            /**列表多选框返回所选择的行信息*/
            handleSelectionChange(rows) {
                this.elTable = rows;
                let normalNum = 0;
                let invalidNum = 0;
                rows.forEach(item => {
                    if (item.status == 'NORMAL') {
                        normalNum++;
                    } else if (item.status == 'INVALID') {
                        invalidNum++;
                    }
                });
                if (normalNum > 0 && invalidNum == 0) {//禁用
                    this.$set(this.buttons[2], "disabled", false);
                } else {
                    this.$set(this.buttons[2], "disabled", true);
                }

                if (invalidNum > 0 && normalNum == 0) {//启用
                    this.$set(this.buttons[3], "disabled", false);
                    this.$set(this.buttons[4], "disabled", false);
                } else {
                    this.$set(this.buttons[3], "disabled", true);
                    this.$set(this.buttons[4], "disabled", true);
                }
            },
            /**点击树形节点返回相应信息*/
            handleNodeClick(data, node) {
                this.clsOptBtnEdit = this.clsOptBtnNew = this.clsOptBtnDel = false;
                this.treeItem = data;
                this.treeName = node.data.classifyName;
                this.dataNode = node.childNodes.length;
                this.isNumThree = node.data.grade;
                this.checkedClassifyIdPath = node.data.classifyIdPath;
                this.treeData = node;
                if ('0' == data) {
                    this.clsOptBtnEdit = this.clsOptBtnNew = this.clsOptBtnDel = true;
                    return;
                }
                if ('SHARE' == data || 'AUTH' == data || 'MAINTAIN' == data) {
                    this.clsOptBtnEdit = this.clsOptBtnDel = true;
                    this.clsOptBtnNew = false;
                    return;
                }
                if (0 === node.data.region) {
                    // 院级分类下
                    if (!this.isRegion) {
                        // 所级管理员不能编辑,删除
                        this.clsOptBtnEdit = this.clsOptBtnDel = true;
                        this.checkedRegion = 1;
                    } else {
                        this.checkedRegion = 0;
                    }
                } else {
                    // 所级分类隔离,不能看到其他所的目录
                    this.checkedRegion = 1;
                }
                if (node.childNodes.length > 0) {//如果有子节点则可以禁用删除与编辑
                    this.clsOptBtnEdit = this.clsOptBtnDel = true;
                }
                if (node.data.grade >= 3) {//最多3级
                    this.clsOptBtnNew = true;
                }
            },
            /**新增到树形节点*/
            addNode() {
                this.titleType = "新增类型";
                this.mainDataFormClass = {parentId: this.treeData.data.oid, region: 1, sort: 0};
                this.dialogVisibleType = true;
                this.isCflySelYN = this.treeData.data.region == null || this.treeData.data.region == 0;
                this.parentNode = this.treeData.data;
                if (this.parentNode.grade > 1) {
                    this.mainDataFormClass.region = this.parentNode.region;
                }

                if (1 == 1) return;
                // 暂时屏蔽下面代码
                if (this.treeItem) {
                    if (this.treeItem == 0) {
                        this.$message({
                            type: 'warning',
                            message: '该类型不可新增其它类型了'
                        });
                    } else {
                        if (this.isNumThree == 3) {
                            this.$message({
                                type: 'warning',
                                message: '该类型为三级节点，不可再添加了'
                            });
                        } else {
                            this.titleType = "新增类型";
                            this.dialogVisibleType = true;
                            this.mainDataFormClass = {region: 1};
                            this.upDate = false;
                        }
                    }
                } else {
                    this.$confirm('请选择要添加的层级', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                    })
                }
            },
            /**左边树形的编辑*/
            updateNode() {
                this.titleType = "编辑类型名称";
                this.mainDataFormClass = this.treeData.data;
                this.dialogVisibleType = true;
                this.isCflySelYN = this.treeData.parent.data.region == null || this.treeData.parent.data.region == 0;
                this.parentNode = this.treeData.data;
                if (this.parentNode.grade > 1) {
                    this.mainDataFormClass.region = this.parentNode.region;
                }
                if (1 == 1) return;
                if (this.treeItem) {
                    if (this.treeItem == 0 || this.treeItem == 'SHARE' || this.treeItem == 'AUTH' || this.treeItem == 'MAINTAIN') {
                        this.$message({
                            type: 'warning',
                            message: '该类型为固有节点，不可直接编辑'
                        });
                    } else {
                        this.titleType = "编辑类型名称"
                        this.$axios.get("/biz/BizSoftwareClassify/get", {"params": {"id": this.treeItem}}).then(success => {
                            this.mainDataFormClass = success.data;
                            if (this.mainDataFormClass.region == 0) {
                                this.mainDataFormClass.region = this.mainDataFormClass.region.toString();
                            }
                            this.dialogVisibleType = true;
                            this.upDate = true;
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                } else {
                    this.$confirm('请选择要编辑的层级', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                    })
                }
            },
            /**左边树形的删除*/
            deleteNode() {
                if (this.treeItem) {
                    if (this.treeItem == 0 || this.treeItem == 'SHARE' || this.treeItem == 'AUTH' || this.treeItem == 'MAINTAIN') {
                        this.$message({
                            type: 'warning',
                            message: '该类型为固有节点，不可直接删除'
                        });
                    } else {
                        this.$confirm("确定要删除 " + this.treeName + " 吗？", '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            if (!this.dataNode) {
                                this.$axios.delete("/biz/BizSoftwareClassify/del", {"params": {"id": this.treeItem}}).then(success => {
                                    this.$message.success("删除类型成功");
                                    this.$refs.multipleTable.deleteNode();
                                }).catch(error => {
                                    this.$message({
                                        type: 'error',
                                        message: error.msg
                                    })
                                });
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '该类型下还有其他类型，不可直接删除'
                                });
                            }
                        })
                    }
                } else {
                    this.$confirm('请选择要删除的层级', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /**新增类型的保存按钮*/
            save() {
                this.$refs['classifyForm'].validate((valid) => {
                    if (valid) {
                        // let obj = '';
                        // if (this.upDate) {
                        //     obj = this.mainDataFormClass.parentId
                        // } else {
                        //     obj = this.treeItem
                        // }

                        this.$axios.post("/biz/BizSoftwareClassify/saveOrUpdate", {
                            "classifyName": this.mainDataFormClass.classifyName,
                            "region": this.mainDataFormClass.region,
                            "sort": this.mainDataFormClass.sort,
                            "parentId": this.mainDataFormClass.parentId,
                            "oid": this.mainDataFormClass.oid
                        }).then(success => {
                            this.$message.success("保存类型成功");
                            this.dialogVisibleType = false;
                            if (this.mainDataFormClass.oid) {
                                this.$refs.multipleTable.updateNode(success.data);
                            } else {
                                this.$refs.multipleTable.addNode(success.data);
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
            /**新增类型的关闭按钮*/
            closeDialog() {
                this.dialogVisibleType = false;
            },
            /**右边列表---编辑--弹窗关闭按钮*/
            closeDialogEdit() {
                this.dialogVisibleEdit = false;
            },
            /**右边列表---查看--弹窗关闭按钮*/
            closeDialogDetails() {
                this.dialogVisibleDetails = false;
                this.isLoad = false;
            },
            /**软件单个入库申请--新增*/
            addItem() {
                if (this.checkedClassifyIdPath) {
                    if (this.checkedRegion != null && this.checkedRegion === 0) {
                        this.$router.push("/biz/software/applicationIntoDepot?region=0&classifyIdPath=" + this.checkedClassifyIdPath);
                    } else if (this.checkedRegion != null && this.checkedRegion === 1) {
                        this.$router.push("/biz/software/applicationIntoDepot?region=1&classifyIdPath=" + this.checkedClassifyIdPath);
                    }
                } else {
                    this.$router.push("/biz/software/applicationIntoDepot");
                }
            },
            /***批量新增*/
            addItemMore() {
                if (this.checkedClassifyIdPath) {
                    if (this.checkedRegion != null && this.checkedRegion === 0) {
                        this.$router.push("/biz/software/appcationintodepotmore?region=0&classifyIdPath=" + this.checkedClassifyIdPath);
                    } else if (this.checkedRegion != null && this.checkedRegion === 1) {
                        this.$router.push("/biz/software/appcationintodepotmore?region=1&classifyIdPath=" + this.checkedClassifyIdPath);
                    }
                } else {
                    this.$router.push("/biz/software/appcationintodepotmore");
                }
            },
            /**编辑*/
            editItem(row) {
                /*alert("如修改软件类别，级别，授权单位或者授权人员则需要走入库申请");*/
                let obj = '';
                if (row.classifyIdPath != '') {
                    obj = row.classifyIdPath.substr(0, row.classifyIdPath.indexOf("_"));
                }
                this.$axios.get("/biz/BizSoftwareClassify/tree", {
                    "params": {
                        "topId": obj,
                        "region": row.softRegion
                    }
                }).then(success => {
                    this.options = success.data[0].children;
                    this.$axios.get("/biz/BizSoftwareInfo/get", {"params": {"id": row.oid}}).then(success => {
                        this.mainDataForm = success.data;
                        this.classifyId = success.data.classifyIdPath.split("_")[success.data.classifyIdPath.split("_").length - 1];
                        this.mainDataForm.fromYon = this.mainDataForm.fromYon == null ? "请选择" : this.mainDataForm.fromYon;
                        this.dialogVisibleEdit = true;
                    });
                }).catch(error => {
                });
            },
            /**编辑弹窗的保存按钮*/
            saveEdit() {
                this.$refs.definition.validate((valid) => {
                    if (valid) {
                        this.mainDataForm.classifyId = this.classifyId[this.classifyId.length - 1];
                        this.$axios.post("/biz/BizSoftwareInfo/saveOrUpdate", this.mainDataForm).then(success => {
                            this.$message.success("编辑保存成功");
                            this.dialogVisibleEdit = false;
                            this.$refs.multipleTable.$refs.queryGrid.refresh();
                        }).catch(error => {
                            this.$message({
                                type: 'warning',
                                message: error.msg
                            });
                        });
                    }
                });
            },
            /**查看*/
            viewItem(row) {
                Object.assign(this.objItem, row);
                this.$axios.get("/biz/BizSoftwareAuthUser/getAuth", {"params": {"softwareId": row.oid}}).then(success => {
                    this.title = "软件详情";
                    let obj = {};
                    let user = '';
                    let dept = '';
                    success.data.forEach(item => {
                        if (item.type == "USER" && item.name != null) {
                            user += ',' + item.name;
                        }
                        if (item.type == "DEPT" && item.name != null) {
                            dept += ',' + item.name;
                        }
                    });
                    Object.assign(obj, success.data[0], row);
                    this.mainData = obj;
                    this.mainData.flowTotal = fileUtil.fileSizeFormat(this.mainData.downloadSize);
                    this.mainData.softSize = fileUtil.fileSizeFormat(this.mainData.softSize);
                    this.mainData.authUserNames = user.substr(1);
                    this.mainData.authDeptNames = dept.substr(1);
                    this.mainData.afDepartmentName = dept;

                    this.mainData.classType = this.mainData.classifyNamePath.split('_')[0]
                    let len = this.mainData.classifyNamePath.split('_').length - 1;
                    this.mainData.classTypePath = this.mainData.classifyNamePath.split('_')[len];
                    this.mainData.softRegion = this.mainData.softRegion == 0 ? "院级" : "所级"

                    this.activeName = "first";
                    this.isLoad = true;

                    let paths = {
                        'NORMAL': 'BizSoftwareAuditPutAf', 'ACTIVE': 'BizSoftwareAuditOptAf'
                        , 'INSTALL': 'BizSoftwareAuditInstallAf', 'UPGRADE': 'BizSoftwareAuditUpdateAf'
                    };
                    let path = paths[this.mainData.putType];
                    if (this.mainData.softwareId) {
                        path = paths['UPGRADE'];
                    }
                    if (typeof (path) != 'string') {
                        this.dialogVisibleDetails = true;
                        return false;
                    }

                    return this.$axios.get("/biz/" + path + "/get", {"params": {"id": this.mainData.afId}});
                }).then(success => {
                    Object.assign(this.mainData, success.data, this.objItem);
                    this.dialogVisibleDetails = true;
                })

            },
            /**更新*/
            refreshItem(row) {
                this.$router.push("/biz/software/applicationupdata?ids=" + row.oid);
            },
            /**升级*/
            upgradeItem(row) {
                this.$router.push("/biz/software/applicationupgrade?ids=" + row.oid);
            },
            /**禁用*/
            forbiddenItem() {
                /*alert("逻辑删除，需要走申请，禁用之后管理员可见其记录");*/
                let rows = this.$refs.multipleTable.$refs.queryGrid.getSelections();
                let ids = '';
                rows.forEach((item, index) => {
                    ids += item.oid;
                    if (index < rows.length - 1) {
                        ids += ',';
                    }
                });
                this.$router.push("/biz/software/applicationdelete?ids=" + ids);
            },
            /**启用*/
            startUsingItem() {
                let rows = this.$refs.multipleTable.$refs.queryGrid.getSelections();
                let ids = '';
                rows.forEach((item, index) => {
                    ids += item.oid;
                    if (index < rows.length - 1) {
                        ids += ',';
                    }
                });
                this.$router.push("/biz/software/applicationActiveMore?ids=" + ids);
            },
            /**删除*/
            deleteItem() {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {

                    if (this.elTable.length != 0) {
                        let id = '';
                        this.elTable.forEach(item => {
                            if (this.elTable.length == 1) {
                                id = item.oid;
                            } else {
                                if (item != this.elTable[this.elTable.length - 1]) {
                                    id += item.oid + ',';
                                } else {
                                    id += item.oid;
                                }
                            }
                        });
                        this.$axios.delete("/biz/BizSoftwareInfo/del", {"params": {"id": id}}).then(success => {
                            this.$message.success(success.data ? success.data : '删除成功');
                            this.$refs.multipleTable.$refs.queryGrid.refresh();
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                })

            },
            classifyIdChange(item) {
                this.$set(this.mainDataForm, 'classifyId', '');
                this.$set(this.bizData, 'classifyId', item[item.length - 1]);
            },
        },
        mounted() {
            /*let a = this.$userInfo;*/
            this.$axios.get("/biz/BizSoftwareConstant/auth/user").then(success => {
                /**是否运维管理员*/
                this.isManger = success.data.is_admin;
                /**是否院级运维人员*/
                this.isRegion = success.data.is_global;
                if (success.data.is_admin == false && success.data.is_maintain == false) {
                    this.$message.warning("没有软件管理权限");
                }
                if (success.data.is_global) {
                    this.softRegions.push({
                        value: 0,
                        label: '院级'
                    })
                }
            });
        }
    }
</script>

<style lang="less" scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .editor-wrapper {
        display: flex;
        flex-direction: column;

        .button-area {
            display: flex;
            justify-content: flex-end;
        }

    }

    .nml-btn {
        color: black;
    }

    .dis-btn {
        color: rgb(189, 189, 189);
    }

    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;
    }
</style>
<template>
    <div class="ice-container">
        <el-container>
            <el-aside width="250px" style="position: relative">
                <el-card class="ice-full-absolute">
                    <ice-tree :load-url="treeUrl"
                              label-prop="name"
                              value-prop="code"
                              node-key="oid"
                              style="height: 526px"
                              @node-click="handleCallbackTree"
                              :lazy="false"
                              ref="tree"
                    >
                        <!--                        <div style="display: flex;justify-content:space-around" slot="prefix">-->
                        <!--                            <el-button icon="el-icon-circle-plus" type="text" style="color: #98FB98"-->
                        <!--                                       @click="handleToAddProject">-->
                        <!--                                <span style="color: #222222">新增</span>-->
                        <!--                            </el-button>-->
                        <!--                            <el-button icon="el-icon-edit-outline" type="text" style="color: #4027FF"-->
                        <!--                                       @click="handleToEditProject">-->
                        <!--                                <span style="color: #222222">编辑</span>-->
                        <!--                            </el-button>-->
                        <!--                            <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteNode">-->
                        <!--                                <span style="color: #222222">删除</span>-->
                        <!--                            </el-button>-->
                        <!--                        </div>-->
                    </ice-tree>
                </el-card>
            </el-aside>
            <el-main class="main">
                <ice-query-grid :data-url="fileUrl"
                                :query="query"
                                :columns="columns"
                                :buttons="buttons"
                                :operations="operations"
                                chooseItem="multiple"
                                ref="grid"
                                :operationsWidth="width"
                                :cusCheckedMethod="checkMethod"
                                @selection-change="selectionChange">
                    <template v-slot:operation-bar-expand>
                        <div style="margin-left: 5px;" v-if="!isAddBtnShow">
                            <ice-single-upload v-model="fileInfo.dataid" :on-success="fileUploadSuccess"
                                               ref="fileUpload" :doSecret="true"></ice-single-upload>
                        </div>
                        <div style="margin-left: 5px;" v-else>
                            <el-button type="primary" @click="addFile" v-if="!(jhdata&&jhdata.oid)">添加附件
                            </el-button>
                            <el-button type="success" @click="toFlow" :disabled="isFlowDisabled">发起审批</el-button>
                        </div>
                    </template>
                </ice-query-grid>
            </el-main>
        </el-container>
        <ice-dialog :title="title" :visible.sync="visible" height="200px" width="500px">
            <!--                <el-form :v-loading="loading" :model="formWjjModel" status-icon :rules="folderRules" ref="definition" label-width="140px">-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="文件夹编码" label-width="140px" prop="filecode">-->
            <!--                            <el-input v-model="formWjjModel.filecode" placeholder="自动生成" readonly disabled></el-input>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="文件夹名称" label-width="140px" prop="filename">-->
            <!--                            <el-input v-model="formWjjModel.filename" placeholder="请输入" :disabled="disabled"></el-input>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row :gutter="20" v-if="!formWjjModel.oid">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="是否根目录" label-width="140px" prop="pid">-->
            <!--                            <el-select v-model="selectValue" placeholder="请选择">-->
            <!--                                <el-option-->
            <!--                                        v-for="item in RootDirectoryOrNot"-->
            <!--                                        :key="item.value"-->
            <!--                                        :label="item.label"-->
            <!--                                        :value="item.value">-->
            <!--                                </el-option>-->
            <!--                            </el-select>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row>-->
            <!--                    <div class="ice-button-bar">-->
            <!--                        <el-button type="primary" @click="confirm" >确认</el-button>-->
            <!--                        <el-button type="info" @click="visible=false">返回</el-button>-->
            <!--                    </div>-->
            <!--                </el-row>-->
            <!--            </el-form>-->
        </ice-dialog>

        <ice-dialog :title="fileTitle" :visible.sync="loadVisible" height="220px" width="520px">
            <!--            <el-form :model="formModel" ref="loadForm" :rules="loadRules" v-loading="upLoading">-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="文档编码" label-width="140px" prop="filecode">-->
            <!--                            <el-input v-model="formModel.filecode" placeholder="自动生成" readonly :disabled="loadDisabled"></el-input>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="文档类型" label-width="140px" prop="filetype">-->
            <!--                            <ice-select v-model="formModel.filetype" placeholder="请选择" :map-type-code="this.menuType" :disabled="loadDisabled"></ice-select>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--&lt;!&ndash;                <el-row :gutter="20">&ndash;&gt;-->
            <!--&lt;!&ndash;                    <el-col :span="20">&ndash;&gt;-->
            <!--&lt;!&ndash;                        <el-form-item label="文档版本" label-width="140px" prop="version">&ndash;&gt;-->
            <!--&lt;!&ndash;                            <el-input v-model="formModel.version" placeholder="请输入" :disabled="loadDisabled"></el-input>&ndash;&gt;-->
            <!--&lt;!&ndash;                        </el-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;                    </el-col>&ndash;&gt;-->
            <!--&lt;!&ndash;                </el-row>&ndash;&gt;-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">-->
            <!--                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"  autocomplete="off" :disabled="loadDisabled"></ice-select>-->
            <!--                        </el-form-item>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row :gutter="20">-->
            <!--                    <el-col :span="20">-->
            <!--                        <ice-single-upload  v-model="fileInfo.dataid" :on-success="fileUploadSuccess" ref="fileUpload2" :doSecret="true"></ice-single-upload>-->
            <!--                    </el-col>-->
            <!--                </el-row>-->
            <!--                <el-row>-->
            <!--                    <div class="ice-button-bar">-->
            <!--                        <el-button type="primary" :disabled="loadDisabled" @click="fileConfirm">确认</el-button>-->
            <!--                        <el-button type="info" @click="loadVisible=false">返回</el-button>-->
            <!--                    </div>-->
            <!--                </el-row>-->
            <!--            </el-form>-->
        </ice-dialog>
        <!--<ice-dialog title="添加文件" :visible.sync="addFileVisible" width="1000px">-->
        <!--<div v-loading="loading">-->
        <!--<div>-->
        <!--<file-common :oidType="oidType" ref="fileCommon" :jhdata="jhdata.isAdd?jhdata:{}"></file-common>-->
        <!--</div>-->
        <!--<div class="ice-button-bar">-->
        <!--<el-button type="primary" @click="fileConfirm">确认</el-button>-->
        <!--<el-button type="info" @click="addFileVisible=false">关闭</el-button>-->
        <!--</div>-->
        <!--</div>-->

        <!--</ice-dialog>-->
        <ice-dialog title="附件" :visible.sync="attachmentVisible" width="800px">
            <div>
                <ATTACHMENT
                        :isHandleer=false :data="queryListFiles"
                        ref="pmsXmRwFjListXmsr1"></ATTACHMENT>

                <div class="ice-button-bar">
                    <el-button type="info" @click="attachmentVisible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    // import IceCustomTree from '../../../components/common/pms/IceCustomTree';
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid';
    import IceTree from "../../../components/common/base/IceTree";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import {SBZT, SPZT, WDLX, WJBB} from "../../../utils/constant";
    import fileCommon from './fileCommon';
    import docConstants from '../../../utils/docConstants'
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import dateCusSelect from "../../pms/xmgl/components/dateCusSelect";


    export default {
        name: "wjgl",
        mixins: [codeConfigRequest, docConstants],
        components: {
            // IceCustomTree,
            IceQueryGrid,
            IceTree,
            IceDialog,
            IceSingleUpload,
            IceSelect,
            moment,
            fileCommon,
            ATTACHMENT
        },
        props: {
            constantCode: String,
            // 判定是否需要展示添加按钮
            isAddBtnShow: {
                default: false
            },
            // jhOid
        },
        computed: {
            fileUrl() {
                return "/pms/QisFileinfo/listFile?oidType=" + this.param;
            },
            // folderUrl(){
            //     return "/pms/QisFileinfo/listFolder?oidType=" + this.oidType;
            // },
            userInfo() {
                return this.$userInfo;
            },
            treeUrl() {
                if (this.oidType) {
                    return '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidType;
                } else {
                    return '#';
                }
            },
            // 判定是否能发起审批
            isFlowDisabled() {
                let jhCodes = [];
                let bmCodes = [];
                this.gridSelectRow.map(c => {
                    if (jhCodes.indexOf(c.zljhCode) == -1) {
                        jhCodes.push(c.zljhCode);
                    }
                    if (bmCodes.indexOf(c.depRelCode) == -1) {
                        bmCodes.push(c.depRelCode);
                    }
                })
                if (jhCodes.length == 1 && bmCodes.length == 1) {
                    return false;
                } else {
                    return true;
                }
            },
            // 获取计划数据
            jhdata() {
                if (this.$route.query.jhdata) {
                    return JSON.parse(this.$route.query.jhdata);
                } else {
                    return {}
                }
            },

        },
        watch: {
            jhdata() {
                this.$refs.grid.refresh();
            }
        },
        created() {
            this.initOidType();
        },
        mounted() {
            if (this.jhdata.isAdd) {
                console.log("执行次数")
                this.addFile();
            }
        },
        data() {
            return {
                queryListFiles: [],
                attachmentVisible: false,
                addFileVisible: false,
                oidType: '',
                param: '',
                isLastSelected: false,//是否上次选中子节点
                width: 220,
                unbrid: true,
                gridSelectRow: [],
                treeSelectFolderId: '',
                visible: false,
                title: '',
                fileTitle: '',
                loading: false,
                disabled: true,
                loadVisible: false,
                upLoading: false,
                loadDisabled: true,
                fileInfo: {},
                treeSelectedNode: {},
                isAdd: true,
                RootDirectoryOrNot: [
                    {
                        label: '否',
                        value: 1,
                    },
                    {
                        label: '是',
                        value: 0,
                    },
                ],
                selectValue: '',
                formWjjModel: {
                    filecode: '',
                    filename: '',
                    oid: '',
                    pid: '',
                    children: []
                },
                formModel: {
                    oid: '',
                    pid: '',//父ID
                    filetype: '',//文档类型
                    filecode: '',//文档编码
                    filename: '',//文档名称
                    version: '',//文档版本
                    filefbrq: '',//发布日期
                    filescrq: '',//上传日期
                    filesize: '',//文档大小
                    dataSecretLevcode: '',//文档密级
                    filezt: '',//文档状态
                    isfolder: 1,//是否是文件夹(1.代表文件夹，0.代表文件)
                    oidType: '',//菜单类型
                    dataid: '',//文件数据ID
                },
                aaa: '',
                query: [
                    // {type: 'static', code: 'oidType', value: ''},
                    {type: 'static', code: 'filetype', value: ''},
                    {
                        type: 'static', code: 'oidZljh', exp: '=', value: () => {
                            console.log(this.jhdata, '546516546' +
                                '53168456132')
                            return this.jhdata.oid
                        }
                    },
                    {
                        type: 'static', code: 'depRelCode', exp: '=', value: () => {
                            return this.jhdata.depCode
                        }
                    },
                    {type: 'input', code: 'filecode', label: '文档编码', value: ''},
                    {type: 'input', code: 'filename', label: '文档名称', value: ''},
                    {type: 'input', code: 'filescr', label: '上传人员', value: ''},
                    {type: 'input', code: 'scrcode', label: '上传人编号', value: ''},
                    {type: 'date', code: 'filescrq', label: '上传日期', value: ''},
                    {type: 'date', code: 'filefbrq', label: '发布日期', value: ''},
                    {type: 'select', code: 'filezt', label: '文档状态', value: '', mapTypeCode: "DOCZT"},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'pid', hidden: true},
                    {label: '文档状态', code: 'filezt', mapTypeCode: 'DOCZT', width: 100, sortable: true},
                    {
                        label: '文件版本',
                        code: 'fileVersion',
                        value: 0,
                        width: 100,
                        sortable: true,
                        mapTypeCode: "QIS_TXWJBB"
                    },
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    // {label: '文档类型', code: 'filetype', mapTypeCode:this.menuType ,width: 200,},
                    {label: '文档编码', code: 'filecode', width: 100, sortable: true},
                    {label: '文档名称', code: 'filename', width: 200, sortable: true},
                    {label: '文档类型', code: 'filetype', hidden: true, sortable: true},
                    {label: '文档版本', code: 'version', width: 100, sortable: true},
                    {
                        label: '发布日期', code: 'filefbrq', sortable: true, width: 150, formatter(row) {
                            return row.filefbrq === null ? null : moment(row.filefbrq).format('YYYY-MM-DD');
                        }
                    },
                    {
                        label: '上传日期', sortable: true, code: 'filescrq', width: 150, formatter(row) {
                            return row.filescrq === null ? null : moment(row.filescrq).format('YYYY-MM-DD');
                        }
                    },
                    {label: '上传人员', code: 'filescr', width: 100, sortable: true},
                    {label: '上传人ID', code: 'oidScr', width: 100, hidden: true, sortable: true},
                    {label: '上传人编号', code: 'scrcode', width: 100, hidden: true, sortable: true},
                    {label: '文件大小(B)', code: 'fileSize', width: 100, sortable: true},
                    {
                        label: '文档密级',
                        code: 'dataSecretLevcode',
                        mapTypeCode: 'DATA_SECRET_LEVEL',
                        width: 100,
                        sortable: true
                    },
                    {label: '上报状态', code: 'sbzt', width: 100, sortable: true, mapTypeCode: "SBZT"},
                    {label: '审批状态', code: 'spzt', width: 100, sortable: true, mapTypeCode: "SPZT"},
                    {label: '是否是文件夹', code: 'isfolder', value: 0, width: 200, hidden: true, sortable: true},

                    {label: '文件数据ID', code: 'dataid', width: 200, hidden: true, sortable: true},
                    {label: '菜单类型oid', code: 'oidType', width: 200, hidden: true, sortable: true},
                    {label: '部门名称', code: 'depRelName', width: 200, hidden: true, sortable: true},
                    {label: '部门oid', code: 'oidDepRel', width: 200, hidden: true, sortable: true},
                    {label: '计划oid', code: 'oidZljh', width: 200, hidden: true, sortable: true},
                    {label: '主附件', code: 'main', width: 200, hidden: true, sortable: true},
                ],
                buttons: [
                    // {name: '上传', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BUPLOAD", callback: this.up},
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-right',
                        type: 'primary',
                        ctrlCode: "BSX",
                        callback: this.buttonRefresh
                    },
                ],
                operations: [
                    // {name: '浏览', callback: this.browse, ctrlCode: "BLL", isShow:this.isShowBrowse},
                    // {name: '编辑', callback: this.edit, ctrlCode: "BBJWJ", isShow:this.isShowEdit},
                    {name: '删除', callback: this.del, ctrlCode: "BSCWJ", isShow: this.isShowDel},
                    {name: '发布', callback: this.release, ctrlCode: "BFBWD", isShow: this.isShowRelease},
                    {name: '启用', callback: this.enable, ctrlCode: "BQY", isShow: this.isShowEnable},
                    {name: '停用', callback: this.stop, ctrlCode: "BTY", isShow: this.isShowStop},
                    {name: '下载', callback: this.down, ctrlCode: "BWJXZ"},
                    {name: '查看', callback: this.lookFile, ctrlCode: "BWJXZ"},
                    {name: '附件', callback: this.attachment, ctrlCode: "BWJXZ"},
                ],
                folderRules: {
                    // filetype: [
                    //     { required: true, message: '文档类型不能为空'}
                    // ],
                },
                loadRules: {
                    // filetype: [
                    //     { required: true, message: '文档类型不能为空'}
                    // ],
                },
            }
        },
        methods: {
            // 查看子附件
            attachment(row) {
                this.$axios.get("/pms/QisFileinfo/listFile2", {
                    params: {
                        dataid: row.dataid,
                    }
                }).then(resault => {
                    this.queryListFiles = resault.data;
                }).catch(error => {
                    this.$message.error(error.msg)
                })
                this.attachmentVisible = true;
            },
            // 审批发文稿
            toFlow() {
                this.$router.push({
                    name: "/qis/wjgl/wjglFlow", params: {
                        data: this.gridSelectRow
                    }
                })
            },
            // 是否允许勾选的方法
            checkMethod({row}) {
                return row.fileVersion == WJBB.FWG ? (row.sbzt == SBZT.YSB ? false : true) : false;
            },
            // 确定上传附件
            confirmUpload() {
                console.log(this.$refs.fileCommon.getData());
                let data = this.$refs.fileCommon.getData();
                this.$axios.post("/pms/QisFileinfo/saveOrUpdate", data).then(result => {
                    this.$message.success("保存成功!");
                    this.$refs.tree.refresh();
                    this.visible = false;
                    this.disabled = true;
                }).catch(error => {
                    this.$message.error("保存失败!");
                }).finally(_ => {
                    this.loading = false;
                })
            },
            addFile() {
                // 页面加载完弹窗处理
                let obj = {
                    type: this.constantCode
                }
                this.$router.push({
                    name: "/qis/wjgl/addFile", query: {
                        jhdata: JSON.stringify(obj)
                    }
                });
            },
            async initOidType() {
                await   this.$axios.get("/permission/app_constant/byCode", {
                    params: {
                        appCode: 'PMS',
                        code: this.constantCode,
                    }
                }).then(resault => {
                    if (resault.data != null) {

                        this.oidType = resault.data.value;
                        console.log(this.oidType, 'console.log(this.oidType)')
                    } else {
                        this.$message.error("初始化数据字典oid失败！请确保是否配置了" + this.constantCode + "常量！")
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            // 获取文件夹编码
            getCodeWjj() {
                this.loadProjectCode({name: 'wjglWjj'}).then(res => {
                    this.formWjjModel.filecode = res.number;
                })
            },
            // 获取文档编码
            getCodeWd() {
                this.loadProjectCode({name: 'wjglWd'}).then(res => {
                    this.formModel.filecode = res.number;
                })
            },
            handleCallbackTree(code, node) {
                // console.log(code);
                // console.log(node);
                this.treeSelectFolderId = code;
                if (!node.parent.key) {
                    //根节点
                    console.log('根节点');
                    this.isLastSelected = false;
                    this.param = this.oidType;
                    this.query[0].value = '';

                } else {
                    //子节点
                    console.log('子节点');
                    this.param = '';
                    console.log(code)
                    this.query[0].value = code;
                    if (this.isLastSelected) {
                        this.$refs.grid.refresh();
                    }
                    this.isLastSelected = true;
                }
            },
            selectionChange(row) {
                console.log(row);
                this.gridSelectRow = row;
            },
            //获取附件
            getFJ(row) {
                // console.log(row);
                this.fileInfo.filename = row.filename
                this.fileInfo.dataid = row.dataid
                // console.log(this.fileInfo);
            },
            /**
             * 未发布 DOCZT10
             * 发布 DOCZT30
             * 停用 DOCZT50
             */
            isShowBrowse(row) {
                if (row.filezt != WDLX.WFB) {
                    return true;
                }
            },
            isShowEdit(row) {
                if (row.filezt === WDLX.WFB) {
                    return true;
                }
            },
            isShowDel(row) {

                if (row.filezt === WDLX.WFB && row.sbzt != SBZT.YSB) {
                    return true;
                }
            },
            isShowRelease(row) {
                if (row.filezt === WDLX.WFB && ((row.fileVersion == WJBB.FWG && row.spzt == SPZT.YSP) || (row.fileVersion != WJBB.FWG))) {

                    return true;
                }
            },
            isShowEnable(row) {
                if (row.filezt === WDLX.ZF) {
                    return true;
                }
            },
            isShowStop(row) {
                if (row.filezt === WDLX.YFB) {
                    return true;
                }
            },
            isShowDown(row) {
                if (row.filezt != WDLX.WFB) {
                    return true;
                }
            },
            clearFormModel() {
                // console.log('清理数据')
                for (let key in this.formModel) {
                    this.formModel[key] = '';
                }
                this.formModel.menutype = this.menuType;
                // console.log('清除后的数据：',this.formModel)
            },
            up() {
                if (!this.treeSelectFolderId) {
                    this.$message.warning("请选择文件夹！");
                    return;
                }
                this.fileTitle = '文档上传';
                this.fileInfo = {};
                // this.formModel.dataSecretLevcode = 2;
                this.loadDisabled = false;
                this.loadVisible = true;
                console.log(this.formModel)
                this.$nextTick(_ => {
                    // this.$refs.loadForm.resetFields();
                    this.clearFormModel();
                    this.getCodeWd();
                    this.$refs.fileUpload.reset();
                })

            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            handleToAddProject() {
                // this.title = '新增目录';
                // this.visible = true;
                // this.disabled = false;
                // this.selectValue = 1;
                // this.isAdd = true;
                // this.$nextTick(_=>{
                //     this.$refs.definition.resetFields()
                //     this.formWjjModel = {filecode: ''}
                //     this.getCodeWjj();
                // })
            },
            handleToEditProject() {
                // if(this.treeSelectedNode){
                //     this.formWjjModel = JSON.parse(JSON.stringify(this.treeSelectedNode));
                //     console.log(this.formWjjModel, 'wjj')
                //     this.getSingle(this.formWjjModel);
                //     this.title = '编辑目录';
                //     this.visible = true;
                //     this.disabled = false;
                //     this.isAdd = false;
                //     if(this.formWjjModel.pid === '0'){
                //         this.selectValue = 0;
                //     }else {
                //         this.selectValue = 1;
                //     }
                // }
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisFileinfo/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formWjjModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            deleteNode(data) {
                // console.log(this.treeSelectedNode)
                // if(this.treeSelectedNode){
                //     if(this.treeSelectedNode.children.length > 0){
                //         this.$message.warning("文件夹下有子文件夹，不能删除！");
                //         return;
                //     }
                //     // console.log(this.$refs.grid);
                //     // console.log(this.$refs.grid.gridDataList.length);
                //     if(this.$refs.grid.gridDataList.length > 0){
                //         this.$message.warning("文件夹下存放有文档，不能删除！");
                //         return;
                //     }
                //   this.$confirm('是否确认删除', '提示', {
                //     confirmButtonText: '确认',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                //   }).then(() => {
                //     this.$axios.delete("/pms/QisFileinfo/del",{params: {id: this.treeSelectFolderId}})
                //       .then(result =>{
                //         this.$message.success("删除成功！")
                //         this.$refs.tree.refresh();
                //       })
                //       .catch(error =>{
                //         this.$message.error("删除失败！")
                //       })
                //   }).catch(()=>{
                //     console.log('取消成功')
                //   })
                //
                // }
            },
            confirm() {
                if (this.isAdd) {
                    this.addConfirm();
                } else {
                    this.editConfirm();
                }
            },
            //新增文件夹
            addConfirm() {
                this.formWjjModel.scrcode = this.userInfo.userCode;
                this.formWjjModel.filescr = this.userInfo.userName;
                this.formWjjModel.oidScr = this.userInfo.userId;
                this.formWjjModel.dataSecretLevcode = 2;
                this.formWjjModel.isfolder = 1;
                this.fillData();
                // console.log(this.formModel);
                // return;
                this.loading = true;
                this.$axios.post("/pms/QisFileinfo/saveOrUpdate", this.formWjjModel).then(result => {
                    this.$message.success("保存成功!");
                    this.$refs.tree.refresh();
                    this.visible = false;
                    this.disabled = true;
                }).catch(error => {
                    this.$message.error("保存失败!");
                }).finally(_ => {
                    this.loading = false;
                })
            },
            //修改文件夹
            editConfirm() {
                this.loading = true;
                this.$axios.post("/pms/QisFileinfo/updateFolderName", this.formWjjModel)
                    .then(result => {
                        this.$message.success("修改成功！");
                        this.$refs.tree.refresh();
                        this.visible = false;
                        this.disabled = true;
                    })
                    .catch(error => {
                        this.$message.error("修改失败！");
                    }).finally(_ => {
                    this.loading = false;
                })
            },
            //保存文件
            fileConfirm() {
                // let a = this.$refs.fileCommon.formValidate();
                this.$refs.fileCommon.formValidate().then(v => {
                    let data = this.$refs.fileCommon.getData();
                    this.formModel.scrcode = this.userInfo.userCode;
                    this.formModel.filescr = this.userInfo.userName;
                    this.formModel.oidScr = this.userInfo.userId;
                    // this.formModel.pid = this.treeSelectFolderId;
                    // console.log(!this.formModel.pid)
                    // return;
                    if (!this.formModel.oid) {
                        //新增的话
                        // this.formModel.isfolder = 0;
                        this.formModel.filescrq = new Date();
                        this.formModel.filezt = 'DOCZT10';
                        this.formModel.version = 1;
                        // this.formModel.dataSecretLevcode = 2;
                        this.formModel.filetype = this.treeSelectFolderId;
                        this.formModel.oidType = this.oidType;
                    } else {
                        //修改
                        // this.formModel.filescrq = new Date();
                        // this.formModel.version = this.formModel.version + 1;
                    }
                    // console.log(this.fileInfo.filename)
                    // this.formModel.filename = this.fileInfo.filename;
                    // this.formModel.dataid = this.fileInfo.dataid;
                    // this.formModel.filesize = this.fileInfo.fileSize;
                    // console.log(this.formModel)
                    // return

                    let arr = [];
                    data.forEach(c => {
                        c = {...this.formModel, ...c};
                        arr.push(c);
                    })
                    console.log(arr, 'arr');
                    this.loading = true;
                    // return;
                    this.$axios.post("/pms/QisFileinfo/saveOrUpdate", {fileinfoVoList: arr})
                        .then(result => {
                            this.$message.success("保存成功!");
                            this.$refs.grid.refresh();
                            this.addFileVisible = false;
                            // this.loadVisible = false;
                            // this.loadDisabled = true;
                        }).catch(error => {
                        this.$message.error("保存失败!");
                    }).finally(() => {
                        this.loading = false;
                    })
                }).catch(v => {
                    console.log(v, 'v')
                })

            },
            fillData() {
                //选择否
                if (this.selectValue === 1) {
                    this.formWjjModel.pid = this.treeSelectFolderId;
                    // console.log('前：' + this.formWjjModel.pid)
                    if (!this.formWjjModel.pid) {
                        this.formWjjModel.pid = '0';
                    }
                    // console.log('后：' + this.formWjjModel.pid)
                } else {
                    this.formWjjModel.pid = this.selectValue;
                }
                this.formWjjModel.menutype = this.menuType;
            },
            //保存文件
            fileConfirm1(){
                // if(!this.fileInfo.filename){
                //     this.$message.warning("请上传文件！");
                //     return;
                // }
                this.formModel.scrcode = this.userInfo.userCode;
                this.formModel.filescr = this.userInfo.userName;
                this.formModel.oidScr = this.userInfo.userId;
                // this.formModel.pid = this.treeSelectFolderId;
                // console.log(!this.formModel.pid)
                // return;
                if(!this.formModel.oid){
                    //新增的话
                    // this.formModel.isfolder = 0;
                    this.formModel.filescrq = new Date();
                    this.formModel.filezt = 'DOCZT10';
                    this.formModel.version = 1;
                    // this.formModel.dataSecretLevcode = 2;
                    this.formModel.filetype = this.treeSelectFolderId;
                    this.formModel.oidType = this.oidType;
                }else {
                    //修改
                    // this.formModel.filescrq = new Date();
                    // this.formModel.version = this.formModel.version + 1;
                }
                // console.log(this.fileInfo.filename)
                this.formModel.filename = this.fileInfo.filename;
                this.formModel.dataid = this.fileInfo.dataid;
                this.formModel.filesize = this.fileInfo.fileSize;
                this.formModel.main = 1;
                // console.log(this.formModel)
                // return
                console.log(this.formModel);
                // return;
                this.$axios.post("/pms/QisFileinfo/saveOrUpdate",{fileinfoVoList: [this.formModel]})
                    .then(result =>{
                        this.$message.success("保存成功!");
                        this.$refs.grid.refresh();
                        // this.loadVisible = false;
                        // this.loadDisabled = true;
                    }).catch(error =>{
                    this.$message.error("保存失败!");
                })
            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {
                    filename: file.name,
                    fileSize: file.size,
                    dataid: response.data,
                    dataSecretLevcode: response.securityLevel,
                    main: 0
                };
                this.fileInfo = record;
                this.clearFormModel();
                this.formModel.dataSecretLevcode = response.securityLevel;
                console.log(file)
                this.fileConfirm1();
                this.$refs.fileUpload.reset()
            },
            //浏览
            browse(row) {
                this.fileTitle = '浏览文档';
                this.loadDisabled = true;
                this.loadVisible = true;
                this.fileInfo = {};
                // console.log(row)
                this.$nextTick(_ => {
                    this.$refs.loadForm.resetFields();
                    this.formModel = {...row}
                })
                this.getFJ(row);
            },
            //编辑
            edit(row) {
                // console.log(this.$refs.grid)
                this.fileTitle = '编辑文档';
                this.loadDisabled = false;
                this.loadVisible = true;
                this.fileInfo = {};
                // console.log(row)
                this.$nextTick(_ => {
                    this.$refs.loadForm.resetFields();
                    this.formModel = {...row}
                })
                this.getFJ(row);
            },
            //删除
            del(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.$axios.delete("/pms/QisFileinfo/del", {params: {id: row.oid}})
                        .then(data => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        }).catch(error => {
                        this.$message.error("删除失败");
                    })
                })
            },
            //发布
            release(row) {
                // row.filefbrq = new Date();
                this.updateFilezt(row, WDLX.YFB, '发布', new Date())
            },
            //启用
            enable(row) {
                this.updateFilezt(row, WDLX.YFB, '启用', null)
            },
            //停用
            stop(row) {
                this.updateFilezt(row, WDLX.ZF, '停用', null)
            },
            //下载
            down(row) {
                this.$downloadFile(row.dataid);
            },
            updateFilezt(row, zt, msg, filefbrq) {
                this.$axios.post("/pms/QisFileinfo/updateStatus", {id: row.oid, zt: zt, filefbrq: filefbrq})
                    .then(data => {
                        this.$message.success(msg + "成功!");
                        this.$refs.grid.refresh();
                    }).catch(error => {
                    this.$message.error(msg + "失败！");
                })
            },
        },
    }
</script>

<style scoped>

</style>

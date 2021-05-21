<template>
    <div class="ice-container">
        <ice-query-grid
                :data-url="dataUrl"
                exportTitle="生产项目库"
                :operations-width="250"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                chooseItem="single"
                :operations="operations"
                @selection-change="handleSectItem"
                ref="grid">
            <div slot="operation-bar-expand" style="margin-left: 15px;">
                <!--<ice-select @changevalue="xmztChange" clearable v-model="ZT" map-type-code="XMZT"-->
                <!--:disabled="formReadonly"></ice-select>-->
                <el-select v-model="ZT" clearable placeholder="请选择" @change="xmztChange">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </ice-query-grid>
        <ice-dialog title="生产项目库编辑" :visible.sync="visible" width="1000px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产项目编码" label-width="110px" prop="xmcode">
                            <el-input v-model="formModel.xmcode" readonly placeholder="自动生成"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目名称" label-width="110px" prop="xmname">
                            <el-input maxlength="80" v-model="formModel.xmname" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="外部项目编码" label-width="110px" prop="xmcodeSw">
                            <el-input v-model="formModel.xmcodeSw" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="立项时间" label-width="110px" prop="gmtLx">
                            <el-date-picker v-model="formModel.gmtLx" type="date" placeholder="请选择"
                                            :picker-options="pickerOptions(1)"
                                            :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目来源" label-width="110px" prop="xmly">
                            <pms-select-tree :disabled="formReadonly" v-model="formModel.xmly" :isemptyBtn="isemptyBtn"
                                             :showChecked="showChecked"
                                             :unbrid="unbrid"
                                             :treeData="treeData"
                                             :iscanLevel1=false
                                             :transfer="transferTree.treeData"
                                             trigger="click"
                                             @select-xmly="lyy=>{formModel.xmlyName=lyy.name}"
                            >
                            </pms-select-tree>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="主管部门" label-width="110px" prop="xmzgbmCode">
<!--                            <ice-dept-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'"-->
<!--                                               v-model="formModel.xmzgbm"-->
<!--                                               @select-confirm="depts=>deptSelect(depts)"-->
<!--                                               :disabled="formReadonly"></ice-dept-selector>-->

                            <ice-select :disabled="formReadonly" v-model="formModel.xmzgbmCode"
                                        map-type-code="ZGBM" filterable
                                        @changevalue = "deptSelect2"
                                        placeholder="请选择"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="完结日期" label-width="110px" prop="finishDate">
                            <el-date-picker v-model="formModel.finishDate" type="date" placeholder="请选择"
                                            :picker-options="pickerOptions(2)"
                                            :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="项目成员" name="first">
                                    <div class="hint">项目主管、项目负责人、行政负责人、技术负责人是必选角色</div>
                                    <pms-sect-member :isFirstNameChange="true" :disabled="formReadonly"
                                                     ref="pmssectMember"
                                                     :queryListXmcy="queryListXmcy"></pms-sect-member>
                                </el-tab-pane>
                                <el-tab-pane label="项目附件">
                                    <ATTACHMENT :controlMj="controlMj" :isHandleer="!formReadonly" :data="attaTableData"
                                                ref="attachment"></ATTACHMENT>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                        <!-- <el-tabs v-model="activeName">
                            <el-tab-pane label="项目成员" name="first">
                                <el-button type="primary">添加成员</el-button>
                                <vxe-table
                                        size="mini"
                                        :data="tableData">
                                    <vxe-table-column type="index" width="60"></vxe-table-column>
                                    <vxe-table-column field="name" title="Name"></vxe-table-column>
                                    <vxe-table-column field="sex" title="Sex"></vxe-table-column>
                                    <vxe-table-column field="age" title="Age"></vxe-table-column>
                                    <vxe-table-column field="address" title="Address" show-overflow></vxe-table-column>
                                </vxe-table>
                            </el-tab-pane>
                        </el-tabs> -->
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm" v-if="!formReadonly">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader service="xminfoExcelService" module="pms"
                                @uploadSuccess="uploadSuccess"></ice-excel-uploader>
        </ice-dialog>
        <ice-dialog title="附件" :visible.sync="visibleAtta" width="700px">
            <ATTACHMENT :controlMj="controlMj" :data="attaTableData"
                        :is-handleer="false"></ATTACHMENT>
        </ice-dialog>
        <!--成员维护-->
        <ice-dialog title="成员维护" :visible.sync="visiblemaintain" width="1300px">
            <pms-sect-member :isFirstNameChange="true" ref="pmssectMember" :queryListXmcy="queryListXmcy"
                             :forbidDelRole="forbidDelRole"></pms-sect-member>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleConfirmMember">确认</el-button>
                <el-button type="info" @click="visiblemaintain=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="验收材料" :visible.sync="endVisible" width="800px">
            <ATTACHMENT :data="endlist" ref="enddata"  :control-mj="closeXmMj"></ATTACHMENT>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleCloseXmFjUpload">确认</el-button>
                <el-button type="info" @click="endVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import moment from 'moment';
    import ATTACHMENT from "../common/ATTACHMENT";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import PmsSectMember from "../xmgl/components/pmsSectMember";
    import PmsSelectTree from "../../../components/common/pms/PmsSelectTree";
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import localstoreUtil from '@/utils/localstoreUtil';
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    import {defineXmStatusColor, XM_ZT, forbidDelRole, SPZT} from "../../../utils/constant";
    // 定义项目状态颜色

    export default {
        mixins: [codeConfigRequest],
        name: "SCXMK",
        props: {
            conditions: {
                default: ()=>{
                    return {}
                }
            },
            activetree: {
                default: ''
            }
        },
        components: {
            IceDeptSelector,
            IceExcelUploader,
            PmsSelectTree,
            PmsSectMember,
            IceDatePicker,
            IceDialog,
            IceSelect,
            IceQueryGrid,
            ATTACHMENT
        },

        data() {
            return {
                ZT: '',
                currUser: localstoreUtil.getLastLoginUserName(),
                // 禁止删除角色
                forbidDelRole: forbidDelRole,
                // 成员维护弹窗
                visiblemaintain: false,
                loading: false,
                visible: false,
                visibleImport: false,
                visibleAtta: false,
                activeName: 'first',

                oidXmForCy: '', // 成员维护时选择的项目ID
                xmSecret: '', // 成员维护时选择的项目密级

                isemptyBtn: true,
                showChecked: false,
                width: '272px',
                unbrid: true,

                attaTableData: [],
                tableData: [],
                queryListXmcy: [],

                formModel: {
                    finishDate: "",
                    oid: '',
                    xmcode: '',
                    xmname: '',
                    xmcodeSw: '',
                    gmtLx: '',
                    xmly: '',
                    xmlb: '',
                    xmzgbmId: '',
                    xmzgbmCode: '9003-324',
                    xmzgbm: '',
                    orgid: '',
                    orgcode: '',
                    orgname: '',
                    xmlx: 'XMLX02',
                    dataSecretLevcode: '2',
                    dateRemark: '',
                    xmzt: 'XMZT01',

                    pmsHtinfoList: [],
                    pmsXminfoCyList: [],
                    pmsXmRwFjListXmsr: [],
                    pmsFxqdList: [],
                    xtFjList: [],
                    pmsXmRwFjListXmsc: [],
                },

                query: [
                    {type: 'input', code: 'xmcode', label: '项目编码'},
                    {type: 'input', code: 'xmcodeSw', label: '外部编码'},
                    {type: 'input', code: 'xmname', label: '项目名称'},
                    {type: 'select', code: 'xmlb',multiple: true, label: '项目类别', mapTypeCode: "XMLB"},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级', mapTypeCode: "DATA_SECRET_LEVEL"},
                    {type: 'date', code: 'gmtLx', label: '立项日期'},
                    {type: 'date', code: 'finishDate', label: '完结日期'},
                    {type: 'select', code: 'xmzt',multiple: true, label: '项目状态', value: 'XMZT10,XMZT20,XMZT30,XMZT31,XMZT32,XMZT33', mapTypeCode: 'XMZT'},
                    {type: 'static', code: 'xmlx', value: 'XMLX02', exp: '='},
                    {type: 'static', code: 'xmzt', value: '', exp: '='},
                    /*{
                        type: 'static', code: 'xmlx', exp: '=', value: () => {
                            return 'XMLX02';
                        }
                    },*/
                ],
                columns: [
                    {
                        self: this,
                        label: "项目状态",
                        code: "xmzt",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'XMZT',
                        renderCell: (h, data) => {
                            let obj = {
                                color: '#fff',
                                background: defineXmStatusColor[data.row.xmzt],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{this.datamap ? this.datamap[data.row.xmzt] : ''}</span>
                        }
                    },
                    {code: 'oid', hidden: true, sortable: true},
                    {code: 'xmlx', hidden: true, sortable: true},
                    {code: 'dateRemark', hidden: true, sortable: true},
                    {code: "xmcyCodes", hidden: true, sortable: true},
                    {code: "xmcyZg", hidden: true, sortable: true},
                    {code: "xmcyDyzrr", hidden: true, sortable: true},
                    {label: '项目编码', code: 'xmcode', sortable: true},
                    {label: '外部编码', code: 'xmcodeSw', sortable: true},
                    {label: '项目名称', code: 'xmname', sortable: true},
                    {label: '项目来源', code: 'xmlyName', sortable: true},
                    {label: '项目来源', code: 'xmly', hidden: true, sortable: true},
                    {label: '主管部门', code: 'xmzgbm', hidden: true},
                    {label: "业务主管部门", code: "xmzgbmCode", width: 130, sortable: true, cusMapTypeCode: "DEPT", sortable: true},
                    //{label: '项目主管', code: 'xmzg'},
                    //{label: '行政负责人', code: 'personidXz'},
                    //{label: '技术负责人', code: 'personidJs'},
                    {
                        label: '立项时间', code: 'gmtLx', sortable: true, formatter: function (row) {
                            return moment(row.gmtLx).format('YYYY-MM-DD');
                        },
                    },
                    {
                        label: "完结日期", code: "finishDate", width: 100, sortable: true, sortable: true, formatter(row) {
                            return row.finishDate ? moment(row.finishDate).format('YYYY-MM-DD') : '';
                        }
                    },
                    {label: '密级', code: 'dataSecretLevcode', sortable: true, mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],

                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refresh
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {
                        name: '项目分解',
                        ctrlCode: "BNDRWJH",
                        icon: 'el-icon-key',
                        type: 'success',
                        disabled: false,
                        size: 'mini',
                        callback: this.handleWbs
                    },
                    {
                        name: '项目收尾',
                        ctrlCode: "BXMSW",
                        type: 'success',
                        icon: 'el-icon-timer',
                        disabled: false,
                        size: 'mini',
                        callback: this.handleShowEnd
                    },
                    {name: '导入', icon: 'el-icon-upload2', type: 'primary', ctrlCode: "BDR", callback: this.importExcel},
                    {name: '导出', ctrlCode: "BDC", type: 'export'},
                ],
                rules: {
                    xmname: [
                        {required: true, whitespace: true, message: '请输入项目名称', trigger: 'blur'}
                    ],
                    finishDate: [
                        {required: true, message: '完成日期', trigger: 'change'}
                    ],
                    gmtLx: [
                        {required: true, message: '立项日期', trigger: 'change'}
                    ],
                    xmly: [
                        {required: true, message: '项目来源', trigger: 'change'}
                    ],
                    xmlb: [
                        {required: true, message: '项目类别', trigger: 'change'}
                    ],
                },
                operations: [
                    {
                        name: '编辑', callback: this.edit, ctrlCode: "BBJ"
                    },
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            return row.xmzt == XM_ZT.WSS
                        }
                    },
                    {
                        name: '启动', callback: this.startProject, ctrlCode: "BQD", isShow: (row)=> {
                            let arr = row.xmcyZg?row.xmcyZg.split(","):[];
                            return (row.xmzt == XM_ZT.WSS || row.xmzt == XM_ZT.ZT || row.xmzt == XM_ZT.GB)&&arr.indexOf(this.currUser)!=-1
                        }
                    },
                    {
                        name: '暂停', callback: this.pauseProject, ctrlCode: "BZT", isShow(row) {
                            return row.xmzt == XM_ZT.SSZ
                        }
                    },
                    {
                        name: '关闭', callback: this.closeProject, ctrlCode: "BGB", isShow:(row)=> {
                            let arr = row.xmcyZg?row.xmcyZg.split(","):[];
                            return row.xmzt == 'XMZT30'&&arr.indexOf(this.currUser)!=-1
                        }
                    },
                    {
                        name: '成员维护', callback: this.handleMember, ctrlCode: "BCYWH", isShow: (row) => {

                            let arr = row.xmcyZg?row.xmcyZg.split(","):[];
                            return arr.indexOf(this.currUser)!=-1  || row.xmcyDyzrr == this.currUser
                            // return row.xmcyZg == this.currUser || row.xmcyDyzrr == this.currUser
                        }
                    },
                    {name: '查看', callback: this.view, ctrlCode: "BCK"},
                    {name: '附件', callback: this.atta, ctrlCode: "BFJ"},
                ],

                transferTree: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/DataDictionaryType/getTree?code=XMLY&isTree=1',
                        lazy: false,
                        nodeKey: 'code',
                        // 配置字段
                        props: {
                            label: 'name',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {},
                        code: 'code',
                        // 返回解析字段
                        callback: this.getTreeData
                    },

                },
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                treeDataList: [],
                formReadonly: false,
                mapTypeCode: 'XMZT',
                rowData: {},

                // 项目收尾
                endVisible: false,
                endlist: [],
                closeXmMj: []
            }
        },
        computed: {
            controlMj() {
                console.log(this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode * 1] : [], 'fdsfdsfdsfdsf')
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode * 1] : []
            },
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode) || []
                } else if (this.dataUrl) {
                    return this.getCacheByKey()(this.getCacheKey()) || []
                } else {
                    return this.selectList || [];
                }

            },
            options() {
                console.log(this.filterSelectList, 'this.filterSelectList')
                let map = this.filterSelectList.filter(c => {
                    return c.value != XM_ZT.LXZ
                })
                let obj = {
                    disabled: false,
                    label: "全部",
                    value: ""
                }
                console.log(map, 'map')
                return [obj, ...map]
            },
            datamap() {
                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
                return this.getDataMap()(this.mapTypeCode);
            },
            dataUrl() {
                if (this.conditions.dates) {
                    let dates = this.conditions.dates;
                    let obj = {
                        sdate: moment(dates[0]).format('YYYY-MM-DD'),
                        edate: moment(dates[1]).format('YYYY-MM-DD'),
                        deptCode: this.activetree != 'first' ? this.conditions.deptCode : '',
                        xmly: this.activetree == 'first' ? this.conditions.xmlyCode : '',
                        sortOrder: 'desc',
                        sortColumn: 'xmzt'
                    }
                    let url = this.urlJoint('/pms/Xminfo/listMemberCode', obj);
                    return url;
                } else {
                    return "/pms/Xminfo/listMemberCode"
                }

            },
        },
        watch: {
            controlMj() {
                console.log(this.controlMj, '变化了')
            }
        },
        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
        },
        methods: {
            /*
            * 项目收尾
            *
            *
            * */
            handleShowEnd() {
                this.endVisible = true;
                this.getCloseFjList();
            },
            // 获取项目收尾
            getCloseFjList() {
                // return
                this.closeXmMj = [this.rowData.dataSecretLevcode]
                this.$axios.get("pms/PmsXmRwFj/queryListXmOidClose", {params: {xmOid: this.rowData.oid}})
                    .then(result => {
                        this.endlist = result.data
                    })
                    .catch(error => {
                        this.$message.error("获取失败！")
                    })
            },
            handleCloseXmFjUpload() {
                // 项目输入
                let sr = this.$refs.enddata.getData();
                let obj = this.rowData;
                obj.pmsXmRwFjListXmjw = sr;
                if (sr.length > 0) {
                    this.$axios.post("pms/Xminfo/saveOrUpdateXmClose", {$json: obj})
                        .then(result => {
                            this.$message.success("保存数据成功！");
                            this.getCloseFjList();
                        })
                        .catch(error => {
                            this.$message.error("保存数据失败！")
                        })
                } else {
                    this.$message.success("保存数据成功！");
                }
            },


            handleWbs() {
                let obj = {
                    oid: this.rowData.oid,
                    dataSecretLevcode: this.rowData.dataSecretLevcode,
                    xmname: this.rowData.xmname
                }
                this.$router.push({path: '/pms/xmgl/wbs', query: obj})
            },
            // 点击行选中回调
            handleSectItem(row) {
                this.rowData = row[0];
            },
            // 拼接url
            urlJoint(baseurl, params) {
                let str = "";
                for (let i in params) {
                    str += '&' + i + '=' + params[i];
                }
                return baseurl + '?' + str.substring(1);
            },
            // 日期控制
            pickerOptions(type) {
                if (type == 1) {
                    let end = this.formModel.finishDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.formModel.gmtLx;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getDataMapList']),
            ...mapActions('cacheStore', ['addCache']),
            ...mapGetters('cacheStore', ['getCacheByKey']),
            // 刷新
            refresh() {
                this.$refs.grid.refresh();
            },
            xmztChange(val) {
                console.log(val);
                this.query[this.query.length - 1].value = val;
                this.$refs.grid.refresh();
            },
            // 导入成功后的回调
            uploadSuccess() {
                console.log(123456789)
                this.visibleImport = false;
            },
            confirm() {


                // console.log(this.formModel.xmlyName)
                // return
                // 项目成员
                let arr = [];

                let insertDataCy = this.$refs.pmssectMember.getData();
                let deleteDataCy = this.$refs.pmssectMember.getDeleteData();
                let memberListSect = []
                if (insertDataCy) {
                    memberListSect = insertDataCy.concat(deleteDataCy);
                } else {
                    return
                }
                memberListSect.forEach((c, i) => {
                    let obj = {
                        // this.formModel.oid?c.oid:''
                        oid: (this.formModel.oid && this.personIds.indexOf(c.oid) > -1) ? c.oid : '',
                        oidUser: c.oidUser,
                        oidXm: '',
                        xmname: '',
                        xmcode: '',
                        dataSecretLevcode: '2',
                        xmcylx: c.xmcylx,
                        name: c.name,
                        code: c.code,
                        deptId: c.dataDeptId,
                        deptName: c.deptName,
                        deptCode: c.deptCode,
                        zzsm: c.zzsm,
                        deleteStatus: c.deleteStatus
                    }
                    arr.push(obj);
                })

                this.formModel.pmsXminfoCyList = arr;
                this.formModel.xtFjList = this.$refs.attachment.getData();

                // return
                //console.log(this.formModel.pmsXminfoCyList)
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true

                        this.$axios.post("/pms/Xminfo/saveOrUpdateByMultiTable", {$json: this.formModel})
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                            })
                    }
                })

            },
            // 获取项目编码
            getCode() {
                this.loadProjectCode({name: 'scXm'}).then(res => {
                    this.formModel.xmcode = res.number;
                })
            },
            // 获取外部编码
            getCodeWb() {
                this.loadProjectCode({name: 'scXmWb'}).then(res => {
                    this.formModel.xmcodeSw = res.number;
                })
            },
            addItem() {
                this.formReadonly = false;

                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getCode();
                })
                this.formModel.oid = '';
                this.queryListXmcy = [];
                this.formModel.xmly = '';
                this.attaTableData = [];
            },

            startProject(row) {
                this.$confirm('是否确认启动?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/pms/Xminfo/startProject", {ids: row.oid})
                        .then(result => {
                            this.$message.success("启动成功");
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("启动失败")
                        })
                }).catch(_ => {

                })
            },

            pauseProject(row) {
                this.$confirm('是否确认暂停?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/pms/Xminfo/pauseProject", {ids: row.oid})
                        .then(result => {
                            this.$message.success("暂停成功");
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("暂停失败")
                        })
                }).catch(_ => {

                })
            },

            closeProject(row) {
                this.$confirm('是否确认关闭?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/pms/Xminfo/closeProject", {ids: row.oid})
                        .then(result => {
                            this.$message.success("关闭成功");
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("关闭失败")
                        })
                }).catch(_ => {

                })
            },

            edit(row) {
                this.formReadonly = false;
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel.pmsHtinfoList = [];
                    this.formModel.pmsXminfoCyList = [];
                    this.formModel.pmsXmRwFjListXmsr = [];
                    this.formModel.pmsFxqdList = [];
                    this.formModel.xtFjList = [];
                    this.formModel.pmsXmRwFjListXmsc = [];
                    this.getSingle(row);
                    this.getListXmcyData(row.oid);
                    this.getXtfjList(row.oid);
                });
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/Xminfo/get", {params: {id: row.oid}})
                    .then(result => {
                        console.log(result.data, 'data')
                        let data = result.data;
                        data.rq = moment(new Date()).format("YYYY-MM-DD");
                        this.formModel = data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/Xminfo/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },

            //获取项目列表数据
            getListXmcyData(oidXm) {
                console.log(oidXm)
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                        console.log(result.data)
                        let arr = [];
                        result.data.forEach((c, i) => {
                            arr.push(c.oid);
                        });
                        this.personIds = arr;
                        console.log(' this.personIds', this.personIds)
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },

            view(row) {
                console.log(row)
                this.formReadonly = true;
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                });
                this.getListXmcyData(row.oid);
                this.getXtfjList(row.oid);
            },

            atta(row) {
                this.visibleAtta = true;
                this.getXtfjList(row.oid);
            },

            /**
             * 获取项目附件
             */
            getXtfjList(oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.attaTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询失败")
                    })
                    .finally(_ => {

                    })
            },

            // 数组拉平
            arrayFlat(array) {
                let arr = [];
                let self = this;

                function hanle(s) {
                    for (var i = 0, j = s.length; i < j; i++) {//历遍数组

                        arr.push(s[i]);
                        if (Object.prototype.toString.call(s[i][self.transferTree.treeData.props.children]) == "[object Array]") {//判断是否为数组
                            console.log(s[i][self.transferTree.treeData.props.children])
                            hanle(s[i][self.transferTree.treeData.props.children]);//递归调用
                        }
                    }
                }

                hanle(array);
                return arr;
            },

            getTreeData(data) {
                let array = this.arrayFlat(data);
                this.treeDataList = array;
            },

            importExcel() {
                this.visibleImport = true;
            },
            // 展示弹窗
            handleMember(row) {
                this.oidXmForCy = row.oid;
                this.xmSecret = row.dataSecretLevcode;
                this.visiblemaintain = true;
                this.$nextTick(_ => {
                    this.getListXmcyData(row.oid);
                })

            },
            // 成员维护确定
            handleConfirmMember() {
                let insertDataCy = this.$refs.pmssectMember.getData();
                if (!insertDataCy) {
                    return;
                }
                let deleteDataCy = this.$refs.pmssectMember.getDeleteData();

                let xminfo = {oid: this.oidXmForCy, dataSecretLevcode: this.xmSecret};
                xminfo.pmsXminfoCyList = insertDataCy.concat(deleteDataCy);

                this.$axios.post("/pms/Xminfo/saveMember", xminfo)
                    .then(result => {
                        this.$message.success("保存成功");
                        this.visiblemaintain = false;
                    })
                    .catch(error => {
                        this.$message.error("保存失败：" + error.msg)
                    })
                    .finally(_ => {

                    })
            },
            deptSelect2(value){
                this.formModel.orgcode = value
            },
            deptSelect(depts) {
                console.log(depts)
                this.formModel.xmzgbmId = depts[0].oid
                this.formModel.xmzgbmCode = depts[0].deptCode
                this.formModel.xmzgbm = depts[0].deptShortName

                this.formModel.orgid = depts[0].oid
                this.formModel.orgcode = depts[0].deptCode
                this.formModel.orgname = depts[0].deptShortName
            }
        }
    }
</script>

<style scoped>
    .hint {
        font-size: 12px;
        line-height: 30px;
        color: #f30213;
    }
</style>

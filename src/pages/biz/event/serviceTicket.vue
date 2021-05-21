<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" class="ClassName">
        <!-- 服务待受理主列表 -->
        <ice-query-grid
                :data-url=url
                :columns=columns
                :query="[...commonQuery,...queryMap[activeTab]]"
                :operations="operations"
                :buttons="buttons"
                :gridData="information"
                chooseItem="multiple"
                @selection-change="select"
                :title="exportTitle"
                ref="mainQG"
        >
        </ice-query-grid>
        <!--查看派出工单弹窗-->
        <ice-dialog v-dialogDrag title="查看派出工单" custom-class="ice-dialog" center :visible.sync="Visible2"
                    width="1200px" append-to-body :close-on-click-modal="false" remounted>
            <look-over :hasTicket="hasTicket" :catalogNum="catalogNum"></look-over>
        </ice-dialog>
        <!--抄送人员选择-->
        <ice-persion-selector ref="person" mode="hidden" @select-confirm="blameSelectUser"></ice-persion-selector>
    </div>
</template>

<script>
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import LookOver from "./base/lookOver";
    import Bus from "./base/bus.js"

    export default {
        name: 'serviceTicket',
        data() {
            return {
                tableData: [],
                Visible: false,
                Visible2: false,
                aclKeyReadonly: false,
                information: [],
                tabs: "0",
                //服务申请
                service: "6",
                //故障申报
                malfunction: "7",
                //查看派出工单
                hasTicket: "",
                catalogNum: "",
                exportTitle: "服务待受理-服务待受理",
                people: [],
                incident: [],
                num: [],
                url: "/biz/ProEvtServiceTicket/searchPageUserServTicket?IS_BREAKDOWN=0&SERVICE_STATUS=1",
                sourceArr: ["自助服务台", "电话", "监控告警", "人工巡检", "值班", "邮件", "其他"],
                form: {
                    resource: '',
                    region: '',
                    date1: '',
                },
                columns: [
                    {code: "id", hidden: true},
                    {label: '服务单号', code: 'serviceTicket', width: 160, sortable: true},
                    {label: '用户', code: 'userName', width: 100},
                    {
                        label: '用户星级', code: 'userLevel', width: 100, renderCell(h, data) {
                            if (data.row.userLevel == null) {
                                return '1星级'
                            }
                            return data.row.userLevel + '星级'
                        }
                    },
                    {label: '用户单位', code: 'userDeptName'},
                    {label: '申请人', code: 'creatorName', width: 100},
                    {label: '申请人座机', code: 'creatorTelephone', width: 100},
                    {label: '申请时间', code: 'gmtCreate', width: 200, sortable: true},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus", width: 80},
                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                    {label: '描述', code: 'description', width: 300, align: "left"},
                    {label: '剩余时间', code: 'remainingTimeResp', width: 200},
                    {
                        label: '关注', code: 'ticket',fixed:"right",width:100, renderCell(h, data) {
                            return <div class="cell" title={data.row.ticket}>
                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                            </div>;
                        }
                    },
                ],
                queryMap: {
                    0: [
                        {label: '', code: 'IS_BREAKDOWN', value: '0', type: 'static'},

                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                        {type: 'input', label: '用户', code: 'USER_NAME', value: '',},
                        {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel", value: ""},
                        {type: 'input', label: '用户单位', code: 'USER_DEPT_NAME', value: '',},
                        {type: 'select', label: '状态', code: 'serviceStatus', value: '', mapTypeCode: "serviceStatus",},
                        {type: 'select', label: '来源', code: 'SOURCE', value: '', mapTypeCode: "eventSource"},
                        {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: '',},
                        {type: 'input', label: '申请人座机', code: 'CREATOR_TELEPHONE', value: '',},
                        {type: 'date', label: '申请时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                        {type: 'date', label: '申请时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                        {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',}
                    ]
                },
                activeTab: '0',
                commonQuery: [{
                    type: 'tab',
                    label: '状态',
                    value: "1",
                    name: "0",
                    tablist: [
                        {label: '服务待受理', value: '1', name: '0'},
                        {label: '故障待受理', value: '2', name: "1"},
                        {label: '服务已受理', value: '3', name: "2"},
                        {label: '故障已受理', value: '4', name: "3"},
                    ],
                    click: (value) => {
                        if (value === '1') {
                            this.tableData = [];
                            this.exportTitle = "服务待受理-服务待受理";
                            this.columns = [
                                {code: "oid", hidden: true},
                                {label: '服务单号', code: 'serviceTicket', width: 160, sortable: true},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', width: 100, renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '用户单位', code: 'userDeptName'},
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '申请人座机', code: 'creatorTelephone', width: 100},
                                {label: '申请时间', code: 'gmtCreate', width: 200, sortable: true},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus", width: 80},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '剩余时间', code: 'remainingTimeResp', width: 200},
                                {
                                    label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                },
                            ];
                            this.queryMap = {
                                0: [

                                    {label: '', code: 'IS_BREAKDOWN', value: '0', type: 'static'},

                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '用户', code: 'USER_NAME', value: '',},
                                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                                    {type: 'input', label: '用户单位', code: 'USER_DEPT_NAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '来源',
                                        code: 'SOURCE',
                                        value: '',
                                        mapTypeCode: "eventSource"
                                    },
                                    {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: '',},
                                    {type: 'input', label: '申请人座机', code: 'CREATOR_TELEPHONE', value: '',},
                                    {type: 'date', label: '申请时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '申请时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',}
                                ]
                            }
                            this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket?IS_BREAKDOWN=0&SERVICE_STATUS=1"
                        } else if (value === '2') {
                            this.tableData = [];
                            this.exportTitle = "服务待受理-故障待受理";
                            this.columns = [
                                {code: "oid", hidden: true},
                                {label: '服务单号', code: 'serviceTicket', width: 160, sortable: true},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', width: 100, renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '用户单位', code: 'userDeptName'},
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '申请人座机', code: 'creatorTelephone', width: 100},
                                {label: '申请时间', code: 'gmtCreate', width: 200, sortable: true},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus", width: 80},
                                {label: '故障开始时间', code: 'gmtBegin', width: 200},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '剩余时间', code: 'remainingTimeResp', width: 200},
                                {
                                    label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                }
                            ];
                            this.queryMap = {
                                "0": [
                                    {label: '', code: 'IS_BREAKDOWN', value: '1', type: 'static'},

                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '用户', code: 'USER_NAME', value: '',},
                                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                                    {type: 'input', label: '用户单位', code: 'USER_DEPT_NAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '来源',
                                        code: 'SOURCE',
                                        value: '',
                                        mapTypeCode: "eventSource"
                                    },
                                    {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: '',},
                                    {type: 'input', label: '申请人座机', code: 'CREATOR_TELEPHONE', value: '',},
                                    {type: 'date', label: '申请时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '申请时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',},
                                    {type: 'date', label: '故障开始时间(开始)', code: 'gmtBegin', value: '', exp: ">=",compare:3},
                                    {type: 'date', label: '故障开始时间(结束)', code: 'gmtBegin', value: '', exp: "<=",compare:4},
                                ]
                            }
                            this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket?IS_BREAKDOWN=1&SERVICE_STATUS=1"
                        } else if (value === '3') {
                            this.tableData = [];
                            this.exportTitle = "服务待受理-服务已受理";
                            this.columns = [
                                {code: "oid", hidden: true},
                                {label: '服务单号', code: 'serviceTicket', width: 200, sortable: true},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', width: 100, renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '用户单位', code: 'userDeptName'},
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '申请人座机', code: 'creatorTelephone', width: 100},
                                {label: '申请时间', code: 'gmtCreate', width: 200, sortable: true},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus", width: 80},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '区域', code: 'areaShortname',},
                                {label: '业务服务名称', code: 'categoryname', width: 200},
                                {label: '服务项', code: 'catalogname', width: 180},
                                {label: '剩余时间', code: 'remainingTimeResp', width: 200},
                                {
                                    label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                }
                            ];
                            this.queryMap = {
                                '0': [
                                    {label: '', code: 'IS_BREAKDOWN', value: '0', type: 'static'},

                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '用户', code: 'USER_NAME', value: '',},
                                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                                    {type: 'input', label: '用户单位', code: 'USER_DEPT_NAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '来源',
                                        code: 'SOURCE',
                                        value: '',
                                        mapTypeCode: "eventSource"
                                    },
                                    {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: '',},
                                    {type: 'input', label: '申请人座机', code: 'CREATOR_TELEPHONE', value: '',},
                                    {type: 'date', label: '申请时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '申请时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '描述', code: 'description', value: '',},
                                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: '',},
                                    {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: '',},
                                    {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                                ],
                            };
                            this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket?IS_BREAKDOWN=0&SERVICE_STATUS=2,3,4,5,6,7,8"
                        } else if (value === '4') {
                            this.tableData = [];
                            this.exportTitle = "服务待受理-故障已受理";
                            this.columns = [
                                {code: "oid", hidden: true},
                                {label: '服务单号', code: 'serviceTicket', width: 160, sortable: true},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', width: 100, renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '用户单位', code: 'userDeptName'},
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '申请人座机', code: 'creatorTelephone', width: 100},
                                {label: '申请时间', code: 'gmtCreate', width: 200, sortable: true},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus", width: 80},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '区域', code: 'areaShortname',},
                                {label: '业务服务名称', code: 'categoryname', width: 200},
                                {label: '服务项', code: 'catalogname', width: 180},
                                {label: '剩余时间', code: 'remainingTimeResp', width: 200},
                                {
                                    label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                }
                            ];
                            this.queryMap = {
                                "0": [
                                    {label: '', code: 'IS_BREAKDOWN', value: '1', type: 'static'},

                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '用户', code: 'USER_NAME', value: '',},
                                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                                    {type: 'input', label: '用户单位', code: 'USER_DEPT_NAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '来源',
                                        code: 'SOURCE',
                                        value: '',
                                        mapTypeCode: "eventSource"
                                    },
                                    {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: '',},
                                    {type: 'input', label: '申请人座机', code: 'CREATOR_TELEPHONE', value: '',},
                                    {type: 'date', label: '申请时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '申请时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',},
                                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: '',},
                                    {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: '',},
                                    {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                                ]
                            }
                            this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket?IS_BREAKDOWN=1&SERVICE_STATUS=2,3,4,5,6,7,8"
                        }
                        this.$refs.mainQG.refreshAndPageReset();
                    }
                }],
                operations: [
                    {
                        name: '删除',
                        icon: 'el-icon-delete',
                        type: "primary",
                        callback: this.deleteAcl,
                        isShow: function (row) {
                            if (row.serviceStatus === 0) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '详情',
                        icon: 'el-icon-view',
                        type: 'primary',
                        callback: this.detail,
                        dbclick: true,
                    },
                    {
                        name: '办理',
                        icon: 'el-icon-edit-outline',
                        type: 'primary',
                        callback: this.transactions,
                        isShow: function (row) {
                            if (row.serviceStatus === 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '修改',
                        icon: 'el-icon-edit',
                        type: "primary",
                        callback: this.change,
                        isShow: function (row) {
                            if (row.serviceStatus === 0) {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                buttons: [
                    {
                        name: '服务申请', icon: 'el-icon-plus', type: 'primary', callback: this.addItem, code: ''
                    },
                    {
                        name: '故障申报', icon: 'el-icon-plus', type: 'primary', callback: this.stoppage, code: ''
                    },
                    {
                        name: '查看派出工单', icon: 'el-icon-document', type: "info", code: '', callback: this.hasSent
                    },
                    {
                        name: '抄送', icon: 'el-icon-tickets', code: '', type: "primary", callback: this.copyTo
                    },
                    {
                        name: '关注', icon: 'el-icon-check', code: '', type: "primary", callback: this.follow
                    },
                    {
                        name: '取消关注', icon: 'el-icon-close', code: '', type: "primary", callback: this.notcare
                    },
                    {
                        name: '导出', icon: 'el-icon-download', code: '', type: 'export',
                    }
                ],
            }
        },
        methods: {
            //服务申请
            addItem() {
                this.aclKeyReadonly = false;
                this.$router.push("serviceTicket/transaction?tabs=" + this.service);
            },
            //故障申报
            stoppage() {
                this.aclKeyReadonly = false;
                this.$router.push("serviceTicket/transaction?tabs=" + this.malfunction);
            },
            //办理
            transactions(row) {
                this.$router.push("serviceTicket/transaction?dataId=" + row.oid + "&Id=" + row.id + "&tabs=" + this.tabs);
            },
            //详情
            detail(row) {
                if (row.serviceStatus == "0") {
                    this.$router.push("serviceTicket/transaction?tabs=" + this.commonQuery[0].value + "&type=c&dataId=" + row.oid);
                } else if (row.serviceStatus == "1") {
                    this.$router.push("serviceTicket/transaction?dataId=" + row.oid + "&Id=" + row.id + "&tabs=" + this.tabs + "&type=detail");
                } else {
                    this.$router.push("serviceTicket/transaction?dataId=" + row.oid + "&Id=" + row.id + "&tabs=1&type=detail");
                }
            },
            //修改
            change(row) {
                this.$router.push("serviceTicket/transaction?tabs=" + this.commonQuery[0].value + "&dataId=" + row.oid);
            },
            //查看派出工单
            hasSent() {
                if (this.commonQuery[0].value == "1" || this.commonQuery[0].value == "2") {
                    this.aclKeyReadonly = false;
                    this.Visible2 = false;
                } else {
                    if (this.tableData.length == 1) {
                        if (this.tableData[0].serviceStatus == "1" || this.tableData[0].serviceStatus == "0") {
                            this.$confirm('请选择正确的数据进行查看！', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                            }).then(() => {
                                this.$refs.mainQG.refresh();
                            })
                        } else {
                            this.hasTicket = this.tableData[0].serviceTicket;
                            this.catalogNum = this.tableData[0].catalogId;
                            this.aclKeyReadonly = false;
                            this.Visible2 = true;
                            this.$refs.mainQG.refresh();
                            this.tableData = [];
                        }
                    } else if (this.tableData.length == 0 || this.tableData.length > 1) {
                        this.$confirm('请选择一条数据进行查看！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        })
                    }
                }
            },
            //删除，只能删除草稿状态下的单子
            deleteAcl(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get('biz/ProEvtUserTicket/deleteTicket', {params: {id: row.serviceTicket}}).then(result => {
                        this.$refs.mainQG.refresh();
                        this.$message.success("删除成功");
                    }).catch(error => {
                        this.$message.error("出错啦");
                    })
                });
            },
            //关注
            follow() {
                let attention = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    this.num.push(this.tableData[i].id);
                    if (this.tableData[i].ticket == "未关注") {
                        attention.push(this.tableData[i].ticket);
                    }
                }
                if (this.tableData.length > 0) {
                    this.$confirm("是否关注！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.post('biz/ProEvtUserFocus/fouce', {ids: this.num.join(",")}).then(result => {
                            if (result.status == "200") {
                                Bus.$emit("focus", "true");
                            } else {
                                Bus.$emit("focus", "false");
                            }
                            if (attention.length == "0") {
                                this.$message.warning("无可关注项!");
                                this.$refs.mainQG.refresh();
                                this.tableData = [];
                                this.num = [];
                            } else {
                                this.$message.success("已关注" + attention.length + "条数据!");
                                this.$refs.mainQG.refresh();
                                this.tableData = [];
                                this.num = [];
                            }
                        })
                    });
                } else {
                    this.$confirm("请选择一条或多条数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }

            },
            //取消关注
            notcare() {
                let unattention = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    this.num.push(this.tableData[i].serviceTicket);
                    if (this.tableData[i].ticket != "未关注") {
                        unattention.push(this.tableData[i].ticket);
                    }
                }
                if (this.tableData.length > 0) {
                    this.$confirm("是否取消关注！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete('biz/ProEvtUserFocus/del', {params: {ids: this.num.join(",")}}).then(result => {
                            if (result.status == "200") {
                                Bus.$emit("focus", "true");
                            } else {
                                Bus.$emit("focus", "false");
                            }
                            if (unattention.length == "0") {
                                this.$message.warning("无取消关注项!");
                                this.$refs.mainQG.refresh();
                                this.tableData = [];
                                this.num = [];
                            } else {
                                this.$message.success("已取消关注" + unattention.length + "条数据!");
                                this.$refs.mainQG.refresh();
                                this.tableData = [];
                                this.num = [];
                            }
                        })
                    });
                } else {
                    this.$confirm("请选择一条或多条已关注数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            // people:[],   选择的人员
            // incident:[], 选择的数据
            //抄送,选中的信息
            copyTo() {
                if (this.tableData.length == "0") {
                    this.$confirm("请选择一条或多条数据进行抄送！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    this.$refs.person.openDialog();
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.incident.push(this.tableData[i].serviceTicket);
                    }
                    this.incident = this.incident.join(",");
                }
            },
            //选中人员回调
            blameSelectUser(row) {
                for (let i = 0; i < row.length; i++) {
                    this.people.push(row[i].code)
                }
                this.people = this.people.join(",");
                this.$axios.post('biz/ProEvtServiceTicketCc/createBatch', {
                    tickets: this.incident,
                    users: this.people
                }).then(result => {
                    //person
                    this.$refs.mainQG.refresh();
                    this.tableData = [];
                    this.incident = [];
                    this.people = [];
                    this.$refs.person.cleanColumnSelect();
                    this.$message.success("抄送成功！");
                }).catch(error => {
                    this.$refs.mainQG.refresh();
                    this.tableData = [];
                    this.incident = [];
                    this.people = [];
                    this.$message.success("抄送失败！");
                })
            },
            //选中列表数据
            select(rows) {
                this.tableData = rows;
            },
        },
        beforeUpdate() {
            if (this.commonQuery[0].value === "1" || this.commonQuery[0].value === "2") {
                this.buttons[2].type = "info";
            } else {
                this.buttons[2].type = "primary";
            }
            this.tabs = this.commonQuery[0].value;
            if (this.tabs == "1") {
                this.tabs = 0;
            } else if (this.tabs == "2") {
                this.tabs = 1;
            } else if (this.tabs == "3") {
                this.tabs = 2
            } else if (this.tabs == "4") {
                this.tabs = 3;
            }
        },
        mounted() {
            Bus.$on("OK", (isTrue) => {
                if (isTrue) {
                    this.$refs.mainQG.refresh();
                }
            })
        },
        components: {
            LookOver,
            IcePersionSelector,
            IceDialog,
            IceQueryGrid,
            Bus
        }
    }

</script>

<style scoped lang="less">

</style>

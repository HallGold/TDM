<template>
    <div>
        <ice-query-grid
                v-loading="loading"
                minHeight="450px"
                :pagination="false"
                :gridData="memberList"
                :columns="columnsXmcy"
                :buttons="buttonsXmcy"
                :operations="operationsXmcy"
                ref="XzryTable1"
        >
        </ice-query-grid>
        <!--点击弹出新增人员弹出框-->
        <ice-dialog title="选择成员(项目主管、项目第一责任人、行政负责人、技术负责人是必选角色)" :visible.sync="visibleMember" width="1400px"
                    :showClose1="showClose">
            <div slot="headerTitle" class="titleSlot">
                <span class="td">选择成员</span>
                <span class="dd">(项目主管、项目第一责任人、行政负责人、技术负责人是必选角色)</span>
            </div>
            <member
                    ref="sectMEM"
                    :forbidDelRole="forbidDelRole"
                    :mustRoleData="mustRoleData"
                    :selectedmembersProp="selectedmembersProp"
                    :transfer="transfer" :sectList="sectList" @addXzcy="showVisible" :ROLE_ONE="ROLE_ONE"
                    @handleCallback1="handleCallbackMember">
            </member>
        </ice-dialog>
    </div>
</template>

<script>
    import member from "./member";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "pmsSectMember",
        components: {
            member,
            IceDialog,
            IceQueryGrid
        },
        props: {
            queryListXmcy: {
                default: function () {
                    return []
                }
            },
            // 隐藏按钮
            disabled: false,
            forbidDelRole: {
                default: function () {
                    return []
                }
            },
            // 是否更改项目第一负责人名称
            isFirstNameChange: {
                default: false
            }
        },
        data() {
            return {
                loading: false,
                appCode: '',
                // 选择成员回调数组
                callbackData: [],

                //点击新增人员弹出的模态框title
                titleNameXzry: "新增人员",

                //默认模态框为false关闭状态
                visibleXzry: false,

                //定义项目成员loadingXzry为false
                loadingXzry: false,

                visibleMember: false,

                showClose: false,

                //列表展示字段
                columnsXmcy: [
                    {code: 'oid', hidden: true},
                    {code: 'oidXm', hidden: true},
                    {code: 'xmname', hidden: true},
                    {code: 'xmcode', hidden: true},
                    {code: 'dataSecretLevcode', hidden: true},
                    {label: '项目角色', code: 'xmcylx', width: 200, mapTypeCode: 'XMCYLX'},
                    {label: '人员姓名', code: 'name', width: 200,},
                    {label: '人员编码', code: 'code', width: 200, sortable: true},
                    // {label: '所属单位', code: 'deptShortName', width: 200, },
                    {label: '所属单位', code: 'deptName', width: 200,},
                    {label: '所属单位编码', code: 'deptCode', width: 200, sortable: true},
                ],

                //项目成员按钮事件
                buttonsXmcy: [
                    {
                        name: '新增成员',
                        icon: 'el-icon-plus',
                        type: 'success',
                        ctrlCode: "BXZ",
                        callback: this.showVisible,
                        hidden: this.disabled
                    },
                    // {name: '查看数据', icon: 'el-icon-plus', type: 'success', ctrlCode: "BXZ", callback: this.look, hidden: this.disabled},
                ],
                //项目成员编辑事件
                operationsXmcy: [
                    {
                        name: '删除', callback: this.deleteXmcy, ctrlCode: "BXZ2", isShow: function (row) {
                            console.log(this.forbidDelRole)
                            return this.forbidDelRole.indexOf(row.xmcylx) < 0
                        }
                    },
                ],
                //项目成员定义点击第一层编辑行的时候获取Xminfo数据
                Xzryrow: {},
                // 编辑指定项目，人员的id 集合

                // 删除成员列表
                removeMemberList: [],

                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/permission/frame_org/load_table_tree?loadDisabled=false',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'deptName',
                            children: 'children'
                        },
                        nodeKey: 'oid',
                        // 请求传递参数
                        initModel: {}
                    },
                    value: '',
                    placeholder: '请选择'
                },
                // 必选角色
                mustRoleData: [],
                selectedmembersProp: [],
                MUST_ROLE: [],
                ROLE_ONE: [],
                memberList: JSON.parse(JSON.stringify(this.queryListXmcy)).filter(c => {
                    return c.deleteStatus != 1
                })
            }
        },
        computed: {
            ...mapGetters('menuStore', ['getAppCode']),
            personIds() {
                let arr = [];
                this.memberList.forEach((c, i) => {
                    if (c.oid) {
                        arr.push(c.oid);
                    }
                });
                return arr;
            },
            // 获取角色字典
            sectList() {
                let data = this.getDataMapList()('XMCYLX');
                if (this.isFirstNameChange) {
                    data.forEach(c=>{
                        if (c.value=="XMCYLX11") {
                            c.label = '项目负责人';
                        }
                    })
                }
                return data;
            },
            initcydel() {
                console.log(this.queryListXmcy, '1')
                return this.queryListXmcy.filter(c => {
                    return c.deleteStatus == 1
                })
            }
        },
        created() {
            this.getRoleSelect();
            this.getOneRole();
            this.addUndoTypeCodes('XMCYLX');
        },
        watch: {
            queryListXmcy() {
                this.memberList = JSON.parse(JSON.stringify(this.queryListXmcy)).filter(c => {
                    return c.deleteStatus != 1
                })
            },
            disabled: {
                immediate: true,
                handler: function (val, oldVal) {
                    if (this.disabled) {
                        this.operationsXmcy = [];
                        this.buttonsXmcy = [];
                    } else {
                        this.operationsXmcy = [
                            {
                                name: '删除', callback: this.deleteXmcy, ctrlCode: "BXZ2", isShow: (row) => {
                                    return this.forbidDelRole.indexOf(row.xmcylx) < 0
                                }
                            },
                        ];
                        this.buttonsXmcy = [{
                            name: '新增成员',
                            icon: 'el-icon-plus',
                            type: 'success',
                            ctrlCode: "BXZ",
                            callback: this.showVisible,
                            hidden: this.disabled
                        },];
                    }
                },
            }
        },
        methods: {
            ...mapActions('menuStore', ['getAppMenus']),

            look() {
                // 获取删除角色
                let len = this.queryListXmcy.length;
                let delMember = [];
                if (len > 0) {
                    this.queryListXmcy.forEach((c) => {
                        if (this.personIds.indexOf(c.oid) < 0) {
                            delMember.push(c);
                        }
                    })
                }
                console.log(delMember)
            },
            // 获取必选角色
            getRoleSelect() {
                // console.log(this.getAppMenus(this.getAppCode), 'getAppMenus')

                this.$axios.get("permission/app_constant/byCode", {params: {appCode: 'PMS', code: 'XMBXJS'}})
                    .then(result => {
                        // console.log(result, 'result')
                        this.MUST_ROLE = result.data.value.split(',').map((c) => {
                            return c.trim();
                        });
                        let arr = []
                        this.MUST_ROLE.forEach((c) => {
                            let obj = {
                                oid: '',
                                oidXm: '',
                                xmname: '',
                                xmcode: '',
                                xmcylx: c.trim(),
                                name: '',
                                code: '',
                                deptName: '',
                                deptCode: ''
                            }
                            arr.push(obj);
                        })
                        this.mustRoleData = arr;
                    })
                    .catch(error => {

                    })
            },
            // 获取只能选择一个的角色
            getOneRole() {
                this.$axios.get("permission/app_constant/byCode", {
                    params: {
                        appCode: 'PMS',
                        code: 'XMONEPERSON'
                    }
                })
                    .then(result => {
                        this.ROLE_ONE = result.data.value.split(',').map((c) => {
                            return c.trim()
                        })
                    })
                    .catch(error => {

                    })
            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            ...mapMutations("datamapStore", ["addUndoTypeCodes"]),
            // 展示选中成员组件
            showVisible() {
                let members = JSON.parse(JSON.stringify(this.memberList));
                this.selectedmembersProp = members.map(c => {
                    if (c.name) {
                        return c;
                    }
                })
                this.visibleMember = !this.visibleMember;
                this.$nextTick(_ => {
                    this.$refs.sectMEM.emptyForm();
                    this.$refs.sectMEM.refresh();
                })

            },
            // 清空
            empty() {
                this.callbackData = [];
                this.removeMemberList = [];
            },
            // 选择成员回调
            handleCallbackMember(data) {
                this.memberList = data;
                this.memberList.map(item => {
                    item.deptName = item.deptShortName ? item.deptShortName : item.deptName;
                })
            },
            // 获取数据
            getData() {
                // 获取已经选择的项目成员类型
                let arrSectXmcylxs = this.memberList.map(c => {
                    return c.xmcylx;
                })
                // 必选验证
                let isMustPass = true
                this.MUST_ROLE.forEach((c) => {
                    if (arrSectXmcylxs.indexOf(c) < 0) {
                        console.log(c);
                        isMustPass = false
                    }
                })
                if (!isMustPass) {
                    this.$message.error('项目主管、项目第一责任人、行政负责人、技术负责人是必选!');
                    return;
                }
                return this.memberList;
            },
            // 获取删除数据
            getDeleteData() {
                // 获取删除角色
                let len = this.queryListXmcy.length;
                let delMember = [];
                if (len > 0) {
                    this.queryListXmcy.forEach((c) => {
                        if (c.oid && this.personIds.indexOf(c.oid) < 0) {
                            c.deleteStatus = 1;
                        }
                    })
                }
                console.log(this.initcydel)
                return this.initcydel
            },
            //删除项目新增成员
            deleteXmcy(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let memberIndex = this.memberList.findIndex((c) => {
                        return c.oidUser === row.oidUser && c.xmcylx === row.xmcylx;
                    })
                    this.memberList.splice(memberIndex, 1);
                }).catch(() => {
                    console.log('取消成功')
                })

            },
        }
    }
</script>

<style lang="less" scoped>
    .titleSlot {
        font-size: 16px;

        .dd {
            font-size: 12px;
            color: red;
            margin-left: 5px;
        }
    }
</style>

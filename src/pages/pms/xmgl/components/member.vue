<template>
    <div>
        <div style="height:540px;background: #f2f2f2;" class="abb">
            <el-row :gutter="10">
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">
                        <el-card class="box-card" style="height: 540px;">
                            <el-form :model="formData" :rules="rules" ref="form" v-loading="loading">
                                <el-form-item label="角色" label-width="50px" prop="xmcylx">
                                    <el-select v-model="formData.xmcylx" placeholder="请选择角色" @change="sectChange"
                                               style="width: 140px;">
                                        <el-option
                                                v-for="item in sectListNew"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        <span style="font-size: 12px;color: red;line-height:30px;font-weight: bold;margin-right: 5px;display: inline-block;width: 15px;">
                                            <span v-if="roleArrs.indexOf(item.value)>=0">*</span>
                                        </span>
                                            <span>{{ item.label}}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>

                            <ice-custom-tree ref="tree" sectNodeLevel="0" Width="190px" :unbrid="unbrid" :transfer="transfer.treeData"
                                             @handleCallback="handleCallbackTree"></ice-custom-tree>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="grid-content bg-purple-dark">
                        <!--<div class="search">-->
                        <!--<el-input @keyup.enter.native="getList" v-model="filterName" placeholder="检索：姓名" clearable>-->
                        <!--<i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"-->
                        <!--@click="getList"></i>-->
                        <!--</el-input>-->
                        <!--</div>-->
                        <!--<vxe-table-->
                        <!--size="mini"-->
                        <!--highlight-current-row-->
                        <!--height="427"-->
                        <!--:loading="tableloading"-->
                        <!--:data="list"-->
                        <!--@cell-dblclick="dbClick"-->
                        <!--@current-change="currentChangeEvent">-->
                        <!--<vxe-table-column field="name" title="姓名" width="150" type="html"></vxe-table-column>-->
                        <!--<vxe-table-column field="phone" title="联系电话" width="130" type="html"></vxe-table-column>-->
                        <!--<vxe-table-column field="deptShortName" title="部门" type="html"></vxe-table-column>-->
                        <!--</vxe-table>-->
                        <!--<vxe-pager-->
                        <!--background-->
                        <!--size="mini"-->
                        <!--:current-page="tablePage.currentPage"-->
                        <!--:page-size="tablePage.pageSize"-->
                        <!--:total="tablePage.totalResult"-->
                        <!--:layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump']"-->
                        <!--@page-change="handlePageChange">-->
                        <!--</vxe-pager>-->
                        <div style="height: 530px;">
                            <div class="ice-container">
                                <!--多选 -->
                                <ice-query-grid
                                        data-url="/permission/user/users_by_condition?cascade=true"
                                        codeProp="code"
                                        :lazy="false"
                                        :columns="columns"
                                        :chooseItem="chooseItemByRole"
                                        :selectedCodes="checkedCodes"
                                        ref="grid"
                                        :query="querys"
                                        :gridAutoRefresh="false"
                                        @selection-change="handleSectItem"
                                        :before-bind-data="dataFilter"
                                        pageLayout="total, sizes, prev, pager, next"
                                        exportTitle="科研项目信息"
                                >
                                </ice-query-grid>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple-dark">
                        <el-card class="box-card" style="height: 540px;">
                            <div slot="header" class="clearfix">
                                <span>选中的人</span>
                                <div style="float: right; padding: 3px 0;font-size: 10px;">
                                    <el-button type="text" @click="empty">清空</el-button>
                                </div>
                            </div>
                            <div style="height: 400px; overflow: auto;">
                                <div v-for="(o, index) in selectedmembers" :key="index" class="text item textitem"
                                     style="" :class="{active1: o.code==row.code}"
                                     @click="sectMember(o, index)">

                                    <div class="_right" v-if="forbidDelRole.indexOf(o.xmcylx)<0">

                                        <i class="el-icon-delete" name="移除该成员" @click.stop="delMember(o, index)"></i>
                                    </div>
                                    <div class="_left"><i class="tishi" style="" v-if="!o.zzsm"></i>{{o.name}} -<span>{{disposalData(o)}}</span>
                                    </div>
                                </div>
                            </div>

                        </el-card>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple-dark center">
                        <div class="person">
                            <span class="name">{{row.name}}</span>
                        </div>
                        <div class="slotwrapper">
                            <!--<ice-select @handleGetIndex="getIndex" v-model="formData.xmcylx" map-type-code="XMCYLX"-->
                            <!--filterable placeholder="请选择项目角色">-->
                            <!--</ice-select>-->
                            <el-form :model="row" ref="formbd" v-loading="loading">

                                <div class="shuoming">
                                    <div class="td">职责说明</div>
                                    <el-input v-model="row.zzsm" placeholder="不超过330个字" maxlength="330"
                                              show-word-limit type="textarea" :rows="22">
                                    </el-input>
                                </div>
                            </el-form>

                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="ice-button-bar">
            <el-button type="primary" @click="saveXzry">确定选择</el-button>
            <el-button type="info" @click="$emit('addXzcy')">关闭</el-button>
        </div>
    </div>
</template>

<script>
    import IceCustomTree from '@/components/common/pms/IceCustomTree';
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    import XEUtils from 'xe-utils'
    import {mapGetters, mapMutations} from 'vuex'


    export default {
        name: "member",
        components: {
            IceCustomTree,
            IceQueryGrid
        },
        props: {

            transfer: {
                required: true,
                type: Object,
                default: function () {
                    return {}
                }
            },
            unbrid: {
                default: true,
            },
            selectedmembersProp: {
                type: Array,
                default: function () {
                    return []
                }
            },
            sectList: {
                default: function () {
                    return []
                }
            },
            ROLE_ONE: {
                default: function () {
                    return []
                }
            },
            forbidDelRole: {
                default: function () {
                    return []
                }
            },
            mustRoleData: {
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                rules: {
                    xmcylx: [
                        {required: true, message: '请选择角色', trigger: 'change'}
                    ],
                },
                querys: [
                    {type: 'input', code: 'name', label: '姓名', value: ''},
                    {type: 'input', code: 'code', label: '编码', value: ''},
                    {
                        type: 'static', code: 'deptId', label: '父ID', value: () => {
                            return this.formModel.deptId
                        }
                    },
                    {
                        type: 'static', code: 'enabled', label: '父ID', value: 1
                    },
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: "姓名", code: "name"},
                    {label: "编码", code: "code", hidden: true},
                    {label: "电话", code: "phone"},
                    {label: "部门", code: "deptShortName"},
                ],
                filterName: '',
                tablePage: {
                    currentPage: 1,
                    pageSize: 10,
                    totalResult: 0
                },
                tableData: [],
                tableloading: false,
                formData: {
                    xmcylx: 'XMCYLX01',
                    zzsm: '',
                    index: '',
                    rolename: '',
                },
                depenameObj: {
                    deptName: ''
                },
                formModel: {
                    cascade: true,
                    size: 10,
                    current: 1,
                    conditionLink: 'OR',
                    deptId: '',
                    columns: [
                        'oid', 'name', 'code', 'phone', 'deptShortName'
                    ]
                },
                // 选中的人
                sectedPerson: {},
                // 选择的人
                selectedmembers: [],
                value: '',
                sectListNew: this.sectList,
                active: 0,
                loading: false,
                row: {},
                // 当前校色list
                currentList: []
            }
        },
        computed: {
            roleArrs() {
                return this.mustRoleData.map(c => {
                    return c.xmcylx
                })
            },
            list() {
                this.tableData = this.tableData && this.tableData.length > 0 ? this.tableData.filter(c => {
                    return this.crewCodes.indexOf(c.code) == -1 && c.enabled == 1;
                }) : this.tableData;
                return this.tableData
            },
            disabledInp() {
                return (this.formData.xmcylx && this.formData.zzsm) ? false : true
            },
            // 判定是否都输入了
            panding() {
                let abb = true;
                this.selectedmembers.forEach(function (c, i) {
                    // console.log(c);
                    if (!(c.xmcylx)) {
                        abb = false;
                    }
                })
                return abb;
            },
            crewCodes() {
                let data = this.getConstants()('GL_RY_CODE');
                if (data) {
                    return data;
                } else {
                    return [];
                }
            },
            chooseItemByRole() {
                if (this.formData.xmcylx) {
                    if (this.ROLE_ONE.indexOf(this.formData.xmcylx) != -1) {
                        return "single"
                    } else {
                        return 'multiple'
                    }
                } else {
                    return "none";
                }

            },
            checkedCodes() {
                return this.currentList.map(c => {
                    return c.code;
                })
            }
        },
        created() {
            this.addUndoTypeCodes({appCode: 'PMS', typeCode: 'GL_RY_CODE'})
        },
        watch: {
            selectedmembersProp: {
                handler: function (val, oldVal) {
                    this.selectedmembers = this.selectedmembersProp;
                },
                immediate: true
            },
            mustRoleData() {
                console.log(this.mustRoleData, 'mustRoleData')
            },
            'formData.xmcylx'() {
                this.currentList = this.selectedmembers.filter(c => {
                    return c.xmcylx == this.formData.xmcylx
                })
            },
            selectedmembers() {
                this.currentList = this.selectedmembers.filter(c => {
                    return c.xmcylx == this.formData.xmcylx
                })
                console.log(this.currentList, 'current')
            },
        },
        methods: {
            // 刷新
            refresh() {
                if (!this.formModel.deptId) {
                    return;
                }
                this.$nextTick(_ => {
                    this.$refs.grid.cleanQuickQuery();
                    this.$refs.grid.refresh();
                })
            },
            // 清空
            empty() {
                this.$confirm('确定清空操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$refs.grid.cleanColumnSelect();
                    this.currentList = [];
                    this.selectedmembers = [];
                })


            },
            // 过滤三元
            dataFilter(data) {
                return data && data.length > 0 ? data.filter(c => {
                    return this.crewCodes.indexOf(c.code) == -1;
                }) : data;
            },
            ...mapMutations('constant', ['addUndoTypeCodes']),
            ...mapGetters('constant', ['getConstants']),
            handleSectItem(rows, removerows) {
                console.log(rows, removerows, 'fsdfsdfdas')
                let sectRows = JSON.parse(JSON.stringify(rows));
                sectRows.map(c => {
                    c.xmcylx = this.formData.xmcylx;
                })
                let arr = this.selectedmembers.filter(c => {
                    return this.formData.xmcylx == c.xmcylx;
                })
                // 选择回调
                if (this.chooseItemByRole == 'multiple') {
                    if (removerows && removerows.length > 0) {
                        arr = arr.filter(item => !removerows.find(rm => rm.code == item.code))
                    }
                    if (sectRows.length>0) {
                        let sectItem = sectRows.filter(item => !arr.find(o => o.code == item.code))
                        console.log(sectItem, 'sectItem')
                        arr = [...arr, ...sectItem]
                    }
                } else {
                    arr = sectRows;
                }

                //
                this.selectedmembers = this.selectedmembers.filter(c => {
                    return c.xmcylx != this.formData.xmcylx;
                })
                this.selectedmembers = [...this.selectedmembers, ...arr];
            },
            // 清空输入迎
            emptyForm() {
                this.$nextTick(_ => {
                    this.$refs.formbd.resetFields();
                    this.sectedPerson = {};
                })
                this.sectedPerson = {};

            },
            // 下拉选择值发生改变
            sectChange(val) {
                this.$refs.grid.$refs.eltable.refreshColumn();
                this.$refs.grid.$refs.eltable.recalculate(true);
                if (this.chooseItemByRole == 'single') {
                    this.$refs.grid.cleanColumnSelect();
                } else {
                    this.$refs.grid.refresh();
                }
            },
            // 确定选择
            saveXzry() {
                console.log(this.selectedmembers)
                if (this.panding) {
                    const mem = JSON.parse(JSON.stringify(this.selectedmembers));
                    mem.map((c) => {
                        if (!c.oidUser) {
                            c.oidUser = c.oid;
                            delete c.oid;
                        }
                    })
                    // 确定回调
                    this.$emit('handleCallback1', mem);
                    // 关闭弹窗
                    this.$emit('addXzcy');
                } else {
                    this.$message.error('有成员为选择角色！');
                }
            },
            // 移除选中成员
            delMember(row, index) {

                let index1 = this.selectedmembers.findIndex(c => {
                    return c.code == row.code && c.xmcylx == this.formData.xmcylx
                })
                console.log(index1, 'index1');
                if (index1 != -1) {
                    let a = this.selectedmembers.splice(index1, 1);
                    console.log(this.selectedmembers, 'sect', a)

                    this.$refs.grid.closeSelection(row.code);
                }
            },
            // 选择成员
            sectMember(row, index) {
                this.row = row;
            },
            // 获取数据点击下标
            getIndex(val) {
                this.formData.index = val + 1;
                this.sortMembers();
            },
            // 排序
            sortMembers() {
                this.selectedmembers = this.selectedmembers.sort(function (a, b) {
                    if (a.index && b.index) {
                        return a.index > b.index
                    } else {
                        return false;
                    }
                })
            },
            // 单元格双击
            dbClick(row, rowIndex) {
                let hang = Object.assign({}, row.row);
                let isOid = this.selectedmembers.find((val) => {
                    return (val.oidUser ? val.oidUser : val.oid) === hang.oid;
                })
                this.sectedPerson = hang;
                this.sectMember(this.sectedPerson);
                if (!isOid) {
                    this.selectedmembers.push(hang);
                    this.active = hang.oid;
                }
            },
            // 点击树回调
            handleCallbackTree(val) {
                // console.log(val, 'val')
                this.formModel.deptId = val.oid;
                this.depenameObj.deptName = val.deptName;
                this.$refs.grid.refreshAndPageReset();
                // this.getList();
            },
            // 分页函数
            handlePageChange(val) {
                this.tablePage.currentPage = val[0].currentPage;
                this.formModel.current = val[0].currentPage;
                this.getList();
            },
            // 数据整理 赋值
            disposalData(item) {
                if (item.xmcylx) {
                    let _map = this.sectList.filter((c) => {
                        return c.value === item.xmcylx
                    })
                    return _map[0].label
                } else {
                    return '';
                }

            }
        }
    }
</script>

<style lang="less" scoped>
    .center {
        text-align: center;
    }

    .abb .el-select {
        display: block;
    }

    .textitem {
        margin-bottom: 5px;
        line-height: 30px;
        padding: 0 10px;
        &::after {
            content: "";
            display: block;
            clear: both;
        }
        ._left {

        }
        ._right {
            float: right;
            cursor: pointer;
        }
    }

    .active1 {
        background: rgba(0, 209, 198, 0.3);
    }

    .search {
        text-align: right;
    }

    .search /deep/ .vxe-input--wrapper .vxe-input {
        width: 300px;
    }

    .person {
        font-size: 14px;
        line-height: 30px;
        height: 30px;

    }

    .btn {
        margin-top: 5px;
        text-align: right;
    }

    .shuoming {
        .td {
            font-size: 18px;
            margin: 15px 0;
        }
    }

    .tishi {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f30213;
        margin-right: 5px;
        margin-left: -10px;
    }

    .abb /deep/ .search input {
        width: 100% !important;
    }
</style>

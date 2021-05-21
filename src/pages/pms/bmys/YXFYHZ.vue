<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="200px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years" v-if="years">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in years"
                             :key="item.oid" @click="handleClickYear(index)">
                            {{item.year}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-aside width="250px" class="asideLeft2" style="padding-left: 10px">
                <el-card class="box-card" style="height: 99%;position: relative;">
                        <ice-tree load-url="/pms/Xminfo/treeByDeptCode?deptCode=9003"
                                  label-prop="deptName"
                                  value-prop="deptCode"
                                  node-key="deptCode"
                                  class="tree"
                                  @node-click="nodeClick"
                                  :lazy="false"
                                  ref="iceGriddept"
                        >

                        </ice-tree>
<!--                    <ice-custom-tree class="tree" Width="200px" :unbrid="unbrid" :transfer="transfer.treeData"-->
<!--                                     @handleCallback="handleCallbackTree"></ice-custom-tree>-->
<!--                    <ice-tree load-url="/permission/frame_org/load_table_tree?loadDisabled=false"-->
<!--                              label-prop="deptName"-->
<!--                              value-prop="deptCode"-->
<!--                              node-key="deptCode"-->
<!--                              class="tree"-->
<!--                              height="500px"-->
<!--                              @node-click="nodeClick"-->
<!--                              :lazy="true"-->
<!--                              ref="iceGridxmly"-->
<!--                    >-->
<!--                    </ice-tree>-->

                </el-card>

            </el-aside>
            <el-main style="position: relative;">
                <pms-main-hint :mannavs="mannavs"></pms-main-hint>
                <div class="buttons">
                    <el-button type="success" @click="changeRecord">变更记录</el-button>
<!--                    <el-button type="primary" @click="approve">审批</el-button>-->
                    <el-button type="success" @click="exportDoc" v-if="tablist.data.pmsDeptYsVo!=null">导出</el-button>
                </div>
                <bmys-table :tablist="tablist"></bmys-table>
            </el-main>
        </div>
    </div>
</template>

<script>
    import pmsMainHint from './components/pmsMainHint'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import bmysTable from './components/bmysTable'
    import IceTree from "../../../components/common/base/IceTree";

    function nearThreeYears() {
        let date = new Date();
        let currentYear = date.getFullYear();
        return [currentYear - 1, currentYear, currentYear + 1]
    }

    export default {
        name: "BMFYYS",
        components: {
            pmsMainHint,
            IceDialog,
            IceCustomTree,
            bmysTable,
            IceTree
        },
        data() {
            return {
                Border: true,
                visible: false,
                years: [],
                active: 0,
                formModel1: {
                    year: ''
                },
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
                unbrid: true,
                tableData: [],
                index: 0,
                vxeHeight: '',
                formModel: {
                    oidDept: ''
                },
                getYearsFormModel: {
                    current: 1,
                    size: 100,
                    sortOrder: 'DESC',
                    conditionLink: 'AND',
                    columns: ['oid', 'year', 'spr', 'spzt', 'yxysDateSp', 'businessDataId', 'actInstId'],
                },
                deptMsg: {},
                oidDept: '',
                saveFormModel: {
                    oidYsnf: '',// 年份id
                    year: '',
                    oidYsdept: '',
                    oidDept: '', // 部门id
                    deptCode: '', //部门编码
                    deptName: '', //部门名称
                    oidYsitem: '',
                    ysxm: '',//预算项目
                    yscode: '', //预算编号
                    ysje: '', //预算金额
                    oid: '',
                    dataPxh: '', // 预算项排序号
                    operationIdentification: '', // 删除传 d
                    dateRemark: '',//备注
                },
                loading: false,
                deptOid: '',
                deptName: '',
                tablist: {
                    data: {
                        pmsDeptYsVo: null
                    }
                }
            }
        },
        computed: {
            deptCode() {
                return this.$userInfo.deptCode
            },
            // 近三年
            options() {
                return nearThreeYears();
            },
            // 面包屑导航 部门信息
            mannavs() {
                return [
                    {
                        'name': '当前部门',
                    },
                    {
                        'name': this.deptName ? this.deptName : "",
                    },
                ]
            },
            // 计算小计合计
            tableComputedData() {

            }
        },
        created() {
            // this.tableData = window.MOCK_DATA_LIST.slice(0, 6)
            // this.$nextTick(() => {
            //     this.vxeHeight = this.$refs.tab.offsetHeight - 10 + 'px';
            // })
            // this.handleAddYear();
            this.getDeptMsg();

            this.formModel1.year = this.options[1];
        },
        methods: {
            nodeClick (key, node) {
                this.handleCallbackTree(node.data)
            },
            // 获取年份
            getYears() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("/pms/PmsDeptYsnf/list", {params: this.getYearsFormModel})
                        .then(result => {
                            this.years = result.data.records;
                            resolve(result)
                        })
                        .catch(error => {
                            reject()
                            this.$message.error("获取年份数据失败");
                        })
                        .finally(_ => {

                        })
                })
            },
            // 获取部门信息
            getDeptMsg() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("/pms/PmsDeptYsdept/deptInfoByCode", {params: {deptCode: this.deptCode}})
                        .then(result => {
                            this.formModel = result.data.oidDept;
                            this.deptMsg = result.data;
                            resolve(result)
                        })
                        .catch(error => {
                            reject()
                            this.$message.error("获取部门数据失败");
                        })
                        .finally(_ => {
                            this.loadingXzry = false;
                        })
                })
            },
            //部门树
            async handleCallbackTree(data) {
                this.deptOid = data.oid;
                this.deptName = data.deptName;
                if (this.years.length <= 0) {
                    await this.getYears();
                }
                this.getRightList();
            },
            // 获取右边列表
            getRightList() {
                let params = {
                    year: this.years[this.active].year,
                    oidDept: this.deptOid
                }
                this.loading = true;
                this.$axios.get("/pms/PmsDeptYsitem/listByOidYsdfAndOidYsdept", {params: params})
                    .then(result => {
                      this.tablist = result;
                    })
                    .catch(error => {
                        this.$message.error("获取右边列表失败");
                    })
                    .finally(_ => {
                        this.dellist = [];
                        this.loading = false;
                    })
            },
            // hover
            handleClickYear(index) {
                this.active = index;
                this.getRightList();

            },
            changeRecord() {
                let a = JSON.stringify({
                    oidYsnf: this.years[this.active].oid,
                    oidDdept: this.deptOid,
                    deptName: this.deptName,
                });
                this.$router.push("/pms/bmys/bmysbgjl?data0=" + a)
            },
            //导出
            exportDoc() {
                let params = {
                    year: this.years[this.active].year,
                    oidDept: this.deptOid
                }
                this.$axios.get("/pms/PmsDeptYsitem/ysExport", {params: params})
                    .then(result => {

                    })
                    .catch(error => {
                        this.$message.error(error.msg)
                    })
                    .finally(_ => {
                        this.loadingDb = false
                    })
            },
            //审批
            approve() {
                if (this.years[this.active].yxysDateSp) {
                    this.$message.warning('该年份汇总已审批！');
                    return;
                }
                if (this.years[this.active].businessDataId) {
                    this.$message.warning('该年份汇总已提交审批,正在审批中。。。');
                    return;
                }
                let a = JSON.stringify({
                    oidYsnf: this.years[this.active].oid,
                    year: this.years[this.active].year,
                });
                this.$router.push("/pms/bmys/yxfyhz_flow?data0=" + a)
            },
            colspanMethod({row, rowIndex, column, columnIndex, data}) {


            },
            editClosedEvent({row, column}, event) {
                let tabdata = this.$refs.vxetable.getTableData().tableData;
                let basic = this.$refs.vxetable.getTableData().tableData.slice(2, 9);
                let other = this.$refs.vxetable.getTableData().tableData.slice(10);
                console.log(column.title === "预算金额")
                if (column.title === "预算金额") {
                    let t = basic.reduce((total, item) => {
                        if (item.ysje) {
                            return total + item.ysje * 1;
                        } else {
                            return total;
                        }
                    }, 0)
                    let b = other.reduce((total, item) => {
                        if (item.ysje) {
                            return total + item.ysje * 1;
                        } else {
                            return total;
                        }

                    }, 0)
                    let total = t + b;
                    this.tableData[0].ysje = total;
                    this.tableData[1].ysje = t;
                    this.tableData[9].ysje = b;
                }
            }

        }
    }
</script>

<style lang="less" scoped>
    .con_tainer {
        padding: 15px;

        button {
            font-size: 20px;
            line-height: 25px;

            span {
                color: #666;
                font-size: 16px;
                vertical-align: top;
            }

            i {
                color: #59fb22;
                display: inline;
            }
        }

        .years {
            margin-left: 10px;
            margin-top: 20px;

            .year {
                padding-left: 20px;
                font-size: 16px;
                margin-bottom: 10px;
                color: #555;
                line-height: 30px;
                position: relative;

                &:hover {
                    background: rgba(0, 209, 108, 0.5);
                }

                .sanjiao {
                    position: absolute;
                    right: -15px;
                    width: 0;
                    height: 0;
                    border-top: 15px solid transparent;
                    border-right: 0;
                    border-bottom: 15px solid transparent;
                    border-left: 15px solid #00D1B2;
                    top: 0;
                    display: none;

                }
            }

            .yearSected {
                background: #00D1B2;
                color: #eeeeee;

                .sanjiao {
                    display: block;
                }
            }
        }
    }

    .asideLeft {
        border: 1px solid #ddd;
        box-shadow: 0px 1px 1px 1px #ddd;
    }

    .buttons {
        margin-bottom: 10px;

        i {
            margin-right: 5px;
        }
    }

    .tab {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 0;
        top: 120px;
    }
    .tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

    }
    .asideLeft2 /deep/ .tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 15px;
        width: auto !important;
        overflow-y: auto;
    }
</style>

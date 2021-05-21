<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="callBackSuccess" :showsecrethint=true>
            <div class="abb" >
                <div class="ice-container">
                    <div class="el-container">
                        <el-aside width="200px" class="asideLeft">
                            <div class="con_tainer">
                                <div class="years" v-if="years">
                                    <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in years"
                                         :key="index" @click="handleClickYear(index)">
                                        {{item}}
                                        <div class="sanjiao"></div>
                                    </div>
                                </div>
                            </div>
                        </el-aside>
                        <el-aside width="250px" class="asideLeft2">
                            <el-card class="box-card" style="height: 99%;">
                                <ice-custom-tree Width="200px" :unbrid="unbrid" :transfer="transfer.treeData"
                                                 @handleCallback="handleCallbackTree"></ice-custom-tree>

                            </el-card>

                        </el-aside>
                        <el-main style="position: relative;">
                            <div class="ice-container">
                                <pms-main-hint :mannavs="mannavs"></pms-main-hint>
                                <!--                <div class="buttons">-->
                                <!--                    <el-button type="success" @click="changeRecord">变更记录</el-button>-->
                                <!--                </div>-->
                                <bmys-table :tablist="tablist" ref="bmystable"></bmys-table>
                            </div>

                        </el-main>
                    </div>
                </div>
            </div>


        </ice-flow-form>
    </div>
</template>

<script>
    import pmsMainHint from './components/pmsMainHint'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import bmysTable from './components/bmysTable'

    export default {
        name: "BMFYYS_FLOW",
        components: {
            pmsMainHint,
            IceDialog,
            IceCustomTree,
            IceFlowForm,
          bmysTable
        },
        data() {
            return {
              tablist: {},
                Border: true,
                visible: false,
                isFirst: true,
                totalSum: 0,
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
                    columns: ['oid', 'year']
                },
                deptMsg: {},
                // 删除的列表
                dellist: [],
                listId: [],
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
            }
        },
        computed: {
            deptCode() {
                return this.$userInfo.deptCode
            },
            info() {
                let data = JSON.parse(this.$route.query.data0);
                return data;
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
            this.getYears();
        },
        methods: {
            flowReady(flowContext, bizdata) {
                //流程初始化
                Object.assign(this.tableData, bizdata);
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                flowContext.processVar = {money: this.totalSum}//流程分支条件
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                let json = {
                    pmsDeptYsVo: [{oidYsnf: this.info.oidYsnf, dataSecretLevcode: 2, year: this.info.year}],
                    year: this.info.year,//用于标题
                }
                return json;
            },
            callBackSuccess(data) {
                console.log(data)
                console.log(this.$refs.flowForm.flowInstData)
            },
            // 获取年份
            getYears() {
                let year = this.info.year;
                this.years = [year];
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
                            this.$message.error("保存失败");
                        })
                        .finally(_ => {
                            this.loadingXzry = false;
                        })
                })
            },
            //部门树
            handleCallbackTree(data) {
                this.deptOid = data.oid;
                this.deptName = data.deptName;
                this.getRightList();
            },
            // 获取右边列表
            getRightList() {
                this.loading = true;
                let params = {
                    year: this.years[0],
                    oidDept: this.deptOid
                }
                this.$axios.get("/pms/PmsDeptYsitem/listByOidYsdfAndOidYsdept", {params: params})
                    .then(result => {
                      this.tablist = result;
                    })
                    .catch(error => {
                        this.$message.error("获取失败");
                    })
                    .finally(_ => {
                        this.dellist = [];
                        this.loading = false;
                    })
            },
            rowStyle({row, rowIndex}) {
                if ([0, 1, 9].includes(rowIndex)) {
                    return {
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        fontWeight: 'bold'
                    }
                }
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
            addNode() {

            },
            colspanMethod({row, rowIndex, column, columnIndex, data}) {


            },
            // 禁用编辑
            activeCellMethod({row, rowIndex, column, columnIndex}) {
                if (rowIndex <= 9 && rowIndex > -1) {
                    if (columnIndex === 1 || rowIndex == 0 || rowIndex == 1 || rowIndex == 9) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            },
            editClosedEvent({row, column}, event) {
                let tabdata = this.$refs.vxetable.getTableData().tableData;
                let basic = this.$refs.vxetable.getTableData().tableData.slice(2, 9);
                let other = this.$refs.vxetable.getTableData().tableData.slice(10);
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
        top: 80px;
    }
    .abb {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 100px;
        width: 100%;
    }
</style>
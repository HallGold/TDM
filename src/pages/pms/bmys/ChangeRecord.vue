<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years" v-if="years">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in years"
                             :key="item" @click="handleClickYear(index)">
                            {{item}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main style="position: relative;">
                <pms-main-hint :mannavs="mannavs"></pms-main-hint>
                <div class="buttons">
                    <el-button type="success" @click="closePage">返回</el-button>
                </div>
                <bmys-table :tablist="tablist" ref="bmystable"></bmys-table>
            </el-main>
        </div>
    </div>
</template>

<script>
    import pmsMainHint from './components/pmsMainHint'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import bmysTable from './components/bmysTable'

    export default {
        name: "ChangeRecord",
        components: {
            pmsMainHint,
            IceDialog,
            IceCustomTree,
          bmysTable
        },
        data() {
            return {
                years: [],
                active: 0,
                loading: false,
                vxeHeight: '',
                Border: true,
                tableData: [],
                data: [],
                tablist: {}
            }
        },
        computed: {
            info() {
                let data = JSON.parse(this.$route.query.data0);
                // console.log(data)
                return data;
            },
            // 面包屑导航 部门信息
            mannavs() {
                return [
                    {
                        'name': '当前部门',
                    },
                    {
                        'name': this.info.deptName ? this.info.deptName : "",
                    },
                ]
            },
        },
        created() {
            this.getData();
        },
        methods: {
            handleClickYear(index) {
                this.active = index;
                let newData = this.data.filter(e => e.yxysDateSp === this.years[index])
                this.Arrangement(newData);
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
            colspanMethod({row, rowIndex, column, columnIndex, data}) {

            },
            getData() {
                this.$axios.get("/pms/PmsDeptYsitem/changeRecord", {
                    params: {
                        oidYsnf: this.info.oidYsnf,
                        oidDdept: this.info.oidDdept,
                    }
                })
                    .then(result => {
                        console.log(result, 'result')
                        this.years = result.data.recordTime;
                        this.data = result.data.pmsDeptYsVo;
                        this.handleClickYear(0)
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取失败!");
                    })
                    .finally(_ => {

                    })
            },
            closePage() {
                this.$router.go(-1);
            },
            Arrangement(data) {
                let base = data.filter(o => o.dataPxh <= 7);
                let other = data.filter(o => o.dataPxh > 7);
                let BasicOperationCost = this.sum(base);
                let DepartmentManagementFee = this.sum(other);
                let obj = {
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
                    operationIdentification: '' // 删除传 d
                }
                // 添加年份
                obj.ysxm = '合计';
                obj.ysje = BasicOperationCost * 1 + DepartmentManagementFee * 1;
                let abb = Object.assign({}, obj)
                data.splice(0, 0, abb);
                // 基本运行费
                obj.ysxm = '基本运行费';
                obj.ysje = BasicOperationCost;
                let abb2 = Object.assign({}, obj)
                data.splice(1, 0, abb2);
                // 部门管理费
                obj.ysxm = '部门管理费';
                obj.ysje = DepartmentManagementFee;
                let abb3 = Object.assign({}, obj);
                data.splice(9, 0, abb3);
                this.tableData = data;
                // 赋值
                this.$refs.bmystable.fz(this.tableData);
            },
            sum(result) {
                let sum = 0.0;
                result.forEach((item) => {
                    sum += item.ysje;
                });
                return sum;
            },
        },
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
</style>

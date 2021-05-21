<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <el-button icon="el-icon-circle-plus" type="text" style=""
                               @click="handleToggleYear">
                        <span>新增</span>
                    </el-button>
                    <div class="years" v-if="years">
                        <div class="year" :class="{yearSected: item.year==activeYear}" v-for="(item, index) in years"
                             :key="item.oid" @click="handleClickYear(item.year, index)">
                            {{item.year}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main style="position: relative;">
                <!--                <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData" :btn-extend1="alterationAssign">-->
                <div class="ice-container">
                    <pms-main-hint :mannavs="mannavs"></pms-main-hint>
                    <div class="buttons">
                        <el-button type="primary" @click="approve"><i class="el-icon-plus"></i>申报</el-button>
                        <el-button type="success" @click="refresh"><i class="el-icon-plus"></i>刷新</el-button>
                        <el-button type="success" @click="flowPage" :disabled="change">变更</el-button>
                        <el-button type="success" @click="changeRecord">变更记录</el-button>
                        <el-button type="success" @click="exportDoc" v-if="tablist.data.pmsDeptYsVo!=null">导出</el-button>
                    </div>
                    <bmys-table :tablist="tablist" :is-edit="isEdit" ref="bmysTable"
                                @getTableInit="getTableInit"></bmys-table>
                </div>
            </el-main>
        </div>
        <!--添加年份-->
        <ice-dialog title="添加年份" :visible.sync="visible" width="300px;">
            <el-form :model="formModel1" ref="form">
                <div style="margin: 20px 0 50px 0;">
                    <el-select v-model="formModel1.year" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="(item, index) in options"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
            </el-form>
            <!--模态框底部定义按钮-->
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleAddYear">保存</el-button>
                <el-button type="info" @click="visible=false">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import pmsMainHint from './components/pmsMainHint'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import moment from 'moment'
    import bmysTable from './components/bmysTable'
    import {SPZT} from "../../../utils/constant";

    function nearThreeYears() {
        let date = new Date();
        let currentYear = date.getFullYear();
        return [currentYear - 1, currentYear, currentYear + 1]
    }

    export default {
        name: "BMFYYS",
        components: {
            IceFlowForm,
            pmsMainHint,
            IceDialog,
            bmysTable
        },
        data() {
            return {
                tablist: {
                    data: {
                        pmsDeptYsVo: null
                    }
                },
                alterationAssign: '',
                Border: true,
                visible: false,
                version: 1,
                years: [],
                editConfig: {trigger: 'click', mode: 'cell', activeMethod: this.activeCellMethod},
                active: 0,
                activeYear: moment(new Date).format('YYYY'),
                isdisabled: true,
                formModel1: {
                    year: ''
                },

                BasicOperationCost: 0.00,
                DepartmentManagementFee: 0.00,
                tableData: [],
                index: 0,
                vxeHeight: '',
                formModel: {
                    oidDept: ''
                },
                isEdit: false,
                getYearsFormModel: {
                    current: 1,
                    size: 100,
                    sortOrder: 'DESC',
                    conditionLink: 'AND',
                    columns: ['oid', 'year', 'spr', 'spzt', 'yxysDateSp']
                },
                deptMsg: {},
                // 删除的列表
                dellist: [],
                listId: [],
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
                businessDataId: '',
                spzt: '',
                tableData: []
            }
        },

        computed: {
            change() {
                if ((this.businessDataId == null || this.businessDataId == '') && this.spzt == SPZT.YSP && this.BasicOperationCost != 0) {
                    //按钮可点击
                    console.log('按钮可点击')
                    return false;
                } else {
                    //按钮不可点击
                    console.log('按钮不可点击')
                    return true;
                }
            },
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
                        'name': this.deptMsg ? this.deptMsg.deptName : "",
                    },
                ]
            },
            // 计算小计合计
            tableComputedData() {

            }
        },
        created() {
            // this.refresh();
            this.getDeptMsg().then(date => {
                this.getYears().then(res => {
                    if (res.data.records) {
                        this.getRightList()
                    }
                });
            });

            this.formModel1.year = this.options[1];

        },
        methods: {
            getTableInit(data) {
                this.tableData = data;
                // console.log(data)
                var businessDataId = '';

                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].nextBusinessDataId) {
                        businessDataId = this.tableData[i].nextBusinessDataId;
                        break;
                    }
                }
                this.businessDataId = businessDataId;
                let spzt = '';
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].spzt) {
                        spzt = this.tableData[i].spzt;
                        break;
                    }
                }

                this.spzt = spzt;
                // console.log(this.businessDataId)
            },
            refresh() {
                this.getDeptMsg().then(date => {
                    this.getYears().then(res => {
                        if (res.data.records) {
                            this.getRightList()
                        }
                    });
                });
                this.formModel1.year = this.options[1];
            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                Object.assign(this.formModel, bizdata);
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                this.$refs.form.validate((valid) => {
                    if (!valid) return false;
                    flowContext.processVar = {a: 10, ab12: 1001, ab1: 2};
                    return true;
                });
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                return this.saveData();
            },
            // 新增年份弹窗展示隐藏
            handleToggleYear() {
                this.visible = !this.visible;
            },
            // 新增年份
            handleAddYear() {
                this.$axios.post("/pms/PmsDeptYsnf/saveOrUpdate", this.formModel1)
                    .then(result => {
                        this.$message.success("保存成功");      //保存完毕之后的提示
                    })
                    .catch(error => {
                        this.$message.error("保存失败");
                    })
                    .finally(_ => {
                        this.getYears();
                        this.visible = false;
                    })
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
                            this.$message.error("保存失败");
                        })
                        .finally(_ => {
                            let index = this.years.findIndex((c) => {
                                return c.year === this.activeYear
                            })
                            this.active = index;
                            this.getRightList();
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
                            this.$message.error("保存失败");
                        })
                        .finally(_ => {
                            this.loadingXzry = false;
                        })
                })
            },
            // 获取右边列表
            getRightList() {
                this.loading = true;
                let params = {
                    year: this.activeYear,
                    oidDept: this.deptMsg.oidDept
                }
                this.$axios.get("/pms/PmsDeptYsitem/listByOidYsdfAndOidYsdept", {params: params})
                    .then(result => {
                        console.log(result, 'result')
                        this.BasicOperationCost = result.data.basicOperationCost ? result.data.basicOperationCost : 0;
                        this.tablist = result;
                    })
                    .catch(error => {
                        this.$message.error("获取失败");
                    })
                    .finally(_ => {
                        this.dellist = [];
                        this.loading = false;
                        // if (this.years[this.active].yxysDateSp) {
                        //     this.isEdit = false;
                        // } else {
                        //     this.isEdit = true;
                        // }
                    })
            },
            // hover
            handleClickYear(year, index) {
                this.active = index;
                this.activeYear = year;
                this.getRightList();

            },
            saveData() {
                let newdata = this.$refs.bmysTable.getData();
                newdata.map((c) => {
                    c.oidYsnf = this.years[this.active].oid;
                    c.oidDept = this.deptMsg.oidDept;
                    c.deptCode = this.deptMsg.deptCode;
                    c.deptName = this.deptMsg.deptName;
                    c.year = this.years[this.active].year;
                    c.dataSecretLevcode = '';
                    c.version = this.version;
                })
                let lastData = newdata.filter(o => {
                    return !(o.dataPxh > 7 && o.lysje && !o.ysje)
                })
                return lastData;
            },
            // 保存
            handleSave() {
                if (this.years[this.active].yxysDateSp) {
                    this.$message.warning('该年份汇总已审批！修改请走变更！');
                    return;
                }
                this.$axios.post("/pms/PmsDeptYsitem/saveYsDeptAndYsItem", {
                    pmsDeptYsVo: this.saveData(),
                    BasicOperationCost: this.BasicOperationCost,
                    DepartmentManagementFee: this.DepartmentManagementFee,
                })
                    .then(result => {
                        this.$message.success("保存成功");
                        this.refresh();
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("保存失败!" + error.msg);
                    })
                    .finally(_ => {
                        this.loadingXzry = false;
                    })
            },
            // 刷新
            refresh() {
                this.getRightList();
            },
            //审批
            approve() {
                // this.tablist
                // let spzt = '';
                // if (this.tablist.data.pmsDeptYsVo){
                //     spzt = this.tablist.data.pmsDeptYsVo[2].spzt;
                // }
                if (this.spzt == 'SPZT20') {
                    this.$message.warning('正在审批中。。。');
                    return;
                }
                if (this.spzt == 'SPZT30' && this.BasicOperationCost != 0) {
                    this.$message.warning('修改请点击变更按钮！');
                    return;
                }
                // console.log(this.tablist.data)
                let a = JSON.stringify({
                    oidYsnf: this.years[this.active].oid,
                    oidDept: this.deptMsg.oidDept,
                    oidYsdept: this.tablist.data.pmsDeptYsVo ? this.tablist.data.pmsDeptYsVo[2].oidYsdept : '',
                    year: this.years[this.active].year,
                    deptCode: this.deptMsg.deptCode,
                    deptName: this.deptMsg.deptName,
                    dataSecretLevcode: '2',
                    version: this.version
                });
                // console.log(a)
                this.$router.push("/pms/bmys/bmfyys_flow?data0=" + a)
            },
            //变更
            flowPage() {
                if (!this.tablist.data.pmsDeptYsVo) {
                    this.$message.warning('请点击审批按钮！');
                    return;
                }
                console.log(this.businessDataId)
                console.log(this.tablist.data)
                let a = JSON.stringify({
                    oidYsnf: this.years[this.active].oid,
                    oidDept: this.deptMsg.oidDept,
                    oidYsdept: this.tablist.data.pmsDeptYsVo ? this.tablist.data.pmsDeptYsVo[2].oidYsdept : '',
                    year: this.years[this.active].year,
                    deptCode: this.deptMsg.deptCode,
                    deptName: this.deptMsg.deptName,
                    dataSecretLevcode: '',
                    version: this.version
                });
                console.log(a)
                this.$router.push("/pms/bmys/bmfyys_flow?data0=" + a)
            },
            //变更记录
            changeRecord() {
                let a = JSON.stringify({
                    oidYsnf: this.years[this.active].oid,
                    oidDdept: this.deptMsg.oidDept,
                    deptName: this.deptMsg.deptName,
                });
                this.$router.push("/pms/bmys/bmysbgjl?data0=" + a)
            },
            //导出
            exportDoc() {
                let params = {
                    year: this.activeYear,
                    oidDept: this.deptMsg.oidDept
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

        },
        watch: {
            $route(New, old) {
                if (New.path === '/pms/bmys/bmfyys' && old.path === '/pms/bmys/bmfyys_flow') {
                    this.refresh();
                }
            }
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

    .jeInpbox /deep/ input {
        text-align: right;
    }

</style>

<template>
    <div class="ice-container">
        <div class="el-container">
            <el-main style="position: relative;">
                <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                               :flowBizData="flowBizData" :showsecrethint=true>
                    <div slot-scope="flowScope">
                        <!--                    <pms-main-hint :mannavs="mannavs"></pms-main-hint>-->
                        <!--                    <div class="buttons">-->
                        <!--                        <el-button type="primary" @click="handleSave"><i class="el-icon-plus"></i>保存</el-button>-->
                        <!--                        <el-button type="success" @click="refresh"><i class="el-icon-plus"></i>刷新</el-button>-->
                        <!--                        <el-button type="success" @click="flowPage">变更记录</el-button>-->
                        <!--                    </div>-->
                        <bmys-table :tablist="tablist" :is-edit="isEdit" ref="bmysTable"></bmys-table>
                    </div>
                </ice-flow-form>
            </el-main>
        </div>
    </div>
</template>

<script>
    import pmsMainHint from './components/pmsMainHint'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import bmysTable from './components/bmysTable'
    import moment from 'moment';

    export default {
        name: "BMFYYS_FLOW",
        components: {
            IceFlowForm,
            pmsMainHint,
            IceDialog,
            bmysTable
        },
        data() {
            return {
                alterationAssign: '',
                Border: true,
                visible: false,
                editConfig: {trigger: 'click', mode: 'cell', activeMethod: this.activeCellMethod},
                active: 0,
                formModel1: {
                    year: ''
                },
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
                tableData: [],
                BasicOperationCost: 0.00,
                DepartmentManagementFee: 0.00,
                tablist: {},
                isEdit: true,
            }
        },
        computed: {
            info() {
                let data = JSON.parse(this.$route.query.data0);
                // console.log(data)
                return data;
            },
            deptCode() {
                return this.$userInfo.deptCode
            },
        },
        created() {

        },
        methods: {
            flowReady(flowContext, bizdata) {
                //流程初始化
                console.log(flowContext.getFormReadonly())
                this.isEdit = !flowContext.getFormReadonly();
                let flowData = this.$refs.flowForm.flowInstData;
                if (flowData.proOperates != null) {
                    let bizData = JSON.parse(flowData.currentBizData.bizData);
                    let data = {
                        data: bizData
                    }
                    this.tablist = data;
                    // this.$refs.bmysTable.Arrangement(bizData.pmsDeptYsVo, bizData.basicOperationCost, bizData.departmentManagementFee);
                } else {
                    this.initData();
                }
                this.editable(flowData.proOperates);
                Object.assign(this.tableData, bizdata);
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                // this.$refs.form.validate((valid) => {
                //     if(!valid)return false;
                //     flowContext.processVar={a:10,ab12:1001,ab1:2};
                //     return true;
                // });
                // let json = {
                //     oid: this.info.oidYsdept,
                //     pmsDeptYsVo: this.saveData(),
                //     BasicOperationCost: this.$refs.bmysTable.BasicOperationCost,
                //     DepartmentManagementFee: this.$refs.bmysTable.DepartmentManagementFee,
                //     lBasicOperationCost: this.$refs.bmysTable.lBasicOperationCost,
                //     lDepartmentManagementFee: this.$refs.bmysTable.lDepartmentManagementFee,
                // }
                // console.log(json)
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                let json = {
                    // oid: this.info.oidYsdept,
                    pmsDeptYsVo: this.saveData(),
                    BasicOperationCost: this.$refs.bmysTable.BasicOperationCost,
                    DepartmentManagementFee: this.$refs.bmysTable.DepartmentManagementFee,
                    lBasicOperationCost: this.$refs.bmysTable.lBasicOperationCost,
                    lDepartmentManagementFee: this.$refs.bmysTable.lDepartmentManagementFee,
                    dataSecretLevcode: 2
                }
                return json;
            },
            initData() {
                let id = {
                    year: this.info.year,
                    oidDept: this.info.oidDept
                };
                this.getRightList(id);
            },
            editable(data) {
                if (data) {
                    let operate = data[data.length - 1];
                    if ('reject' === operate.operateKey) {
                        console.log('可编辑')
                    } else {
                        //不可编辑
                        this.editConfig = {}
                    }
                }
            },
            //  删除添加 如果删除的是从后台获取的
            deleteItem(row, index) {
                this.$refs.vxetable.remove(row);
                this.tableData.splice(index, 1);
                if (this.listId.indexOf(row.oid) > -1) {
                    this.dellist.push(row);
                }

            },
            // 获取右边列表
            getRightList(params) {
                // console.log(params)
                this.loading = true;
                this.$axios.get("/pms/PmsDeptYsitem/listByOidYsdfAndOidYsdept", {params: params})
                    .then(result => {
                        console.log(result.data, 'result')
                        if (!result.data.pmsDeptYsVo) {
                            this.tablist = result;
                            return
                        }
                        let newSz = result.data.pmsDeptYsVo.filter(item => {
                            return item.ysje != null

                        })
                        result.data.pmsDeptYsVo = newSz;
                        let newLDepartmentManagementFee = 0;
                        result.data.pmsDeptYsVo.map(item => {
                            if (item.dataPxh > 7) {
                                newLDepartmentManagementFee = newLDepartmentManagementFee + item.lysje;
                            }
                        });
                        result.data.lDepartmentManagementFee = newLDepartmentManagementFee;
                        console.log(result, 'chuli result')
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
            // hover
            handleClickYear(index) {
                this.active = index;
                this.getRightList();

            },
            addNode() {

            },
            colspanMethod({row, rowIndex, column, columnIndex, data}) {

            },
            saveData() {
                let newdata = this.$refs.bmysTable.getData();
                newdata.map((c) => {
                    c.oidYsnf = this.info.oidYsnf;
                    c.oidDept = this.info.oidDept;
                    c.deptCode = this.info.deptCode;
                    c.deptName = this.info.deptName;
                    c.year = this.info.year;
                    c.dataSecretLevcode = '2';
                    c.version = this.version;
                })
                let lastData = newdata.filter(o => {
                    return !(o.dataPxh > 7 && o.lysje && !o.ysje)
                })
                return lastData;
            },
            // 保存
            handleSave() {
                this.$axios.post("/pms/PmsDeptYsitem/saveYsDeptAndYsItem", {pmsDeptYsVo: this.saveData()})
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
            editClosedEvent({row, column}, event) {
                let tabdata = this.$refs.vxetable.getTableData().tableData;
                let basic = this.$refs.vxetable.getTableData().tableData.slice(2, 9);
                let other = this.$refs.vxetable.getTableData().tableData.slice(10);
                // console.log(column.title==="预算金额")
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

    .jeInpbox /deep/ input {
        text-align: right;
    }
</style>

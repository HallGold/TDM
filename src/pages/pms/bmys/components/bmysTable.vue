<template>
    <div class="vxe-full-main">
        <div class="vxe-full-container">
            <vxe-table
                    :loading="loading"
                    height="100%"
                    auto-resize
                    class="vxetable"
                    :edit-config="editConfig"
                    ref="vxetable"
                    :row-style="rowStyle"
                    :border="Border"
                    @edit-closed="editClosedEvent"
                    :span-method="colspanMethod"
                    :data="tableData">
                <vxe-table-column field="index" width="60" title="序号">
                    <template v-slot="{ row, rowIndex }">
                        <span v-if="rowIndex==1">一</span>
                        <span v-else-if="rowIndex>1&&rowIndex<9">{{rowIndex-1}}</span>
                        <span v-else-if="rowIndex==9">二</span>
                        <span v-else-if="rowIndex>9">{{rowIndex-9}}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="ysxm" title="预算项目"
                                  >
                    <template v-slot="{ row, rowIndex, columnIndex }">
                                    <span v-if="isEdit">
                                        <span v-if="rowIndex>=0&&rowIndex<=9">{{row.ysxm}}</span>
                                        <vxe-input maxlength="16" v-else style="text-align: right;" v-model="row.ysxm"></vxe-input>
                                    </span>
                        <span v-else>{{row.ysxm}}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="yscode" title="预算编号"
                                  >
                    <template v-slot="{ row, rowIndex }">
                                    <span v-if="isEdit">
                                        <span v-if="rowIndex==0||rowIndex==1||rowIndex==9"></span>
                                        <vxe-input maxlength="16"  v-else style="text-align: right;" v-model="row.yscode"></vxe-input>
                                    </span>
                        <span v-else>{{row.yscode}}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="lysje" title="上一年预算金额(万元)" align="right">
                    <template v-slot="{ row, rowIndex }">
                        <span>{{row.lysje?(row.lysje*1).toFixed(2):'0.00'}}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="ysje" title="预算金额(万元)"

                                  align="right">
                    <template v-slot="{ row, rowIndex }">
                        <div style="text-align: right;" class="jeInpbox">
                                        <span v-if="isEdit">
                                            <span v-if="rowIndex==0||rowIndex==1||rowIndex==9">{{row.ysje?(row.ysje*1).toFixed(2):'0.00'}}</span>
                                            <!--<vxe-input @blur="handleBlur" v-else class="abbb" v-model="row.ysje"  max="99999" maxlength="16"></vxe-input>-->
                                            <pms-input v-else v-model="row.ysje" maxlen="12" precision="2" size="mini" @change="handleBlur" style="text-align: right;" :clearable=false></pms-input>
                                        </span>
                            <span v-else>{{row.ysje?(row.ysje*1).toFixed(2):'0.00'}}</span>

                        </div>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="dateRemark" title="备注"
                                  :edit-render="{name: 'input', autoselect: true}">
                    <template v-slot="{ row, rowIndex }">
                                    <span v-if="isEdit">
                                        <span v-if="rowIndex==0||rowIndex==1||rowIndex==9"></span>
                                        <vxe-input v-else style="text-align: right;"
                                                   v-model="row.dateRemark" maxlength="650"></vxe-input>
                                    </span>
                        <span v-else>{{row.dateRemark}}</span>

                    </template>
                </vxe-table-column>
                <vxe-table-column title="操作" v-if="isEdit">
                    <template v-slot="{ row, rowIndex }">
                        <vxe-button v-if="rowIndex==9" type="primary" @click="edit">新增
                        </vxe-button>
                        <vxe-button v-if="(rowIndex>9||rowIndex==-1)" type="text"
                                    @click="deleteItem(row, rowIndex)">删除
                        </vxe-button>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </div>
    </div>

</template>

<script>
    import PmsInput from '@/components/common/pms/PmsInput'
    export default {
        name: "bmystable",
        components: {
            PmsInput
        },
        props: {
            tablist: {
                default: () => {
                    return {}
                }
            },
            isEdit: {
                default: false
            },
        },
        data() {
            return {
                loading: false,
                vxeHeight: '',
                Border: true,
                editConfig: {trigger: 'click', mode: 'cell', activeMethod: this.activeCellMethod},
                tableData: [],
                BasicOperationCost: 0.00,
                DepartmentManagementFee: 0.00,
                lBasicOperationCost: 0.00,
                lDepartmentManagementFee: 0.00,
                fuzhi: [
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '合计',//预算项目
                        yscode: '', //预算编号
                        ysje: '0', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '基本运行费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '用车费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '办公费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '资料费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '差旅费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '加班餐费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '业务费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '会议费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                    {
                        oidYsnf: '',// 年份id
                        year: '',
                        oidYsdept: '',
                        oidDept: '', // 部门id
                        deptCode: '', //部门编码
                        deptName: '', //部门名称
                        oidYsitem: '',
                        ysxm: '部门管理费',//预算项目
                        yscode: '', //预算编号
                        ysje: '', //预算金额
                        oid: '',
                        dataPxh: '', // 预算项排序号
                        operationIdentification: '', // 删除传 d
                        dateRemark: '',//备注
                    },
                ],
                listId: [],
                dellist: []
            }
        },
        watch: {
            tablist: {
                immediate: false,
                handler() {
                    console.log(111)
                    this.Arrangement(this.tablist);

                },
            },
        },
        methods: {
            handleBlur (val) {
                this.jisuan();
            },
            getData() {
                let data = this.$refs.vxetable.getTableData().tableData;
                let deldata = this.$refs.vxetable.getRemoveRecords();
                this.BasicOperationCost = data[1].ysje;
                this.DepartmentManagementFee = data[9].ysje;
                let newdata = data.filter((c, i) => {
                    return i != 0 && i != 1 && i != 9
                })
                // 获取删除的 成员
                this.dellist.map((c) => {
                    c.operationIdentification = 'd';
                    c.ysje = c.ysje ? (c.ysje * 1).toFixed(2) : 0.00;
                })
                newdata = newdata.concat(this.dellist);
                return newdata;
            },
            editClosedEvent({row, column}, event) {
                if (column.title === "预算金额(元)") {
                    this.jisuan();
                }
            },
            jisuan () {
                let tabdata = this.$refs.vxetable.getTableData().tableData;
                let basic = this.$refs.vxetable.getTableData().tableData.slice(2, 9);
                let other = this.$refs.vxetable.getTableData().tableData.slice(10);
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
            },
            colspanMethod({row, rowIndex, column, columnIndex, data}) {

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
            // 激活单元格编辑
            edit() {
                let record = {
                    oidYsnf: '',// 年份id
                    year: '',
                    oidYsdept: '',
                    oidDept: '', // 部门id
                    deptCode: '', //部门编码
                    deptName: '', //部门名称
                    oidYsitem: '',
                    ysxm: '默认名字',//预算项目
                    yscode: '', //预算编号
                    ysje: '', //预算金额
                    oid: '',
                    dataPxh: '', // 预算项排序号
                    operationIdentification: '', // 删除传 d
                    dateRemark: '',//备注
                }
                this.tableData.push(record);
                this.$refs.vxetable.setActiveCell(record, "ysxm")


            },
            //  删除添加 如果删除的是从后台获取的
            deleteItem(row, index) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.vxetable.remove(row);
                    this.tableData.splice(index, 1);
                    this.jisuan();
                    if (this.listId.indexOf(row.oid) > -1) {
                        this.dellist.push(row);
                    }
                }).catch(() => {
                    console.log('取消成功')
                })
            },
            fz(data) {
                this.tableData = data;
            },
            // 禁用编辑
            activeCellMethod({row, rowIndex, column, columnIndex}) {
                if (!this.isEdit) {
                    return false;
                }
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
            // 数据赋值
            Arrangement(result) {
                if (result.data && !result.data.pmsDeptYsVo) {
                    this.tableData = JSON.parse(JSON.stringify(this.fuzhi));
                    this.$emit('getTableInit', this.tableData)
                    return
                }
                let data = result.data.pmsDeptYsVo;
                // console.log(data, 'data');
                // 获取所有的oid
                data.forEach((c) => {
                    this.listId.push(c.oid);
                })
                if (!result.data) {
                    return;
                }
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
                obj.dataPxh = -2;
                obj.lysje = result.data.lBasicOperationCost * 1 + result.data.lDepartmentManagementFee * 1;
                obj.ysje = result.data.basicOperationCost * 1 + result.data.departmentManagementFee * 1;
                let abb = Object.assign({}, obj)
                data.splice(0, 0, abb);
                // 基本运行费
                // console.log(data);
                obj.ysxm = '基本运行费';
                obj.dataPxh = -1;
                obj.lysje = result.data.lBasicOperationCost;
                obj.ysje = result.data.basicOperationCost;
                this.BasicOperationCost = obj.ysje;
                this.lBasicOperationCost = obj.lysje;
                let abb2 = Object.assign({}, obj)
                data.splice(1, 0, abb2);
                // 部门管理费
                obj.ysxm = '部门管理费';
                obj.lysje = result.data.lDepartmentManagementFee;
                obj.ysje = result.data.departmentManagementFee;
                this.DepartmentManagementFee = obj.ysje;
                this.lDepartmentManagementFee = obj.lysje;
                let abb3 = Object.assign({}, obj);
                data.splice(9, 0, abb3);
                this.tableData = data;
                this.$emit('getTableInit', this.tableData)
            },
            // 数据框谈起计算
            roleBlur ({row, rowIndex}) {
                console.log('触发了', row, rowIndex)

                this.$nextTick(_=>{
                    // this.tableData.splice(rowIndex, 1, row);
                    return
                    let tid = setTimeout(()=>{
                        // 计算
                        if (rowIndex>9) {
                            let arr = this.tableData.slice(10);
                            let num = 0;
                            arr.forEach(c=>{
                                num+=c.ysje?c.ysje*1:0
                            })
                            this.tableData[9].ysje = num;
                            this.DepartmentManagementFee = num;
                            this.tableData.splice(9,1, this.tableData[9] )
                        } else {
                            let arr = this.tableData.slice(2, 9);
                            let num = 0;
                            arr.forEach(c=>{
                                num+=c.ysje?c.ysje*1:0
                            })
                            this.tableData[1].ysje = num;
                            this.BasicOperationCost = num;
                            this.tableData.splice(1, 1, this.tableData[1] )
                        }
                        this.tableData[0].ysje = this.tableData[1].ysje+this.tableData[9].ysje
                        this.tableData.splice(0, 1, this.tableData[0] );
                        clearTimeout(tid)
                    }, 20)

                })

            },
        },

        updated () {
            // let arr1 = this.tableData.slice(10);
            // let num1 = 0;
            // arr1.forEach(c=>{
            //     console.log(c.ysje)
            //     num1+=c.ysje?c.ysje*1:0
            // })
            // console.log(num1, 'num')
            // this.tableData[9].ysje = num1;
            // this.tableData.splice(9,1, this.tableData[9] )
            // let arr = this.tableData.slice(2, 9);
            // let num = 0;
            // arr.forEach(c=>{
            //     num+=c.ysje?c.ysje*1:0
            // })
            // this.tableData[1].ysje = num;
            // this.tableData.splice(1, 1, this.tableData[1] )
            //
            // this.tableData[0].ysje = this.tableData[1].ysje+this.tableData[9].ysje
            // this.tableData.splice(0, 1, this.tableData[0] );

        }
    }
</script>

<style lang="less" scoped>
    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;
        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
    .abbb /deep/ input{
        text-align: right;
    }
</style>

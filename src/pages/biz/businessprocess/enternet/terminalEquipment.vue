<template>
    <div>
        <ice-form-group name="终端安装记录">
            <el-table
                    :data="tableData"
                    :span-method="spanMethod"
                    border
                    :show-header="false"
                    style="width: 100%; margin-top: 20px">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称">
                    <template slot-scope="scope" >
                        <!--<div v-if="scope.$index==6">
                            <span>御载了如下客户端</span>&nbsp;>&nbsp;>&nbsp;
                            <ice-select map-type-code="operatingSystem"
                                        v-model="prodUninstallArr"
                                        multiple
                                        style="width: 70%"></ice-select>
                            <div style="margin-top: 5px;">
                                其他:<el-input v-model="mainData.prodUninstallOther"></el-input>
                            </div>
                        </div>
                        <div v-if="scope.$index==7">
                            <span>是否安装了如下客户端</span>&nbsp;>&nbsp;>&nbsp;
                            <ice-select map-type-code="operatingSystem"
                                        v-model="prodInstallArr"
                                        multiple
                                        style="width: 65%"></ice-select>
                            <div style="margin-top: 5px;">
                                其他:&nbsp;>&nbsp;>&nbsp;<el-input v-model="mainData.prodInstallOther"></el-input>
                            </div>
                            <div style="margin-top: 5px;">
                                未装原因:<el-input v-model="mainData.prodNonInstallReason"></el-input>
                            </div>
                        </div>
                        <div v-if="scope.$index==8">
                            <span>安装情况</span>&nbsp;>&nbsp;>&nbsp;
                            <ice-select map-type-code="operatingSystem"
                                        v-model="softInstallArr"
                                        multiple
                                        style="width: 82%"></ice-select>
                            <div style="margin-top: 5px;">
                                其他:<el-input v-model="mainData.softInstallOther"></el-input>
                            </div>
                        </div>-->
                        <div v-if="scope.$index==13" style="width: 100%">
                            <el-input type="textarea" rows="3" placeholder="不超过256个字" v-model="mainData.remark"></el-input>
                        </div>
                        <div v-if="scope.$index<13">{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="amount1"
                        label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.$index ==0">
                            {{scope.row.amount1}}
                        </div>
                        <ice-select v-model="mainData.osCode" map-type-code="operatingSystem" v-if="scope.$index ==1"></ice-select>

                        <div v-if="scope.$index ==2" style="margin-left: 13px;">
                            <el-date-picker placeholder="安装时间"
                                            style="width: 94%;"
                                            v-model="mainData.installDate"
                                            type="datetime"></el-date-picker>
                        </div>
                        <div v-if="scope.$index ==3">
                            <div>
                                <span>是否设置BIOS管理员口令</span>&nbsp;
                                <el-radio v-model="mainData.biosAdminPwd" label='1'>是</el-radio>
                                <el-radio v-model="mainData.biosAdminPwd" label='0'>否</el-radio>
                            </div>
                            <div>
                                原因:<el-input v-model="mainData.biosAdminPwdReason"></el-input>
                            </div>
                        </div>

                        <div v-if="scope.$index ==4">
                            <div>
                                <span>是否设置BIOS口令设置</span>&nbsp;
                                <el-radio v-model="mainData.biosPwd" label='1'>是</el-radio>
                                <el-radio v-model="mainData.biosPwd" label='0'>否</el-radio>
                            </div>
                            <div>
                                原因:<el-input  v-model="mainData.biosPwdReason"></el-input>
                            </div>
                        </div>

                        <div v-if="scope.$index ==5">
                            <div>
                                <span>是否设置开机口令设置</span>&nbsp;
                                <el-radio v-model="mainData.startPwd" label='1'>是</el-radio>
                                <el-radio v-model="mainData.startPwd" label='0'>否</el-radio>
                            </div>
                            <div>
                                原因:<el-input v-model="mainData.startPwdReason"></el-input>
                            </div>
                        </div>
                        <div v-if="scope.$index == 6">
                            <ice-select map-type-code="operatingSystem"
                                        v-model="prodUninstallArr"
                                        multiple></ice-select>
                        </div>
                        <div v-if="scope.$index == 7">
                            <el-input v-model="mainData.prodUninstallOther"></el-input>
                        </div>
                        <div v-if="scope.$index == 8">
                            <ice-select map-type-code="operatingSystem"
                                        style="width: 80%"
                                        v-model="prodInstallArr"
                                        multiple></ice-select>
                        </div>
                        <div v-if="scope.$index == 9">
                            <el-input v-model="mainData.prodInstallOther"></el-input>
                        </div>
                        <div v-if="scope.$index == 10">
                            <el-input v-model="mainData.prodNonInstallReason"></el-input>
                        </div>
                        <div v-if="scope.$index == 11">
                            <ice-select map-type-code="operatingSystem"
                                        v-model="softInstallArr"
                                        style="width: 90%;"
                                        multiple></ice-select>
                        </div>
                        <div v-if="scope.$index == 12">
                            <el-input v-model="mainData.softInstallOther"></el-input>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </ice-form-group>
    </div>

</template>

<script>
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../../components/common/base/IceSelect";
    export default {
        name: "terminalEquipment",
        components: {IceSelect, IceEditableTableColumn, IceEditableTable, IceFormGroup},
        props:{
            mainData:{},
        },
        watch:{
            mainData:{
                handler(newValue,oldValue){
                    this.formatData(newValue);
                },
                deep: true
            }
        },
        data(){
            return{
                tableData:[
                    {
                        id: '操作系统安装与配置',
                        name: '安装类型',
                        amount1: '新操作系统',
                    }, {
                        id: '操作系统安装与配置',
                        name: '操作系统及版本',
                        amount1: '',
                    }, {
                        id: '操作系统安装与配置',
                        name: '安装时间',
                        amount1: '',
                    }, {
                        id: '操作系统安装与配置',
                        name: 'BIOS管理员口令设置',
                        amount1: '',
                    }, {
                        id: '操作系统安装与配置',
                        name: 'BIOS口令设置',
                        amount1: '',
                    }, {
                        id: '操作系统安装与配置',
                        name: '开机口令设置',
                        amount1: '',
                    }, {
                        id: '安装产品御载情况',
                        name: '御载列表',
                        amount1: '',
                    }, {
                        id: '安装产品御载情况',
                        name: '其他',
                        amount1: '',
                    }, {
                        id: '安装产品安装情况',
                        name: '安装列表',
                        amount1: '',
                    }, {
                        id: '安装产品安装情况',
                        name: '其他',
                        amount1: '',
                    },{
                        id: '安装产品安装情况',
                        name: '未装原因',
                        amount1: '',
                    },{
                        id: '应用软件安装情况',
                        name: '安装列表',
                        amount1: '',
                    },{
                        id: '应用软件安装情况',
                        name: '其他',
                        amount1: '',
                    },{
                        id: '备注',
                        name: '',
                        amount1: '',
                    }
                ],
                prodUninstallArr:[],   //后台接受一个string，prodUninstall--需要进行转换---卸载客户端列表
                prodInstallArr:[],    //后台接受一个string，prodInstall--需要进行转换--安装客户端列表
                softInstallArr:[],    //后台接受一个string，softInstall--需要进行转换--应用软件安装列表
            }
        },
        methods:{
            /**
             * 数据格式化
             * @param data
             */
            formatData(data){
                this.prodUninstallArr = data.prodUninstall?item.prodUninstall.split(','):[];
                this.prodInstallArr = data.prodInstall?item.prodInstall.split(','):[];
                this.softInstallArr = data.softInstall?item.softInstall.split(','):[];
            },
            /**
             * table列表排布
             * @param row
             * @param column
             * @param rowIndex
             * @param columnIndex
             * @returns {*}
             */
            spanMethod({ row, column, rowIndex, columnIndex }) {//参数分别是当前行，当前列，当前行号，当前列号
                if (columnIndex === 0) {
                    if (rowIndex  === 0) {
                        return [6,1]
                    } else if(rowIndex ===6){
                        return [2,1]
                    }else if(rowIndex ===8){
                        return [3,1]
                    }else if(rowIndex ===11){
                        return [2,1]
                    }else if(rowIndex ===13){
                        return [1,1]
                    }else if(0<rowIndex<13){
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }else if(columnIndex === 1){
                    if (rowIndex  >= 13) {
                        return [1,2]
                    }
                }else if(columnIndex === 2){
                    if (rowIndex  > 12) {
                        return [0,0]
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
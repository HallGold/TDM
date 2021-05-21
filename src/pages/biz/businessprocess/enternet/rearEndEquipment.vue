<template>
    <ice-form-group name="后端安装记录">
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
                    <div v-if="scope.$index==6" style="width: 100%">
                        <el-input type="textarea" rows="3" placeholder="不超过256个字" v-model="mainData.remark"></el-input>
                    </div>
                    <div v-if="scope.$index ==3">
                        <div>
                            <span>是否按照安全策略基线进行配置</span>&nbsp;
                            <el-radio v-model="mainData.policyConfig" label='1'>是</el-radio>
                            <el-radio v-model="mainData.policyConfig" label='0'>否</el-radio>
                        </div>
                        <div v-if="mainData.policyConfig == 0">
                            原因:<el-input v-model="mainData.policyConfigReason"></el-input>
                        </div>
                    </div>

                    <div v-if="scope.$index ==4">
                        <div>
                            <span>是否新增其他安全策略</span>&nbsp;
                            <el-radio v-model="mainData.policyAdd" label='1'>是</el-radio>
                            <el-radio v-model="mainData.policyAdd" label='0'>否</el-radio>
                        </div>
                        <div  v-if="mainData.policyAdd == 0">
                            原因:<el-input  v-model="mainData.policyAddReason"></el-input>
                        </div>
                    </div>
                    <div v-if="scope.$index==5">
                        <span>是否安装了如下客户端</span>&nbsp;>&nbsp;>&nbsp;
                        <ice-select map-type-code="operatingSystem"
                                    v-model="prodInstallArr"
                                    multiple
                                    style="width: 65%"></ice-select>
                        <div style="margin-top: 5px;">
                            其他:&nbsp;>&nbsp;>&nbsp;<el-input v-model="mainData.prodInstallOther"></el-input>
                        </div>
                    </div>
                    <div v-if="scope.$index<3">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="amount1"
                    label="操作">
                <template slot-scope="scope">
                    <div v-if="scope.$index ==0">
                        {{scope.row.amount1}}
                    </div>
                    <ice-select v-model="mainData.osCode"
                                map-type-code="operatingSystem"
                                v-if="scope.$index ==1">
                    </ice-select>
                    <div v-if="scope.$index ==2" style="margin-left: 13px;">
                        <el-date-picker placeholder="安装时间"
                                        style="width: 94%;"
                                        v-model="mainData.installDate"
                                        type="datetime"></el-date-picker>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </ice-form-group>
</template>

<script>
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IceSelect from "../../../../components/common/base/IceSelect";
    export default {
        name: "rearEndEquipment",
        components: {IceSelect, IceFormGroup},
        props:{
            mainData:{}
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
                        id: '安全策略配置',
                        name: '是否按照安全策略基线进行配置',
                        amount1: '',
                    }, {
                        id: '安全策略配置',
                        name: '是否新增其他安全策略',
                        amount1: '',
                    }, {
                        id: '安装产品安装情况',
                        name: '安装列表',
                        amount1: '',
                    },{
                        id: '备注',
                        name: '',
                        amount1: '',
                    }
                ],
            }
        },
        methods:{
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
                        return [3,1]
                    } else if(rowIndex ===3){
                        return [2,1]
                    }else if(rowIndex ===5 || rowIndex ===6){
                        return [1,1]
                    }else if(0<rowIndex<7){
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }else if(columnIndex === 1){
                    if (rowIndex  === 3 || rowIndex  === 4 || rowIndex  === 5 || rowIndex  === 6) {
                        return [1,2]
                    }
                }else if(columnIndex === 2){
                    if (rowIndex > 2) {
                        return [0,0]
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
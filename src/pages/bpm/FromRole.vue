<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <div class="ice-grid-button-bar">
            <el-button type="primary" icon="el-icon-plus" @click="addDetailItem">新增</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
        <div class="grid-bar" style="max-height: 400px;overflow-x: hidden;overflow-y: scroll">
            <ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable">
                <el-table-column :width="50"
                                 label="序号">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <ice-editable-table-column prop="name"
                                           label="字段名"
                                           :width="null"
                                           input-type="input">
                </ice-editable-table-column>
                <ice-editable-table-column prop="code"
                                           label="编码CODE"
                                           :width="null"
                                           input-type="input">
                </ice-editable-table-column>
                <el-table-column prop="isHidden"
                                 width="150"
                                 label="是否显示">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isHidden">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="isDisabled"
                                 width="150"
                                 label="可编辑">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isDisabled">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="isAuth"
                                 width="150"
                                 label="权限归属">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isAuth">
                            <el-option label="默认" value="0"></el-option>
                           <!-- <el-option label="处理人" value="1"></el-option>
                            <el-option label="管理员" value="2"></el-option>-->
                            <!--<el-option label="其他人员" value="3"></el-option>-->
                        </el-select>
                    </template>
                </el-table-column>

                <ice-editable-table-column prop="remark"
                                           label="其他"
                                           input-type="input">
                </ice-editable-table-column>

                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </ice-editable-table>
        </div>
    </div>
</template>



<script>

    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../components/common/base/IceEditableTable.vue";
    import IceEditableTableColumn from "../../components/common/base/IceEditableTableColumn.vue";

    export default {
        name: 'FlowFromRole',
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout
        },
        props:{
            callBack: {type:Function,required:true}
        },
        data() {
            return {
                detailGridData:[{name:'', code: '',isDisabled:'1', isHidden: '1',isAuth: '0', remark: ''}],
                userData:{},
                detailRules: {
                    code: {required: true,whitespace: true, message: '请输入编码', repeatable: true,trigger: 'blur'},
                    name: {required: true,whitespace: true, message: '请输入名称'},
                },
                dialogVisible:false,
                tittle:''
            }
        },
        methods: {
            /**新增下拉需要的值*/
            addDetailItem() {
                this.detailGridData.push({name:'', code: '',isDisabled:'1', isHidden: '1',isAuth: '0', remark: ''})
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.detailGridData.splice(index, 1);
            },
            /**关闭新增弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            },
            showDialog(row) {
                this.detailGridData=[{name:'', code: '',isDisabled:'1', isHidden: '1',isAuth: '0', remark: ''}];
                this.dialogVisible = true;
                if(row){
                    this.userData=row;
                }
            },
            setGridData(val){
                if(val){
                    let data=JSON.parse(val);
                    this.detailGridData=data;
                }
            },
            /**保存*/
            save() {
                this.$refs.detailtable.validateAll((valid) => {
                    if(valid){
                        if(this.callBack){
                            this.callBack(this.userData,this.detailGridData);
                        }
                        this.dialogVisible = false;
                    }
                });
            }
        }
    }
</script>


<style lang="less" scoped>
</style>

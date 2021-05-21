<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">

        <el-dialog v-dialogDrag title="页面规则" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="950px" append-to-body :close-on-click-modal="false" ref="flowRole">
            <div class="ice-grid-button-bar">
                <el-button type="primary" icon="el-icon-plus" @click="addDetailItem">新增</el-button>
            </div>
            <ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable" height="330px">
                <el-table-column :width="50"
                                 label="序号">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <ice-editable-table-column prop="name"
                                           :width="null"
                                           label="字段名"
                                           input-type="input">
                </ice-editable-table-column>
                <ice-editable-table-column prop="code"
                                           label="编码CODE"
                                           :width="null"
                                           input-type="input">

                    <template slot-scope="scope">
                        <el-select placeholder="选择" @change="selectCode(scope.row.code,scope.row)" v-model="scope.row.code">
                            <el-option  v-for="item in formRoleList" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </template>

                </ice-editable-table-column>
                <el-table-column prop="isHidden"
                                 width="90"
                                 label="是否显示">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isHidden">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="isDisabled"
                                 width="90"
                                 label="可编辑">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isDisabled">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column prop="isAuth"
                                 width="120"
                                 label="权限归属">
                    <template slot-scope="scope">
                        <el-select placeholder="选择" v-model="scope.row.isAuth">
                            <el-option label="默认" value="0"></el-option>
                            <el-option label="处理人" value="1"></el-option>
                            <el-option label="管理员" value="2"></el-option>
                            <!--<el-option label="其他人员" value="3"></el-option>-->
                        </el-select>
                    </template>
                </el-table-column>

                <ice-editable-table-column prop="remark"
                                           label="其他"
                                           input-type="input"
                                           :width="140">
                </ice-editable-table-column>
                <el-table-column label="操作" :width="80">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </ice-editable-table>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">确认</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>



<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../components/common/base/IceEditableTable.vue";
    import IceEditableTableColumn from "../../components/common/base/IceEditableTableColumn.vue";


    export default {
        name: 'FlowFromRole',
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceQueryGrid,
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
                formRoleList:[],
                dialogVisible:false,
                tittle:''
            }
        },
        methods: {
            selectCode(val,a){
               // alert(val+"---"+a)
                let obj=this.formRoleList.find(item=>item.code==val);
                a.name=obj.name;
            },
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
            setGridData(val,formRoleList){
                // debugger
                if(val){
                    let data=JSON.parse(val);
                    this.detailGridData=data;
                }
                if(formRoleList){
                    let data=JSON.parse(formRoleList);
                    this.formRoleList=data;
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
        },
        watch:{

        }
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;
        .button-area {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>

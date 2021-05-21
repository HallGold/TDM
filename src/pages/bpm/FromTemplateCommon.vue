<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%">
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
            <ice-editable-table-column prop="code"
                                       label="属性CODE"
                                       :width="200"
                                       input-type="input">
            </ice-editable-table-column>
            <ice-editable-table-column prop="name"
                                       :width="null"
                                       label="属性说明"
                                       input-type="input">
            </ice-editable-table-column>

            <el-table-column prop="isAuth"
                             width="100px"
                             label="权限归属">
                <template slot-scope="scope">
                    <el-select placeholder="选择" v-model="scope.row.isAuth" style="width: 100%">
                        <el-option label="默认" value="0"></el-option>
                        <el-option label="处理人" value="1"></el-option>
                        <el-option label="管理员" value="2"></el-option>
                        <!--<el-option label="其他人员" value="3"></el-option>-->
                    </el-select>
                </template>
            </el-table-column>

            <ice-editable-table-column prop="remark"
                                       label="属性值"
                                       input-type="input">
            </ice-editable-table-column>

            <el-table-column label="操作" width="90px">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="small" @click="deleteDetailItem(scope.$index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </ice-editable-table>
    </div>
</template>



<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../components/common/base/IceEditableTable.vue";
    import IceEditableTableColumn from "../../components/common/base/IceEditableTableColumn.vue";


    export default {
        name: 'FromTemplate',
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceQueryGrid,
            IceGridLayout
        },
        props:{
            detailGridData: {type:Array,required:true}
        },
        data() {
            return {
                detailRules: {
                    code: {required: true,whitespace: true, message: '请输入编码', repeatable: true,trigger: 'blur'},
                    name: {required: true,whitespace: true, message: '请输入属性说明',trigger: 'blur'},
                    remark: {required: true,whitespace: true, message: '请输入属性值',trigger: 'blur'},
                },
                tittle:''
            }
        },
        methods: {
            /**新增下拉需要的值*/
            addDetailItem() {
                this.detailGridData.push({name:'', code: '',isAuth: '0', remark: ''})
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.detailGridData.splice(index, 1);
            },
            setGridData(val){
                if(val){
                    let data=JSON.parse(val);
                    this.detailGridData=data;
                }
            },
            /**保存*/
            validateData() {
                // debugger
                let validate=false;
                this.$refs.detailtable.validateAll((valid) => {
                    validate=valid;
                });
                return validate;
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

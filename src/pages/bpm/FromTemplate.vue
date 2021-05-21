<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">

        <el-dialog v-dialogDrag title="特殊属性" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="950px" append-to-body :close-on-click-modal="false" ref="flowRole" 
                   >
           <div style="height:400px;">
               <from-template-common :detailGridData="detailGridData" ref="common"></from-template-common>
           </div>
            <div class="ice-button-bar">
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
    import FromTemplateCommon from "./FromTemplateCommon";

    export default {
        name: 'FromTemplate',
        components: {
            FromTemplateCommon,
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
                detailGridData:[{name:'', code: '',isAuth: '0', remark: ''}],
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
                this.detailGridData.push({name:'', code: '',isAuth: '0', remark: ''})
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
                this.detailGridData=[{name:'', code: '',isAuth: '0', remark: ''}];
                this.dialogVisible = true;
                if(row){
                    this.userData=row;
                }
            },
            setGridData(val,formRoleList){
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
                if(this.$refs.common.validateData()){
                    if(this.callBack){
                        this.callBack(this.userData,this.detailGridData);
                    }
                    this.dialogVisible = false;
                }
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

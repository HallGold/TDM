<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="黑名单发起配置"
                        data-url="/biz/BlacklistConfig/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <ice-grid-layout :columns="2">


                        <el-form-item label="发起人:" label-width="100px" prop="userName">

                            <ice-persion-selector
                                    v-model="mainDataForm.userName"
                                    text-prop="name"
                                    code-prop="code"
                                    mode="input"
                                    choose-item="multiple"
                                    :selectedPersion="selectedPersion"
                                    @select-confirm="selectUserConfirm">
                            </ice-persion-selector>
                        </el-form-item>

                        <el-form-item label="流程:" label-width="100px" prop="flowName">
                            <el-select placeholder="请选择" v-model="mainDataForm.flowName" :disabled="true">
                                <el-option
                                        v-for="item in typeText"
                                        :key="item.value"
                                        :label="item.text"
                                        :value="item.text">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="备注说明:" :columns="2" layout="2"  label-width="100px" prop="remark">
                            <el-input placeholder="描述" maxlength="90" type="textarea" v-model="mainDataForm.remark"></el-input>
                        </el-form-item>

                    </ice-grid-layout>

                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="saveData">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";

    export default {
        name: 'blackListConfig',
        data() {
            return {
                dialogVisible:false,
                query: [
                    {type: 'input', label: '发起人', code: 'userName',exp:"upperLike"},
                    {type: 'input', label: '流程名', code: 'flowName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'type', hidden: true},
                    {label: '发起人Code', code: 'userCode', width: 140, hidden: true},
                    {label: '发起人', code: 'userName', width: 140,sortable:true},
                    {label: '流程', code: 'flowName', width: 240,sortable:true},
                    {label: '备注', code: 'remark', width: 140}
                ],
                selectedPersion:[],
                operations: [
                    {
                        name: '编辑', callback: this.updataItem, isShow: function (row) {
                                return true;
                        }
                    },
                    {
                        name: '立即发起', callback: this.startFlow, isShow: function (row) {
                                return true;
                        }
                    },
                ],

                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary',hidden:true, callback: this.addCallback}],
                dialogVisible:false,
                seasonList:[{"value":"zskmd","text":"年份"}],
                typeText:[{"value":"zskmd","text":"证书黑名单发布流程"}],
                mainDataForm: {},
                title:'',
                formRules: {
                    aclKey: [{required: true, message: '请输入KEY仅由英文字母，数字以及下划线组成', trigger: 'blur'}],
                    aclName: [{required: true, message: '请输入ACL名称', trigger: 'blur',transform:function (val) {
                            if(val){
                                return val.trim();
                            }
                            return val;
                        }
                    }],
                    aclType: [{required: true, message: '请输入类型名称', trigger: 'blur',transform:function (val) {
                            if(val){
                                return val.trim();
                            }
                            return val;
                        }
                    }],
                    editRules: {
                        userName: {required: true, message: '请填写用户名'},
                        season: {required: true, message: '请选择周期'},
                        flowName: {required: true, message: '请填写流程信息'},
                    },
                }
            }
        },
        methods: {
            closeDialog() {
                this.dialogVisible = false;
            },
            selectUserConfirm(rows, texts, values){
                let userCode="",userName="";
                for(let i=0;i<rows.length;i++){
                    userCode+=","+rows[i].code;
                    userName+=","+rows[i].name;
                }
                this.mainDataForm.userCode=userCode.substr(1);
                this.mainDataForm.userName=userName.substr(1);
            },
            addCallback() {
                this.title = '新增定时发起配置';
                this.dialogVisible = true;
            },
            async saveData(button, data) {
                    const valid = await this.$refs['form'].validate()
                    if (!valid) {
                        return false;
                    }
                    let obj={
                        oid:this.mainDataForm.oid,
                        userCode:this.mainDataForm.userCode,
                        userName:this.mainDataForm.userName,
                        remark:this.mainDataForm.remark
                    };
                    try {
                        const result = await this.$axios.post("/biz/BlacklistConfig/saveOrUpdate",obj);
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.refresh();
                        return true
                    } catch (e) {
                        this.$message.error(e.msg);
                    }
                    return false;
                },
            updataItem(row){
                this.title = '编辑';
                this.dialogVisible = true;
                this.mainDataForm={...row};
                if(this.mainDataForm.userCode){
                    this.selectedPersion=this.mainDataForm.userCode.split(",");
                }
            },
            /**立即发起*/
            startFlow(row){
                this.$confirm('确定要发起吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.post("/biz/BlacklistConfig/startFlow",{"type":row.type}).then(success=>{
                        this.$message.success("成功");
                        this.refresh();
                    })
                });
            },
            aclChange(){

            },
            refresh(){
                this.$refs.grid.refresh();
            }
        },
        components: {
            IcePersionSelector,
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

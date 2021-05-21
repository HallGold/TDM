<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="规则明细"
                        data-url="/resources/ResAnnRuleDetail/list"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>


        <el-dialog v-dialogDrag title="明细维护" custom-class="ice-dialog" center :visible.sync="dialogAddVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="addItemForm"
                         style="margin-top: 20px">
                    <el-row :gutter="16">
                        <el-col :span="8">
                            <el-form-item label="规则类型:" label-width="100px" prop="ruleType">

                                <el-select placeholder="请选择" v-model="mainDataForm.ruleType">
                                    <el-option label="用户" value="user" ></el-option>
                                    <el-option label="角色" value="role"></el-option>
                                    <el-option label="部门" value="dept"></el-option>
                                </el-select>

                            </el-form-item>
                        </el-col>

                        <el-col :span="4">
                                <el-checkbox v-model="mainDataForm.readable" :true-lable="0" :false-label="1" style="padding-top:6px;">是否可读</el-checkbox>
                        </el-col>

                        <el-col :span="10">
                            <el-form-item label="选择用户" label-width="100px" prop="ruleType" v-if="mainDataForm.ruleType == 'user'">
                                <el-button @click="selectUserOpen">点击选择选择用户</el-button>
                            </el-form-item>
                            <el-form-item label="选择角色:" label-width="100px" prop="ruleType" v-else-if="mainDataForm.ruleType == 'role'">
                                选择角色组件还未实现..
                            </el-form-item>
                            <el-form-item label="选择部门:" label-width="100px" prop="ruleType" v-else-if="mainDataForm.ruleType == 'dept'">
                                <el-button @click="selectDeptOpen">点击选择部门</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">

                        <el-col :span="20">
                            <el-form-item :label="mainDataForm.ruleType == 'user'?'已选用户':(mainDataForm.ruleType == 'role'?'已选角色':(mainDataForm.ruleType == 'dept'?'已选部门':''))"
                                          v-if="mainDataForm.ruleType != null && mainDataForm.ruleType.length > 0 && mainDataForm.ruleCode != null && mainDataForm.ruleCode.length > 0" label-width="100px">
                                <el-tag
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                            </el-form-item>

                        </el-col>
                    </el-row>

                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="addItemSave">保存规则明细</el-button>
                    <el-button type="info" @click="addItemCloseDialog">返回</el-button>
                </div>
            </div>
        </el-dialog>

        <ice-persion-selector
                mode="hidden"
                choose-item="multiple"
                ref="persionPop"
                :selected-persion="[{code:'662-admin',name:'name'}]"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>

        <ice-dept-selector
                mode="hidden"
                choose-item="multiple"
                ref="persionDept"
                @select-confirm="selectDeptConfirm">
        </ice-dept-selector>
    </div>

</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector.vue";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector.vue";

    export default {
        name: "RuleListDetail",
        props:{
            roid:String
        },
        data(){
            return{
                lableName:"选择用户:",
                query: [],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '规则类型', code: 'ruleType', width: 190},
                    {label: '规则值', code: 'ruleCode', width: 190},
                    {label: '是否可读', code: 'readable', width: 190}
                ],
                operations: [
                    {name: '修改', callback: this.updateItem}
                ],
                buttons: [{name: '新增规则', icon: 'el-icon-plus', type: 'primary', callback: this.addItem},
                    {name: '刷新规则', icon: '', type: 'primary', callback: this.refreshDetail}],

                dialogAddVisible:false,
                mainDataForm:{ruleType:null,readable:0},
                formRules:{
                    ruleType: [{required: true, message: '请选择规则类型', trigger: 'blur'}],
                    ruleCode: [{required: true, message: '请选择规则值', trigger: 'blur'}],
                },
                dynamicTags: []
            }
        },
        methods:{
            addItem(){
                this.mainDataForm = {ruleType:null,readable:0};
                this.dialogAddVisible = true;
            },
            addItemCloseDialog(){
                this.dialogAddVisible = false;
            },
            updateItem(row){
                Object.assign(this.mainDataForm,row);
                console.log(this.mainDataForm)
                this.dialogAddVisible = true;
            },
            addItemSave(){},
            refreshDetail(){
                this.$refs.mainQueryGrid.refresh();
            },
            selectUserOpen(){
                this.$refs.persionPop.openDialog();
            },
            selectUserConfirm(rows){
                for(let i = 0 ; i < rows.length ; i++){
                    this.dynamicTags.push(rows[i]["code"]);
                }
                console.log(this.dynamicTags)
            },
            selectDeptOpen(){
                this.$refs.persionDept.openDialog();
            },
            selectDeptConfirm(rows){
                for(let i = 0 ; i < rows.length ; i++){
                    this.dynamicTags.push(rows[i]["deptCode"]);
                }
                console.log(this.dynamicTags)
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
        },
        components: {IceQueryGrid,IcePersionSelector,IceDeptSelector}
    }
</script>

<style scoped>

</style>

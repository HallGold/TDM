<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="我的授权"
                        data-url="/bpm/ExtAuthorized/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

        <ice-dialog :title="tittle" :visible.sync="dialogVisible" width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" ref="form">
                    <ice-grid-layout name="代理信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="代理类型" label-width="100px" prop="typeText">
                                    <el-select placeholder="请选择" v-model="mainDataForm.typeText"  @change="aclChange">
                                        <el-option
                                                v-for="item in typeData"
                                                :key="item.value"
                                                :label="item.text"
                                                :value="item.text">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="代理人" label-width="100px" prop="authorizedName">

                                    <ice-persion-selector
                                            v-model="mainDataForm.authorizedName"
                                            text-prop="name"
                                            code-prop="code"
                                            choose-item="single"
                                            @select-confirm="selectUserConfirm">
                                    </ice-persion-selector>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="流程" label-width="100px" prop="actDefName">
                                    <ice-pop-selector style="box-sizing: border-box"
                                                      label=""
                                                      title="请选择流程"
                                                      text-prop="actDefName"
                                                      code-prop="actDefKey"
                                                      v-model="mainDataForm.actDefName"
                                                      :mode="selectorMode"
                                                      :query="flowQuery"
                                                      :columns="flowColumns"
                                                      data-url="/bpm/definition/list"
                                                      choose-item="single"
                                                      @select-confirm="selectConfirm">
                                    </ice-pop-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="流程环节" label-width="100px" prop="nodeName">
                                    <el-select placeholder="请选择" v-model="mainDataForm.nodeName"  :disabled="flowNodeReadonly" @change="nodeChange">
                                        <el-option
                                                v-for="item in nodeSetList"
                                                :key="item.oid"
                                                :label="item.nodeName"
                                                :value="item.nodeName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="开始时间" label-width="100px" prop="beginDate">
                                    <el-date-picker
                                            v-model="mainDataForm.beginDate"
                                            type="datetime"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="结束时间" label-width="100px" prop="endDate">
                                    <el-date-picker
                                            v-model="mainDataForm.endDate"
                                            type="datetime"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IcePopSelector from "@/components/common/base/IcePopSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";

    export default {
        name: 'ExtAuthorizedControl',
        props:{

        },
        data() {
            return {
                selectorMode:"input",
                nodeSetList:[],
                selectFlows:[],
                typeData:[{value:"all",text:"全部"},{value:"flow",text:"流程"},{value:"node",text:"环节"}],
                flowQuery: [
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: '', exp: 'like'},
                    {type: 'input', label: '流程KEY', code: 'actDefKey', value: '', exp: 'like'}
                ],
                flowColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {label: '流程名称', code: 'bpmDefName', width: 240},
                    {label: '流程KEY', code: 'actDefKey', width: 200, sortable: true},
                    {label: '流程版本', code: 'versionNo', width: 100}
                ],
                query: [
                    {type: 'input', label: '代理流程', code: 'actDefName'},
                    {type: 'input', label: '代理环节', code: 'nodeName'},
                    {type: 'input', label: '代理人', code: 'authorizedName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefKey', hidden: true},
                    {code: 'nodeId', hidden: true},
                    {code: 'authorizedId', hidden: true},
                    {code: 'typeValue', hidden: true},
                    {label: '代理类型', code: 'typeText', width: 100,sortable: true},
                    {label: '代理流程', code: 'actDefName', width: 300,sortable: true,align:'left'},
                    {label: '代理环节', code: 'nodeName', width: 300,sortable: true,align:'left'},
                    {label: '代理人', code: 'authorizedName', width: 100,sortable: true,align:'left'},
                    {label: '开始时间', code: 'beginDate', width: 150,sortable: true},
                    {label: '结束时间', code: 'endDate', width: 150,sortable: true}
              //      {label: '状态', code: 'status', width: 60},
               //     {label: '最后操作时间', code: 'updateDate', width: 130}
                ],
                operations: [
                    {
                        name: '编辑',ctrlCode:"BBJ", callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                        if(row.typeValue=="all"){
                            this.selectorMode="readonly";
                            this.flowNodeReadonly=true;
                        }
                        if(row.typeValue=="flow"){
                            this.selectorMode="input";
                            this.flowNodeReadonly=true;
                        }
                        if(row.typeValue=="node"){
                            this.selectorMode="input";
                            this.flowNodeReadonly=false;
                        }
                        this.dialogVisible=true;
                        this.tittle='编辑'
                    }
                    },
                    {name: '删除',ctrlCode:"BSC", callback: this.deleteAcl}
                ],
                buttons: [{name: '新增',ctrlCode:"BXZ", icon: 'el-icon-plus', type: 'primary', callback:()=>{
                    this.mainDataForm= {typeText:'',authorizedName:'',actDefName:'',nodeName:'',beginDate:'',endDate:''};
                    this.dialogVisible=true;
                    this.tittle='新增';
                    this.$nextTick(()=>{
                        this.$refs.form.clearValidate();
                    })
                }}],
                dialogVisible: false,
                AcRoleUserdialogVisible:false,
                AcRoleFlowdialogVisible:false,
                flowNodeReadonly:false,
                mainDataForm: {typeText:'',authorizedName:'',actDefName:'',nodeName:'',beginDate:'',endDate:''},
                formRules: {
                    typeText: [{required: true, message: '请输入类型', trigger: 'change'}],
                    authorizedName: [{required: true, message: '请输入代理人', trigger: 'change'}],
                    actDefName: [{required: true, message: '请输入流程', trigger: 'change'}],
                    nodeName: [{required: true, message: '请输入环节', trigger: 'change'}],
                    beginDate: [{required: true, message: '请输入开始时间', trigger: 'blur'}],
                    endDate: [{required: true, message: '请输入结束时间', trigger: 'blur'}]
                },
                tittle:''
            }
        },
        methods: {
            //加载环节
            loadNodeSetData(actDefId) {
                this.$axios.get("/bpm/nodeSet/list", {params: {actDefId: actDefId}}).then(result => {
                    this.nodeSetList = result.data.filter(bt=>bt.nodeId!="StartEvent"&&bt.nodeId!="EndEvent");
                });
            },
            nodeChange(value){
                let texts=this.nodeSetList.find(bt=>bt.nodeName==value).nodeId
                this.mainDataForm.nodeId=texts;
            },
            aclChange(value){
                let texts=this.typeData.find(bt=>bt.text==value).value
                this.mainDataForm.typeValue=texts;
                let obj = Object.assign({}, this.mainDataForm);
                if(texts=="all"){
                    obj.actDefName="*所有*";
                    obj.actDefId="*all*";
                    obj.actDefKey="*all*";

                    obj.nodeName="*所有*";
                    obj.nodeId="*all*";
                    obj.typeText=value;
                    obj.typeValue=texts;
                    this.selectorMode="readonly";
                    this.flowNodeReadonly=true;
                }
                if(texts=="flow"){
                    this.selectorMode="input";
                    this.flowNodeReadonly=true;
                    obj.actDefName="";
                    obj.actDefId="";
                    obj.actDefKey="";

                    obj.nodeName="*所有*";
                    obj.nodeId="*all*";
                    obj.typeText=value;
                    obj.typeValue=texts;
                }
                if(texts=="node"){
                    this.selectorMode="input";
                    this.flowNodeReadonly=false;

                    obj.actDefName="";
                    obj.actDefId="";
                    obj.actDefKey="";

                    obj.nodeName="";
                    obj.nodeId="";
                    obj.typeText=value;
                    obj.typeValue=texts;
                }
                this.mainDataForm=obj;
            },
            selectConfirm(rows, texts, values) {
                this.mainDataForm.actDefId=rows[0].oid;
                this.mainDataForm.actDefName=rows[0].bpmDefName;
                this.mainDataForm.actDefKey=rows[0].actDefKey;

                this.loadNodeSetData(rows[0].actDefId);
            },
            selectUserConfirm(rows, texts, values){

                this.mainDataForm.authorizedId=rows[0].code;
                this.mainDataForm.authorizedName=rows[0].name;
            },
            editAcl(row,index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/ExtAuthorized/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            save(){
                this.$refs['form'].validate((valid) => {
                    //console.log("form", valid)
                    if (valid) {
                        let obj =this.mainDataForm;
                        this.$axios.post('/bpm/ExtAuthorized/saveOrUpdate', obj).then(result => {
                            this.$message.success("新增成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            showAcRoleUserdialog(){
                this.AcRoleUserdialogVisible=true;
            }
        },
        components: {
            IceQueryGrid,
            IcePopSelector,
            IcePersionSelector,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

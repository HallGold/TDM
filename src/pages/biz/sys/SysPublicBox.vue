<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid data-url="/biz/BoxAf/all"
                        :query="query"
                        :operations="operations"
                        :columns="columns">
        </ice-query-grid>

        <ice-dialog :visible.sync="visibleDialogLook" width="900px" title="详情" height="700px">
            <ice-form :model="formDataLook" label-position="left" >
                <ice-grid-layout name="反馈信息" :columns="2">
                        <el-form-item label="主题 " label-width="120px" layout="2">
                            <el-input  :disabled="true" v-model="formDataLook.complaintTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="内容 " label-width="120px" layout="2">
                            <el-input  type="textarea" rows="6"  :disabled="true" v-model="formDataLook.complaintContent"></el-input>
                        </el-form-item>
                </ice-grid-layout>

                <ice-grid-layout name="回复信息" :columns="1">
                    <el-form-item label="回复内容:" label-width="120px">
                        <el-timeline class="shyj">
                            <el-timeline-item v-for="(item, index) in boxReplyList"
                                              :key="item.oid" color="#0bbd87"
                                              :timestamp="new Date(item.createDate).toLocaleString()"
                                              >
                                {{item.userName}}：{{item.context}} {{createDate}}
                            </el-timeline-item>
                        </el-timeline>
                    </el-form-item>
                </ice-grid-layout>

            </ice-form>
            <div class="ice-button-bar">
                <el-button  @click="closeDialogLook()">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog :visible.sync="editReploy" width="800px" title="详情" height="500px" >
            <sys-reploy :af-no="afNo" ref="reployGrid"></sys-reploy>
        </ice-dialog>

    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceForm from "../../../components/common/base/IceForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../components/common/base/IceSelect";
    import SysReploy from "./SysReploy";

    export default {
        name: "SysComplaininfo",
        components: {IceSelect, IceGridLayout, IceForm, IceDialog, IceQueryGrid,SysReploy},
        data(){
            return{
                boxReplyList:[],
                formDataLook:{createDate:""},
                visibleDialogLook:false,
                editReploy:false,
                afNo:"",
                query: [
                    {type: 'static', label: '状态', code: 'afStatus',value:"2"},
                    {type: 'static', label: '发布', code: 'ispublished',value:"1"},
                    //{type: 'input', label: '单号', code: 'afNo'},
                    {type: 'input', label: '主题', code: 'complaintTitle',value:""},
                   // {type: 'input', label: '提交人', code: 'afUserName'},
                    {type: 'select', label: '反馈项目', code: 'sysType',mapTypeCode: "sys_type_",value:""},
                    {type: 'select', label: '分类', code: 'type',mapTypeCode: "SYS_TYPE",value:""},
                    {type: 'date', label: '提交时间从', code: 'afDate', value: '', exp: '>=',value:""},
                    {type: 'date', label: '至', code: 'afDate', value: '', exp: '<=',value:""}
                ],
                columns:[//列表展示列
                    {code: 'oid', hidden: true},
                    {label:'提交内容',code:'complaintContent', hidden: true},
                    {label:'单号',code:'afNo', width: 120,hidden:true},
                    {label:'主题',code:'complaintTitle',sortable:true},
                    {label:'提交时间',code:'afDate', width: 150,sortable:true},
                    //{label:'提交人',code:'afUserName', width: 100,sortable:true},
                   // {label:'提交部门',code:'afDepartmentName', width: 100,sortable:true},
                    {label:'反馈项目',code:'sysType', width: 120, mapTypeCode: "sys_type_",sortable: true},
                    {label:'回复部门',code:'replyDept',sortable:true},
                    //{label:'回复时间',code:'replyDate', width: 130,sortable:true},
                    //{label:'回复内容',code:'replyContent'},
                    {label:'分类',code:'type', mapTypeCode: "SYS_TYPE", width: 150,sortable:true}
                ],
                operations:[
                    {name:'查看',ctrlCode:"BCK",callback:this.look},
                    {name:'编辑回复',ctrlCode:"BBJHF",callback:this.editReployGrid},
                ],

                columnsReply: [
                    {code: 'oid', hidden: true},
                    {code: 'userCode', hidden: true},
                    {label: '处理人', code: 'userName', width: 250},
                    {label: '处理意见', code: 'context'},
                    {label: '处理时间', code: 'createDate', width: 150}
                ],
                operationsReply: [
                    {name: '删除', callback: this.deleteItem, isShow:(row)=>{
                            let del=(row.userCode === this.$userInfo.userCode)&&this.isAuth;
                            return del;
                        }
                    },
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.dialogForm = objMain;
                            this.dialogVisible=true;
                            this.tittle='编辑处理意见'
                        }, isShow:(row)=>{
                            let del=(row.userCode === this.$userInfo.userCode)&&this.isAuth;
                            return del;
                        }
                    }
                ],
                defaultQueryReply: [],
                buttonsReply: []
            }
        },
        methods:{
            closeDialogLook(){
                this.visibleDialogLook = false;
            },
            look(row){
                Object.assign(this.formDataLook,row);
                this.$axios.get("/biz/BoxReply/getByAfId", {params: {afId: row.afNo}})
                    .then(result => {
                        this.boxReplyList = result.data;
                        this.visibleDialogLook=true;
                    })
            },
            editReployGrid(row){
                this.afNo=row.afNo;
                this.editReploy=true;
                this.$nextTick(() => {
                    this.$refs.reployGrid.showDialog();
                })
            }
        }

    }
</script>
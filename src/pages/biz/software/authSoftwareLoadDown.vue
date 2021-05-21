<template>
    <div>
        <ice-dialog title="请输入密码" :visible.sync="pwDialog" width="400px">
            <div>
                <el-input v-model="passWord" :type="isTrue?'password':''">
                    <i class="el-icon-view" slot="suffix" style="padding-top: 10px" @mouseenter="isTrue=false" @mouseleave="isTrue=true"></i>
                </el-input>
                <span style="color: #F56C6C" v-if="!passWord&&isOk">{{msg}}! 请重新输入</span>
            </div>
            <div class="ice-button-bar">
                <el-button type="primary" @click="savePw" :disabled="!(passWord.trim())">确定</el-button>
                <el-button type="info" @click="closePw">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog :visible.sync="downDialog" title="授权软件列表" width="900px">
            <ice-query-grid :pagination="true"
                            :columns="columns"
                            :query="query"
                            data-url="/biz/BizSoftwareAuthDSoft/list"
                            :operations="operations"></ice-query-grid>
            <div class="ice-button-bar">
                <el-button type="info" @click="closeDown">取消</el-button>
            </div>
        </ice-dialog>
    </div>
    
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "authSoftwareLoadDown",
        components: {IceQueryGrid, IceDialog},
        data(){
            return{
                pwDialog:false,//输入密码弹窗的开关属性，
                passWord:'',//填写的密码
                downDialog:false,//软件列表弹窗的开关属性
                isOk:false,//用来表示是否点击过确定,
                query:[
                    {label:'名称',code:'softName',type:'input',value:'',exp:'like'},
                    {label: '所属分类', code: 'classifyNamePath', type: 'input', value: '', exp: 'like'},
                    {label: '版本', code: 'softVersion', type: 'input', value: '', exp: 'like'},
                    {label: '申请人', code: 'createUser', type: 'input', value: '', exp: 'like'},
                    {label: '委托人', code: 'consignorName', type: 'input', value: '', exp: 'like'}
                ],
                columns:[
                    {label: 'id', code: 'oid',hidden: true},
                    {label: '软件ID', code: 'softId', hidden: true},
                    {label: '名称', code: 'softName', width: 200, sortable: true},
                    {label: '所属分类', code: 'classifyNamePath', sortable: true, width: 150},
                    {label: '版本', code: 'softVersion', width: 100, sortable: true},
                    {label: '授权时间起', code: 'authDateStart', width: 150, sortable: true},
                    {label: '授权时间止', code: 'authDateEnd', width: 150, sortable: true},
                    {label: '授权人', code: 'createUser', width: 100, sortable: true},
                    {label: '委托人', code: 'consignorName', width: 100, sortable: true},
                ],
                operations:[
                    {name:'下载',callback:this.downItem},
                ],
                softwareId:'',
                msg:'',
                isTrue:true
            }
        },
        methods:{
            /**
             * 请输入密码---确定
             */
            savePw(){
                this.$axios.get("/biz/BizSoftwareAuthAf/authDownload",{params:{authCode:this.passWord,softId:this.softwareId}}).then(res=>{
                    if(res.data){
                        this.closePw();
                        this.$downloadFileByKey(res.data);
                    }
                }).catch(e=>{
                    if(e.msg){
                        this.msg = e.msg;
                        this.passWord = '';
                        this.isOk = true;
                    }else{
                        this.$message.error(e);
                    }
                })
            },
            /**
             * 请输入密码--取消
             */
            closePw(){
                this.pwDialog = false;
                this.isOk = false;
            },
            /**
             * 软件列表--取消
             */
            closeDown(){
                this.downDialog = false;
            },
            /**
             *打开软件列表
             */
            openDialog(){
                this.downDialog = true;
            },
            /**
             * 下载
             * @param row
             */
            downItem(row){
                this.passWord = '';
                this.pwDialog = true;
                this.softwareId = row.softId;
            },
            isPassword(){
                //this.isTrue =
            }
        }
    }
</script>

<style scoped>
</style>
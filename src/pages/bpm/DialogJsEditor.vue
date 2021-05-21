<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-dialog :title="tittle" :visible.sync="dialogVisible" width="900px" height="500px">
            <div class="ice-container">
                <ice-js-editor v-model="jsScript" height="465px"   width="860px"  ref="jsEditor"></ice-js-editor>
                <div v-if="docUrl?true:false" slot="tip"style="margin-left:38px" class="el-upload__tip">脚本编辑需符合规范,
                    <el-button size="mini" class="el-button el-button--text el-button--small" @click="showDoc">查看说明文档</el-button></div>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" @click="saveDialog">确 定</el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>

    import IceJsEditor from "../../components/common/base/iceJsEditor/IceJsEditor.vue";

    export default {
        name: 'DialogJsEditor',
        data() {
            return {
                userData:{},
                jsScript:"",
                dialogVisible:false,
                tittle:'脚本编辑框'
            }
        },
        props: {
            callBack: {type:Function,required:true},
            value: {type:String,default:""},
            docUrl:{type:String,default:""}
        },
        methods: {
            saveDialog(){
                this.dialogVisible = false;
                if(this.callBack){
                    this.callBack(this.userData,this.jsScript);
                }
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            setScriptValue(value){
                //this.value=value;
                this.jsScript=value;
                this.$nextTick(() => {
                    this.$refs.jsEditor.setValue(value);
                })
            },
            showDialog(row) {
                this.dialogVisible = true;
                if(row){
                    this.userData=row;
                }
            },
            showDoc(){
                window.open(this.docUrl);
            },
            getScriptFromProp() {
                if (this.value) {
                    return this.value;
                }
                return "";
            }
        },
        watch:{
            dialogVisible() {
                if (this.dialogVisible) {
                    if(this.value){
                        this.jsScript = this.value;
                    }
                }
            }
        },
        components: {
            IceJsEditor
        }
    }

</script>


<style scoped>

</style>

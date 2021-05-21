<template>
    <el-container>
        <div class="container" style="width: 100%">
            <div class="el-button-group" style="right: 3%;position: fixed;z-index: 10;">
                <div>
                    <el-button type="primary" @click="storeBtn">保存</el-button>
                    <el-button type="success" @click="viewBtn">预览</el-button>
                    <el-button type="info" @click="goz1Btn">返回</el-button>
                </div>
            </div>

            <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                     style="margin-top: 10px">

                <el-row :gutter="60">
                    <el-col :span="20">

                        <el-form-item label="标题:" label-width="100px" prop="title">
                            <el-input placeholder="标题" v-model="mainDataForm.title" maxlength="88"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row :gutter="60">
                    <el-col :span="10">
                        <el-form-item label="类型:" label-width="100px" prop="type">
                            <ice-select data-url="/resources/ResAnnType/all" v-model="mainDataForm.annTypeCode"
                                        codeProp="code" textProp="name"></ice-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="选择公告接收者:" label-width="120px">
                            <el-button @click="selectUserOpen">点击选择用户</el-button>
                            <el-button @click="selectRoleOpen">点击选择角色</el-button>
                            <el-button @click="selectDeptOpen">点击选择部门</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row :gutter="60" v-if="dynamicUserTags.length > 0">
                    <el-col :span="20">
                        <el-form-item label="已选择的用户:" label-width="152px">
                            <el-tag
                                    :key="tag"
                                    v-for="tag in dynamicUserTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose('user',tag)">
                                {{tag}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60" v-if="false">
                    <el-col :span="20">
                        <el-form-item label="已选择的角色:" label-width="152px">
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60" v-if="dynamicDeptTags.length > 0">
                    <el-col :span="20">
                        <el-form-item label="已选择的部门:" label-width="152px">
                            <el-tag
                                    :key="tag"
                                    v-for="tag in dynamicDeptTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose('dept',tag)">
                                {{tag}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="22">
                        <el-form-item label="" label-width="10px">
                            <quill-editor ref="myTextEditor" v-model="mainDataForm.content" :options="{placeholder:'请输入公告内容...'}"></quill-editor>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>

        <ice-persion-selector
                mode="hidden"
                choose-item="multiple"
                ref="persionPop"
                :selected-persion="dynamicUserTags"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>

        <ice-dept-selector
                mode="hidden"
                choose-item="multiple"
                ref="persionDept"
                :selected-dept="dynamicDeptTags"
                @select-confirm="selectDeptConfirm">
        </ice-dept-selector>

        <res-announcement-view :data="mainDataForm" title="公告预览" ref="viewann"></res-announcement-view>

    </el-container>
</template>

<script>

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector.vue";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector.vue";
    import ResAnnouncementView from "./ResAnnouncementView.vue";
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        name: "ResAnnouncementStore",
        data(){
            return {
                mainDataForm:{title:null,content:null,annTypeCode:null},
                formRules:{ title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    content: [{required: true, message: '请输入公告内容', trigger: 'blur'}],
                    annTypeCode: [{required: true, message: '请选择类型', trigger: 'blur'}]},
                dynamicUserTags:[],dynamicDeptTags:[],dynamicRoleTags:[],
            }
        },
        methods:{
            goz1Btn(){
                this.$router.go(-1);
            },
            viewBtn(){
                this.$refs.viewann.open();
            },
            selectUserOpen(){
                this.$refs.persionPop.openDialog();
            },
            selectUserConfirm(rows){
                this.dynamicUserTags.splice(0,this.dynamicUserTags.length);
                for(let i = 0 ; i < rows.length ; i++){
                    this.dynamicUserTags.push(rows[i]["code"]);
                }
            },
            selectRoleOpen(){alert('暂无实现')},
            selectDeptOpen(){
                this.$refs.persionDept.openDialog();
            },
            selectDeptConfirm(rows){
                this.dynamicDeptTags.splice(0,this.dynamicDeptTags.length);
                for(let i = 0 ; i < rows.length ; i++){
                    this.dynamicDeptTags.push(rows[i]["deptCode"]);
                }
                console.log(this.dynamicDeptTags)
            },
            handleClose(type,tag) {
                if(type == 'user'){
                    this.dynamicUserTags.splice(this.dynamicUserTags.indexOf(tag), 1);
                }else if(type == 'dept'){
                    this.dynamicDeptTags.splice(this.dynamicDeptTags.indexOf(tag), 1);
                }
            },
            storeBtn(){
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    delete this.mainDataForm.scope;
                    let data = {
                        scope : JSON.stringify({
                            user:this.dynamicUserTags,
                            dept:this.dynamicDeptTags,
                            role:this.dynamicUserTags
                        })
                    }
                    Object.assign(data,this.mainDataForm);
                    this.$axios.post("/resources/ResAnnouncement/saveOrUpdate", data)
                        .then(result => {
                            this.$message.success("操作成功");
                            this.goz1();
                        })
                });
            }
        },
        mounted(){
            let id = this.$route.query['id'];
            if( !(id && id.length > 0) ){
                return;
            }
            //alert('load')
            this.$axios.get("/resources/ResAnnouncement/get", {params: {id: id}})
                .then(result => {
                    this.mainDataForm.oid = result.data.oid;
                    this.mainDataForm.title = result.data.title;
                    this.mainDataForm.content = result.data.content;
                    this.mainDataForm.annTypeCode = result.data.annTypeCode;
                    try {
                        console.log(result.data)
                        if(result.data.scope){
                            let sp = JSON.parse(result.data.scope);
                            this.dynamicUserTags = sp.user;
                            this.dynamicRoleTags = sp.role;
                            this.dynamicDeptTags = sp.dept;
                        }
                    }catch (e) {
                        this.$message.error(e);
                    }

                    JSON.parse(result.data.scope);
                    console.log(this.mainDataForm)
                })
        },
        components: {
            quillEditor,IcePersionSelector,IceDeptSelector,ResAnnouncementView,IceSelect
        },
    }
</script>

<style scoped>

</style>
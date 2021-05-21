<template>
    <div  style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <el-dialog v-dialogDrag title="指定角色" custom-class="ice-dialog" center :visible.sync="dialogVisibleb"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataFormb"  label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="角色ID" label-width="100px" prop="roleId">
                                <el-input v-model="mainDataFormb.roleId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色名称" label-width="100px" prop="roleName">
                                <el-input v-model="mainDataFormb.roleName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" v-if="editData?false:true" @click="saveb">保存</el-button>
                    <el-button type="info" @click="retb">返回</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue';
    export default {
        name: "ExtRole",
        components: {IceGridLayout},
        props:{
            editData:{
                type: Object
            }
        },
        data(){
            return{
                dialogVisibleb:false,
                mainDataFormb:{
                    roleId:'',
                    roleName:''
                }
            }
        },
        methods:{
            edit(){
                if(this.editData){
                    Object.assign(this.mainDataFormb,this.editData);
                }
            },
            clean(){
                 this.mainDataFormb.roleId='';
                this.mainDataFormb.roleName='';
            },
            saveb(){
                this.dialogVisibleb=false;
                this.$emit("set-ext-role",{...this.mainDataFormb});
            },
            retb(){
                this.dialogVisibleb=false;
            }

        }
    }
</script>

<style scoped>

</style>

<template>
    <div class="content-filled">
        <div class="ice-container">

        <el-form :model="dataForm">
            <el-row :gutter="60">
                <el-col :span="24">
                    <div class="approve">
                        <h3>软件安装申请审批单</h3>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="申请单号" label-width="100px" prop="namber">
                        <el-input v-model="dataForm.namber" placeholder="申请单号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="申请人" label-width="100px" prop="name">
                        <el-input v-model="dataForm.name" placeholder="申请人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间" label-width="100px" prop="time">
                        <el-input v-model="dataForm.time" placeholder="申请时间"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="来源" label-width="100px" prop="source">
                        <el-input v-model="dataForm.source" placeholder="来源"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="介质" label-width="100px" prop="medium">
                        <el-input v-model="dataForm.medium" placeholder="介质"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="申请原因" label-width="100px" prop="applicationWhy">
                        <el-input type="textarea" rows="3" v-model="dataForm.applicationWhy" maxlength="256"
                                  placeholder="填写内容不超过256字"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="软件描述" label-width="100px" prop="softdesc">
                        <el-input type="textarea" rows="3" v-model="dataForm.softdesc" placeholder="描述内容不超过64个字" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60" >
                <el-col :span="24">
                    <el-form-item label="安装设备" label-width="100px">
                        <div class="grid-bar">
                            <el-table :data="detailGridData">
                                <el-table-column prop="name"
                                                 label="设备名称">
                                </el-table-column>
                                <el-table-column prop="name"
                                                 label="设备类型">
                                </el-table-column>
                                <el-table-column prop="name"
                                                 label="设备IP">
                                </el-table-column>
                                <el-table-column prop="name"
                                                 label="位置">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="部门领导审批" label-width="100px" prop="softok">
                        <el-input type="textarea" rows="3" v-model="dataForm.softok" placeholder="部门领导审批"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="运维部门审批" label-width="100px" prop="softyes">
                        <el-input type="textarea" rows="3" v-model="dataForm.softyes" placeholder="运维部门审批"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--<el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="办理情况" label-width="100px" prop="softdesc">
                        <div class="bor">
                            <div class="borChild">
                                办理结果
                            </div>
                            <div class="borChildto">
                                <el-input type="textarea" rows="3" v-model="dataForm.softdesc" placeholder="办理结果"></el-input>
                            </div>
                            <div class="borChild">
                                备注
                            </div>
                            <div class="borChildto">
                                <el-input type="textarea" rows="3" v-model="dataForm.softdesc" placeholder="备注"></el-input>
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>-->
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="申请下载时间" label-width="100px" prop="downupTime">
                        <el-date-picker v-model="dataForm.downupTime" placeholder="开始时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="授权回收时间" label-width="100px" prop="recoverTime">
                        <el-date-picker v-model="dataForm.recoverTime" placeholder="回收时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="primary" @click="saveUp">提交</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ApplicationApprove",
        data(){
            return{
                dataForm:{},
                detailGridData:[]
            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .approve{
        text-align: center;
    }
    .bor{
        border: 1px solid #d9d9d9;
    }


</style>
<template>
    <div class="content-filled">
        <el-tabs v-model="activeName">
            <el-tab-pane label="合作单位管理" name="name1">
                <ice-query-grid
                        :pagination="true"
                        ref="iceGrid"
                        data-url="/biz/BizSoftwareDownloadHistory/list"
                        :query="query"
                        :buttons="buttons"
                        :operations="operations"
                        :columns="columns">
                </ice-query-grid>
            </el-tab-pane>
            <el-tab-pane label="联系人信息" name="name2">
                <ice-query-grid
                        :pagination="true"
                        ref="iceGrid"
                        data-url="/biz/BizSoftwareDownloadHistory/list"
                        :query="queryK"
                        :buttons="buttonsK"
                        :operations="operationsK"
                        :columns="columnsK">
                </ice-query-grid>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-dialogDrag title="新增" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-form :model="mainData" ref="form" label-width="100px" :rules="formRules">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="合作单位名称" prop="">
                            <el-input v-model="mainData.a">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织机构代码" prop="">
                            <el-input v-model="mainData.b">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="分类" prop="">
                            <el-select v-model="mainData.c">
                                <el-option label="类型一" value="1"></el-option>
                                <el-option label="类型二" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业性质" prop="">
                            <el-input v-model="mainData.d"></el-input>
                            <el-select v-model="mainData.d">
                                <el-option label="性质1" value="1"></el-option>
                                <el-option label="性质2" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="邮政编码" prop="">
                            <el-input v-model="mainData.e"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电子邮件" prop="">
                            <el-input v-model="mainData.f"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="企业法人" prop="">
                            <el-input v-model="mainData.g"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="注册资金(万)" prop="">
                            <el-input v-model="mainData.h">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="注册资金币种" prop="">
                            <el-select v-model="mainData.i">
                                <el-option label="类型一" value="1"></el-option>
                                <el-option label="类型二" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="开户银行" prop="">
                            <el-input v-model="mainData.j">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开户账号" prop="">
                            <el-input v-model="mainData.k">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="资质" prop="">
                            <el-input v-model="mainData.l">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传真" prop="">
                            <el-input v-model="mainData.m">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="企业地址" prop="">
                            <el-input v-model="mainData.n">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业网址" prop="">
                            <el-input v-model="mainData.o"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="企业简介" prop="">
                            <el-input type="textarea" v-model="mainData.p" rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input type="textarea" v-model="mainData.q" rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="附件信息" prop="">
                            <el-input type="textarea" v-model="mainData.r" rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="新增" custom-class="ice-dialog" center :visible.sync="userDialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-form :model="userMainData" ref="form" label-width="100px" :rules="userFormRules">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="联系人名称" prop="">
                            <el-input v-model="mainData.a">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式" prop="">
                            <el-input v-model="mainData.b">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="性别" prop="">
                            <el-input v-model="mainData.c">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作单位" prop="">
                            <el-input v-model="mainData.d">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="证件类型" prop="">
                            <el-input v-model="mainData.e">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号" prop="">
                            <el-input v-model="mainData.f">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="mainData.g" type="textarea" rows="3">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="saveUser">保存</el-button>
                <el-button type="info" @click="closeDialogUser">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    export default {
        name: "heZuoDanWei",
        components: {IceQueryGrid},
        data(){
            return{
                query:[
                    {label: '合作单位名称', code: 'softName'},
                    {label: '分类', code: 'softVersion'},
                    {label: '企业性质', code: 'createDate'},
                    {label: '企业法人', code: 'createDate'},
                    {label: '组织代码', code: 'createDate'},
                    {label: '企业网站', code: 'createDate'},
                    {label: '企业地址', code: 'createDate'},
                ],
                buttons:[
                    {name: '新增',  type: 'primary', callback: this.addItem},
                    {name: '导出',  type: 'export'},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '合作单位名称', code: 'softName', width: 100},
                    {label: '分类', code: 'softVersion', width: 100},
                    {label: '企业性质', code: 'createDate', width: 100},
                    {label: '企业法人', code: 'createDate', width: 100},
                    {label: '组织代码', code: 'createDate', width: 100},
                    {label: '企业网站', code: 'createDate', width: 100},
                    {label: '企业地址', code: 'createDate', width: 100},
                ],
                operations:[
                    {name: '详情', callback: this.detailsItem},
                    {name: '编辑', callback: this.upDataItem},
                    {name: '删除', callback: this.deleteItem},
                ],
                queryK:[
                    {label: '合作单位名称', code: 'softName'},
                    {label: '联系人', code: 'softVersion'},
                    {label: '性别', code: 'createDate'},
                    {label: '联系方式', code: 'createDate'},
                    {label: '证件类型', code: 'createDate'},
                    {label: '证件号', code: 'createDate'},
                ],
                buttonsK:[
                    {name: '新增',  type: 'primary', callback: this.userAddItem},
                    {name: '导出',  type: 'export'},
                ],
                columnsK:[
                    {code: "oid", hidden: true},
                    {label: '合作单位名称', code: 'softName', width: 100},
                    {label: '联系人', code: 'softVersion', width: 100},
                    {label: '性别', code: 'createDate', width: 100},
                    {label: '联系方式', code: 'createDate', width: 100},
                    {label: '证件类型', code: 'createDate', width: 100},
                    {label: '证件号', code: 'createDate', width: 100},
                ],
                operationsK:[
                    {name: '编辑', callback: this.userUpDataItem},
                    {name: '删除', callback: this.userDeleteItem},
                ],
                dialogVisible:false,            //合作单位弹框开关属性
                userDialogVisible:false,        //联系人弹框开关属性
                    mainData:{//表单对象
                    a:'',
                    b:'',
                    c:'',
                    d:'',
                    e:'',
                    f:'',
                    g:'',
                    h:'',
                    i:'',
                    j:'',
                    k:'',
                    l:'',
                    m:'',
                    n:'',
                    o:'',
                    p:'',
                    q:'',
                    r:''
                },
                formRules:{//表单字段规则

                },
                userMainData:{//联系人表单数据
                    a:'',
                    b:'',
                    c:'',
                    d:'',
                    e:'',
                    f:'',
                    g:''
                },
                userFormRules:{//联系人表单字段规则

                }

            }
        },
        methods:{
            /**详情*/
            detailsItem(){
                this.dialogVisible = true;
            },
            /**编辑*/
            upDataItem(){
                this.dialogVisible = true;
            },
            /**删除*/
            deleteItem(){

            },
            /**联系人--新增*/
            userAddItem(){
                this.userDialogVisible = true;
            },
            /**联系人--编辑*/
            userUpDataItem(){
                this.userDialogVisible = false;
            },
            /**联系人--删除*/
            userDeleteItem(){

            },
            /**合作单位弹框--保存*/
            save(){

            },
            /**合作单位弹框--返回*/
            closeDialog(){
                this.DialogVisible = false;
            },
            /**联系人--保存*/
            saveUser(){

            },
            /**联系人--返回*/
            closeDialogUser(){
                this.userDialogVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>
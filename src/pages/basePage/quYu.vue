<template>
    <div class="content-filled">
        <ice-query-grid
                :pagination="true"
                ref="iceGrid"
                data-url="/biz/BizSoftwareDownloadHistory/list"
                :query="query"
                :buttons="buttons"
                :operations="operations"
                :columns="columns">
        </ice-query-grid>
        <el-dialog v-dialogDrag title="新增" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-form :model="mainData" ref="form" label-width="100px" :rules="formRules">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="区域单位" prop="">
                            <el-input v-model="mainData.a">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="chooseDept"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="网络类型" prop="">
                            <el-select v-model="mainData.b">
                                <el-option label="类型一" value="1"></el-option>
                                <el-option label="类型二" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="区域简称" prop="">
                            <el-input v-model="mainData.c"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="区域代码" prop="">
                            <el-input v-model="mainData.d"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="显示顺序" prop="">
                            <el-input v-model="mainData.e"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否涉密" prop="">
                            <el-radio v-model="mainData.f" label="1">是</el-radio>
                            <el-radio v-model="mainData.f" label="2">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否禁用" prop="">
                            <el-radio v-model="mainData.g" label="1">是</el-radio>
                            <el-radio v-model="mainData.g" label="2">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input type="textarea" v-model="mainData.h" rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog v-dialogDrag title="单位选择" custom-class="ice-dialog" center :visible.sync="deptDialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-tabs v-model="activeName">
                <el-tab-pane label="组织机构" name="name1">
                    <ice-query-grid
                            :pagination="true"
                            ref="iceGrid"
                            data-url="/biz/BizSoftwareDownloadHistory/list"
                            :columns="columnsQ">
                    </ice-query-grid>
                </el-tab-pane>
                <el-tab-pane label="客户单位" name="name2">
                    <ice-query-grid
                            :pagination="true"
                            ref="iceGrid"
                            data-url="/biz/BizSoftwareDownloadHistory/list"
                            :query="queryK"
                            :columns="columnsK">
                    </ice-query-grid>
                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="saveDept">保存</el-button>
                <el-button type="info" @click="closeDialogDept">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    export default {
        name: "quYu",
        components: {IceQueryGrid},
        data(){
            return{
                query:[
                    {label: '区域简称', code: 'softName'},
                    {label: '区域单位', code: 'softVersion'},
                    {label: '网络类型', code: 'createDate'},
                    {label: '区域代码', code: 'createDate'},
                    {label: '是否涉密', code: 'createDate'},
                    {label: '是否禁用', code: 'createDate'},
                    {label: '显示顺序', code: 'createDate'},
                    {label: '创建人', code: 'createDate'},
                    {label: '创建时间', code: 'createDate'},
                    {label: '修改人', code: 'createDate'},
                    {label: '修改事件', code: 'createDate'},
                ],
                buttons:[
                    {name: '新增',  type: 'primary', callback: this.addItem},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '区域简称', code: 'softName', width: 100},
                    {label: '区域单位', code: 'softVersion', width: 100},
                    {label: '网络类型', code: 'createDate', width: 100},
                    {label: '区域代码', code: 'createDate', width: 100},
                    {label: '是否涉密', code: 'createDate', width: 100},
                    {label: '是否禁用', code: 'createDate', width: 100},
                    {label: '显示顺序', code: 'createDate', width: 100},
                    {label: '创建人', code: 'createDate', width: 100},
                    {label: '创建时间', code: 'createDate', width: 100},
                    {label: '修改人', code: 'createDate', width: 100},
                    {label: '修改事件', code: 'createDate', width: 100},
                ],
                operations:[
                    {name: '编辑', callback: this.upDataItem},
                    {name: '详情', callback: this.detailsItem}
                ],
                columnsQ:[
                    {code: "oid", hidden: true},
                    {label: '部门名称', code: 'softName', width: 100},
                    {label: '部门级别', code: 'softVersion', width: 100},
                    {label: '部门编码', code: 'createDate', width: 100},
                    {label: '是否法人单位', code: 'createDate', width: 100},
                    {label: '是否启用', code: 'createDate', width: 100},
                ],
                queryK:[
                    {label: '合作单位名称', code: 'softName'},
                    {label: '分类', code: 'softVersion'},
                    {label: '企业性质', code: 'createDate'},
                    {label: '企业法人', code: 'createDate'},
                    {label: '组织代码', code: 'createDate'},
                    {label: '企业网站', code: 'createDate'},
                    {label: '企业地址', code: 'createDate'},
                ],
                columnsK:[
                    {code: "oid", hidden: true},
                    {label: '合作单位名称', code: 'softName', width: 100},
                    {label: '分类', code: 'softVersion', width: 100},
                    {label: '企业性质', code: 'createDate', width: 100},
                    {label: '企业法人', code: 'createDate', width: 100},
                    {label: '组织代码', code: 'createDate', width: 100},
                    {label: '企业网站', code: 'createDate', width: 100},
                    {label: '企业地址', code: 'createDate', width: 100},
                ],
                dialogVisible:false,                //弹窗开关属性
                deptDialogVisible:false,            //单位选择弹框开关属性
                mainData:{//表单对象
                    a:'',
                    b:'',
                    c:'',
                    d:'',
                    e:'',
                    f:'',
                    g:'',
                    h:''
                },
                formRules:{//表单字段规则

                },
                activeName:'name1',                 //tabs第一个展示的tab页
            }
        },
        methods:{
            /**新增*/
            addItem(){
                this.dialogVisible = true;
            },
            /**编辑*/
            upDataItem(){
                this.dialogVisible = true;
            },
            /**详情*/
            detailsItem(){
                this.dialogVisible = true;
            },
            /**单位选择开启*/
            chooseDept(){
                this.deptDialogVisible = true;
            },
            /**单位选择--弹窗关闭*/
            closeDialogDept(){
                this.deptDialogVisible = false;
            },
            /**单位选择保存*/
            saveDept(){
                alert("待接口")
            }
        }
    }
</script>

<style scoped>

</style>
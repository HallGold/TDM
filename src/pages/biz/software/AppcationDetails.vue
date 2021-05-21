<template>
    <div class="content-filled">
        <el-tabs v-model="activeName" @tab-click="activeHandleClick">
            <el-tab-pane label="基本信息" name="first">
                <div style="max-height: 400px;overflow-y: scroll;overflow-x: hidden">
                    <el-form :model="mainDataForm" class="conditon-bar" ref="form" disabled>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="软件名称" label-width="100px" prop="softName">
                                    <el-input v-model="mainDataForm.softName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="软件类别" label-width="100px" prop="headPortraitUrl">
                                    <el-input v-model="mainDataForm.classType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所属分类" label-width="100px" prop="classifyNamePath">
                                    <el-input v-model="mainDataForm.classTypePath"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="软件级别" label-width="100px" prop="softRegion">
                                    <el-select placeholder="请选择" v-model="mainDataForm.softRegion">
                                        <el-option
                                                v-for="item in softRegions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="软件来源" label-width="100px" prop="fromYon">
                                    <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                                v-model="mainDataForm.fromYon"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="软件版本" label-width="100px" prop="softVersion">
                                    <el-input v-model="mainDataForm.softVersion"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="申请人:" label-width="100px" prop="createUser">
                                    <el-input v-model="mainDataForm.afUserName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="申请人部门:" label-width="100px" prop="dataDeptId">
                                    <el-input v-model="mainDataForm.afDepartmentName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="联系电话:" label-width="100px" prop="afPhone">
                                    <el-input v-model="mainDataForm.afPhone"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="发布者:" label-width="100px" prop="publishAuthor">
                                    <el-input v-model="mainDataForm.publishAuthor"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="下载次数:" label-width="100px" prop="downloadTotal">
                                    <el-input v-model="mainDataForm.downloadTotal"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="图标:" label-width="100px" prop="softIconId">
                                    <img :src="$showImage(mainDataForm.softIconId)" class="avatar-uploader"/>
                                    <!--<ice-image-uploader v-model="mainDataForm.softIconId" class="avatar-uploader" :disabled=true></ice-image-uploader>-->
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="总流量:" label-width="100px" prop="flowTotal">
                                    <el-input v-model="mainDataForm.flowTotal"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用户评分:" label-width="100px" prop="gradeTotal">
                                    <el-input v-model="mainDataForm.gradeTotal"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">

                            <el-col :span="8">
                                <el-form-item label="文件大小:" label-width="100px" prop="softSize">
                                    <el-input v-model="mainDataForm.softSize"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发布时间:" label-width="100px" prop="publishDate">
                                    <el-input v-model="mainDataForm.publishDate"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">
                                <el-form-item label="关键字:" label-width="100px" prop="keywords">
                                    <el-input v-model="mainDataForm.keywords"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="使用时授权:" label-width="100px" prop="downloadAuth"
                                              v-if="mainDataForm.classType=='运维软件'">
                                    <el-input v-model="mainDataForm.downloadAuth==0?'否':'是'"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" v-if="mainDataForm.authUserNames">
                            <el-col :span="24">
                                <el-form-item label="授权人员:" label-width="100px" prop="">
                                    <el-input v-model="mainDataForm.authUserNames" type="textarea" :rows="3"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" v-if="mainDataForm.authDeptNames">
                            <el-col :span="24">
                                <el-form-item label="授权单位:" label-width="100px" prop="">
                                    <el-input v-model="mainDataForm.authDeptNames" type="textarea" :rows="3"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">
                                <el-form-item label="软件描述:" label-width="100px" prop="softDescribe">
                                    <el-input :rows="5" :showWordLimit="true"
                                              disabled maxlength=300 placeholder="请输入内容" ref="myTextEditor"
                                              type="textarea"
                                              v-model="mainDataForm.softDescribe"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史版本" name="second" style="height: 400px;width: 792px;overflow: hidden" v-if="isLoad">
                <div style="max-height: 400px;overflow-y: scroll;overflow-x: hidden">
                    <ice-query-grid
                            :pagination="false"
                            ref="iceGrid"
                            data-url="/biz/BizSoftwareInfo/hisList"
                            :query="query"
                            :columns="columns"></ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史流程" name="flow" style="height: 400px;width: 792px;overflow: hidden" v-if="isLoad">
                <div style="max-height: 400px;overflow-y: scroll;overflow-x: hidden">
                    <ice-query-grid
                            :pagination="true"
                            ref="flowGrid"
                            data-url="/biz/BizSoftwareFlowHistory/list"
                            :query="flowQuery"
                            :columns="flowColumns"></ice-query-grid>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import VueScroll from 'vuescroll'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "AppcationDetails",
        components: {IceSelect, IceQueryGrid, IceImageUploader, VueScroll, quillEditor},
        props: {
            mainDataForm: {},
            activeName: String,
            isLoad: Boolean
        },
        data() {
            return {
                query: [
                    {
                        type: 'static', code: "oid", exp: "=", value: () => {
                            return this.mainDataForm.softwareId ? this.mainDataForm.softwareId : this.mainDataForm.oid;
                        }
                    },
                    // {type: 'input', label: '软件名称', code: 'name', value: ''}
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '软件名称', code: 'softName', width: 120},
                    {label: '软件版本', code: 'softVersion', width: 100},
                    {
                        label: '软件图标', code: 'softIconId', width: 100, renderCell(h, data) {
                            return <img src={this.$showImage(data.row.softIconId)} width="22px" height="22px"/>
                        }
                    },
                    {
                        label: '软件大小', code: 'softSize', width: 100, formatter: (data) => {
                            return fileUtil.fileSizeFormat(data.softSize)
                        }
                    },
                    {label: '发布时间', code: 'publishDate', width: 120}
                ],
                flowQuery:[{type: 'static', code: "softwareId", exp: "=", value: () => {
                    return this.mainDataForm.oid
                }}],
                flowColumns:[{code: "oid", hidden: true},
                    {label: '流程名称', code: 'flowName', width: 120},
                    {label: '申请人', code: 'afUserCode', width: 120},
                    {label: '操作时间', code: 'createDate', width: 120}],
                softRegions: [{
                    value: 1,
                    label: '所级'
                },{
                    value: 0,
                    label: '院级'
                }],
            }
        },
        methods: {
            activeHandleClick(tab, event) {
                if(tab.name == 'second'){
                    this.$refs.iceGrid.refresh();
                }else if(tab.name == 'flow'){
                    console.log('================')
                    console.log(this.flowNames)
                    this.$refs.flowGrid.refresh();
                }

            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        width: 140px;
        height: 140px;
        overflow: hidden;
    }
</style>
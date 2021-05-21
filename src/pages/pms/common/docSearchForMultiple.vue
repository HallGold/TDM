<template>
    <div class="ice-container">
        <el-main>
            <div>
                <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading" label-position="labelPosition"
                         label-width="80px">
                    <ice-grid-layout :columns="3" name="检索条件">
                        <div style="float:left;width: 20%;">
                            <el-form-item label="型号名称" prop="proname">
                                <el-input style="width: 60%" :readonly="true" v-model="formModel.proname"
                                          placeholder="选择项目"
                                >
                                    <el-button slot="append" icon="el-icon-circle-plus-outline"
                                               @click="openprojectSearch"></el-button>
                                    >
                                </el-input>
                            </el-form-item>
                        </div>
                        <div style="float:left;width: 20%;">
                            <el-form-item :span="6" label="名称" prop="name">
                                <el-input style="width: 60%" v-model="formModel.name" placeholder="请输入内容"
                                ></el-input>
                            </el-form-item>
                        </div>
                        <div style="float:left;width: 20%;">
                            <el-form-item label="编码" prop="docNumber">
                                <el-input style="width: 60%" v-model="formModel.docNumber"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </div>
                        <div style="float:left;width: 20%;">
                            <el-form-item :span="7" label="类型" prop="queryType">
                                <el-select style="width: 60%" v-model="formModel.queryType" placeholder="请选择">
                                    <el-option
                                            v-for="item in formModel.dataType"
                                            :key="item"
                                            :label="item"
                                            :value="item"
                                            @click.native="getTypeoid(item)">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>

                        <div style="float:left;width: 20%;">
                            <el-form-item label="创建者" prop="createUser">
                                <ice-persion-selector ref="userSelect" style="width: 60%" chooseItem="multiple"
                                                      mode="onlySelect"
                                                      v-model="formModel.createName"
                                                      @select-confirm="depts"
                                >
                                </ice-persion-selector>
                            </el-form-item>
                        </div>
                        <div style="float:left">
                            <el-form-item :span="3" label="创建时间" prop="createDate">
                                <el-date-picker
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        v-model="formModel.createDate"
                                        ref="Time"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="ice-button-bar">
                            <el-button type="primary" @click="queryList">查询</el-button>
                            <el-button type="info" @click="resetForm">重置</el-button>
                        </div>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div ref="divGrid">
                <ice-query-grid
                        :dataUrl="dataUrl"
                        chooseItem="multiple"
                        @select="docSelect"
                        exportTitle="属性管理"
                        :columns="columns"
                        :gridAutoRefresh="true"
                        :gridData="gridDatas"
                        :query="query"
                        :operations="operations"
                        ref="grid"
                        pagination="pagination"
                        v-show="showDoSearch"
                >
                </ice-query-grid>
            </div>
            <project-search ref="projecyserarchref" :projectfather-method="projectfatherMethod"
                            :ishow="false"></project-search>
        </el-main>
    </div>
</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import projectSearch from "./projectSearch";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";


    export default {
        components: {IceSelect, IceDialog, IceQueryGrid, IcePersionSelector, projectSearch, IceGridLayout},
        props: {
            rwdata: {
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                pagination: false,
                showDoSearch: false,
                loading: false,
                visible: false,
                data: false,
                objectType: '',
                rules: {},
                createUserList: '',
                formModel: {
                    dataType: ['文档', '更改通告'],
                    name: '',
                    proname: '',
                    docNumber: '',
                    beginDate: '',
                    endDate: '',
                    createUserList: '',
                    createName: '',

                },
                xmxzshow: '2', //1显示 2隐藏,
                //编码是否重复的校验
                checkValide: true,
                planQuery: this.$route.query.oid,
                query: [
                    {type: 'static', code: 'docNumber', label: '编码', value: null},
                    {type: 'static', code: 'name', label: '名称', value: null},
                    {type: 'static', code: 'proname', label: '产品库名称', value: null},
                    {type: 'static', code: 'createUser', label: '創建者', value: null},
                    {type: 'static', code: 'beginDate', label: '开始时间', value: null},
                    {type: 'static', code: 'endDate', label: '结束时间', value: null},
                    {type: 'static', code: 'queryType', label: '类型', value: null},
                    {type: 'static', code: 'project', label: '项目', value: null},

                ],
                visablebean: {
                    docNumber: null,
                    name: null,
                    proname: null,
                    createUser: null,
                    beginDate: null,
                    endDate: null,
                },
                // this.columns = [
                //     {code: 'typeoid', hidden: true},
                //     {code: 'containeroid', hidden: true},
                //     {code: 'stateoid', hidden: true},
                //     {code: 'createUser', hidden: true},
                //     {code: 'oid', hidden: true},
                //     {label: '编码', code: 'docNumber', autoWidth: true},
                //     {label: '名称', code: 'name', autoWidth: true},
                //     {label: '密级', code: 'dataSecretLevcode', autoWidth: true, mapTypeCode: 'DATA_SECRET_LEVEL'},
                //     {label: '状态', code: 'state', autoWidth: true},
                //     {label: '来源', code: 'source', autoWidth: true},
                //     {label: '类型', code: 'type', autoWidth: true},
                //     {label: '创建时间', code: 'createDate', autoWidth: true},
                //     {label: '修改时间', code: 'updateDate', autoWidth: true},
                // ];
                columns: [{code: 'masteroid', hidden: true},
                    {code: 'objversion', hidden: true},
                    {code: 'iteration', hidden: true},
                    {code: 'typeoid', hidden: true},
                    {code: 'lifecycletemplateoid', hidden: true},
                    {code: 'containeroid', hidden: true},
                    {code: 'folderoid', hidden: true},
                    {code: 'deleteStatus', hidden: true},
                    {code: 'lockedStatus', hidden: true},
                    {code: 'stateoid', hidden: true},
                    {code: 'createUser', hidden: true},
                    {code: 'oid', hidden: true},
                    {label: '编码', code: 'docNumber'},
                    {label: '名称', code: 'name'},
                    {label: '版本', code: 'version'},
                    {label: '状态', code: 'lifeTemplateState'},
                    {label: '类型', code: 'type'},
                    {label: '创建时间', code: 'createDate'},
                    {label: '修改时间', code: 'updateDate', autoWidth: true},],
                operations: [
                    {name: '详情', callback: this.queryCK, ctrlCode: "BCK"},
                ],
                gridDatas: [],
                dataUrl: '',
            }
        },

        methods: {
            queryList() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let docNumber = this.formModel.docNumber.replace("*", "%");
                        let name = this.formModel.name.replace("*", "%");
                        this.query[0].value = '%' + docNumber + '%';
                        this.query[1].value = '%' + name + '%';
                        this.query[2].value = this.formModel.proname;
                        this.query[3].value = this.createUserList;
                        this.query[7].value = "pms";
                        let data = this.createDate;
                        if (this.formModel.createDate != undefined) {
                            this.query[4].value = this.formModel.createDate[0];
                            this.query[5].value = this.formModel.createDate[1];
                            this.visablebean.beginDate = this.formModel.createDate[0];
                            this.visablebean.endDate = this.formModel.createDate[1];
                        }
                        if (this.isEmpty(this.query[6].value)) {
                            this.$alert('类型为必填!', '提示', {
                                confirmButtonText: '确定',
                            });
                            return;
                        }


                        if (this.objectType == 'changenotice') {
                            this.columns = [
                                {code: 'typeoid', hidden: true},
                                {code: 'containeroid', hidden: true},
                                {code: 'stateoid', hidden: true},
                                {code: 'createUser', hidden: true},
                                {code: 'oid', hidden: true},
                                {label: '编码', code: 'docNumber', autoWidth: true},
                                {label: '名称', code: 'name', autoWidth: true},
                                {
                                    label: '密级',
                                    code: 'dataSecretLevcode',
                                    autoWidth: true,
                                    mapTypeCode: 'DATA_SECRET_LEVEL'
                                },
                                {label: '状态', code: 'state', autoWidth: true},
                                {label: '来源', code: 'source', autoWidth: true},
                                {label: '类型', code: 'type', autoWidth: true},
                                {label: '创建时间', code: 'createDate', autoWidth: true},
                                {label: '修改时间', code: 'updateDate', autoWidth: true},
                            ];
                            this.query[6].value = this.objectType;
                            this.dataUrl = '/pdm/ChangeSerch/queryList';
                        } else if (this.objectType == 'document') {
                            this.columns = [
                                {code: 'masteroid', hidden: true},
                                {code: 'objversion', hidden: true},
                                {code: 'iteration', hidden: true},
                                {code: 'typeoid', hidden: true},
                                {code: 'lifecycletemplateoid', hidden: true},
                                {code: 'containeroid', hidden: true},
                                {code: 'folderoid', hidden: true},
                                {code: 'deleteStatus', hidden: true},
                                {code: 'lockedStatus', hidden: true},
                                {code: 'stateoid', hidden: true},
                                {code: 'createUser', hidden: true},
                                {code: 'oid', hidden: true},
                                {label: '编码', code: 'docNumber'},
                                {label: '名称', code: 'name'},
                                {label: '版本', code: 'version'},
                                {label: '状态', code: 'lifeTemplateState'},
                                {label: '类型', code: 'type'},
                                {label: '创建时间', code: 'createDate'},
                                {label: '修改时间', code: 'updateDate', autoWidth: true},
                            ];
                            this.query[6].value = this.objectType;
                            this.dataUrl = '/pdm/DocSerchVo/queryList';
                        }
                        this.showDoSearch = true;
                        this.$refs.grid.refresh();
                        this.$refs.divGrid.hidden;
                    }
                })

            },
            getTypeoid(item) {
                if (item == '更改通告') {
                    this.objectType = 'changenotice';
                    this.query[6].value = this.objectType
                } else {
                    this.objectType = 'document';
                    this.query[6].value = this.objectType
                }
            },
            projectfatherMethod(rows) {
                if (!(rows.constructor == Array)) {
                    return;
                }
                let arr = [];
                let str = '';
                for (let i = 0; i < rows.length; i++) {
                    if (i + 1 == rows.length) {
                        str += rows[i].xmname;
                    } else {
                        str += rows[i].xmname + ',';
                    }
                    arr.push(rows[i].oid);
                }
                this.query[2].value = JSON.stringify(arr);
                this.formModel.proname = str;
            },
            depts(val) {
                let data = [];
                for (let code of val) {
                    data.push(code.code);
                }
                this.createUserList = data.join(',');
            },
            openprojectSearch() {
                this.xmxzshow = '1';
                this.$refs.projecyserarchref.showT = true;
            },
            isEmpty(obj) {
                if (typeof obj == "undefined" || obj == null || obj == "") {
                    return true;
                } else {
                    return false;
                }
            },
            resetForm() {
                this.$refs.form.resetFields();
                this.formModel.proname = "";
                this.formModel.createName = "";
            },
            docSelect(row) {
                if (row) {
                    this.$emit('fatherMethod', row);
                }

            },
            queryCK(row) {
                let query = {};
                query.typeOid = row.typeoid;
                query.pboOid = row.oid;
                query.tableType = '';
                query.tableURL = '';
                query.docObject_docOid = row.oid;
                // query.doctypeName='doc';
                query.objectType = 'PDM_DOCUMENT';
                query.linkoid = row.linkoid;
                localStorage.setItem("infoquery", JSON.stringify(query));
                let url = window.location.href;
                let targetUrl = url.split("#")[0];
                if (url.indexOf("info?") != -1) {
                    targetUrl += '#/pdm/pdmObject/info2';
                } else {
                    targetUrl += '#/pdm/pdmObject/info';
                }
                window.open(targetUrl);
            }
            ,
            // 賦值
            assignmentData () {
                this.$nextTick(c=>{
                    this.query[7].value = "pms";
                    this.query[2].value = this.rwdata.xmname;
                    this.formModel.proname = this.rwdata.xmname;
                    this.query[3].value = this.$userInfo.userCode;
                    this.formModel.createName = this.$userInfo.userName;
                    this.dataUrl = '/pdm/DocSerchVo/queryList';
                    this.showDoSearch = true;
                    this.$refs.grid.refresh();
                })
            }
        }
        ,
        computed: {}
        ,
        watch: {
            rwdata() {
                this.assignmentData();
            }
        }
        ,
        created() {
            this.assignmentData();
        }
        ,
    }

</script>


<style scoped>

</style>

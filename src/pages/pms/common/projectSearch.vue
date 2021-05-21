<template>
    <div class="ice-container">
        <el-main>
            <ice-dialog :visible.sync="showT" title="项目检索" width="1000px" height="600px">
                <div ref="dialogref">
                    <!--查询条件-->
                    <el-form :model="formModel" :rules="rules"   ref="projectform" v-loading="loading" label-position="labelPosition"
                             label-width="120px">
                        <el-row :gutter="20">
                            <el-col style="margin: 5px 0;">
                                <div style="float:left;">
                                    <el-form-item :span="7" label="项目名称" prop="xmname" >
                                        <el-input  v-model="formModel.xmname" placeholder="项目名称"
                                        ></el-input>
                                    </el-form-item>
                                </div>
                                <div style="float:left">

                                    <el-form-item  :span="6" label="项目编码(所内)" prop="xmcode">
                                        <el-input  v-model="formModel.xmcode" placeholder="请输入内容"
                                        ></el-input>
                                    </el-form-item>
                                </div>
                                <div style="float:left">
                                    <el-form-item  :span="6" label="项目状态" prop="xmzt">
                                        <ice-select v-model="formModel.xmzt" map-type-code="XMZT"></ice-select>

                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="ice-center-button-bar">
                            <el-button type="primary" @click="queryList" >查询</el-button>
                            <el-button type="info" @click="resetForm">重置</el-button>
                        </div>
                    </el-form>
                    <!--查询条件结果-->
                    <ice-query-grid
                            dataUrl="/pdm/pdmXm/queryList"
                            exportTitle="项目检索"
                            :columns="columns"
                            :gridAutoRefresh="true"
                            chooseItem="single"
                            @selection-change="select"
                            :query="query"
                            :operations="operations"
                            ref="grid"
                            :pagination = "pagination"

                    >
                    </ice-query-grid>
                    <div class="ice-center-button-bar">
                         <el-button type="danger" @click="showT=false">关闭</el-button>
                        <el-button type="primary"  @click="childMethod">确定</el-button>
                         <!--<el-button type="success" @click="submit" :disabled="errorNum > 0||tableData.length <= 0">提交
                         </el-button>-->
                     </div>
                </div>
            </ice-dialog>

            <!--======================加载项目结束================================-->
        </el-main>
    </div>
</template>
<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";




    export default {
        name: 'projectSearch',
        components: {IceSelect, IceDialog, IceQueryGrid},
        props: {
            projectfatherMethod: {
                type: Function,
                default: null
            },
            coleMeathod: {
                type: Function,
                default: null

            },
        },
        data() {
            return {
                showT:false,
                showSearch:false,
                pagination:true,
                loading: false,
                visible: false,
                data: false,
                rules: {},
                formModel: {
                    pid:'',
                    oid: '',
                    xmname : '',
                    xmcode: '',
                    xmcode_sw:'',
                    xmzt: '',
                    xmkname:'',
                    dataSecretLevcode:'',
                },
                gridDatas: [],
                datarows: [],
                query: [
                    {type: 'static', code: 'xmname', label: '项目名称',value:null},
                    {type: 'static', code: 'xmcode', label: '项目编码',value:null},
                    {type: 'static', code: 'xmzt', label: '项目状态',value:null},
                ],

                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'pid', hidden: true},
                    {code: 'xmcode_sw', hidden: true},
                    {code: 'xmkname', hidden: true},
                    {label: '项目名称', code: 'xmname'},
                    {label: '项目编码', code: 'xmcode'},
                    {label: '项目状态', code: 'xmzt',mapTypeCode: 'XMZT'},
                    {label: '项目密级', code: 'dataSecretLevcode', mapTypeCode:'DATA_SECRET_LEVEL'},
                ],
                operations: [
                    /*{name: '详情', callback: this.queryCK, ctrlCode: "BCK"},*/
                ],
                dataUrl:'/pdm/pdmXm/queryList',
            }
        },
        methods: {
            childMethod() {
                if (this.projectfatherMethod) {
                    this.projectfatherMethod(this.datarows);
                    this.showT = false;
                }
                if(this.coleMeathod){
                    this.coleMeathod();
                }
            },
            select(rows){
                this.datarows = rows;
                console.log(this.datarows);
            },
            queryList() {
                let xmname = this.formModel.xmname;
                let xmcode = this.formModel.xmcode;
                let xmzt = this.formModel.xmzt;

                this.query[0].value=xmname;
                this.query[1].value=xmcode;
                this.query[2].value=xmzt;

                let bo  = true;
                for (let i = 0; i < 3; i++) {
                    if(!this.isEmpty(this.query[i].value)){
                        bo = false;
                    }
                }
                if(false){
                    this.$alert('查询条件必须选择一个!', '提示', {
                        confirmButtonText: '确定',
                    });
                    return ;
                }
                this.dataUrl = '/pdm/pdmXm/queryList';
                //this.showSearch=true;
                this.$refs.grid.refresh();
            },
            isEmpty(obj) {
                if(typeof obj == "undefined" || obj == null || obj == ""){
                    return true;
                }else{
                    return false;
                }
            },
            resetForm() {
                this.query[0].value=null;
                this.query[1].value=null;
                this.query[2].value=null;
                this.datarows = [];
                this.formModel = {
                    pid:'',
                    oid: '',
                    xmname : '',
                    xmcode: '',
                    xmcode_sw:'',
                    xmzt: '',
                    xmkname:'',
                    dataSecretLevcode:'',
                };
            },
        }
        ,
        computed: {}
        ,
        watch: {
            ishow(val){
                if(val){
                    this.showT =  true;
                }
            },
            projectshowT(val){
                val = showT;
            },
            showT(val){
                if(val){
                    if(this.$refs.grid){
                        this.$refs.grid.refresh();
                    }

                }else{
                    this.query[0].value=null;
                    this.query[1].value=null;
                    this.query[2].value=null;
                    this.datarows = [];
                    this.formModel = {
                            pid:'',
                            oid: '',
                            xmname : '',
                            xmcode: '',
                            xmcode_sw:'',
                            xmzt: '',
                            xmkname:'',
                            dataSecretLevcode:'',
                    };

                }

            },
        }
        ,
        mounted() {

        }
        ,
    }

</script>


<style scoped>

</style>

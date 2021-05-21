<template>
    <ice-dialog :title="title" :width="width" :visible.sync="visibleDialog">
        <ice-query-grid data-url="/biz/BizArReportForm/list"
                        :pagination="true"
                        :query="query"
                        :columns="columnsDef"
                        :chooseItem="chooseItem"
                        @selection-change="selectionChange"
                        ref="grid">
        </ice-query-grid>
        <div class="ice-button-bar">
            <el-button type="primary" @click="save" :disabled="tableData.length===0">{{btnSaveName}}</el-button>
            <el-button type="info" @click="closeDialog">{{btnCloseName}}</el-button>
        </div>
    </ice-dialog>
    
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    export default {
        name: "reportSelector",
        components: {IceQueryGrid, IceDialog},
        props:{
            //组件列的表头展示列
            columns:Array,

            //弹窗标题
            title:{
                type:String,
                default:'请选择'
            },

            //弹窗宽度
            width:{
                type:String||Number,
                default: '1000px'
            },

            //是否多选,single为单选，multiple为多选
            chooseItem:{
                type:String,
                default:'multiple'
            },
            btnSaveName:{
                type:String,
                default:'确定'
            },
            btnCloseName:{
                type:String,
                default:'取消'
            },

            //参数，为空则查询全部
            reportType:{
                type:String,
                default:''
            }
        },
        data(){
            return{
                query:[],
                columnsDef:[],
                tableData:[],
                visibleDialog:false,
            }
        },
        methods:{
            /**
             * 选择table行所带出的数据
             * @param rows
             */
            selectionChange(rows){
                this.tableData = rows;
            },
            /**
             * 关闭弹窗--取消
             */
            closeDialog(){
                this.visibleDialog = false;
                this.tableData = [];
            },
            /**
             * 确定
             */
            save(){
                this.$emit("getData",this.tableData);
                this.closeDialog();
            },
            /**
             * 打开弹窗
             */
            openDialog(){
                this.visibleDialog = true;
            },
            /**组件初始化*/
            initTempLate(){
                this.query=[
                    {type: 'input', label: '报告编号', code: 'reportNo', value: ''},
                    {type: 'input', label: '报告周期', code: 'reportPeriod', value: ''},
                    {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                    {type: 'input', label: '密级', code: 'reportSecretLevel', value: ''},
                    {type: 'select', label: '网络类型', code: 'reportScope', mapTypeCode: 'PRO_NETWORK'},
                    {type:'static',code:'reportType',exp:'=',value:()=>{
                        return this.reportType;
                        }}
                ];
                if(!!this.columns){
                    this.columnsDef = this.columns;
                }else{
                    this.columnsDef = [
                        {code: "oid", hidden: true},
                        {label: '报告编号', code: 'reportNo', sortable: true, width: 140},
                        {label: '报告周期', code: 'reportPeriod', sortable: true, width: 100},
                        {label: '报告名称', code: 'reportName', sortable: true, width: 200},
                        {label: '密级', code: 'reportSecretLevel', sortable: true, width: 120,mapTypeCode:'DATA_SECRET_LEVEL'},
                        {label: '网络类型', code: 'reportScope', sortable: true, width: 120},
                        {label: '上报人', code: 'afUserName', sortable: true, width: 100},
                        {
                            label: '状态', code: 'afStatus', sortable: true, width: 100, renderCell(h, data) {
                                return (data.row.afStatus==-1?"草稿":(data.row.afStatus==1?"运行中":(data.row.afStatus==2?"已完成":(data.row.afStatus==3?"驳回":""))))}},
                        {label: '发起时间', code: 'afDate', sortable: true, width: 150}
                    ];
                }
            },
        },
        mounted() {
            this.initTempLate();
        }
    }
</script>

<style scoped>

</style>
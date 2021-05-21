<template>
    <ice-dialog :title="title" :width="width" :visible.sync="visibleDialog" remounted>
        <ice-query-grid data-url="/pro//ProBaseArea/list"
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
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    export default {
        name: "baseArea",
        components: {IceQueryGrid, IceDialog},
        mixins:[devComm],
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
                default: '800px'
            },

            //是否多选，默认单选，single为单选，multiple为多选
            chooseItem:{
                type:String,
                default:'single'
            },
            btnSaveName:{
                type:String,
                default:'确定'
            },
            btnCloseName:{
                type:String,
                default:'取消'
            }
        },
        data(){
            return{
                query:[],
                columnsDef:[],
                visibleDialog:false,
                tableData:[],
            }
        },
        methods:{
            /**组件初始化*/
            initTempLate(){
                this.query=[
                    {label: '区域简称', code: 'shortname', type: 'input'},
                    {label: '单位名称', code: 'unitName', type: 'input'},
                    {label: '网络类型', code: 'network', type: 'select', mapTypeCode: "PRO_NETWORK"},
                ];
                if(!!this.columns){
                    this.columnsDef = this.columns;
                }else{
                    let _this = this;
                    this.columnsDef = [
                        {code: 'oid', hidden: true},
                        {label: '区域单位', code: 'unit', hidden: true},
                        {label: '区域代码', code: 'code', hidden: true},
                        {label: '区域简称', code: 'shortname', width:200},
                        {label: '单位名称', code: 'unitName', width:200},
                        {label: '网络类型', code: 'network',width:200,formatter:row=>{
                            return _this.getNetworkName(row.network);
                            }},
                    ];
                }
            },
            /**打开弹窗*/
            openDialog(){
                this.visibleDialog = true;
            },
            /**确定*/
            save(){
                this.$emit("getData",this.tableData);
                this.closeDialog();
            },
            /**取消*/
            closeDialog(){
                this.visibleDialog = false
                this.tableData = [];
            },
            /**点击行获取的数据*/
            selectionChange(rows){
                this.tableData = rows;
            },
            getNetworkName(code){
                for(let i=0;i<this.ENUMS.PRO_NETWORK_DATA.length;i++){
                    if(this.ENUMS.PRO_NETWORK_DATA[i].code==code){
                        return this.ENUMS.PRO_NETWORK_DATA[i].name;
                    }
                }
                return '';
            },
        },
        mounted() {
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.PRO_NETWORK.CODE);
            this.initTempLate();
        }
    }
</script>

<style scoped>

</style>
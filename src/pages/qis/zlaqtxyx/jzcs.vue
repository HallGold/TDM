<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/QisJzcscl/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid">
        </ice-query-grid>
        <cs-detail ref="detail" :to-flow="view"></cs-detail>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import moment from 'moment';
    import { SBZT, SPZT} from "../../../utils/constant";
    import csDetail from './csDetail'
    export default {
        name: "jzcs",
        data() {
            return {
                query: [
                    {type: 'input', code: 'jzcscode', label: '编号', value: ''},
                    {type: 'input', code:'xh', label:'型号', value: ''},
                    {type: 'date', code: 'createDate', label: '发生时间', exp: '='},
                    {type:'input',code:'zrdw',label:'责任单位'},
                    {type:'date',code:'clqx',label:'处理期限'},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},

                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '编号', code: 'jzcscode', width: 180, sortable: true},
                    {label:'型号',code:'xh',width:180,sortable:true},
                    {label: '发生时间', code: 'createDate', width: 140, sortable: true},
                    {label:'责任单位',code:'zrdw',width:160,sortable:true, hidden: true},
                    {label:'责任单位',code:'zrdwCode',width:160,sortable:true, cusMapTypeCode: 'DEPT'},
                    {
                        label: '处理期限', code: 'clqx', width: 140, sortable: true, formatter(row) {
                            return moment(row.clqx).format('YYYY-MM-DD')
                        }
                    },
                    {label:'审批状态',code:'spzt',width:120,sortable:true,mapTypeCode: 'SPZT'},
                    {label:'上报状态',code:'sbzt',width:120,sortable:true,mapTypeCode: 'SBZT'},
                    {label:'密级',code:'dataSecretLevcode',width:60,sortable:true,mapTypeCode: 'DATA_SECRET_LEVEL'}
                ],
                buttons: [
                    {name:'刷新',icon:"el-icon-refresh",type:'primary',ctrlCode:"BSX",callback:this.buttonRefresh},
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow: function (row) {
                            if(row.spzt === SPZT.WSP){
                                return true
                            }else{
                                return false
                            }
                        }
                    },
                    {name: '查看', callback: this.showDetail, ctrlCode: "BCK",

                    },
                    {name: '删除', callback: this.buttonDelete, ctrlCode: "BSC", isShow: function (row) {
                            if(row.spzt === SPZT.WSP || row.spzt === SPZT.ZZSP){
                                return true
                            }else{
                                return false
                            }
                        }
                    }
                ]
            }
        },
        methods: {
            // 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            addItem() {
                this.$router.push("/qis/zlaqtxyx/jzcsFlow")
            },
            edit(data){
                this.$router.push("/qis/zlaqtxyx/jzcsFlow?dataId="+data.oid)
            },
            buttonRefresh(){
                this.$refs.grid.refresh();
            },
            buttonDelete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisJzcscl/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除成功")
                        })
                }).catch(_ => {

                })
            },
            view (row) {
                this.$router.push("/qis/zlaqtxyx/jzcsFlow?dataId="+row.oid)
            }
        },
        watch:{
            $route(oldData,newData){
                if(oldData.path === "/qis/zlaqtxyx/jzcs" && newData.path === "/qis/zlaqtxyx/jzcsFlow"){
                    this.$refs.grid.refresh();
                }
            }
        },
        components: {
            IceQueryGrid,moment,
            csDetail
        }
    }
</script>

<style scoped>

</style>
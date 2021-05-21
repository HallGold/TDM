<template>
    <div class="ice-container">
        <el-container>
                <ice-query-grid data-url="/pms/PmsGtWtinfo/list"
                                exportTitle="问题导出"
                                :query="query"
                                :operations-width="160"
                                :columns="columns"
                                :buttons="buttons"
                                :operations="operations"
                                ref="grid">
                </ice-query-grid>
        </el-container>
        <wt-detail ref="wtdetail" :to-flow="watch"></wt-detail>
    </div>
</template>

<script>

    import IceSelect from "@/components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import RwSelect from "../common/RW_SELECT";
    import CP_SELECT from "../common/CP_SELECT";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import moment from 'moment'
    import { SBZT, SPZT} from "../../../utils/constant";
    import wtDetail from './wtDetail'


    export default {
        name: "wtsbgl",
        data() {
            return {
                formReadonly: false,
                activeName: 'first',
                title: '',
                visible: false,
                loading: false,
                visibleProject: false,
                visibleProduct: false,
                visibleMission: false,
                query: [
                    {type: 'input', code: 'wtLsm', label: '问题编号', value: ''},
                    {type: 'input', code: 'xmname', label: '项目', value: ''},
                    {type: 'input', code: 'rwname', label: '任务', value: ''},
                    {type: 'select', code: 'wtlx', label: '问题类型', value: '', mapTypeCode: 'WTLX'},
                    {type: 'input', code: 'wtjsDept', label: '问题接收部门', value: ''},
                    {type: 'input', code: 'wtjsr', label: '问题接收人', value: ''},
                    {type: 'date', code: 'wtjsDate', label: '期望反馈日期', value: ''},
                    {type: 'input', code: 'wtSbr', label: '上报人', value: ''},
                    {type: 'date', code: 'wtSbDate', label: '上报日期', value: ''},
                    {type: 'date', code: 'createDate', label: '创建日期从', exp: '>='},
                    {type: 'date', code: 'createDate', label: '创建日期至', exp: '<='},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'wtms', hidden: true},
                    {code: 'isOpen', hidden: true},
                    {code: 'dateRemark', hidden: true},
                    {label: '问题编号', code: 'wtLsm', width: 200, sortable: true},
                    {label: '项目', code: 'xmname', width: 140},
                    {label: '任务', code: 'rwname', width: 140},
                    {label: '问题类型', code: 'wtlx', width: 100, sortable: true, mapTypeCode: 'WTLX'},
                    {label: '问题接收部门', code: 'wtjsDept', width: 140, sortable: true},
                    // {label: "问题接收部门", code: "xmzgbmCode", width: 130, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '问题接收人', code: 'wtjsr', width: 100},
                    {label: '期望反馈日期', code: 'wtjsDate', width: 140, sortable: true, formatter(row) {
                            return moment(row.wtjsDate).format('YYYY-MM-DD');
                        }},
                    {label: '上报人', code: 'wtSbr', width: 140},
                    {label: '上报日期', code: 'wtSbDate', width: 140, sortable: true},
                    {label: '上报状态', code: 'sbzt', width: 80, sortable: true,mapTypeCode:'SBZT'},
                    {label: '审批状态', code: 'spzt', width: 80, sortable: true,mapTypeCode:'SPZT'},
                    {label:'密级',code:'dataSecretLevcode',width:80,sortable:true,mapTypeCode:'DATA_SECRET_LEVEL'}
                ],
                buttons: [
                    {name: '刷新',icon:"el-icon-refresh",type: 'primary',ctrlCode:"BSX",callback: this.Refresh},
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    // {name: '导出', type: 'export', ctrlCode:'BDC'},
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
                    {name: '查看', callback: this.showDetail, ctrlCode: "BCK"
                    },
                    {name: '删除', callback: this.buttonDelete, ctrlCode: "BSC", isShow: function (row) {
                            if(row.spzt ===SPZT.WSP || row.spzt === SPZT.ZZSP){
                                return true
                            }else{
                                return false
                            }
                        }
                    }
                ],
            }
        },
        methods: {
            Refresh() {
                this.$refs.grid.refresh();
            },
            // 查看
            showDetail (row) {
                this.$refs.wtdetail.getDetail(row.oid)
            },
            watch(row){
                this.$router.push("/pms/gtgl/wtsbglFlow?dataId="+row.oid+"&oid="+row.oid)
            },
            addItem() {
                this.$router.push("/pms/gtgl/wtsbglFlow")
            },
            edit(row) {
                this.$router.push("/pms/gtgl/wtsbglFlow?dataId="+row.oid+"&oid="+row.oid)
            },
            buttonDelete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsGtWtinfo/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                            this.$refs.grid.refresh();
                        })
                })
            }
        },
        watch:{
            $route(old,newVal){
                if(old.path === "/pms/gtgl/wtsbgl" && newVal.path === "/pms/gtgl/wtsbglFlow"){
                    this.$refs.grid.refresh();
                }
            }
        },
        components: {
            IceQueryGrid,
            IceDeptSelector,
            IceSelect,
            CP_SELECT,
            IceDialog,
            RwSelect,
            wtDetail
        }
    }

</script>


<style scoped>

</style>

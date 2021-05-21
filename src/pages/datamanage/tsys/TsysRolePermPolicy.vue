<template>
    <div class="grid-container" v-show="show">
        <el-dialog v-dialogDrag title="查看隔离策略" custom-class="ice-dialog" center :visible.sync="show"
                   width="960px" append-to-body :close-on-click-modal="false">

            <el-table
                    :data="gridDataList"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" v-for="condexpr in props.row.condexprs">
                            <el-form-item label="表达式">
                                <span>{{ condexpr.fieldCode }} {{condexpr.operator}} {{condexpr.param}}  {{condexpr.datapolicyOperator == "1"?"OR":(condexpr.datapolicyOperator == "2"?"AND":"")}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        label="策略名称"
                        prop="datapolicyName">
                </el-table-column>
                <el-table-column
                        label="合并方式">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ "("+scope.row.datapolicyOperator+")"+(scope.row.datapolicyOperator==1?"OR":"AND") }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="优先级">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ "("+scope.row.datapolicyPirority+")"+(scope.row.datapolicyPirority==10?"一般":(scope.row.datapolicyPirority==20?"强制":"系统强制")) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="来自角色"
                        prop="dataroleName">
                </el-table-column>
            </el-table>

        </el-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    let gridData = [];

    export default {
        name: "TsysRolePermPolicy",
        data(){
            return{
                show:false,
                dataUrl:"/datamanage/TsysRolePerm/policyList",
                params:{},
                gridDataList:[],
                gridAutoRefresh:false
            }
        },
        methods:{
            open(userCode,tableCode){
                this.params = {"userCode":userCode,"tableCode":tableCode};
                this.show = true;
                this.refresh();
            },
            refresh(){
                this.$axios.get(this.dataUrl, {params: this.params})
                    .then(result => {
                        this.loading = false;
                        if (this.pagination) {
                            this.gridDataList = result.data.records;
                            this.total = result.data.total;
                        } else {
                            if (result.data.records) {
                                this.gridDataList = result.data.records;
                                this.total = result.data.total;
                            } else {
                                this.gridDataList = result.data;
                            }
                        }
                    })
                    .catch(error => {
                        this.loading = false;
                        this.$message.error("出错啦")
                    })
            }
        },
        mounted() {
            if (this.gridAutoRefresh) {
                this.refresh();
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
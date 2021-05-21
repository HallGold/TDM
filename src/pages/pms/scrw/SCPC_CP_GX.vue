<!--生产批次产品-工序-->
<template>
    <div>
        <div>
            <el-row>
                <el-col :span="12">
                    产品工序列表
                </el-col>
            </el-row>
        </div>
        <vxe-table border resizable show-overflow
                   highlight-hover-row
                   highlight-current-row
                   ref="xTable"
                   height="300"
                   size="mini"
                   :data="tableData">
            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="gxCode" title="工序编码" width="140"></vxe-table-column>
            <vxe-table-column field="gxName" title="工序名称" width="140"></vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>

    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import CP_SELECT from "../common/CP_SELECT";
    import IceDialog from "../../../components/common/base/IceDialog";
    export default {
        components: {IceDialog, CP_SELECT, IceSingleUpload},
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            loadTableData () {
                if(this.oidCpk){
                    this.$axios.get("/pms/CpkGx/listByOidCpk", {params: {oidCpk: this.oidCpk}})
                        .then(result => {
                            this.tableData = result.data;
                        })
                        .catch(error => {
                            this.$message.error("查询产品工序失败")
                        })
                        .finally(_ => {

                        })
                }else{
                    this.tableData = [];
                }
            },
        }
        ,
        computed: {}
        ,
        watch: {
            oidCpk () {
                this.loadTableData();
            }
        }
        ,
        mounted() {

        }
        ,
        props: [
            'oidCpk'
        ]
    }

</script>

<style scoped>

</style>
<template>
        <!--服务受理==》办理==》技术服务目录-->
        <el-form>
            <el-col :span="3">
                <el-form-item label-width="105px" label="技术服务目录："></el-form-item>
            </el-col>
            <el-col :span="21">
                <ice-query-grid
                        data-url=""
                        :columns=columns
                        :buttons=buttons
                        :query=query
                        ref="queryGrid"
                >
                </ice-query-grid>
            </el-col>
        </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "serviceList",
        components: {
            IceQueryGrid,
            IceGridLayout, IceEditableTable
        },
        data() {
            return {
                Form: {
                    remark: '', nature: '', category: '',
                    force: '', urgency: '', prior: '',
                    area: '', serverName: '', serverNape: '',
                    serverRank: '', time: ''
                },
                columns: [
                    {label: '业务服务目录ID', code: 'techId',},
                    {label: '是否默认', code: 'isDefault',},
                    {label: '区域', code: 'shortname',},
                    {label: '服务大类', code: 'parentName',},
                    {label: '服务分类', code: 'techCategoryName',},
                    {label: '服务项', code: 'techSname',},
                    {label: '技术手册', code: 'manual',},
                ],
                query: [],
                buttons: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: 'primary', callback: this.add
                    },
                    {
                        name: '删除', icon: 'el-icon-plus', type: 'primary', callback: this.del
                    },
                ]
            }
        },
    }
</script>

<style scoped>

</style>
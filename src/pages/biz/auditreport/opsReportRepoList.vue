<template>
    <div class="ice-container">
        <ice-tree-grid load-url="/biz/BizArReport/typeTree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="code"
                       :lazy="false"
                       data-url="/biz/BizArReport/list"
                       :pagination="true"
                       :columns="columns"
                       :query="query"
                       :operations="operations"
                       @node-click="dataTree">
        </ice-tree-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "opsReportRepoList",
        components: {IceTreeGrid, IceQueryGrid,fileUtil},
        data() {
            return {
                query: [
                    {type: 'input', label: '报告编号', code: 'reportNo', value: ''},
                    {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                    {type: 'input', label: '报告附件名称', code: 'reportFileName'},
                    // {type: 'input', label: '报告区域', code: 'areaName',value:''},
                    {type: 'date', label: '上报时间开始', code: 'reportTime',exp:'>=', value: ''},
                    {type: 'date', label: '上报时间结束', code: 'reportTime',exp:'<=', value: ''},
                    /*{type: 'static', label: '状态', code: 'afStatus', exp: '=', value: 2},*/
                    {type: 'static', code: 'reportType', exp: '=', value: ()=>{
                            return this.treeCode
                        }
                    },
                    {type: 'static', code: 'afStatus', exp: '=', value: '2'}
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {code: "reportFormId", hidden: true},
                    {code: "reportFileId", hidden: true},
                    {
                        label: '报告编号', code: 'reportNo', sortable: true, width: 150, renderCell(h, data) {
                            return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                'on': {
                                    'click': () => {
                                        this.$router.push("/biz/auditreport/seasonReport?dataId=" + data.row.reportFormId)
                                    }
                                }
                            }
                            }
                            >{data.row.reportNo}</a>;
                        }
                    },
                    // {label: '报告区域', code: 'areaName', sortable: true, width: 100},
                    {label: '报告周期', code: 'reportPeriod', sortable: true, width: 150},
                    {label: '报告名称', code: 'reportName', sortable: true, width: 200},
                    {label: '报告附件名称', code: 'reportFileName', sortable: true, width: 200},
                    {
                        label: '报告大小', code: 'reportFileSize', sortable: true, width: 100, renderCell(h, data) {
                            return fileUtil.fileSizeFormat(data.row.reportFileSize)
                        }
                    },
                    {label: '上传人', code: 'createUserName', sortable: true, width: 100},
                    {label: '上传时间', code: 'createDate', sortable: true, width: 100}
                ],
                operations: [
                    {name: '下载附件', callback: this.download}
                ],
                treeCode:'',                    //根据树形节点值--加载不同类型的数据列表
            }
        },
        methods: {
            /**点击树形节点，获取树形节点的数据*/
            dataTree(val) {
                if (val === '所有') {
                    this.treeCode = '';
                } else {
                    this.treeCode = val;
                }
            },
            /**下载附件*/
            download(row) {
                row.reportFileId.split(",").forEach(e=>{
                    this.$downloadFile(e);
                })
            },
            /*关联整改*/
            corr(row){
                this.$router.push("/biz/auditreport/corrReportRepoList?reportNo=" + row.reportNo);
            }
        },
    }
</script>

<style scoped>

</style>
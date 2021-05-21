<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-tree-grid load-url="/resources/ResAuditLogType/tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="oid"
                       :lazy="false"
                       data-url="/resources/ResAuditLog/list"
                       :query="query"
                       :buttons="buttons"
                       :columns="columns"
                       exportTitle="审计日志"
                       :operations="operations"
                       treeWidth="300px"
                       :grid-auto-refresh="false"
                       @node-click="dataTree"
                       :operations-width="140">
        </ice-tree-grid>
        <ice-dialog title="审计日志详情查看" width="800px" :visible.sync="visible" height="600px">

            <el-row :gutter="20">
                <el-col :span="24">
                    <ice-label name="功能描述">
                        <div class="log-full">
                            {{detailData.funDesc}}
                        </div>
                    </ice-label>
                </el-col>
                <el-col :span="24">
                    <ice-label name="请求路径">
                        <div class="log-full">
                            {{detailData.requestUri}}
                        </div>
                    </ice-label>
                </el-col>
                <el-col :span="12">
                    <ice-label name="客户端IP">
                        <div class="log-full">
                            {{detailData.clientIp}}
                        </div>
                    </ice-label>
                </el-col>
                <el-col :span="12">
                    <ice-label name="操作用户">
                        <div class="log-full">
                            {{`${detailData.userName}(${detailData.userCode})`}}
                        </div>
                    </ice-label>
                </el-col>
                <el-col :span="12">
                    <ice-label name="操作时间">
                        <div class="log-full">
                            {{detailData.createDate}}
                        </div>
                    </ice-label>
                </el-col>
                <el-col :span="12">
                    <ice-label name="调用结果">
                        <div class="log-full">
                            <span v-if="detailData.invokeStatus == '成功'" class="el-tag el-tag--success">{{detailData.invokeStatus}}</span>
                            <span v-else class="el-tag el-tag--danger">{{detailData.invokeStatus}}</span>
                        </div>
                    </ice-label>
                </el-col>
            </el-row>

            <el-divider>详情信息</el-divider>

            <div v-if="detailData.resolvedResult&&detailData.showType==1" v-html="detailData.resolvedResult">

            </div>
            <div v-else>
               <!-- <el-row>
                    <el-col :span="12" v-for="item in logInfo" :key="item.key">
                        <ice-label :name="item.key">
                            <div style="width: 200px;display: flex;height: 100%;justify-items: center"> {{item.value}}</div>
                        </ice-label>
                    </el-col>
                </el-row>-->
                {{detailData.resolvedResult}}
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceDialog from "../../components/common/base/IceDialog";
    import IceLabel from "../../components/common/base/IceLabel";
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";

    export default {
        name: "ResAuditLogList",
        components: {IceTreeGrid, IceLabel, IceDialog, IceQueryGrid},
        data() {
            return {
                curTreeNode: {data: {}, node: {level: -1}},
                visible: false,
                query: [
                    {
                        type: 'static',
                        code: 'rankCode',
                        value: () => this.curTreeNode.node.data.rankCode,
                        exp: 'likeRight'
                    },
                    {type: 'input', label: '功能描述', code: 'funDesc', value: ''},
                    {type: 'input', label: '操作用户编码', code: 'userCode', value: ''},
                    {type: 'input', label: '请求路径', code: 'requestUri', value: ''},
                    {type: 'input', label: '操作用户名', code: 'userName', value: ''}],
                columns: [{code: 'oid', hidden: true},
                    {code: 'userName', hidden: true},
                    {label: '功能描述', code: 'funDesc', width: 300, align: 'left'},
                    {label: '请求路径', code: 'requestUri', width: 150, align: 'left'},
                    {
                        label: '操作用户', code: 'userCode', width: 200, align: 'left', formatter: row => {
                            return `${row.userName}(${row.userCode})`
                        }
                    },
                    {label: '用户IP', code: 'clientIp', width: 140},
                    {label: '操作时间', code: 'createDate', width: 140, sortable: true},
                    {
                        label: '调用结果', code: 'invokeStatus', width: 120, sortable: true, renderCell: (h, data) => {
                            if (data.row.invokeStatus == '成功') {
                                return (<span>{data.row.invokeStatus}</span>)
                            } else {
                                return <span style="color: red">{data.row.invokeStatus}</span>
                            }
                        }
                    }],
                operations: [{name: '详情', callback: this.detailPage}],
                buttons: [ {name: '导出', ctrlCode: "BDC", icon: 'el-icon-download', size: 'mini', type: 'export'},],
                detailData: {
                    resolvedResult: "{}"
                },
                logInfo: []
            }
        },
        methods: {
            dataTree(row, node) {
                //debugger
                this.curTreeNode = {data: row, node};
                //this.$refs.iceGrid.refreshAndPageReset();
            },
            detailPage(row) {
                this.visible = true;
                this.$axios.get("/resources/ResAuditLog/get", {params: {id: row.oid}}).then(result => {
                    this.detailData = result.data;
                    if (this.detailData.showType != 1) {
                        let array = [];
                        let result = JSON.parse(this.detailData.resolvedResult)
                        for (let key in result) {
                            array.push({key, value: result[key]})
                        }

                        this.logInfo = array;
                    }
                }).catch(error => {
                    console.error(error);
                    this.$message.error("日志详情加载失败")
                });
            }
        },

    }
</script>

<style scoped>

    .log-full {
        height: 100%;
        line-height: 24px;
    }

    .error-info {
        color: #ff5456
    }

</style>

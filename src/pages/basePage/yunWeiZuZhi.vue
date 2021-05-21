<template>
    <div class="content-filled">
        <el-tabs v-model="activeName">
            <el-tab-pane label="运维组织" name="name1">
                <ice-query-grid
                        :pagination="true"
                        ref="iceGrid"
                        data-url="/biz/BizSoftwareDownloadHistory/list"
                        :query="query"
                        :columns="columns">
                </ice-query-grid>
            </el-tab-pane>
            <el-tab-pane label="转岗记录" name="name2">
                <ice-query-grid
                        :pagination="true"
                        ref="iceGrid"
                        data-url="/biz/BizSoftwareDownloadHistory/list"
                        :query="queryK"
                        :columns="columnsK">
                </ice-query-grid>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "yunWeiZuZhi",
        data(){
            return{
                query:[
                    {label: '运维组织名称', code: 'softName'},
                    {label: '是否有合作商', code: 'softVersion'},
                    {label: '状态', code: 'createDate'},
                    {label: '排序', code: 'createDate'},
                    {label: '创建时间', code: 'createDate'},
                    {label: '创建人', code: 'createDate'},
                    {label: '修改时间', code: 'createDate'},
                    {label: '修改人', code: 'createDate'},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '运维组织名称', code: 'softName', width: 100},
                    {label: '是否有合作商', code: 'softVersion', width: 100},
                    {label: '状态', code: 'createDate', width: 100},
                    {label: '排序', code: 'createDate', width: 100},
                    {label: '创建时间', code: 'createDate', width: 100},
                    {label: '创建人', code: 'createDate', width: 100},
                    {label: '修改时间', code: 'createDate', width: 100},
                    {label: '修改人', code: 'createDate'},
                ],
                queryK:[
                    {label: '运维组织', code: 'softName'},
                    {label: '用户名称', code: 'softVersion'},
                    {label: '担岗时间', code: 'createDate'},
                    {label: '离岗时间', code: 'createDate'},
                    {label: '创建人', code: 'createDate'},
                    {label: '创建时间', code: 'createDate'},
                ],
                columnsK:[
                    {code: "oid", hidden: true},
                    {label: '运维组织', code: 'softName', width: 100},
                    {label: '用户名称', code: 'softVersion', width: 100},
                    {label: '担岗时间', code: 'createDate', width: 100},
                    {label: '离岗时间', code: 'createDate', width: 100},
                    {label: '创建人', code: 'createDate', width: 100},
                    {label: '创建时间', code: 'createDate', width: 100},
                ],
            }
        }
    }
</script>

<style scoped>

</style>
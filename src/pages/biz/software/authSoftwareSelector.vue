<template>
    <ice-pop-selector
            load-url="/biz/BizSoftwareClassify/tree?topId=MAINTAIN"
            label-prop="label"
            value-prop="oid"
            :lazy="false"
            data-url="/biz/BizSoftwareInfo/admin/list"
            textProp="softName"
            codeProp="softVersion"
            ref="select"
            mode="hidden"
            :height="500"
            @node-click="dataTree"
            @select-confirm="selectConfirm"
            :selections="selections"
            :query="query"
            :columns="columns"
            dialog-width="1000px">
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    export default {
        name: "authSoftwareSelector",
        components: {IcePopSelector},
        props:{
            selectedSoftware:{
                type: Array,
                default: () => []
            }
        },
        data(){
            return{
                selections: [],
                checkedClassifyIdPath:'MAINTAIN',
                query: [
                    {type: 'input', label: '软件名称', exp: 'like', code: 'searchKey'},
                    {
                        type: 'static', exp: 'like', value: () => {
                            return this.checkedClassifyIdPath
                        }, code: 'classifyIdPath'
                    }
                ],
                columns: [
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '软件ID', code: 'softwareId', hidden: true},
                    {label: '软件级别', code: 'softRegion', hidden: true},
                    {label: '软件图标ID', code: 'softIconId', hidden: true},
                    {label: '发布时间', code: 'publishDate', hidden: true},
                    {label: '发布者', code: 'publishAuthor', hidden: true},
                    {
                        label: '名称', code: 'softName', width: 200, renderCell(h, data) {
                            if (data.row.softRegion == 0) {
                                return <div class="cell" style="line-height:27px;" title={data.row.softName}>
                                    <el-tag size="mini" type="danger">院</el-tag>
                                    <div
                                        style="max-width:190px;word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{data.row.softName}</div>
                                </div>;
                            }
                            return <div class="cell" title={data.row.softName}>{data.row.softName}</div>;
                        }
                    },
                    {
                        label: '所属分类', code: 'classifyNamePath', sortable: true, width: 150,
                    },
                    {label: '版本', code: 'softVersion', width: 100},
                ],
            }
        },
        methods:{
            /**
             * 点击树节点返回的信息
             * @param data
             * @param node
             */
            dataTree(data,node){
                if(data=='0'){
                    this.checkedClassifyIdPath = 'MAINTAIN';
                }else{
                    this.checkedClassifyIdPath = node.data.classifyIdPath;
                }
            },
            /**
             * 保存
             * @param rows
             */
            selectConfirm(rows) {
                this.$emit("getData", rows);
            },
            /**
             * 关闭窗口
             */
            selectCannel() {
                this.$emit("selectCannel");
            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.$refs.select.openDialog();
            },
            loadSectionsList() {
                this.selections = this.selectedSoftware;
                this.$nextTick(() => {
                    this.$refs.select.reDoSelection();
                })
            }
        },
        watch: {
            selectedSoftware() {
                this.loadSectionsList()
            }
        },
        created() {
            this.loadSectionsList()
        },
    }
</script>

<style scoped>

</style>
<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="公告管理"
                        data-url="/resources/ResAnnouncement/list"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :operationsWidth=230
                        :buttons="buttons">
        </ice-query-grid>

        <res-announcement-view title="公告预览" ref="viewann"></res-announcement-view>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ResAnnouncementView from "./ResAnnouncementView.vue";
    export default {
        name: "AnnountcementList",
        data() {
            return {
                query: [
                    {type: 'input', label: '标题', code: 'title', value: ''},
                    {type: 'input', label: '类型', code: 'type', value: ''},
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {code:'scope',hidden:true},
                    {code:'stickyTime',hidden:true},
                    {label: '标题', code: 'title', width: 190},
                    {label: '内容', code: 'content', width: 280},
                    {label: '类型', code: 'annTypeCode', width: 120},
                    {label: '状态', code: 'postStatus', width: 120,renderCell(h, data){ return (data.row.postStatus==0?"未发布":(data.row.postStatus==1?"已发布":""))}},
                    {label: '创建人', code: 'createUser', width: 120},
                    {label: '创建时间', code: 'createDate', width: 120},
                ],
                operations: [
                    {name: '预览', callback: this.viewItem},
                    {name: '修改', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                    {
                        name: '发布', callback: this.updatePostStatusBtn, isShow: function (row) {
                            if (row.postStatus == 0) {
                                return true;
                            }
                            return false;
                        }
                    },{
                        name: '撤回', callback: this.updatePostStatusBtn, isShow: function (row) {
                            if (row.postStatus == 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '设置置顶', callback: this.updateStickyBtn, isShow: function (row) {
                            if (row.stickyTime == null) {
                                return true;
                            }
                            return false;
                        }
                    },{
                        name: '取消置顶', callback: this.updateStickyBtn, isShow: function (row) {
                            if (row.stickyTime != null) {
                                return true;
                            }
                            return false;
                        }
                    },
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}]
            }
        },
        methods: {
            addItem() {
                this.$router.push("/common/resAnnouncementStore")
            },
            updateItem(row) {
                this.$router.push("/common/resAnnouncementStore?id="+row.oid)
            },
            updatePostStatusBtn(row){
                let data = Object.assign({},row);
                data.postStatus = data.postStatus == 0 ? 1 : 0;
                this.$axios.post("/resources/ResAnnouncement/saveOrUpdate", data)
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                    })
            },
            updateStickyBtn(row){
                let data = {
                    annId:row.oid
                }
                data.status = row.stickyTime == null ? 1 : 0;
                this.$axios.post("/resources/ResAnnouncement/sticky", data)
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                    })
            },
            deleteItem(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.post("/resources/ResAnnouncement/delete", row)
                        .then(result => {
                            this.$message.success("删除成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.closeDialog();
                        })
                });
            },
            viewItem(row){
                this.$refs.viewann.open(row);
            }
        },
        components: {IceQueryGrid,ResAnnouncementView}
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;
    }
        .button-area {
            display: flex;
            justify-content: flex-end;
        }

</style>

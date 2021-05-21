<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/permission/res/app/outer/get/can_authed_applist"
                :pagination="false"
                :query="query"
                queryType="local"
                :buttons="buttons"
                :columns="columns"
                :operations="operations"></ice-query-grid>
        <ice-dialog v-dialogDrag title="选择需要授权的单位" center :visible.sync="dialogVisible"
                    width="450px" append-to-body :close-on-click-modal="false" height="440px">
            <ice-query-grid
                    minHeight="440px"
                    ref="appOrgGrid"
                    chooseItem="multiple"
                    :gridData="dataApp"
                    :columns="appOrgColumns"
                    :hidden-qucik-query="true"
                    :pagination="false"
                    codeProp="oid">
            </ice-query-grid>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="saveApp">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialogApp">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "AppAccredit",
        components: {IceQueryGrid},
        data() {
            return {
                dialogVisible: false,
                query: [
                    {type: 'input', label: 'APP名称', code: 'name'}
                ],
                columns: [
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {
                        label: '图标', code: 'smallIconUrl', width: 60, renderCell(h, data) {
                            return <img src={this.$showImage(data.row.smallIconUrl)} width="22px" height="22px"/>
                        }
                    },
                    {label: '名称', code: 'name', width: 240, align: 'left'},
                    {label: '编码', code: 'appCode', hidden: true},
                    {
                        label: '启用状态', code: 'enabled', width: 110, renderCell(h, data) {
                            return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
                        }
                    },
                    {label: 'URL', code: 'url', hidden: true},
                    {label: '描述', code: 'desp', align: 'left'},
                ],
                buttons: [
                    {name: '刷新', icon: 'el-icon-refresh', callback: this.refresh, code: "BSX"}
                ],
                operations: [
                    {name: '授权', callback: this.accredit, code: "BSQ"}
                ],
                defaultProps: {
                    label: 'deptName',
                    children: 'children'
                },
                appOrgColumns: [
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '单位名称', code: 'deptName'}
                ],
                dataApp: [],
                appOrgVoList: [],
                selectedCodes: [],
                appCode: '',
                appId: ''
            }
        },
        methods: {
            accredit(row) {
                try {
                    this.appId = row.oid;
                    this.dataApp = [];
                    this.$axios.get("/permission/res/app/app_list_app_id", {"params": {"appId": row.oid}}).then(success => {

                        let dataApp = success.data.departmentListSelectVos;
                        let selectRows = [];
                        dataApp.forEach(item => {
                            item.departmentSelectVo.selected = item.selected;
                            if (item.selected === true) {
                                selectRows.push(item.departmentSelectVo);
                            }
                            this.dataApp.push(item.departmentSelectVo);
                        });
                        this.$nextTick(() => {
                            selectRows.forEach(row => {
                                this.$refs.appOrgGrid.toggleSelection(row);
                            });
                        })
                        this.dialogVisible = true;
                        this.appOrgVoList = [];
                    }).catch(error => {
                        console.error(error)
                        this.$message.error(error.msg ? error.msg : '出错了')
                    })
                } catch (e) {
                    console.error(e)
                }
            },
            // handleNodeClick(data, checked, indeterminate) {
            //     if (checked) {
            //         this.appOrgVoList.push(data.oid);
            //     } else {
            //         let index = this.appOrgVoList.indexOf(data.oid);
            //         if (index > -1) {
            //             this.appOrgVoList.splice(index, 1);
            //         }
            //     }
            // },
            /**关闭授权APP界面*/
            closeDialogApp() {
                this.dialogVisible = false;
            },
            /**保存授权的APP*/
            saveApp() {
                let selectRows = this.$refs.appOrgGrid.getSelections();
                if (selectRows) {
                    selectRows.forEach(row => {
                        this.appOrgVoList.push(row.oid)
                    })
                }
                this.$axios.patch("/permission/res/app/save/app_auth_infos", {
                    "appId": this.appId,
                    "selectOrgIds": this.appOrgVoList
                }).then(success => {
                    this.$message.success("授权成功")
                    this.dialogVisible = false;
                    this.appOrgVoList = [];
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '授权出错了')
                })
            },
            refresh() {
                this.$nextTick(() => {
                    this.$refs.iceGrid.refreshFromRemote();
                })
            }
        },
        watch: {},
        mounted() {
        }
    }
</script>

<style>
    .ice-tree-wrapper .el-checkbox {
        margin-right: 5px;
    }
</style>

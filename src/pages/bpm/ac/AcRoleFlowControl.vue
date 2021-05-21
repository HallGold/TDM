<template>
    <div style="flex-grow: 1;width: 100%;height: 100%;display: flex">
        <ice-query-grid title="角色流程"
                        :data-url="'/bpm/AcRoleFlow/listRefAcl?roleId='+role.oid"
                        :query="query"
                        :columns="columns"
                        chooseItem="multiple"
                        :operationsWidth="150"
                        @selection-change="handleSelectionChange"
                        :operations="operations"
                        :buttons="buttons" ref="gridRoleFlow">

            <!--<div slot="grid-bar" slot-scope="scope" style="height: 100%;width: 100%">
                <ice-editable-table :data="scope.data" :rules="detailRules" ref="detailtable">
                    <el-table-column prop="actDefName" :width="140" label="流程名称"></el-table-column>
                    <el-table-column prop="actDefKey" label="流程KEY" :width="140"></el-table-column>
                    <ice-editable-table-column v-if="role.roleType=='manage'" prop="aclName"
                                               label="关联ACL"
                                               :width="350"
                                               input-type="select">
                        <template slot-scope="scope1">
                            <ice-select collapse-tags
                                    data-url="/bpm/sysAcl/sysAclList"
                                    text-prop="aclName"
                                    code-prop="aclName"
                                    value-model="string"
                                    :multiple="true"
                                    v-model="scope1.row.aclName">
                            </ice-select>
                        </template>
                    </ice-editable-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       size="small" @click="deleteAcl(scope.row)">删除
                            </el-button>
                            <el-button v-if="role.roleType=='manage'" type="text"
                                       size="small" @click="saveFlowAcl(scope.row)">保存ACL
                            </el-button>
                        </template>
                    </el-table-column>
                </ice-editable-table>

            </div>-->

        </ice-query-grid>


        <ice-pop-selector style="box-sizing: border-box"
                          label=""
                          title="请选择流程"
                          text-prop="bpmDefName"
                          code-prop="actDefKey"
                          mode="hidden"
                          :query="flowQuery"
                          :columns="flowColumns"
                          data-url="/bpm/definition/list" ref="selectFlow"
                          @select-confirm="selectConfirm">
        </ice-pop-selector>

    </div>
</template>

<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IcePopSelector from "@/components/common/base/IcePopSelector";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect.vue";

    export default {
        name: 'gridAcRoleFlow',
        props: {
            role: {
                type: Object,
                default:{}
            }
        },
        data() {
            return {
                elTable: [],
                detailRules: {},
                flowQuery: [
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: '', exp: 'like'},
                    {type: 'input', label: '流程KEY', code: 'actDefKey', value: '', exp: 'like'}
                ],
                flowColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {label: '流程名称', code: 'bpmDefName', width: 240},
                    {label: '流程KEY', code: 'actDefKey', width: 200, sortable: true},
                    {label: '流程版本', code: 'versionNo', width: 100}
                ],
                sysAclList: [],
                query: [
                    {type: 'input', label: 'KEY', code: 'actDefKey'},
                    {type: 'input', label: '名称', code: 'actDefName'}
                ],
                columns: [],
                columns2: [
                    {code: 'oid', hidden: true},
                    {label: '流程KEY', code: 'actDefKey', width: 140},
                    {label: '流程名称', code: 'actDefName', width: 240}
                ],
                columnAcl: [
                    {code: 'oid', hidden: true},
                    {label: '流程KEY', code: 'actDefKey', width: 140},
                    {label: '流程名称', code: 'actDefName', width: 240},
                    {
                        label: '关联按钮组', code: 'aclName', width: 130, renderCell: (h, data) => {

                            return (<el-select collapse-tags={true}
                                               multiple={true}
                                               value={data.row.aclName ? data.row.aclName.split(",") : []}
                                               {...{
                                                   on: {
                                                       'change': value => {
                                                           if (value) {
                                                               data.row.aclName = value.join(",");
                                                           }

                                                       }
                                                   }
                                               }
                                               }>
                                {
                                    this.sysAclList.map(item => {
                                        return <el-option
                                            label={item.aclName}
                                            value={item.aclName}>
                                        </el-option>
                                    })
                                }

                            </el-select>)
                        }
                    }
                ],
                operations: [
                    {name: '删除', callback: this.deleteAcl},
                    {
                        name: '保存按钮组', callback: (row) => {
                            this.saveFlowAcl(row);
                            /*this.mainDataForm = row;
                            this.tittle = '编辑'*/
                        },isShow: (row) => {
                            if (this.role.roleType === "manage") {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                buttons: [{
                    name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                        this.mainDataForm = {};
                        this.$refs.selectFlow.openDialog();
                        this.tittle = '新增'
                    }
                }, {
                    name: '删除', icon: 'el-icon-plus', type: 'primary', callback: () => {
                        this.deleteMore();
                    }
                }
                ],
                mainDataForm: {},
                tittle: ''
            }
        },
        mounted() {
            this.$axios.get("/bpm/sysAcl/sysAclList").then(result => {
                this.sysAclList = result.data;
            });
        },
        methods: {
            /**列表多选框返回所选择的行信息*/
            handleSelectionChange(rows) {
                this.elTable = rows;
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/AcRoleFlow/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.gridRoleFlow.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
            },
            getAclId(aclName) {
                let aclKey = this.sysAclList.find(bt => bt.aclName == aclName).aclKey;
                return aclKey;
            },
            saveFlowAcl(row) {
                let aclIds = [];
                let obj = Object.assign({}, row);
                if (!row.aclName) {
                    obj.aclName = "";
                    obj.aclId = "";
                } else {
                    let aclNames = row.aclName.split(",");
                    if (aclNames && aclNames.length > 0) {
                        aclNames.forEach(item => {
                            aclIds.push(this.getAclId(item))
                        })
                        obj.aclName = aclNames.join(",");
                        obj.aclId = aclIds.join(",");
                    }
                }
                obj.roleId = this.role.oid;
                obj.roleActDefId = row.oid;
                this.$axios.post('/bpm/AcRoleFlowAclBtn/saveAcl', obj).then(result => {
                    this.$message.success("新增成功");
                }).catch(error => {
                    this.$message.error("出错啦")
                })
            },
            selectConfirm(rows, texts, values) {
                this.$refs.selectFlow.cleanColumnSelect();
                this.$refs.selectFlow.selectCannel();

                let list = [];
                rows.forEach(item => {
                    let obj = {
                        actDefId: item.actDefId,
                        actDefName: item.bpmDefName,
                        actDefKey: item.actDefKey,
                        roleId: this.role.oid,
                    };
                    list.push(obj);
                })
                this.$axios.post('/bpm/AcRoleFlow/saveList', {roleFlowList: list}).then(result => {
                    this.$message.success("新增成功");
                    this.$refs.gridRoleFlow.refresh();
                }).catch(error => {
                    this.$message.error("出错啦")
                })

            },
            /**删除 /bpm/sysAcl/sysAclList*/
            deleteMore() {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    // debugger
                    if (this.elTable.length != 0) {
                        let id = '';
                        this.elTable.forEach(item => {
                            if (this.elTable.length == 1) {
                                id = item.oid;
                            } else {
                                if (item != this.elTable[this.elTable.length - 1]) {
                                    id += item.oid + ',';
                                } else {
                                    id += item.oid;
                                }
                            }
                        });
                        this.$axios.delete("/bpm/AcRoleFlow/del", {"params": {"id": id}}).then(success => {
                            this.$message.success(success.data ? success.data : '删除成功');
                            this.$refs.gridRoleFlow.refresh();
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                })

            }
        },
        watch: {
            role(newValue, oldValue) {
                if (newValue.roleType === "manage") {
                    this.columns = [...this.columnAcl];
                } else {
                    this.columns = [...this.columns2];
                }
            }
        },
        components: {
            IceSelect,
            IceQueryGrid,
            IcePopSelector,
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

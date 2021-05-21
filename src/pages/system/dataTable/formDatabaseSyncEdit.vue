<template>
    <el-dialog v-dialog-drag
               title="从数据库同步"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               v-if="dialogVisible"
               ref="fromdbsyncDialog"
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div ref="fromdbsyncDialogBody">
            <div class="outer">
                <div class="inner">
                    <div class="_text">选择数据源</div>
                </div>
                <div class="inner _input">
                    <el-autocomplete
                            class="inline-input"
                            v-model="inputText"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ></el-autocomplete>
                </div>
                <div class="inner">
                    <el-button type="primary" @click="getTableData">获取表信息</el-button>
                </div>
                <div class="inner _btt">
                    <el-button type="primary" @click="startImport">开始导入</el-button>
                </div>
            </div>
            <ice-query-grid :gridData="tableData"
                            ref="tblGrid"
                            :columns="columns"
                            height="400"
                            :query="query"
                            :pagination="false"
                            @selection-change="selectionChange"
                            chooseItem="multiple"
                            :grid-index="false"></ice-query-grid>
            <div class="ice-button-bar ">
                <el-button type="info" @click="closeDialog">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {Loading} from 'element-ui';

    export default {
        name: "formDatabaseSyncEdit",
        components: {IceQueryGrid},
        data() {
            return {
                inputText: '',
                dialogVisible: false,
                tableData: [],
                listData: [],
                tableCodes: '',          //需要导入的表名
                restaurants: [],         //数据源数据
                dsId: '',                //选中的数据源ID
                columns: [
                    {label: '表名', code: 'tableCode'},
                    {label: '表中文名', code: 'tableName'}
                ],
                query: [
                    {type: 'input', label: '表名', code: 'tableCode', value: ''}
                ]
            }
        },
        methods: {
            querySearch(queryString, cb) {
                let restaurants = this.restaurants;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            handleSelect(item) {
                this.dsId = item.oid;
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.dsCode.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            /**
             * 获取表信息
             */
            getTableData() {
                if (this.dsId) {
                    let loading = Loading.service({target: this.$refs.fromdbsyncDialogBody});
                    this.$axios.get("/permission/res/table/outer/get_tbl_from_ds", {params: {"dsId": this.dsId}}).then(success => {
                        this.tableData = success.data;
                        loading.close();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                        loading.close();
                    })
                } else {
                    this.$message.warning("请选择数据源");
                }


            },
            /**
             * table列点击勾选的数据
             */
            selectionChange(rows) {
                this.listData = rows;
                this.tableCodes = '';
                let arr = [];
                rows.forEach(item => {
                    arr.push(item.tableCode);
                });
                if (arr.length > 0) {
                    this.tableCodes = arr.join(',');
                }
            },
            deletes(list, deleteList) {
                for (let i = 0; i < deleteList.length; i++) {
                    list.splice(list.indexOf(deleteList[i]), 1);
                }
            },
            /**
             * 开始导入
             */
            startImport() {
                if (this.tableCodes) {
                    let loading = Loading.service({target: this.$refs.fromdbsyncDialogBody});
                    this.$axios.post("/permission/res/table/outer/imp_tbl_from_ds", {
                        dsId: this.dsId,
                        tableCodes: this.tableCodes
                    }).then(success => {
                        this.$message.success("导入成功");
                        this.deletes(this.tableData, this.listData);
                        this.$nextTick(() => {
                            this.$refs.tblGrid.search(true)
                        });
                        loading.close();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                        loading.close();
                    });
                } else {
                    this.$message.warning("请勾选需要导入的数据");
                }
            },
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog() {
                this.dialogVisible = true;
                this.inputText = '';
                this.$nextTick(() => {
                    this.$axios.get("/permission/res/ds/outer/get/ds_config_infos", {params: {"loadDisabled": false}}).then(success => {
                        this.restaurants = success.data;
                        this.restaurants.forEach(item => {
                            item.value = item.dsName;
                        });
                    })
                });
            }
        }
    }
</script>

<style scoped>
    .outer {
        background-color: #ffffff;
    }

    .inner {
        display: inline-block;

    }

    ._text {
        margin-left: 60px;

    }

    ._input {
        padding: 2px 5px;

    }

    ._btt {
        padding-left: 25px;
    }
</style>

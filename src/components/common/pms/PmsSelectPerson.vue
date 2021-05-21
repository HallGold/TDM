<template>
    <div>
        <ice-dialog :title="title" :visible.sync="visible" width="1200px">
            <el-row>
                <el-col :span="6">
                    <ice-tree :load-url="treeUrl"
                              label-prop="deptName"
                              value-prop="deptCode"
                              node-key="deptCode"
                              class="tree"
                              treeWidth="296px"
                              @node-click="orgNodeClick"
                              ref="iceGriddept"
                    >
                    </ice-tree>
                </el-col>
                <el-col :span="12">
                    <ice-query-grid
                            ref="queryGrid"
                            :gridAutoRefresh="false"
                            codeProp="code"
                            data-url="/permission/user/users_by_condition?cascade=true"
                            v-bind="$attrs"
                            :lazy="false"
                            :columns="columns"
                            :selectedCodes="checkCodesJs"
                            :disCode="disCode"
                            :disabledsCodes="disabledsCodes"
                            :query="querys"
                            @selection-change="selectionChange"
                            :before-bind-data="dataFilter"
                            exportTitle="科研项目信息"
                            v-on="$listeners">
                    </ice-query-grid>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>已选列表</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="handleEmpty">清空
                            </el-button>
                        </div>
                        <div class="con">
                            <div v-for="(item, index) in sectPersons" :key="item.oid" class="text item">
                                <el-tag
                                        effect="dark"
                                        @close="closeTag(item, index)"
                                        closable>
                                    {{item.deptShortName}}-{{item.name}}
                                </el-tag>
                            </div>
                        </div>

                    </el-card>
                </el-col>
            </el-row>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    import IceDialog from "../base/IceDialog";
    import IceQueryGrid from "../base/IceQueryGrid";
    import IceTree from "../base/IceTree";

    export default {
        name: "PmsSelectPerson",
        props: {
            title: {
                default: "请选择"
            },
            // 选中的codes
            checkedCodes: {
                default: () => {
                    return []
                }
            },
            // 判定是否单选
            disCode: {
                default: null
            },
            parDeptCode: {
                default: '9003'
            }
        },
        components: {
            IceDialog,
            IceQueryGrid,
            IceTree
        },

        data() {
            return {
                visible: false,
                querys: [
                    {code: 'enabled', value: 1, exp: '=', type: 'static'},
                    {type: 'input', label: '姓名', code: 'name', value: '', exp: 'like'},
                    {type: 'static', label: 'id', code: 'deptId', value: '', exp: '='},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'code', hidden: true},
                    {code: 'partTimeWorker', hidden: true},
                    {label: '姓名', code: 'name'},
                    {
                        label: '是否兼职', code: 'partTimeWorker', width: 90, formatter: (row) => {
                            if (row.partTimeWorker == '0') {
                                return '是'
                            }
                            return '否'
                        }
                    },
                    {label: '密级', code: 'securityLevel', mapTypeCode: 'OR_SECRET_LEVEL'},
                    {label: '单位', code: 'orgShortName'},
                    {label: '部门', code: 'deptShortName'},
                    {label: '工号', code: 'workCard'},
                    {label: '联系电话', code: 'landlineTel'},
                    {label: '兼职说明', code: 'task'},
                ],
                // 选中的人
                sectPersons: [],
                sectData: [],
                crewCodes: []
            }
        },
        methods: {
            // 表格筛选 不能选择三元人员
            dataFilter(data) {
                console.log(this.crewCodes, 'crewCodes')
                let arr = data && data.length > 0 ? data.filter(c => {
                    return this.crewCodes.indexOf(c.code) == -1 && c.enabled == 1;
                }) : data;
                return arr;
            },
            // 获取常量
            getConstant() {
                // console.log(this.getAppMenus(this.getAppCode), 'getAppMenus')
                this.$axios.get("permission/app_constant/byCode", {params: {appCode: 'PMS', code: 'GL_RY_CODE'}})
                    .then(result => {
                        this.crewCodes = result.data.value.split(',');
                        this.$nextTick(_ => {
                            // this.$refs.queryGrid.refresh();
                        })
                    })
                    .catch(error => {

                    })
            },
            // 清空选中
            handleEmpty() {
                this.sectPersons.forEach((c, i) => {
                    this.$refs.queryGrid.closeSelection(c.code);
                })
                this.sectPersons = [];
            },
            // 树节点
            orgNodeClick(code, row) {
                console.log(row, 'row');
                this.querys[2].value = row.data.oid;
                this.$refs.queryGrid.refresh();

            },
            // 选择回调
            selectionChange(rows, removerows) {
                console.log(rows, 'rows65165')
                if (removerows && removerows.length > 0) {
                    this.sectPersons = this.sectPersons.filter(item => !removerows.find(rm => rm.code == item.code))
                }
                let sectItem = rows.filter(item => !this.sectPersons.find(o => o.code == item.code))
                this.sectPersons = [...this.sectPersons, ...sectItem]

            },
            // 确定
            handleConfirmAdd() {
                console.log(this.sectPersons, 'this.sectPersons')
                let data = JSON.parse(JSON.stringify(this.sectPersons))
                this.$emit('select-emit', data);
                this.visible = false;
                this.reset();
            },
            closeTag(item, index) {
                this.$refs.queryGrid.closeSelection(item.code);
                this.sectPersons.splice(index, 1)
            },
            reset() {
                this.sectPersons = [];
            },
            // refresh() {
            //     if (this.$refs.iceGriddept) {
            //         this.$refs.iceGriddept.refresh();
            //     }
            // },
            // 删除单个选中
            reDoRemove(code) {
                let index = this.sectPersons.findIndex(c => {
                    return c.code === code;
                })
                this.sectPersons.splice(index, 1);
            },
            closeOnClickModal() {
                this.reset();
            },
            loadSectionsList() {
                console.log(this.checkedCodes, 'this.checkedCodes')
                if (this.checkedCodes.length > 0) {
                    //debugger
                    this.$axios.get("/permission/user/get_users", {params: {userCodes: this.checkedCodes.join(',')}})
                        .then(result => {
                            if (result.data) {
                                let selections = result.data.map(item => {
                                    return {
                                        code: item.code,
                                        name: item.name,
                                        deptShortName: item.deptShortName,
                                        orgShortName: item.orgShortName,
                                        deptCode: item.deptCode
                                    }
                                })
                                this.sectPersons = selections;
                                if (this.querys[2].value) {
                                    this.$refs.queryGrid.refresh();
                                }
                            }
                        })

                } else {
                    this.sectPersons = [];
                    this.$nextTick(_ => {
                        if (this.visible && this.querys[2].value) {
                            this.$refs.queryGrid.refresh();
                        }

                    })

                }
            },
        },
        watch: {
            // checkedCodes() {
            //     let arr = this.sectPersons.filter(c => {
            //         return this.checkedCodes.indexOf(c.code) != -1;
            //     })
            //     this.sectPersons = arr;
            // }

            visible() {
                if (this.visible) {
                    this.loadSectionsList();
                }
            }
        },
        created() {
            this.loadSectionsList();
            this.getConstant();

        },
        computed: {
            // 禁止选择
            disabledsCodes() {
                let codes = this.sectPersons.map(c => {
                    return c.deptCode
                })
                let oids = this.sectPersons.map(c => {
                    return c.oid
                })
                return {
                    codes,
                    oids
                }
            },
            treeUrl() {
                return '/pms/Xminfo/treeByDeptCode?deptCode=' + this.parDeptCode
            },
            checkCodesJs() {
                let codes = this.sectPersons.map(c => {
                    return c.code
                })
                return codes;
            }

        }
    }
</script>

<style scoped>
    .tree {
        height: 380px;
    }

    .con {
        height: 300px;
        overflow: auto;
    }

    .item {
        margin-bottom: 5px;
    }

    .box-card {
        height: auto;
    }
</style>
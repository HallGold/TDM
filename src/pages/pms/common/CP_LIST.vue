<template>
    <div>
        <el-input placeholder="请输入内容" v-model="condition" class="input-with-select">
            <template slot="prepend">产品库</template>
            <el-button slot="append" icon="el-icon-search" @click="getProductData(1)"></el-button>
        </el-input>
        <vxe-table ref="xTable1"
                   :data="tableData"
                   size="small"
                   :checkbox-config="{ checkMethod}"
                   @select-all="selectAllEvent"
                   @select-change="selectChangeProductTable">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column field="cpcode" title="产品编码"></vxe-table-column>
            <vxe-table-column field="cpname" title="产品名称"></vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
    export default {
        name: "CP_LIST",
        props: {
            sectitem: {
                default: function () {
                    return []
                }
            },
            flowScope: {},
            oidXm: String
        },
        watch: {
            oidXm() {
                this.getProductData();
            }
        },
        computed: {
            list() {
                let list = this.sectitem.filter((c) => {
                    return c.version != -1;
                })
                return list
            }
        },
        data() {
            return {
                condition: '',
                tableData: [],
                // 表格选中数据
                tableCheckedData: []
            }
        },

        methods: {
            // 复选框禁用
            checkMethod() {
                return !this.flowScope.formReadonly
            },
            selectChangeProductTable({checked, row}) {
                console.log(row)

                let item = {};
                item.cpName = row.cpname;
                item.cpCode = row.cpcode;
                item.checked = checked;
                item.oid = row.cpid;
                item.cllx = row.cllx;
                item.cpSldw = row.dw && row.dw != 'null' ? row.dw : "";
                item.cpzrdwcode = row.cpzrdwcode;
                item.cpzrdw = row.cpzrdw;
                item.cpzrrcode = row.cpzrrcode;
                item.cpzrr = row.cpzrr;
                item.kcsl = row.kcsl;
                item.dw = row.dw;

                if (!checked) {
                    this.delPro(row, item);
                } else {
                    this.$emit("select", item);
                }

            },
            // 判断是否能够删除产品
            delPro(row, item) {
                this.$axios.get("/pms/PmsScJh/deleteJudgmentByOidCp", {params: {oidCp: item.oid}})
                    .then(result => {
                        if (result.data) {
                            this.$emit("select", item);
                        } else {
                            this.$refs.xTable1.setCheckboxRow(row, true);
                            this.$message.warning("存在正在生产的产品，禁止删除！");
                        }
                    })
                    .catch(error => {
                        this.$message.error("删除失败")
                    })
                    .finally(_ => {

                    })
            },
            getProductData() {
                // let url = "/pdm/PdmPart/list";
                let url = "pms/PmsViewCpk/getByXmoid";

                //let url = "pms/PmsHtinfo/list?size=20&current=1";

                /*this.$axios.get(url)
                    .then(result => {

                        console.log(result)

                        this.tableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询产品数据失败")
                    })*/
                this.$axios.get(url, {params: {xmoid: this.oidXm, condition: this.condition}})
                    .then(result => {
                        this.tableData = result.data;
                        this.$nextTick(() => {
                            let tid = setTimeout(() => {
                                this.clearCheckboxRow();
                                clearTimeout(tid);
                            }, 20)
                            console.log('this.sectitem', this.sectitem)

                        })
                    })
                    .catch(error => {
                        this.$message.error("查询产品数据失败")
                    })
            },
            // 取消选中
            cancelCheckbox(row) {
                console.log(row, 'row', this.tableData)
                let abb = this.tableData.filter((c) => {
                    return c.cpid === row.oidCpk
                })
                this.$refs.xTable1.setSelection(abb, false);
            },
            // 所有勾选取消事件
            selectAllEvent({selection, checked}) {
                let arr = [];
                let all = checked ? selection : this.tableData;
                console.log(all)
                all.forEach((row) => {
                    let item = {};
                    item.cpName = row.cpname;
                    item.cpCode = row.cpcode;
                    item.checked = checked;
                    item.oid = row.cpid;
                    item.cllx = row.cllx;
                    arr.push(item);
                })
                this.$emit("select", arr);
                // let items = [];
                // let list = this.$refs.xTable1.getSelectRecords();
                // list.forEach((c)=>{
                //   let obj = {
                //     cpName: c.cpName,
                //     cpCode: c.cpCode,
                //     oidCpk: c.oid,
                //   }
                //   items.push(obj);
                // })
            },
            // 清空所有行选中 和对有数据的行重新选中操作
            clearCheckboxRow() {
                console.log(this.$parent, 'parent')
                this.$nextTick(() => {
                    let sectRows = this.list;
                    this.$refs.xTable1.clearSelection();
                    let ids = [];
                    if (sectRows.length > 0) {
                        sectRows.forEach((c) => {
                            ids.push(c.oidCpk);
                        })

                        let abb = this.tableData.filter((c) => {
                            return ids.indexOf(c.cpid) > -1;
                        })
                        console.log(abb, 'abb')
                        this.$refs.xTable1.setSelection(abb, true);

                    }
                })

            },
            // 表格重新计算
            resize() {
                this.$nextTick(() => {
                    this.$refs.xTable1.recalculate();
                })
            },
        },

        created() {
            this.getProductData();
        },

    }
</script>

<style scoped>

</style>

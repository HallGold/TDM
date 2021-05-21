<template>
    <div>
        <table width="100%" style="margin: 5px 0px;">
            <tr>
                <td>组次：{{sectGroupData.jhpc}}</td>
                <td>数量：{{sectGroupData.jhsl}}</td>
                <td>齐套时间：{{startTime}}</td>
                <td>交付时间：{{endTime}}</td>
            </tr>
        </table>
        <vxe-table :data="list"
                   size="small"
                   :edit-config="{trigger: 'click', mode: 'row', activeMethod: activeRowMethod}"
                   ref="xTable">
            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="cpCode" title="产品编码"></vxe-table-column>
            <vxe-table-column field="cpName" title="产品名称"></vxe-table-column>
            <vxe-table-column field="jhdateStart" title="开始时间">
                <template v-slot="{ row, rowIndex }">
                    <el-date-picker
                            :picker-options="countDateSelectRange(formModel , filedDateControls.cpDate , 2, row.gylx?row.gylx.gxes:null, 's', row)"
                            :disabled="flowScope.formReadonly"
                            v-model="row.jhdateStart"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </template>
            </vxe-table-column>
            <vxe-table-column field="jhdateEnd" title="结束时间">
                <template v-slot="{ row, rowIndex }">
                    <el-date-picker
                            :disabled="flowScope.formReadonly"
                            v-model="row.jhdateEnd"
                            type="date"
                            :picker-options="countDateSelectRange(formModel , filedDateControls.cpDate , 2, row.gylx?row.gylx.gxes:null, 'e', row)"
                            placeholder="选择日期">
                    </el-date-picker>
                </template>
            </vxe-table-column>
            <vxe-table-column field="cpjfsl" title="计划数量"
                              :edit-render="{name: 'input', attrs: {type: 'number'}}">
                <template v-slot:edit="{ row, rowIndex }">
                    <pms-input v-model="row.cpjfsl" maxlen="6" :disabled="flowScope.formReadonly"></pms-input>
                </template>

            </vxe-table-column>
            <vxe-table-column field="dw" title="单位">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.dw}}</span>
                </template>
            </vxe-table-column>
<!--            <vxe-table-column field="cpbjsl" title="备件数量"-->
<!--                              :edit-render="{name: 'input', attrs: {type: 'number'}}">-->
<!--                <template v-slot:edit="{ row, rowIndex }">-->
<!--                    <pms-input v-model="row.cpbjsl" maxlen="6" :disabled="flowScope.formReadonly"></pms-input>-->
<!--                </template>-->
<!--            </vxe-table-column>-->
            <vxe-table-column field="docNum" title="图纸数量">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.docNum}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="kcsl" title="库存">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.kcsl}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="cllx" title="材料类型" width="100">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.cllx!='null'?row.cllx:''}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="cpzrdw" title="责任单位" width="100">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.cpzrdw!='null'?row.cpzrdw:''}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="cpzrr" title="责任人" width="100">
                <template v-slot="{ row, rowIndex }">
                    <span>{{row.cpzrr!='null'?row.cpzrr:''}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="100">
                <template v-slot="{ row }">
                    <el-link type="primary" :underline="false" @click="handleRemove(row)"
                             v-if="!flowScope.formReadonly">移除
                    </el-link>
                    <el-link style="margin-left: 8px;" type="primary" :underline="false" @click="handleSect(row)">图纸
                    </el-link>
                </template>
            </vxe-table-column>
        </vxe-table>
        <!--图纸选择-->
        <ice-dialog title="图纸选择" :visible.sync="docVisible" width="800px">
            <ice-query-grid
                    :gridData="docData"
                    exportTitle="选择图纸"
                    :operations-width="120"
                    :columns="doc.columns"
                    :operations="doc.operations"
                    :chooseItem="chooseItem"
                    :pagination=false
                    @selection-change="handleSectedContract"

                    ref="grid2">
            </ice-query-grid>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleSectContract">确认</el-button>
                <el-button type="info" @click="docVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import PmsInput from '@/components/common/pms/PmsInput';
    import docConstants from '../../../utils/docConstants'

    export default {
        name: "CP_EDIT",
        mixins: [docConstants],
        components: {
            IceQueryGrid,
            PmsInput
        },
        props: {
            tableData: {
                default: function () {
                    return []
                }
            },
            sectGroupData: {
                default: function () {
                    return {}
                }
            },
            flowScope: {},
            activeRowMethod: {
                type: Function
            },
            countDateSelectRange: {
                type: Function
            },
            filedDateControls: {
                default: function () {
                    return {}
                }
            },
            formModel: {
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < moment(this.startTime).valueOf() || time.getTime() > moment(this.endTime).valueOf();
                    },
                },
                docVisible: false,
                condition: '',
                doc: {
                    columns: [
                        {label: '图纸名称', code: 'docname', width: 160},
                        {label: '图纸编号', code: 'doccode', width: 160},
                        {label: '图纸版本', code: 'docver', width: 160},
                    ],
                    operations: [
                        // {
                        //     name: '下载', callback: this.downloadFile, ctrlCode: "BBJ"
                        // },
                        {
                            name: '查看', callback: this.lookFile, ctrlCode: "BSC"
                        },
                    ]
                },
                docData: [],
                sectDocRow: {},
                sectDoc: [],
            }
        },
        computed: {
            chooseItem() {
                return this.flowScope.formReadonly ? 'none' : 'multiple'
            },
            list() {
                let list = this.tableData.filter((c) => {
                    return c.version != -1;
                })
                return list
            },
            startTime() {
                return this.sectGroupData.jhdateQt ? moment(this.sectGroupData.jhdateQt).format('YYYY-MM-DD') : '';
            },
            endTime() {
                return this.sectGroupData.jhdateJf ? moment(this.sectGroupData.jhdateJf).format('YYYY-MM-DD') : '';
            }
        },
        methods: {
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            // 选择图纸
            handleSect(row) {
                let ids = [];
                if (row.docIds) {
                    ids = row.docIds.split(',');
                }
                this.sectDocRow = row;
                this.docVisible = true;
                console.log(this.flowScope.formReadonly, 'this.flowScope.formReadOnly')
                let url = "pms/PmsViewDocList/getByCpid";
                this.$axios.get(url, {params: {cpid: row.oidCpk}})
                    .then(result => {
                        this.docData = result.data;
                        // 找出被选中的数据
                        let sectDoc = this.docData.filter((c) => {
                            return ids.indexOf(c.dataid) > -1
                        })
                        this.$nextTick(() => {
                            this.$refs.grid2.$refs.eltable.clearSelection();
                            sectDoc.forEach(row => {
                                this.$refs.grid2.$refs.eltable.toggleRowSelection(row, true);
                            });
                        })

                        if (this.flowScope.formReadonly) {
                            this.docData = sectDoc;
                        }
                        // this.$nextTick(()=>{
                        //   let tid = setTimeout(()=>{
                        //     this.clearCheckboxRow();
                        //     clearTimeout(tid);
                        //   }, 20)
                        // })
                    })
                    .catch(error => {
                        this.$message.error("查询产品图纸失败！")
                    })
            },
            // 选择图纸回调
            handleSectedContract(data) {
                console.log(data);
                this.sectDoc = data;
            },
            handleSectContract() {
                let len = this.sectDoc.length;
                let ids = this.sectDoc.map((c) => {
                    return c.dataid;
                })
                this.sectDocRow.docIds = ids.join(',');
                this.sectDocRow.docNum = len;
                this.docVisible = false;
            },
            loadTableData(row) {
                let data = this.getCpData();

                if (row.checked) {
                    // 去重 如果有就不添加
                    let item = data.filter((c) => {
                        return row.oidCpk === c.oidCpk;
                    })
                    if (item.length > 0) {
                        return
                    }
                    this.insertEvent(row, -1);
                } else {
                    data.map(o => {
                        if (o.oidCpk == row.oidCpk) {
                            this.$refs.xTable.remove(o);
                            this.$emit('removeRow', row);
                        }
                    })
                }
            },

            insertEvent(record, index) {
                this.row = this.$refs.xTable.insertAt(record, index)
                    .then(({row}) => this.$refs.xTable.setActiveCell(row))
            },
            getData() {
                let insertAttaData = this.$refs.xTable.getInsertRecords();
                let removeAttaData = this.$refs.xTable.getRemoveRecords();
                let updateAttaData = this.$refs.xTable.getUpdateRecords();
                // let updateAttaData = this.$refs.xTable.getTableData();
                return insertAttaData.concat(removeAttaData, updateAttaData);
            },
            // 获取有oid 删除的数据，和新增的数据
            getCpData() {
                let showData = this.$refs.xTable.getTableData().visibleData;
                return showData;
            },
            getProductData() {
                //this.loadTableData({});

                //let insertAttaData = this.$refs.xTable.getInsertRecords();

                //this.$refs.xTable.remove(insertAttaData[0])
            },
            // 移除
            handleRemove(row) {
                this.$confirm('是否确认移除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.oid) {
                        this.delPro(row);
                    } else {
                        this.$refs.xTable.remove(row);
                        this.$emit('removeRow', row);
                    }

                }).catch(() => {
                    console.log('取消成功')
                })
            },
            // 判断是否能够删除产品
            delPro(row) {
                this.$axios.get("/pms/PmsScJh/deleteJudgmentByOidCp", {params: {oidCp: row.oid}})
                    .then(result => {
                        if (result.data) {
                            this.$refs.xTable.remove(row);
                            this.$emit('removeRow', row);
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
            // 表格重新计算
            resize() {
                this.$nextTick(() => {
                    this.$refs.xTable.recalculate();
                })
            },

        },
    }
</script>

<style scoped>

</style>

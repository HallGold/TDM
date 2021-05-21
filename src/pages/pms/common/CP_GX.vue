<template>
    <div style="position: relative;height: 300px;">
        <div class="haha">
            <vxe-table :data="gxData"
                       size="small"
                       resizable
                       auto-resize
                       height="260"
                       :edit-config="{trigger: 'click', mode: 'row', activeMethod: activeRowMethod}"
                       ref="xTable">
                <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                <vxe-table-column field="gxCode" title="工序编码" width="80"></vxe-table-column>
                <vxe-table-column field="gxName" title="工序名称" width="80"></vxe-table-column>
                <vxe-table-column field="gxdept" title="承制单位" width="150"></vxe-table-column>
                <vxe-table-column field="startTime" title="开始时间" width="150">
                    <template v-slot="{ row, rowIndex }">
                        <el-date-picker
                                :disabled="flowScope.formReadonly"
                                v-model="row.startTime"
                                :picker-options="countDateSelectRange(currentProduct , filedDateControls.gxDate , 3, null, 's', row)"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="endTime" title="结束时间" width="150">
                    <template v-slot="{ row, rowIndex }">
                        <el-date-picker
                                :disabled="flowScope.formReadonly"
                                v-model="row.endTime"
                                :picker-options="countDateSelectRange(currentProduct , filedDateControls.gxDate , 3, null, 'e', row)"
                                type="date"
                                @change="change"
                                placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="jhsl" title="计划数量" :edit-render="{name: 'input', attrs: {type: 'number'}}"
                                  width="150">
                    <template v-slot:edit="{row}">
                        <pms-input v-model="row.jhsl" maxlen="6"></pms-input>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="workHour" title="工时" width="100">
                </vxe-table-column>
                <vxe-table-column field="dw" title="计量单位" width="100">
                </vxe-table-column>
                <vxe-table-column field="gxtype" title="工序类型" width="120">
                    <template v-slot="{ row, rowIndex }">
                        <ice-select :disabled="flowScope.formReadonly" v-model="row.gxtype"
                                    map-type-code="GXTYPE"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="sfsjjc" title="是否首件鉴定" width="120">
                    <template v-slot="{ row, rowIndex }">
                        <ice-select :disabled="flowScope.formReadonly" v-model="row.sfsjjd"
                                    map-type-code="FIRST_IDENTIFIED"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="sfsjcqjc" title="是否所级产前检查" width="120">
                    <template v-slot="{ row, rowIndex }">
                        <ice-select :disabled="flowScope.formReadonly" v-model="row.sfsjcqjc"
                                    map-type-code="ANTENATAL_PREPARATION"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </div>

    </div>
</template>

<script>
    import IceSelect from "@/components/common/base/IceSelect";
    import PmsInput from '@/components/common/pms/PmsInput'

    export default {
        name: "CP_GX",
        components: {
            IceSelect,
            PmsInput
        },
        data() {
            return {
                tableData: [
                    {
                        gxCode: '',
                        gxName: '',
                        czdw: '',
                        startTime: '',
                        endTime: '',
                        jhsl: '',
                        cpdw: '',
                    }
                ],
                gxData: this.srcData,
            }
        },

        methods: {
            change(val) {
                console.log(val)
            },
            getData() {
                let insertAttaData = this.$refs.xTable.getInsertRecords();
                let removeAttaData = this.$refs.xTable.getRemoveRecords();
                let updateAttaData = this.$refs.xTable.getUpdateRecords();
                return insertAttaData.concat(removeAttaData, updateAttaData);
            },

            getAllData() {
                let data = this.getData();
                if (data) {
                    console.log(0)

                    let oidCpk = data[0].oidCpk;

                    this.gxData.map(o => {
                        if (o.oidCpk == oidCpk) {
                            this.gxData.remove(o);
                        }
                    })

                }
                this.gxData.concat(data);
                return this.gxData;
            },
            resize() {
                this.$nextTick(() => {
                    this.$refs.xTable.recalculate();
                })
            }

        },

        mounted() {

        },

        watch: {
            srcData() {
                console.log(this.srcData, 'srcdata')
                this.gxData = this.srcData;
            }
        },
        props: {
            srcData: {
                default: () => {
                    return []
                }
            },
            flowScope: {
                default: function () {
                    return {}
                }
            },
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
            currentProduct: {
                default: function () {
                    return {}
                }
            }
        },
    }
</script>

<style scoped>
    .haha {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
    }
</style>
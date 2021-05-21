<template>
    <div v-loading="loading">
        <div v-if="!finishState">
            <div v-if="isHandleer" class="ice-grid-button-bar">
                <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
            </div>
            <div v-if="!isHandleer&&isRwjf" class="ice-grid-button-bar">
                <el-button type="success" icon="el-icon-refresh" @click="refreshCgydTable">刷新</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addItem">添加交付物</el-button>
                <el-button type="primary" icon="el-icon-check" @click="saveCgyd">保存</el-button>
                <el-button type="primary" icon="el-icon-top" @click="fjProcess">审批</el-button>
            </div>
        </div>
        <vxe-table
                border
                resizable
                :auto-resize=true
                :sync-resize="syncResize"
                ref="xGrid"
                highlight-current-row
                highlight-hover-row
                :edit-rules="validRules"
                :checkbox-config="{checkMethod: checkMethod}"
                :expand-config="{labelField: 'cgydFjNum'}"
                :data="list"
                height="500px"
                :edit-config="{trigger: 'click', mode: 'row', showStatus: true, showIcon: false}"
                :keyboard-config="{isArrow: false}">
            <vxe-table-column type="checkbox" width="50" v-if="isChecked"></vxe-table-column>
            <vxe-table-column type="expand" field="cgydFjNum" title="文件数量" width="80">
                <template v-slot:content="{ row, rowIndex }">
                    <div style="width: 80%;">
                        <accessory @change="fjChange" :rwdata="rwdata" :row="row"
                                   :isHandleer="isChecked&&(!row.finish||isHandleer)"
                                   :control-mj="controlMj(row)"></accessory>
                    </div>
                </template>
            </vxe-table-column>
            <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>

            <vxe-table-column field="cgmc" title="成果名称">
                <template v-slot="{ row }">
                    <el-input v-if="!row.isNew" v-model="row.cgmc" :disabled="!isHandleer" maxlength="80"></el-input>
                    <el-input v-if="row.isNew" v-model="row.cgmc" maxlength="80"></el-input>
                </template>
            </vxe-table-column>
            <vxe-table-column field="issq" title="是否审签" width="100px">
                <template v-slot="{ row }">
                    <ice-select v-if="!row.isNew" :disabled="!isHandleer" v-model="row.issq"
                                map-type-code="IS_YES_NO"></ice-select>
                    <ice-select v-if="row.isNew" v-model="row.issq" map-type-code="IS_YES_NO"></ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="cgsm" title="成果说明" width="150px">
                <template v-slot="{ row }">
                    <el-input v-if="!row.isNew" v-model="row.cgsm" :disabled="!isHandleer"></el-input>
                    <el-input v-if="row.isNew" v-model="row.cgsm"></el-input>
                </template>
            </vxe-table-column>
            <vxe-table-column field="zljcd" title="质量检查点" width="100px">
                <template v-slot="{ row }">
                    <ice-select v-if="!row.isNew" :disabled="!isHandleer" v-model="row.zljcd"
                                map-type-code="IS_YES_NO"></ice-select>
                    <ice-select v-if="row.isNew" v-model="row.zljcd" map-type-code="IS_YES_NO"></ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="spzt" title="审批状态" width="120px">
                <template v-slot="{ row }">
                    <ice-select :disabled="true" v-model="row.spzt?row.spzt: insertRecord.spzt"
                                map-type-code="SPZT"></ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="dataSecretLevcode" title="密级" width="120px">
                <template v-slot="{ row }">
                    <ice-select :disabled="row.oid?true:false" :control-mj="controlMjFj"
                                :control-mj-par="controlMjPar(row)" v-bind="$attrs"
                                v-model="row.dataSecretLevcode"
                                map-type-code="DATA_SECRET_LEVEL"
                                filterable placeholder="请选择">
                    </ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column v-if="!abb" title="完成情况" width="100px">
                <template v-slot="{ row }">
                    <!--<el-checkbox v-model="row.iscgjf" :disabled="!isRwjf || finishState" @change="(val)=>{row.cgjf=val; row.cgjf=val?'IS_YES': 'IS_NO'; val?finishDataCheck.push(row): removeArr(finishDataCheck, row)}"></el-checkbox>-->
                    <el-checkbox v-model="row.finish" :disabled=true></el-checkbox>
                </template>
            </vxe-table-column>
            <vxe-table-column width="60" title="操作" v-if="isDetail!=1">
                <template v-slot="{ row, rowIndex }">
                    <div style="display: flex; flex-direction: row">
                        <!--<ice-single-upload v-if="!isHandleer && isRwjf && !row.finish" :on-success="fileUploadSuccess" :doSecret="true" ref="fileUpload"></ice-single-upload>-->
                        <!--<el-button type="text" @click="handleUpload" v-if="!isHandleer && isRwjf && !row.finish">上传附件</el-button>-->
                        <!--<el-button type="text" v-if="!isHandleer && isRwjf && !row.finish" @click="selectDeliver">上传设计文档</el-button>-->
                        <!--<el-button v-if="row.dataid" type="text" @click="downloadFile(row)">下载</el-button>-->
                        <el-button v-if="(!row.finish&&(rwdata.spzt==SPZT.WSP||!rwdata.spzt))||(!row.finish&&isRwjf)" type="text"
                                   @click="delItem(row, rowIndex)">删除
                        </el-button>
                    </div>
                </template>
            </vxe-table-column>
        </vxe-table>
        <ice-single-upload :control-mj="controlMj" v-bind="$attrs" :on-success="fileUploadSuccess" :doSecret="true"
                           ref="fileUpload">
            <div></div>
        </ice-single-upload>
        <ice-dialog title="选择交付物" :visible.sync="visibleDeliver" width="1200px">
            <doc-search-for-multiple v-bind="$attrs" @fatherMethod="fatherMethod"></doc-search-for-multiple>
        </ice-dialog>
    </div>
</template>
<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import DocSearchForMultiple from "../common/docSearchForMultiple";
    import accessory from './components/accessory'
    import {whether, SPZT} from "../../../utils/constant";

    export default {
        props: {
            data: Array,
            Height: {
                default: '300px',
            },
            // 判定是否需要操作按钮。
            isHandleer: {
                default: true,
                type: Boolean
            },
            isChecked: {
                default: false,
                type: Boolean
            },
            isRwjf: {
                default: false,
                type: Boolean
            },
            oid_rw: {
                type: String
            },
            closeDialog: {
                type: Function
            },
            dataSecretLevcode: {
                default: '2',
                type: String
            },
            syncResize: [Boolean, String, Number],
            isDetail: {
                default: 0
            },
            rwdata: {
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                SPZT,
                abb: this.isHandleer,
                visibleDeliver: false,
                saveData: [],
                insertRecord: {
                    oidWbs: this.oid_rw,
                    cgmc: '',
                    issq: whether.IS_YES,
                    spzt: SPZT.WSP,
                    zljcd: whether.IS_YES,
                    cgjf: whether.IS_NO,
                    cgsm: '',
                    isNew: true,
                    isAdd: 1,
                    dataSecretLevcode: this.rwdata.dataSecretLevcode
                },
                finishState: false,
                finishDataCheck: [],
                validRules: {
                    cgmc: [
                        {required: true, message: '请输入成果名称'},
                    ],
                },
                tableData: this.data,
                loading: false,
                selectItem: {},
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    indent: '10',
                    expandAll: true
                },
            }
        },
        computed: {

            list() {
                if (this.tableData) {
                    this.tableData.map(row => {
                        row.finish = (row.issq == whether.IS_YES && row.spzt == SPZT.YSP) || (row.issq == whether.IS_NO && row.cgydFjNum > 0) ? true : false;
                    })
                    console.log(this.tableData, 'tabledata')
                    return this.tableData;
                } else {
                    return []
                }

            },
            controlMjFj() {
                return this.dataSecretLevcode ? [this.dataSecretLevcode] : [];
            },
        },
        created() {
            console.log(this.rwdata, 'rwdata')
        },
        watch: {
            data() {
                this.tableData = this.data;
            },
            rwdata() {
                this.oidWbs = this.rwdata.oid;
                this.dataSecretLevcode = this.rwdata.dataSecretLevcode;
            },
            oid_rw () {
                this.insertRecord.oidWbs = this.oid_rw;
            }
        },
        methods: {
            controlMj(row) {
                return row.dataSecretLevcode ? [row.dataSecretLevcode, ...this.controlMjFj] : this.controlMjFj
            },
            controlMjPar(row) {
                let rowfj = row.wbsCgydJf ? row.wbsCgydJf : [];
                let visibledata = rowfj.filter(c => {
                    return c.vision != -1;
                })
                return visibledata.map(c => {
                    return c.dataSecretLevcode
                })
            },
            fjChange(data) {
                console.log(data, 'change')
                let tdata = this.$refs.xGrid.getTableData().visibleData;
                tdata.map(c => {
                    if (c.ROW_ID == data.row.ROW_ID) {
                        c.wbsCgydJf = data.fj
                    }
                })
            },
            handleUpload() {
                this.$refs.fileUpload.visible = true;
            },
            checkMethod({row}) {
                if (row.issq == whether.IS_YES && row.spzt != SPZT.YSP) {
                    return true;
                } else if (row.issq !== whether.IS_YES && row.spzt == SPZT.WSP) {
                    return true
                } else {
                    return false;
                }
            },
            // 获取父级密级
            getFjMj(row) {
                console.log(row.dataSecretLevcode ? [row.dataSecretLevcode, ...this.controlMjFj] : this.controlMjFj)

            },
            getArrIndex(srcArr, tarObj) {
                if (srcArr) {
                    for (let i = 0; i < srcArr.length; i++) {
                        if (srcArr[i] === tarObj) {
                            return i
                        }
                    }
                }
                return -1
            },
            removeArr(srcArr, tarObj) {
                debugger
                let idx = this.getArrIndex(srcArr, tarObj)
                if (idx != -1) {
                    this.finishDataCheck.splice(idx, 1)
                }
            },
            addItem() {
                let xGrid = this.$refs.xGrid
                xGrid.insertAt(this.insertRecord, -1)
                    .then(({row}) => xGrid.setActiveCell(row));
            },
            delItem(row, rowIndex) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.xGrid.remove(row)
                }).catch(() => {
                    console.log('取消成功')
                })

            },
            //获取新增
            getInsertData() {
                console.log(this.$refs.xGrid, 'this.$refs.xGrid')
                return this.$refs.xGrid.getInsertRecords()
            },
            //获取修改
            getUpdateData() {
                return this.$refs.xGrid.getUpdateRecords();
            },
            //获取删除
            getDeleteData() {
                return this.$refs.xGrid.getRemoveRecords();
            },
            //获取所有
            getFullData() {
                let {fullData} = this.$refs.xGrid.getTableData()
                return fullData
            },
            //获取手动完成的数据
            getFinishDataCheck() {
                let result = true;
                let msgList = []

                let tableData = this.$refs.xGrid.getTableData().tableData;
                tableData.forEach((c, i) => {
                    let index = i + 1;
                    let str = '';
                    if (c.issq == whether.IS_YES && c.spzt != SPZT.YSP) {
                        str = `第 ${index}条数据，未审批！`
                    } else if (c.issq == whether.IS_NO && c.cgydFjNum <= 0) {
                        str = `第 ${index}条数据，未上传交付物！`
                    }
                    if (str) {
                        msgList.push(str)
                    }
                })

                tableData.map(m => {
                    if (!m.finish) {
                        result = false;
                    }
                })
                console.log(msgList, 'msglist')
                if (msgList.length > 0) {
                    this.$XModal.message({
                        status: 'error',
                        message: () => {
                            return [
                                <div class="red" style="max-height: 400px;overflow: auto;">
                                    {
                                        msgList.map(msg => <div>{msg}</div>)
                                    }
                                </div>
                            ]
                        }
                    })
                    return false;
                }
                return result;
            },
            // 获取展示的数据
            getVisibleData() {
                return this.$refs.xGrid.getTableData().visibleData;
            },
            getUpdateJfwData() {
                let {fullData} = this.$refs.xGrid.getTableData()
                fullData.forEach(element => {
                    this.saveData.push({
                        xtfjDto: {
                            filename: element.filename,
                            filecode: element.filecode,
                            fileDateCreate: element.fileDateCreate,
                            fileSize: element.fileSize,
                            dataid: element.dataid
                        },
                        cgydDto: element
                    })
                });
                return this.saveData;
            },
            handleTable() {
                this.$nextTick(() => {
                    this.$refs.xGrid.recalculate();
                })
            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {
                    filename: file.name,
                    fileSize: file.size,
                    dataid: response.data,
                    dataSecretLevcode: response.securityLevel
                };
                let currentRow = this.$refs.xGrid.getCurrentRow()
                currentRow.filename = file.name
                currentRow.fileSize = file.size
                currentRow.dataid = fileId;
                currentRow.filelevel = response.securityLevel;
                this.$refs.fileUpload.reset();
                this.$message.success('上传成功！');

            },
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            async fjProcess() {
                let records = this.$refs.xGrid.getSelectRecords()
                if (!records || records.length == 0) {
                    this.$message.warning("请选择要审批的附件！")
                    return
                }
                let isAudit = true;
                let rowNum = [];
                records.map((r, i) => {
                    if (r.issq == whether.IS_NO || r.spzt == SPZT.YSP || r.spzt == SPZT.SPZ || !r.dataSecretLevcode || (r.wbsCgydJf && r.wbsCgydJf.length <= 0)) {
                        let index = this.$refs.xGrid.getRowIndex(r);
                        isAudit = false;
                        rowNum.push(index + 1);
                    }
                })
                if (!isAudit) {
                    let msg = "第" + rowNum.join(',') + "条数据不满足审批条件";
                    let msgList = [msg];

                    this.$XModal.message({
                        status: 'error',
                        message: () => {
                            return [
                                <div class="red" style="max-height: 400px;overflow: auto;">
                                    {
                                        msgList.map(msg => <div>{msg}</div>)
                                    }
                                </div>
                            ]
                        }
                    })
                    return;
                }

                console.log(records);

                //const saveData = this.getUpdateJfwData ()
                /*await this.$axios.post("/pms/PmsWbsCgydJf/saveJfw", {$json: {oid_rw: this.oid_rw, insertCgydJfws: saveData, key: 1}})
                                .then(result => {
                                    let { data } = result
                                    this.data = data
                                    console.log(data)
                                    this.closeDialog()
                                })
                                .catch(error => {
                                })
                                .finally(_ => {
                                })*/

                this.closeDialog()
                let cgydIds = []
                records.forEach(record => cgydIds.push(record.oid))
                this.rwdata.cgydList = records;
                this.$router.push({name: '/pms/xmgl/wbsCgydJfFlow', params: {data: JSON.stringify(this.rwdata)}})

            },
            // 保存成果约定
            saveCgyd() {
                // const insertData = this.getInsertData();
                // const updateData = this.getUpdateData();
                const deleteData = this.getDeleteData();
                const visibledata = this.$refs.xGrid.getTableData().visibleData;
                deleteData.map(o => {
                    o.deleteStatus = 1
                })

                let tableData = visibledata.concat(deleteData);

                tableData.map(obj => {
                    let fj = obj.wbsCgydJf;
                    let expandfj = this.$utils.filterTree(fj, item => item, this.treeConfig);
                    expandfj.map(c => {
                        c.oidWbs = obj.oidWbs;
                        c.spzt = obj.spzt ? obj.spzt : SPZT.WSP;
                    })
                    obj.wbsCgydJf = expandfj;

                });
                console.log()
                console.log(tableData, 'tab');
                // return

                this.$refs.xGrid.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$axios.post("/pms/PmsWbsCgyd/saveCgyd", {wbsCgyds: tableData})
                            .then(result => {
                                console.log(result.data)
                                //this.tableData = result.data.wbsCgyds
                                this.$message.success('保存成功');
                                this.refreshCgydTable();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false;
                            })
                    }
                })
            },

            refreshCgydTable() {
                this.$axios.get("/pms/PmsWbsCgyd/getByWbsId", {params: {oidWbs: this.rwdata.oid}})
                    .then(result => {
                        this.tableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询成果约定失败")
                    })
                    .finally(_ => {

                    })
            },

            selectDeliver() {
                this.visibleDeliver = true;
            },

            fatherMethod(row) {
                console.log(row)
                this.visibleDeliver = false;
                let currentRow = this.$refs.xGrid.getCurrentRow()
                console.log(currentRow)
                currentRow.filename = row[0].name
                //currentRow.fileSize = file.size
                currentRow.dataid = row[0].stateOid;
                currentRow.filelevel = row[0].dataSecretLevcode;
            },
            resize() {
                this.$nextTick(() => {
                    this.$refs.xGrid.recalculate();
                })
            }
        },
        components: {
            DocSearchForMultiple,
            IceSelect,
            accessory
        }
    }
</script>

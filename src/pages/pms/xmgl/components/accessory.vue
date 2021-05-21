<template>
    <!-- 附件上传列表 -->
    <div>
        <div style="display: flex; flex-direction: row" v-if="isHandleer">
            <ice-single-upload :on-success="fileUploadSuccess" :doSecret="true" ref="fileUpload"
                               v-bind="$attrs"></ice-single-upload>
            <el-button type="danger" @click="removeEvent" style="margin-left: 10px;">删除</el-button>
            <el-button type="primary" @click="selectDeliver">上传设计文档</el-button>
        </div>
        <vxe-table border show-overflow
                   resizable
                   ref="attaTable"
                   :height="Height"
                   :data="list"
                   :tree-config="treeConfig"
                   width="100%">
            <vxe-table-column type="checkbox" width="50" v-if="isHandleer"></vxe-table-column>
            <vxe-table-column type="index" title="序号" width="100" tree-node></vxe-table-column>
            <vxe-table-column field="filename" title="文件名称" show-overflow="title"></vxe-table-column>
            <vxe-table-column field="filecode" title="文件编码"></vxe-table-column>
            <vxe-table-column field="fileSize" title="文件大小">
                <template v-slot="{ row }">
                    <span>{{row.fileSize?(row.fileSize/1024).toFixed(2)+'kb':''}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="createDate" title="上传日期">
            </vxe-table-column>
            <vxe-table-column field="fileLylx" width="150" show-overflow="title" title="文件来源"
                              :cell-render="{name:'mapTypeCode',mapTypeCode:'FILE_LY_SYS'}"></vxe-table-column>
            <vxe-table-column field="dataSecretLevcode" title="密级"
                              :cell-render="{name:'mapTypeCode',mapTypeCode:'DATA_SECRET_LEVEL'}"></vxe-table-column>
            <vxe-table-column field="operator" title="操作" width="15%">
                <template v-slot="{ row }">
                    <template>
                        <el-button type="text" @click="downloadFile(row)">下载</el-button>
                        <el-button type="text" @click="lookFile(row)">查看</el-button>
                    </template>
                </template>
            </vxe-table-column>
        </vxe-table>

        <ice-dialog :title="'选择设计文档'+'['+rwdata.xmname+']'" :visible.sync="visibleDeliver" width="1000px">
            <doc-search-for-multiple @fatherMethod="fatherMethod" ref="searchsj"
                                     :rwdata="rwdata"></doc-search-for-multiple>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleSectDoc">确认</el-button>
                <el-button type="info" @click="visibleDeliver=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>
<script>

    import IceSingleUpload from "@/components/common/base/IceSingleUpload";
    import DocSearchForMultiple from "../../common/docSearchForMultiple";
    import moment from 'moment'
    import docConstants from '../../../../utils/docConstants'


    export default {
        name: "accessory",
        components: {IceSingleUpload, DocSearchForMultiple},
        mixins: [docConstants],
        data() {
            return {
                moment: moment,
                visibleDeliver: false,
                sectDoc: [],
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    indent: '10',
                    expandAll: true
                },
                tableData: this.row.wbsCgydJf ? this.row.wbsCgydJf : [],
                removeList: [],

            }
        },
        created() {
            console.log(this.rwdata, '加载次数');
        },
        methods: {
            handleSectDoc() {
                let docdata = this.sectDoc;
                let arr = [];
                docdata.forEach(c => {
                    let main = c.mainContent ? c.mainContent : null;
                    let min = c.minContent ? c.minContent : [];
                    if (main) {
                        main.map(m => {
                            m.docOid = c.oid;
                            m.filename = m.name;
                            m.fileSize = m.size;
                            m.dataid = m.dataid;
                            m.dataSecretLevcode = m.dataSecretLevcode;
                            m.fileLylx = 'PDM';
                            m.createDate = null;
                            min.map(p => {
                                p.docOid = c.oid;
                                p.pid = m.dataid;
                                p.filename = p.name;
                                p.fileSize = p.size;
                                p.dataid = p.dataid;
                                p.dataSecretLevcode = p.dataSecretLevcode;
                                p.fileLylx = 'PDM',
                                    p.createDate = null;
                            })
                            m.children = min
                        })
                        arr = [...arr, ...main];
                    }
                })
                console.log(arr)
                // arr.forEach(c => {
                //     this.insertData(c);
                // })
                this.tableData = [...arr, ...this.tableData];
                this.visibleDeliver = false;
                this.dataChange();
            },
            fatherMethod(row) {
                this.sectDoc = row;
                return

            },
            selectDeliver() {
                this.visibleDeliver = true;
                this.$nextTick(_ => {
                    if (this.$refs.searchsj.$refs.searchsj) {
                        this.$refs.searchsj.$refs.searchsj.refresh();
                    }

                })

            },
            removeEvent() {
                let xTree = this.$refs.attaTable
                let removeRecords = xTree.getCheckboxRecords()
                if (removeRecords && removeRecords.length <= 0) {
                    this.$message.error('请选择上传附件！');
                    return
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeRecords.forEach(row => {
                        let matchObj = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
                        if (matchObj) {
                            let {items, index} = matchObj
                            // 从树节点中移除
                            let restRow = items.splice(index, 1)[0]
                            if (restRow.oid) {
                                this.removeList.push(restRow)
                            }
                            this.dataChange();
                        }
                    })
                }).catch(() => {
                    console.log('取消成功')
                })
            },

            fileUploadSuccess(response, file) {
                // 获取表格数据
                let tabData = this.$refs.attaTable.getTableData().visibleData;
                console.log(tabData, 'tabData')
                let fileNames = tabData.map(c => {
                    this.$refs.fileUpload.reset();
                    return c.filename;
                })
                if (fileNames.indexOf(file.name) >= 0) {
                    this.$message.error('上传了重复文件!');
                    return
                }
                let fileId = response.data;
                let dataSecretLevcode = response.securityLevel;
                let record = {
                    filename: file.name,
                    fileSize: file.size,
                    dataid: fileId,
                    dataSecretLevcode: dataSecretLevcode,
                    fileLylx: 'PMS_WBS'
                };
                this.$refs.fileUpload.reset();
                this.tableData = [record, ...this.tableData];
                this.dataChange();
            },
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            resize() {
                this.$nextTick(() => {
                    this.$refs.attaTable.recalculate();
                })
            },
            // 数据变化
            dataChange() {
                this.removeList.map(c => {
                    c.vision = -1;
                })
                let obj = {
                    row: this.row,
                    fj: [...this.tableData, ...this.removeList]
                }
                this.$emit('change', obj)
            }
        }
        ,
        computed: {
            list() {
                console.log(this.tableData, 'tab')
                // 获取有pid 的附件
                this.tableData.map((c, i) => {
                    if (c.pid) {
                        let obj = this.tableData.splice(i, 1);
                        let row = this.tableData.filter(p => {
                            return p.dataid === c.pid
                        })
                        console.log(row, 'row')
                        row[0]['children'] = row[0]['children'] ? [...row[0]['children'], ...obj] : [...obj];
                    }
                })

                return this.tableData.filter(c => {
                    return c.version != -1
                })
            }
        }
        ,
        watch: {
            row() {
                this.tableData = this.row.wbsCgydJf ? this.row.wbsCgydJf : []
            }
        }
        ,
        mounted() {

        }
        ,
        props: {
            data: {
                type: Array,
                default: function () {
                    return []
                }
            },
            Height: {
                default: '200px',
            },
            // 判定是否需要操作按钮。
            isHandleer: {
                default: true,
                type: Boolean
            },
            fun: {
                type: Function
            },
            row: {
                default: function () {
                    return {}
                }
            },
            rwdata: {
                default: function () {
                    return {}
                }
            }
        }
    }

</script>

<style scoped>

</style>
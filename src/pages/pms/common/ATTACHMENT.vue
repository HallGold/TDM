<template>
    <!-- 附件上传列表 -->
    <div>
        <div style="display: flex; flex-direction: row" v-if="isHandleer">
            <ice-single-upload :on-success="fileUploadSuccess" :doSecret="true" ref="fileUpload"
                               v-bind="$attrs"></ice-single-upload>
            <el-button type="danger" @click="deleteAtta" style="margin-left: 10px;">删除</el-button>
            <el-button type="primary" v-if="fun" @click="fun">发起审批</el-button>
        </div>
        <vxe-table border show-overflow
                   :auto-resize=true
                   resizable
                   ref="attaTable"
                   :height="Height"
                   :data="list"
                   width="100%">
            <vxe-table-column type="checkbox" width="50" v-if="isHandleer"></vxe-table-column>
            <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
            <vxe-table-column field="filename" title="文件名称"></vxe-table-column>
            <vxe-table-column field="filecode" title="文件编码"></vxe-table-column>
            <vxe-table-column field="fileSize" title="文件大小">
                <template v-slot="{ row }">
                    <span>{{row.fileSize?(row.fileSize/1024).toFixed(2)+'kb':''}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="createDate" title="上传日期">
                <template v-slot="{ row }">
                    <span>{{row.createDate?moment(row.createDate).format("YYYY-MM-DD"):""}}</span>
                </template>
            </vxe-table-column>
            <vxe-table-column field="sbzt" title="上报状态" v-if="fun"
                              :cell-render="{name:'mapTypeCode',mapTypeCode:'SBZT'}"></vxe-table-column>
            <vxe-table-column field="spzt" title="审批状态" v-if="fun"
                              :cell-render="{name:'mapTypeCode',mapTypeCode:'SPZT'}"></vxe-table-column>
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
    </div>
</template>
<script>

    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import moment from "moment";
    import docConstants from '../../../utils/docConstants'

    export default {
        components: {IceSingleUpload},
        mixins: [docConstants],
        data() {
            return {
                moment: moment
            }
        },
        methods: {
            deleteAtta() {
                let items = this.getSectedItems();
                if (items && items.length <= 0) {
                    this.$message.error('请选择上传附件！');
                    return
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.attaTable.removeSelecteds();
                    this.$nextTick(_ => {
                        this.$emit('change', this.$refs.attaTable.getTableData().visibleData)
                    })
                }).catch(() => {
                    console.log('取消成功')
                })

            },
            // 获取选中
            getSectedItems() {
                return this.$refs.attaTable.getCheckboxRecords()
            },

            fileUploadSuccess(response, file) {
                // 获取表格数据
                let tabData = this.$refs.attaTable.getTableData().visibleData;
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
                    dataSecretLevcode: dataSecretLevcode
                };
                this.$refs.fileUpload.reset();
                this.$refs.attaTable.insertAt(record, -1)
                    .then(({row}) => this.$refs.attaTable.setActiveCell(row));

                this.$nextTick(_ => {
                    this.$emit('change', this.$refs.attaTable.getTableData().visibleData)
                })
            },

            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            /**
             * 获取附件列表数据
             * @returns {Buffer | * | * | * | T[] | string | T[]}
             */
            getData() {
                if (this.isXmFj) {
                    let removeAttaData = this.$refs.attaTable.getRemoveRecords();
                    let tabledata = this.$refs.attaTable.getTableData().visibleData;
                    removeAttaData.map(o => {
                        o.version = -1
                    });
                    return tabledata.concat(removeAttaData);
                }
                let insertAttaData = this.$refs.attaTable.getInsertRecords();
                let removeAttaData = this.$refs.attaTable.getRemoveRecords();
                let updateAttaData = this.$refs.attaTable.getUpdateRecords();
                removeAttaData.map(o => {
                    o.version = -1
                });

                return insertAttaData.concat(removeAttaData, updateAttaData);
            },
            // 获取展示数据
            getVisibleData() {
                return this.$refs.attaTable ? this.$refs.attaTable.getTableData().visibleData : [];
            },

            getVisibleDataAndDelData() {
                let removeAttaData = JSON.parse(JSON.stringify(this.$refs.attaTable.getRemoveRecords()));
                let tabledata = this.$refs.attaTable.getTableData().visibleData;
                removeAttaData.map(o => {
                    o.version = -1
                });
                removeAttaData = removeAttaData.concat(this.initdel);
                return tabledata.concat(removeAttaData);
            },
            //获取所有
            getFullData() {
                let {fullData} = this.$refs.attaTable.getTableData()
                return fullData
            },
            resize() {
                this.$nextTick(() => {
                    this.$refs.attaTable.recalculate();
                })
            }
        }
        ,
        computed: {
            list() {
                return this.data ? this.data.filter(c => {
                    return c.version != -1
                }) : []
            },
            // 初始化数据是，拿出删除的数据
            initdel() {
                return this.data.filter(c => {
                    return c.version == -1
                })
            }
        }
        ,
        watch: {
            data() {
                console.log(this.data, 'data')
            }
        }
        ,
        mounted() {

        }
        ,
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
            fun: {
                type: Function
            },
        }
    }

</script>

<style scoped>

</style>
<template>
    <div>
        <el-dialog v-dialogDrag
                   :title="PAGE_ENUMS.PAGE_TITLE"
                   width="30%"
                   custom-class="edit-dialog"
                   :modal-append-to-body="false"
                   :visible.sync="dialogVisible"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false">
            <ice-excel-uploader :service="PAGE_ENUMS.REFS.UPLOAD_COM.SERVICE" module="biz"
                                :ref="PAGE_ENUMS.REFS.UPLOAD_COM.REF">
            </ice-excel-uploader>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureClick">确 定</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import devComm from "@/pages/biz/dev/js/comm/devComm";

    export default {
        name: "devUploader",
        components: {IceExcelUploader},
        mixins: [devComm],
        props: {
            //设备大类
            categoryType: {
                type: Number,
                required: true
            },
            //页面关闭的回调
            onCloseHandler: {
                type: Function,
                default: () => {
                    return Promise.resolve();
                }
            }
        },
        data() {
            return {
                PAGE_ENUMS: {
                    REFS: {
                        UPLOAD_COM: {
                            REF: "upload", SHOW: false, SERVICE: ""
                        },
                        UPLOAD: {
                            SYSTEM: {//应用系统
                                REF: "systemUpload",
                                SHOW: false,
                                SERVICE: "devSystemExcelUploadServiceImpl",
                                NAME: "应用系统",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE;
                                }
                            },
                            PC: {//服务器与计算机
                                REF: "pcUpload",
                                SHOW: false,
                                SERVICE: "devPcExcelUploadServiceImpl",
                                NAME: "服务器与计算机",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PC.CODE;
                                }
                            },
                            NET: {//网络设备
                                REF: "netUpload",
                                SHOW: false,
                                SERVICE: "devNetExcelUploadServiceImpl",
                                NAME: "网络设备",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.NET.CODE;
                                }
                            },
                            STORAGE_DEV: {//存储与备份设备
                                REF: "storageDevUpload",
                                SHOW: false,
                                SERVICE: "devStorageExcelUploadServiceImpl",
                                NAME: "存储与备份设备",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_DEV.CODE;
                                }
                            },
                            PRODUCT: {//安全保密产品
                                REF: "productUpload",
                                SHOW: false,
                                SERVICE: "devProductExcelUploadServiceImpl",
                                NAME: "安全保密产品",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PRODUCT.CODE;
                                }
                            },
                            STORAGE_MEDIA: {//存储介质
                                REF: "storageMediaUpload",
                                SHOW: false,
                                SERVICE: "devStodrageMediaExcelUploadServiceImpl",
                                NAME: "存储介质",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_MEDIA.CODE;
                                }
                            },
                            EQUIPMENT: {//外部设施与办公自动化设备
                                REF: "equipmentUpload",
                                SHOW: false,
                                SERVICE: "devEquipmentExcelUploadServiceImpl",
                                NAME: "外部设施与办公自动化设备",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.EQUIPMENT.CODE;
                                }
                            },
                            MEDIA: {//声像设备
                                REF: "mediaUpload",
                                SHOW: false,
                                SERVICE: "devMediaExcelUploadServiceImpl",
                                NAME: "声像设备",
                                TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.MEDIA.CODE;
                                }
                            }
                        },
                    },
                    PAGE_TITLE: ""
                },
                //页面显示状态
                dialogVisible: false,
            }
        },
        methods: {
            /**
             * 打开窗口
             */
            openDialog() {
                this.dialogVisible = true;
            },
            /**
             * 关闭窗口
             */
            closeDialog() {
                this.onCloseHandler().then(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 确定按钮响应事件
             */
            sureClick() {
                this.$refs.refBizGrid.refresh();
            },
            /**
             * 初始化导入打开的页面
             */
            initUploadType() {
                if (!!this.categoryType) {
                    for (let i in this.PAGE_ENUMS.REFS.UPLOAD) {
                        let _upload = this.PAGE_ENUMS.REFS.UPLOAD[i];
                        if (_upload.TYPE_CODE() == this.categoryType) {
                            this.PAGE_ENUMS.REFS.UPLOAD_COM.SERVICE = _upload.SERVICE;
                            this.PAGE_ENUMS.PAGE_TITLE = _upload.NAME + "导入";
                            break;
                        }
                    }
                }
            }
        },
        mounted() {
            this.initUploadType();
        }
    }
</script>

<style lang="less" scoped>
    @import "style/edit.less";
</style>
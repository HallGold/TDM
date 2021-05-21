<template>
    <div style="width:100%;height: 120px;overflow-y: auto">
        <ice-multiple-upload :doSecret="true" :disabled="!isEdit" @change="change"
                             :value="fileIds"></ice-multiple-upload>
    </div>
</template>

<script>
    import IceMultipleUpload from "@/components/common/base/IceMultipleUpload";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";

    export default {
        name: "uploadAttachment",
        components: {IceMultipleUpload},
        mixins: [bizComm, devComm],
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
            fileInfo: {
                type: [Object, Array],
                default: () => {
                }
            },
            childType: {
                type: String,
                default: ""
            },
            removeCallBack: {
                type: Function,
                default: (file) => {
                    return Promise.resolve();
                }
            },
            uploadSuccess: {
                type: Function
            },
            devId: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {UPLOAD_TABLE: {REF: "uploadTable"}}
                },
            };
        },
        methods: {
            /**
             * 上传完成的回调
             * @param fileIds 文件id数组
             */
            change(fileIds, {removedFileId, fileNames}) {
                if (!!removedFileId) {
                    //删除文件
                    this.axios(this.ENUMS.ACTIONS.REMOVE_FILE, {fileId: removedFileId}, [res => {
                        if (res.data) {
                            this.$message.success("文件已删除!");
                            this.$props.uploadSuccess(this.assembleFileArray(fileIds, fileNames), this.childType);
                        } else {
                            this.$message.error("文件删除失败!");
                        }
                    }, res => {
                        this.$message.error("文件删除失败!");
                    }]);
                } else {
                    //上传文件
                    this.$props.uploadSuccess(this.assembleFileArray(fileIds, fileNames), this.childType);
                }
            },
            /**
             * 组装文件数组
             */
            assembleFileArray(ids, fileNames) {
                let fileArr = [];
                for (let i = 0; i < ids.length; i++) {
                    fileArr.push({
                        fileId: ids[i],//文件id
                        fileName: fileNames[i],
                        objectId: this.devId,
                        childType1: this.childType
                    });
                }
                return fileArr;
            }
        },
        computed: {
            fileIds() {
                let array = [];
                let _this = this;
                this.fileInfo.forEach(file => {
                    if (_this.childType == file.childType1) {
                        array.push(file.fileId);
                    }
                });
                return array;
            }
        },
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";
</style>
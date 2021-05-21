<template>
    <div style="width:100%;height: 120px;overflow-y: auto">
        <ice-multiple-upload :doSecret="true" :disabled="readonly" @change="change"
                             :value="fileIds"></ice-multiple-upload>
    </div>
</template>

<script>
    import IceMultipleUpload from "@/components/common/base/IceMultipleUpload";
    import bizComm from "@/pages/biz/js/comm";

    export default {
        name: "uploadAttachment",
        components: {IceMultipleUpload},
        mixins: [bizComm],
        props: {
            readonly: {
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
            //文件删除完成后的业务回调处理方法
            removeCallBack: {
                type: Function,
                default: ({fileId}) => {
                    return Promise.resolve();
                }
            },
            //文件更新完成后的业务回调处理方法
            changeSuccessHandler: {
                type: Function
            },
            objId: {
                type: String,
                default: ""
            }
        },
        methods: {
            /**
             * 上传完成的回调
             * @param fileIds 文件id数组
             */
            change(fileIds, {removedFileId, fileNames}) {
                if (!!removedFileId) {
                    let _this = this;
                    //删除文件
                    this.$props.removeCallBack({fileId: removedFileId}).then(_this.$props.changeSuccessHandler(_this.assembleFileArray(fileIds, fileNames), _this.childType));
                } else {
                    //上传文件
                    this.$props.changeSuccessHandler(this.assembleFileArray(fileIds, fileNames), this.childType);
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
                        objectId: this.objId,
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
        }
    }
</script>

<style lang="less" scoped>
</style>
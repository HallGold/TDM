<template>
    <div class="ice-full-relative">
        <div class="ice-full-absolute devManage">
            <el-table :data="tableData"
                      border
                      height="100%">
                <el-table-column prop="softwareNo"
                                 label="软件识别编号">
                </el-table-column>
                <el-table-column prop="capacity"
                                 label="容量">
                </el-table-column>
                <el-table-column prop="license"
                                 v-if="isLicense"
                                 label="许可序列号">
                </el-table-column>
                <el-table-column prop="reFileVoList"
                                 v-if="isLicenseFile"
                                 label="许可附件">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.reFileVoList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.childType1==ENUMS.ATTACHMENT_MAP.dev_xkwj?item.fileName:''}}
                                        </div>
                                        <span v-if="item.childType1==ENUMS.ATTACHMENT_MAP.dev_xkwj"
                                              style="color: #222222;display: inline-block">{{item.sn}}.
                                            <a class="ell_cls"
                                               :style="(new Date().getTime()<new Date(scope.row.validDate).getTime())?{color: '#00bfff'}:{color: '#ff0000'}"
                                               @click="fileItem(item.fileId)">{{item.fileName}}</a>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="validDate"
                                 v-if="isValidDate"
                                 label="许可有效期">
                    <template slot-scope="scope">
                        {{scope.row.validDate?(scope.row.validDate.length>10?scope.row.validDate.substring(0,11):scope.row.validDate):''}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import bizComm from "@/pages/biz/js/comm";
    import permissionPropComm from "@/pages/biz/dev/js/comm/permissionPropComm.js"

    export default {
        name: "manage",
        mixins: [bizComm, permissionPropComm,devComm],
        props: {
            devId:{//传进来的Id
                type:String,
                default:''
            },
        },
        watch: {
            devId: {
                handler(newValue, OldValue) {
                    this.getFormatData(newValue);
                },
            }
        },
        data() {
            return {
                tableData: [{
                    softwareNo: '',
                    capacity: '',
                    licenseType: '',
                    license: '',
                    licenseFile: '',
                    validDate: '',
                    reFileVoList:[]
                }]
            }
        },
        methods: {
            /**
             * 文件下载
             */
            fileItem(fileId){
                this.$downloadFile(fileId);
            },
            /**
             * 数据格式化
             */
            dataFormat(data) {
                if(data.dataDTO.extendData){
                    this.tableData[0].softwareNo = data.dataDTO.extendData.softwareNo ? data.dataDTO.extendData.softwareNo : '';
                    this.tableData[0].capacity = data.dataDTO.extendData.capacity ? data.dataDTO.extendData.capacity : '';
                    this.tableData[0].licenseType = data.dataDTO.extendData.licenseType ? data.dataDTO.extendData.licenseType : '';
                    this.tableData[0].license = data.dataDTO.extendData.license ? data.dataDTO.extendData.license : '';
                    this.tableData[0].licenseFile = data.dataDTO.extendData.licenseFile ? data.dataDTO.extendData.licenseFile : '';
                    this.tableData[0].validDate = data.dataDTO.extendData.validDate ? data.dataDTO.extendData.validDate : '';
                }
                this.addSnForFiles(data.reFileVoList);
                this.tableData[0].reFileVoList = data.reFileVoList?data.reFileVoList:[];
            },
            /**
             * 根据id将获得的数据格式化
             * @param devId
             */
            getFormatData(devId) {
                this.tableData = [
                    {
                        softwareNo: '',
                        capacity: '',
                        licenseType: '',
                        license: '',
                        licenseFile: '',
                        validDate: ''
                    }
                ];
                this.loadDevById(devId).then(res => {
                    this.dataFormat(res);
                    this.$nextTick(() => {
                        this.initFileInfo(this.tableData[0]);
                        this.$nextTick(_=>{
                            this.$refs.eltable.doLayout()
                        })
                    })
                });
            }
        },
        mounted() {
            this.getFormatData(this.devId);
        }
    }
</script>

<style scoped>
    .outer {
        display: block;
        width: 100%;
        height: 117px;
        position: relative;
        /*overflow: hidden;
        margin-left: -20px;*/
    }

    .inner {
        position: absolute;
        right: -20px;
        top: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ell_cls{
        text-decoration: underline;
        color: deepskyblue;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 100px;
        height: 16px;
        cursor: pointer
    }
</style>
<style lang="less">
    .devManage > .el-table {
        .el-table__body .cell {
            height: 117px;
        }
    }

</style>
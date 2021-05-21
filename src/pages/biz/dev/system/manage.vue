<template>
    <div class="ice-full-relative">
        <div class="ice-full-absolute devManage">
            <el-table :data="tableData"
                      border
                      ref="eltable"
                      height="100%">
                <el-table-column prop="deployMode"
                                 label="部署模式">
                    <template slot-scope="scope">
                        {{getNameByCode(ENUMS.DEPLOY_MODE_DATA,scope.row.deployMode)}}
                    </template>
                </el-table-column>
                <el-table-column prop="dutyName"
                                 label="业务联系人">
                </el-table-column>
                <el-table-column prop="dutyPhone"
                                 width="120px"
                                 label="业务联系电话">
                </el-table-column>
                <el-table-column prop="deptName"
                                 width="110"
                                 label="业务主管部门">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                {{scope.row.deptName}}
                            </div>
                            <a class="ell_tbl">{{scope.row.deptName}}</a>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="sysManager"
                                 label="系统管理员">
                </el-table-column>
                <el-table-column prop="authManager"
                                 label="安全管理员">
                </el-table-column>
                <el-table-column prop="auditManager"
                                 label="审计管理员">
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
                <el-table-column prop="reFileVoList"
                                 v-if="isCheckResultFile"
                                 label="评测结论">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.reFileVoList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.childType1==ENUMS.ATTACHMENT_MAP.dev_cpjl?item.fileName:''}}
                                        </div>
                                        <span v-if="item.childType1==ENUMS.ATTACHMENT_MAP.dev_cpjl"
                                              style="color: #222222;display: inline-block">{{item.sn}}.
                                            <a class="ell_cls" @click="fileItem(item.fileId)">{{item.fileName}}</a>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="reFileVoList"
                                 v-if="isCheckReportFile"
                                 label="测评报告">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.reFileVoList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.childType1==ENUMS.ATTACHMENT_MAP.dev_cpbg?item.fileName:''}}
                                        </div>
                                        <span v-if="item.childType1==ENUMS.ATTACHMENT_MAP.dev_cpbg"
                                              style="color: #222222;display: inline-block">{{item.sn}}.
                                            <a class="ell_cls" @click="fileItem(item.fileId)">{{item.fileName}}</a>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
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
        name: "manger",
        mixins: [bizComm, permissionPropComm, devComm],
        props: {
            devId: {//传进来的Id
                type: String,
                default: ''
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
                    deployMode: '',
                    dutyName: '',
                    dutyPhone: '',
                    deptName: '',
                    sysManager: '',
                    authManager: '',
                    auditManager: '',
                    licenseType: '',
                    license: '',
                    licenseFile: '',
                    validDate: '',
                    isCheckResultFile: '',
                    isCheckReportFile: '',
                    passOfflineValid: false,
                    reFileVoList: []
                }]
            }
        },
        methods: {
            /**
             * 文件下载
             */
            fileItem(fileId) {
                this.$downloadFile(fileId);
            },
            /**数据格式化*/
            dataFormat(data) {
                if (data.dataDTO.extendData) {
                    this.tableData[0].deployMode = data.dataDTO.extendData.deployMode ? data.dataDTO.extendData.deployMode : '';
                    this.tableData[0].licenseType = data.dataDTO.extendData.licenseType ? data.dataDTO.extendData.licenseType : '';
                    this.tableData[0].license = data.dataDTO.extendData.license ? data.dataDTO.extendData.license : '';
                    this.tableData[0].licenseFile = data.dataDTO.extendData.licenseFile ? data.dataDTO.extendData.licenseFile : '';
                    this.tableData[0].validDate = data.dataDTO.extendData.validDate ? data.dataDTO.extendData.validDate : '';
                    this.tableData[0].isCheckResultFile = data.dataDTO.extendData.isCheckResultFile ? data.dataDTO.extendData.isCheckResultFile : '';
                    this.tableData[0].isCheckReportFile = data.dataDTO.extendData.isCheckReportFile ? data.dataDTO.extendData.isCheckReportFile : '';
                    this.tableData[0].passOfflineValid = data.dataDTO.extendData.passOfflineValid ? data.dataDTO.extendData.passOfflineValid : false;
                }
                if (data.dataDTO.commDTO) {
                    this.tableData[0].dutyName = data.dataDTO.commDTO.dutyName ? data.dataDTO.commDTO.dutyName : '';
                    this.tableData[0].dutyPhone = data.dataDTO.commDTO.dutyPhone ? data.dataDTO.commDTO.dutyPhone : '';
                    this.tableData[0].deptName = data.dataDTO.commDTO.deptName ? data.dataDTO.commDTO.deptName : '';
                }
                if (data.dataDTO.dutyDTOList && data.dataDTO.dutyDTOList.length > 0) {
                    data.dataDTO.dutyDTOList.forEach(item => {
                        if (item.userType == this.ENUMS.MANAGER_TYPE_DATA.SYSTEM) {
                            this.tableData[0].sysManager = item.userName
                        }
                        if (item.userType == this.ENUMS.MANAGER_TYPE_DATA.AUTH) {
                            this.tableData[0].authManager = item.userName
                        }
                        if (item.userType == this.ENUMS.MANAGER_TYPE_DATA.AUDIT) {
                            this.tableData[0].auditManager = item.userName
                        }
                    });
                }
                this.addSnForFiles(data.reFileVoList);
                this.tableData[0].reFileVoList = data.reFileVoList ? data.reFileVoList : [];
            },
            /**
             * 根据id将获得的数据格式化
             * @param devId
             */
            getFormatData(devId) {
                this.tableData = [
                    {
                        deployMode: '',
                        dutyName: '',
                        dutyPhone: '',
                        deptName: '',
                        sysManager: '',
                        authManager: '',
                        auditManager: '',
                        licenseType: '',
                        license: '',
                        licenseFile: '',
                        validDate: '',
                        isCheckResultFile: '',
                        isCheckReportFile: '',
                        passOfflineValid: false
                    }
                ];
                this.loadDevById(devId).then(res => {
                    this.dataFormat(res);

                    this.$nextTick(() => {
                        this.initFileInfo(this.tableData[0]);
                        this.$nextTick(()=>{
                            this.$refs.eltable.doLayout();
                        });
                    })
                });
            }
        },
        mounted() {
            //初始化部署模式,文件类别
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE,
                this.ENUMS.DATA_DICTIONARY.ATTACHMENT_TYPE.CODE).then(this.getFormatData(this.devId));
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

    .ell_cls {
        text-decoration: underline;
        color: deepskyblue;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 75px;
        height: 16px;
        cursor: pointer
    }
    .ell_tbl{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        height: 16px;
        padding-bottom: 8px;
    }
</style>

<style lang="less">
    .devManage > .el-table {
        .el-table__body .cell {
            height: 117px;
        }
    }

</style>
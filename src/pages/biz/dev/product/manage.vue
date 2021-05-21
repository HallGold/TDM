<template>
    <div class="ice-full-relative">
        <div class="ice-full-absolute devManage">
            <el-table :data="tableData"
                      border
                      ref="eltable"
                      height="100%">
                <el-table-column
                        prop="shape"
                        label="设备形态">
                    <template slot-scope="scope">
                        {{onShapeTypeRenderer(scope.row.shape)}}
                    </template>
                </el-table-column>
                <el-table-column prop="checkCertSignName"
                                 label="检测证书">
                </el-table-column>
                <el-table-column prop="checkCertSignCode"
                                 label="检测证书编号">
                </el-table-column>
                <el-table-column prop="checkCertSignDate"
                                 label="证书有效期">
                    <template slot-scope="scope">
                        {{scope.row.checkCertSignDate?(scope.row.checkCertSignDate.length>10?scope.row.checkCertSignDate.substring(0,11):scope.row.checkCertSignDate):''}}
                    </template>
                </el-table-column>
                <el-table-column prop="reFileVoList"
                                 label="检测报告">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.reFileVoList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.childType1==ENUMS.ATTACHMENT_MAP.dev_jcbg?item.fileName:''}}
                                        </div>
                                        <span v-if="item.childType1==ENUMS.ATTACHMENT_MAP.dev_jcbg"
                                              style="color: #222222;display: inline-block">{{item.sn}}.
                                            <a class="ell_cls" @click="fileItem(item.fileId)">{{item.fileName}}</a>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="dependDTOList"
                                 width="190px"
                                 label="关联设备">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.dependDTOList" :key="item.id" style="width: 100%;overflow: hidden">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.dependDevDTO&&item.dependDevDTO.commDTO?item.dependDevDTO.commDTO.name:''}}
                                        </div>
                                        <el-button @click="devIdItem(item)" type="text">
                                            <span style="color: #222222">[{{index+1}}.</span>
                                            <a type="text"class="dependDTOList">
                                                {{item.dependDevDTO&&item.dependDevDTO.commDTO?item.dependDevDTO.commDTO.name:''}}
                                            </a>
                                            <span style="color: #222222">]</span>
                                        </el-button>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="license"
                        v-if="isLicense"
                        label="许可序列号">
                </el-table-column>
                <el-table-column
                        prop="reFileVoList"
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
                <el-table-column
                        prop="validDate"
                        v-if="isValidDate"
                        label="许可有效期">
                    <template slot-scope="scope">
                        {{scope.row.validDate?(scope.row.validDate.length>10?scope.row.validDate.substring(0,11):scope.row.validDate):''}}
                    </template>
                </el-table-column>
            </el-table>
            <dev-edit :dev-id="devIdEdit"
                      :category-type="categoryType"
                      :onCloseHandler="onCloseHandler"
                      v-if="devShow"
                      ref="devEdit"></dev-edit>
        </div>

    </div>
</template>

<script>
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import bizComm from "@/pages/biz/js/comm";
    import permissionPropComm from "@/pages/biz/dev/js/comm/permissionPropComm.js"
    import IceTableColumn from "@/components/common/base/IceTableColumn";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import DevEdit from "../devEdit";
    export default {
        name: "mangerp",
        components: {DevEdit, IceTableColumn},
        mixins: [bizComm, permissionPropComm,devComm,renderer],
        props:{
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
        data(){
            return{
                tableData:[{
                    shape:'',
                    checkCertSignName:'',
                    checkCertSignCode:'',
                    checkCertSignDate:'',
                    checkReport:'',
                    licenseType:'',
                    license:'',
                    licenseFile:'',
                    validDate:'',
                    dependDTOList:[],
                    reFileVoList:[]
                }],
                devIdEdit:'',       //点击关联设备--打开弹窗需要用到的参数
                categoryType:0,     //点击关联设备--打开弹窗需要用到的参数
                devShow: false,      //是否渲染关联设备
            }
        },
        methods:{
            /**
             * 文件下载
             */
            fileItem(fileId){
                this.$downloadFile(fileId);
            },
            /**关联设备--点击展示*/
            devIdItem(dev) {
                this.devShow = true;
                this.devIdEdit = dev.dependDevId;
                this.categoryType = dev.dependDevType;
                this.$nextTick(() => {
                    this.$refs.devEdit.openDialog();
                });
            },
            /**关联设备--关闭时的回调*/
            onCloseHandler() {
                return new Promise((resolve, reject) => {
                    resolve();
                    this.devShow = false;
                });
            },
            /**数据格式化*/
            dataFormat(data){
                if(data.dataDTO.extendData){
                    this.tableData[0].shape = data.dataDTO.extendData.shape?data.dataDTO.extendData.shape:'';
                    this.tableData[0].checkCertSignName = data.dataDTO.extendData.checkCertSignName?data.dataDTO.extendData.checkCertSignName:'';
                    this.tableData[0].checkCertSignCode = data.dataDTO.extendData.checkCertSignCode?data.dataDTO.extendData.checkCertSignCode:'';
                    this.tableData[0].checkCertSignDate = data.dataDTO.extendData.checkCertSignDate?data.dataDTO.extendData.checkCertSignDate:'';
                    this.tableData[0].checkReport = data.dataDTO.extendData.checkReport?data.dataDTO.extendData.checkReport:'';
                    this.tableData[0].licenseType = data.dataDTO.extendData.licenseType?data.dataDTO.extendData.licenseType:'';
                    this.tableData[0].license = data.dataDTO.extendData.license?data.dataDTO.extendData.license:'';
                    this.tableData[0].licenseFile = data.dataDTO.extendData.licenseFile?data.dataDTO.extendData.licenseFile:'';
                    this.tableData[0].validDate = data.dataDTO.extendData.validDate?data.dataDTO.extendData.validDate:'';
                }
                this.tableData[0].dependDTOList = data.dataDTO.dependDTOList?data.dataDTO.dependDTOList:[];
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
                        shape:'',
                        checkCertSignName:'',
                        checkCertSignCode:'',
                        checkCertSignDate:'',
                        checkReport:'',
                        licenseType:'',
                        license:'',
                        licenseFile:'',
                        validDate:'',
                        dependDTOList:[]
                    }
                ];
                let _this = this;
                this.loadDevById(devId).then(res => {
                    _this.dataFormat(res);
                    _this.$nextTick(() => {
                        this.initFileInfo(this.tableData[0]);
                        this.$nextTick(_=>{
                            this.$refs.eltable.doLayout()
                        })
                    })
                });
            }
        },
        mounted() {
            this.requestEnumsShapeTypeData();//初始化设备形态
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
    .dependDTOList{
        text-decoration: underline;
        color: deepskyblue;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ell_cls {
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
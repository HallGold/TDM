<template>
    <div class="ice-full-relative">
        <div class="ice-full-absolute devManage">
            <el-table :data="tableData"
                      border
                      height="100%"
                      show-overflow-tooltip="true">
                <el-table-column
                        :width="300"
                        prop="devPvDTOList"
                        label="规格属性">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.devPvDTOList"
                                  :height="130"
                                  class="devPvDTOList"
                                  :show-header="false">
                            <el-table-column prop="name"></el-table-column>
                            <el-table-column prop="value"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="masterIp"
                                 label="IP地址">
                </el-table-column>
                <el-table-column prop="macIpDTOList"
                                 width="170px"
                                 label="MAC地址">
                    <template slot-scope="scope">
                        <div style="display: block">
                            <div v-for="item in scope.row.macIpDTOList" :key="item.id">
                                <div>
                                    {{item.mac}}
                                    [<span style="color: #85ce61">{{+item.using?'已启用':'未启用'}}</span>]
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="dependDTOList"
                                 width="160px"
                                 label="关联设备">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.dependDTOList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            {{item.dependDevDTO&&item.dependDevDTO.commDTO?item.dependDevDTO.commDTO.name:''}}
                                        </div>
                                        <el-button @click="devIdItem(item)" type="text">
                                            <span style="color: #222222">[{{index+1}}.</span>
                                            <a type="text" class="dependDTOList">
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
                <el-table-column prop="dependDTOList"
                                 label="硬盘序列号">
                    <template slot-scope="scope">
                        <div class="outer">
                            <div class="inner">
                                <div v-for="(item,index) in scope.row.dependDTOList"
                                     :key="item.id"
                                     style="width: 100%;overflow: hidden;margin: 0">
                                    <div v-if="(item.dependDevDTO&&item.dependDevDTO.commDTO)&&(item.dependDevDTO.commDTO.childType=='1501'||'1502'||'1503')">
                                        <el-tooltip placement="top" effect="light">
                                            <div slot="content">
                                                {{item.dependDevDTO.commDTO.devSn? item.dependDevDTO.commDTO.devSn:'' }}
                                            </div>
                                            <div v-if="item.dependDevDTO.commDTO.devSn">
                                                <p class="ell_cls">
                                                    <span style="color: #222222">{{index+1}}.</span>
                                                    {{item.dependDevDTO.commDTO.devSn}}
                                                </p>
                                            </div>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="shape"
                                 label="设备形态">
                    <template slot-scope="scope">
                        {{onShapeTypeRenderer(scope.row.shape)}}
                    </template>
                </el-table-column>
                <el-table-column prop="osVersion"
                                 label="操作系统">
                    <template slot-scope="scope">
                        {{getNameByCode(ENUMS.DEV_VERSION_DATA,scope.row.osVersion)}}
                    </template>
                </el-table-column>
                <el-table-column prop="setupDate"
                                 label="安装日期">
                    <template slot-scope="scope">
                        {{scope.row.setupDate?(scope.row.setupDate.length>10?scope.row.setupDate.substring(0,11):scope.row.setupDate):''}}
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
    import IceTableColumn from "@/components/common/base/IceTableColumn";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import DevEdit from "../devEdit";

    export default {
        name: "manger",
        components: {DevEdit, IceTableColumn},
        props: {
            devId: {//传进来的Id
                type: String,
                default: ''
            },
        },
        mixins: [bizComm, devComm, renderer],
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
                    devPvDTOList: [],
                    masterIp: '',
                    macIpDTOList: [],
                    dependDTOList: [],
                    shape: '',
                    version: '',
                    setupDate: ''
                }],
                devIdEdit: '',       //点击关联设备--打开弹窗需要用到的参数
                categoryType: 0,     //点击关联设备--打开弹窗需要用到的参数
                devShow: false,      //是否渲染关联设备
                devSn:[
                    {code: 1501, name: "磁介质硬盘"},
                    {code: 1502, name: "固态硬盘"},
                    {code: 1503, name: "移动硬盘"}
                    ],
            }
        },
        methods: {
            /**关联设备--点击展示*/
            devIdItem(dev) {
                console.log(dev);
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
            dataFormat(data) {
                if (data.dataDTO.commDTO) {
                    this.tableData[0].masterIp = data.dataDTO.commDTO.masterIp ? data.dataDTO.commDTO.masterIp : '';
                }
                if (data.dataDTO.extendData) {
                    this.tableData[0].shape = data.dataDTO.extendData.shape ? data.dataDTO.extendData.shape : '';
                    this.tableData[0].osVersion = data.dataDTO.extendData.osVersion ? data.dataDTO.extendData.osVersion : '';
                    this.tableData[0].setupDate = data.dataDTO.extendData.setupDate ? data.dataDTO.extendData.setupDate : '';
                }
                this.tableData[0].devPvDTOList = data.dataDTO.devPvDTOList ? data.dataDTO.devPvDTOList : [];
                this.tableData[0].macIpDTOList = data.dataDTO.macIpDTOList ? data.dataDTO.macIpDTOList : [];
                this.tableData[0].dependDTOList = data.dataDTO.dependDTOList ? data.dataDTO.dependDTOList : [];
                this.tableData[0].devPvDTOList = data.dataDTO.devPvDTOList ? data.dataDTO.devPvDTOList : [];


            },
            /**
             * 根据id将获得的数据格式化
             * @param devId
             */
            getFormatData(devId) {
                this.tableData = [
                    {
                        devPvDTOList: [],
                        masterIp: '',
                        macIpDTOList: [],
                        dependDTOList: [],
                        shape: '',
                        osVersion: '',
                        setupDate: ''
                    }
                ];
                this.loadDevById(devId).then(res => {
                    this.dataFormat(res);
                });
            }
        },
        mounted() {
            this.requestEnumsShapeTypeData();//初始化设备形态
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEV_VERSION.CODE);//初始化系统版本
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
        /*right: -20px;*/
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
    .ell_cls{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<style lang="less" >
    .devManage > .el-table {
        .el-table__body .cell {
            height: 117px;
        }
    }
    .devManage .devPvDTOList.el-table {
        .el-table__body .cell {
            height: 27px;
        }
    }

</style>


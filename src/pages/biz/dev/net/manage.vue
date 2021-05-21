<template>
    <div class="ice-full-relative">
        <div class="ice-full-absolute devManage">
            <el-table :data="tableData"
                      border
                      show-overflow-tooltip="true"
                      height="100%">
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
                                 label="MAC地址">
                    <template slot-scope="scope">
                        <div style="display: block">
                            <div v-for="item in scope.row.macIpDTOList" :key="item.id">
                                <div >
                                    {{item.mac}}
                                    [<span style="color: #85ce61">{{+item.using?'已启用':'未启用'}}</span>]
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="dependDTOList"
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
    import DevEdit from "../devEdit";
    export default {
        name: "manger",
        components: {DevEdit},
        mixins: [bizComm,devComm],
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
                    devPvDTOList:[],
                    masterIp:'',
                    macIpDTOList:[],
                    dependDTOList:[]
                }],
                devIdEdit:'',       //点击关联设备--打开弹窗需要用到的参数
                categoryType:0,     //点击关联设备--打开弹窗需要用到的参数
                devShow: false,      //是否渲染关联设备
            }
        },
        methods:{
            /**关联设备--点击展示*/
            devIdItem(dev){
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
            /**
             * 数据格式化
             * */
            dataFormat(data){
                this.tableData[0].devPvDTOList = data.dataDTO.devPvDTOList?data.dataDTO.devPvDTOList:[];
                this.tableData[0].masterIp = data.dataDTO.commDTO.masterIp?data.dataDTO.commDTO.masterIp:'';
                this.tableData[0].macIpDTOList =data.dataDTO.macIpDTOList?data.dataDTO.macIpDTOList:[];
                this.tableData[0].dependDTOList = data.dataDTO.dependDTOList?data.dataDTO.dependDTOList:[];
            },
            /**
             * 根据id将获得的数据格式化
             * @param devId
             */
            getFormatData(devId) {
                this.tableData = [
                    {
                        devPvDTOList:[],
                        masterIp:'',
                        macIpDTOList:[],
                        dependDTOList:[]
                    }
                ];
                this.loadDevById(devId).then(res => {
                    this.dataFormat(res);
                });
            },
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
</style>

<style lang="less">
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
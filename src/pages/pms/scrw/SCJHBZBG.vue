<template>
    <div class="ice-container">
            <el-container style="height: 500px;">
                <el-aside width="250px" style="position: relative;">
                    <div class="treeContainer">
                        <ice-tree load-url="pms/PmsScJh/queryTree"
                                  label-prop="scJhname"
                                  value-prop="oid"
                                  treeWidth="250"
                                  class="tree"
                                  @node-click="nodeClick"
                        >
                            <div style="display: flex;justify-content:space-around" slot="prefix">
                                <el-button icon="el-icon-circle-plus" type="text" style="color: #98FB98" @click="add">
                                    <span style="color: #222222">新增</span>
                                </el-button>
                                <el-button icon="el-icon-edit" type="text" style="color: #4027FF" @click="edit" v-show="visibleEdit">
                                    <span style="color: #222222">编辑</span>
                                </el-button>
                                <el-button icon="el-icon-edit" type="text" style="color: #4027FF" @click="change" v-show="visibleChange">
                                    <span style="color: #222222">变更</span>
                                </el-button>
                                <el-button icon="el-icon-check" type="text" style="color: red" @click="audit">
                                    <span style="color: #222222">审批</span>
                                </el-button>
                            </div>
                        </ice-tree>
                    </div>

                    <pms-project-msg title="计划信息" :label-name="labelName" :msgdata="msgData" :bottom-buttons="bottomButtons"></pms-project-msg>
                </el-aside>
                <el-main style="padding: 0 0 0 5px;overflow: auto;">
                    <div>
                        <SCJH_ITEM :oid-scjh="oidScjh"></SCJH_ITEM>
                    </div>
                </el-main>
            </el-container>
            <ice-dialog title="选择已编制计划" :visible.sync="visiblePlanAudit" width="800px">
                <div style="height: 400px;">
                    <vxe-table border resizable
                               size="small"
                               height="400"
                               auto-resize
                               ref="scjhTable"
                               :data="scjhTableData">
                        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column field="xmname" title="所属项目"  show-overflow="title"></vxe-table-column>
                        <vxe-table-column field="scJhname" title="生产计划" show-overflow="title"></vxe-table-column>
                        <vxe-table-column field="scJhlx" title="计划类型" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'JHLX20'}"></vxe-table-column>
                        <vxe-table-column field="jhzt" title="计划状态" :cell-render="{name: 'mapTypeCode', mapTypeCode: 'JHZT'}"></vxe-table-column>
                        <vxe-table-column field="dataSecretLevcode" title="密级" :cell-render="{name:'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>
                    </vxe-table>
                </div>

                <el-footer>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="confirmAudit">发起审批</el-button>
                        <el-button type="info" @click="back">关闭</el-button>
                    </div>
                </el-footer>
            </ice-dialog>
    </div>
</template>

<script>
    import IceTree from "../../../components/common/base/IceTree";
    import PmsProjectMsg from "../../../components/common/pms/PmsProjectMsg";
    import IceDialog from "../../../components/common/base/IceDialog";
    import SCJH_ITEM from "../common/SCJH_ITEM";
    import { JHZT, SBZT} from "../../../utils/constant";

    export default {
        name: "SCJHBZBG",
        components: {SCJH_ITEM, IceDialog, PmsProjectMsg, IceTree},

        data () {
            return {
                msgData: {},
                tableData: [],
                oidScjh: '',
                selectedOidXm: '',
                selectedXmCode: '',
                selectedXmname: '',

                visibleEdit: false,
                visibleChange: false,
                visiblePlanAudit: false,
                scjhTableData: [],

                DATA_DICT_JHLX: [],
                DATA_DICT_JHZT: [],
                DATA_DICT_JJCD: [],
                DATA_DICT_DATASECRET: [],

                bottomButtons: [],
                oidBpm: '',
            }
        },

        methods: {
            add () {
                this.$router.push({ path: '/pms/scrw/scjh_flow'});
                /*if (this.selectedOidXm) {
                    this.$router.push({ path: '/pms/scrw/scjh_flow', query: {oidXm: this.selectedOidXm, xmcode: this.selectedXmCode, xmname: this.selectedXmname}});
                }else{
                    this.$router.push({ path: '/pms/scrw/scjh_flow'});
                }*/
            },

            edit () {
                if (this.msgData) {
                    //this.$router.push({ path: '/pms/scrw/scjhbz', query: { oid: this.msgData.oid }});
                    this.$router.push({ path: '/pms/scrw/scjh_flow', query: { oid: this.msgData.oid, dataId: this.msgData.oid}});
                }
            },

            change () {
                if (this.msgData) {
                    this.$router.push({ path: '/pms/scrw/scjh_flow', query: { oid: this.msgData.oid, isChange: 1}});

                }
            },

            audit () {
                this.visiblePlanAudit = true;

                this.$axios.get("/pms/PmsScJh/listByParams")
                    .then(result => {
                        this.scjhTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询生产计划列表失败")
                    })
                    .finally(_ => {

                    })
            },

            nodeClick (id, row) {
                console.log(row)
                if(row.data.type == '0'){ // 选中的是项目
                    this.msgData = {};
                    this.selectedOidXm = row.data.oid;
                    this.selectedXmCode = row.data.scJhcode;
                    this.selectedXmname = row.data.scJhname;
                }else{ // 选中的是计划
                    this.selectedOidXm = row.parent.data.oid;
                    this.selectedXmname = row.parent.data.scJhname;
                    this.msgData = row.data;
                    this.oidScjh = row.data.oid;
                    if (this.msgData.jhzt == JHZT.WKS && this.msgData.sbzt == SBZT.WSB) {
                        this.visibleEdit = true;
                        this.visibleChange = false;
                    } else if (this.msgData.jhzt == JHZT.JXZ) {
                        this.visibleChange = true;
                        this.visibleEdit = false;
                    } else {
                        this.visibleChange = false;
                        this.visibleEdit = false;
                    }

                    if (this.msgData.oidBpm) {
                        this.oidBpm = this.msgData.oidBpm;
                        this.bottomButtons = [
                            {
                                text: '查看流程',
                                callback: this.showFlow,
                            }
                        ];
                    } else {
                        this.bottomButtons = [];
                    }

                    this.DATA_DICT_JHLX.map(o => {
                        if (o.code == this.msgData.scJhlx) {
                            this.msgData.scJhlxName = o.name;
                        }
                    })
                    this.DATA_DICT_JHZT.map(o => {
                        if (o.code == this.msgData.jhzt) {
                            this.msgData.jhztName = o.name;
                        }
                    })
                    this.DATA_DICT_JJCD.map(o => {
                        if (o.code == this.msgData.jjcd) {
                            this.msgData.jjcdName = o.name;
                        }
                    })
                    this.DATA_DICT_DATASECRET.map(o => {
                        if (o.code == this.msgData.dataSecretLevcode) {
                            this.msgData.dataSecretLevcodeName = o.name;
                        }
                    })
                }
            },

            /**
             * 发起审批
             */
            confirmAudit () {
                let records = this.$refs.scjhTable.getSelectRecords();
                if (records.length<=0) {
                    this.$message.error("请选择")
                    return;
                }
                let oids = '';

                for (let i = 0; i < records.length; i++) {
                    if (i == records.length - 1) {
                        oids += records[i].oid;
                    } else {
                        oids += records[i].oid + ",";
                    }
                }
                this.visiblePlanAudit = false;

                this.$router.push({ path: '/pms/scrw/scjhs_flow', query: { oids: oids }});

            },

            back () {
                this.visiblePlanAudit = false;
            },

            showFlow () {
                this.$axios.get("/pms/XtBpmRec/listByBoid", {params: {boid: this.msgData.oid}})
                    .then(result => {
                        console.log(result.data,'111111111111');
                        if(!result.data || result.data.length == 0){
                            this.$message.error("还没有提交过流程！")
                            return;
                        }
                        let dataId = result.data[0].bpmDataId;
                        let arr = result.data.map((c)=>{
                          return {
                            bpmName: c.bpmName,
                            bpmDataId: c.bpmDataId
                          }
                        })
                        this.$router.push({ path: '/pms/scrw/scjh_show_flow', query: { dataId: dataId, data: JSON.stringify(arr) }});
                    })
                    .catch(error => {
                        this.$message.error("查询生产计划流程列表失败")
                    })
                    .finally(_ => {

                    })
            },

        },

        created () {
            this.$axios.get("permission/dataDictionary/listByActType?typeCodes=JHLX20,JHZT,JJCD,DATA_SECRET_LEVEL")
                .then(result => {
                    result.data.map(o => {
                        if (o.code == 'JHLX20') {
                            this.DATA_DICT_JHLX = o.appDataList;
                        }else if (o.code == 'JHZT') {
                            this.DATA_DICT_JHZT = o.appDataList;
                        }else if (o.code == 'JJCD') {
                            this.DATA_DICT_JJCD = o.appDataList;
                        }else if (o.code == 'DATA_SECRET_LEVEL') {
                            this.DATA_DICT_DATASECRET = o.appDataList;
                        }
                    })
                })
                .catch(error => {
                    this.$message.error("查询字典数据失败")
                })
        },

        props: {
            labelName: {
                default: function () {
                    return [
                        {
                            name: '计划编号',
                            label: 'scJhcode',
                        },
                        // {
                        //     name: '计划名称',
                        //     label: 'scJhname',
                        // },
                        {
                            name: '计划类型',
                            label: 'scJhlxName',
                        },
                        {
                            name: '计划状态',
                            label: 'jhztName',
                        },
                        {
                            name: '紧急程度',
                            label: 'jjcdName',
                        },
                        {
                            name: '外部文号',
                            label: 'scJhwhWb',
                        },
                        {
                            name: '密级',
                            label: 'dataSecretLevcodeName',
                        },
                        {
                            name: '附件',
                            label: '下载',
                            isDownload: true,
                            attaId: 'oidFj',
                        },
                    ]
                },
            },


        },
    }
</script>

<style scoped>

</style>
<style lang="less">
    .theme--dark {
        z-index: 10000!important;
    }
    .treeContainer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 310px;
        .tree {
            height: 98%;
        }
    }
</style>

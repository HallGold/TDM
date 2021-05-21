<template>
    <div class="ice-full-relative" style="width: 600px;height: 600px">
        <div class="ice-full-absolute">
            <vue-scroll :ops="{bar:{background:'#000',opacity:0.3}}" @handle-scroll="handleScroll">
                <div id="container"></div>
                <el-popover
                        popperClass="padding-4"
                        ref="pop"
                        width="300"
                        trigger="click">
                    <div style="background: #F5F7FA;min-height: 120px;padding: 2px;box-sizing: border-box">
                        <ul class="_ul">
                            <li>
                                <div class="title">状态:</div>
                                {{node.text}}

                            </li>
                            <li v-if="node.status!='runing'">
                                <div class="title">操作人:</div>
                                <span >{{node.operaterName}}</span>
                            </li>
                            <li v-else>
                                <div style="width: 200px;text-align: left;color: #000;">待处理环节操作人 :</div>
                                <div style="margin-left: 24px;">
                                    <div v-for="(item, index) in node.operaterName">{{index+1}}、{{item}}</div>
                                </div>
                            </li>
                            <li v-show="node.status!='runing'">
                                <div class="title">操作时间:</div>
                                {{node.operateTime}}
                            </li>
                            <li style="display: flex" v-show="node.status!='runing'">
                                <div class="title">审批意见:</div>
                                <div style="flex-grow: 1;text-align: left">
                                    {{node.opinion}}
                                </div>

                            </li>
                        </ul>
                        <!--<ice-label name="状态" :width="60">
                            <el-alert
                                    :title="node.title"
                                    :type="node.type"
                                    :closable="false"
                                    show-icon>
                            </el-alert>
                        </ice-label>-->
                        <!--<el-divider></el-divider>-->
                        <!-- <ice-label name="审核意见" :width="60">{{node.nodeMessage}}</ice-label>-->

                    </div>
                    <div slot="reference"
                         :style="'position: absolute;left: '+x+'px;top: '+y+'px;height:0'">
                    </div>
                </el-popover>
            </vue-scroll>

        </div>

        <ice-dialog v-dialogDrag title="子流程实例" center :visible.sync="dialogVisibled"
                    width="1100px" height="400px">
            <!--<ice-query-grid title="流程实例"
                            :gridData="childData"
                            :columns="columns"
                            :operations="operations" row-key="oid" ref="grid4545">
            </ice-query-grid>-->
            <el-table :data="childData"
                      :columns="columns"
                      height="400px"
                      :operations="operations" ref="grid4545">

                <el-table-column type="expand">
                    <template slot-scope="props">
                        <!--<el-timeline class="shyj">
                            <el-timeline-item v-for="(item, index) in props.row.proOperates"
                                              :key="item.oid" color="#0bbd87"
                                              :timestamp="new Date(item.operateTime).toLocaleString()"
                                              v-if="item.operateKey!='save'">
                                {{item.nodeName}}：{{item.operaterName}} {{item.opinion==null?"":"- "+item.opinion}}
                            </el-timeline-item>
                        </el-timeline>-->
                        <div v-if="props.row.proOperates.length==0"><span class="column_span">暂时没有批示意见</span></div>
                        <div v-for="item in props.row.proOperates"
                             v-if="item.operateKey!='save'&&item.opinion!=null&&item.opinion!=''">
                            <span class="column_span">{{new Date(item.operateTime).toLocaleString()}} {{item.nodeName}}：{{item.operaterName}} {{item.opinion==null?"":"- "+item.opinion}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createrName" label="发起人"></el-table-column>
                <el-table-column prop="bpmDefName" label="流程名" align="left"></el-table-column>
                <el-table-column prop="beginTime" label="发起时间"></el-table-column>
                <ice-table-column prop="afStatus" map-type-code="flow_af_status" label="状态"></ice-table-column>
                <el-table-column prop="currentNodeName" label="当前环节名称"></el-table-column>
                <el-table-column prop="nodeAssignerName" label="当前环节处理人"></el-table-column>
                <el-table-column prop="nodeBeginTime" label="当前环节开始时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showItem(scope.row)" type="text">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </ice-dialog>

    </div>

</template>

<script>
    import VueScroll from 'vuescroll';
    import {FlowStage} from 'floweditor'
    import IceLabel from "./IceLabel";
    import IceQueryGrid from './IceQueryGrid';
    import IceGridLayout from './IceGridLayout.vue';
    import IceTableColumn from "./IceTableColumn";
    import IceDialog from "./IceDialog";

    export default {
        name: "IceFlowImage",
        props: {
            json: {
                type: String,
                default: '{"name":"测试子流程","key":"TEST_SUB_FLOW","nodes":[{"constructorFun":"StartNode","x":420,"y":70,"width":40,"height":40,"id":1557380514324,"eleType":"node","nodeType":"startEvent","remark":"开始","code":"StartEvent","withStretch":false,"arrowsStarter":["line-1557380602314"],"arrowsEnder":[],"directionLines":{"0":[null,null,null,null,null],"1":[null,null,null,null,null],"2":["line-1557380602314",null,null,null,null],"3":[null,null,null,null,null]}},{"constructorFun":"EndNode","x":420,"y":440,"width":40,"height":40,"id":1557380517010,"eleType":"node","nodeType":"endEvent","remark":"结束","code":"EndEvent","withStretch":false,"arrowsStarter":[],"arrowsEnder":["line-1557380614802"],"directionLines":{"0":["line-1557380614802",null,null,null,null],"1":[null,null,null,null,null],"2":[null,null,null,null,null],"3":[null,null,null,null,null]}},{"constructorFun":"SingleSignNode","x":420,"y":160,"width":90,"height":50,"id":1557380521395,"eleType":"node","nodeType":"userTask","remark":"填写申请","code":"FirstNode","withStretch":true,"arrowsStarter":["line-1557380604186"],"arrowsEnder":["line-1557380602314"],"directionLines":{"0":["line-1557380602314",null,null,null,null],"1":[null,null,null,null,null],"2":["line-1557380604186",null,null,null,null],"3":[null,null,null,null,null]}},{"constructorFun":"SingleSignNode","x":420,"y":250,"width":90,"height":50,"id":1557380573162,"eleType":"node","nodeType":"userTask","remark":"领导审批","code":"node2","withStretch":true,"arrowsStarter":["line-1557380611482"],"arrowsEnder":["line-1557380604186"],"directionLines":{"0":["line-1557380604186",null,null,null,null],"1":[null,null,null,null,null],"2":["line-1557380611482",null,null,null,null],"3":[null,null,null,null,null]}},{"constructorFun":"MultipleSignNode","x":420,"y":350,"width":90,"height":50,"id":1557380577978,"eleType":"node","nodeType":"userTask","remark":"多人决策","code":"node3","withStretch":true,"arrowsStarter":["line-1557380614802"],"arrowsEnder":["line-1557380611482"],"directionLines":{"0":["line-1557380611482",null,null,null,null],"1":[null,null,null,null,null],"2":["line-1557380614802",null,null,null,null],"3":[null,null,null,null,null]}}],"lines":[{"id":"line-1557380602314","eleType":"line","express":"","startNodeId":1557380514324,"startNodeDirection":2,"endNodeId":1557380521395,"endNodeDirection":0,"points":[{"x":420,"y":90},{"x":420,"y":135}],"standardWidth":30},{"id":"line-1557380604186","eleType":"line","express":"","startNodeId":1557380521395,"startNodeDirection":2,"endNodeId":1557380573162,"endNodeDirection":0,"points":[{"x":420,"y":185},{"x":420,"y":225}],"standardWidth":30},{"id":"line-1557380611482","eleType":"line","express":"","startNodeId":1557380573162,"startNodeDirection":2,"endNodeId":1557380577978,"endNodeDirection":0,"points":[{"x":420,"y":275},{"x":420,"y":325}],"standardWidth":40},{"id":"line-1557380614802","eleType":"line","express":"","startNodeId":1557380577978,"startNodeDirection":2,"endNodeId":1557380517010,"endNodeDirection":0,"points":[{"x":420,"y":375},{"x":420,"y":420}],"standardWidth":30}]}'
            },
            status: {
                type: String,
                default: ''
            },
            flowContext: {
                type: Object
            },
            flowNodesInfo: {
                type: Object
            },
            taskRecord: {
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                vertical: 0,
                horizontal: 0,
                node: {
                    /*nodeMessage: "",
                    title: "审批失败",*/
                    type: "reject",
                    text: ''
                },
                nodeStatusText: {
                    "reject": "驳回",
                    "success": "已完成",
                    "runing": "处理中",
                    "info": "未执行"
                },
                nodeStatusType: {
                    "reject": "error",
                    "success": "success",
                    "runing": "warning",
                    "info": "info"
                },
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'formId', hidden: true},
                    {
                        label: '发起人', code: 'createrName', width: 150, formatter(row) {
                            return row.createrName + "(" + row.createrDeptName + ")";
                        }
                    },
                    {label: '流程名称', code: 'bpmDefName', width: 160},
                    // {label: '标题', code: 'subject', width: 150},
                    {
                        label: '状态', code: 'afStatus', width: 60, formatter(row) {
                            let status = row['afStatus'];
                            if (status == '-1') {
                                return '草稿'
                            }

                            if (status == '1') {
                                return '运行中'
                            }
                            if (status == '2') {
                                return '已完成'
                            }
                            if (status == '3') {
                                return '驳回'
                            }
                        }
                    },

                    //{label: '发起人部门', code: 'createrDeptName', width: 100},
                    //{label: '当前环节ID', code: 'currentNodeId', width: 100},
                    {label: '当前环节名称', code: 'currentNodeName', width: 120},
                    {label: '当前环节开始时间', code: 'nodeBeginTime', width: 150},
                    {label: '当前环节处理人', code: 'nodeAssignerName', width: 130},
                    {label: '业务单号', code: 'bizInfo', width: 150},
                    {label: '发起时间', code: 'beginTime', width: 150},
                    {label: '结束时间', code: 'endTime', width: 150}
                ],
                operations: [
                    {name: '查看', callback: this.showItem}
                ],
                dialogVisibled: false,
                childData: [],
                x: 0,
                y: 0,
                flowStage: null
            }
        }
        ,
        methods: {
            showItem(item) {
                //window.open(formId);
                this.$openFlow(item.formId, {blank: true})
                // this.$router.push(item.formId);
            },
            resolve(event, data) {
                //debugger
                if (event.name == 'nodeMouseenter') {
                    this.x = event.x //- this.horizontal;
                    this.y = event.y + 10 //- this.vertical;

                    let nodeInfo = this.flowNodesInfo[data.code];
                    // 找出数据 ownerName  nodeName
                    if (nodeInfo.status == 'runing') {
                        let str = this.taskRecord.filter(c => {
                            return c.nodeName == data.remark;
                        }).map(c=>{
                            return c.ownerName
                        })
                        nodeInfo.operaterName = str;
                    }
                    if (nodeInfo) {
                        this.node = nodeInfo
                        this.node.type = this.nodeStatusType[nodeInfo.status];
                        this.node.text = this.nodeStatusText[nodeInfo.status];

                        this.$nextTick(() => {
                            this.$refs.pop.doShow();
                        })
                    }
                    /*else {
                                           let status = "info";
                                           this.node.type = this.nodeStatusType[status];
                                           /!*this.node.opinion = "";
                                           this.node.title = this.nodeStatusText[status];*!/
                                       }*/
                }
                if (event.name == 'nodeMouseleave') {
                    let {x, y} = event
                    //console.log(x, y)
                    this.$refs.pop.doClose();
                    // console.log(event.evt.offsetX);
                    // console.log(event.evt.offsetY);
                }
                if (event.name == 'nodeClick') {
                    if (!this.flowContext.actInstId) {
                        this.$message.warning("流程未启动");
                        return;
                    }
                    if (data.constructorType != "SubProcessNode") {
                        return;
                    }
                    this.$axios.get("/bpm/pro/children", {
                        params: {
                            actInstId: this.flowContext.actInstId,
                            nodeId: data.code
                        }
                    }).then(result => {
                        if (result.data && result.data.length > 0) {
                            this.dialogVisibled = true;
                            result.data.filter(item => {
                                item.proOperates = item.proOperates.filter(bt => bt.nodeId != "StartEvent" && bt.nodeId != "EndEvent" && bt.opinion != null && bt.opinion != '');
                            })
                            this.$nextTick(() => {
                                this.childData = result.data;
                            })
                        }
                    });
                }
            },
            handleScroll(vertical, horizontal) {
                this.vertical = vertical.scrollTop
                this.horizontal = horizontal.scrollLeft
            }
        }
        ,
        created() {

        }
        ,
        mounted() {
            let {x, y} = FlowStage.computeStageSize(this.json);

            if (x > 590) {
                x = x + 100;
            } else {
                x = 590
            }
            if (y > 590) {
                y = y + 100;
            } else {
                y = 590
            }
            if (this.flowNodesInfo) {
                this.flowStage = new FlowStage("container", x, y, this.resolve).initStage(true);
                this.flowStage.recoverSnapshoot(this.json, true, JSON.parse(this.status), x, y)
            } else {
                this.flowStage = new FlowStage("container", x, y).initStage(true);
                this.flowStage.recoverSnapshoot(this.json, true, {}, x, y)
            }

            //
            console.log(this.flowNodesInfo, 'image')


        }
        ,
        components: {
            IceDialog,
            IceTableColumn,
            IceLabel, IceQueryGrid, IceGridLayout,
            VueScroll
        },
        beforeDestroy() {
            if (this.flowStage && this.flowStage.destroy) {
                this.flowStage.destroy();
                this.flowStage = null;
            }

        }
    }
</script>

<style lang="less" scoped>
    .column_span {
        margin-left: 7%;
    }

    .shyj {
        margin-top: 20px;
        margin-left: 20px;
        list-style: none;
        min-height: 300px;

        /*li {
            margin: 15px;
        }*/
    }

    ul li {
        list-style: none;
        margin-bottom: 8px;
        &::after{
            content: "";
            display: block;
            clear: both;
        }
        .title {
            width: 64px;
            display: inline-block;
            text-align: right;
            float: left;
            color: #000;
            margin-right: 5px;
        }
        ._right {
            overflow: hidden;
            margin-left: 66px;
        }


    }
</style>

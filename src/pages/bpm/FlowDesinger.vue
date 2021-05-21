<template>
    <!--<div>-->
    <el-container>

        <el-aside width="120px" style="height: 100%;overflow-x: hidden">
            <vue-scroll :ops="{bar:{background:'#fff',opacity:0}}">
                <div class="nodes">
                    <img src="@/assets/img/flowdesinger/startNode.png" draggable="true"
                         @dragstart="dragstart($event,'1')"/>
                    <div>开始</div>
                    <img src="@/assets/img/flowdesinger/endNode.png" width="42px" draggable="true"
                         @dragstart="dragstart($event,'2')"/>
                    <div>结束</div>
                    <img src="@/assets/img/flowdesinger/singerNode.png" width="94px" draggable="true"
                         @dragstart="dragstart($event,'3')"/>
                    <!-- <div>单人节点</div>-->
                    <img src="@/assets/img/flowdesinger/MultipleNode.png" width="94px" draggable="true"
                         @dragstart="dragstart($event,'4')"/>
                    <!--<div>多人节点</div>-->
                    <img src="@/assets/img/flowdesinger/ExclusiveGateway.png" width="54px" draggable="true"
                         @dragstart="dragstart($event,'5')"/>
                    <div>排它网关</div>
                    <img src="@/assets/img/flowdesinger/ParallelGateway.png" width="54px" draggable="true"
                         @dragstart="dragstart($event,'6')"/>
                    <div>并行网关</div>
                    <img src="@/assets/img/flowdesinger/InclusiveGateway.png" width="54px" draggable="true"
                         @dragstart="dragstart($event,'7')"/>
                    <div>包容网关</div>
                    <img src="@/assets/img/flowdesinger/subProcessNode.png" width="94px" draggable="true"
                         @dragstart="dragstart($event,'8')"/>
                    <!-- <div>子流程节点</div>-->
                </div>
            </vue-scroll>
        </el-aside>

        <el-main style="margin: 0;padding: 0;display: flex">
            <vue-scroll :ops="{bar:{background:'#dbdbdb'}}">
                <div id="floweditor" @drop="drop($event)"
                     @dragover="allowDrop($event)"></div>
            </vue-scroll>
            <div class="expandBar">
                <div class="bar" @click="expandedBar=!expandedBar">
                    <div class="icon" :class="{left:!expandedBar,right:expandedBar}"></div>
                </div>
            </div>
        </el-main>
        <el-aside :width="expandedBar?'320px':'0'" style="transition: width 0.3s;">
            <!--<div style="display: flex;flex-direction: row">
                </div>-->

            <vue-scroll :ops="{bar:{background:'#000',opacity:0}}">
                <el-card>
                    <span slot="header">流程属性面板</span>
                    <div>
                        <ice-label name="流程分类" :width="70" :required="true" :need-valid="true" ref="flowtype">
                            <ice-select map-type-code="FlowType" v-model="flowType"
                                        :text.sync="flowTypeText"></ice-select>
                        </ice-label>
                        <ice-label name="流程名称" :width="70" :required="true" :need-valid="true" ref="flowname">
                            <el-input v-model="flowname" maxlength="50"/>
                        </ice-label>
                        <ice-label name="流程KEY" :width="70" :required="true" :need-valid="true" ref="flowkey">
                            <el-input v-model="flowKeyComputed" maxlength="50"/>
                        </ice-label>
                        <ice-label name="流程说明" :width="70">
                            <el-input
                                    v-model="bpmDescribe"
                                    type="textarea"
                                    :rows="4" maxlength="500"
                                    show-word-limit
                                    placeholder="请输入内容">
                            </el-input>

                        </ice-label>
                        <ice-label name="版本号" :width="70">
                            <el-input v-model="flowversion" :disabled="true"/>
                        </ice-label>
                        <div style="display: flex;justify-content: center">
                            <el-button code="BBCLC" type="primary" @click="save">保存</el-button>
                            <el-button code="BFBLC" type="success" @click="publish">发布</el-button>
                            <el-button type="info" @click="cancel">取消</el-button>
                        </div>
                    </div>

                </el-card>

                <el-card v-if="nodePanelShow">
                    <span slot="header">节点属性面板</span>
                    <div>
                        <ice-label name="节点名称" :width="70">
                            <el-input v-model="nodename"/>
                        </ice-label>
                        <ice-label name="节点编码" :width="70">
                            <el-input v-model="nodecode"
                                      :disabled="nodecode=='StartEvent'||nodecode=='EndEvent'"/>
                        </ice-label>

                        <ice-label name="会签类型" :width="70" v-if="activeNode.constructorType == 'MultipleSignNode'">
                            <el-select v-model="nodeSignType" placeholder="请选择">
                                <el-option
                                        v-for="item in [{label:'顺签',value:'sequence'},{label:'并签',value:'parallel'}]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </ice-label>

                        <ice-pop-selector :label-width="85"
                                          label="关联流程"
                                          title="请选择流程"
                                          text-prop="bpmDefName"
                                          code-prop="actDefKey"
                                          v-model="processDefName"
                                          mode="onlySelect"
                                          :query="flowQuery"
                                          :columns="flowColumns"
                                          data-url="/bpm/definition/list"
                                          choose-item="single"
                                          @select-confirm="setSubProcess"
                                          v-if="activeNode.constructorType == 'SubProcessNode'">
                        </ice-pop-selector>

                        <ice-label name="执行方式" :width="70" v-if="activeNode.constructorType == 'SubProcessNode'">
                            <el-select v-model="nodeProcessType" placeholder="请选择">
                                <el-option
                                        v-for="item in [{label:'同步',value:'sync'},{label:'异步',value:'async'}]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </ice-label>

                        <div v-if="activeNode.nodeType == 'exclusiveGateway' ||
                        activeNode.nodeType == 'inclusiveGateway'">
                            <div style="margin-top: 20px">网关条件设置</div>
                            <ice-label :name="'至- '+tuple.node.remark"
                                       position="top"
                                       :width="200"
                                       v-for="tuple in conditionList"
                                       :key="tuple.node.id">
                                <div style="display: flex">
                                    <el-input placeholder="请输入表达式" @change="expressChange($event,tuple)"
                                              v-model="tuple.line.express">
                                        <el-button slot="append" icon.sync="el-icon-more" type="info"
                                                   @click="openExpressEditor(tuple.line)"></el-button>
                                    </el-input>
                                </div>
                            </ice-label>
                        </div>
                        <el-dialog v-dialogDrag title="设置表达式" center :visible.sync="conditionDialogVisible" width="400">
                            <el-input type="textarea"
                                      :rows="8"
                                      placeholder="请输入表达式" v-model="conditionDialogValue"></el-input>
                            <el-input placeholder="请输入表达式说明" v-model="conditionDialogValueLabel"
                                      style="margin-top: 10px"></el-input>
                            <div slot="footer">
                                <el-button type="primary" @click="conditionDialogConfirm">确定</el-button>
                                <el-button type="info" @click="conditionDialogVisible=false">取消</el-button>
                            </div>
                        </el-dialog>

                    </div>
                </el-card>
            </vue-scroll>
            <!--</div>-->
        </el-aside>
    </el-container>
    <!--  </div>-->
</template>

<script>
    import {
        EndNode,
        ExclusiveGatewayNode,
        FlowStage,
        InclusiveGatewayNode,
        MultipleSignNode,
        ParallelGatewayNode,
        SingleSignNode,
        StartNode,
        SubProcessNode
    } from 'floweditor'
    import {mapMutations} from 'vuex'
    import VueScroll from 'vuescroll'
    import IceLabel from '@/components/common/base/IceLabel.vue'
    import IceSelect from '@/components/common/base/IceSelect.vue'
    import {Loading} from 'element-ui';
    import IcePopSelector from "../../components/common/base/IcePopSelector";


    export default {
        name: 'flowdesinger',
        data() {
            return {
                definition: {},
                id: null,
                flowTypeText: "",
                flowname: '',//流程名称
                flowKey: '',//流程key
                flowType: '',//流程分类
                bpmDescribe: '',//流程描述
                flowversion: 1,//流程版本号
                status: 0,//流程版本号
                expandedBar: true,//右边扩展是否展开

                nodePanelShow: false,//nodepanel是否显示
                activeNode: null,//以选中的node
                nodename: '',//节点名称
                nodecode: '',//节点编码
                nodeSignType: 'sequence',//会签类型
                nodeProcessType: 'sync',//子流程执行方式
                processDefKey: '',//子流程key
                processDefName: '',//子流程name

                flowQuery: [
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: '', exp: 'like'},
                    {type: 'input', label: '流程KEY', code: 'actDefKey', value: '', exp: 'like'}
                ],
                flowColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {label: '流程名称', code: 'bpmDefName', width: 240},
                    {label: '流程KEY', code: 'actDefKey', width: 200, sortable: true},
                    {label: '流程版本', code: 'versionNo', width: 100}
                ],

                conditionList: [],//当前选择节点条件列表
                conditionDialogVisible: false,
                conditionDialogLine: null,
                conditionDialogValue: '',
                conditionDialogValueLabel: '',

                flowStage: null,
                startPos: null,
                dragNodeType: null,
                mainWidth: 0
            }
        },
        methods: {
            dragstart(ev, type) {
                if (type == '3' || type == '4' || type == '8') {
                    this.startPos = {
                        x: ev.offsetX - 45, y:
                            ev.offsetY - 25
                    }
                } else if (type == '5' || type == '6' || type == '7') {
                    this.startPos = {
                        x: ev.offsetX - 30, y:
                            ev.offsetY - 30
                    }
                } else if (type == '1' || type == '2') {
                    this.startPos = {
                        x: ev.offsetX - 20,
                        y: ev.offsetY - 20
                    }
                }
                this.dragNodeType = type
                /*  ev.preventDefault();*/
            },
            drop(ev) {
                var endPos = {
                    x: ev.offsetX - this.startPos.x, y:
                        ev.offsetY - this.startPos.y
                }


                var node = null;
                if (this.dragNodeType == '1') {
                    node = new StartNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '2') {
                    node = new EndNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '3') {
                    node = new SingleSignNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '4') {
                    node = new MultipleSignNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '5') {
                    node = new ExclusiveGatewayNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '6') {
                    node = new ParallelGatewayNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '7') {
                    node = new InclusiveGatewayNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                } else if (this.dragNodeType == '8') {
                    node = new SubProcessNode({
                        x: endPos.x,
                        y: endPos.y
                    }).renderNode(this.flowStage);
                }

                this.floweditorResolve("nodeClick", node);

                this.flowStage.history.clear();
                this.flowStage.history.addBeforeEle(node.getStatus());
                this.flowStage.history.addAfterEle(node.getStatus());
                this.flowStage.history.commit("insert", "");
                ev.preventDefault();
            },
            allowDrop(ev) {
                ev.preventDefault();
            },
            ...mapMutations('menuStore', ['collapseChage']),
            floweditorResolve(event, data) {
                if (event == 'nodeClick') {
                    this.nodePanelShow = true;
                    this.activeNode = data;
                    this.nodename = data.remark;
                    this.nodecode = data.code;
                    this.nodeSignType = data.isSequential ? 'sequence' : 'parallel';

                    this.nodeProcessType = data.processType ? data.processType : '';
                    this.processDefKey = data.processDefKey ? data.processDefKey : '';
                    this.processDefName = data.processDefName ? data.processDefName : '';

                    if (data.nodeType == 'exclusiveGateway' ||
                        data.nodeType == 'inclusiveGateway') {

                        this.conditionList = data.arrowsStarter
                            .map(lineId => {
                                return this.flowStage.getEleById(lineId)
                            })
                            .map(line => {
                                return {line: line, nodeId: line.endNodeId};
                            })
                            .map(tuple => {
                                return {line: tuple.line, node: this.flowStage.getEleById(tuple.nodeId)}
                            })
                        /*.map(node => node.remark)*/

                    }

                } else if (event == 'nodeClear') {
                    this.activeNode = null;
                    this.nodePanelShow = false;
                    this.nodename = '';
                    this.nodecode = '';
                } else if (event == 'errorValid') {
                    this.$message.error(data);
                }
            },
            expressChange(value, tuple) {
                if (value) {
                    value = value.replace(/“/g, "\"").replace(/”/g, "\"").trim();
                }
                tuple.line.setExpress(value);
            },
            openExpressEditor(line) {
                this.conditionDialogVisible = true;
                this.conditionDialogLine = line;
                this.conditionDialogValue = line.express;
                this.conditionDialogValueLabel = line.expressLabel;
            },
            conditionDialogConfirm() {
                this.conditionDialogVisible = false;
                if (this.conditionDialogValue) {
                    this.conditionDialogValue = this.conditionDialogValue.replace(/“/g, "\"").replace(/”/g, "\"").trim();
                }
                this.conditionDialogLine.setExpress(this.conditionDialogValue, this.conditionDialogValueLabel);
            },
            doValid() {
                this.$refs.flowname.clearError();
                this.$refs.flowkey.clearError();
                this.$refs.flowtype.clearError();
                if (!this.flowType) {
                    this.$refs.flowtype.fireErrorMsg("流程分类不能为空");
                    return false;
                }
                if (!this.flowname) {
                    this.$refs.flowname.fireErrorMsg("流程名称不能为空");
                    return false;
                }
                if (!this.flowKey) {
                    this.$refs.flowkey.fireErrorMsg("流程KEY不能为空");
                    return false;
                }
                const reg = /^[_a-zA-Z][0-9_a-zA-Z]*$/;
                if (!reg.test(this.flowKey)) {
                    this.$refs.flowkey.fireErrorMsg("由英文字母开始/数字/下划线组成");
                    return false;
                }
                return this.flowStage.doValid();
            },
            doValidateJson() {
                // debugger
                let json = JSON.parse(this.flowStage.doSnapshoot());
                if (json.nodes) {
                    for (let i = 0; i < json.nodes.length; i++) {
                        let node = json.nodes[i];
                        const reg = /^[_a-zA-Z][0-9_a-zA-Z]*$/;
                        if (!reg.test(node.code)) {
                            this.$message.error(node.remark + "的环节key:" + node.code + ",应该" + "由英文字母开始/数字/下划线组成");
                            return false;
                        }
                    }
                }
                return true;
            },
            save() {
                if (this.doValid() && this.doValidateJson()) {
                    let loadingInstance = Loading.service({target: this.$el});
                    let postData = this.definition;
                    postData.id = this.id;
                    postData.typeId = this.flowType;
                    postData.typeDesc = this.flowTypeText;
                    postData.bpmDescribe = this.bpmDescribe;
                    postData.isDeploy = false;
                    postData.status = this.status;
                    postData.bpmDefXml = this.id;

                    postData.actDefKey = this.flowKey;
                    postData.bpmDefKey = this.flowKey;
                    postData.bpmDefName = this.flowname;

                    //postData.id = this.flowStage.createBpmn20Xml();
                    postData.bpmDefJson = this.flowStage.doSnapshoot();
                    this.$axios.post('/bpm/definition/saveOrUpdate', postData).then(result => {
                        this.$message.success("保存成功")
                        this.$router.back();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    }).finally(result => {
                        loadingInstance.close();
                    })
                }
            },
            publish() {
                if (this.doValid() && this.doValidateJson()) {
                    let json = this.flowStage.doSnapshoot();
                    if (!json || json.indexOf("FirstNode") == -1) {
                        this.$message.error("请设计流程图再发布,流程必须包含FirstNode节点");
                        return;
                    }
                    let loadingInstance = Loading.service({target: this.$el});
                    this.$axios.post('/bpm/definition/publish', {
                        id: this.id,
                        typeId: this.flowType,
                        typeDesc: this.flowTypeText,
                        bpmDescribe: this.bpmDescribe,
                        status: this.status,
                        actDefKey: this.flowKey,
                        bpmDefKey: this.flowKey,
                        bpmDefName: this.flowname,
                        bpmDefXml: this.flowStage.createBpmn20Xml(),
                        bpmDefJson: json
                    }).then(result => {
                        this.$message.success("发布成功")
                        this.$router.back();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    }).finally(result => {
                        loadingInstance.close();
                    })
                }
            },
            cancel() {
                this.$router.go(-1);
            },
            setSubProcess(items, name, key) {
                if (this.activeNode && this.activeNode.constructorType == 'SubProcessNode') {
                    this.activeNode.setProcessDefKey(key);
                    this.activeNode.setProcessDefName(name);
                }
            }

        },
        computed: {
            flowKeyComputed: {
                get: function () {
                    return this.flowKey;
                },
                set: function (val) {
                    this.flowKey = val.toUpperCase();
                }
            }
        },
        watch: {
            flowname(newval, oldval) {
                this.flowStage.name = newval;
            },//流程名称
            flowKey(newval, oldval) {
                this.flowStage.key = newval;
            },
            nodename(newval, oldval) {
                debugger
                if (this.activeNode) {
                    this.activeNode.setRemark(newval);
                    this.activeNode.draw();
                }
            },
            nodecode(newval, oldval) {
                if (this.activeNode) {
                    this.activeNode.setCode(newval);
                }
            },
            nodeSignType(newval, oldval) {
                if (this.activeNode && this.activeNode.constructorType == 'MultipleSignNode') {
                    this.activeNode.setSequential(newval == 'sequence');
                }
            },
            nodeProcessType(newval, oldval) {
                if (this.activeNode && this.activeNode.constructorType == 'SubProcessNode') {
                    this.activeNode.setProcessType(newval);
                }
            }
        },
        components: {
            IcePopSelector,
            VueScroll,
            IceLabel,
            IceSelect
        },
        mounted() {

            let maxWidth = document.body.offsetWidth - 220;
            if (maxWidth < 1200) {
                maxWidth = 1200;
            }
            this.flowStage = new FlowStage("floweditor", maxWidth, 2000, this.floweditorResolve).initStage();
            let id = this.$route.query['id'];
            if (id) {
                let loadingInstance = Loading.service({target: this.$el});
                this.id = id;
                this.$axios.get("/bpm/definition/get", {params: {id: this.id}})
                    .then(result => {
                        let data = result.data;
                        this.flowname = data.bpmDefName;
                        this.flowKey = data.actDefKey;
                        this.flowType = data.typeId;
                        this.flowTypeText = data.typeDesc;
                        this.bpmDescribe = data.bpmDescribe;
                        this.flowversion = data.versionNo;
                        this.status = data.status;
                        this.definition = data;
                        if (data.bpmDefJson && data.bpmDefJson.trim()) {
                            this.flowStage.recoverSnapshoot(data.bpmDefJson);
                        }
                        loadingInstance.close();
                    })
            }


        },
        beforeDestroy() {
            if(this.flowStage){
                this.flowStage.destroy();
                this.flowStage = null;
            }

        }
    }

</script>

<style>
    .kineticjs-content canvas:focus {
        border: none;
        outline: none;
    }
</style>

<style lang="less" scoped>
    .nodes {
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        justify-content: center;
        align-items: center;
    }

    .nodes img {
        display: block;
        margin: 26px 0 4px 0;
    }

    .nodes div {
        font-size: 12px;
    }

    .expandBar {
        width: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .bar {
            height: 100px;
            width: 6px;
            background: #c5c5c5;
            cursor: pointer;
            color: #000;
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .icon {
                width: 0;
                height: 0;

            }

            .icon.left {
                border-top: 4px solid #c5c5c5;
                border-bottom: 4px solid #c5c5c5;
                border-right: 4px solid #000;
            }

            .icon.right {
                border-top: 4px solid #c5c5c5;
                border-bottom: 4px solid #c5c5c5;
                border-left: 4px solid #000;
            }
        }

    }
</style>

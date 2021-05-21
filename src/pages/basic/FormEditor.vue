<template>
    <div style="height: 100%;width: 100%;display: flex;flex-direction: column;">
        <el-container style="height: 100%;width: 100%">

            <el-aside width="120px" style="height: 100%;overflow-x: hidden">
                <vue-scroll :ops="{bar:{background:'#fff',opacity:0}}">
                    <div class="nodes">
                        <img src="@/assets/img/flowdesinger/singerNode.png" width="94px" draggable="true"
                             @dragstart="dragstart($event,'input')"/>
                        <!-- <div>单人节点</div>-->
                        <img src="@/assets/img/flowdesinger/MultipleNode.png" width="94px" draggable="true"
                             @dragstart=" dragstart($event,'formPanel')"/>

                        <!-- <div>子流程节点</div>-->
                    </div>
                </vue-scroll>
            </el-aside>

            <el-main style="margin: 0;padding: 0;display: flex">
                <vue-scroll :ops="{bar:{background:'#dbdbdb'}}">
                    <div id="floweditor"
                         style="width: 1200px;height: 1200px;">
                        <el-button @click="add">123213</el-button>
                        <ice-form-editor :editor-ops.sync="userCards" :activeType="activeType">

                        </ice-form-editor>
                        <!--<grid-layouts :layouts.sync="userCards.children"
                                     :col-num="4"
                                     :row-height="50"
                                     :is-draggable="true"
                                     :is-resizable="true"
                                     :is-mirrored="false"
                                     :vertical-compact="true"
                                     :margin="[10, 10]"
                                     :use-css-transforms="true"
                                     @dragover.native="allowDrop"
                                     @drop.native="drop">

                        </grid-layouts>-->
                    </div>
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

                </vue-scroll>
                <!--</div>-->
            </el-aside>
        </el-container>
    </div>
</template>

<script>
    import VueGridLayout from 'vue-grid-layout';
    import VueScroll from 'vuescroll'
    import IceFormEditor from "../../components/formeditor/etitor/IceFormEditor";


    export default {
        name: "FormEditor",
        data() {
            return {
                expandedBar: true,//右边扩展是否展开
                activeType: '',
                userCards: {
                    colNum: 4,
                    rowHeight: 60,
                    "i": new Date().getTime() + "",
                    type: 'rootPanel',
                    children:
                        [/*{
                            name: '我的私信',
                            "x": 0,
                            "y": 0,
                            "w": 1,
                            "h": 1,
                            type: 'input',
                            "i": new Date().getTime() + 100 + ""
                        }, {
                            name: '我的panel',
                            "x": 1,
                            "y": 0,
                            "w": 3,
                            "h": 3,
                            type: 'formPanel',
                            "i": new Date().getTime() + 201 + "",
                            colNum: 4,
                            rowHeight: 50,
                            children: [
                                {
                                    name: '我的私信2',
                                    "x": 0,
                                    "y": 0,
                                    "w": 1,
                                    "h": 1,
                                    type: 'input',
                                    "i": new Date().getTime() + 300 + "",
                                }
                            ]
                        }*/]
                }
            }
        },
        methods: {
            dragstart(ev, type) {
                /*if (type == '3' || type == '4' || type == '8') {
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
                }*/
                this.activeType = type
                /*  ev.preventDefault();*/
            },
            drop(ev) {
                var endPos = {
                    x: ev.offsetX - this.startPos.x, y:
                        ev.offsetY - this.startPos.y
                }

                console.log(endPos);

                ev.preventDefault();
            },
            allowDrop(ev) {
                ev.preventDefault();
            },
            add() {
                this.$set(this.userCards.children, this.userCards.children.length, {
                    name: '我的私信',
                    "x": 0,
                    "y": 1,
                    "w": 1,
                    "h": 1,
                    type: 'input',
                    "i": new Date().getTime()
                })

            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {
            IceFormEditor,
            VueScroll,
            GridItem: VueGridLayout.GridItem,
            GridLayout: VueGridLayout.GridLayout,
        }
    }

</script>


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

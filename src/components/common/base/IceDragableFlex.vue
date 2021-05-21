<template>
    <!--  <div class="ice-dragable-flex">-->
    <div class="ice-dragable-flex" :style="{flexDirection:direction,background:'#eae2e3'}">
        <div class="side" :style="{width:preSideWidth,height:preSideHeight}">
            <slot name="pre"></slot>
        </div>
        <div class="main-wrapper">
            <div class="drag-line" :style="preLineStyle" @mousedown="dragLine($event,'pre')"
                 v-if="preSide>0&&dragable"></div>
            <div class="drag-line" :style="postLineStyle" @mousedown="dragLine($event,'post')"
                 v-if="postSide>0&&dragable"></div>
            <div class="ice-full-absolute">
                <slot></slot>
            </div>
        </div>
        <div class="side" :style="{width:postSideWidth,height:postSideHeight}">
            <slot name="post"></slot>
        </div>
    </div>
    <!-- </div>-->

</template>

<script>
    export default {
        name: "IceDragableFlex",
        props: {
            direction: {
                type: String,
                default: 'column',
                validator: function (value) {
                    return ['column', 'row'].indexOf(value) !== -1
                }
            },
            preSide: {
                type: Number,
                default: 200,
            },
            postSide: {
                type: Number,
                default: 200,
            },
            dragable: {
                type: Boolean,
                default: true
            },
            layout: {
                type: Object,
                default: () => {
                    return {pre: null, main: null, post: null}
                }
            }

        },
        data() {
            return {
                lineSize: 2
            }
        },
        methods: {
            dragLine(e, type) {
                let startX = e.clientX;
                let startY = e.clientY;

                let thiz = this;
                let preSide = thiz.preSide;
                let postSide = thiz.postSide;


                let canmove = true;
                document.onmousemove = function (e) {
                    e.preventDefault();
                    if (!canmove) {
                        return
                    }

                    //得到鼠标拖动的宽高距离：取绝对值
                    let distX = e.clientX - startX;
                    let distY = e.clientY - startY;
                    if (type == 'pre') {
                        if (thiz.direction == 'row') {
                            thiz.$emit("update:preSide", (preSide + distX) < 50 ? 50 : (preSide + distX))
                        } else {
                            thiz.$emit("update:preSide", (preSide + distY) < 50 ? 50 : (preSide + distY))
                        }
                    } else {
                        if (thiz.direction == 'row') {
                            thiz.$emit("update:postSide", (postSide - distX) < 50 ? 50 : (postSide - distX))
                        } else {
                            thiz.$emit("update:postSide", (postSide - distY) < 50 ? 50 : (postSide - distY))
                        }
                    }


                }

                document.onmouseup = function (e) {
                    canmove = false;
                    e.preventDefault();
                    document.onmousemove = null;
                }
            }
        },
        computed: {
            preSideHeight() {
                if (this.direction == 'row') {
                    return '100%'
                } else {
                    return this.preSide + 'px';
                }

            },
            preSideWidth() {
                if (this.direction == 'column') {
                    return '100%'
                } else {
                    return this.preSide + 'px';
                }
            },
            postSideHeight() {
                if (this.direction == 'row') {
                    return '100%'
                } else {
                    return this.postSide + 'px';
                }

            },
            postSideWidth() {
                if (this.direction == 'column') {
                    return '100%'
                } else {
                    return this.postSide + 'px';
                }
            },
            preLineStyle() {
                if (this.direction == 'row') {
                    return {
                        top: '0',
                        left: '-3px',
                        width: this.lineSize + 'px',
                        bottom: '0',
                        cursor: 'e-resize'
                    }
                } else {
                    return {
                        top: '-3px',
                        left: '0',
                        height: this.lineSize + 'px',
                        right: '0',
                        cursor: 'n-resize'
                    }
                }
            },
            postLineStyle() {
                if (this.direction == 'row') {
                    return {
                        top: '0',
                        right: '-3px',
                        width: this.lineSize + 'px',
                        bottom: '0',
                        cursor: 'e-resize'
                    }
                } else {
                    return {
                        bottom: '-3px',
                        right: '0',
                        height: this.lineSize + 'px',
                        left: '0',
                        cursor: 'n-resize'
                    }
                }
            }
        },
        watch: {},
        mounted() {

        },
        components: {}
    }

</script>


<style lang="less" scoped>
    .ice-dragable-flex {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
        border: 2px solid #c6c7cb;
        padding: 1px;

        .side {
            flex-grow: 0;
        }

        .main-wrapper {
            flex-grow: 1;
            position: relative;
            background: #e2dadb;

            .drag-line {
                position: absolute;
                background: #c6c7cb;
                z-index: 100;
            }

            /*.drag-line.pre {
                top: 0;
                left: 0;
            }
            .drag-line.post {
                top: 0;
                right: 0;
            }*/
        }
    }
</style>

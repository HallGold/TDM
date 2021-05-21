<script>
    import VueGridLayout from 'vue-grid-layout';
    import IceLabel from "../../common/base/IceLabel";
    import IceDragableFlex from "@/components/common/base/IceDragableFlex";

    export default {
        name: "IceFormEditor",
        props: {
            layoutOps: Object,
            activeType: String
        },
        data() {
            return {}
        },
        render: function (h) {
            let thiz = this;
            return (<div class="ice-full-absolute"
                         nativeOn-dragover={evt => this.allowDrop(evt)}
                         nativeOn-drop={evt => this.drop(evt, this.editorOps)}>
                {this.renderRoot(this.editorOps)}
            </div>)
        },
        methods: {
            resolveChildren(children, parent) {

                switch (children.type) {
                    case 'input':
                        return (this.renderInput(children, parent));
                    case 'formPanel':
                        return (this.renderFormPanel(children, parent));
                }
            }
            ,
            renderInput(ops, parent) {
                return (<grid-item
                    x={ops.x}
                    y={ops.y}
                    w={ops.w}
                    h={ops.h}
                    i={ops.i}>
                    <div class="itemWrapper" tabIndex='1' on-keyup={evt => {
                        //debugger
                        if (evt.keyCode == 46) {
                            this.removeItem(ops, parent);
                        }
                        evt.stopPropagation()
                    }}>
                        <ice-label name="测试的">
                            <div class="input"></div>
                        </ice-label>
                    </div>
                </grid-item>)
            },
            renderFormPanel(ops, parent) {
                // debugger
                return (<grid-item
                    x={ops.x}
                    y={ops.y}
                    w={ops.w}
                    h={ops.h}
                    i={ops.i}>
                    <div class="ice-full-relative" tabIndex='1' on-keyup={evt => {
                        // debugger
                        if (evt.keyCode == 46) {
                            this.removeItem(ops, parent);
                        }
                        evt.stopPropagation()
                    }}>
                        <div class="background form">
                            {this.f(100).map(item => {
                                return <div class="item"
                                            style={'width:calc(100% / ' + ops.colNum + ' - ' + '1px)'}></div>
                            })}
                        </div>
                        <div class="formTitle">
                            <div class="title">
                                <div class="bar"></div>
                                <div class="name">基础表单</div>
                            </div>
                        </div>
                        <grid-layout layout={ops.children}
                                     {...{
                                         on: {
                                             'layout-updated': value => {
                                                 ops.children = value
                                             }
                                         }
                                     }}
                                     nativeOn-dragover={evt => this.allowDrop(evt)}
                                     nativeOn-drop={evt => this.drop(evt, ops)}
                                     col-num={ops.colNum}
                                     row-height={ops.rowHeight}
                                     ref={ops.i}
                                     auto-size={false}
                                     is-draggable={true}
                                     is-resizable={true}
                                     vertical-compact={false}
                                     margin={[0, 0]}
                                     use-css-transforms={false}>
                            {ops.children.map(item => {
                                return this.resolveChildren(item, ops);
                            })}
                        </grid-layout>
                    </div>
                </grid-item>)
            },
            allowDrop(ev) {
                ev.preventDefault();
            },
            drop(ev, ops) {
                //debugger
                console.log(ev.offsetX, ev.offsetY, ops);
                // ev.preventDefault();

                let x = 0;
                let y = 0;

                if (ops.type == 'formPanel' || ops.type == 'rootPanel') {
                    let pos = {x: ev.offsetX, y: ev.offsetY};
                    //debugger
                    let grid = this.$refs[ops.i];
                    // debugger
                    let width = grid.$el.offsetWidth;
                    let height = grid.$el.offsetHeight;
                    //console.log(width, height)
                    let colWidth = width / grid.colNum;

                    let rowNum = height / grid.rowHeight;

                    //debugger
                    for (let i = 0; i < grid.colNum; i++) {
                        if (i * colWidth < pos.x && pos.x < (i + 1) * colWidth) {
                            x = i;
                        }
                    }
                    for (let i = 0; i < rowNum; i++) {
                        if (i * grid.rowHeight < pos.y && pos.y < (i + 1) * grid.rowHeight) {
                            y = i;
                        }
                    }
                }


                if (this.activeType == 'formPanel') {
                    if (ops.type == 'formPanel') {
                        this.$message.warning("不能将formPanel放入formPanel");
                        ev.stopPropagation();
                        return
                    }

                    this.$set(ops.children, ops.children.length, {
                        "x": 0,
                        "y": y,
                        "w": 1,
                        "h": 4,
                        type: 'formPanel',
                        colNum: 4,
                        rowHeight: ops.rowHeight,
                        "i": new Date().getTime(),
                        children: []
                    });
                } else if (this.activeType == 'input') {

                    if (ops.type == 'rootPanel') {
                        this.$message.warning("不能将表单控件放入rootPanel");
                        ev.stopPropagation();
                        return
                    }

                    this.$set(ops.children, ops.children.length, {
                        "x": x,
                        "y": y,
                        "w": 1,
                        "h": 1,
                        type: 'input',
                        "i": new Date().getTime()
                    });
                } else if (this.activeType == 'layout') {
                    this.$set(ops.children, ops.children.length, {
                        type: 'layout',
                        "i": new Date().getTime(),
                        pre: {},
                        main: {},
                        post: {},
                    });
                }


                console.log(x, y);

                ev.stopPropagation();
            },
            f(length) {
                return Array.from({length}).map((v, k) => k);
            },
            removeItem(item, parent) {
                let index = parent.children.findIndex(child => child.i == item.i)
                if (index > -1) {
                    parent.children.splice(index, 1);
                    this.$set(parent, 'children', parent.children);
                }
            },
            renderRoot(ops) {
                if (ops.type == 'rootPanel') {
                    return (<div class="ice-full-absolute" style="background:#fff;">
                        <grid-layout layout={ops.children}
                                     {...{
                                         on: {
                                             'layout-updated': value => {
                                                 ops.children = value
                                             }
                                         }
                                     }}
                                     nativeOn-dragover={evt => this.allowDrop(evt,)}
                                     nativeOn-drop={evt => this.drop(evt, this.editorOps)}
                                     col-num={1}
                                     row-height={ops.rowHeight}
                                     is-draggable={true}
                                     is-resizable={true}
                                     auto-size={false}
                                     vertical-compact={false}
                                     ref={ops.i}
                                     margin={[0, 0]}
                                     use-css-transforms={false}>
                            {this.editorOps.children.map(item => {
                                return this.resolveChildren(item, ops);
                            })}
                        </grid-layout>

                    </div>)
                } else if (ops.type == 'layout') {
                    return (<ice-dragable-flex
                        {...{
                            scopedSlots: {
                                pre: scope => {
                                    debugger
                                    return <div>{this.scope}</div>
                                },
                                default: scope => {
                                    return <div>{this.scope}</div>
                                },
                                post: scope => {
                                    return <div>{this.scope}</div>
                                }
                            }
                        }} >

                    </ice-dragable-flex>)
                }
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {
            GridItem: VueGridLayout.GridItem,
            GridLayout: VueGridLayout.GridLayout,
            IceLabel,
            IceDragableFlex
        }
    }

</script>

<style scoped lang="less">
    .background {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        //  background: #13ce66;
        display: flex;
        flex-wrap: wrap;
        z-index: 0;
        overflow: hidden;

        .item {
            border-left: 1px dashed #cad5f3;
            border-top: 1px dashed #cad5f3;
            /* width: 296px;*/
            height: 59px;
            background: #ffffff;;
        }

    }

    .form .item {
        background: #eafffc;
    }

    .formTitle {
        position: absolute;
        top: -40px;
        height: 40px;
        width: 180px;
        background: #ffffff;

        .title {
            width: 160px;
            height: 100%;
            color: #333;
            text-align: center;
            line-height: 40px;
            display: flex;
            height: 26px;
            margin-left: 4px;
            margin-top: 8px;

            .bar {
                height: 100%;
                width: 6px;
                background: red;
            }
            .name {
                height: 26px;
                margin-left: 10px;
                vertical-align: middle;
                line-height: 26px;
            }

        }
    }

    .itemWrapper {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        padding: 5px;
        box-sizing: border-box;
        background: #f6f6ec;

        .label-area {
            height: 100%;
            margin: 0;

            .label-content {
                align-self: stretch;
            }
        }

        .input {
            grid-row: 1;
            border: 1px solid #82848a;
            background: white;
            height: 100%;
            box-sizing: border-box;
            position: relative;
        }

    }
</style>
<style>
    .vue-grid-layout {
        height: 100%;
    }
</style>

<script>
    import IceDragableFlex from "../../common/base/IceDragableFlex";

    export default {
        name: "IceLayoutEditor",

        props: {
            layoutOps: Object,
            activeType: String
        },
        render(h) {
            return (<div class="ice-full-absolute"
                         onDragover={evt => this.allowRootDrop(evt)}
                         onDrop={evt => this.rootOnDrop(evt, this.layoutOps)}>
                {this.renderLayout(this.layoutOps)}
            </div>)
        },
        data() {
            return {}
        },
        methods: {
            allowRootDrop(evt) {
                if (this.activeType == 'formPanel'
                    || this.activeType == 'layout') {
                    evt.preventDefault();
                }
            },
            rootOnDrop(evt, ops, s) {
                console.log(s)
                if (this.activeType == 'layout') {
                    this.$set(ops, 'type', 'layout');
                    this.$set(ops, 'direction', 'column');
                    this.$set(ops, 'preSide', 50);
                    this.$set(ops, 'postSide', 50);
                    this.$set(ops, 'pre', {});
                    this.$set(ops, 'main', {});
                    this.$set(ops, 'post', {});
                }
                if (this.activeType == 'formPanel') {

                }
                evt.preventDefault();
                evt.stopPropagation();
            },
            renderLayout(ops) {
                //debugger

                if (ops.type == 'layout') {

                    return (<ice-dragable-flex
                        class="layout-container"
                        tabIndex="1"
                        nativeOn-focus={evt => this.$emit('layouts-click', ops)}
                        direction={ops.direction}
                        preSide={ops.preSide}
                        postSide={ops.postSide}
                        {...{
                            scopedSlots: {
                                pre: scope => {
                                    return (<div class="ice-full-relative"
                                                 onDragover={evt => this.allowRootDrop(evt)}
                                                 onDrop={evt => this.rootOnDrop(evt, ops.pre)}>
                                        {this.renderLayout(ops.pre)}
                                    </div>)
                                },
                                default: scope => {
                                    return (<div class="ice-full-relative"
                                                 onDragover={evt => this.allowRootDrop(evt)}
                                                 onDrop={evt => this.rootOnDrop(evt, ops.main)}>
                                        {this.renderLayout(ops.main)}
                                    </div>)
                                },
                                post: scope => {
                                    return (<div class="ice-full-relative"
                                                 onDragover={evt => this.allowRootDrop(evt)}
                                                 onDrop={evt => this.rootOnDrop(evt, ops.post)}>
                                        {this.renderLayout(ops.post)}
                                    </div>)
                                }
                            },
                            on: {
                                'update:preSide': value => {
                                    ops.preSide = value
                                },
                                'update:postSide': value => {
                                    ops.postSide = value
                                },
                            }
                        }} >

                    </ice-dragable-flex>)

                } else if (ops.type == 'formPanel') {

                }
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {IceDragableFlex},
    }

</script>


<style scoped>
    .layout-container {
        outline: none
    }

    .layout-container:focus {
        border-color: red;
    }


</style>

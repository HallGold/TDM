<template>
    <el-dialog v-dialogDrag :center="true" :append-to-body="appendToBody" v-bind="{...$attrs}" v-on="$listeners"
               :width="width" :title="title"
               :close-on-click-modal="closeOnClickModal"
               :visible.sync="visibleInner">
        <div slot="title" v-if="$slots.headerTitle">
            <slot name="headerTitle"></slot>
        </div>
        <div style="width:100%" ref="wrapper">
            <ice-dialog-wrapper :height="height" :page-id="pageId" :file-url="fileUrl" :page-props="pageProps"
                                v-if="remounted?visibleInner:true"
                                ref="pageWrapper">
                <slot></slot>
            </ice-dialog-wrapper>
        </div>

        <div class="ice-button-bar" slot="footer" v-if="(buttons&&buttons.length>0)||$scopedSlots.footer">
            <slot name="footer">
                <el-button :type="item.iscannel?'info':'primary'"
                           v-for="item in buttons"
                           unauth
                           :key="item.name"
                           :disabled="disabled(item)"
                           @click="item.iscannel?close(item):confirm(item)">
                    {{item.name}}
                </el-button>
                <!--                <el-button type="primary">按鈕2</el-button>
                                <el-button type="primary">按鈕3</el-button>-->
            </slot>
        </div>
    </el-dialog>
</template>

<script>
    import IceDialogWrapper from "./IceDialogWrapper";

    export default {
        name: "IceDialog",
        props: {
            title: {
                type: String,
                default: '标题'
            },
            visible: {
                type: Boolean,
                default: false
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            appendToBody: {
                type: Boolean,
                default: true
            },
            width: {
                type: String,
                required: true
            },
            height: String,
            buttons: Array,
            //弹出层重新打开时候是否重新挂载内容
            remounted: Boolean,
            //表单设计器设计页面id
            pageId: String,
            //需要打开的文件路径
            fileUrl: String,
            pageProps: Object,
        },
        data() {
            return {
                visibleInner: false
            }
        },
        computed: {
            reverseButtons() {
                // debugger
                if (this.buttons) {
                    return this.buttons.reverse();
                } else {
                    return []
                }
            },

        },
        methods: {
            async close(button) {

                if (button) {
                    if (button.click) {

                        try {

                            const result = await button.click(button, this.$refs.pageWrapper.getPageData())
                            if (result !== false) {
                                this.visibleInner = false;
                            }
                        } catch (e) {

                            this.$message.error(e)
                        }

                    } else {
                        this.visibleInner = false;
                    }
                }

            },
            async confirm(button) {
                if (button) {
                    if (button.click) {
                        try {

                            const result = await button.click(button, this.$refs.pageWrapper.getPageData())
                            if (result !== false) {
                                this.visibleInner = false;
                            }
                        } catch (e) {
                            if (e.msg) {
                                this.$message.error(e.msg);
                            } else {
                                this.$message.error(e);
                            }
                        }

                    } else {
                        this.visibleInner = false;
                    }
                }

            },
            disabled(item) {
                //  debugger
                if (this.$refs.pageWrapper) {
                    return typeof (item.disabled) === 'undefined' ? false :
                        ((typeof item.disabled == 'function') ? item.disabled(this.$refs.pageWrapper.getPageData()) : item.disabled)
                } else {
                    return typeof (item.disabled) === 'undefined' ? false :
                        ((typeof item.disabled == 'function') ? item.disabled() : item.disabled)
                }

            },
            /* closeDialog() {
                 //console.log("closeDialog", this)
                 this.visibleInner = false;
             }*/
        },
        created() {
            // console.log(this.$slots.headerTitle, '2245')
        },
        watch: {
            visibleInner(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit("update:visible", this.visibleInner);
                }

                if (newValue) {
                    this.$nextTick(_ => {
                        const wrapper = this.$refs.wrapper;
                        // wrapper.style.height = wrapper.offsetHeight+100 + "px";
                    })
                }

            },
            visible() {
                this.visibleInner = this.visible;
            }
        },
        mounted() {

        },
        components: {IceDialogWrapper}
    }
</script>

<style lang="less" scoped>
    .ice-button-bar {
        padding: 0px 16px 5px 10px;
    }
    /deep/ .el-dialog{
        border-radius: 10px!important;
    }
    /deep/ .el-dialog__header{
        border-radius: 10px!important;
    }
    /deep/ .el-dialog__body{
        border-radius: 10px!important;
    }
</style>

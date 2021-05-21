<template>
    <div class="ice-dialog-wrapper" :style="{height:height}">
        <div class="ice-full-absolute" v-if="height"
             style="overflow-y: auto;overflow-x: hidden;background: white;display: flex;flex-direction: column">
            <vue-scroll :ops="{bar:{background:'#000',opacity:0.4,keepShow:true,size:'8px',onlyShowBarOnScroll:true},scrollPanel:{scrollingX:false}}">
                <slot>
                    <ice-dynamic-page v-if="pageId" :page-id="pageId" :page-props="pageProps" ref="page">

                    </ice-dynamic-page>

                    <ice-dialog-view :file-url="fileUrl" :page-props="pageProps" v-if="fileUrl" ref="page">

                    </ice-dialog-view>

                </slot>
            </vue-scroll>
        </div>
        <div v-else style="background: white;height: 100%">
            <slot>
                <ice-dynamic-page v-if="pageId" :page-id="pageId" :page-props="pageProps" ref="page">

                </ice-dynamic-page>
                <ice-dialog-view :file-url="fileUrl" :page-props="pageProps" v-if="fileUrl" ref="page">

                </ice-dialog-view>
            </slot>
        </div>
    </div>
</template>

<script>
    import VueScroll from 'vuescroll'
    import IceDialogView from "./IceDialogView";

    export default {
        name: "IceDialogWrapper",
        props: {
            height: String,
            pageId: String,
            //需要打开的文件路径
            fileUrl: String,
            pageProps: Object
        },
        data() {
            return {}
        },
        methods: {
            getPageData() {
                if (this.$refs.page) {
                    if (this.fileUrl) {
                        if (this.$refs.page.getPageData) {
                            return this.$refs.page.getPageData();
                        } else {
                            return this.$refs.page
                        }
                    }

                    if (this.pageId) {
                        return this.$refs.page.getScriptContext();
                    }

                }
                return null
            }
        },
        created() {

        },
        components: {
            IceDialogView,
            VueScroll
        }
    }
</script>
<style scoped lang="less">
    .ice-dialog-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>

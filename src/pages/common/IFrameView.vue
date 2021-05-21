<template>
    <div class="iframe">
        <iframe class="iframe"
                :src="iframe.src"
                v-loading="loading&&iframe.path==$route.path"
                v-for="iframe in iframes"
                v-show="iframe.path==$route.path">
        </iframe>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "IceIFrameView",
        data() {
            return {
                src: '',
                loading: false,
                iframes: []
            }
        },
        methods: {
            ...mapGetters("permissionStore", ["getPagePermissionByUrl"]),
            async loadPage() {
                this.loading = true
                try {

                    const pageInfo = this.getPagePermissionByUrl()(this.$route.path)
                    const {data: token} = await this.$axios.get("/token/refresh")

                    let pageUrl = pageInfo.pageUrl;
                    let src = ''
                    if (pageUrl.indexOf("?") == -1) {
                        src = pageInfo.pageUrl + "?token=" + token;
                    } else {
                        src = pageInfo.pageUrl + "&token=" + token;
                    }
                    this.iframes.push({src, path: this.$route.path})
                } catch (e) {
                    this.$message.error(e.msg ? e.msg : '页面加载失败')
                }
                this.loading = false
            }
        },
        watch: {
            $route: {
                handler(newValue) {
                    if (this.iframes.findIndex(item => item.path == newValue.path) == -1 && newValue.path.startsWith("/iframe/")) {
                        this.loadPage();
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>
    .iframe {
        margin: 0;
        padding: 0;
        border: none;
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
        overflow-y: hidden;
    }
</style>
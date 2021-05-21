<template>
    <div ref="ref">
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: "IcePageView",
        data() {
            return {}
        },
        methods: {},
        created() {

        },
        mounted() {
            const vueFile = require("@/pages/system/users/UserManage")
            vueFile.default.router = this.$router;
            vueFile.default.store = this.$store;
            new Vue(vueFile.default)
                .$mount(this.$refs.ref)
            /*   this.$mount()*/
        }
        ,
        components: {}
    }
</script>

<style lang="less" scoped>

</style>
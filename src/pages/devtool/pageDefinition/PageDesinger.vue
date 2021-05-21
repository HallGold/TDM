<template>
    <ice-page-editor :cancel="cancel" :save="save" :page-design-data="pageDesignData" ref="editor">

    </ice-page-editor>
</template>

<script>
    import IcePageEditor from "../../../components/common/form/IcePageEditor";
    import {mapMutations} from "vuex";
    import {Loading} from "element-ui";

    export default {
        name: "PageDesinger",
        data: () => {
            return {
                pageDesignData: null,
                id: '',
                loading: false
            }
        },
        methods: {
            ...mapMutations('menuStore', ['collapseChage']),
            cancel() {
                this.$router.back();
                this.collapseChage(false);
            },
            save(pageData, buttons, dataControls) {
                if (pageData) {
                    const {appCode, appName, moduleCode, moduleName, pageCode, pageDesc, pageName,isFlowPage} = pageData.pageConfig
                    if (!pageName) {
                        this.$message.warning("请输入页面名称")
                        return
                    }
                    if (!pageCode) {
                        this.$message.warning("请输入页面编码")
                        return
                    }
                    const loading = Loading.service({target: this.$el, text: '正在努力保存'});
                    this.$axios.post('/devtool/PageDefinition/saveOrUpdate', {
                        oid: this.id,
                        pageName: pageName,
                        pageCode: pageCode,
                        appModule: appCode,
                        funModule: moduleCode,
                        isFlowPage: isFlowPage,
                        desc: pageDesc,
                        pageJsonData: JSON.stringify(pageData),

                    }).then(result => {
                        this.$message.success("保存成功")
                    }).catch(error => {
                        this.$message.error(error.msg)
                    }).finally(_ => {
                        loading.close();
                    })
                }
            },
            loadPage(id) {
                const loading = Loading.service({target: this.$el, text: '正在加载页面配置信息,请稍后...'});
                this.$axios.get('/devtool/PageDefinition/get', {params: {id: id}})
                    .then(result => {
                        this.id = result.data.oid;
                        if (result.data.pageJsonData) {
                            this.pageDesignData = JSON.parse(result.data.pageJsonData);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error.msg);
                    })
                    .finally(_ => {
                        this.$nextTick(_ => {
                            loading.close();
                        })

                    })
            }
        },
        watch: {
            '$route.query.id': {
                handler(newValue) {
                    if (newValue) {
                        this.loadPage(newValue)
                    }
                },
                immediate: true
            }
        },
        mounted() {
            this.collapseChage(true);
        },
        components: {IcePageEditor}
    }
</script>

<style scoped>

</style>
<template>
    <div class="ice-container">
        <general-document-page constantCode="OID_GLPS" :isAddBtnShow="true"></general-document-page>
    </div>
</template>

<script>
    import GeneralDocumentPage from './GeneralDocumentPage';
    export default {
        name: "glps",
        components:{
            GeneralDocumentPage
        },
    }
</script>

<style lang="less" scoped>

</style>
<template>
    <div class="ice-container">
        <general-document-page constantCode="OID_WJGL" :isAddBtnShow="true"></general-document-page>
    </div>
</template>

<script>

    import GeneralDocumentPage from './GeneralDocumentPage';
    export default {
        name: "wjgl",
        components:{
            GeneralDocumentPage
        },
    }
</script>

<style scoped>

</style>
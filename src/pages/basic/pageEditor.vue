<template>
    <div style="width: 100%;height: 100%;position: relative;display: flex">
        <ice-page-editor>

        </ice-page-editor>
     <!--   <table-column-editor>

        </table-column-editor>-->
       <!-- <key-value-editable v-model="prop" :attrs="attrs">

        </key-value-editable>-->
    </div>

</template>

<script>
    import IcePageEditor from "../../components/common/form/IcePageEditor";
    import KeyValueEditable from "../../components/common/form/others/KeyValueEditable";
    import TableColumnEditor from "../../components/common/form/panels/tablePanel/TableColumnEditor";

    export default {
        name: "pageEditor",
        data() {
            return {
                prop: {'height': '10px', 'width': '100px'},
                attrs: ['border', {key: 'height', keyreadonly: true}, 'width']
            }
        },
        methods: {},
        created() {

        },
        mounted() {

        },
        components: {TableColumnEditor, KeyValueEditable, IcePageEditor}
    }
</script>

<style lang="less" scoped>

</style>
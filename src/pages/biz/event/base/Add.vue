<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <ice-query-grid
                        data-url=""
                        :columns=columns
                        ref="grid">
                </ice-query-grid>
        </div>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import detail from "./detail";
    import hasSent from "./hasSent";
    import changeFile from "./changeFile";
    export default {
        name: "Add",
        data(){
            return{
                columns:[
                    {label: '工程师', code: '', },
                    {label: '单位', code: '', },
                ]
            }
        },
        components: {
            IceDialog,
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            detail,hasSent,changeFile
        }
    }
</script>

<style scoped>

</style>
<template>
    <ice-dialog title="数据列表项编辑"
                :visible.sync="selfDialogVisible"
                :buttons="dialogButtons"
                height="500px"
                width="700px">
        <editable-table ref="tablist"
                        min-height="300px"
                        v-model="radiolist"
                        :rules="rules"
                        :grid-index="true"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations">

        </editable-table>
    </ice-dialog>
</template>

<script>
    import EditableTable from "../../panels/tablePanel/EditableTable";
    import IceDialog from "../../../base/IceDialog";

    export default {
        name: "RadiosEditor",
        props: {
            value: Array,
            visible: Boolean
        },
        data() {
            return {
                selfDialogVisible: false,
                dialogButtons: [
                    {
                        name: '确认', click: () => {
                            return new Promise((resolve) => {
                                this.$refs.tablist.validateAll(result => {
                                    if (result) {
                                        this.$emit("radios-update", this.radiolist)
                                        resolve(true)
                                    }
                                    resolve(false)
                                })
                            })

                        }
                    }, {name: '取消', iscannel: true}],
                radiolist: [],
                rules: {
                    label: [{required: true, message: '名称不能为空'}, {repeatable: false, message: '名称不能重复'}],
                    value: [{required: true, message: '值不能为空'}, {repeatable: false, message: '值不能重复'}]
                },
                columns: [
                    {label: 'label名称', code: 'label', type: 'input', editable: true, width: 270},
                    {label: 'value值', code: 'value', type: 'input', editable: true, width: 270},
                    /*{label: '默认选中', code: 'default', type: 'checkbox', editable: true, width: 100}*/
                ],
                buttons: [{name: '新增', commond: 'addRow'}],
                operations: [
                    {name: '删除', commond: 'deleteRow'},
                    {name: '上移', commond: 'moveup'},
                    {name: '下移', commond: 'movedown'}
                ]
            }
        }
        ,
        methods: {}
        ,
        computed: {}
        ,
        watch: {
            visible(newValue) {
                this.selfDialogVisible = this.visible;
                if (newValue) {
                    this.radiolist = this.value;
                }
            },
            selfDialogVisible(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit("update:visible", this.selfDialogVisible);
                }

            },
        }
        ,
        mounted() {

        }
        ,
        components: {
            IceDialog,
            EditableTable
        }
    }

</script>


<style scoped>

</style>

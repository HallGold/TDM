<template>
    <ice-dialog title="数据列表编辑"
                :visible.sync="selfDialogVisible"
                :buttons="dialogButtons"
                height="500px"
                width="700px">
        <editable-table ref="optionList"
                        min-height="300px"
                        v-model="optionList"
                        :rules="rules"
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
        name: "OptionListEditor",
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
                                this.$refs.optionList.validateAll(result => {
                                    if (result) {
                                        resolve(true);
                                        this.$emit("options-update", this.optionList)
                                    } else {
                                        resolve(false);
                                    }
                                })
                            })


                        }
                    }, {name: '取消', iscannel: true}],
                optionList: [],
                rules: {
                    text: [{required: true, message: '显示文本'}, {repeatable: false, message: '显示文本不能重复'}],
                    code: [{required: true, message: '编码值不能为空'}, {repeatable: false, message: '编码值不能重复'}]
                },
                columns: [
                    {label: '显示文本', code: 'text', type: 'input', editable: true, width: 270},
                    {label: '编码值', code: 'code', type: 'input', editable: true, width: 270},
                    /*{label: '默认选中', code: 'default', type: 'checkbox', editable: true, width: 100}*/
                ],
                buttons: [{name: '新增', commond: 'addRow'}],
                operations: [
                    {name: '删除', commond: 'deleteRow'},
                    {name: '上移', commond: 'moveup'},
                    {name: '下移', commond: 'movedown'}
                ]
            }
        },
        methods: {},
        computed: {},
        watch: {
            visible(newValue) {
                this.selfDialogVisible = this.visible;
                if (newValue) {
                    this.optionList = this.value;
                }
            },
            selfDialogVisible(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit("update:visible", this.selfDialogVisible);
                }

            },
        },
        mounted() {

        },
        components: {IceDialog, EditableTable}
    }

</script>


<style scoped>

</style>

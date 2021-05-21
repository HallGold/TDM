<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                data-url="/pro/ProBaseMaintainMember/list"
                :query=query
                :columns="columns"
                choose-item="multiple"
                @selection-change="handleSelectionChange"
                ref="mainQueryGrid">
        </ice-query-grid>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "maintainMenber",
        components: {IceQueryGrid},
        props: {
            selectUsers: Object
        },
        data() {

            let ncolumns = [
                {label: "oid", code: 'oid', hidden: true},
                {label: '工程师', code: 'username'},
                {label: '单位', code: 'unitname'},
                {label: '参与人code', code: 'usercode', hidden: true},
            ];
            return {
                query: [
                    {type: 'input', label: '工程师', code: 'username', value: '',},
                    {type: 'input', label: '单位', code: 'unitname', value: '',},
                ],
                columns: ncolumns,
            }
        },
        methods: {
            show() {
                this.$set(this.buttons[0], "disabled", true);
                this.$refs.mainQueryGrid.refresh();
                this.$axios.get("/pro/ProBaseMaintainMember/codeList", {
                    "params": {
                        tendId: this.tendId
                    }
                }).then(success => {
                    console.log(this.selectedPersion)
                    this.selectedPersion = success.data;
                    this.$set(this.buttons[0], "disabled", false);
                }).catch(error => {
                    this.selectedPersion = [];
                    this.$message.error('数据初始化失败。');
                })
            },

            handleSelectionChange(rows) {
                //this.selectUsers = rows.map(item => item.username).join(',');
                /* rows.forEach(item=>{
                     let
                 });*/
                this.$emit('selection-change', rows);

            },

        }
    }
</script>

<style scoped>

</style>
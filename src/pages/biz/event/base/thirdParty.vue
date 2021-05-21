<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                data-url="pro/ProBaseCoopUnit/list"
                :columns="columns"
                choose-item="multiple"
                @selection-change="handleSelectionChange"
                ref="mainQueryGrid">
        </ice-query-grid>
        <div class="button_box">
            <el-button class="el_button" @click="saveMeeage">保存</el-button>
            <el-button class="el_button" @click="closeDialog">关闭</el-button>
        </div>

    </div>

</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    export default {
        name: "thirdParty",
        components: {IceQueryGrid},

        data() {

            let ncolumns = [
                {label: "oid", code: 'oid',hidden: true},
                {label: '第三方厂商', code: 'unitname', width: 120},
                {label: '企业性质', code: 'quality', width: 120},
                // {label: '处理人信息', code: 'contacterInfos', width: 120},
            ];
            return {
                shut: "",
                /* query: [
                     {type: 'input', label: '工程师', code: 'username', value: '',},
                     {type: 'input', label: '单位', code: 'unitname', value: '',},
                 ],*/
                columns: ncolumns,
            }
        },
        methods: {
            saveMeeage(){
                this.$emit('change',"shut");
            },
            closeDialog(){
                this.$emit('change',"shut");
            },
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
                // this.$emit('selection-change',rows);

            },

        }
    }
</script>

<style scoped>
    .button_box{
        padding: 15px 0 15px 235px;

    }
    .el_button {
        display: inline-block;
        width: 60px;
        color: #FFFFFF;
        background-color: #0091B0;
        border-color: #0091B0;
    }
</style>
<template>
    <ice-pop-selector style="box-sizing: border-box"
                      title="请选择岗位"
                      text-prop="name"
                      :pagination="false"
                      :chooseItem="chooseItem"
                      code-prop="code"
                      :mode="mode"
                      :query="queryWork"
                      :columns="columnsWork"
                      data-url="/permission/work_position/list"
                      ref="selectPosition"
                      @select-confirm="selectConfirmPosition"></ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    export default {
        name: "workPositionSelector",
        components: {IcePopSelector},
        props:{
            chooseItem:{//单选或多选---single:单选，multiple:多选
                type:String,
                default:'single'
            },
            mode:{//是否以选择框的形式展示--'input', 'onlySelect', 'readonly', 'hidden'
                type:String,
                default: 'hidden'
            }
        },
        data(){
            return{
                queryWork: [
                    {type: 'input', label: '岗位名称', code: 'name', value: ''},
                    {type: 'input', label: '岗位编码', code: 'code', value: ''},
                ],
                columnsWork: [
                    {code: "oid", hidden: true},
                    {label: '岗位名称', code: 'name', width: 200},
                    {label: '岗位编码', code: 'code', width: 120},
                    {label: '描述', code: 'desp', width: 100},

                ],
            }
        },
        methods:{
            /**
             * 选择的行数据
             * @param rows
             */
            selectConfirmPosition(rows){
                this.$emit("choosePosition",rows);
            },
            /**
             * 打开弹窗
             */
            openDialog(){
                this.$refs.selectPosition.openDialog();
            }
        }
    }
</script>

<style scoped>

</style>
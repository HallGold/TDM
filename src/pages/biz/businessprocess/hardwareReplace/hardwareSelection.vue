<template>
    <ice-pop-selector
            :gridData="gridData"
            textProp="name"
            codeProp="oid"
            ref="select"
            mode="hidden"
            :height="400"
            :gridIndex="true"
            @select-confirm="selectConfirm"
            @select-cannel="selectCannel"
            :selections="selections"
            :query="query"
            :columns="columns"
            dialog-width="1000px">
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    export default {
        name: "hardwareSelection",
        components: {IcePopSelector},
        props:{
            gridData:{
                type:Array,
                default:()=>[]
            },
            selections:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            return{
                query:[
                    {label: '设备类型',code: 'categoryText',type:'input',value:'',exp:'like'},
                    {label: '设备名称',code: 'name',type:'input',value:'',exp:'like'},
                ],
                columns:[
                    {code:'oid',hidden:true},
                    {label: '设备类型',code: 'categoryText',width:100},
                    {label: '设备子类',code: 'childTypeText',width:100},
                    {label: '设备名称',code: 'name',width:130},
                    {label: '设备编号',code: 'devSn',width:120},
                    {label: '资产编号', code: 'sn',width:120},
                    {label: '保密编号', code: 'secretSn',width:100},
                ],
            }
        },
        methods:{
            /**
             * 保存
             */
            selectConfirm(rows){
                this.$emit("getData",rows)
            },
            /**
             * 取消
             */
            selectCannel(){
                this.$emit("selectCannel")
            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.$refs.select.openDialog();
                this.$nextTick(() => {
                    this.$refs.select.reDoSelection();
                })
            },
        }
    }
</script>

<style scoped>

</style>
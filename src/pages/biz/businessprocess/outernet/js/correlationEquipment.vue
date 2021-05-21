<template>
    <div style="width: 100%">
        <ice-query-grid :gridData="devData"
                        :columns="columns"
                        ref="devGrid"
                        :minHeight="200"
                        :chooseItem="chooseItem"
                        :pagination="false"
                        @selection-change="devRows"></ice-query-grid>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="true"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import DevSelect from "../../../dev/devSelect";
    export default {
        name: "correlationEquipment",
        props:{
            chooseItem:{//是否多选，默认多选
                type:String,
                default:'multiple'
            },
            columns:Array,  //列表的列表字段
            devData:Array,  //列表的table数组
        },
        mixins:[bizComm,devComm],
        components: {DevSelect, IceQueryGrid},
        data(){
            return{
                devList:[],             //选择的数据集合--用于列表删除操作
                devSelectShow:false,    //设备选择弹窗的开关属性
                devId:'devId',              //用于关联设备和安装介质的参数
            }
        },
        methods:{
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data){
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].devId = data[i].oid;
                        if (this.findSameRowByCode(this.devData, data[i].devId, this.devId) == -1) {
                            this.devData.push(data[i]);
                        }
                    }
                    resolve();
                    this.devSelectShow = false;
                });
            },
            /**
             * 列表多选框返回所选择的行信息
             * @param rows
             */
            devRows(rows) {
                this.devList = rows;
            },
            /**
             * 关联设备--删除
             */
            deleteItem(){
                if (this.devList.length > 0) {
                    this.deletes(this.devData, this.devList);
                    this.devList = [];
                }else{
                    this.$message.warning('请选择需要删除的关联设备');
                }
            },
            /**
             * 关联设备--新增
             */
            addItem(){
                this.devSelectShow = true;
                this.$nextTick(()=>{
                    this.$refs.devSelect.openDialog();
                });
            },
        },
        mounted() {

        }

    }
</script>

<style scoped>

</style>
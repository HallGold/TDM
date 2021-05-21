<template>
    <el-dialog v-dialog-drag
               title="同步到数据库"
               custom-class="ice-dialog"
               centerz
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div>
             <span>
                    选择数据源
             </span>
            <div style="display: inline-block;width: 60%">
                <el-autocomplete
                        class="inline-input"
                        v-model="inputText"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        @select="handleSelect"
                ></el-autocomplete>
            </div>
            <div style="display: inline-block;">
                <el-button @click="startSync">开始同步</el-button>
            </div>
        </div>
        <div class="ice-button-bar ">
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "syncToDatabaseEdit",
        data(){
            return{
                dialogVisible:false,
                inputText:'',
                restaurants:[],         //数据源数据
                dsId:'',                //选中的数据源ID
                tableIds:'',            //表ID
            }
        },
        methods:{
            querySearch(queryString,cb){
                let restaurants = this.restaurants;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            handleSelect(item){
                this.dsId = item.oid;
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.dsCode.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            /**
             * 开始同步
             */
            startSync(){
                if(this.dsId){
                    this.$axios.post("/permission/res/table/outer/sync_tbles_to_db",{dsId:this.dsId,tableIds:this.tableIds}).then(success=>{
                        this.$message.success("操作成功");
                    }).catch(error=>{
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    })
                }else{
                    this.$message.warning("请选择数据源");
                }

            },
            /**
             * 取消
             */
            closeDialog(){
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(){
                this.dialogVisible = true;
                this.inputText = '';
                this.$nextTick(()=>{
                    this.$axios.get("/permission/res/ds/outer/get/ds_config_infos",{params:{"loadDisabled":false}}).then(success=>{
                        this.restaurants = success.data;
                        this.restaurants.forEach(item=>{
                            item.value = item.dsName;
                        });
                    }).catch(error=>{
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <el-dialog v-dialogDrag
               title="部门选择"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="600px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div style="max-height: 400px;overflow-x: hidden;overflow-y: scroll">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <div style="height: 400px;background-color: #ffffff">
                <el-tree :props="defaultProps"
                         :data="dataApp"
                         :check-strictly="true"
                         :default-expanded-keys="treeDefault"
                         :default-checked-keys="treeSelect"
                         :filter-node-method="filterNode"
                         node-key="id"
                         @check-change="handleCheckChange"
                         ref="tree"
                         show-checkbox>
                </el-tree>
            </div>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save" :disabled="this.dataApp.length<1">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    export default {
        name: "appDeptEdit",
        data(){
            return{
                filterText:'',
                defaultProps: {//树形属性
                    label: 'deptName',
                    children: 'children'
                },
                dataApp:[],     //树形节点
                treeDefault:[], //默认展开的节点
                treeSelect:[],  //属性默认勾选的节点
                dialogVisible:false
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods:{
            handleCheckChange(data,check,c){
                data.selected = check;
            },
            /**
             *保存
             */
            save(){
                let appObj = this.dataApp[0];
                this.$axios.post("/permission/res/app/outer/save/menu_dept_rel",appObj).then(success=>{
                    this.$message.success("保存成功");
                    this.closeDialog();
                }).catch(error=>{
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             *取消
             */
            closeDialog(){
                this.treeDefault = [];
                this.treeSelect = [];
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(menuListId){
                this.dialogVisible = true;
                this.$nextTick(()=>{
                    this.refresh(menuListId);
                });
            },
            /**
             * 刷新数据以及加载树形数据
             * @param menuListId
             */
            refresh(menuListId){
                let _this = this;
                this.$axios.get("/permission/res/app/outer/get/menu_dept_rel",{params:{"menuListId":menuListId}}).then(success=>{
                    _this.dataApp = success.data;
                    _this.appListLoad(this.dataApp);
                    if(_this.dataApp[0]){
                        _this.treeDefault.push(_this.dataApp[0].id);
                    }
                }).catch(error=>{
                    _this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 展开已经都选的值
             * @param arr
             */
            appListLoad(arr) {
                arr.forEach(item => {
                    if (item.selected) {
                        this.treeSelect.push(item.id);
                    }
                    if (item.children) {
                        this.appListLoad(item.children);
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.deptName.indexOf(value) !== -1;
            }
        }
    }
</script>

<style scoped>

</style>

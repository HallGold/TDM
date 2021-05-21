<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="角色人员"
                        :data-url="'/bpm/AcRoleUser/list?roleId='+role.oid"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        chooseItem="multiple"
                        @selection-change="handleSelectionChange"
                        :buttons="buttons" ref="grid2">
        </ice-query-grid>

        <ice-persion-selector style="padding: 0 2%;box-sizing: border-box"
                              label="审核人"
                              title="请选择"
                              text-prop="name"
                              code-prop="code"
                              mode="hidden"
                              choose-item="multiple" ref="selectUser"
                              @select-confirm="selectUserConfirm"
                              @select-cannel="cancelSelectUser">
        </ice-persion-selector>

    </div>
</template>



<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";


    export default {
        name: 'AcRoleUserControl',
        props:{
            role:{
                type: Object,
                default:{}
            }
        },
        data() {
            return {
                elTable:[],
                selectAssignerColumns: [{label: '姓名', code: 'name', width: 120},
                    {label: '部门', code: 'dept', width: 120,},
                    {label: '岗位', code: 'city', width: 120,}],
                selectAssignerListData: [{name: 'tianding', dept: '信息部', job: '主任'}, {
                    name: 'lihuan',
                    dept: '综合部',
                    job: '副主任'
                }, {name: 'shenlong', dept: '研发部', job: '部长'}],

                query: [
                    {type: 'input', label: '用户账号', code: 'userAccount'},
                    {type: 'input', label: '用户名', code: 'userName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '用户账号', code: 'userAccount', width: 180},
                    {label: '用户名', code: 'userName', width: 200}
                ],
                operations: [
                    {name: '删除', callback: this.deleteAcl}
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.selectUserVisible=true;
                        this.$refs.selectUser.openDialog();
                       }
                   },{name: '删除', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                       this.deleteMore();
                    }
                  }
                ],
                tittle:''
            }
        },
        methods: {
            cancelSelectUser(){
                this.$refs.selectUser.cleanColumnSelect();
            },
            /**列表多选框返回所选择的行信息*/
            handleSelectionChange(rows) {
                this.elTable = rows;
            },
            selectUserConfirm(rows, texts, values) {
                this.selectUserVisible = false;
                let list=[];
                rows.forEach(item=>{
                    let obj={
                        userId:item.oid,
                        userAccount:item.code,
                        userName:item.name,
                        roleId:this.role.oid,
                    };
                    list.push(obj);
                })
                this.$axios.post('/bpm/AcRoleUser/saveList', {roleUserList:list}).then(result => {
                    this.$message.success("新增成功");
                    this.$refs.grid2.refresh();
                }).catch(error => {
                    this.$message.error("出错啦")
                })

                this.$refs.selectUser.cleanColumnSelect();
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/AcRoleUser/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid2.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
            },
            /**删除*/
            deleteMore() {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    // debugger
                    if (this.elTable.length != 0) {
                        let id = '';
                        this.elTable.forEach(item => {
                            if (this.elTable.length == 1) {
                                id = item.oid;
                            } else {
                                if (item != this.elTable[this.elTable.length - 1]) {
                                    id += item.oid + ',';
                                } else {
                                    id += item.oid;
                                }
                            }
                        });
                        this.$axios.delete("/bpm/AcRoleUser/del", {"params": {"id": id}}).then(success => {
                            this.$message.success(success.data?success.data:'删除成功');
                            this.$refs.grid2.refresh();
                        }).catch(error => {
                            this.$message({
                                type:'error',
                                message:error.msg
                            })
                        });
                    }
                })

            }
        },
        watch:{
            role(){
                // alert(JSON.stringify(this.role));
            }
        },
        components: {
            IceQueryGrid,
            IcePersionSelector,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>

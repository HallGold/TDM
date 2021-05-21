<template>
    <el-container>
        <el-main>
            <ice-query-grid
                    ref="iceGrid"
                    :dataUrl="dataUrl"
                    :operationsWidth="200"
                    :query="query"
                    :pagination="false"
                    :columns="columns"
                    :operations="operations"
                    :buttons="buttons"></ice-query-grid>
            <template v-if="openFlag">
                <comm-select ref="commSelect" :multiple="true" :userTab="true"
                             @beforeClose="beforeSelectClose"></comm-select>
            </template>
        </el-main>
    </el-container>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import CommSelect from "@/pages/system/comm/CommSelect";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";

    export default {
        name: "RoleAccreditUser",
        mixins: [OrgComm],
        components: {IceQueryGrid, CommSelect},
        data() {
            return {
                openFlag: false,
                dataUrl: "",
                curTableData: {},
                columns: [],
                query: [{type: 'input', label: '角色', code: 'name', model: ``, placeholder: `输入角色名称搜索`},],
                buttons: [],
                operations: []
            };
        },
        methods: {
            initControls() {
                this.initButtons();
                this.initColumns();
                this.dataUrl = this.ACTIONS_ENUM.ROLE.LOAD_ORG_ENABLED_ROLES.URL();
            },
            initButtons() {
            },
            initColumns() {
                this.columns = [
                    {label: '名称', code: 'name', width: 200},
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '描述', code: 'desp', width: 300},
                    {label: '备注', code: 'remark', width: 300}
                ];
                this.operations = [
                    {name: '授权', callback: this.accreditClickHandler},
                    {name: '查看已授权', callback: this.authorize}
                ];
            },
            /**查看已授权*/
            authorize(){

            },
            accreditClickHandler(o) {
                //授权
                this.curTableData = o
                let _this = this;
                this.loadUsers(o.oid).then(res => {
                    _this.openSelect({users: res.data});

                }).catch(res => {
                    _this.openFlag = false;
                    _this.$message.error("加载授权错误! errorCode = " + res.code);
                });
            },
            openSelect(data){
                this.openFlag = true;
                this.$nextTick(() => {
                    this.$refs.commSelect.open(data);
                });
            },
            closeSelect() {
                this.openFlag = false;
            },
            beforeSelectClose(obj) {
                if (!!obj) {
                    let userCodes = [];
                    for (let i in obj) {
                        let depts = obj[i];
                        for (let j in depts) {
                            let userArr = depts[j];
                            for (let k in userArr) {
                                userCodes.push(userArr[k].code);
                            }
                        }
                    }
                    let _this = this;
                    this.axios(this.ACTIONS_ENUM.ROLE_USER.SAVE, {
                        deleteOld: true,
                        roleId: this.curTableData.oid,
                        userCodes: userCodes.toString()

                    }, [res => {
                        _this.closeSelect();
                        _this.$message.success("授权成功!");
                    }, res => {
                        _this.closeSelect();
                        _this.$message.error("授权失败! errorCode = " + res.code);
                    }, res => {
                        _this.closeSelect();
                        _this.$message.error("授权失败! errorCode = " + res.code);
                    }]);
                }else{
                    this.closeSelect();
                }
            },
            loadUsers(roleId) {
                let _this = this;
                //根据角色获取授权用户
                return new Promise((resolve, reject) => {
                    _this.axios(_this.ACTIONS_ENUM.ROLE_USER.LOAD, {roleId: roleId}, [res => {
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }])
                });
            },
        },
        mounted() {
            this.initControls();
        },
    }
</script>

<style scoped>

</style>

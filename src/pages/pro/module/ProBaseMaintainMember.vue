<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid data-url="/pro/ProBaseMaintainMember/list"
                        :query="query"
                        :columns="columns"
                        :buttons="buttons"
                        choose-item="multiple"
                        :beforeBindData="beforeBindData"
                        @selection-change="handleSelectionChange"
                        ref="mainQueryGrid">
        </ice-query-grid>
        <ice-persion-selector
                choose-item="multiple"
                ref="persionPop"
                mode="hidden"
                :selectedPersion="selectedPersion"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";

    export default {
        name: "ProBaseMaintainMember",
        components: {IcePersionSelector, IceQueryGrid},
        props: {
            tendId: String
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: 'tendId', code: 'tendId', hidden: true},

                {label: '用户姓名', code: 'username', width: 120},
                {label: '用户编码', code: 'usercode', width: 100},
                {label: '单位名称', code: 'unitname', width: 120},
                {label: '单位CODE', code: 'unitcode', width: 100},
                {label: '是否合作单位', code: 'isCoop', width: 100, mapTypeCode: "YES_NO"},
                {label: '创建人', code: 'createUser', width: 100},
                {label: '创建时间', code: 'createDate', width: 120}];
            return {
                query: common.toQuery(ncolumns, [
                    {
                        type: 'static', value: () => {
                            return this.tendId;
                        }, code: 'tendId'
                    }
                ]),
                columns: ncolumns,
                buttons: [{
                    name: '新增',
                    icon: 'el-icon-plus',
                    type: 'primary',
                    callback: this.addCallback
                },
                    {
                        name: '移除',
                        disabled: true,
                        icon: 'el-icon-minus',
                        type: 'primary',
                        callback: this.removeCallback
                    }],
                selectIds: '',
                selectedPersion: [],
                showList:[],//用来存放已选择的成员
                arr: [],                                 //用来判断移除的数组是否为空,如果为空则移除按钮灰选
            }
        },
        methods: {
            /**
             * 清除回显的数据
             */
            clearData() {
                this.selectedPersion = [];
            },
            /**
             * 拿到列表的数据--用于回显
             * @param data
             * @returns {*}
             */
            beforeBindData(data) {
                this.showList = data;
                return data;
            },
            /**
             * 打开弹窗
             */
            show() {
                this.refresh();
                this.selectedPersion = [];
            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.refresh();
            },
            /**
             * 选择table列表行所带出的数据
             * @param rows
             */
            handleSelectionChange(rows) {
                this.arr = rows;
                this.$set(this.buttons[1], "disabled", this.arr.length == 0);
                this.selectIds = rows.map(item => item.oid).join(',');
            },
            selectUserConfirm(rows) {
                if (rows.length == 0) {
                    this.$message.error('请选择用户');
                    return;
                }
                let arrs = [];
                rows.forEach(item => {
                    arrs.push({
                        tendId: this.tendId,
                        username: item.name,
                        usercode: item.code,
                        unitname: item.deptShortName,
                        unitcode: item.deptCode,
                        isCoop: 0
                    })
                });
                this.$axios.post("/pro/ProBaseMaintainMember/saveList", {list: JSON.stringify(arrs)})
                    .then(result => {
                        this.$message.success("保存成功");
                        this.refresh();
                    }).catch(error => {
                    this.$message.error(error.msg);
                });

            },
            /**
             * 新增
             */
            addCallback() {
                this.clearData();
                this.showList.forEach(item => {
                    this.selectedPersion.push(item.usercode);
                });
                this.$nextTick(()=>{
                    this.$refs.persionPop.openDialog();
                })
            },
            /**
             * 移除
             */
            removeCallback() {
                this.$confirm('确定要移除吗？移除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProBaseMaintainMember/dels", {
                        "params": {
                            "ids": this.selectIds,
                            "tendId": this.tendId,
                            disabled: true,
                        }
                    })
                        .then(result => {
                            this.arr = [];
                            this.$message.success("操作成功");
                            this.selectIds = '';
                            this.show();
                            this.$set(this.buttons[1], "disabled", this.arr.length == 0);
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
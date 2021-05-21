<template>
    <div class="outer">
        <div class="inner">
            <el-select style="width: 300px" v-model="selectValue">
                <el-option v-for="item in selectArr"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-button style="margin-left: 15px" type="primary" @click="clearCache">清除缓存</el-button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "cacheManage",
        data() {
            return {
                selectValue: '',
                selectArr: [
                    {label: '全部缓存', value: ''},
                    {label: '全局通用缓存', value: 'commonCacheService'},
                    {label: '数据表信息缓存', value: 'tableCacheService'},
                    {label: '后台服务信息缓存', value: 'serviceCacheService'},
                    {label: '系统页面配置信息缓存', value: 'framePageCacheService'},
                    {label: '组织机构缓存', value: 'deptCacheService'},
                    {label: '用户信息缓存', value: 'userCacheService'},
                    {label: '用户权限信息缓存', value: 'authCacheService'}
                ]
            }
        },
        methods: {
            selectLabel(arr, val) {
                let lab = '';
                arr.forEach(item => {
                    if (item.value == val) {
                        lab = item.label;
                    }
                });
                return lab;
            },

            /**
             * 清除缓存
             */
            clearCache() {
                let str = '';
                let lab = '';
                if (this.selectValue) {
                    lab = this.selectLabel(this.selectArr, this.selectValue);
                    str = '确定清空【' + lab + '】缓存吗'
                } else {
                    str = '未选择缓存则清空所有缓存，请慎重操作！'
                }
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get("/permission/system/cache/clear_cache", {params: {cacheName: this.selectValue}}).then(success => {
                        this.$message.success("清除缓存成功");
                        this.selectValue = '';
                    }).catch(error => {
                        this.$message.error(error.msg);
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .outer {
        padding: 15px;
        display: flex;
        width: 100%;
        background-color: #ffffff;
    }

    .inner {
        flex-grow: 1;
    }
</style>

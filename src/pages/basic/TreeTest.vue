<template>
    <ice-tree-grid data-url="/query"
                   load-url="/tree"
                   :columns="columns"
                   :buttons="buttons">
    </ice-tree-grid>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";

    export default {
        name: 'TreeTest',
        data() {
            return {
                columns: [{label: '姓名', code: 'name', width: 120},
                    {label: '省份', code: 'province', width: 120, mapTypeCode: 'provinceMap'},
                    {label: '市区', code: 'city', width: 120, mapTypeCode: 'cityMap'},
                    {label: '地址', code: 'address', width: 420},
                    {label: '邮编', code: 'zip', width: 120}, {
                        label: '省份',
                        code: 'province',
                        width: 120,
                        mapTypeCode: 'provinceMap'
                    },
                    {label: '市区', code: 'city', width: 120, mapTypeCode: 'cityMap'},
                    {label: '地址', code: 'address', width: 420},
                    {label: '邮编', code: 'zip', width: 120}, {
                        label: '省份',
                        code: 'province',
                        width: 120,
                        mapTypeCode: 'provinceMap'
                    },
                    {label: '市区', code: 'city', width: 120, mapTypeCode: 'cityMap'},
                    {label: '地址', code: 'address', width: 420},
                    {label: '邮编', code: 'zip', width: 120}, {
                        label: '省份',
                        code: 'province',
                        width: 120,
                        mapTypeCode: 'provinceMap'
                    },
                    {label: '市区', code: 'city', width: 120, mapTypeCode: 'cityMap'},
                    {label: '地址', code: 'address', width: 420},
                    {label: '邮编', code: 'zip', width: 120}],
                /*operations: [{name: '删除', callback: this.deleteItem}],*/
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.deleteItem}]

            };
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            }
        },
        components: {
            IceTreeGrid,
            IceTree
        }
    };
</script>

<style lang="less" scoped>

</style>

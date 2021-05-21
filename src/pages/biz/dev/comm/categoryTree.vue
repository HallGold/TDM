<template>
    <div class="content-filled">
        <ice-tree v-if="ENUMS.CATEGORY_DATA"
                  :treeData="ENUMS.CATEGORY_DATA"
                  label-prop="name"
                  :show-tree-checkbox="showTreeCheckbox"
                  check-strictly
                  value-prop="code"
                  @node-click="handleNodeClick"
                  @node-check="check">
        </ice-tree>
    </div>
</template>

<script>
    import IceTree from "@/components/common/base/IceTree";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";

    export default {
        label: "设备类型树",
        mixins: [bizComm, devComm],
        components: {
            IceTree
        },
        props: {
            showTreeCheckbox: {
                type: Boolean,
                default: true
            },
            checkStrictly:{
                type: Boolean,
                default: true
            }
        },
        data() {
            return {};
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            },
            check(changeNode, nodeStatus) {

            }
        },
        mounted() {
            this.requestCategoryData();
        }
    }
</script>

<style scoped>

</style>
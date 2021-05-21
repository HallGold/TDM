<template>
    <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
        <ice-tree load-url="/tree"

                  @node-click="handleNodeClick">

        </ice-tree>
    </div>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'

    export default {
        data() {
            return {};
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            }
        },
        components: {
            IceTree
        }
    };
</script>

<style scoped>

</style>
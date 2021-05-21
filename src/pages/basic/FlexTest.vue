<template>
    <ice-dragable-flex :preSide.sync="preSide" :postSide.sync="postSide">
        <ice-dragable-flex :preSide="100" :postSide="0" direction="row">

        </ice-dragable-flex>
    </ice-dragable-flex>
</template>

<script>
    import IceDragableFlex from "../../components/common/base/IceDragableFlex";

    export default {
        name: "FlexTest",
        data() {
            return {
                preSide: 100,
                postSide: 0
            }
        },
        methods: {},
        computed: {},
        watch: {},
        mounted() {

        },
        components: {IceDragableFlex}
    }

</script>


<style scoped>

</style>

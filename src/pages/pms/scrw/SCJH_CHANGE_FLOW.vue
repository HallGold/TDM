<template>
    <div>
        <scjh-form :isChange="true"></scjh-form>
    </div>
</template>

<script>
    import scjhForm from './scjhForm.vue'

    export default {
        components: {

          scjhForm,
        },

        data() {
            return {}
        },

        computed: {

        },
        created() {

        },

        methods: {

        },

        watch: {

        },

    }

</script>

<style lang="less" scoped>
    .msg {
        margin-bottom: 10px;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        .item {
            float: left;
            font-size: 14px;
            white-space: nowrap;

            label {
                color: #555;
            }

            span {
                font-size: 14px;
                margin-right: 20px;
                white-space: nowrap;
            }
        }

    }
</style>

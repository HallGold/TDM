<template>
    <el-input :placeholder="placeholder"
              :value="value"
              @input="input"
              type="textarea"
              rows="4"
              resize="none"
              :showWordLimit="true"
              maxlength="200"></el-input>
</template>

<script>
    export default {
        name: "questionAdditionInput",
        props: {
            value: String,
            placeholder: String
        },
        methods: {
            input(value) {
                this.$emit("input", value)
            }
        },
        beforeDestroy() {
            this.$emit("input", null)
        }
    }
</script>

<style scoped>

</style>
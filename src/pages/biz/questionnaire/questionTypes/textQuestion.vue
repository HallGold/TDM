<template>
    <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入内容"
              :value="value" @input="change"
              :showWordLimit="true"
              resize="none"
              maxlength="200"></el-input>
</template>

<script>
    export default {
        name: "textQuestion",
        inheritAttrs: false,
        props: {
            value: String
        },
        methods: {
            change(value) {
                this.$emit('change', value)
            },
            getResult() {
                return {
                    answerCode: this.value,
                    answerText: this.value,
                }
            },
            validate() {
                return this.value ? true : false
            }
        }
    }
</script>

<style scoped>

</style>
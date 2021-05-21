<template>
    <div>
        <el-rate :value="value" @input="change" :texts="options.map(item=>item.optionName)" show-text :max="options.length"></el-rate>
        <div>
            <slot></slot>
        </div>
    </div>

</template>

<script>
    export default {
        name: "scoreQuestion",
        inheritAttrs: false,
        props: {
            value: Number,
            options: {
                type: Array,
                default: _ => []
            },
            addition: [String, Object]
        },
        methods: {
            change(value) {
                this.$emit('change', value)
            },
            getResult() {
                const selected = this.options.find(item => item.optionCode == this.value)
                return {
                    answerCode: this.value == 0 ? null : this.value,
                    answerText: selected ? selected.optionName : null,
                    addition: this.addition
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
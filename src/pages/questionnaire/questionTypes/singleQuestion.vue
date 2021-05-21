<template>
    <div class="question-exam">
        <el-radio-group :value="value" @input="change">
            <el-radio class="radio" :label="item.optionCode" v-for="item in options" :key="item.optionCode">{{item.optionName}}
            </el-radio>
        </el-radio-group>
        <div>
            <slot></slot>
        </div>
    </div>

</template>

<script>
    export default {
        name: "singleQuestion",
        inheritAttrs: false,
        props: {
            value: [Number, String],
            options: {
                type: Array,
                default: _ => []
            },
            addition: [String, Object]
        },
        data() {
            return {}
        },
        methods: {
            change(value) {
                this.$emit('change', value)
            },
            getResult() {
                const selected = this.options.find(item => item.optionCode == this.value);
                return {
                    answerCode: this.value,
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
    .radio {
        margin:10px 0 0 20px;
        line-height: 20px !important;
        width: 90% !important;
        word-wrap: break-word !important;
        word-break: break-all !important;
        overflow: hidden !important;
        display:flex;
        white-space:normal;
    }
</style>
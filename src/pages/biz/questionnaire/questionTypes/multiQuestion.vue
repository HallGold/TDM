<template>
    <div>
        <el-checkbox-group :value="value" @input="change">
            <el-checkbox class="checkbox" :label="item.optionCode" v-for="item in options" :key="item.optionCode">{{item.optionName}}
            </el-checkbox>
        </el-checkbox-group>
        <div>
            <slot></slot>
        </div>
    </div>

</template>

<script>
    export default {
        name: "multiQuestion",
        inheritAttrs: false,
        props: {
            value: {
                default: () => [],
                type: Array
            },
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
                return {
                    answerCode: this.value.join(","),
                    answerText: this.value.map(item => {
                        const selected = this.options.find(op => op.optionCode == item);
                        return selected ? selected.optionName : null
                    }).join(","),
                    addition: this.addition
                }
            },
            validate() {
                return this.value ? this.value.length>0 : false
            }
        }
    }
</script>

<style scoped>
.checkbox{
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
<template>
    <div>
        <el-input type="number" placeholder="请输入"
                  v-model="number"
                  v-bind="$attrs"
                  clearable
                  style="text-align: right;"
                  @change="handlechange"
        >
            <template slot="append" v-if="unit">{{unit}}</template>
            <slot></slot>
        </el-input>
    </div>
</template>

<script>
    export default {
        name: "PmsInput",
        model: {
            prop: 'value',
            event: 'input'
        },
        props: {
            value: "",
            // 最大输入长度
            maxlen: {
                default: 100
            },
            unit: {
                default: ''
            },
            // 数值精度
            precision: {
                default: 0
            },
        },
        data() {
            return {
                number: this.value
            }
        },
        watch: {
            value() {
                this.number = this.value
            }
        },
        methods: {
            change(val) {
                // console.log(val)
                this.number = val.slice(0, this.maxlen);
                this.$emit("input", this.number);
            },
            handlechange(val) {
                console.log(val, 'val');
                let arr = val.split('.');
                let len = this.maxlen - this.precision;
                let int = "9".repeat(len);
                let decimals = '9'.repeat(this.precision)
                let max = int + '.' + decimals;
                let min = 0 + '.' + '0'.repeat(this.precision);
                let henum = val;
                if (val > max * 1) {
                    henum = max;
                }
                if (!val || !val.trim()) {
                    henum = min;
                }
                // let xs = arr[1] ? '.' + arr[1] : '';
                // let num = arr[0].toString().substr(-1, len);
                // let henum = ((num + xs) * 1).toFixed(this.precision);
                console.log(henum, 'henum')
                henum = (henum*1).toFixed(this.precision);
                this.$emit("input", henum);
                this.$emit("change", henum);
            },

        }
    }
</script>

<style scoped>

</style>

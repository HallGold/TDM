<template>
    <div>
        <el-date-picker
                v-model="value2"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"
                :picker-options="pickerOptions">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        name: "dateSelect",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: [Array]
        },
        data() {
            let now = new Date();
            let year = now.getFullYear();
            const initstart = year + '-1-1';
            const initend = year + '-12-31';
            return {
                value2: this.value,
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '本周',
                            onClick(picker) {
                                let now = new Date();
                                let day = now.getDay();

                                const end = new Date();
                                const start = new Date();
                                start.setTime(now.getTime() - 3600 * 1000 * 24 * (day-1));
                                end.setTime(now.getTime() + 3600 * 1000 * 24 * (7 - day));
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本月',
                            onClick: (picker) => {
                                let now = new Date();
                                let daynum = this.$utils.getDayOfMonth(now);
                                let mounth = now.getMonth() + 1;
                                let year = now.getFullYear();
                                const end = year + '-' + mounth + '-' + daynum;
                                const start = year + '-' + mounth + '-1';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本季度',
                            onClick: (picker) => {
                                let now = new Date();
                                let mounth = now.getMonth() + 1;
                                let index = (mounth % 3) > 0 ? (mounth % 3) - 1 : 2;
                                let mMin = mounth - index;
                                let mMax = mounth + (2 - index);
                                let year = now.getFullYear();
                                let e = year + '-' + mMax + '-1';
                                const end = year + '-' + mMax + '-' + this.$utils.getDayOfMonth(e);
                                const start = year + '-' + mMin + '-1';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本年',
                            onClick(picker) {
                                let now = new Date();
                                let year = now.getFullYear();
                                const start = year + '-1-1';
                                const end = year + '-12-31';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                         {
                            text: '近两年',
                            onClick(picker) {
                                let now = new Date();
                                let year = now.getFullYear();
                                const start = (year - 1) + '-1-1';
                                const end = year + '-12-31';
                                picker.$emit('pick', [start, end]);
                            }
                        }
                        , {
                            text: '近三年',
                            onClick(picker) {
                                let now = new Date();
                                let year = now.getFullYear();
                                const start = (year - 2) + '-1-1';
                                const end = year + '-12-31';
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
            }
        },
        methods: {
            dateChange(val) {
                this.$emit('change', val)
            }
        }
    }
</script>

<style scoped>

</style>

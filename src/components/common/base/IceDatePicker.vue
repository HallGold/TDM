<template>
    <el-date-picker v-bind="$attrs"
                    v-model="dateValue"
                    v-on="$listeners"
                    :picker-options="{disabledDate(time) {return timeFilter?!timeFilter(time):(maxFun(time)||minFun(time))}}"
                    ref="datePicker"
                    @focus="testFocus"
                    >

    </el-date-picker>
</template>
<script>
    import moment from 'moment'

    export default {
        name: "IceDatePicker",
        props: {
            max: String,//最大日期，使用规则：days:1  表示比今天大一天   days:-1  表示比今天小一天  months:1  表示比今天大一个月
            min: String,
            timeFilter: Function,//优先级最高，格式：time=>{return true}  返回Boolean
            value: [Date, String],
            scope: Object,
            isGuZhang:Boolean
        },
        data() {
            return {
                dateValue: '',
                maxFun: () => {
                    return false;
                },
                minFun: () => {
                    return false;
                },
                initValue:null,//可以置为的最大时间
            }
        },
        created() {
            this.initValue = this.value
        },
        methods: {
            maxRecompute() {
                if (this.max) {
                    let params = this.max.split(":");
                    if (params.length == 0) {
                        return
                    }

                    if (params[0] == 'scope') {
                        this.maxFun = time => {
                            if (!this.scope[params[1]]) {
                                return false
                            }
                            return time > this.scope[params[1]]
                        }
                        return;
                    }

                    let type = 'days';
                    let offset = 0;
                    if (params.length == 1) {
                        offset = parseInt(params[0]);
                    } else if (params.length == 2) {
                        type = params[0];
                        offset = parseInt(params[1]);
                    }
                    let date = moment().add(offset, type)

                    this.maxFun = time => {
                        time = new Date(time).setHours(0);
                        time = new Date(time).setMinutes(0);
                        time = new Date(time).setSeconds(0);
                        time = new Date(time).setMilliseconds(0);

                        let time2 = date.toDate().getTime();

                        time2 = new Date(time2).setHours(0);
                        time2 = new Date(time2).setMinutes(0);
                        time2 = new Date(time2).setSeconds(0);
                        time2 = new Date(time2).setMilliseconds(0);

                        return time > time2;
                    }

                }
            },
            minRecompute() {
                if (this.min) {
                    let params = this.min.split(":");
                    if (params.length == 0) {
                        return
                    }

                    if (params[0] == 'scope') {
                        this.minFun = time => {
                            if (!this.scope[params[1]]) {
                                return false
                            }
                            return time < this.scope[params[1]]
                        }
                        return;
                    }

                    let type = 'days';
                    let offset = 0;
                    if (params.length == 1) {
                        offset = parseInt(params[0]);
                    } else if (params.length == 2) {
                        type = params[0];
                        offset = parseInt(params[1]);
                    }
                    let date = moment().add(offset, type)
                    this.minFun = time => {
                        time = new Date(time).setHours(0);
                        time = new Date(time).setMinutes(0);
                        time = new Date(time).setSeconds(0);
                        time = new Date(time).setMilliseconds(0);

                        let time2 = date.toDate().getTime();

                        time2 = new Date(time2).setHours(0);
                        time2 = new Date(time2).setMinutes(0);
                        time2 = new Date(time2).setSeconds(0);
                        time2 = new Date(time2).setMilliseconds(0);

                        return time < time2;
                    }
                }
            },
            async testFocus(){
                // console.log('focus')
                //只有故障入口调用该组件才执行下面的逻辑
                if(!this.isGuZhang){
                    return 
                }
                //延时100ms，给dom留出充足的时间渲染
                await new Promise((resolve)=>{
                    setTimeout(()=>{
                        resolve()
                    },100)
                })
                let cikeButtons=document.querySelectorAll(".el-picker-panel__footer .el-button--text")
                cikeButtons.forEach(ele=>{
                    ele.style.color="#ccc"
                })
                //暂时注释，防止以后如果要改需要
                // let newBtn = document.createElement("button")
                // newBtn.innerText="置为可设置的最大时间"
                // newBtn.className="el-button el-picker-panel__link-btn el-button--text el-button--mini"
                // newBtn.style.color="#0091b0"
                // document.querySelector(".el-picker-panel__footer").prepend(newBtn)
                // newBtn.addEventListener("click",()=>{
                //     // console.log('dianwo')
                //     // console.log(this)
                //     this.dateValue=this.initValue
                //     // console.log(this.dateValue)
                // })
            }
        },
        computed: {},
        watch: {
            dateValue() {
                this.$emit("change", this.dateValue);
            },
            value: {
                handler() {
                    this.dateValue = this.value;
                },
                immediate: true
            },
            min() {
                this.minRecompute();
            },
            max() {
                this.maxRecompute();
            }
        },
        mounted() {
            this.minRecompute();
            this.maxRecompute();
            console.log("attrs:", this.$attrs)
            console.log("$listeners:", this.$listeners)

        },
        components: {}
    }

</script>


<style scoped>

</style>

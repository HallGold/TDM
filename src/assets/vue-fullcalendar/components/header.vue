<template>
    <div class="full-calendar-header">
        <div class="header-left">
            <slot name="header-left">
            </slot>
        </div>
        <div class="header-center">
            <span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>
            <!--<span class="title">{{title}}</span>-->
            <el-dropdown class="title" trigger="click">
                    <span class="el-dropdown-link">
                        {{title}}
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <div class="bgs">
                        <div class="item" v-for="(item, index) in months1" :key="index"
                             @click="handleDate(item, index)">
                            {{item.m}}
                        </div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="next-month" @click.stop="goNext">{{rightArrow}}</span>
        </div>
        <div class="header-right">
            <slot name="header-right">
            </slot>
        </div>
    </div>
</template>
<script type="text/babel">
    import dateFunc from './dateFunc';
    import moment from 'moment'

    export default {
        created() {
            this.dispatchEvent()
        },
        props: {
            currentDate: {},
            titleFormat: {},
            firstDay: {},
            monthNames: {},
            events: { // events will be displayed on calendar
                default: function () {
                    return []
                }
            },

        },
        data() {
            return {
                title: '',
                leftArrow: '<',
                rightArrow: '>',
                headDate: new Date(),
            }
        },
        computed: {
            months1() {
                let minDate = "";
                let maxDate = "";
                this.events.map(c => {
                    if (c.start) {
                        minDate = minDate ? (this.moreTime(minDate, c.start) ? c.start : minDate) : c.start;
                    }
                    if (c.end) {
                        maxDate = maxDate ? (this.moreTime(maxDate, c.end) ? maxDate : c.end) : c.end;
                    }
                })
                console.log(minDate, maxDate, 'maxdate')
                let arr = [];
                let monDiff = this.countMonthDiff(minDate, maxDate)
                for (let i = 0; i <= monDiff; i++) {
                    let t = this.changeMonth(minDate, i);
                    let m = moment(t).format("YYYY年MM月");
                    let obj = {
                        m,
                        time: t
                    }
                    arr.push(obj);
                }
                return arr
            }
        },
        watch: {
            currentDate(val) {
                if (!val) return
                this.headDate = val
                // this.headDate = JSON.parse(JSON.stringify(val))
            }
        },
        methods: {
            handleDate(item, index) {
                this.headDate = this.changeMonth(item.time, 0)
                this.dispatchEvent()
            },
            // 计算两个日期月份差
            countMonthDiff(date1, date2) {
                let y1 = moment(date1).format("YYYY");
                let m1 = moment(date1).format("MM");
                // 和
                let totalM1 = y1 * 12 + m1 * 1;
                // 和
                let y2 = moment(date2).format("YYYY");
                let m2 = moment(date2).format("MM");
                let totalM2 = y2 * 12 + m2 * 1;
                let m = Math.abs(totalM2 - totalM1);
                return m
            },
            // 比较时间
            moreTime(date1, date2) {
                var oDate1 = new Date(date1);
                var oDate2 = new Date(date2);
                return oDate1 > oDate2;
            },
            goPrev() {
                console.log(this.headDate, 'this.headDate')
                this.headDate = this.changeMonth(this.headDate, -1)
                this.dispatchEvent()
            },
            goNext() {
                this.headDate = this.changeMonth(this.headDate, 1)
                this.dispatchEvent()
            },
            changeMonth(date, num) {
                let dt = new Date(date)
                return new Date(dt.setMonth(dt.getMonth() + num))
            },
            dispatchEvent() {
                this.title = dateFunc.format(this.headDate, this.titleFormat, this.monthNames)

                let startDate = dateFunc.getStartDate(this.headDate)
                let curWeekDay = startDate.getDay()

                // 1st day of this monthView
                let diff = parseInt(this.firstDay) - curWeekDay
                if (diff) diff -= 7
                startDate.setDate(startDate.getDate() + diff)

                // the month view is 6*7
                let endDate = dateFunc.changeDay(startDate, 41)

                // 1st day of current month
                let currentDate = dateFunc.getStartDate(this.headDate)

                this.$emit('change',
                    dateFunc.format(startDate, 'yyyy-MM-dd'),
                    dateFunc.format(endDate, 'yyyy-MM-dd'),
                    dateFunc.format(currentDate, 'yyyy-MM-dd'),
                    this.headDate
                )
            }
        }
    }
</script>
<style lang="less">
    .full-calendar-header {
        display: flex;
        align-items: center;
        .header-left, .header-right {
            flex: 1;
        }
        .header-center {
            flex: 3;
            text-align: center;
            font-size: 16px;
            .title {
                margin: 0 20px;
                font-size: 18px;
            }
            .prev-month, .next-month {
                cursor: pointer;
                font-size: 18px;
            }
        }
    }

    .bgs {
        padding: 10px 20px;
    }
</style>

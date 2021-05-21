<template>
    <div class="form-content">
        <div style="position: relative">
            <div style="position: absolute;right: 145px;z-index: 1;width: 200px;height: 50px;background: #FFFFFF"></div>
            <div style="position: absolute;right: 18px;top:10px;z-index: 2">
                <el-button class="el-icon-back"
                           style="color: #ebb563"
                           @click="backItem">返回日历主界面</el-button>
            </div>
            <div style="position: absolute;left: 130px;top:10px;z-index: 2">
                <el-button class="el-icon-arrow-left"
                           circle
                           style="color: darkturquoise"
                           @click="beforeMonth">上一月</el-button>
            </div>
            <div style="position: absolute;left: 215px;top:10px;z-index: 2">
                <el-button circle
                           style="color: tomato"
                           @click="afterMonth">下一月<i class="el-icon-arrow-right"></i></el-button>
            </div>
            <ice-calendar ref="cal" :value="new Date(yearItem,monthItem-1)" >
                <template slot="dateCell" slot-scope="{date,data}">
                    <div class="all">
                        <div :class="(weekendItem.indexOf(data.day.split('-').slice(1).join('-'))!=-1)?'isWeekend-background':'isWeekday-background'">
                            <div :class="data.isSelected?'is-selected fontCs':'fontCs'">
                                {{data.day.split('-').slice(1).join('-')}}
                            </div>
                        </div>
                        <div>
                            <div :class="(weekendItem.indexOf(data.day.split('-').slice(1).join('-'))!=-1)?'isWeekend':'isWeekday'">
                            </div>
                        </div>
                    </div>
                </template>
            </ice-calendar>
        </div>
    </div>
</template>

<script>
    import IceCalendar from "../../../components/common/base/calendar/main";

    export default {
        name: "calendarReport",
        components: {IceCalendar},
        data() {
            return {
                rowData: '',                                /*接受页面传来的参数*/
                yearItem: '',                               /*年份*/
                monthItem: '',                              /*月份*/
                weekendItem: '',                            /*休息日*/
            }
        },
        methods: {
            backItem() {
                this.$router.push("/biz/auditreport/calendarReportList");
            },
            beforeMonth(){
                if(this.monthItem!=1){
                    this.monthItem = this.monthItem-1;
                }else{
                    this.monthItem = 12;
                    this.yearItem = this.yearItem-1;
                }
                this.initDate();
            },
            afterMonth(){
                if(this.monthItem!=12){
                    this.monthItem = Number(this.monthItem)+1;
                }else{
                    this.monthItem = 1;
                    this.yearItem = Number(this.yearItem)+1;
                }
                this.initDate();
            },
            initDate(){
                this.$axios.get("/biz/BizArCalendar/get", {
                    "params": {
                        "month": this.monthItem,
                        "year": this.yearItem
                    }
                }).then(success => {
                    this.weekendItem = '';
                    success.data.forEach(item => {
                        if(item.weekend){
                            let arr = item.weekend.split(',');
                            arr.forEach(i => {
                                this.weekendItem += item.month + '-' + i + ',';
                            })
                        }
                    })
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                })
            }
        },
        mounted() {
            this.rowData = this.$route.query['data'];
            this.yearItem = this.rowData.split(',')[0];
            this.monthItem = this.rowData.split(',')[1];
            this.initDate();
        }
    }
</script>

<style scoped>
    .all{
        /*日历显示日期和图片的父级div*/
        margin: 0;
        position: relative;
        width: calc(100% + 16px);
        height: calc(100% + 16px);
        left: -8px;
        top: -8px;
    }
    .is-selected {
        /*每个月的一号*/
        color: #85ce61;
    }

    .isWeekend {
        /*为休息日的图片样式*/
        position: absolute;
        right: 10%;
        top: 10%;
        width: 25px;
        height: 24px;
        background-image: url("../../../assets/img/xiaolian.jpg");
        border-radius: 12px;
    }
    .isWeekday{
        /*非休息日的图片样式*/

    }
    .isWeekend-background{
        /*休息日的背景样式*/
        position: relative;
        background-color: rgba(210,89,230,0.2);
        margin: 0;
        width: 100%;
        height: 100%;
    }
    .isWeekday-background{
        /*非休息日的背景样式*/

    }
    .fontCs{
        /*日期字体的位置样式*/
        position: relative;
        left: 10%;
        padding-top:7%;
    }
    .form-content {
        flex-grow: 1;
        display: flex;
        background: #ffffff;
        width: 100%;
    }
</style>
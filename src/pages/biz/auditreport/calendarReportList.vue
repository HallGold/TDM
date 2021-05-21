<template>
    <div class="ice-container">
        <ice-query-grid data-url="/biz/BizArCalendar/list"
                        :pagination="true"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>
        <ice-dialog width="600px" :visible.sync="dialogVisible" :title="title" :before-close="closeDialog">
            <el-form v-model="mainData" :rules="formRules" ref="form" label-width="100px">
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="年月" prop="yearMonth">
                            <el-date-picker
                                    :disabled="isUpData"
                                    v-model="mainData.yearMonth"
                                    type="month"
                                    @change="changeItem(mainData.yearMonth)"
                                    value-format="yyyy-MM"
                                    placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="非工作日" prop="weekend">
                            <el-date-picker
                                    :default-value="new Date(yearItem,monthItem)"
                                    :disabled="!!!this.mainData.yearMonth"
                                    type="dates"
                                    v-model="mainData.weekend"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择一个或多个日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="save" :disabled="!mainData.yearMonth">保存</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "calendarReportList",
        components: {IceDialog, IceQueryGrid},
        data() {
            return {
                query: [
                    {type: 'input', label: '年份', code: 'year', value: ''},
                    {type: 'input', label: '月份', code: 'month', value: ''},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '年份', code: 'year', sortable: true, width: 80},
                    {label: '月份', code: 'month', sortable: true, width: 80},
                    {label: '非工作日天数', code: 'weekendNum', sortable: true, width: 150},
                    {label: '工作日天数', code: 'weekdayNum', sortable: true, width: 150},
                    {label: '非工作日', code: 'weekend', sortable: true, width: 300},
                    {label: '工作日', code: 'weekday', sortable: true, width: 400},

                ],
                operations: [
                    {name: '查看', callback: this.lookItem},
                    {name: '编辑', callback: this.upDataItem},
                ],
                buttons: [
                    {name: '新增', callback: this.addItem}
                ],
                mainData: {yearMonth: '', weekend: []},
                formRules: {},
                dialogVisible: false,
                title: '',
                yearItem: '',
                monthItem: '',
                isUpData: false,
                pickerOptions: {
                    onClick(picker) {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', start)
                    }
                }
            }
        },
        methods: {
            /**新增*/
            addItem() {
                this.title = '新增';
                this.mainData = {
                    yearMonth: '',
                    weekend: []
                };
                this.isUpData = false;
                this.dialogVisible = true;
            },
            /**查看*/
            lookItem(row) {
                this.$router.push("/biz/auditreport/calendarReport?data=" + row.year + ',' + row.month);
            },
            changeItem(dateItem) {
                this.mainData.weekend = [];
                let yearItem = dateItem.split('-')[0];
                let monthItem = dateItem.split('-')[1];
                this.yearItem = yearItem;
                this.monthItem = monthItem - 1;
                let time = new Date(yearItem, monthItem, 0);
                let timeNum = time.getDate();
                for (let i = 0; i < timeNum; i++) {
                    time.setDate(i + 1);
                    if (time.getDay() == 0 || time.getDay() == 6) {
                        let objNum = yearItem + '-' + monthItem + '-' + this.formatNum(i + 1);
                        this.mainData.weekend.push(objNum);
                    }
                }
            },
            /**维护*/
            upDataItem(row) {
                this.mainData.weekend = [];
                this.mainData.yearMonth = row.year + '-' + row.month;
                if(row.weekend){
                    row.weekend.split(',').forEach(item => {
                        item = row.year + '-' + row.month + '-' + item;
                        this.mainData.weekend.push(item);
                    });
                }
                this.yearItem = row.year;
                this.monthItem = row.month - 1;
                this.isUpData = true;
                this.title = '编辑';
                this.dialogVisible = true;
            },
            /**关闭弹出*/
            closeDialog() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**保存*/
            save() {
                let bizArCalendarListVos = [];
                let obj = {};
                obj.month = this.mainData.yearMonth.split('-')[1];
                obj.year = this.mainData.yearMonth.split('-')[0];
                if(this.mainData.weekend){
                    obj.weekend = this.mainData.weekend.join(',');
                }
                bizArCalendarListVos.push(obj);
                this.$axios.put("/biz/BizArCalendar/saveOrUpdate", {"bizArCalendarVos": bizArCalendarListVos}).then(success => {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.$refs.grid.refresh();
                    this.dialogVisible = false;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    });
                });
            },
            formatNum(num) {
                return num > 9 ? num : ('0' + num);
            },
            formatDate(date) {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                return year + '-' + this.formatNum(month) + '-' + this.formatNum(day);
            },
            timeFilter(time) {
                if (time.getFullYear() != this.yearItem) {
                    return true
                }
                if (time.getMonth() != this.monthItem) {
                    return true
                }
                return false;
                /*if(this.mainData.yearMonth){
                    this.yearItem = this.mainData.yearMonth.split('-')[0];
                    this.monthItem = this.mainData.yearMonth.split('-')[1]-1;
                    return time.getMonth() >((this.mainData.yearMonth.split('-')[1])-1)||time.getMonth() <((this.mainData.yearMonth.split('-')[1])-1)
                        ||time.getFullYear()>((this.mainData.yearMonth.split('-')[0]))||time.getFullYear() <((this.mainData.yearMonth.split('-')[0]));
                }*/
            }
        },
    }
</script>

<style scoped>

</style>
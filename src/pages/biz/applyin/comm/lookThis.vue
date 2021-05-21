<template>
    <div style="width: 100%">
        <el-table
                :data="DataTables"
                :span-method="arraySpanMethod"
                border
                :show-header="false"
                style="width: 100%;font-size: 15px">
            <el-table-column prop="firstList">//第一列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 0 ">
                        <span style="font-size: 20px;font-weight: 600">非授权人员进入审批单</span>
                    </div>
                    <div v-if="scope.$index == 1 ">
                        <span style="font-size: 16px;">申请编号</span>
                    </div>
                    <div v-if="scope.$index == 2 ">
                        <span style="font-size: 16px;">申请进入部位</span>
                    </div>
                    <div v-if="scope.$index == 3 ">
                        <span style="font-size: 16px;">陪同人</span>
                    </div>
                    <div v-if="scope.$index == 4 ">
                        <span style="font-size: 16px;">外来人员情况</span>
                    </div>
                    <div v-if="scope.$index == 6 ">
                        <span style="font-size: 16px;">预计进入时间</span>
                    </div>
                    <div v-if="scope.$index == 7 ">
                        <span style="font-size: 16px;">进入原因</span>
                    </div>
                    <div v-if="scope.$index == 8 ">
                        <span style="font-size: 16px;">是否接触涉密事项</span>
                    </div>
                    <div v-if="scope.$index == 9 ">
                        <span style="font-size: 16px;">陪同人员确认</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="secondList">//第二列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 1">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 2">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 3">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 6">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 7">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 8">
                        <span style="font-size: 16px;" class="color">{{scope.row.secondList}}</span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">姓名</span>
                    </div>
                    <div v-if="scope.$index == 9">
                        <span style="font-size: 16px;">实际进入时间</span>
                    </div>
                    <div v-if="scope.$index == 10">
                        <span style="font-size: 16px;">保密安全事项</span>
                    </div>
                    <div v-if="scope.$index == 11">
                        <span style="font-size: 16px;">工作内容</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="thirdList">//第三列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.thirdList}}</span>
                    </div>
                    <div v-if="scope.$index == 9">
                        <span style="font-size: 16px;" class="color">{{scope.row.thirdList}}</span>
                    </div>
                    <div v-if="scope.$index == 10">
                        <span style="font-size: 16px;" class="color">{{scope.row.thirdList}}</span>
                    </div>
                    <div v-if="scope.$index == 11">
                        <span style="font-size: 16px;" class="color">{{scope.row.thirdList}}</span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">性别</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="fourthList">//第四列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.fourthList}}</span>
                    </div>
                    <div v-if="scope.$index == 2">
                        <span style="font-size: 16px;">申请人</span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">证件类型</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="fifthList">//第五列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 2">
                        <span style="font-size: 16px;" class="color">{{scope.row.fifthList}}</span>
                    </div>
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.fifthList}}</span>
                    </div>
                    <div v-if="scope.$index == 6 ">
                        <span style="font-size: 16px;">预计离开时间</span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">证件号码</span>
                    </div>
                    <div v-if="scope.$index == 9">
                        <span style="font-size: 16px;">实际离开时间</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sixthList">//第六列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.sixthList}}</span>
                    </div>
                    <div v-if="scope.$index == 6">
                        <span style="font-size: 16px;" class="color">{{scope.row.sixthList}}</span>
                    </div>
                    <div v-if="scope.$index == 7">
                        <span style="font-size: 16px;" class="color">{{scope.row.sixthList}}</span>
                    </div>
                    <div v-if="scope.$index == 9">
                        <span style="font-size: 16px;" class="color">{{scope.row.sixthList}}</span>
                    </div>
                    <div v-if="scope.$index == 2 ">
                        <span style="font-size: 16px;">申请单位</span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">所属单位</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="seventhList">//第七列
                <template slot-scope="scope">
                    <div v-if="scope.$index == 5">
                        <span style="font-size: 16px;" class="color">{{scope.row.seventhList}}</span>
                    </div>
                    <div v-if="scope.$index == 2">
                        <span style="font-size: 16px;" class="color">{{scope.row.seventhList}}</span>
                    </div>
                    <div v-if="scope.$index == 2 ">
                        <span style="font-size: 16px;"></span>
                    </div>
                    <div v-if="scope.$index == 4">
                        <span style="font-size: 16px;">单位性质</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "lookThis",
        props: {
            lookData: Array
        },
        data() {
            return {
                DataTables: [
                    {
                        firstList: '',
                        secondList: '',
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: this.lookData[0].applyNum,
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: this.lookData[0].inLocation,
                        thirdList: '',
                        fourthList: '',
                        fifthList: this.lookData[0].applyName,
                        sixthList: '',
                        seventhList: "2"
                    },
                    {
                        firstList: '',
                        secondList: this.lookData[0].escort,
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: '',
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: "4",
                        thirdList: "4",
                        fourthList: "4",
                        fifthList: "4",
                        sixthList: "4",
                        seventhList: "4"
                    },
                    {
                        firstList: '',
                        secondList: "5",
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: "5",
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: "6",
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: "7",
                        thirdList: '',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: '',
                        thirdList: "8",
                        fourthList: '',
                        fifthList: '',
                        sixthList: "8",
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: '',
                        thirdList: '10',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                    {
                        firstList: '',
                        secondList: '',
                        thirdList: '11',
                        fourthList: '',
                        fifthList: '',
                        sixthList: '',
                        seventhList: ''
                    },
                ]
            }
        },
        /**
         * 合并单元格
         * 参数：当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
         * 返回值：[a,b] a为rowspan,b为colspan
         */
        methods: {
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0) {//第一列
                    if (rowIndex === 0) {
                        return [1, 7];
                    } else if (rowIndex === 1) {

                    } else if (rowIndex === 2) {

                    } else if (rowIndex === 3) {

                    } else if (rowIndex === 4) {
                        return [2, 1];
                    } else if (rowIndex === 5) {
                        return [0, 0];
                    } else if (rowIndex === 6) {

                    } else if (rowIndex === 7) {

                    } else if (rowIndex === 8) {

                    } else if (rowIndex === 9) {
                        return [3, 1];
                    } else if (rowIndex === 10) {
                        return [0, 0];
                    } else if (rowIndex === 11) {
                        return [0, 0];
                    }
                } else if (columnIndex === 1) {//第二列
                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [1, 6];
                    } else if (rowIndex === 2) {
                        return [1, 2];
                    } else if (rowIndex === 3) {
                        return [1, 6];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {
                        return [1, 3];
                    } else if (rowIndex === 7) {
                        return [1, 6];
                    } else if (rowIndex === 8) {
                        return [1, 6];
                    } else if (rowIndex === 9) {

                    } else if (rowIndex === 10) {

                    } else if (rowIndex === 11) {

                    }
                } else if (columnIndex === 2) {//第三列
                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [0, 0];
                    } else if (rowIndex === 2) {
                        return [0, 0];
                    } else if (rowIndex === 3) {
                        return [0, 0];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {
                        return [0, 0];
                    } else if (rowIndex === 7) {
                        return [0, 0];
                    } else if (rowIndex === 8) {
                        return [0, 0];
                    } else if (rowIndex === 9) {
                        return [1, 2];
                    } else if (rowIndex === 10) {
                        return [1, 5];
                    } else if (rowIndex === 11) {
                        return [1, 5];
                    }
                } else if (columnIndex === 3) {//第四列


                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [0, 0];
                    } else if (rowIndex === 2) {

                    } else if (rowIndex === 3) {
                        return [0, 0];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {
                        return [0, 0];
                    } else if (rowIndex === 7) {
                        return [0, 0];
                    } else if (rowIndex === 8) {
                        return [0, 0];
                    } else if (rowIndex === 9) {
                        return [0, 0];
                    } else if (rowIndex === 10) {
                        return [0, 0];
                    } else if (rowIndex === 11) {
                        return [0, 0];
                    }
                } else if (columnIndex === 4) {//第五列
                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [0, 0];
                    } else if (rowIndex === 2) {

                    } else if (rowIndex === 3) {
                        return [0, 0];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {

                    } else if (rowIndex === 7) {
                        return [0, 0];
                    } else if (rowIndex === 8) {
                        return [0, 0];
                    } else if (rowIndex === 9) {

                    } else if (rowIndex === 10) {
                        return [0, 0];
                    } else if (rowIndex === 11) {
                        return [0, 0];
                    }
                } else if (columnIndex === 5) {//第六列
                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [0, 0];
                    } else if (rowIndex === 2) {

                    } else if (rowIndex === 3) {
                        return [0, 0];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {
                        return [1, 2];
                    } else if (rowIndex === 7) {
                        return [0, 0];
                    } else if (rowIndex === 8) {
                        return [0, 0];
                    } else if (rowIndex === 9) {
                        return [1, 2];
                    } else if (rowIndex === 10) {
                        return [0, 0];
                    } else if (rowIndex === 11) {
                        return [0, 0];
                    }
                } else if (columnIndex === 6) {//第七列
                    if (rowIndex === 0) {
                        return [0, 0];
                    } else if (rowIndex === 1) {
                        return [0, 0];
                    } else if (rowIndex === 2) {

                    } else if (rowIndex === 3) {
                        return [0, 0];
                    } else if (rowIndex === 4) {

                    } else if (rowIndex === 5) {

                    } else if (rowIndex === 6) {
                        return [0, 0];
                    } else if (rowIndex === 7) {
                        return [0, 0];
                    } else if (rowIndex === 8) {
                        return [0, 0];
                    } else if (rowIndex === 9) {
                        return [0, 0];
                    } else if (rowIndex === 10) {
                        return [0, 0];
                    } else if (rowIndex === 11) {
                        return [0, 0];
                    }
                }
            }
        },
        /*mounted() {
            console.log(this.lookData[0])
        },*/
    }
</script>

<style scoped>
    .color {
        color: blue;
    }
</style>
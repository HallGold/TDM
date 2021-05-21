<template>
    <div class="content-filled">
        <ice-query-grid data-url="/pms/questionnaire/QuesPublishInfo/pageList"
                        :query="query"
                        :operations-width="180"
                        :columns="columns"
                        :operations="operations" ref="grid">
        </ice-query-grid>
        <ice-dialog title="调查结果详情查看" :visible.sync="detailVisible" width="900px" height="600px" remounted>
            <ice-query-grid data-url="/pms/questionnaire/QuesUserAnswers/list"
                            :query="detailQuery"
                            :operations-width="100"
                            :columns="detailColumns"
                            :operations="detailOperations" ref="grid2">
            </ice-query-grid>
            <ice-dialog :visible.sync="pagerVisible" :title="userAnswerName+'问卷详情查看'" width="1000px" height="600px"
                        remounted>
                <question-view :answer-snapshot="answerSnapshot" :answering="false">

                </question-view>
            </ice-dialog>
        </ice-dialog>
        <ice-dialog title="调查结果统计信息" :visible.sync="statisticsVisible" width="1000px" height="600px" remounted>
            <div class="ice-container statistics">
                <div class="org" v-if="statisticsAll">
                    <ice-tree load-url="/permission/frame_org/load_tree?loadDisabled=false&deptCode=90"
                              label-prop="deptShortName"
                              style="height: 600px"
                              value-prop="deptCode"
                              @node-click="selectChange"
                              :lazy="false">
                    </ice-tree>
                </div>
                <div class="result" v-loading="loading">
                    <div class="result-head" v-if="statisticsAll">
                        <!-- <h2>{{statisticDetail.title}}</h2>-->
                        <h2>统计部门：{{statisticDeptName}}
                        </h2>
                    </div>
                    <div class="result-content" :style="{top:statisticsAll?'40px':'0px'}">
                        <div v-for="(item,index) in statisticDetails" style="padding-bottom: 20px">
                            <div class="item-title">{{index+1}}、{{item.examTitle}}</div>
                            <div class="item-statics" v-if="item.examType!='textQuestion'">答题总人数：{{item.answerUsers}}
                                <span v-if="item.score&&!item.group">,平均得分：{{item.avgScore}}</span>
                            </div>
                            <ul v-if="item.group" style="padding-left: 50px">
                                <li v-for="group in item.groups">
                                    <div class="item-group">
                                        {{group.groupName}}
                                        <span class="item-statics">(分组答题人数：{{group.answerUsers}} ,<span
                                                v-if="item.score">平均得分：{{group.avgScore}}</span>)</span>
                                    </div>

                                    <ul style="padding-left: 20px">
                                        <li v-for="option in group.options" class="item-options">
                                            <div class="option-name">
                                                <span v-if="item.score"> {{option.optionCode}}分({{option.optionName}})</span>
                                                <span v-else>{{option.optionName}}</span>
                                            </div> &nbsp;&nbsp;&nbsp;&nbsp;
                                            (选项人数:
                                            <div class="show-count"
                                                 @click="queryUsers(item.examId,option.optionCode,group.groupCode,item.examTitle,option.optionName)">
                                                {{option.answerUsers}}
                                            </div>
                                            ,占比:
                                            <div class="show-percent">{{Number(option.answerPercent*100).toFixed(2)}}%
                                            </div>
                                            )
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <div v-else>

                                <ul style="padding-left: 40px" v-if="item.examType!='textQuestion'">
                                    <li v-for="option in item.options" class="item-options">
                                        <div class="option-name">
                                            <span v-if="item.score"> {{option.optionCode}}分({{option.optionName}})</span>
                                            <span v-else>{{option.optionName}}</span>
                                        </div>
                                        <div style="display: inline-block">
                                            (选项人数:
                                            <div class="show-count"
                                                 @click="queryUsers(item.examId,option.optionCode,null,item.examTitle,option.optionName)">
                                                {{option.answerUsers}}
                                            </div>
                                            ,占比:
                                            <div class="show-percent">{{Number(option.answerPercent*100).toFixed(2)}}%
                                            </div>
                                            )
                                        </div>

                                    </li>
                                </ul>
                                <div v-else style="padding-left: 40px">
                                    <div>
                                        (答题总人数:
                                        <div class="show-count"
                                             @click="queryUsers(item.examId,null,null,null,null,true)">
                                            {{item.answerUsers}}
                                        </div>
                                        )
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ice-dialog>
        <!--:exportTitle="statisticDeptName+'-题目:'+examTitle+'-选项:'+optionName+'-问卷信息导出'"-->
        <ice-dialog title="人员详情查看" :visible.sync="statisticsUsersVisible" width="1000px" height="600px" remounted>
            <ice-query-grid data-url="/pms/questionnaire/QuesUserAnswers/getOptionUsers"
                            :exportTitle="statisticDeptName+'-问卷信息导出'"
                            :query="statisticsUsersQuerys"
                            :columns="statisticsUsersColumns"
                            :gridAutoRefresh="false"
                            ref="queryUsers">
                <!-- :buttons="[{type:'export'}]"-->
            </ice-query-grid>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceDialog from "../../components/common/base/IceDialog";
    import QuestionView from "./widget/questionView";
    import IceTree from "../../components/common/base/IceTree";

    export default {
        name: "questionResult",
        data() {
            return {
                query: [
                    {type: 'input', label: '调查问卷标题', code: 'title', value: '', exp: 'like'},
                    {type: 'date', label: '发布时间从', code: 'startTime', value: '', exp: ">="},
                    {type: 'date', label: '发布时间至', code: 'endTime', value: '', exp: "<="},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '调查问卷标题', code: 'title', width: 200, align: "left"},
                    {label: '调查问卷描述', code: 'preDesc', width: 300, align: "left"},
                    {label: '开始时间', code: 'startTime', width: 120, sortable: true},
                    {label: '结束时间', code: 'endTime', width: 120},
                    {label: '发布范围', code: 'deptScopes', align: "left"}],
                operations: [
                    {
                        name: '查看详情', code: "BCKXQ", ctrlCode: "BCKXQ", callback: item => {
                            this.detailVisible = true;
                            this.detailId = item.oid;
                        }
                    },
                    {
                        name: '查看统计', code: "BCKTJ", ctrlCode: "BCKTJ", callback: item => {
                            this.statisticsAll = true
                            this.statisticsVisible = true;
                            this.detailId = item.oid;
                        }
                    },
                    {
                        name: '部门统计', code: "BBMTJ", ctrlCode: "BBMTJ", callback: item => {
                            this.statisticsAll = false
                            this.statisticsVisible = true;
                            this.detailId = item.oid;
                            this.$nextTick(_ => {
                                this.loadStatistic(this.detailId)
                            })
                        }
                    }
                ],
                detailVisible: false,
                detailId: '',
                examTitle: '',
                optionName: '',
                detailQuery: [
                    {type: 'input', label: '答题用户', code: 'userName', value: '', exp: 'like'},
                    {type: 'static', code: 'publishId', value: _ => this.detailId},
                    /* {type: 'date', label: '答题时间从', code: 'publishTime', value: '', exp: ">="},
                     {type: 'date', label: '答题时间至', code: 'publishTime', value: '', exp: "<="},*/
                ],
                detailColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'answerSnapshot', hidden: true},
                    {label: '答题用户', code: 'userName', width: 160},
                    {label: '用户单位', code: 'userOrgname', width: 140},
                    {label: '用户部门', code: 'userDeptname', width: 140},
                    {label: '答题时间', code: 'answerTime', width: 100, sortable: true}],
                detailOperations: [
                    {
                        name: '问卷查看', code: "BXZ3", callback: item => {
                            this.userAnswerId = item.oid
                            this.userAnswerName = item.userName
                            this.answerSnapshot = item.answerSnapshot;
                            this.pagerVisible = true
                        }
                    },
                ],
                userAnswerId: '',
                userAnswerName: '',
                answerSnapshot: '',
                pagerVisible: false,
                statisticsVisible: false,
                statisticDetails: [],
                statisticDeptName: '',
                statisticDeptCode: '',
                loading: false,
                statisticsUsersVisible: false,
                statisticsUsersColumns: [
                    {code: 'OID', hidden: true},
                    {code: 'ANSWER_TEXT', hidden: true},
                    {label: '答题用户', code: 'USER_NAME', width: 140},
                    {label: '用户单位', code: 'USER_ORGNAME', width: 120},
                    {label: '用户部门', code: 'USER_DEPTNAME', width: 120},
                    {
                        label: '用户追加信息/输入信息', code: 'ADDITION', width: 140, align: 'left', formatter: (row) => {
                            return this.isInput ? row['ANSWER_TEXT'] : row['ADDITION']
                        }
                    },
                ],
                statisticsUsersQuerys: [
                    {type: 'static', code: 'id', value: _ => this.detailId},
                    {type: 'static', code: 'deptCode', value: _ => this.statisticDeptCode},
                    {type: 'static', code: 'examId', value: _ => this.statisticsUsersConditions.examId},
                    {type: 'static', code: 'optionCode', value: _ => this.statisticsUsersConditions.optionCode},
                    {type: 'static', code: 'groupCode', value: _ => this.statisticsUsersConditions.groupCode},
                ],
                statisticsUsersConditions: {
                    examId: '',
                    optionCode: '',
                    groupCode: '',
                },
                isInput: false,//是否是选择的文本题
                statisticsAll: false
            }
        },
        methods: {
            selectChange(data, item) {
                this.loadStatistic(this.detailId, data)
                this.statisticDeptCode = data
                this.statisticDeptName = item.data.deptName
            },
            loadStatistic(id, deptCode) {
                this.loading = true
                this.$axios.get(`/pms/questionnaire/QuesUserAnswers/getStatistics?id=${id}${deptCode ? '&deptCode=' + deptCode : ''}`)
                    .then(({data}) => {
                        this.statisticDetails = data;
                    }).finally(_ => {
                    this.loading = false;
                })
            },
            queryUsers(examId, optionCode, groupCode, examTitle, optionName, isInput = false) {
                this.optionName = optionName;
                this.examTitle = examTitle;
                this.statisticsUsersVisible = true;
                this.statisticsUsersConditions = {
                    examId: examId !== null ? examId : undefined,
                    optionCode: optionCode !== null ? optionCode : undefined,
                    groupCode: groupCode !== null ? groupCode : undefined
                }
                this.isInput = isInput
                this.$nextTick(_ => {
                    this.$refs.queryUsers.refresh();
                })

            }
        },
        components: {IceTree, QuestionView, IceDialog, IceQueryGrid}
    }
</script>

<style lang="less" scoped>
    .statistics {
        display: flex;
        flex-direction: row;

        .org {
            width: 200px;
            height: 100%;
        }

        .result {
            flex-grow: 1;
            height: 100%;
            position: relative;

            .result-head {
                height: 40px;
                width: 100%;
                text-align: center;
            }

            .result-content {
                padding: 0 20px;
                box-sizing: border-box;
                position: absolute;
                top: 40px;
                bottom: 0;
                overflow-y: auto;
                left: 0;
                right: 0;

                .show-count {
                    display: inline-block;
                    padding: 0 10px;
                    font-size: 16px;
                    cursor: pointer;
                    color: #3697ff;
                }

                .show-percent {
                    display: inline-block;
                    padding-left: 10px;
                    font-size: 16px;
                    color: #96a7ff;
                }

                .item-title {
                    font-size: 16px;
                    min-height: 30px;
                    line-height: 30px;
                }

                .item-statics {
                    padding-left: 26px;
                    color: #888888;
                    height: 22px;
                    line-height: 22px;
                    font-size: 14px;
                    padding-bottom: 10px;
                }

                .item-group {

                }

                .item-options {
                    padding-left: 10px;
                    min-height: 28px;
                    line-height: 28px;

                    .option-name {
                        display: inline-block;
                        min-width: 300px;
                    }


                }

                li.item-options:nth-child(2n+1) {
                    background: #f6f6f6;
                }
            }
        }
    }
</style>

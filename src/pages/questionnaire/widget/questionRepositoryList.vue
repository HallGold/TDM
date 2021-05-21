<template>
    <div class="content-filled" style="flex-direction: column">
        <ice-query-grid data-url="/pms/questionnaire/QuesExamRepository/list"
                        :chooseItem="single?'single':'multiple'"
                        :columns="columns"
                        :query="query"
                        @selection-change="selectionChange"
                        ref="grid">

        </ice-query-grid>
        <div class="ice-center-button-bar">
            <el-button type="primary" :disabled="!selections || selections.length == 0" @click="confirm">确认</el-button>
            <el-button type="info" @click="$emit('cancel')">取消</el-button>
        </div>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "questionRepositoryList",
        components: {IceQueryGrid},
        props: {
            single: Boolean
        },
        data() {
            return {
                examTypeMap: {
                    textQuestion: '文本题',
                    singleQuestion: '单选题',
                    multiQuestion: '多选题',
                    scoreQuestion: '打分题',
                    singleGroupQuestion: '单选分组题',
                    multiGroupQuestion: '多选分组题',
                    scoreGroupQuestion: '打分分组题',
                },
                query: [
                    {type: 'input', label: '题目标题', code: 'examTitle', value: '', exp: 'like'},
                    {type: 'input', label: '题目描述', code: 'examDesc', value: '', exp: "like"},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '题目标题', code: 'examTitle', width: 300, align: 'left'},
                    {label: '题目描述', code: 'examDesc', width: 320, align: 'left'},
                    {
                        label: '题目类型', code: 'examType', align: 'left', formatter: row => {
                            return this.examTypeMap[row.examType]
                        }
                    },
                    {
                        label: '生效中', code: 'publishNum', width: 120, formatter: row => {
                            return row['publishNum'] > 0 ? '是' : '否'
                        }
                    },],
                selections: [],
            }
        },
        methods: {
            selectionChange(selections) {
                this.selections = selections;
            },
            confirm() {
                this.$emit("confirm", this.selections);
            }
        }
    }
</script>

<style scoped>

</style>
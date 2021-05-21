<template>
    <div class="questions">

        <div style="position: relative">
            <div class="questions-title">{{title}}</div>
            <div class="questions-predesc" v-if="preDesc">{{preDesc}}</div>
            <question-item v-for="(question,index) in questions"
                           :key="question.examId" :index="index+1"
                           :title="question.examTitle"
                           :desc="answering?'':question.examDesc"
                           :required="question.required"
                           :type="question.examType" v-model="result[question.examId]" v-bind="question"
                           :addition.sync="additions[question.examId]" :ref="question.examId">

            </question-item>
            <div class="questions-postdesc" v-if="postDesc">{{postDesc}}</div>
            <div class="overflow" v-if="!answering">

            </div>
        </div>

        <!-- <div class="ice-center-button-bar">
             <el-button type="primary" @click="submit">提交</el-button>
             <el-button type="info">返回</el-button>
         </div>-->
    </div>
</template>

<script>
    import questionItem from "./questionItem";

    export default {
        name: "questionView",
        props: {
            pagerId: String,
            answering: Boolean,
            answerSnapshot: String
        },
        data() {
            return {
                title: '',
                preDesc: '',
                postDesc: '',
                questions: [],
                result: {},
                additions: {}
            }
        },
        methods: {
            async loadPager(pagerId) {
                if (!pagerId) {
                    return;
                }
                const {data} = await this.$axios.get("/biz/questionnaire/QuesPagers/getDetail", {params: {id: pagerId}})
                this.title = data.title
                this.preDesc = data.preDesc
                this.postDesc = data.postDesc
                this.questions = data.quesExamVos
                this.$emit("loadSuccess")
                this.$emit("loadTitle", this.title)
            },
            async submit() {
                const result = await this.validate();
                if (!result) {
                    return
                }
                const answer = {
                    pagerId: this.pagerId,
                    publishId: '发布ID',
                    examTitle: this.title,
                    examDesc: this.preDesc,
                    answerSnapshot: JSON.stringify({
                        title: this.title,
                        preDesc: this.preDesc,
                        questions: this.questions,
                        result: this.result,
                        additions: this.additions
                    }),
                    quesUserAnswerDetails: this.questions.map(item => {
                        return {
                            examId: item.examId,
                            examTitle: item.examTitle,
                            examDesc: item.examDesc,
                            sequence: item.sequence,
                            ...this.$refs[item.examId][0].getResult()
                        }
                    })
                };
                return answer

            },
            getAnswerCode(examId) {
                const result = this.result[examId]
                if (result instanceof Object) {
                    return null
                } else {
                    if (result instanceof Array) {
                        return result.join(",")
                    } else {
                        return result
                    }
                }
            },
            getAnswerText(examId) {

            },
            validate() {
                for (let i = 0; i < this.questions.length; i++) {
                    const question = this.questions[i];

                    const {result, addition} = this.$refs[question.examId][0].validate()

                    if (!result) {
                        this.$message.warning(`第${question.sequence}题是必填题，请您填写！`)
                        return false
                    }
                    if (!addition) {
                        this.$message.warning(`第${question.sequence}题的附加信息必填项，请填写！`)
                        return false
                    }
                }
                return true
            }
        },
        watch: {
            pagerId: {
                handler(value) {
                    this.loadPager(value)
                },
                immediate: true
            },
            answerSnapshot: {
                handler(value) {
                    if (value) {
                        let answerSnapshot = JSON.parse(value);
                        this.title = answerSnapshot.title
                        this.preDesc = answerSnapshot.preDesc
                        this.questions = answerSnapshot.questions
                        this.result = answerSnapshot.result
                        this.additions = answerSnapshot.additions
                    }
                },
                immediate: true
            }
        },

        components: {questionItem}
    }
</script>

<style scoped lang="less">
    .questions-title {
        width: 100%;
        font-size: 22px;
        text-align: center;
        line-height: 24px;
        height: 24px;
        padding: 10px 0;
    }

    .questions-predesc {
        width: 100%;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        padding: 10px 0;
    }

    .questions-postdesc {
        width: 100%;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        padding: 10px 0;
        padding-bottom: 30px;
    }

    .questions {
        width: 100%;
        /*    height: 100%;*/
        flex-grow: 1;
        overflow-y: auto;
        background: white;

        .overflow {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
        }
    }
</style>

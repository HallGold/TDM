<template>
    <div class="question-content" v-loading="!loadSuccess" element-loading-text="努力加载中...">


        sdfsfsd

        <question-view :pager-id="pagerId" :answering="true" style="padding-top: 40px" ref="view"
                       @loadSuccess="loadSuccess=true">

        </question-view>
        <div class="ice-center-button-bar" v-if="loadSuccess">
            <el-button type="primary" @click="submit" :loading="submiting">提交</el-button>
            <el-button type="info" @click="$router.back()">返回</el-button>
        </div>
    </div>

</template>

<script>
    import QuestionView from "./widget/questionView";

    export default {
        name: "questionAnswer",
        components: {QuestionView},
        data() {
            return {
                pagerId: '',
                publishId: '',
                loadSuccess: false,
                submiting: false
            }
        },
        created() {
            this.pagerId = this.$route.query['pagerId'];
            this.publishId = this.$route.query['publishId'];
        },
        methods: {
            async submit() {
                this.submiting = true
                const answer = await this.$refs.view.submit();
                if (answer) {
                    answer.publishId = this.publishId;
                    try {
                        if (answer) {
                            await this.$axios.post("/biz/questionnaire/QuesUserAnswers/answer", {$json: answer})
                            this.$message.success("提交成功,感谢您的宝贵意见！")
                            this.$router.back();
                        }

                    } catch (e) {
                        this.$message.error(e ? e.msg : '出错啦')
                    }
                }

                this.submiting = false
            }
        }
    }
</script>

<style scoped lang="less">
    .question-content {
        margin: auto;
        min-height: 100%;
        background: white;
    }

    @media only screen and (min-width: 1300px) {
        .question-content {
            width: 1000px;
        }
    }


    @media only screen and (min-width: 1500px) {
        .question-content {
            width: 1200px;
        }
    }

</style>
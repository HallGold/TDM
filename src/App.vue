<template>
    <div id="app">
        <router-view></router-view>
        <transition name="el-zoom-in-bottom">
            <div class="question" v-show="isShow">
                <img src="@/assets/img/ques_new3.png" style="width: 100%;height: 100%"
                     @click="open">
                <div class="close el-icon-close" @click.stop="close" title="点击关闭"></div>
            </div>
        </transition>
        <ice-dialog title="调查问卷列表" :visible.sync="dialogVisible" width="600px" height="600px">
            <div style="box-sizing: border-box;padding: 20px">
                <div class="ques-item" v-for="(item,index) in publishsInfo" :key="item.oid">
                    {{index+1}}、{{item.title}}
                    <el-button type="text" class="button" @click="open2(item.oid,item.pagerId)">点击进入</el-button>
                </div>
            </div>
        </ice-dialog>

    </div>
</template>
<script>

    import {mapGetters, mapMutations} from 'vuex'
    import IceDialog from "./components/common/base/IceDialog";

    export default {

        /**
         * 应用初始化，加载以获取的数据字典信息
         */
        name: 'app',
        components: {IceDialog},
        data() {
            return {
                dialogVisible: false
            }
        },
        computed: {
            ...mapGetters('questionStore', ['isShow', 'publishsInfo'])
        },
        methods: {
            ...mapMutations('questionStore', ['close']),
            open() {
                if (this.publishsInfo && this.publishsInfo.length > 0) {

                    if (this.publishsInfo.length == 1) {
                        const publishInfo = this.publishsInfo[0]
                        this.open2(publishInfo.oid, publishInfo.pagerId)
                    } else {
                        this.dialogVisible = true;
                    }
                }


            },
            open2(publishId, pagerId) {
                this.close()
                this.dialogVisible = false;
                this.$router.push(`/questionnaire/answer?publishId=${publishId}&pagerId=${pagerId}`)
            }
        }

    }
</script>
<style scoped lang="less">
    .question {
        position: fixed;
        bottom: 0px;
        right: 0px;
        width: 150px;
        height: 161px;
        animation: bottom 1s linear;
        z-index: 9999;
        cursor: pointer;

        .close {
            position: absolute;
            right: 6px;
            top: 6px;
            color: #ffffff;
            font-size: 20px;

        }
    }

    .ques-item {
        box-sizing: border-box;
        padding: 5px 0;
        font-size: 16px;

        .button {
            margin-left: 20px;
            font-size: 14px;
        }
    }
    /*@import "./assets/css/color-default.css";*/
    /*@import "./assets/css/color-dark.css";     !*深色主题*!*/
    /*@import "./assets/css/theme-green/color-green.css";*/ /*浅绿色主题*/
</style>

<template>
    <!--<div class="main">
        <div class="bigBox">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
        </div>
    </div>-->
    <div class="smallBox">
        <p @click="appManagePage">APP维护</p>
        <p @click="dataTablePage">数据表维护</p>
        <p @click="strategyPreservePage">数据隔离策略维护</p>
        <p @click="roleAccreditPage">角色授权</p>
        <p @click="serviceManage">后台服务管理主页面</p>
        <p @click="informationPreserveManage">页面管理主界面</p>
    </div>
</template>

<script>
    export default {
        name: "textOne",
        data(){
            return{

            }
        },
        methods:{
            appManagePage(){//APP维护
                this.$router.push("appManagePage");
            },
            dataTablePage(){//数据表维护
                this.$router.push("dataTablePage");
            },
            strategyPreservePage(){//数据隔离策略维护
                this.$router.push("strategyPreservePage");
            },
            roleAccreditPage(){//角色授权
                this.$router.push("roleAccreditPage");
            },
            serviceManage(){//后台服务管理主页面
                this.$router.push("serviceManage");
            },
            informationPreserveManage(){//页面管理主界面
                this.$router.push("informationPreserveManage");
            }
        }
    }
</script>

<style scoped>
    .main {
        position: absolute;
        width: 400px;
        height: 400px;
        margin: 200px auto;
        box-shadow: 0 0 0px 0 #000;
        border: 1px solid transparent;
        perspective: 800px;
        z-index: 3;

    }

    .bigBox {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 100px auto;
        transform-style: preserve-3d;
        /* animation: move 4s infinite alternate;*/
        animation: move 4s linear infinite;
    }

    .bigBox p {
        position: absolute;
        width: 200px;
        height: 200px;
        box-shadow: 0 0 10px 0 red;
        font: bold 30px/200px "";
        color: red;
        text-align: center;
    }

    .bigBox p:nth-child(1) {
        left: 0;
        top: 0;
        transform: translateZ(100px);
    }

    .bigBox p:nth-child(2) {
        left: -200px;
        top: 0;
        transform: translateZ(100px) rotateY(-90deg);
        transform-origin: right
    }

    .bigBox p:nth-child(3) {
        left: 200px;
        top: 0;
        transform: translateZ(100px) rotateY(90deg);
        transform-origin: left
    }

    .bigBox p:nth-child(4) {
        left: 0;
        top: -200px;
        transform: translateZ(100px) rotateX(90deg);
        transform-origin: bottom;
        /*animation: play1 4s infinite alternate;*/
    }

    .bigBox p:nth-child(5) {
        left: 0;
        top: 200px;
        transform: translateZ(100px) rotateX(-90deg);
        transform-origin: top
    }

    .bigBox p:nth-child(6) {
        left: 0;
        top: 0;
        transform: translateZ(-100px)
    }

    .smallBox {
        position: absolute;
        /*left: calc(50% - 50px);
        top: calc(50% - 50px);*/
        width: 100px;
        height: 100px;
        transform-style: preserve-3d;
        /* animation:circle 6s infinite linear*/
        /*animation: play2 4s infinite alternate;*/
        animation: play2 4s linear infinite;
        z-index: 3;
    }
    .smallBox:hover{
        /*animation: sma1 4s linear infinite;*/
        animation-play-state:paused;
    }

    .smallBox p {
        position: absolute;
        width: 100px;
        height: 100px;
        box-shadow: 0 0 10px 0 red;
        /*font: bold 30px/100px "";*/
        color: red;
        text-align: center;
    }

    .smallBox p:nth-child(1) {
        left: 0;
        top: 0;
        transform: translateZ(50px);
        background: url("../../../assets/img/hehua.png")no-repeat center/cover;
    }

    .smallBox p:nth-child(2) {
        left: -100px;
        top: 0;
        transform: translateZ(50px) rotateY(-90deg);
        transform-origin: right;
        background: url("../../../assets/img/login-bg.jpg")no-repeat center/cover;
        opacity: 0.3;
    }

    .smallBox p:nth-child(3) {
        left: 100px;
        top: 0;
        transform: translateZ(50px) rotateY(90deg);
        transform-origin: left;
        background: url("../../../assets/img/xiaolian.jpg")no-repeat center/cover;
    }

    .smallBox p:nth-child(4) {
        left: 0;
        top: -100px;
        transform: translateZ(50px) rotateX(90deg);
        transform-origin: bottom;
        background: url("../../../assets/img/Tulips.jpg")no-repeat center/cover;
    }

    .smallBox p:nth-child(5) {
        left: 0;
        top: 100px;
        transform: translateZ(50px) rotateX(-90deg);
        transform-origin: top;
        background: url("../../../assets/img/application.png")no-repeat center/cover;
    }

    .smallBox p:nth-child(6) {
        left: 0;
        top: 0;
        transform: translateZ(-50px);
        background: url("../../../assets/img/img.jpg")no-repeat center/cover;
    }
    @-webkit-keyframes move {
        to {
            transform: rotateY(360deg)
        }
    }

    @-webkit-keyframes play1 {
        /*to {
            transform: translateZ(100px) rotateX(0deg);
        }*/
    }

    @-webkit-keyframes play2 {
        /*to {
            transform: rotateY(90deg);
            top: -50px;
        }*/
        to{
            transform: rotate3d(.8,.6,1,360deg);
        }
    }
    @-webkit-keyframes sma1 {

    }
</style>

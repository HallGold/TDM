<template>
    <div class="login-wrap">
        <div>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
    </div>
</template>

<script>

    export default {
        data: function () {
            return {
                loading: false,

            }
        },
        methods: {

        },
        mounted() {

        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 28px;
        color: #333;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);

    }

    .ms-content {
        padding: 30px 30px;
    }

    .sys-testRun-tips {
        font-size: 35px;
        line-height: 40px;
        color: #f00;
        text-align: center;
        position: absolute;
        bottom: -50px;
        width: 800px;
        left: 50%;
        font-weight: bold;
        margin-left: -400px;
        letter-spacing: 2px;
        text-shadow: 5px 2px 6px #000;
    }

</style>

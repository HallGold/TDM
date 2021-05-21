<template>
  <div class="containerBox">
    <h1 class="title">实验进度查询</h1>
    <button class="ComeBack"
            @click="back">退出</button>
    <div class="contentbox">
      <el-steps :active="active"
                align-center>
        <el-step title="待送样"></el-step>
        <el-step title="实验中"></el-step>
        <el-step title="已完成"></el-step>
      </el-steps>
      <ul>
        <li><img src="./images/报告查询图标.png"
               alt="" /></li>
        <li>
          <span>当前实验进度在进行中,根据提示信息按步骤查看实验报告进度</span>
        </li>
        <li><button>报告查询</button></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
    };
  },
  methods: {
    back () {
      this.$router.push({
        path: "/tdm/ScheduleLnquire",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.containerBox {
  width: 100%;
  background: url('./images/bgc.png') no-repeat left top;
  background-size: cover;
  position: relative;
}
.title {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(to bottom, #1765ff, #49d9fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.ComeBack {
  width: 110px;
  height: 50px;
  background: url('./images/退出按钮.png') no-repeat top left;
  background-size: 100%;
  border-radius: 30px;
  position: absolute;
  right: 30px;
  top: 50px;
  color: #ccc;
  padding-left: 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 20px;
    top: 12px;
    width: 20px;
    height: 30px;
    background: url('./images/退出图标.png') no-repeat;
    background-size: 100%;
  }
}
.contentbox {
  width: 750px;
  height: 550px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
}
/deep/.el-step__icon {
  color: #fff;
  background: url('./images/进度12按钮.png') no-repeat;
  background-size: 100%;
  border: none;
  width: 35px;
  height: 35px;
  font-size: 20px;
}
/deep/.el-step__title {
  color: #6fa8ff !important;
  font-size: 20px;
  font-weight: bold;
}
/deep/.el-step__line {
  background-color: #457adf;
}
.el-step__line,
/deep/.el-step__line-inner {
  display: block;
  transition: 0.15s ease-out;
  box-sizing: border-box;
  height: 8px !important;
  background-color: #0040c4 !important;
  border-style: none !important;
}
/deep/.el-step.is-horizontal .el-step__line {
  height: 8px;
  top: 14px;
}
ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  li {
    &:nth-child(1) {
      width: 240px;
      height: 260px;
      margin: 35px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &:nth-child(2) {
      width: 320px;
      font-size: 20px;
      color: #2bb9e0;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
    }
    &:nth-child(3) {
      button {
        width: 320px;
        height: 76px;
        border-radius: 10px;
        border: none;
        background: url('./images/报告查询按钮.png') no-repeat left top;
        background-size: 100%;
        font-size: 30px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>

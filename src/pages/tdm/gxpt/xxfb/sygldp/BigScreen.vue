<template>
  <div class="containerBox">
    <el-row :gutter="20"
            class="rowBox"
            v-if="false">
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>预约订单(单)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>预约受理(单)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>本周完成(项)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>检测中(单)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>总设备梳(台)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="bg">
          <div class="top">
            <span class="icons"></span>
            <span>
              <span>可用设备数(台)</span>
              <span style="font-size:16px; font-weight: bold;">18</span>
            </span>
          </div>
          <div class="bottom"></div>
        </div>
      </el-col>
    </el-row>
    <div class="mianBox">
      <div class="headers">
        <div class="nav">
          <!--  -->
          <span :class="Experiment==true ? 'selectNav' : ''"
                @click="changeExperiment">实验管理</span>
          <!--  -->
          <span :class="Comprehensive==true ? 'selectNav' : ''"
                @click="changeComprehensive">综合数据</span>
          <span @click="changeSchedule"
                :class="Schedule==true ? 'selectNav' : ''">进度查询</span>
        </div>
        <div class="title">
          <span>实验室共享平台管理系统</span>
          <span style="font-size:13px">实验数据可视化Experimental Data Visualization System</span>
          <span><img src="./images/logo.png"
                 alt=""></span>
        </div>
        <div class="title"></div>
        <div class="title end">
          <span style="margin-bottom:40px">{{TimeDataView}}</span>
          <span style="text-decoration:underline;cursor:pointer;"
                @click="handleFullScreen"
                v-show="flag==1?true:false">{{'全屏显示'}}</span>
          <span style="text-decoration:underline;cursor:pointer;"
                @click="goback"
                v-show="flag==0?true:false">{{'关闭全屏'}}</span>
        </div>
      </div>
      <div class="mian-content">
        <!-- 实验管理 -->
        <Experiment v-if="Experiment"></Experiment>
        <!-- 综合数据 -->
        <Comprehensive v-if="Comprehensive"></Comprehensive>
        <!-- 进度查询 -->
        <Schedule v-if="Schedule"></Schedule>
      </div>
    </div>
  </div>
</template>
<script>
import Experiment from './Component/experiment.vue';
import Comprehensive from './Component/Comprehensive.vue';
import Schedule from './Component/schedule.vue';
export default {
  components: { Experiment, Comprehensive, Schedule },
  data () {
    return {
      type: 0,
      /* 实验管理 */
      Experiment: false,
      /* 综合数据 */
      Comprehensive: false,
      /* 进度查询 */
      Schedule: false,
      /* 是否全屏 */
      flag: 1,
      fullscreen: false,
      /* 时间 */
      TimeDataView: ''
    }
  },
  methods: {
    /* 实验管理 */
    changeExperiment () {
      this.$nextTick(() => {
        this.Experiment = true;
        this.Comprehensive = false;
        this.Schedule = false;
      })
    },
    /* 综合数据 */
    changeComprehensive () {
      this.$nextTick(() => {
        this.Experiment = false;
        this.Comprehensive = true;
        this.Schedule = false;
      })
    },
    /* 进度查询 */
    changeSchedule () {
      this.$nextTick(() => {
        this.Experiment = false;
        this.Comprehensive = false;
        this.Schedule = true;
      })
    },
    /* 全屏事件 */
    handleFullScreen () {
      if (this.flag == 1) {
        this.$router.push({
          path: '/bigScreen',
          query: { flag: this.flag }
        });
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen()
        }
        this.fullscreen = !this.fullscreen;
      }
    },
    goback () {
      if (this.flag == 0) {
        this.$router.go(-1);
        this.flag = 1;
        let element = document.documentElement;
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    },
    /* 动态时间 */
    TimeData () {
      var date = new Date();
      var date1 = date.toLocaleString();
      /*  console.log(date1); */
      this.TimeDataView = date1
      setTimeout(() => {
        this.TimeData()
      }, 1000)
    }
  },
  mounted () {
    this.changeSchedule();
    if (this.$route.query.flag == 1) {
      this.flag = 0;
    }
    this.TimeData()
  }
}
</script>
<style lang="less" scoped>
.containerBox {
  width: 100%;
  height: 130%;
  background-color: #fff;
}
.rowBox {
  margin-bottom: 10px;
}
.bg {
  background-color: rgb(35, 212, 159);
  min-height: 120px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top {
  display: flex;
  justify-content: start;
  box-sizing: border-box;
  padding: 8px;
  box-sizing: border-box;
  .icons {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    margin-right: 10px;
  }
  span {
    &:nth-child(2) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 2px 0;
      color: #fff;
      font-size: 14px;
    }
  }
}
.bottom {
  flex: 1;
  background-color: sandybrown;
}
.mianBox {
  background-color: rgba(0, 10, 46, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px;
  .headers {
    width: 100%;
    min-height: 120px;
    border: 1px solid #45e4ea;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px 20px;
    .nav {
      position: absolute;
      top: 0;
      left: 50%;
      font-size: 18px;
      color: rgb(148, 148, 148);
      font-weight: bold;
      transform: translateX(-50%);
      span {
        margin-right: 40px;
        position: relative;
        &:hover {
          color: #fff;
          cursor: pointer;
        }
        &::before {
          content: '';
          display: block;
          width: 2px;
          height: 20px;
          background-color: #ffffff;
          position: absolute;
          top: 0px;
          right: -22px;
        }
        &:nth-child(3) {
          &::before {
            display: none;
          }
        }
      }
      .selectNav {
        text-decoration: underline;
        color: #fff;
      }
    }
    .title {
      flex: 1;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      color: #fff;
      align-items: flex-start;
      line-height: 1.5;
      font-size: 20px;
      font-weight: bold;
      img {
        height: 40px;
      }
    }
    .end {
      align-items: flex-end;
    }
  }
  .mian-content {
    border: 1px solid #45e4ea;
  }
}
</style>
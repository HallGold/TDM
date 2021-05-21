<template>
  <div class="containerBox">
    <h1 class="title">{{ title }}</h1>
    <!-- 侧边栏 -->
    <div class="menuList">
      <el-menu class="el-menu-vertical-demo"
               @select="handleSelect">
        <el-menu-item index="检测中心展示">
          <i class="menu_1"></i>
          <span slot="title">检测中心展示</span>
        </el-menu-item>
        <el-menu-item index="实验进度查询">
          <i class="menu_2"></i>
          <span slot="title">实验进度查询</span>
        </el-menu-item>
        <el-menu-item index="实验管理分析">
          <i class="menu_3"></i>
          <span slot="title">实验管理分析</span>
        </el-menu-item>
        <el-menu-item index="综合数据分析">
          <i class="menu_4"></i>
          <span slot="title">综合数据分析</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 主区域-->
    <div class="main-content">
      <div class="content_box1"
           v-if="activePath == '检测中心展示'">
        <experiment-map></experiment-map>
      </div>
      <div class="content_box2"
           v-if="activePath == '实验进度查询'">
        <div class="Inquire_box">
          <el-form ref="form"
                   :model="form"
                   :rules="rules">
            <el-form-item style="margin-bottom:20px"
                          prop="OrderNumber">
              <el-input v-model="form.OrderNumber"
                        placeholder="请输入查询预约受理号"
                        style="margin-bottom:10px"
                        prefix-icon="el-icon-search"></el-input>
              <span>注:当前查询仅支持精确查询,请仔细核对后在输入实验预约受理号</span>
            </el-form-item>
            <el-form-item style="margin-bottom:60px"
                          prop="password">
              <el-input v-model="form.password"
                        type="password"
                        placeholder="请输入查询密码"
                        style="margin-bottom:10px"
                        prefix-icon="el-icon-lock"></el-input>
              <span>注:查询密码为机构统一设置,请询问相关人员</span>
            </el-form-item>
            <el-form-item style=" text-align: center">
              <button class="button"
                      @click="Inquire">立即查询</button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="content_box3"
           v-if="activePath == '实验管理分析'">
        <management-analysis></management-analysis>
      </div>
      <div class="content_box4"
           v-if="activePath == '综合数据分析'">
        <data-Analysis></data-Analysis>
      </div>
    </div>
  </div>
</template>
<script>
import ManagementAnalysis from "@/pages/tdm/gxpt/xxfb/ManagementAnalysis.vue";
import DataAnalysis from "@/pages/tdm/gxpt/xxfb/DataAnalysis.vue";
import ExperimentMap from '@/pages/tdm/gxpt/xxfb/ExperimentMap.vue';
export default {
  name: "ScheduleLnquire",
  components: { ManagementAnalysis, DataAnalysis, ExperimentMap },
  data () {
    return {
      title: "检测中心展示",
      activePath: "检测中心展示",
      form: {
        OrderNumber: "",
        password: "",
      },
      rules: {
        OrderNumber: [
          { required: true, message: "请输入查询单号", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入查询密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleSelect (index, path) {
      // console.log(index);
      this.title = index;
      this.activePath = index;
    },
    /* 查询 */
    Inquire () {
      this.$router.push({
        path: "/tdm/ReportQuery",
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
.menuList {
  width: 150px;
  height: 100%;
  position: absolute;
  left: -130px;
  top: 0;
  z-index: 999;
  transition: all 0.7s;
  &:hover {
    left: 0px;
  }
}
.el-menu-vertical-demo {
  background-color: none;
  height: 100%;
  width: 100%;
  background: url('./images/左侧按钮触碰显示背景.png') no-repeat left top;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-right: none;
}
.el-menu-item {
  color: #6fa8ff;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  background: url('./images/左侧未选中时按钮.png') no-repeat left top;
  background-size: 100%;
  overflow: hidden;
  i {
    width: 40px;
    height: 40px;
  }
  span {
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
  }
}
.el-menu-item:hover {
  outline: 0 !important;
  color: #6fa8ff !important;
}
.el-menu-item.is-active {
  color: #6fa8ff !important;
  background: url('./images/左侧选中时按钮.png') no-repeat left top;
  background-size: 100%;
}
.menu_1 {
  background: url('./images/左侧图标1.png') no-repeat top left;
  background-size: 100%;
}
.menu_2 {
  background: url('./images/左侧图标2.png') no-repeat top left;
  background-size: 100%;
}
.menu_3 {
  background: url('./images/左侧图标3.png') no-repeat top left;
  background-size: 100%;
}
.menu_4 {
  background: url('./images/左侧图标4.png') no-repeat top left;
  background-size: 100%;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-top: 75px;
  box-sizing: border-box;
  .content_box1,
  .content_box2,
  .content_box3,
  .content_box4 {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
.Inquire_box {
  width: 680px;
  height: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  .el-form-item {
    span {
      font-size: 16px;
      color: #6fa8ff;
    }
  }
}
.el-input,
.el-input--small {
  font-size: 18px;
  /deep/input {
    height: 60px;
  }
}
.button {
  width: 150px;
  height: 70px;
  font-size: 25px;
  border: none;
  border-radius: 10px;
  background: url('./images/报告查询按钮.png') no-repeat left top;
  background-size: 100% 100%;
  color: #fff;
  cursor: pointer;
}
</style>

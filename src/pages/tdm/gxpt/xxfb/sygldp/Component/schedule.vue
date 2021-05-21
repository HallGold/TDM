<template>
  <div class="Box"
       v-loading='loading'>
    <el-input v-model="value"
              placeholder="请输入实验预约编号"
              prefix-icon="el-icon-search">
    </el-input>
    <p>实验预约完成后系统会生成实验预约编号，只有受理后的预约才可以进行查询！</p>
    <div class="stepe">
      <el-steps :active="active"
                finish-status="success"
                align-center
                v-show="isshow">
        <el-step title="待送样"></el-step>
        <el-step title="实验中"></el-step>
        <el-step title="已完成"></el-step>
      </el-steps>
    </div>
    <el-button type="primary"
               @click="getTaskSchedule">立即查询</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      active: 0,
      loading: false,
      isshow: false,
    }
  },
  methods: {
    getTaskSchedule () {

      if (!this.value) {
        this.$message.warning('请输入预约单号!');
        return
      }
      this.loading = true
      this.isshow = true;
      this.active = 0;
      this.$axios.get('/tdm/visualization/appSchedule', {
        params: {
          reservationNumber: this.value
        }
      }).then((res) => {
        this.loading = false
        if (res.data == 0) {
          this.$message.warning('未查找到该预约,请核实查询单号!')
          return;
        }
        console.log(res);
        this.active = res.data

      }).catch((err) => {
        this.$message.error(err.msg)
        this.loading = false
      })
    }
  },
  created () {
    this.value = ''
  }
}
</script>

<style lang="less" scoped>
.Box {
  width: 100%;
  height: 820px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-input {
  width: 700px;
  margin-bottom: 15px;
  font-size: 15px;
}
/deep/.el-input__inner {
  height: 60px;
}
/deep/.el-input__prefix {
  top: 2;
}
p {
  color: #fff;
}
.stepe {
  width: 800px;
  margin: 80px 0;
}
.el-steps {
  width: 100%;
}
.el-button {
  width: 150px;
  height: 50px;
  font-size: 20px;
}
/deep/.el-step__title {
  color: #fff;
}
/deep/.is-success {
  color: #67c23a;
}
/deep/.el-loading-mask {
  background-color: rgba(219, 222, 248, 0.185);
}
/deep/.el-loading-spinner {
  top: 60%;
}
</style>
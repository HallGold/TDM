<template>
  <div class="container"
       style="min-width:1500px">
    <h1>实验共享平台自助预约系统</h1>
    <div class="mian">
      <div class="leftBox">
        <ul>
          <!-- Video组件 -->
          <li style="background-color:tomato">
            <Video></Video>
          </li>
          <li>
            <span>实验共享平台操作指引</span><span>平台简介内容说明或服务内容</span>
          </li>
        </ul>
      </div>
      <div class="rightBox">
        <el-row>
          <el-col :span="24">
            <!--  <el-button type="danger"
                       icon="el-icon-edit-outline"
                       @click="goEntrustExperiment('委托实验预约')">委托实验预约</el-button> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="danger"
                       icon="el-icon-tickets"
                       @click="Userinstructions">实验预约填报</el-button>
          </el-col>
          <!-- <el-col :span="12">
            <el-button type="info"
                       icon="el-icon-data-analysis"
                       @click="goProduceExperiment('生产实验预约')">生产实验预约</el-button>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-button type="primary"
                           icon="el-icon-time"
                           style="margin-bottom:20px"
                           @click="goBigScreen">实验进度查询</el-button>
              </el-col>
              <el-col :span="24">
                <el-button type="success"
                           icon="el-icon-mouse"
                           @click="goExperimentalReport">报告查询刻录</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="warning"
                       icon="el-icon-user"
                       @click="goHome">&nbsp;&nbsp;&nbsp;&nbsp;个人中心</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 用户须知 -->
    <ice-dialog v-dialogDrag
                title="《预约使用条例》"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="900px">
      <div class="text">
        <div  class="" v-html="htmls"></div>
        <template>
          <el-checkbox v-model="checked"></el-checkbox><span style="margin-left:10px">进入预约表示你已同意</span><span style="color:#219FBA;">《预约使用条例》</span>
        </template>
      </div>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="info"
                   size="medium"
                   @click="closeItem">取消</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="goAutonomousExperiment"
                   :disabled="timeOut==0?false:true">进入预约 {{timeOut==0?'':timeOut+' '+'s'}}</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import Video from '@/pages/tdm/gxpt/syyy/video.vue'
import IceDialog from "@/components/common/base/IceDialog";
export default {
  components: { Video, IceDialog },
  data () {
    return {
      htmls:"<blockquote><p style=\"text-align: center;\"><span><b>职责</b></span></p><p style=\"text-align: left;\">第一条、测试委托人必须明确样品的安全状态，了解测试项目的操作过程和目的性，对测试样品本身的安全性负责。由于样品本身状态的原因(如样品规格、状态等)导致不能进行测试的由测试委托人负责。</p><p>第二条、如自主测试，自主测试人需经专门操作培训，并经班组仪器负责人确认后方可进行。自主测试人应对测试过程安全性负责，爱护实验仪器设备、设施，并接受测试班组的监督。<br><p>第三条、实验室检测责任人(或协助测试人员)确认样品的测试条件并对测试设备(计量器具)的有效性负责，对自主测试人员操作资格进行确认。</p></p><p style=\"text-align: center;\"><b>测试管理流程</b></p><p style=\"text-align: left;\">第四条、测试委托人应首先填写“检测送样确认单(委托书)”，可以为电子版、打印件或手写件(见附件1)。</p><p><p>第五条、测试选样人员持“检测送样确认单”与样品一同送分析中心样品管理人员，并一同核对样品信息。<br>第六条、测试单位调度依据中心样品管理人员确认后的“检测送样确认单”下发“任务单”至班组。<br>第七条、测试班组接到“任务单”后及时安排测试，测试人员按照约定方式进行测试，后对外提供测试数据或报告。工艺人员对数据进行复核和报出，经审核后对外提供测试数据或报告。</p></p><p style=\"text-align: center;\"><span><b>安全要求</b></span></p><p>第八条、测试过程应符合院所安全管理要求,对未知物在测试前委托人应提供必要的的安全技术说明,否则测试班组有权拒绝安排测试。<br>第九条、自主测试全过程应符合相关的安全法律法规、化材所安全规章制度和实验室的安全操作规程。<br>第十条、进入实验室的自主测试人员必须听从实验室工作人员的安排,不得随意操作未经许可的测试设备。<br><br></p><p style=\"text-align: center;\"><span><b>保密要求</b></span></p><p>第十一条、分析中心承诺对委托测试结果按照院所要求进行保密。<br>第十二条、进入实验室的自主测试人员必须遵守国家及院所各项保密要求,必须遵守实验室二级保密制度。<br>第十三条、对不符合保密要求的行为,实验室工作人员有权终止其测试活动,并上报实验室管理者。</p><p style=\"text-align: right;\"><span><b>分析化学研究中心&nbsp;</b></span><br><br><br></p></blockquote><p><br></p>",
      dialogVisible: false,
      checked: false,
      timeOut: 10,
    };
  },
  methods: {
    /* 用户须知 */
    Userinstructions () {
      this.dialogVisible = true;
      this.Countdown()
    },
    /* 倒计时 */
    Countdown () {
      setTimeout(() => {
        if (this.timeOut == 0) {
          return
        } else {
          this.timeOut--
          this.Countdown()
        }
      }, 1000)
    },
    closeItem () {
      this.dialogVisible = false
    },
    /* 委托预约 */
    /*  goEntrustExperiment (date) {
       setTimeout(() => {
         this.$router.push({
           path: "/tdm/EntrustExperiment",
           query: { name: date },
         });
       }, 300);
     }, */
    /* 自主实验预约 */
    goAutonomousExperiment (date) {
      if (this.checked) {
        this.checked = true;
        this.$router.push({
          path: '/tdm/AutonomousExperiment',
          query: { name: date }
        });
      } else {
        this.$message.warning('你未同意使用预约条例!')
      }
    },
    /* 生产实验预约 */
    /*   goProduceExperiment (date) {
        setTimeout(() => {
          this.$router.push({
            path: '/tdm/ProduceExperiment',
            query: { name: date }
          });
        }, 300);
      }, */
    /* 实验进度查询 */
    goBigScreen () {
      setTimeout(() => {
        this.$router.push({
          path: '/BigScreen',
        });
      }, 300);
    },
    /* 报告查询打印 */
    goExperimentalReport () {
      setTimeout(() => {
        this.$router.push({
          path: '/tdm/experimentalReport'
        })
      }, 300)
    },
    /* 个人中心 */
    goHome () {
      if (this.$route.path != '/home') {
        this.$router.push('/home')
      }

    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background: url('../../../../assets/img/u758.jpg') no-repeat left top;
  background-size: 100% 100%;
  padding: 10px 120px;
  padding-top: 60px;
  box-sizing: border-box;
}
h1 {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 5px;
  margin-bottom: 60px;
}
.mian {
  margin-top: 40px;
  display: flex;
  box-sizing: border-box;
  .leftBox {
    flex: 1.2;
    margin-right: 100px;
    height: 560px;
    ul {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      li {
        flex: 1;
        background-color: rgb(245, 245, 245);
        img {
          width: 100%;
        }
        &:nth-child(2) {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20px;
          span {
            font-size: 14px;
            &:nth-child(1) {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
          }
        }
      }
    }
  }
  .rightBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1.5;
    height: 560px;
    border-radius: 10px;
    overflow: hidden;
    .el-row {
      margin-bottom: 20px;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
      .el-button {
        width: 100%;
        height: 120px;
        border-radius: 10px;
        font-size: 26px;
        letter-spacing: 3px;
        color: #fff;
        font-weight: bold;
        /deep/i {
          font-size: 50px !important;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
}
.text {
  line-height: 2.5;
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  height: 80vh;
}
</style>

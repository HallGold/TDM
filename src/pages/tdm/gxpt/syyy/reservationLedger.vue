<template>
  <div class="container">
    <ice-query-grid title="预约台账" data-url="/tdm/experimentAppointment/list" :pagination="true" :columns="columns" :gridIndex="true" :operations="operations" ref="reservationLedgerRef" :operationsWidth="200" chooseItem="single" :buttons="buttons" :query="query"></ice-query-grid>
    <!-- 用户须知 -->
    <ice-dialog v-dialogDrag title="《预约使用条例》" center :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="closeItem" append-to-body width="900px">
      <div class="text">
        <div class="" v-html="htmls"></div>
        <template>
          <el-checkbox v-model="checked"></el-checkbox><span style="margin-left:10px">进入预约表示你已同意</span><span style="color:#219FBA;">《预约使用条例》</span>
        </template>
      </div>
      <div class="ice-button-bar" slot="footer">
        <el-button type="info" size="medium" @click="closeItem">取消</el-button>
        <el-button type="primary" size="medium" @click="goAutonomousExperiment" :disabled="timeOut==0?false:true">进入预约 {{timeOut==0?'':timeOut+' '+'s'}}</el-button>
      </div>
    </ice-dialog>

  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "reservationLedger",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      htmls: "<blockquote><p style=\"text-align: center;\"><span><b>职责</b></span></p><p style=\"text-align: left;\">第一条、测试委托人必须明确样品的安全状态，了解测试项目的操作过程和目的性，对测试样品本身的安全性负责。由于样品本身状态的原因(如样品规格、状态等)导致不能进行测试的由测试委托人负责。</p><p>第二条、如自主测试，自主测试人需经专门操作培训，并经班组仪器负责人确认后方可进行。自主测试人应对测试过程安全性负责，爱护实验仪器设备、设施，并接受测试班组的监督。<br><p>第三条、实验室检测责任人(或协助测试人员)确认样品的测试条件并对测试设备(计量器具)的有效性负责，对自主测试人员操作资格进行确认。</p></p><p style=\"text-align: center;\"><b>测试管理流程</b></p><p style=\"text-align: left;\">第四条、测试委托人应首先填写“检测送样确认单(委托书)”，可以为电子版、打印件或手写件(见附件1)。</p><p><p>第五条、测试选样人员持“检测送样确认单”与样品一同送分析中心样品管理人员，并一同核对样品信息。<br>第六条、测试单位调度依据中心样品管理人员确认后的“检测送样确认单”下发“任务单”至班组。<br>第七条、测试班组接到“任务单”后及时安排测试，测试人员按照约定方式进行测试，后对外提供测试数据或报告。工艺人员对数据进行复核和报出，经审核后对外提供测试数据或报告。</p></p><p style=\"text-align: center;\"><span><b>安全要求</b></span></p><p>第八条、测试过程应符合院所安全管理要求,对未知物在测试前委托人应提供必要的的安全技术说明,否则测试班组有权拒绝安排测试。<br>第九条、自主测试全过程应符合相关的安全法律法规、化材所安全规章制度和实验室的安全操作规程。<br>第十条、进入实验室的自主测试人员必须听从实验室工作人员的安排,不得随意操作未经许可的测试设备。<br><br></p><p style=\"text-align: center;\"><span><b>保密要求</b></span></p><p>第十一条、分析中心承诺对委托测试结果按照院所要求进行保密。<br>第十二条、进入实验室的自主测试人员必须遵守国家及院所各项保密要求,必须遵守实验室二级保密制度。<br>第十三条、对不符合保密要求的行为,实验室工作人员有权终止其测试活动,并上报实验室管理者。</p><p style=\"text-align: right;\"><span><b>分析化学研究中心&nbsp;</b></span><br><br><br></p></blockquote><p><br></p>",
      query: [
        { type: "input", label: "实验名称", code: "searchTerm", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",

          align: "center",
        },
        /*   {
            label: "实验名称",
            code: "name",
            align: "center",
          }, */
        {
          label: "实验类型",
          code: "reservationType",
          align: "center",
          formatter (row) {
            /*  console.log(row); */
            if (row.reservationType == 1) {
              return '自主预约'
            } else if (row.reservationType == 2) {
              return '委托预约'
            } else {
              return '生产预约'
            }
          }
        },
        {
          label: "委托单位",
          code: "entrustUnit",
          align: "center",
        },
        {
          label: "预约人",
          code: "people",
          align: "center",
        },
        {
          label: "完成日期",
          code: "sendSampleTime",
          align: "center",
        },
        {
          label: "预约时间",
          code: "createTime",

          align: "center",
        },
        {
          label: "状态",
          code: "status",
          align: "center",
          formatter (row) {
            if (row.status == 1) {
              return "已受理"
            } else if (row.status == 0) {
              return "未受理"
            }
          }
        },
        {
          label: "备注说明",
          code: "remarks",
          align: "center",
        },
      ],
      operations: [
        { name: "查看详情", callback: this.details },
        {
          name: "删除", callback: this.deleteItem,
          isShow: function (row) {
            return row.status == 0
          }
        },
      ],
      buttons: [
        {
          name: "新增预约",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addAppointment,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refresh,
        },
      ],
      dialogVisible: false,
      timeOut: 10,
      checked: false,
    };
  },
  methods: {
    /* 详情 */
    details (row) {
      /* console.log(row.id); */
      this.$router.push({
        path: "/tdm/reservationLedgerRefDetails",
        query: row
      });

    },
    refresh () {
      this.$refs.reservationLedgerRef.refresh();
    },
    /* 删除 */
    deleteItem (row) {
      if (row.status == 0) {
        this.$confirm("确定删除操作吗?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then((result) => {
          this.$axios.delete('tdm/experimentAppointment/delApp', {
            params: {
              appId: row.id
            }
          }).then(res => {
            this.$message.success('删除成功');
            this.$refs.reservationLedgerRef.refresh();
          }).catch(err => {
            this.$message.error(err.msg)
          })
        })
      } else {
        this.$message.warning('该项无法删除!')
      }
    },
    addAppointment () {
      this.dialogVisible = true;
      this.timeOut = 10;
      this.checked = false;
      this.$nextTick(() => {
        this.Countdown();
      })
    },
    closeItem () {
      this.dialogVisible = false
    },
    goAutonomousExperiment (date) {
      if (this.checked) {
        this.checked = true;
        this.dialogVisible = false;
        this.$router.push({
          path: '/tdm/AutonomousExperiment',
          query: { name: date }
        });
      } else {
        this.$message.warning('你未同意使用预约条例!')
      }
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
  },
  activated () {
    this.$refs.reservationLedgerRef.refresh();
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.text {
  line-height: 2.5;
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  height: 80vh;
}
</style>

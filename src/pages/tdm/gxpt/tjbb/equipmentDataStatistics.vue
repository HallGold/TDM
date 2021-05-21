<template>
  <el-container>
    <ice-query-grid title="设备实验数据管理"
                    data-url="tdm/StatisticalReport/getEquipmentStatistics"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="equipmentDataStatisticsRef"
                    chooseItem="single"
                    :gridIndex="true"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
  </el-container>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
export default {
  name: 'equipmentDataStatistics',
  components: { IceQueryGrid },
  data () {
    return {
      query: [
        { type: "input", label: "实验名称", code: "projectName", value: "" },
        {
          type: "static", label: "", code: "startTime", value: () => {
            return this.startTime
          }
        },
        {
          type: "static", label: "", code: "endTime", value: () => {
            return new Date()
          }
        },
      ],
      columns: [
        { code: "projectOid", hidden: true },
        {
          label: "设备编号",
          code: "equipmentNumber",
          align: "center",
        },
        {
          label: "设备名称",
          code: "equipmentName",
          align: "center",
        },
        {
          label: "设备负责人名称",
          code: "principal",
          align: "center",
        },
        {
          label: "部门名称",
          code: "departmentName",
          align: "center",
        },
        {
          label: "设备位置",
          code: "laboratoryName",
          align: "center",
        },
        {
          label: "预约总数量",
          code: "appoTotalNum",
          align: "center",
        },
        {
          label: "已完成实验作业总数量",
          code: "finishTotalNum",
          align: "center",
        },
      ],
      operations: [],
      buttons: [
        {
          name: "按月",
          type: "primary",
          icon: 'el-icon-search',
          callback: this.monthMethods
        },
        {
          name: "按周",
          type: "primary",
          icon: 'el-icon-search',
          callback: this.weekMethods
        },
        {
          name: "按天",
          icon: 'el-icon-search',
          type: "primary",
          callback: this.dayMethods
        },
      ],
      /* 开始时间和结束时间 */
      startTime: '',
      endTime: '',
    }
  },
  methods: {
    /* 按天 */
    dayMethods () {
      let daySart = new Date(new Date(new Date().toLocaleDateString()).getTime());
      /*  console.log(daySart); */
      this.startTime = daySart;
      /* console.log(this.startTime); */
      this.$refs.equipmentDataStatisticsRef.refresh()
    },
    /* 按周 */
    weekMethods () {
      var date = new Date();
      // 本周一的日期
      date.setDate(date.getDate() - date.getDay() + 1);
      var week = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00";
      /*  console.log(week); */
      this.startTime = week;
      /*   console.log(this.startTime); */
      this.$refs.equipmentDataStatisticsRef.refresh()
    },
    /* 按月 */
    monthMethods () {
      var now = new Date(); //当前日期 
      var nowMonth = now.getMonth(); //当前月 
      var nowYear = now.getFullYear(); //当前年 
      //本月的开始时间
      var month = new Date(nowYear, nowMonth, 1);
      /*   console.log(month); */
      this.startTime = month;
      /*  console.log(this.startTime); */
      this.$refs.equipmentDataStatisticsRef.refresh()
    },
  },
  mounted () {
    this.monthMethods();
    console.log(this.startTime);
  }
}
</script>

<style lang="less" scoped>
.el-container {
  background-color: #fff;
}
/deep/.el-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
/deep/.el-button--primary:hover {
  background-color: #91c8ff;
  border-color: #91c8ff;
}
/deep/.el-button--primary:focus {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
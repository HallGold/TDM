<template>
  <div class="ice-container">
    <ice-query-grid title="受理台账" data-url="tdm/experimentAppointment/waitSendSamples" :pagination="false" :columns="columns" :gridIndex="true" ref="AcceptanceLedgerRef" chooseItem="single" :buttons="buttons"></ice-query-grid>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceGridLayout from "@/components/common/base/IceGridLayout";
export default {
  title: 'AcceptanceLedger',
  components: { IceQueryGrid, IceDialog, IceGridLayout },
  data () {
    return {
      querys: [
        // { type: "static", label: "", code: "toExamine", value: 0 },
        { type: "static", label: "", code: "urlType", value: 2 },
        { type: "input", label: "项目名称/样品名称", code: "searchTerm", value: "" },
      ],
      columns: [
        { code: "id", hidden: true },
        /* {
            label: "预约名称",
            code: "reservationName",
            align: "center",
        }, */
        {
          label: "预约编号",
          code: "reservationNumber",
          align: "center",
        },
        {
          label: "预约日期",
          code: "appCreatTime",
          align: "center",
        },
        {
          label: "实验类型",
          code: "reservationType",
          align: "center",
          formatter: (data) => {
            /*  console.log(data); */
            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
            let obj = {
              color: '#fff',
              background: color[data.reservationType],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.reservationType == 1 ? '自主' : data.reservationType == 2 ? "委托" : "生产"}</span>
          }
        },
        {
          label: "期望完成日期",
          code: "sendSampleTime",
          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          align: "center",
        },
        {
          label: "实验项目",
          code: "projectName",
          align: "center",
        },
        {
          label: "实验设备",
          code: "equipmentName",
          align: "center",
        },
        {
          label: "是否受理",
          code: "toExamine",
          align: "center",
          formatter: (data) => {
            let obj = {
              color: '#fff',
              background: '#F56C6C',
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>待送样,请尽快送样!</span>;
          }
        },
      ],
      buttons: [
        {
          name: "刷新",
          type: "primary",
          icon: 'el-icon-refresh',
          callback: () => {
            this.$refs.AcceptanceLedgerRef.refresh();
          }
        },
      ],
      id: ''
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
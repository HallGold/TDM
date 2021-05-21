<template>
  <div class="ice-container">
    <ice-query-grid title="受理台账"
                    data-url="tdm/experimentAppointment/acceptTheLedger"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="true"
                    :operations="operations"
                    ref="AcceptanceLedgerRef"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="querys"></ice-query-grid>
    <!--填写结果-->
    <ice-dialog v-dialogDrag
                title="预约受理"
                center
                :visible.sync="resultDialog"
                :before-close="closeResult"
                append-to-body
                width="800px">
      <el-form :model="resultForm"
               label-position="right"
               class="conditon-bar"
               ref="resultRef"
               :rules="resultRules">
        <ice-grid-layout name="预约受理"
                         :columns="1">
          <el-form-item label="是否受理:"
                        label-width="130px"
                        prop="toExamine">
            <template>
              <el-radio v-model="resultForm.toExamine"
                        label="1">受理</el-radio>
              <el-radio v-model="resultForm.toExamine"
                        label="2">不受理</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="备注"
                        label-width="130px">
            <el-input v-model="resultForm.desc"
                      :rows="3"
                      type="textarea"></el-input>
          </el-form-item>
        </ice-grid-layout>
      </el-form>
      <div class="dialog-footer ice-button-bar">
        <el-button type="primary"
                   @click="saveResult">确定</el-button>
        <el-button type="info"
                   @click="closeResult">取 消</el-button>
      </div>
    </ice-dialog>
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
        // {
        //   label: "预约编号",
        //   code: "reservationNumber",
        //   align: "center",
        // },
        // {
        //   label: "预约日期",
        //   code: "appCreatTime",
        //   align: "center",
        // },
        {
          label: "委托单位",
          code: "entrustUnit",
          align: "center",
        },
        {
          label: "预约人",
          code: "appUser",
          align: "center",
        },
        {
          label: "联系方式",
          code: "phone",
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
          label: "规格型号",
          code: "sampleAttributeVar",
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
            return data.toExamine==0?'未受理':data.toExamine==1?'已受理':'不受理';
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
        {
          name: "导出",
          type: "primary",
          icon: 'el-icon-download',
        },
      ],
      operations: [
        {
          name: "预约受理", callback: (row) => {
            this.id = row.id;
            this.resultDialog = true;
            this.$nextTick(() => {
              this.$refs.resultRef.resetFields();
              this.resultForm.desc = '';
            })
          },
          isShow:function (row) {
            return row.toExamine == 0
          }
        },
      ],
      resultDialog: false,
      resultForm: {
        desc: '',
        toExamine: ''
      },
      resultRules: {
        toExamine: [
          { required: true, message: "请选择是否受理", trigger: "change", },
        ],
        /* experimentalResults: [
          { required: true, message: "填写结果", trigger: "blur", },
        ], */
      },
      id: ''
    }
  },
  methods: {
    closeResult () {
      this.resultDialog = false
    },
    saveResult () {
      this.$refs.resultRef.validate(vali => {
        if (vali) {
          this.$axios.post('tdm/experimentAppointment/acceptTheTask', {
            id: this.id,
            toExamine: this.resultForm.toExamine,
            desc: this.resultForm.desc
          }).then((res) => {
            this.resultDialog = false;
            this.$message.success('操作成功！')
            this.$refs.AcceptanceLedgerRef.refresh();
          }).catch(err => {
            this.$message.error(err.msg)
          })
        } else {
          this.$message.warning('请选择是否受理!')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
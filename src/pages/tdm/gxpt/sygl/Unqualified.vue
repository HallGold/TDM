<template>
  <div class="container">
    <ice-query-grid title="不合格品"
                    data-url="/tdm/experiment/ngProductList"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="Unqualified"
                    :operationsWidth="200"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
    <!-- 查看详情 -->
    <ice-dialog v-dialogDrag
                title="不合格品详情"
                center
                :visible.sync="detailDialog"
                :close-on-click-modal="false"
                :before-close="detailClose"
                append-to-body
                width="800px">
      <div class="titleName">不合格品详情</div>
      <div class="headers">
        <h2>{{detailData.projectName}}</h2>
        <ul>
          <li>
            实验室编号:<span>{{ detailData.laboratoryName }}</span>
          </li>
          <li>
            样品编号：<span>{{ detailData.sampleNumber }}</span>
          </li>
          <li>
            样品名称：<span>{{ detailData.sampleName }}</span>
          </li>
          <li>
            样品数量：<span>{{ detailData.sampleNum }}</span>
          </li>
          <li>
            实验人员：<span>{{ detailData.peopleName }}</span>
          </li>
          <li>
            实验时间：<span>{{ detailData.startTime }}</span>
          </li>
          <li>
            完成时间：<span>{{ detailData.endTime }}</span>
          </li>
        </ul>
      </div>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="detailClose">关闭</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "Unqualified",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "实验项目名称", code: "name", value: "" },
        { type: "static", label: "", code: "", value: "" },
      ],
      columns: [
        { code: "id", hidden: true },
        {
          label: "实验项目名称",
          code: "projectName",
          width: 135,
          align: "center",
        },
        {
          label: "实验室编号",
          code: "laboratoryName",
          width: 135,
          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 135,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 135,
          align: "center",
        },
        {
          label: "样品数量",
          code: "sampleNum",
          width: 135,
          align: "center",
        },
        {
          label: "实验人员",
          code: "peopleName",
          width: 135,
          align: "center",
        },
        {
          label: "实验时间",
          code: "startTime",
          width: 135,
          align: "center",
        },
        {
          label: "完成时间",
          code: "endTime",
          width: 135,
          align: "center",
        },
      ],
      operations: [
        { name: "查看详情", callback: this.SeeDetails },
        { name: "删除", callback: this.delete },
      /*   { name: "实验工艺下载", callback: this.experimentCraft }, */
      ],
      buttons: [
        /*  {
           name: "新增",
           icon: "el-icon-plus",
           type: "primary",
           callback: this.addItem,
         }, */
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refreshItdm,
        },
      ],
      detailDialog: false,
      /* form表单数据 */
      form: {
        name: "",
        numbering: "",
        sampleNumber: "",
        sampleName: "",
        sampleQuantity: "",
        personnel: "",
        experimentCraft: "",
        ExperimentTime: "",
        EndTime: "",
      },
      /* 表单验证规则 */
      rules: {
        name: [
          { required: true, message: "请输入实验名称", trigger: "blur" },
        ],
        numbering: [
          { required: true, message: "请输入实验编号", trigger: "blur" },
        ],
        sampleNumber: [
          { required: true, message: "请输入样品编号", trigger: "blur" },
        ],
        sampleName: [
          { required: true, message: "请输入样品名称", trigger: "blur" },
        ],
        sampleQuantity: [
          { required: true, message: "请输入样品数量", trigger: "blur" },
        ],
        personnel: [
          { required: true, message: "请输入实验人员", trigger: "blur" },
        ],
        experimentCraft: [
          { required: true, message: "请选择实验工艺", trigger: "change" },
        ],
        ExperimentTime: [
          { required: true, message: "请输入实验时间", trigger: "change" },
        ],
        EndTime: [
          { required: true, message: "请输入结束时间", trigger: "change" },
        ],
      },
      /* 详情数据 */
      detailData: {
        projectName: "",
        laboratoryName: "",
        sampleNumber: "",
        sampleName: "",
        sampleNum: "",
        peopleName: "",
        startTime: "",
        endTime: "",
      }

    };
  },
  methods: {
    /* 查看详情 */
    SeeDetails (row) {
      this.detailDialog = true;
      console.log(row);
      this.detailData = row
    },
    /* 删除 */
    delete (row) {
      console.log(row);
      this.$confirm('确定删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$axios.delete('/tdm/experiment/deleteNgProduct', {
          params: {
            ngProductId: row.id
          }
        }).then(res => {
          this.$message.success('删除成功!')
          this.$refs.Unqualified.refresh();
        }).catch(err => {
          this.$message.error(err.msg)
        })
      })
    },
    /* 表格刷新 */
    refreshItdm () {
      this.$refs.Unqualified.refresh();
    },

    /* 关闭详情 */
    detailClose () {
      this.detailDialog = false;
    },
    /* 实验工艺 */
    experimentCraft (row) {
      /* console.log(row.experimentCraft); */
      this.$downloadFile(row.experimentCraft)
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.headers {
  h2 {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    margin-top: 10px;
    margin-bottom: 30px;
    box-sizing: border-box;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px;
    box-sizing: border-box;
    li {
      width: 50%;
      margin-bottom: 20px;
      font-size: 15px;
    }
  }
}
.titleName {
  position: relative;
  padding: 0 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 25px;
    background-color: #0091b0;
    position: absolute;
    top: -2px;
    left: 8px;
  }
}
</style>
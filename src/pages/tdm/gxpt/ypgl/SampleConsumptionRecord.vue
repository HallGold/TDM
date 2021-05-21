<template>
  <div class="container">
    <ice-query-grid title="样品消耗记录"
                    data-url="/permission/res/ds/outer/get/ds_config_infos?loadDisabled=true"
                    :pagination="false"
                    :columns="columns"
                    ref="Unqualified"
                    :gridIndex="false"
                    chooseItem="single"
                    :buttons="buttons"></ice-query-grid>
    <!-- 新增和编辑 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <el-form ref="form"
               :model="form"
               label-width="120px"
               :rules="rules"
               class="formList">
        <el-form-item label="样品编号:"
                      prop="numbering">
          <el-input v-model="form.numbering"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="样品名称:"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="实验作业编号:"
                      prop="ExperimentNumber">
          <el-input v-model="form.ExperimentNumber"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="检测项目:"
                      prop="Detect">
          <el-input v-model="form.Detect"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="实验数量:"
                      prop="textNumber">
          <el-input v-model="form.textNumber"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量:"
                      prop="consumeNumber">
          <el-input v-model="form.consumeNumber"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="计量单位:"
                      prop="Measure">
          <el-select v-model="form.Measure"
                     placeholder="请选择计量单位"
                     clearable>
            <el-option label="ml"
                       value="0"></el-option>
            <el-option label="mg"
                       value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验人员:"
                      prop="personnel">
          <el-select v-model="form.personnel"
                     placeholder="请选择腐蚀性"
                     clearable>
            <el-option label="是"
                       value="0"></el-option>
            <el-option label="否"
                       value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验时间:"
                      prop="time">
          <el-date-picker v-model="form.time"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "SampleConsumptionRecord",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      columns: [
        { code: "oid", hidden: true },
        {
          label: "样品编号",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "样品名称",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "实验作业编号",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "检测项目",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "实验数量",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "损耗数量",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "计量单位",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "实验人员",
          code: "dsName",
          width: 150,
          align: "center",
        },
        {
          label: "实验时间",
          code: "dsName",
          width: 150,
          align: "center",
          sortable: true,
        },
      ],
      buttons: [
        /*   {
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
        {
          name: "导入",
          icon: "el-icon-download",
          type: "primary",
          callback: this.download,
        },
        {
          name: "导出",
          icon: "el-icon-upload2",
          type: "primary",
          callback: this.Upload,
        },
        {
          name: "删除",
          type: "primary",
          callback: this.delete,
        },
      ],
      dialogVisible: false,
      title: "",
      /* form表单数据 */
      form: {
        numbering: "",
        name: "",
        ExperimentNumber: "",
        Detect: "",
        textNumber: "",
        consumeNumber: "",
        Measure: "",
        personnel: "",
        time: "",
      },
      /* 表单验证规则 */
      rules: {
        numbering: [
          { required: true, message: "请输入样品编号", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入样品名称", trigger: "blur" }],
        ExperimentNumber: [
          { required: true, message: "请输入实验作业编号", trigger: "blur" },
        ],
        Detect: [
          { required: true, message: "请输入检测项目", trigger: "blur" },
        ],
        textNumber: [
          { required: true, message: "请输入实验数量", trigger: "blur" },
        ],
        consumeNumber: [
          { required: true, message: "请输入损耗数量", trigger: "blur" },
        ],
        Measure: [
          { required: true, message: "请选择计量单位", trigger: "change" },
        ],
        personnel: [
          { required: true, message: "请输入实验人员", trigger: "blur" },
        ],
        time: [
          { required: true, message: "请选择实验时间", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    /* 新增 */
    addItem () {
      this.title = "添加样品";
      this.dialogVisible = true;
    },
    /* 删除 */
    delete () { },
    /* 刷新 */
    refreshItdm () {
      this.$refs.Unqualified.refresh();
    },
    download () { },
    Upload () { },
    closeItem () {
      this.dialogVisible = false;
    },
    /* 保存 */
    save () { },
    closeDialog () {
      this.dialogVisible = false;
    },
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
.formList {
  box-sizing: border-box;
  padding-right: 30px;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.el-form-item {
  width: 50%;
}
</style>

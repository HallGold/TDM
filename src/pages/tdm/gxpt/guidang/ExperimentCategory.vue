<template>
  <div class="container">
    <ice-query-grid title="实验类别管理"
                    data-url="/permission/res/ds/outer/get/ds_config_infos?loadDisabled=true"
                    :pagination="false"
                    :columns="columns"
                    :operations="operations"
                    ref="ExperimentCategory"
                    :operationsWidth="200"
                    chooseItem="multiple"
                    :buttons="buttons"
                    :query="query">
    </ice-query-grid>
    <ice-dialog v-dialogDrag
                title="实验类别添加"
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
        <el-form-item label="实验类别编号:"
                      prop="numbering">
          <el-input v-model="form.numbering"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="实验类别名称:"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="备注说明:"
                      style="flex: 1;margin-top:10px">
          <el-input type="textarea"
                    v-model="form.remarks"
                    placeholder="简略描述预约备注说明"></el-input>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="primary"
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
  name: "ExperimentCategory",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "实验类别编号", code: "name", value: "" },
        { type: "input", label: "实验类别名称", code: "name", value: "" },
      ],
      operations: [{ name: "删除", callback: this.delete }],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "实验类别编号",
          code: "dsName",
          width: 250,
          align: "center",
        },
        {
          label: "实验类别名称",
          code: "dsName",
          width: 250,
          align: "center",
        },
        {
          label: "描述",
          code: "dsName",
          width: 250,
          align: "center",
        },
        {
          label: "创建时间",
          code: "dsName",
          width: 250,
          align: "center",
        },
      ],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
        },
      ],
      dialogVisible: false,
      /* form表单数据 */
      form: {
        numbering: "",
        name: "",
        remarks: "",
      },
      /* 表单验证规则 */
      rules: {
        numbering: [
          { required: true, message: "请输入实验类别编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入实验类别名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addItem () {
      this.dialogVisible = true;
    },
    delete () { },
    closeItem () {
      this.dialogVisible = false;
    },
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

<template>
  <div class="container">
    <ice-query-grid title="余样处理"
                    data-url="tdm/sample/remainingSampleList"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="false"
                    :operations="operations"
                    ref="RemainingSample"
                    :operationsWidth="200"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
    <!-- 新增和编辑 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">{{title}}</div>
      <el-form ref="form"
               :model="form"
               label-width="120px"
               :rules="rules"
               class="formList">
        <el-form-item label="样品编号:"
                      prop="sampleNumber">
          <!--  <el-select v-model="form.sampleNumber"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="请输入样品编号"
                     :remote-method="remoteMethod"
                     :loading="loading"
                     @change="SelectChange">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
          <el-input placeholder="请输入内容"
                    v-model="form.sampleNumber"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-edit-outline"
                       @click="OpenSampleDialog"></el-button>
          </el-input>
        </el-form-item>
        <!--  <el-form-item label="样品名称:"
                      prop="sampleName">
          <el-input v-model="form.sampleName"
                    placeholder="请输入内容"></el-input>
        </el-form-item> -->
        <el-form-item label="样品数量:"
                      prop="remainingSample">
          <!--                           @change="handleChangeNum"-->
          <el-input-number v-model="form.remainingSample"
                           :min="0.1"
                           :step="0.1"
                           label="不能小于0.1"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="计量单位:"
                      prop="unit">
          <el-select v-model="form.unit"
                     placeholder="请选择计量单位"
                     clearable>
            <el-option label="ml"
                       value="ml"></el-option>
            <el-option label="mg"
                       value="mg"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="处理方式:"
                      prop="dealWithMethod">
          <el-select v-model="form.dealWithMethod"
                     placeholder="请选择处理方式"
                     clearable>
            <el-option label="销毁"
                       value="1"></el-option>
            <el-option label="退还"
                       value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理时间:"
                      prop="dealWithTime">
          <el-date-picker v-model="form.dealWithTime"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理人员:"
                      prop="dealWithPeople">
          <el-input v-model="form.dealWithPeople"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="接收人员:"
                      :prop="form.dealWithMethod==2?'receivePeople':''"
                      v-show="form.dealWithMethod==2">
          <el-input v-model="form.receivePeople"
                    placeholder="请输入内容"></el-input>
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
    <!-- 选择样品 -->
    <ice-dialog v-dialogDrag
                title="选择样品"
                center
                :visible.sync="SelectedSampleVisible"
                :close-on-click-modal="false"
                :before-close="closeSampleDialog"
                append-to-body
                width="1200px">
      <ice-query-grid title="选择样品"
                      data-url="tdm/sample/finishedSample"
                      :pagination="true"
                      :columns="sampleColumns"
                      :gridIndex="false"
                      ref="SelectedSampleRef"
                      chooseItem="single"
                      :query="sampleQuery"
                      @selection-change="selectionChangeItem"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="SelectedSampleSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeSampleDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "RemainingSample",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "样品名称", code: "searchText", value: "" },
        { type: "static", label: "是否分页", code: "paginaTion", value: 0 },

      ],
      columns: [
        { code: "id", hidden: true },
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
          label: "样品数量",
          code: "sampleNum",

          align: "center",
        },
        {
          label: "计量单位",
          code: "unit",

          align: "center",
        },
        {
          label: "处理方式",
          code: "dealWithMethod",

          align: "center",
          formatter (row) {
            if (row.dealWithMethod == 1) {
              return "销毁";
            } else if (row.dealWithMethod == 2) {
              return "退还";
            } else {
              return "其他";
            }
          },
        },
        {
          label: "接收人员",
          code: "receivePeople",

          align: "center",
        },
        {
          label: "处理人员",
          code: "dealWithPeople",

          align: "center",
        },
        {
          label: "处理时间",
          code: "dealWithTime",
          align: "center",
        },
      ],
      operations: [
        /*  { name: "编辑", callback: this.compiler }, */
        { name: "删除", callback: this.delete },
      ],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refreshItdm,
        },
      ],
      dialogVisible: false,
      SelectedSampleVisible: false,
      title: "",
      /* form表单数据 */
      form: {
        sampleNumber: "",
        /* sampleName: "", */
        remainingSample: "",
        /* unit: "", */
        receivePeople: "",
        dealWithPeople: "",
        dealWithMethod: "",
        dealWithTime: "",
      },
      /* 远程所搜 */
      options: [{}],
      list: [],
      /* 是否从远程获取数据 */
      loading: false,
      /* 表单验证规则 */
      rules: {
        sampleNumber: [
          { required: true, message: "请选择样品编号", trigger: "blur" },
        ],
        /* sampleName: [
          { required: true, message: "请输入样品名称", trigger: "blur" },
        ], */
        remainingSample: [
          {
            required: true,
            message: "请输入样品数量,不得大于9",
            trigger: "blur",
          },
        ],
        /*  unit: [
           { required: true, message: "请选择计量单位", trigger: "change" },
         ], */
        receivePeople: [
          { required: true, message: "请输入接收人员", trigger: "blur" },
        ],
        dealWithPeople: [
          { required: true, message: "请输入处理人员", trigger: "blur" },
        ],
        dealWithMethod: [
          { required: true, message: "请选择处理方式", trigger: "change" },
        ],
        dealWithTime: [
          { required: true, message: "请选择处理时间", trigger: "change" },
        ],
      },
      sampleColumns: [
        { code: "id", hidden: true },
        {
          label: "样品条码",
          code: "barCode",
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
          label: "入库数量",
          code: "warehousingNum",
          align: "center",
        },
        {
          label: "单位",
          code: "dictionaryCategory",
          align: "center",
          renderCell (h, data) {
            return data.row.dictionaryCategory.name
          },
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          align: "center",
          formatter (row) {
            if (row.isDynamite == 1) {
              return '是'
            } else {
              return '否'
            }
          }
        },
      ],
      sampleQuery: [
        { type: "input", label: "样品名称", code: "searchTerm", value: "" },
      ],
      sampleNumber: '',
      unit: ''
    };
  },
  methods: {
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.title = "添加样品";
      this.dialogVisible = true;
      this.form.sampleNumber = "";
      /* this.form.sampleName = ""; */
      this.form.remainingSample = "";
      /*   this.form.unit = ""; */
      this.form.receivePeople = "";
      this.form.dealWithMethod = "";
      this.form.dealWithMethod = "";
      this.form.dealWithTime = "";
      this.unit = '';
      this.sampleNumber = ''
    },
    /* 编辑 */
    /*  compiler() {
      this.title = "编辑样品";
      this.dialogVisible = true;
    }, */
    /* 删除 */
    delete (row) {
      /*  console.log(row); */
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("tdm/sample/deleteRemainingSample", {
            params: { remainingSampleId: row.id },
          })
          .then((success) => {
            this.$message.success("删除成功");
            this.$refs.RemainingSample.refresh();
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error.msg ? error.msg : "操作出错了",
            });
          });
      });
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.RemainingSample.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    closeSampleDialog () {
      this.SelectedSampleVisible = false;
    },
    /* 保存 */

    save () {
      this.$refs.form.validate((vali) => {
        if (vali) {
          this.$axios
            .put("tdm/sample/addRemainingSample", {
              sampleNumber: this.form.sampleNumber,
              /* sampleName: this.form.sampleName, */
              remainingSample: this.form.remainingSample,
              /*  unit: this.form.unit, */
              dealWithPeople: this.form.dealWithPeople,
              receivePeople: this.form.receivePeople,
              dealWithMethod: this.form.dealWithMethod,
              dealWithTime: this.form.dealWithTime,
              unit: this.unit
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: "新增成功",
              });
              this.dialogVisible = false;
              this.$refs.RemainingSample.refresh();
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.msg,
              });
            });
        } else {
          this.$message.error("请将表单填写完整");
        }
      });
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    remoteMethod (query) {
      if (query !== "") {
        this.loading = true;
        this.$axios
          .get("tdm/sample/remainingSample", {
            params: { sampleNumber: query },
          })
          .then((res) => {
            this.loading = false;
            this.list = res.data;
            this.options[0].value = this.list.sampleNumber;
            this.options[0].label =
              this.list.sampleName + "(" + this.list.sampleNumber + ")";
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.options = [];
        /*  this.form.sampleName = ""; */
      }
    },
    /*   SelectChange (row) {
        console.log(this.form);
        if (row.length !== 0) {
          this.form.sampleName = this.list.sampleName;
          this.form.remainingSample = this.list.remainingSample;
          this.form.unit = this.list.unit;
        } else {
        }
      }, */
    /*  handleChangeNum (row) {
        console.log(row);
       if (row >= 9) {
         this.$message({
           type: "warning",
           message: "最大数字为9",
         });
       }
     }, */
    OpenSampleDialog () {
      this.SelectedSampleVisible = true;

    },
    /* 样品保存 */
    SelectedSampleSave () {
      this.form.sampleNumber = this.sampleNumber
      this.SelectedSampleVisible = false;
    },
    /* 样品选中 */
    selectionChangeItem (row) {
      this.sampleNumber = row[0].sampleNumber
      this.unit = row[0].dictionaryCategory.name
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

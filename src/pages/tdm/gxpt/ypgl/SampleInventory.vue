<template>
  <div class="container">
    <ice-query-grid title="样品库管理"
                    data-url="/tdm/sample/sampleWarehouseList"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="false"
                    :operations="operations"
                    ref="Unqualified"
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
        <el-form-item label="样品名称:"
                      prop="sampleName">
          <el-input v-model="form.sampleName"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="样品外观:"
                      prop="sampleExterior">
          <el-input v-model="form.sampleExterior"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="规格型号:"
                      prop="sampleAttributes">
          <el-select v-model="attributesValue"
                     multiple
                     placeholder="请选择"
                     @change="attributeChange"
                     :filterable="true">
            <el-option v-for="item in attributesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否炸药:"
                      prop="isDynamite">
          <el-select v-model="form.isDynamite"
                     placeholder="请选择是否炸药">
            <el-option v-for="item in isDynamiteData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测依据:"
                      prop="testingStandard">
          <el-input v-model="form.testingStandard"
                    placeholder="请输入内容"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="存储条件:"
                      prop="storageConditions">
          <el-select v-model="storageValue"
                     multiple
                     placeholder="请选择"
                     @change="storageChange"
                     :filterable="true">
            <el-option v-for="item in storageOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
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
  name: "SampleInventory",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "样品名称", code: "sampleName", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 150,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 150,
          align: "center",
        },
        {
          label: "样品外观",
          code: "sampleExterior",
          width: 150,
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 150,
          align: "center",
          formatter (row) {
            return row.isDynamite == 0 ? "否" : "是";
          },
        },
        {
          label: "规格型号",
          code: "sampleAttributes",
          width: 300,
          align: "center",
          renderCell (h, data) {
            let str = "";
            if (data.row) {
              for (let i = 0; i < data.row.sampleAttributes.length; i++) {
                str += data.row.sampleAttributes[i].name + ";";
              }
            }
            return str;
          },
        },
        {
          label: "存储条件",
          code: "storageConditions",
          width: 300,
          align: "center",
          renderCell (h, data) {
            let str = "";
            if (data.row) {
              for (let i = 0; i < data.row.storageConditions.length; i++) {
                str += data.row.storageConditions[i].name + ";";
              }
            }
            return str;
          },
        },
        {
          label: "状态",
          code: "status",
          width: 100,
          align: "center",
          formatter (row) {
            return row.status == 0 ? "禁用" : "启用";
          },
        },
      ],
      operations: [
        { name: "编辑", callback: this.compiler },
        {
          name: "启用",
          callback: this.isEnable,
          isShow: (row) => {
            return row.status == 0;
          },
        },
        {
          name: "禁用",
          callback: this.isEnable,
          isShow: (row) => {
            return row.status == 1;
          },
        },
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
      title: "",
      /* form表单数据 */
      form: {
        sampleName: "",
        sampleExterior: "",
        testingStandard: "",
        isDynamite: "",
        sampleAttributes: '',
        storageConditions: '',
      },
      /* 表单验证规则 */
      rules: {
        sampleName: [
          { required: true, message: "请输入样品名称", trigger: "blur" },
        ],
        sampleExterior: [
          { required: true, message: "请输入样品外观", trigger: "blur" },
        ],
        testingStandard: [
          { required: true, message: "请输入检测依据", trigger: "blur" },
        ],
        isDynamite: [
          { required: true, message: "请选择是否炸药", trigger: "change" },
        ],
        sampleAttributes: [
          { required: true, message: "请选择样品属性", trigger: "change" },
        ],
        storageConditions: [
          { required: true, message: "请选择存储条件", trigger: "change" },
        ],
      },
      //存储条件
      storageOptions: [],
      //样品属性条件
      attributesOptions: [],
      //样品属性下拉列表值
      attributesValue: [],
      //样品存储条件下拉列表值
      storageValue: [],
      isDynamiteData: [
        {
          id: 0,
          name: "否",
        },
        {
          id: 1,
          name: "是",
        },
      ],
    };
  },
  methods: {
    //禁用  启用
    isEnable (row) {
      let status;
      if (row.status == 0) {
        status = 1;
      } else {
        status = 0;
      }
      this.$axios
        .post("/tdm/sample/isEnableSampleWarehouse", {
          oid: row.oid,
          status: status,
        })
        .then((result) => {
          if ((result.status = 200)) {
            this.$message.success("成功");
          } else {
            this.$message.success(result.statusText);
          }
          this.$refs.Unqualified.refresh();
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
    },
    //刷新表单
    emptyForm () {
      this.form = {};
      this.attributesValue = [];
      this.storageValue = [];
      let that = this;
      this.queryDictionary("ypsx", function (data) {
        that.attributesOptions = data;
      });
      this.queryDictionary("ypcctj", function (data) {
        that.storageOptions = data;
      });
    },
    //存储条件值改变
    storageChange (data) {
      console.log(data);
      this.form.storageConditions = new Array();
      //循环选中的值
      for (let j in data) {
        let da = data[j];
        //循环总列表
        for (let i in this.storageOptions) {
          let storage = this.storageOptions[i];
          if (storage.id == da) {
            this.form.storageConditions.push(storage);
          }
        }
      }
    },
    //样品属性值改变
    attributeChange (data) {
      console.log(data);
      this.form.sampleAttributes = new Array();
      //循环选中的值
      for (let j in data) {
        let da = data[j];
        //循环总列表
        for (let i in this.attributesOptions) {
          let attribute = this.attributesOptions[i];
          if (attribute.id == da) {
            this.form.sampleAttributes.push(attribute);
          }
        }
      }
    },
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.title = "添加样品";
      this.dialogVisible = true;
      this.emptyForm();
    },
    /* 编辑 */
    compiler (row) {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      console.log("compiler", row);
      this.title = "编辑样品";
      this.dialogVisible = true;
      this.emptyForm();
      this.form = JSON.parse(JSON.stringify(row));
      this.conversion(row);
    },
    conversion (row) {
      let storages = row.storageConditions;
      let attributes = row.sampleAttributes;
      if (storages) {
        for (let i in storages) {
          let stor = storages[i];
          this.storageValue.push(stor.id);
        }
      }
      if (attributes) {
        for (let i in attributes) {
          let stor = attributes[i];
          this.attributesValue.push(stor.id);
        }
      }
    },
    /* 删除 */
    delete (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("/tdm/sample/delSampleWarehouse", {
            params: { oid: row.oid },
          })
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.$refs.Unqualified.refresh();
          })
          .catch((error) => {
            this.$message.error("删除失败！");
          })
          .finally((_) => { });
      });
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.Unqualified.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    /* 保存 */
    save () {
      this.$refs.form.validate((vali) => {
        console.log(vali);
        console.log();
        if (vali && this.form.sampleAttributes != 0) {
          if (this.form.oid) {
            this.$axios
              .put("/tdm/sample/addSampleWarehouse", this.form)
              .then((result) => {
                console.log("result", result);
                if ((result.status = 200)) {
                  this.$message.success("编辑成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.$refs.Unqualified.refresh();
                this.dialogVisible = false;
              })
              .catch((error) => {
                this.$message.error("编辑失败！");
              })
              .finally((_) => { });
          } else {
            this.$axios
              .put("/tdm/sample/addSampleWarehouse", this.form)
              .then((result) => {
                console.log("result", result);
                if ((result.status = 200)) {
                  this.$message.success("添加成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.$refs.Unqualified.refresh();
                this.dialogVisible = false;
              })
              .catch((error) => {
                this.$message.error("添加失败！");
              })
              .finally((_) => { });
          }
        } else {
          this.$message.error("请将信息填写完整");
        }
      });
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    queryDictionary (code, dictionary) {
      this.$axios
        .get("/tdm/sample/queryDictionary", { params: { type: code } })
        .then((result) => {
          if ((result.status = 200)) {
            let zds = [];
            for (let i in result.data) {
              let d = result.data[i];
              let zd = {};
              zd.name = d.name;
              zd.id = d.code;
              zds.push(zd);
            }
            dictionary(zds);
          }
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
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

<template>
  <div class="containerBox">
    <div class="TopBox">
      <div class="titleName">领样信息</div>
      <p>此系统为非涉密系统，请勿录入涉密信息！</p>
      <el-form ref="form"
               :model="form"
               label-width="150px"
               :rules="rules">
        <el-row :gutter="24"
                v-if="false">
          <el-col :span="8">
            <el-form-item label="领样实验室编号"
                          prop="warehouseNumber">
              <el-select v-model="form.warehouseNumber"
                         placeholder="实验室编号"
                         @change='selectData'>
                <el-option v-for="item in laboratoryOptions"
                           :key="item.oid"
                           :label="item.name"
                           :value="item.oid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人"
                          prop="principalName">
              <el-input v-model="form.principalName"
                        :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label='仓库剩余容量'
                          prop="theRemainingAmount">
              <el-input v-model="form.theRemainingAmount"
                        :disabled='true'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24"
                v-if="false">
          <el-col :span="8">
            <el-form-item label="所属部门"
                          prop="departmentName">
              <el-input v-model="form.departmentName"
                        :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库单位"
                          prop="WarehouseUnit">
              <el-input v-model="form.WarehouseUnit"
                        :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式"
                          prop="phone">
              <el-input v-model="form.phone"
                        placeholder="请输入电话号码"
                        maxlength="11"
                        show-word-limit
                        clearable
                        oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="样品单号"
                          prop="SingleBumber">
              <el-input v-model="form.SingleBumber"
                        placeholder="样品单号">
                <el-button slot="append"
                           class="el-icon-zoom-in"
                           @click="selectSingleBumber"
                           :disabled="form.SingleBumber?false:true"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- <el-form-item label="送样人"
                          >
              <el-input v-model="form.selectNameData"
                        placeholder="选择人员"
                        readonly>
                <el-button slot="append"
                           class="el-icon-edit-outline"
                           @click="selectCode"></el-button>
              </el-input>
            </el-form-item> -->
            <el-form-item label="选择送样人"
                          prop="selectName">
              <ice-persion-selector choose-item="single"
                                    ref="persionPop"
                                    v-model="form.selectNameData"
                                    @select-confirm="selectUserConfirm"></ice-persion-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8"
                  v-if="false">
            <el-form-item label="收样日期"
                          prop="datetime">
              <el-date-picker v-model="form.datetime"
                              type="datetime"
                              placeholder="选择日期时间"
                              align="right"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24"
                v-if="false">
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input type="textarea"
                        v-model="form.desc"
                        :autosize="{ minRows: 6, maxRows: 6 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-form>
    </div>
    <div class="BottomBox">
      <div class="titleName">样品清单</div>
      <div class="button">
        <el-button type="primary"
                   @click="sampleRecycle"
                   v-if="true">样品领样</el-button>
        <el-button type="primary"
                   @click="addSample"
                   v-show="false">添加样品</el-button>
        <el-button type="success"
                   @click="save">提交</el-button>
        <!--  <span style="margin-left:10px">样品种类 <i style="color:red">3</i> 类</span> -->
      </div>
      <el-table :data="tableData"
                style="width: 100%"
                stripe
                :border='true'>
        <el-table-column label="序号"
                         width="60"
                         type="index"></el-table-column>
        <el-table-column label="样品条码"
                         width="160"
                         align="center"
                         prop="barCode">
        </el-table-column>
        <el-table-column label="样品名称"
                         align="center"
                         prop="sampleName"></el-table-column>
        <el-table-column label="样品编号"
                         width="160"
                         align="center"
                         prop="sampleNumber">
        </el-table-column>
        <el-table-column label="规格型号"
                         align="center"
                         prop="sampleAttributes"
                         :formatter="sampleAttributesFormatter"></el-table-column>
        <el-table-column label="是否炸药"
                         align="center"
                         prop="isDynamite"
                         :formatter="isDynamiteFormatter"></el-table-column>
        <el-table-column label="计量单位"
                         align="center"
                         prop="dictionaryCategory"
                         :formatter="dictionaryCategoryFormatter"></el-table-column>
        <el-table-column label="领养用途"
                         align="center"
                         prop="optionsValue">
          <template slot-scope="scope">
            <el-select v-model="scope.row.use"
                       placeholder="请选择"
                       clearable
                       @change="selectChangeUse">
              <el-option v-for="item in OptionsUse"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="当前数量"
                         align="center"
                         prop="warehousingNum"></el-table-column>
        <el-table-column label="领样数量"
                         align="center"
                         prop="sampleNum">
        </el-table-column>
        <el-table-column label="仓库"
                         align="center"
                         prop="receiveSamplesWarehouseName">
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         prop="cz">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 收样弹窗 -->
    <ice-dialog v-dialogDrag
                title="实验预约样品清单"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeDialog"
                append-to-body
                width="1600px">
      <div class="titleName">实验预约样品清单</div>
      <ice-query-grid title="实验预约样品清单"
                      data-url="tdm/sample/getSampleLists"
                      :pagination="true"
                      :columns="columns"
                      ref="SampleRecycleRef"
                      chooseItem="multiple"
                      :query="query"
                      @selection-change="SelectionSampleList"
                      :selectedCodes="selectedCodesDetectItem"
                      codeProp="id"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="dialogSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 添加弹窗 -->
    <ice-dialog v-dialogDrag
                title="添加样品"
                center
                :visible.sync="AddDialog"
                :close-on-click-modal="false"
                :before-close="closeAddDialog"
                append-to-body
                width="800px">
      <div class="titleName">添加样品</div>
      <el-form ref="Addform"
               :model="Addform"
               label-width="110px"
               :rules="Addrules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="采集样品条码"
                          prop="name">
              <el-input v-model="Addform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品名称"
                          prop="name">
              <el-input v-model="Addform.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 入库信息标题 -->
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="titleName">入库信息</div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="入库数量"
                          prop="name">
              <el-input v-model="Addform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位"
                          prop="name">
              <el-select v-model="Addform.name"
                         clearable
                         placeholder="请选择">
                <el-option v-for="item in unitOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="规格型号"
                          prop="name">
              <el-input v-model="Addform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存条件"
                          prop="name">
              <el-input v-model="Addform.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否炸药"
                          prop="name">
              <el-radio v-model="Addform.radio"
                        label='0'>是</el-radio>
              <el-radio v-model="Addform.radio"
                        label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea"
                        v-model="Addform.desc"
                        :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="AddDialogSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeAddDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择送样人弹窗 -->
    <ice-dialog v-dialogDrag
                title="选择送样人"
                :visible.sync="selectCodeDialog"
                :close-on-click-modal="false"
                :before-close="closeSelectCodeDialog"
                append-to-body
                width="800px"
                ref="selectCodedialogRef">
      <div class="titleName">选择送样人</div>
      <ice-query-grid title="选择送样人"
                      data-url="permission/user/users_by_condition"
                      :pagination="true"
                      :columns="selectCodeColumns"
                      ref="selectCodeRef"
                      :gridIndex="false"
                      chooseItem="single"
                      :query="selectCodeQuery"
                      @selection-change="handleSelectionChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="SelectCodeSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeSelectCodeDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
export default {
  name: 'SampleRegister',
  components: { IceQueryGrid, IceDialog, IcePersionSelector },
  data () {
    return {
      /* 可编辑表格数据 */
      tableData: [],
      /* 页头表单 */
      form: {
        SingleBumber: '',
        selectCodeData: '',
        selectNameData: '',
      },
      /* 验证 */
      rules: {
        SingleBumber: [
          { required: true, message: "请输入样品编号 或者 预约编号", trigger: 'change' },
        ],
        selectNameData: [
          { required: true, message: "请选择领样人", trigger: 'change' },
        ],
      },
      /* 收样弹窗 */
      dialogVisible: false,
      query: [
        { type: "input", label: "样品名称", code: "searchTerm", value: "" },
        // {
        //   type: "static", label: "", code: "singleNumber", value: () => {
        //     return this.form.SingleBumber
        //   }
        // },
        { type: "static", label: "", code: "type", value: 1 },
        { type: "static", label: "", code: "paginaTion", value: 0 }
      ],

      columns: [
        { code: "id", hidden: true },
        {
          label: "预约单号",
          code: "reservationNumber",

          align: "center",
        },
        {
          label: "预约单位",
          code: "entrustUnit",

          align: "center",
        },
        {
          label: "预约人",
          code: "reservationPeopleName",

          align: "center",
        },
        {
          label: "预约时间",
          code: "reservationTime",

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
          label: "数量",
          code: "sampleNum",

          align: "center",
        },
        {
          label: "完成时间",
          code: "sendSampleTime",

          align: "center",
        },
        {
          label: "计量单位",
          code: "unit",

          align: "center",
          renderCell (h, row) {
            return row.row.dictionaryCategory == null ? "" : row.row.dictionaryCategory.name
          }
        },
        {
          label: "规格型号",
          code: "sampleAttributes",

          align: "center",
          renderCell (h, data) {
            let value = "";
            if (data.row) {
              data.row.sampleAttributes.forEach(e => {
                value += e.name + ';'
              });
            }
            return value;
          }
        },
        {
          label: "是否炸药",
          code: "isDynamite",

          align: "center",
          formatter (row) {
            if (row.isDynamite == 0) {
              return "否"
            } else {
              return "是"
            }
          }
        },
      ],
      /* 添加弹窗 */
      AddDialog: false,
      /* 添加样品表单 */
      Addform: {
        id: '',
        barCode: '',
        number: '',
      },
      /* 添加-单位下拉 */
      unitOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        },
      ],
      /* 添加表单验证 */
      Addrules: {
        name: [
          { required: true, message: "请输入", trigger: 'blur' },
        ],
      },
      /* 实验室下拉选择数据 */
      laboratoryOptions: [],
      /* 选择日期带快捷键 */
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      /* 送样人 */
      selectCodeDialog: false,
      selectCodeColumns: [
        { code: "oid", hidden: true },
        {
          label: "部门",
          code: "deptShortName",
          width: 141,
          align: "center",
        },
        {
          label: "选择人员",
          code: "name",
          width: 141,
          align: "center",
        },
      ],
      selectCodeQuery: [
        { type: "input", label: "名称", code: "name", value: "" },
        { type: "static", label: "", code: "deptId", value: 1 },
        { type: "static", label: "", code: "cascade", value: true },
      ],
      /* 送样人选中Data */
      rowValue: {},
      /* 预约单号下拉 */
      //   SingleBumberOptions: [],
      /* 收样选中数据 */
      rowData: {},
      /* 保存传递参数 */
      paramsData: {
        receiveSamplesPeople: '',
        receiveSamplesPeoplePhone: '',
        receiveSamplesTime: '',
        remarks: '',
        vo: [],
      },
      /* 用途下拉 */
      OptionsUse: [
        {
          id: 1,
          name: '实验'
        },
        {
          id: 2,
          name: '处理'
        },
      ]
    }
  },
  methods: {
    deleteRow(row){
      this.tableData = this.tableData.filter(item=>{
        if(item.id === row.id){
          return false;
        }
        return  true;
      })
    },

    //根据类型获取颜色
    getColor (index) {
      let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
      let obj = {
        color: '#fff',
        background: color[index],
        fontSize: '10px',
        padding: '2px 5px',
        borderRadius: '2px'
      }
      return obj;
    },
    /* 样品收样 */
    sampleRecycle () {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.SampleRecycleRef.refresh()
      })
    },
    /* 收样选中数据 */
    SelectionSampleList (row) {
      /*  console.log("SelectionSampleList", row); */
      this.rowData = row;
    },
    /* 收样保存 */
    dialogSave () {
      this.$nextTick(() => {
        let rowData = JSON.parse(JSON.stringify(this.rowData));
        if(rowData!=null && rowData.length>0){
          let array = rowData.filter(item=>{
            let lean = true;
            for (let i = 0; i < this.tableData.length; i++) {
              let data = this.tableData[i];
              if(data.id === item.id){
                lean =  false;
              }
            }
            return lean;
          })
          this.tableData = this.tableData.concat(array)
          this.laboratoryOptions.forEach(item => {
            this.tableData.forEach(items => {
              if (items.isDynamite == 1) {
                items.receiveSamplesWarehouse = item.oid
              } else {
                items.receiveSamplesWarehouse = ""
              }
            })
          })
        }
        this.dialogVisible = false
      })
    },
    /* 规格型号过滤 */
    sampleAttributesFormatter (row, column) {
      let value = "";
      if (row) {
        row.sampleAttributes.forEach(e => {
          value += e.name + ';'
        });
      }
      return value;
    },
    /* 是否炸药过滤 */
    isDynamiteFormatter (row) {
      if (row.isDynamite == 0) {
        return "否"
      } else {
        return "是"
      }
    },
    /* 计量单位过滤 */
    dictionaryCategoryFormatter (row) {
      return row.dictionaryCategory == null ? "" : row.dictionaryCategory.name
    },
    fatter (row) {
      if (row.dictionaryCategory) {
        return row.name + '(' + row.dictionaryCategory.name + ')';
      }
    },
    /* 关闭收样弹窗 */
    closeDialog () {
      this.dialogVisible = false
    },
    /* 添加样品 */
    addSample () {
      this.AddDialog = true
    },
    /* 下拉选中用途 */
    selectChangeUse (row) {
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
      this.$forceUpdate();
    },
    /* 保存 */
    save () {
      // if(!this.form.SingleBumber){
      //   this.$message.warning("请输入样品编号 或 预约编号")
      //   return;
      // }
      if(!this.form.selectNameData){
        this.$message.warning("请选择送样人")
        return;
      }
      this.paramsData.receiveSamplesPeople = this.form.selectCodeData;
      this.paramsData.receiveSamplesPeoplePhone = this.form.phone;
      this.paramsData.receiveSamplesTime = this.form.datetime;
      this.paramsData.remarks = this.form.desc;
      this.paramsData.vo = this.tableData;
      this.$axios.post('tdm/sample/sampleRegistration', this.paramsData).then((res) => {
        this.$message.success('保存成功')
        this.tableData = [];
        this.form = {};
        this.$router.push('SampleRecycle');

      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 关闭添加弹窗 */
    closeAddDialog () {
      this.AddDialog = false
    },
    /* 添加保存 */
    AddDialogSave () {
      this.$refs.Addform.validate(vali => {
      })
    },
    /* 实验室选中 */
    selectData (row) {
      this.laboratoryOptions.forEach((e) => {
        if (e.oid == row) {
          console.log("e", e);
          this.form.principalName = e.principalName;
          this.form.departmentName = e.departmentName;
          this.form.oid = e.oid;
          this.form.WarehouseUnit = e.dictionaryCategory.name;
          this.form.theRemainingAmount = (e.maximumCapacity - e.nowCapacity);
        }
      })

    },
    /* 送样人 */
    selectCode () {
      this.selectCodeDialog = true;
    },
    closeSelectCodeDialog () {
      this.selectCodeDialog = false;
    },
    /* 预约单号选中 */
    // selectChange (row) {
    //   console.log(row);
    // },
    /* 送样人选中 */
    handleSelectionChange (row) {
      /*  console.log(row[0]); */
      this.rowValue = row[0]
    },
    /* 送样人保存 */
    SelectCodeSave () {
      /*  console.log(this.rowValue); */
      this.form.selectNameData = this.rowValue.name;
      this.form.selectCodeData = this.rowValue.code;
      setTimeout(() => {
        this.selectCodeDialog = false;
      }, 200);
    },
    /* 预约单号 */
    selectSingleBumber () {
      this.$axios.get('tdm/sample/selectSampleRegistrations', {
        params: {
          number: this.form.SingleBumber,
        }
      }).then(res => {
        if(res.data!=null && res.data.length>0){
          let array = res.data.filter(item=>{
            let lean = true;
            for (let i = 0; i < this.tableData.length; i++) {
              let data = this.tableData[i];
              if(data.id === item.id){
                lean =  false;
              }
            }
            return lean;
          })
          this.tableData = this.tableData.concat(array)
          this.laboratoryOptions.forEach(item => {
            this.tableData.forEach(items => {
              if (items.isDynamite == 1) {
                items.receiveSamplesWarehouse = item.oid
              } else {
                items.receiveSamplesWarehouse = ""
              }
            })
          })
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    selectUserConfirm (row) {
      console.log(row[0]);
      this.form.selectNameData = row[0].name;
      this.form.selectCodeData = row[0].code;
    }
  },
  mounted () {
    /* 收样实验室 */
    this.$axios.get('tdm/warehouse/listInfo').then((res) => {
      this.laboratoryOptions = res.data;
      console.log(this.laboratoryOptions, "this.laboratoryOptions");
    }).catch((err) => {
      console.log(err);
    })
    /* 预约单号 */
    // this.$axios.get('tdm/sample/filterAcceptanceNumber?type=2').then((res) => {
    //   this.SingleBumberOptions = res.data
    //    console.log(this.SingleBumberOptions);
    // }).catch((err) => {
    //   console.log(err);
    // })
  },
  computed: {
    selectedCodesDetectItem () {
      return this.tableData.map((data) => {
        return data.id
      });
    },
  }
}
</script>
<style lang="less" scoped>
.containerBox {
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  min-width: 1420px;
  .TopBox {
    margin-bottom: 10px;
    p {
      color: red;
      font-size: 14px;
      margin-bottom: 20px;
      margin-left: 25px;
      background-color: rgba(230, 247, 255, 0.5);
      padding: 5px;
    }
  }
}
.titleName {
  position: relative;
  padding: 0 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 25px;
    background-color: #0091b0;
    position: absolute;
    top: 0px;
    left: 8px;
  }
}
.button {
  margin-bottom: 10px;
  span {
    margin-left: 20px;
    font-size: 18px;
    font-weight: 700;
  }
}
.containerBox /deep/ .cell {
  text-align: center;
}
/deep/.el-table__header .has-gutter tr th .cell {
  border-right: 1px solid #ccc;
}
/deep/.el-table__header .has-gutter tr th {
  &:nth-last-child(2) {
    .cell {
      border-right: none;
    }
  }
}
</style>
<template>
  <div class="container">
    <!-- 按钮 -->
    <vxe-toolbar style="margin-bottom:10px">
      <template v-slot:buttons>
        <el-button type="primary"
                   icon="el-icon-refresh"
                   @click="reshTable"
                   size="mini">刷新</el-button>
        <!--        <el-button type="primary"-->
        <!--                   icon="el-icon-upload2">导入</el-button>-->
        <!--        <el-button type="primary"-->
        <!--                   icon="el-icon-download">导出</el-button>-->
      </template>
      <template v-slot:tools>
        <el-input placeholder="预约名称"
                  v-model="query"
                  class="input-with-select"
                  style="width:350px"
                  @keyup.enter.native="search">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="search"></el-button>
        </el-input>
      </template>

    </vxe-toolbar>
    <!-- 表格展示 -->
    <vxe-table :data="tableData"
               ref="xTable"
               border
               align="center"
               max-height="700"
               :expand-config="{lazy: true, loadMethod: loadContentMethod}"
               v-loading="loading"
               show-overflow
               resizable>
      <!-- 序号 -->
      <vxe-table-column type="seq"
                        width="60"
                        title="序号"></vxe-table-column>
      <!-- 展开行按钮和展开表格 -->
      <vxe-table-column type="expand"
                        width="60">
        <template v-slot:content="{ row }">
          <template>
            <vxe-table border
                       :data="row.Child"
                       align="center"
                       highlight-current-row
                       show-overflow
                       resizable>
              <vxe-table-column type="seq"
                                width="60"
                                title="序号"></vxe-table-column>
              <vxe-table-column field="sampleNumber"
                                title="样品编号"></vxe-table-column>
              <vxe-table-column field="sampleName"
                                title="样品名称"></vxe-table-column>
              <vxe-table-column field="sampleAttributeVar"
                                title="规格型号"></vxe-table-column>
              <vxe-table-column field="sampleNum"
                                title="数量"></vxe-table-column>
              <vxe-table-column field="unit"
                                title="计量单位"
                                :formatter="filterUnit"></vxe-table-column>
              <vxe-table-column field="projectName"
                                title="检验项目"></vxe-table-column>
              <vxe-table-column field="remarks"
                                title="备注"></vxe-table-column>
              <vxe-table-column field="status"
                                title="状态"
                                :formatter="statusSet"></vxe-table-column>
              <!--              <vxe-table-column title="实验数据"-->
              <!--                                width="221"-->
              <!--                                fixed="right">-->
              <!--                <template v-slot="{ row }">-->
              <!--                  -->
              <!--                </template>-->
              <!--              </vxe-table-column>-->
              <vxe-table-column title="操作"
                                width="350"
                                fixed="right">
                <template v-slot="{ row }">
                  <el-button type="text"
                             v-if="row.status<2"
                             @click="showDetailEvent(row)">选择人员设备</el-button>
                  <el-button type="text"
                             v-if="row.status==4"
                             @click="showExperimentData(row)">查看实验数据</el-button>
                  <el-button type="text"
                             v-if="row.status==4"
                             @click="downloadMetadata(row)">下载实验元数据</el-button>
                </template>
              </vxe-table-column>
            </vxe-table>
          </template>
        </template>
      </vxe-table-column>
      <!-- 表头 -->
      <vxe-table-column v-for="(config, index) in tableColumn"
                        :key="index"
                        v-bind="config"></vxe-table-column>
      <!--      <vxe-table-column title="操作"-->
      <!--                        width="100"-->
      <!--                        fixed="right">-->
      <!--        <template v-slot="{ row }">-->
      <!--          <el-button type="text"-->
      <!--                     @click="changeStatus(row)"-->
      <!--                     v-if="row.status==0">受理</el-button>-->
      <!--          &lt;!&ndash; 不受理 &ndash;&gt;-->
      <!--          <el-button type="text"-->
      <!--                     @click="RefuseAccept(row)"-->
      <!--                     v-if="row.status==0">不受理</el-button>-->
      <!--        </template>-->
      <!--      </vxe-table-column>-->
    </vxe-table>
    <!-- 选择设备人员弹窗 -->
    <ice-dialog v-dialogDrag
                title="分配设备/人员"
                center
                :visible.sync="dialogVisible"
                :before-close="closeDialog"
                width="800px">
      <div class="titleName">分配设备/人员</div>
      <el-form ref="ruleForm"
               :model="ruleForm"
               label-width="120px"
               :rules="rules">
        <el-row :gutter="24"
                class="echoBox">
          <el-col :span="10"
                  class="echoText2">
            上次选择: <i style="color:red">{{echo_equipmentName==null?'':echo_equipmentName}}</i>
          </el-col>
          <el-col :span="10"
                  class="echoText1">
            上次选择: <i style="color:red">{{echo_peopleName==null?'':echo_peopleName}}</i>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <div class="DividingLine"></div>
        <el-row :gutter="24">

          <el-col :span="12">
            <el-form-item label="选择设备仪器"
                          prop="equipmentValue">
              <el-select v-model="ruleForm.equipmentValue"
                         placeholder="请选择"
                         clearable
                         @change='handerEquipmentID'>
                <el-option v-for="item in equipmentOptions"
                           :key="item.equipmentId"
                           :label="item.equipmentName"
                           :value="item.equipmentId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择实验人员"
                          prop="personnelValue">
              <el-select v-model="ruleForm.personnelValue"
                         placeholder="请选择"
                         clearable
                         @change='handerPersonneID'
                         :disabled="ruleForm.equipmentValue==[]?true:false">
                <el-option v-for="item in personnelOptions"
                           :key="item.peopleId"
                           :label="item.name"
                           :value="item.peopleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <p class="p-text"><span style="color:blue">【{{equipmentNames}}】</span> 目前有 <span style="color:blue">【{{equipmentTask}}】</span> 个实验检测待执行(选择后，显示设备的负荷情况)</p>
            <!--            <p class="p-ryqk">设备负荷情况表</p>-->
          </el-col>
          <el-col :span="12">
            <p class="p-text"><span style="color:blue">【{{peopleNames}}】</span> 目前有 <span style="color:blue">【{{peopleTask}}】</span> 个实验检测待执行(选择后，显示人员的负荷情况)</p>
            <!--            <p class="p-ryqk">人员负荷情况表</p>-->
          </el-col>
        </el-row>
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
    <!-- 实验数据弹窗 -->
    <ice-dialog v-dialogDrag
                title="实验数据"
                center
                :visible.sync="ExperimentDataVisible"
                :before-close="closeExperimentDataVisible"
                width="1000px">
      <div class="titleName">实验数据</div>
      <ice-query-grid title="实验数据"
                      data-url="/tdm/experimentAppointment/viewExperimentalData"
                      :pagination="false"
                      :columns="ExperimentDataColumns"
                      ref="ExperimentDataRef"
                      chooseItem="single"
                      :gridIndex="true"
                      :operations='operations'
                      :query='viewExperimentalDataQuery'
                      @selection-change="ExperimentItemChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeExperimentDataVisible">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script> 
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "experimentalReport",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      /* 表格数据 */
      tableData: [],
      /* 更新表格数据 */
      UpdateTableData: [],
      /* 展开行数据 */
      tableDataChild: [],
      /* 表格头 */
      tableColumn: [
        { field: "reservationNumber", title: "预约编号" },
        { field: "createTime", title: "预约日期" },
        { field: "name", title: "实验名称" },
        {
          field: "reservationType", title: "预约方式", formatter (row) {
            if (row.row.reservationType == 1) {
              return '自主预约'
            } else if (row.row.reservationType == 2) {
              return '委托预约'
            } else {
              return '生产预约'
            }
          }
        },
        { field: "entrustUnit", title: "委托单位" },
        { field: "people", title: "预约人" },
        { field: "phone", title: "联系方式" },
        { field: "sendSampleTime", title: "完成时间" },
        { field: "remarks", title: "备注说明" },
        {
          field: "status", title: "状态", formatter (row) {
            if (row.row.status == 0) {
              return '未受理'
            } else if (row.row.status == 1) {
              return '已受理'
            } else {
              return '不受理'
            }
          }
        },
      ],
      dialogVisible: false, /* 实验受理弹窗 */
      ExperimentDataVisible: false,//实验数据
      /* 表单 */
      ruleForm: {
        equipmentValue: '',
        personnelValue: '',
      },
      /* 人员 */
      personnelOptions: [
      ],
      /* 设备 */
      equipmentOptions: [
      ],
      /* 表单验证 */
      rules: {
        /*   value1: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ], */
        equipmentValue: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        personnelValue: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        /*  date: [
           { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
         ], */
      },
      /* 实验数据 */
      ExperimentDataColumns: [
        { code: "oid", hidden: true },
        {
          label: "文件名",
          code: "fileName",
          width: 120,
          align: "center",
        },
        {
          label: "文件格式",
          code: "fileFormat",
          width: 120,
          align: "center",
        },
        {
          label: "文件大小",
          code: "fileSize",
          width: 120,
          align: "center",
        },
        {
          label: "上传日期",
          code: "createDate",
          width: 120,
          align: "center",
        },
        {
          label: "密级",
          code: "dataSecretLevcode",
          width: 120,
          align: "center",
          formatter (row) {
            if (row.dataSecretLevcode == 1) {
              return '公开'
            } else if (row.dataSecretLevcode == 2) {
              return '内部'
            } else if (row.dataSecretLevcode == 3) {
              return '秘密'
            } else {
              return '机密'
            }
          }
        },
      ],
      /* 实验数据操作 */
      operations: [
        {
          name: "下载",
          callback: this.download
        },
        /*   {
            name: "查看"
          }, */
      ],
      /* 默认第一页 */
      currentPage: 1,
      /* 总共条数 */
      pageTotal: 0,
      /* 选中当前页 */
      pagecurrent: 1,
      /* 每页条数 */
      pageSize: 10,
      /* 搜索 */
      query: '',
      /* loading */
      loading: true,
      /* 查看实验数据ID*/
      viewExperimentalData: '',
      viewExperimentalDataQuery: [
        {
          type: 'static', code: 'operationId', value: () => {
            return this.viewExperimentalData
          }
        },
      ],
      /* 选择设备ID */
      proOid: '',
      /* 回显 */
      echo_peopleName: '',
      echo_equipmentName: '',
      /* 人员设备回显 */
      peopleNames: '',
      peopleTask: '',
      equipmentNames: '',
      equipmentTask: '',


      /*当前用户权限集合*/
      userRoles: [],
    };
  },
  methods: {
    /*下载实验元数据*/
    downloadMetadata (row) {
      this.$axios.get('/tdm/base/downloadMetadata', {
        params: {
          id: row.id,
          type: 2
        }
      }).then(res => {
        console.log("downloadMetadata", res);
      }).catch(err => {
        console.log("downloadMetadata", err);
      })
    },

    /* 子级表格懒加载 */
    loadContentMethod ({ row }) {
      if (row.status == 0) {
        this.$message.warning('该预约暂未受理')
        return new Promise(resolve => {
          resolve();
        });
      }
      return new Promise(resolve => {
        this.$axios.get('/tdm/experimentAppointment/operationList', {
          params: {
            appointmentId: row.id
          }
        }).then(res => {
          row.Child = res.data.records;
          resolve();
        }).catch(err => {
          console.log(err);
        })
      });
    },
    /* 关闭人员设备 */
    closeDialog () {
      this.dialogVisible = false
    },
    /* 保存 */
    save () {
      this.$refs.ruleForm.validate(vali => {
        if (vali) {
          this.$axios.post('tdm/experimentAppointment/selectEquPer', {
            id: this.ruleForm.id,
            equipmentId: this.ruleForm.equipmentValue,
            peopleId: this.ruleForm.personnelValue
          }).then(res => {
            this.$message.success('保存成功')
            this.dialogVisible = false;
          }).catch(err => {
            this.$message.error(err.msg);
          })
        }
      })
    },
    /* 预约受理下拉选中 */
    /* SelectedValue (data) {
      console.log(data);
    }, */
    /* 查看实验数据弹窗 */
    showExperimentData (row) {
      this.viewExperimentalData = row.id
      this.ExperimentDataVisible = true
    },
    /* 关闭实验数据弹窗 */
    closeExperimentDataVisible () {
      this.ExperimentDataVisible = false
    },
    /* 实验数据选中 */
    ExperimentItemChange (row) { },
    /* 刷新 */
    reshTable () {
      this.loading = true
      setTimeout(() => {
        this.gettableData()
      }, 200)
    },
    /* 获取表格数据 */
    gettableData () {
      this.$axios.get('/tdm/experimentAppointment/list', {
        params: {
          size: this.pageSize,
          current: this.pagecurrent,
          searchTerm: this.query
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records;
        /*   console.log(this.tableData, '======'); */
        this.pageTotal = res.data.total
      }).catch(err => {
        console.log(err);
      })
    },
    /* 选中条数 */
    handleSizeChange (val) {
      this.pageSize = val
      this.$axios.get('tdm/experimentAppointment/list', {
        params: {
          searchTerm: this.query,
          size: this.pageSize,
          current: this.pagecurrent,
        }
      }).then(res => {
        this.pageTotal = res.data.total
        this.reshTable()
      }).catch(err => {
        this.$message.error('请求超时!')
      })
    },
    /* 选中当前页 */
    handleCurrentChange (val) {
      this.pagecurrent = val
      this.$axios.get('tdm/experimentAppointment/list', {
        params: {
          searchTerm: this.query,
          size: this.pageSize,
          current: this.pagecurrent,
        }
      }).then(res => {
        this.pageTotal = res.data.total
        this.reshTable()
      }).catch(err => {
        this.$message.error('请求超时!')
      })
    },
    /*过滤型号 */
    sampleAttributeStrData (row) {
      let str = ""
      let rows = row.row.sampleAttributes
      rows.forEach(item => {
        str += item.name + ';'
      });
      return str
    },
    /* 搜索 */
    search () {
      console.log("keyup");
      this.$axios.get('/tdm/experimentAppointment/list', {
        params: {
          size: this.pageSize,
          current: 1,
          searchTerm: this.query
        }
      }).then(res => {
        this.tableData = res.data.records;
        /*  console.log(this.tableData); */
        this.pageTotal = res.data.total
      }).catch(err => {
        console.log(err);
      })
    },
    /* 更改状态 */
    changeStatus (row) {
      this.$axios.post('/tdm/experimentAppointment/accept', {
        appointmentId: row.id,
        status: 1,
      }).then(res => {
        this.gettableData()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 不受理 */
    RefuseAccept (row) {

      this.$axios.post('/tdm/experimentAppointment/accept', {
        appointmentId: row.id,
        status: 2,
      }).then(res => {
        this.gettableData()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 人员设备弹窗 */
    showDetailEvent (row) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.equipmentOptions = [];
      this.peopleNames = '';
      this.peopleTask = '';
      this.equipmentNames = '';
      this.equipmentTask = ''
      if (row.appStatus == 1) {
        // if (row.reservationType == 1) {
        //   this.$message.warning('该实验项是自主预约!')
        // } else {
        // }

        if (row.teamId != null || row.teamId != '') {
          this.dialogVisible = true;
          this.ruleForm.id = row.id
          this.ruleForm.equipmentValue = '';
          this.ruleForm.personnelValue = '';
          this.teamID = row.teamId;
          this.echo_peopleName = row.peopleName
          this.echo_equipmentName = row.equipmentName
          /* 获取设备下拉数据 */
          this.$axios.get('tdm/TdmDetectProjectEquipment/getProEquipments', {
            params: {
              proOid: row.projectId,
              teamId: this.teamID
            }
          }).then(res => {
            this.equipmentOptions = res.data
          }).catch(err => {
            this.$message.error(err.msg)
            this.equipmentOptions = []
          });
        } else {
          this.$message.warning('该实验项暂未下达班组')
        }
      } else {
        this.$message.warning('该预约暂未受理')
      }

    },
    /* 选中人员ID */
    handerPersonneID (row) {
      this.personnelOptions.forEach(e => {
        if (e.peopleId == row) {
          this.peopleNames = e.name
          this.peopleTask = e.task
          return
        }
      });
    },
    /* 选中设备ID */
    handerEquipmentID (row) {
      this.equipmentOptions.forEach(e => {
        if (e.equipmentId == row) {
          this.equipmentNames = e.equipmentName
          this.equipmentTask = e.equipmenTask
          return
        }
      });
      /* 获取人员下拉数据 */
      this.$axios.get('/tdm/team/getPeoples', {
        params: {
          teamId: this.teamID,
          equipmentId: row
        }
      }).then(res => {
        this.personnelOptions = res.data;
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 过滤单位 */
    filterUnit (row) {
      return row.row.dictionaryCategory == null ? '' : row.row.dictionaryCategory.name
    },
    /* 下载 */
    download (row) {
      this.$downloadFile(row.fileId)
    },
    /* 状态 */
    statusSet (row) {
      if (row.row.status == 0) {
        return '未开工'
      } else if (row.row.status == 1) {
        return '待开工'
      } else if (row.row.status == 2) {
        return '已开工'
      } else if (row.row.status == 3) {
        return '已完成(未上传数据)'
      } else {
        return '已上传数据'
      }
    },

    /**
     * 获取当前用户权限
     */
    getUserRole () {
      this.$axios.get("permission/user/get_valid_roles", { params: { userCode: this.$userInfo.userCode } })
        .then(result => {
          console.log(result, 'result')
          this.userRoles = result.data;
        })
        .catch(error => {

        })
    },
  },
  mounted () {
    this.gettableData();
    this.reshTable();
    this.getUserRole();
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.pagination {
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0px;
  padding: 0 30px;
  z-index: 10;
  box-sizing: border-box;
}
.keyword-lighten {
  color: #000;
  background-color: #ffff00;
}
.vxe-toolbar {
  padding: 0 10px;
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
.p-text {
  font-size: 12px;
  color: #000;
  text-align: center;
  height: 20px;
  padding-left: 12px;
}
.p-ryqk {
  color: #3399ff;
  font-size: 12px;
  padding-left: 25px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.echoBox {
  box-sizing: border-box;
  font-size: 14px;
  margin-bottom: 2px;
}
.echoText1 {
  box-sizing: border-box;
  margin-left: 35px;
  padding: 0 !important;
}
.echoText2 {
  box-sizing: border-box;
  margin-left: 66px;
  padding: 0 !important;
}
.DividingLine {
  height: 1px;
  background-color: rgb(187, 182, 182);
  width: 100%;
  margin-bottom: 10px;
}
</style>

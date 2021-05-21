<template>
  <div class="container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary"
                   @click="showDetailEvent()"
                   icon="el-icon-plus">新增报告</el-button>
        <el-button type="primary"
                   icon="el-icon-refresh"
                   @click="reshTable">刷新</el-button>
      </template>
      <template v-slot:tools>
        <vxe-input v-model="query"
                   placeholder="搜索"></vxe-input>
        <el-button type="primary"
                   style="margin-left:10px">查询</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table :data="tableData"
               ref="xTable"
               border
               align="center"
               v-loading="loading"
               max-height="720"
               :expand-config="{lazy: true, loadMethod: loadContentMethod}"
               show-overflow
               resizable>
      <vxe-table-column type="seq"
                        width="60"
                        title="序号"></vxe-table-column>
      <!-- 展开页 -->
      <vxe-table-column type="expand"
                        width="60">
        <template v-slot:content="{ row }">
          <template>
            <vxe-table border
                       :data="row.childData"
                       align="center"
                       highlight-current-row
                       show-overflow
                       resizable>
              <vxe-table-column field="sampleNumber"
                                title="样品编号"></vxe-table-column>
              <vxe-table-column field="sampleName"
                                title="样品名称"></vxe-table-column>
              <vxe-table-column field="sampleAttributes"
                                title="属性"
                                :formatter="sampleAttributes"></vxe-table-column>
              <vxe-table-column field="sampleNum"
                                title="数量"></vxe-table-column>
              <vxe-table-column field="sampleUnit"
                                title="单位"
                                :formatter="filterUnit"></vxe-table-column>
              <vxe-table-column field="projectName"
                                title="检测项目"></vxe-table-column>
              <vxe-table-column field="isPassName"
                                title="是否合格"></vxe-table-column>
              <vxe-table-column field="isCz"
                                title="操作">
                <template v-slot="{ row }">
                  <el-button type="text"
                             @click="downloadMetadata(row)">下载元数据</el-button>
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
      <!-- 操作 -->
      <vxe-table-column fixed="right"
                        title="操作"
                        width="150">
        <template v-slot="{ row }">
<!--          && row.downloadNum == 0-->
          <el-button type="text" v-if="row.status == 8"
                     @click="downloadReport(row)">下载报告</el-button>
          <el-button type="text"
                     @click="queryProcess(row)">查看流程</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
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
import Vue from "vue";
export default {
  name: "experimentalReport",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: "",
      /* 表格和展开行数据 */
      tableData: [],
      /* 表格头 */
      tableColumn: [
        { field: "reportNumber", title: "实验报告编号" },
        { field: "reportName", title: "报告名称" },
        { field: "entrustUnit", title: "送样单位" },
        { field: "receiveSamplesPeopleName", title: "送样人" },
        {
          field: "experimentType", title: "预约类型", formatter: (({ cellValue, row, column }) => {

            return row.reservationType == 1 ? '自主' : row.reservationType == 2 ? '委托' : '生产'
          })
        },
        {
          field: "status", title: "状态", formatter: (({ cellValue, row, column }) => {
            /*   console.log(row.status); */
            if (row.status == 0) {
              return '暂存'
            } else if (row.status == 1) {
              return '未审核'
            } else if (row.status == 2) {
              return '审核中'
            } else if (row.status == 8) {
              return '已审核'
            } else if (row.status == 9) {
              return '未通过'
            } else {
              return ''
            }

          })
        },
      ],
      /* 默认第一页 */
      currentPage: 1,
      /* 总共条数 */
      pageTotal: 0,
      /* 选中当前页 */
      pagecurrent: 1,
      /* 每页条数 */
      pageSize: 10,
      /* loading */
      loading: true,
    };
  },
  methods: {
    downloadMetadata(row){
      window.location.href=Vue.prototype.$apicontext+"/tdm/base/downloadMetadata?id="+row.operationId+"&type=2";
    },
    queryProcess(row){
      this.$router.push({
        name: "/tdm/experimentalReportDetails",
        query: {dataId:row.approveId}
      })
    },

    /*下载报告*/
    downloadReport (row) {
      this.$axios.get('tdm/base/downloadReport', {
        params: {
          reportId: row.oid
        }
      }).then(res => {
        console.log("res", res);
        this.Refresh();
      }).catch(err => {
        console.log(err);
      })
    },

    /* 子级表格懒加载 */
    loadContentMethod ({ row }) {
      /*  console.log(row); */
      return new Promise(resolve => {
        this.$axios.get('tdm/TdmExperimentalReport/getResultReport', {
          params: {
            oid: row.oid
          }
        }).then(res => {
          row.childData = res.data
          resolve();
        }).catch(err => {
          console.log(err);
        })
      })
    },
    /* 提交审核 */
    showDetailEvent (row) {
      this.$router.push({
        name: "/tdm/experimentalReportDetails",
        /* params: row */
      })
    },
    /* 刷新 */
    Refresh () {
      this.gettableData()
    },
    /* 获取表格 */
    gettableData () {
      this.$axios.get('tdm/TdmExperimentalReport/list', {
        params: {
          size: this.pageSize,
          current: this.pagecurrent,
          searchTerm: this.query
        }
      }).then(res => {
        this.loading = false
        /* console.log(res.data); */
        this.tableData = res.data.records;
        this.pageTotal = res.data.total
      }).catch(err => {
        console.log(err);
        this.loading = false
        this.$message.error(err.msg)
      })
    },
    /* 选中条数 */
    handleSizeChange (val) {
      console.log(val);
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
      console.log(this.pagecurrent, '当前页');
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
    /* 刷新 */
    reshTable () {
      this.loading = true
      setTimeout(() => {
        this.gettableData()
      }, 200)
    },
    /* 过滤单位 */
    filterUnit (row) {
      return row.row.dictionaryCategory == null ? '' : row.row.dictionaryCategory.name
    },
    /* 详情 */
    DetailsData (row) { },
    /* 过滤属性 */
    sampleAttributes ({ cellValue, row, column }) {
      let string = '';
      row.sampleAttributes.forEach(item => {
        string += item.name + ';'
      });
      return string
    }
  },
  created () {
    this.gettableData()
  }
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
  background-color: #fff;
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
</style>

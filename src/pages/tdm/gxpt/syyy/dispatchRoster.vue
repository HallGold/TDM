<template>
  <div class="container">
    <div class="contentbox1">
      <div class="headers">
        <span style="margin-right:30px;font-size:16px">预约任务</span>
        <!-- <el-select clearable
                   v-model="value_1"
                   placeholder="请选择"
                   style="margin-right:30px"
                   @change="selectvalue">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select> -->
        <el-button type="primary" icon='el-icon-refresh' @click="refresh" size="mini">刷新</el-button>
      </div>
      <!-- 生产任务 -->
      <div class="mainbox">
        <ice-query-grid data-url="/tdm/experimentAppointment/schedulingList" ref="grid" highlight-current-row :pagination="true" :columns="columns" :gridIndex="true" chooseItem="single" :query="query" @selection-change='SelectSampleArr'>
        </ice-query-grid>
      </div>
    </div>
    <div class="contentbox2">
      <div class="headers">
        <h2>实验项明细</h2>
      </div>
      <!-- 实验项明细 -->
      <div class="ExperimentDetails">
        <ice-query-grid :data-url="sampleData" ref="SelectSampleRef" :pagination="false" :columns="SelectSampleData" :gridIndex="false" chooseItem="multiple" :query='SelectSampleQuery' @selection-change="handleSelectionChange">
        </ice-query-grid>
      </div>
      <!-- 下达班组 -->
      <div class="release">
        <h3 class="title">下达班组</h3>
        <div class="TeamTask">
          <!--  <ice-query-grid data-url="tdm/experimentAppointment/getTheTeam"
                          ref="TeamTaskRef"
                          :pagination="false"
                          :columns="TeamTaskData"
                          :gridIndex="false"
                          chooseItem="single"
                          :operationsWidth="160"
                          @selection-change="handleTheTeam">
          </ice-query-grid> -->
          <ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true" label-prop="deptName" value-prop="deptCode" :lazy="false" :query="TeamTaskquery" parent-prop="deptCode" data-url="/permission/frame_org/load_table_next_children?loadDisabled=true" :pagination="false" :gridIndex="false" :columns="TeamTaskData" chooseItem="single" ref="TeamTaskRef" @node-click="dataTree" @selection-change="handleTheTeam">
          </ice-tree-grid>
        </div>
        <div class="buttons">
          <el-button type="primary" @click="PerformTask">任务下达</el-button>
          <!--  <el-button type="primary"
                     @click="RepeatTask">重新下达</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceTreeGrid from "@/components/common/base/IceTreeGrid";
export default {
  name: "dispatchRoster",
  components: { IceQueryGrid, IceDialog, IceTreeGrid },
  data () {
    return {
      /* 生产任务query */
      query: [
        { type: 'static', code: 'type', value: 1 },
        {
          type: 'static', code: 'experimentType', value: 2
        },
      ],
      TeamTaskquery: [
        { type: 'static', code: "loadDisabled", exp: "=", value: true },
      ],
      /* 选择样品query */
      SelectSampleQuery: [
        {
          type: 'static', code: 'appointmentId', value: () => {
            return this.appointmentId
          }
        },
        {
          type: 'static', code: 'team', value: 1
        },
      ],
      /*  options: [
         {
           value: 2,
           label: "生产型实验",
         },
         {
           value: 1,
           label: "科研型实验",
         },
       ], */
      /*  value_1: "", */
      /* 任务调度表格数据 */
      columns: [
        { code: "oid", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",

          align: "center",
        },
        {
          label: "预约时间",
          code: "createTime",

          align: "center",
        },
        /*  {
           label: "实验名称",
           code: "name",
 
           align: "center",
         }, */
        {
          label: "实验类型",
          code: "reservationType",
          align: "center",
          renderCell: (h, data) => {
            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
            let obj = {
              color: '#fff',
              background: color[data.row.reservationType],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.row.reservationType == 1 ? '自主' : data.row.reservationType == 2 ? "委托" : "生产"}</span>
          }
        },
        {
          label: "委托单位",
          code: "entrustUnit",

          align: "center",
        },
        {
          label: "预约人",
          code: "people",

          align: "center",
        },
        {
          label: "完成日期",
          code: "sendSampleTime",

          align: "center",
        },
        {
          label: "联系电话",
          code: "phone",
          align: "center",
        },
        {
          label: "是否下发任务",
          code: "isTaskRelease",
          align: "center",
          renderCell: (h, data) => {
            let color = ['#F56C6C', '#67C23A']
            let obj = {
              color: '#fff',
              background: color[data.row.isTaskRelease],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.row.isTaskRelease == 1 ? '已全部下发' : '有未下发任务'}</span>
          }
        },
      ],
      /* 添加样品表格数据 */
      SelectSampleData: [
        { code: "id", hidden: true },
        {
          label: "下发班组",
          code: "isTaskRelease",
          align: "center",
          renderCell: (h, data) => {
            let color = ['#F56C6C', '#67C23A']
            let obj = {
              color: '#fff',
              background: color[data.row.isTaskRelease],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.row.isTaskRelease == 1 ? data.row.deptName : '未下发'}</span>
          }
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
          label: "数量",
          code: "sampleNum",

          align: "center",
        },
        {
          label: "单位",
          code: "unit",
          align: "center",
          renderCell (h, row) {
            /*    console.log(row.row); */
            return row.row.dictionaryCategory == null ? '' : row.row.dictionaryCategory.name
          }
        },
        {
          label: "检验项目",
          code: "projectName",

          align: "center",
        },
        {
          label: "备注",
          code: "remarks",

          align: "center",
        },
        // {
        //   label: "状态",
        //   code: "status",
        //
        //   align: "center",
        //   renderCell (h, data) {
        //     if (data.row.status == 0) {
        //       return '未开工'
        //     } else if (data.row.status == 1) {
        //       return '待开工'
        //     } else if (data.row.status == 2) {
        //       return '已开工'
        //     } else if (data.row.status == 3) {
        //       return '已完成(未上传数据)'
        //     } else {
        //       return '已上传数据'
        //     }
        //   }
        // },
      ],
      /* 下达班组表格数据 */
      TeamTaskData: [
        { code: "oid", hidden: true },
        { label: '部门名称', code: 'deptName', align: 'center' },
        { label: '录入的部门编码', code: 'inputDeptCode', align: 'center' },
        // { label: '机构类型', code: 'typeName' },
        // {
        //   label: '是否虚拟机构', code: 'viral', renderCell (h, data) {
        //     return (data.row.viral == 1 ? "是" : (data.row.viral == 0 ? "否" : ""))
        //   }
        // },
        // {
        //   label: '是否法人机构', code: 'corporation', renderCell (h, data) {
        //     return (data.row.corporation == 1 ? "是" : (data.row.corporation == 0 ? "否" : ""))
        //   }
        // },
        // /*{label: '单位OU', code: 'ou', width: 120},*/
        // { label: '部门编码', code: 'deptCode', hidden: true },
        // { label: '所属单位编码', code: 'orgCode', hidden: true },
        // {
        //   label: '启用状态', code: 'enabled', renderCell (h, data) {
        //     return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
        //   }
        // },
      ],
      /* 表格按钮回调 */
      /*  operations: [{ name: "添加实验项", callback: this.SelectSampleArr }], */
      /* 查询样品ID */
      appointmentId: '',
      /* 作业IDs */
      operationIds: [],
      /* 班组code */
      deptCode: '',
      sampleData: '',

    };
  },
  methods: {
    SelectSampleArr (row) {
      /* console.log(row[0]); */
      this.sampleData = 'tdm/experimentAppointment/operationList'
      this.appointmentId = row[0].id
      this.$nextTick(() => {
        this.$refs.SelectSampleRef.refresh()
      })
    },
    /* 任务下达 */
    PerformTask () {
      this.$axios.post('tdm/experimentAppointment/dispatchTeam', {
        operationIds: this.operationIds,
        deptCode: this.deptCode
      }).then(res => {
        console.log(res);
        this.$message.success('任务下达成功!')
        this.operationIds = [];
        this.$refs.grid.refresh();
        this.$refs.SelectSampleRef.refresh()
      }).catch(err => {
        this.$message.error(err.msg)
      })

    },
    /* 样品选中 */
    handleSelectionChange (row) {
      let ids = [];
      row.forEach(item => {
        ids.push(item.id)
      });
      this.operationIds = ids;
      console.log(this.operationIds);
    },
    /* 选中班组row */
    handleTheTeam (row) {
      console.log(row);
      this.deptCode = row[0].deptCode;
      /*  console.log(this.deptCode); */
    },
    /*下拉筛选 */
    /* selectvalue (row) {
      console.log(row);
      this.$refs.grid.refresh();
    }, */
    refresh () {
      this.$refs.grid.refresh();
    },
    /**获取左边树的点击事件的值*/
    dataTree (row, data) {
      /*  this.dataDeptLevcode = data.data.dataDeptLevcode;
       this.typeCodeItem = data.data.typeCode;
       this.deptId = data.data.oid;
       this.deptLevCode = data.data.deptLevCode;
       this.deptCode = data.data.deptCode;
       // this.r = row; */
    },
  },
  activated () {
    /*  console.log('aaa'); */
    this.refresh()
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  overflow: auto;
  .contentbox1 {
    flex: 1.3;
    margin-right: 10px;
    box-sizing: border-box;
    .headers {
      margin-bottom: 10px;
      height: 30px;
      span {
        position: relative;
        padding-left: 15px;
        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background-color: #4ba195;
          position: absolute;
          top: -1px;
          left: 0;
        }
      }
    }
    .mainbox {
      height: 720px;
    }
  }
  .contentbox2 {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: start;
    .headers {
      margin-bottom: 10px;
      height: 30px;
      h2 {
        font-size: 16px;
        position: relative;
        padding-left: 10px;
        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background-color: #4ba195;
          position: absolute;
          top: 2px;
          left: 0;
        }
      }
    }
    .ExperimentDetails {
      margin-bottom: 10px;
      height: 200px;
      .ice-container {
        min-height: 200px !important;
      }
    }
    .release {
      .title {
        position: relative;
        font-size: 16px;
        padding-left: 10px;
        margin-bottom: 10px;
        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background-color: #4ba195;
          position: absolute;
          top: 2px;
          left: 0;
        }
      }
      /*   .TeamTask {
         height: 200px;
        .ice-container {
          min-height: 200px !important;
        }
      } */
      .buttons {
        margin-top: 30px;
        padding-left: 30px;
      }
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

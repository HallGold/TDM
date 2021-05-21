<template>
  <el-container>
    <div class="leftMian">
      <el-header>
        <div class="fanhui">
          <el-button icon="el-icon-back" type="primary" circle @click="goback"></el-button>
        </div>
        <ice-grid-layout :columns="1" name="基本信息" :expandable="false">
          <!-- <h1>
            基本信息
            <span>{{detailsData.reservationNumber}}</span>
          </h1> -->
          <ul>
            <li>
              <div class="text">
                <span>预约编号:</span><span>{{detailsData.reservationNumber}}</span>
              </div>
              <div class="text">
                <span>实验类型:</span><span>{{detailsData.reservationType==1?'自主预约':detailsData.reservationType==2?'委托预约':'生产预约'}}</span>
              </div>
              <div class="text">
                <span>状态:</span><span>{{detailsData.status==1?'已受理':'未受理'}}</span>
              </div>
            </li>
            <li>
              <div class="text">
                <span>委托单位:</span><span>{{detailsData.entrustUnit}}</span>
              </div>
              <div class="text">
                <span>预约人:</span><span>{{detailsData.people}}</span>
              </div>
              <div class="text">
                <span>完成日期:</span><span>{{detailsData.sendSampleTime}}</span>
              </div>
            </li>
            <li>
              <div class="text">
                <span>预约时间:</span><span>{{detailsData.createTime}}</span>
              </div>
              <div class="text">
                <span>备注说明:</span><span>{{detailsData.remarks}}</span>
              </div>
              <div class="text">
                
              </div>
            </li>
          </ul>
        </ice-grid-layout>
      </el-header>
      <el-main>
        <ice-grid-layout :columns="1" name="样品信息" :expandable="false">
          <ice-query-grid title="样品信息" data-url="tdm/experimentAppointment/operationList" :pagination="false" :columns="columns" :gridIndex="false" ref="DetailsRef" chooseItem="single" :query="query" :operations="operations" @table-change="tablechange">
          </ice-query-grid>
        </ice-grid-layout>
      </el-main>
    </div>
    <transition name="el-zoom-in-center">
      <div class="rightMian" v-show="show" v-loading="loading">
        <el-row style="height:100%">
          <el-row style="text-align: right">
            <el-button icon="el-icon-close" circle @click="closeProcess" size="mini" style="border:0"></el-button>
          </el-row>
          <el-row>
            <h3 style="text-align:center;margin-bottom:10px;font-size:16px;font-weight:bold">流程信息-<i>{{detailsData.reservationType==3?'生产预约':detailsData.reservationType==2?'委托预约':'自主预约'}}</i>(实验项目:<i>{{itemName}}</i>)</h3>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="5">
              <ul class="schedule-content">
                <li class="schedule" v-for="item in dataList" :key="item.oid">
                  <i :class="{schedulebgc:status>=item.nodeSeq}"></i>
                </li>
              </ul>
            </el-col>
            <el-col :span="20">
              <ul>
                <li class="textList" v-for="item in dataList" :key="item.oid">
                  <span style="margin-bottom:10px" :class="{textcolor:status>=item.nodeSeq}">{{item.nodeName}}</span>
                  <span :class="{textcolor:status>=item.nodeSeq}">操作人: <i>{{item.operationPeople}}</i></span>
                  <span :class="{textcolor:status>=item.nodeSeq}">电话:<i>{{item.phone}}</i></span>
                  <span :class="{textcolor:status>=item.nodeSeq}">操作时间:<i>{{item.createTime}}</i></span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-row>
      </div>
    </transition>
  </el-container>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import Vue from "vue";
export default {
  name: "reservationLedgerRefDetails",
  components: { IceQueryGrid, IceGridLayout },
  data () {
    return {
      query: [
        /*  { type: "input", label: "领用编号", code: "searchTerm", value: "" }, */
        {
          type: "static", label: "", code: "appointmentId", value: () => {
            /*  console.log(this.pid, '===='); */
            return this.pid;
          }
        },
      ],
      columns: [
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
          label: "计量单位",
          code: "unit",
          align: "center",
          renderCell (h, row) {
            return row.row.dictionaryCategory == null ? "" : row.row.dictionaryCategory.name
          }
        },
        {
          label: "检验项目",
          code: "projectName",
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          align: "center",
          formatter (row) {
            return row.isDynamite == 0 ? '否' : '是'
          }
        },
        {
          label: "备注",
          code: "remarks",
          align: "center",
        },
        {
          label: "状态",
          code: "status",
          align: "center",
          formatter (row) {
            if (row.status == 0) {
              return '未开工'
            } else if (row.status == 1) {
              return '待开工'
            } else if (row.status == 2) {
              return '已开工'
            } else if (row.status == 3) {
              return '已完成(未上传数据)'
            } else {
              return '已上传数据'
            }
          }
        },
      ],
      detailsData: {},
      /* 详情id */
      pid: '',
      show: false,
      loading: false,
      operations: [
        {
          name: "下载元数据", callback: (row) => {
            this.downloadMetadata(row)
          },
          isShow: function (row) {
            return row.status == 3
          }
        },
        {
          name: "查看进度", callback: (row) => {
            this.selectionChange(row)
          }
        },
      ],
      dataList: [],
      itemName: "",
    };

  },
  methods: {
    downloadMetadata (row) {
      window.location.href = Vue.prototype.$apicontext + "/tdm/base/downloadMetadata?id=" + row.id + "&type=2";
      // this.$axios.get('/tdm/base/downloadMetadata', {
      //   params: {
      //     id: row.id,
      //     type: 2
      //   }
      // }).then((res) => {
      //     console.log("res",res);
      // }).catch(err => {
      //   this.$message.error(err.msg)
      // })
    },

    goback () {
      this.$router.go(-1)
    },
    selectionChange (row) {
      /*  console.log(row); */
      this.loading = true;
      this.show = true;
      this.itemName = row.projectName
      this.$axios.get('tdm/experimentAppointment/jobNodeProgress', {
        params: {
          id: row.id
        }
      }).then((res) => {
        this.loading = false;
        /*   console.log(res.data); */
        this.status = res.data.maxNode
        this.dataList = res.data.nodes;
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    closeProcess () {
      this.show = false;
    },
    tablechange (row) {
      if (!row) return
      let param = row[0]
      this.selectionChange(param)
    }
  },
  computed: {
  },
  created () {
    /*  console.log(this.$route.query); */
    this.pid = this.$route.query.id;
    this.detailsData = this.$route.query;
  },
  mounted () {
    this.$nextTick(() => {
      this.tablechange()
    })
  },


};
</script>
<style lang="less" scoped>
.el-container {
  display: flex;
  .leftMian {
    flex: 4;
    background-color: #fff;
    padding: 0;
    margin-right: 10px;
    overflow: auto;
  }
  .rightMian {
    flex: 1;
    background-color: #fff;
    overflow: auto;
  }
}
.fanhui {
  text-align: right;
}
.el-header {
  box-sizing: border-box;
  height: auto !important;
  /* h1 {
    font-size: 24px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  } */
  ul {
    li {
      display: flex;
      margin-bottom: 20px;
      justify-content: start;
      .text {
        flex: 1;
        span {
          font-size: 15px;
        }
      }
    }
  }
}
.textList {
  text-align: left;
  color: rgb(175, 175, 175);
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-bottom: 20px;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
  span {
    font-weight: bold;
  }
}
.schedule {
  height: 102px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  i {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-top: 2px;
    z-index: 1;
    background-color: #adadad;
  }
}
.schedule-content {
  position: relative;
  &::before {
    content: '';
    display: block;
    height: 100%;
    width: 1px;
    border-right: 2px dashed rgb(175, 175, 175);
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.schedulebgc {
  background-color: #80c93d !important;
}
.textcolor {
  color: #2884a4;
}
</style>

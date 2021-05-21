<template>
  <el-container>
    <el-header v-loading="loading">
      <div class="fanhui">
        <el-button icon="el-icon-back"
                   type="primary"
                   circle
                   @click="goback"></el-button>
      </div>
      <h1>
        收样单号：<span>{{detailsData.receiptNum}}</span>
      </h1>
      <ul>
        <li>
          <div class="text">
            <span>收样实验室编号：</span><span>{{detailsData.warehouseNumber}}</span>
          </div>
          <div class="text">
            <span>所属部门：</span><span>{{detailsData.departmentName}}</span>
          </div>
          <div class="text">
            <span>入库情况:</span>
          </div>
        </li>
        <li>
          <div class="text">
            <span>送样人:</span><span>{{detailsData.receiveSamplesPeopleName}}</span>
          </div>
          <div class="text">
            <span>联系电话:</span><span>{{detailsData.receiveSamplesPeoplePhone}}</span>
          </div>
          <div class="text">
            <span style="font-size:18px;font-weight:700;">入库完成</span>
          </div>
        </li>
        <li>
          <div class="text">
            <span>负责人：</span><span>{{detailsData.principalName}}</span>
          </div>
          <div class="text">
            <span>收样日期：</span><span>{{detailsData.receiveSamplesTime}}</span>
          </div>
          <div class="text">
            <span>收样种数：</span><span>{{detailsData.count}}</span>
          </div>
        </li>
      </ul>
    </el-header>
    <el-main>
      <div class="titleName">收样清单</div>
      <ice-query-grid title="样品详情"
                      data-url="tdm/sample/inboundRecordInfo"
                      :pagination="true"
                      :columns="columns"
                      ref="RecycleDetailsRef"
                      chooseItem="single"
                      :query="query">
      </ice-query-grid>
    </el-main>
  </el-container>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
export default {
  name: "RecycleDetails",
  components: { IceQueryGrid },
  data () {
    return {
      query: [
        { type: "input", label: "收样编号", code: "searchTerm", value: "" },
        {
          type: "static", label: "", code: "singleOid", value: () => {
            return this.pid;
          }
        },
      ],
      columns: [
        { code: "samplesOrTakeSampleOid", hidden: true },
        {
          label: "收样编号",
          code: "receiptNum",
          width: 131,
          align: "center",
        },
        /*  {
           label: "实验室编号",
           code: "warehouseNumber",
           width: 131,
           align: "center",
         }, */
        {
          label: "收样日期",
          code: "receiveSamplesTime",
          width: 131,
          align: "center",
        },
        {
          label: "送样人",
          code: "receiveSamplesPeopleName",
          width: 131,
          align: "center",
        },
        {
          label: "样品条码",
          code: "barCode",
          width: 131,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 131,
          align: "center",
        },
        /* {
          label: "规格型号",
          code: "dsName",
          width: 131,
          align: "center",
        }, */
        {
          label: "收样数量",
          code: "warehousingNum",
          width: 131,
          align: "center",
        },
        {
          label: "计量单位",
          code: "unit",
          width: 131,
          align: "center",
          renderCell (h, data) {
            return data.row.dictionaryCategory.name
          }
        },
        {
          label: "预约单编号",
          code: "reservationNumber",
          width: 131,
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 131,
          align: "center",
          formatter (row) {
            if (row.isDynamite == 0) {
              return '否'
            } else {
              return '是'
            }
          }
        },
        {
          label: "状态",
          code: "status",
          width: 131,
          align: "center",
          formatter (row) {
            if (row.status == 1) {
              return '已收样'
            } else {
              return 'null'
            }
          }
        },
      ],
      detailsData: {},
      /* 详情id */
      pid: '',
      loading: true
    };

  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    getDetailsData () {
      this.$axios.get('tdm/sample/inboundRecordOne', {
        params: {
          singleOid: this.pid
        }
      }).then(res => {
        this.detailsData = res.data
        this.loading = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.loading = false
      })
    }
  },
  computed: {
  },
  created () {
    this.pid = this.$route.params.oid
    console.log(this.pid);
  },
  mounted () {
    this.getDetailsData()
  }
};
</script>
<style lang="less" scoped>
.el-header,
.el-main {
  background-color: #fff;
  padding: 0;
}
.fanhui {
  text-align: right;
}
.el-header {
  margin-bottom: 20px;
  box-sizing: border-box;
  height: auto !important;
  padding: 10px 40px;
  h1 {
    font-size: 24px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  }
  ul {
    li {
      display: flex;
      margin-bottom: 20px;
      justify-content: start;
      .text {
        flex: 1;
      }
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
</style>

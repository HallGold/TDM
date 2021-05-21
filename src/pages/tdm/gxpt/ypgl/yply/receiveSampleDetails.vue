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
        领用单号:<span>{{detailsData.receiptNum}}</span>
      </h1>
      <ul>
        <li>
          <div class="text">
            <span>领样人:</span><span>{{detailsData.receiveSamplesPeopleName}}</span>

          </div>
          <div class="text">

            <span>领用日期:</span><span>{{detailsData.receiveSamplesTime}}</span>
          </div>

          <div class="text">
            <span>入库情况:</span>
          </div>
        </li>
        <li>
          <div class="text">

            <span>涉及样品:</span><span>{{detailsData.count}}</span>
          </div>
          <div class="text">
            <!--  <span>领用部门:</span><span>{{detailsData.departmentName}}</span> -->

          </div>
          <div class="text">
            <span style="font-size:18px;font-weight:700;">已领用</span>
          </div>
        </li>
        <li>
          <div class="text">
            <!--   <span>负责人：</span><span>{{detailsData.principalName}}</span> -->
          </div>
          <div class="text">
            <!--   <span>领用地点:</span><span>{{detailsData.warehouseName}}</span> -->
          </div>
          <div class="text">
            <span></span>
          </div>
        </li>
      </ul>
    </el-header>
    <el-main>
      <div class="titleName">收样清单</div>
      <ice-query-grid title="样品详情"
                      data-url="tdm/sample/takeSampleInfo"
                      :pagination="true"
                      :columns="columns"
                      :gridIndex="false"
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
        { type: "input", label: "领用编号/样品名称", code: "searchTerm", value: "" },
        {
          type: "static", label: "", code: "singleOid", value: () => {
            /*  console.log(this.pid, '===='); */
            return this.pid;
          }
        },
      ],
      columns: [
        { code: "samplesOrTakeSampleOid", hidden: true },
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
          label: "规格型号",
          code: "sampleAttributeStr",
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
          label: "是否炸药",
          code: "isDynamite",
          align: "center",
          renderCell (h, row) {
            return row.row.isDynamite == 0 ? "否" : "是"
          }
        },
        /* {
          label: "规格型号",
          code: "dsName",
          align: "center",
        }, */
        {
          label: "领样用途",
          code: "use",
          align: "center",
          renderCell (h, row) {
            return row.row.use == 1 ? '实验' : '处理'
          }
        },
        {
          label: "入库数量",
          code: "originalWarehousingQuantity",
          align: "center",
        },
        {
          label: "领用数量",
          code: "warehousingNum",
          align: "center",
        },
        /* {
          label: "存放实验室",
          code: "receiveSamplesWarehouseName",
          
          align: "center",
        }, */
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
      this.$axios.get('tdm/sample/takeSampleOne', {
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

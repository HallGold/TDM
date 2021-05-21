<template>
  <div class="container-box">
    <header>
      <div class="header_content">
        <p class="text">
          目前已收录<span>{{ knowledgeTotal }}</span> 条知识，服务
          <span class="text">{{ totalQuery }}</span> 人次，今日搜索
          <span class="text">{{ todayQuery }}</span> 次
        </p>
        <div class="header_input">
          <el-input v-model="input"
                    placeholder="请输入内容">
            <i class="el-icon-search el-input__icon"
               style="cursor: pointer"></i>
          </el-input>
          <el-button type="primary"
                     @click="searchInFo()"
                     class="buttonStyle">知识检索</el-button>
        </div>
        <ul class="text">
          <li v-for="(term, index) in searchTerms"
              :key="index"
              @click="getvalue($event)"
              v-show="index <= 4">
            {{ term.searchTerm }}
          </li>
        </ul>
      </div>
    </header>
    <div class="icequerygrid">
      <el-collapse-transition>
        <div v-show="isSearch">
          <ice-query-grid ref="IceQueryGrid"
                          :buttons="buttons"
                          :operationsWidth="200"
                          :pagination="true"
                          :gridIndex="false"
                          :columns="columns"
                          :data-url="'tdm/TdmKnowledge/search'"
                          :query="query"></ice-query-grid>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mian">
      <ul class="mian_list">
        <!-- 饼形图 -->
        <li>
          <div class="information">
            <p><i>*</i> 知识分布</p>
            <div class="chart_box">
              <chartpie ref="chartpie"></chartpie>
            </div>
          </div>
        </li>
        <!-- 最新知识 -->
        <li>
          <div class="information">
            <p><i>*</i> 最新知识</p>
            <div class="chart_box2"
                 v-for="(recentKnowledge, index) in recentKnowledges"
                 :key="index">
              <div class="latest_news">
                <span>【内网】</span>
                <span>{{ recentKnowledge.fileTypeName }}</span>
                <span>{{ recentKnowledge.dateTime }}</span>
              </div>
            </div>
          </div>
        </li>
        <!-- 热搜词 -->
        <li>
          <div class="information">
            <p><i>*</i> 热搜词</p>
            <div class="chart_box2">
              <div class="hot_search"
                   v-for="(term, index) in searchTerms"
                   :key="index">
                <span>{{ term.searchTerm }}</span>
                <span>{{ term.num }}次</span>
              </div>
            </div>
          </div>
        </li>
        <!-- 柱形图 -->
        <li>
          <div class="information">
            <p><i>*</i> 最近更新</p>
            <div class="chart_box">
              <chartcolumn ref="chartcolumn"
                           :barChartData="barChartData"></chartcolumn>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import chartpie from "@/pages/tdm/gxpt/zsdh/chart_pie.vue"; // 饼形图
import chartcolumn from "@/pages/tdm/gxpt/zsdh/chart_column.vue"; //柱形图
export default {
  data () {
    return {
      query: [
        {
          type: "static",
          code: "searchText",
          label: "",
          value: () => {
            return this.ipt;
          },
        },
      ], //组件查询
      input: "",
      ipt: "",
      barChartData: [],
      recentKnowledges: [],
      searchTerms: [],
      knowledgeTotal: 0,
      todayQuery: 0,
      totalQuery: 0,
      tableData: [],
      columns: [],
      isSearch: false,
      searchTermsVlaue: "",
      buttons: [
        {
          name: "关闭",
          type: "info",
          callback: this.comeBack
        },
      ], //组件按钮
      /* 图标 */
      iconsUrl: {
        jpg: "../tdm/static/icon/tp.png",
        png: '../tdm/static/icon/tp.png',
        doc: '../tdm/static/icon/word.png',
        docx: '../tdm/static/icon/word.png',
        xls: '../tdm/static/icon/excel.png',
        xlsx: '../tdm/static/icon/excel.png',
        mp4: '../tdm/static/icon/mp4.png',
        mp3: '../tdm/static/icon/mp3.png',
        xml: '../tdm/static/icon/xml.png',
        txt: '../tdm/static/icon/txt.png',
        ty: '../tdm/static/icon/qita.png',
      },
    };
  },
  methods: {
    //知识概览 ==> 知识分布   最新知识   最近更新
    knowledgeOverview () {
      this.$axios.get("/tdm/TdmKnowledge/knowledgeShow").then((ret) => {
        console.log("===", ret.data);
        this.searchTerms = ret.data.searchTermLogs;
        this.knowledgeTotal = ret.data.knowledgeTotal;
        this.todayQuery = ret.data.todayQuery;
        this.totalQuery = ret.data.totalQuery;
        if (!this.isSearch) {
          // 最新知识
          this.recentKnowledges = ret.data.recentKnowledge;
          //知识分布
          this.$refs.chartpie.distributed = ret.data.distributed;
          //最近更新
          this.$refs.chartcolumn.barChartData = ret.data.recentlyUpdated;
          this.$refs.chartpie.drawLine();
          this.$refs.chartcolumn.drawLine();
        }
      });
    },

    ltrim (s) {
      return s.replace(/(^\s*)/g, "");
    },
    rtrim (s) {
      return s.replace(/(\s*$)/g, "");
    },
    trim (s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    comeBack () {
      this.isSearch = false;
    },
    searchInFo () {
      this.ipt = this.trim(this.input);
      if (this.ipt != null && this.ipt != "") {
        this.isSearch = true;
        this.$refs.IceQueryGrid.refresh();
      }
    },
    initcolumns () {
      this.columns = [
        { code: "oid", hidden: true },
        {
          label: "类型",
          code: "fileType",
          width: 80,
          align: "center",
          renderCell: (h, data) => {
            // console.log(data.row.fileFormat, '============================');
            if (this.iconsUrl[data.row.fileFormat]) {
              return <img src={this.iconsUrl[data.row.fileFormat]} width="22px" height="22px" />;
            } else {
              return <img src={this.iconsUrl.ty} width="22px" height="22px" />;
            }
          },
        },
        {
          label: "文档名称",
          code: "fileName",
          width: 280,
          showTips: true,
          align: "center",
        },
        { label: "标签", code: "tagName", width: 280, align: "center" },
        {
          label: "作者",
          code: "uploadUser",
          width: 280,
          align: "center",
        },
        {
          label: "下载数量",
          code: "downloadNumber",
          width: 280,
          align: "center",
        },
      ];
    },
    init () {
      //知识概览
      this.knowledgeOverview();
      this.initcolumns();
    },
    /* input赋值 */
    getvalue (e) {
      this.input = e.target.innerText;
    },
  },
  mounted () {
    this.init();
  },
  components: { chartpie, chartcolumn, IceQueryGrid },
};
</script>
<style lang="less" scoped>
.container-box {
  width: 100%;
  padding: 10px;
  height: 100%;
}
.el-button {
  font-size: 20px;
}
header {
  height: 240px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .header_content {
    display: flex;
    flex-direction: column;
    width: 800px;
    .text {
      padding-left: 20px;
    }
    .header_input {
      display: flex;
      .el-input--small {
        height: 66px;
        width: 610px;
      }
      /deep/ .el-input__inner {
        height: 66px;
        width: 610px;
        font-size: 20px;
        border-radius: 0px;
        border-radius: 40px 0 0 40px;
      }
      .el-button {
        width: 160px;
        height: 66px;
      }
      .buttonStyle {
        border-radius: 0 40px 40px 0;
      }
    }
    ul {
      display: flex;
      li {
        margin-right: 15px;
        cursor: pointer;
        color: blue;
      }
    }
  }
}
.mian {
  width: 100%;
  .mian_list {
    display: flex;
    flex-wrap: wrap;
    width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;
    li {
      display: flex;
      width: 600px;
      align-items: center;
      margin-bottom: 40px;
      border-top: 1px solid #ccc;
      position: relative;
      box-sizing: border-box;
      padding: 10px;
      &:nth-child(2n) {
        &::before {
          content: '咨询信息';
          display: block;
          position: absolute;
          top: -12px;
          left: -75px;
          font-size: 18px;
          color: #8b8682;
        }
      }
      &:nth-child(odd) {
        margin-right: 80px;
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 160px;
          background-color: #ccc;
          position: absolute;
          right: -42px;
          top: 110px;
        }
      }
      .information {
        width: 100%;
        height: 260px;
        .chart_box {
          width: 100%;
          height: 237px;
        }
        .chart_box2 {
          width: 100%;
          height: 30px;
          margin-top: 10px;
        }
      }
    }
  }
}
// 最新知识
.latest_news {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 15px;
  padding: 10px;
  span {
    &:nth-child(2) {
      flex: 1;
    }
  }
}
// 热搜词
.hot_search {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 15px;
  padding: 10px;
  span {
    &:nth-child(1) {
      flex: 1;
    }
  }
}
/deep/ .el-form--inline {
  display: none;
}
.icequerygrid {
  margin-bottom: 50px;
}
/deep/.ice-grid-tool-bar {
  background-color: #f9f9f9 !important;
}
/deep/.vxe-table--body-wrapper {
  background-color: #f9f9f9 !important;
}
</style>

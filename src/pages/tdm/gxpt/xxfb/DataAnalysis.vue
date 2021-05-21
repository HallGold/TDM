<template>
  <div class="container-box">
    <div class="content_box">
      <div class="onBox">
        <div class="on_leftBox">
          <div class="DataList">
            <ul>
              <li>
                <div class="icon">
                  <span style="background-color: #1E78B9;"><img src="./images/设备图标.png"
                         alt="" /></span>
                </div>
                <div class="text">
                  <span>设备总数</span>
                  <span><i style="font-size:20px;color:#DCC148; font-weight: bold;">100</i>单</span>
                </div>
              </li>
              <li>
                <div class="icon">
                  <span style="background-color: #379548;border:1px solid #ccc"><img src="./images/设备图标.png"
                         alt="" /></span>
                </div>
                <div class="text">
                  <span>可用设备数</span>
                  <span><i style="font-size:20px;color:#DCC148;font-weight: bold;">37</i>单</span>
                </div>
              </li>
              <li>
                <div class="icon">
                  <span style="background-color: #1A81C6;"><img src="./images/设备图标.png"
                         alt="" /></span>
                </div>
                <div class="text">
                  <span>当前运行设备</span>
                  <span><i style="font-size:20px;color:#DCC148;font-weight: bold;">18</i>单</span>
                </div>
              </li>
              <li>
                <div class="icon">
                  <span style="background-color: #3761B7;"><img src="./images/设备图标.png"
                         alt="" /></span>
                </div>
                <div class="text">
                  <span>异常设备</span>
                  <span><i style="font-size:20px;color:#DCC148;font-weight: bold;">2</i>单</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="lineChart-columnChart">
            <div class="lineChart">
              <h3 class="chart-title">总设备运行时常环比(月)</h3>
              <div class="myChart-line">
                <lineChart></lineChart>
              </div>
            </div>
            <div class="columnChart">
              <h3 class="chart-title">设备预约排行榜(前10)</h3>
              <div class="myChart-column">
                <column-chart></column-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="on_right-Box">
          <div class="PieChart">
            <h3 class="chart-title">设备总利用率(月)</h3>
            <div class="myChart-Pie">
              <pie-chart></pie-chart>
            </div>
          </div>
          <div class="announcement">
            <h3 class="chart-title">通知公告</h3>
            <div class="announcementList">
              <ul>
                <li>
                  <span>2020年8月26日xx实验检测项目完成</span>
                  <span>2020-7-14</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="underBox">
        <div class="under_leftBox">
          <div class="grade">
            <h3 class="chart-title">设备利用率排名</h3>
            <div class="gradeList">
              <ul>
                <li>
                  <span> <i style="background-color: lightsalmon;"></i> 1</span>
                  <span>A班组</span>
                  <span>98%</span>
                </li>
                <li>
                  <span> <i style="background-color: #FFC125;"></i> 2</span>
                  <span>B班组</span>
                  <span>98%</span>
                </li>
                <li>
                  <span> <i style="background-color: #1E90FF;"></i> 3</span>
                  <span>C班组</span>
                  <span>98%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="under_right-Box">
          <div class="chart-title">
            <h3>设备开放共享</h3>
            <ul>
              <li>分析中心</li>
              <li>基因中心</li>
              <li>检测中心</li>
            </ul>
          </div>
          <div class="Table">
            <template>
              <div class="block">
                <el-carousel height="170px"
                             :autoplay="false"
                             indicator-position="none">
                  <el-carousel-item v-for="item in carousel_item"
                                    :key="item">
                    <ul>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备1</span>
                      </li>
                      <li>
                        <div class="imga"
                             style=" background-color: rgba(206,178,31,.5);border: 1px solid rgb(206,178,31);">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备2</span>
                      </li>
                      <li>
                        <div class="imga"
                             style=" background-color: rgba(39,121,242,.5);border: 1px solid rgb(39,121,242);">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备3</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备4</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备5</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备6</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备7</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备8</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备9</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备10</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备11</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备12</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备13</span>
                      </li>
                      <li>
                        <div class="imga">
                          <img src="./images/设备图标1.png"
                               alt="" />
                        </div>
                        <span>设备14</span>
                      </li>
                    </ul>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import lineChart from "@/pages/tdm/gxpt/xxfb/chart_DataAna/lineChart.vue"; //线图
import ColumnChart from "@/pages/tdm/gxpt/xxfb/chart_DataAna/ColumnChart.vue"; //柱图
import PieChart from "@/pages/tdm/gxpt/xxfb/chart_DataAna/PieChart.vue"; //饼图
export default {
  name: "ManagementAnalysis",
  components: { lineChart, ColumnChart, PieChart },
  data () {
    return {
      carousel_item: 1,
    };
  },
};
</script>
<style lang="less" scoped>
.container-box {
  width: 100%;
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    .onBox {
      width: 100%;
      flex: 3;
      display: flex;
      .on_leftBox {
        flex: 2.8;
        display: flex;
        flex-direction: column;
        .DataList {
          flex: 1;
          ul {
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            li {
              width: 290px;
              height: 110px;
              margin-right: 10px;
              border-radius: 8px;
              display: flex;
              &:nth-child(1) {
                background-color: #0d6aa5;
              }
              &:nth-child(2) {
                background-color: #187b28;
              }
              &:nth-child(3) {
                background-color: #196ac5;
              }
              &:nth-child(4) {
                margin-right: 0;
                background-color: #27479e;
              }
              .icon {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                  width: 70px;
                  height: 70px;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 85px;
                  img {
                    width: 36px;
                    height: 32px;
                  }
                }
              }
              .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: #fff;
                font-size: 14px;
              }
            }
          }
        }
        .lineChart-columnChart {
          flex: 3.2;
          display: flex;
          box-sizing: border-box;
          .lineChart {
            flex: 1;
            background: url('./images/实验项目环比 总设备运行时长边框.png') no-repeat;
            margin-right: 15px;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;

            .chart-title {
              width: 100%;
              height: 90px;
              font-size: 25px;
              color: #4d799f;
              text-align: center;
              line-height: 90px;
            }
            .myChart-line {
              padding: 20px;
              box-sizing: border-box;
              width: 100%;
              height: 300px;
            }
          }
          .columnChart {
            flex: 1;
            background: url('./images/过去一周实验状态过去一周实验状态边框.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
            .chart-title {
              height: 90px;
              font-size: 25px;
              color: #4d799f;
              text-align: center;
              line-height: 90px;
            }
            .myChart-column {
              width: 100%;
              height: 300px;
              padding: 20px;
              box-sizing: border-box;
            }
          }
        }
      }
      .on_right-Box {
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-left: 15px;
        .PieChart {
          flex: 1;
          background: url('./images/总实验完成率 总设备利用率及通知公告边框.png') no-repeat;
          background-size: 100% 100%;
          margin-bottom: 25px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
          .chart-title {
            height: 20px;
            font-size: 20px;
            color: #4d799f;
            text-align: center;
            line-height: 40px;
          }
          .myChart-Pie {
            width: 100%;
            height: 230px;
            padding: 20px;
            box-sizing: border-box;
          }
        }
        .announcement {
          flex: 1;
          background: url('./images/总实验完成率 总设备利用率及通知公告边框.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
          .chart-title {
            height: 60px;
            font-size: 20px;
            color: #4d799f;
            text-align: center;
            line-height: 60px;
          }
          .announcementList {
            width: 100%;
            height: 100%;
            ul {
              width: 100%;
              height: 100%;
              li {
                display: flex;
                justify-content: space-between;
                padding: 0 25px;
                box-sizing: border-box;
                color: #fff;
                span {
                  &:nth-child(1) {
                    position: relative;
                    &::before {
                      content: '';
                      display: block;
                      width: 10px;
                      height: 10px;
                      border-radius: 50%;
                      background-color: #fff;
                      position: absolute;
                      left: -15px;
                      top: 6px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .underBox {
      width: 100%;
      flex: 1.4;
      display: flex;
      box-sizing: border-box;
      .under_leftBox {
        flex: 1;
        margin-right: 20px;
        .grade {
          width: 100%;
          height: 100%;
          background: url('./images/班组实验完成率 设备利用率 闲置时长排名边框.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
          .chart-title {
            height: 60px;
            font-size: 20px;
            color: #4d799f;
            text-align: center;
            line-height: 60px;
          }
          .gradeList {
            width: 100%;
            height: 100%;
            ul {
              width: 100%;
              height: 100%;
              li {
                display: flex;
                justify-content: space-between;
                color: #fff;
                text-align: center;
                margin-bottom: 10px;
                span {
                  &:nth-child(1) {
                    flex: 0.5;
                    position: relative;
                    z-index: 1;
                    i {
                      display: block;
                      width: 20px;
                      height: 20px;
                      position: absolute;
                      top: 1px;
                      left: 32px;
                      border-radius: 50%;
                      z-index: -1;
                    }
                  }
                  &:nth-child(2) {
                    flex: 1;
                    text-align: left;
                  }
                  &:nth-child(3) {
                    flex: 1;
                  }
                }
              }
            }
          }
        }
      }
      .under_right-Box {
        flex: 3;
        width: 100%;
        height: 100%;
        background: url('./images/实验进度未完成详情边框.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-sizing: border-box;
        .chart-title {
          position: relative;
          h3 {
            height: 45px;
            font-size: 20px;
            color: #4d799f;
            text-align: center;
            line-height: 45px;
          }
          ul {
            display: flex;
            position: absolute;
            top: 10px;
            right: 110px;
            li {
              color: #fff;
              margin-right: 30px;
              position: relative;
              &:nth-child(1) {
                &::before {
                  content: '';
                  display: block;
                  width: 10px;
                  height: 10px;
                  position: absolute;
                  top: 6px;
                  left: -20px;
                  background-color: rgb(18, 238, 201);
                }
              }
              &:nth-child(2) {
                &::before {
                  content: '';
                  display: block;
                  width: 10px;
                  height: 10px;
                  position: absolute;
                  top: 6px;
                  left: -20px;
                  background-color: rgb(238, 176, 19);
                }
              }
              &:nth-child(3) {
                &::before {
                  content: '';
                  display: block;
                  width: 10px;
                  height: 10px;
                  position: absolute;
                  top: 6px;
                  left: -20px;
                  background-color: rgb(25, 162, 241);
                }
              }
            }
          }
        }
        .Table {
          width: 100%;
          height: 100%;
          padding: 0 10px;
          padding-bottom: 10px;
          box-sizing: border-box;
        }
      }
    }
  }
}
.el-carousel__item {
  padding: 0 70px;
  box-sizing: border-box;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    li {
      display: flex;
      flex-direction: column;
      margin-right: 70px;
      /*  &:nth-child(8n) {
        margin-right: 0;
      } */
      .imga {
        width: 75px;
        height: 60px;
        background-color: rgba(26, 100, 111, 0.8);
        border: 1px solid rgb(55, 237, 243);
        border-radius: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 34px;
          height: 34px;
        }
      }
      span {
        color: #fff;
        text-align: center;
      }
    }
  }
}
</style>

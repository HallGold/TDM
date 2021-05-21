<template>
  <div class="containerBox">
    <ul>
      <li>
        <div class="title">
          <span><img src="./img/u38.png"
                 alt=""></span>
          <span>业务</span>
        </div>
        <div class="Datalist">
          <div class="box">
            <div class="text">
              <span></span>
              <span>当前实验总量<br><i>50</i>项</span>
            </div>
            <div class="text">
              <span>生产型<i>24</i>项</span>
              <span>科研型<i>24</i>项</span>
            </div>
          </div>
          <div class="box">
            <div class="text">
              <span></span>
              <span>已完成实验项<br><i>50</i>项</span>
            </div>
            <div class="text">
              <span>生产型<i>24</i>项</span>
              <span>科研型<i>24</i>项</span>
            </div>
          </div>
          <div class="box">
            <div class="text">
              <span></span>
              <span>待完成实验项<br><i>50</i>项</span>
            </div>
            <div class="text">
              <span>生产型<i>24</i>项</span>
              <span>科研型<i>24</i>项</span>
            </div>
          </div>
          <div class="box">
            <div class="text">
              <span></span>
              <span>实验中<br><i>50</i>项</span>
            </div>
            <div class="text">
              <span>生产型<i>24</i>项</span>
              <span>科研型<i>24</i>项</span>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="childrenBox">
          <div class="title">
            <span><img src="./img/u47.svg"
                   alt=""></span>
            <span>预约</span>
          </div>
          <div class="Datalist">
            <div class="textList">
              <span>35</span>
              <span>当日预约人数</span>
            </div>
            <div class="textList">
              <span>35</span>
              <span>当月预约人数</span>
            </div>
            <div class="textList">
              <span>35</span>
              <span>预约总人数</span>
            </div>
          </div>
        </div>
        <div class="childrenBox">
          <div class="title">
            <span><img src="./img/u80.svg"
                   alt=""></span>
            <span>预约</span>
          </div>
          <div class="Datalist">
            <div class="textList">
              <span>35</span>
              <span>总设备数</span>
            </div>
            <div class="textList">
              <span>35</span>
              <span>当前可用设备</span>
            </div>
            <div class="textList">
              <span>35</span>
              <span>故障设备</span>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="sy-bg">
          <div class="sy-bgBox">
            <div class="title">
              <span><img src="./img/u100.svg"
                     alt=""></span>
              <span>预约</span>
            </div>
            <div class="Datalist">
              <div class="textList">
                <span>35</span>
                <span>当前样品库</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>已消耗样品</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>余样已处理</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>余样待处理</span>
              </div>
            </div>
          </div>
          <div class="sy-bgBox">
            <div class="title">
              <span><img src="./img/u125.png"
                     alt=""></span>
              <span>预约</span>
            </div>
            <div class="Datalist">
              <div class="textList">
                <span>35</span>
                <span>已生成实验报告</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>已取走实验报告</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>待取走实验报告</span>
              </div>
              <div class="textList">
                <span>35</span>
                <span>当日取走实验报告</span>
              </div>
            </div>
          </div>
        </div>
        <div class="syjd">
          <pie-chart></pie-chart>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import PieChart from './charts/pieChart.vue';
export default {
  components: { PieChart },
}
</script>

<style lang="less" scoped>
.containerBox {
  width: 100%;
}
ul {
  display: flex;
  flex-direction: column;
  height: 100%;
  li {
    flex: 1;
    margin-bottom: 10px;
    &:nth-child(1) {
      flex: 3;
      display: flex;
      justify-content: space-between;
      .title {
        flex: 0.84;
      }
      .Datalist {
        .box {
          height: 100%;
          flex: 1;
          margin-right: 10px;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          color: #fff;
          font-size: 16px;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20px;
          .text {
            &:nth-child(1) {
              flex: 4;
              display: flex;
              justify-content: start;
              align-items: center;
              span {
                &:nth-child(1) {
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  background-color: rgba(255, 255, 255, 0.5);
                  margin-right: 20px;
                }
                &:nth-child(2) {
                  margin-top: 5px;
                  i {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin-right: 5px;
                  }
                }
              }
            }
            &:nth-child(2) {
              flex: 1;
              display: flex;
              justify-content: center;
              span {
                i {
                  margin-left: 10px;
                }
                &:nth-child(1) {
                  margin-right: 80px;
                }
                &:nth-child(2) {
                }
              }
            }
          }
          &:nth-child(1) {
            background-image: linear-gradient(to right, #3fd7d5, #16a0d2);
          }
          &:nth-child(2) {
            background-image: linear-gradient(to right, #a36df0, #f75ea5);
          }
          &:nth-child(3) {
            background-image: linear-gradient(to right, #f8be87, #f3636b);
          }
          &:nth-child(4) {
            background-image: linear-gradient(to right, #7959ff, #a2c0fe);
          }
        }
      }
    }
    &:nth-child(2) {
      flex: 2;
      display: flex;
      justify-content: space-between;
      .childrenBox {
        &:nth-child(1) {
          margin-right: 10px;
        }
        flex: 1;
        display: flex;
        justify-content: space-between;
        .Datalist {
          box-sizing: border-box;
          .textList {
            display: flex;
            flex-direction: column;
            text-align: center;
            span {
              &:nth-child(1) {
                font-size: 30px;
                color: rgb(73, 194, 241);
              }
              &:nth-child(2) {
                font-size: 15px;
              }
            }
          }
        }
      }
    }
    &:nth-child(3) {
      flex: 4;
      display: flex;
      .sy-bg {
        flex: 3.12;
        margin-right: 5px;
        display: flex;
        flex-direction: column;
        .sy-bgBox {
          flex: 1;
          display: flex;
          justify-content: space-between;
          &:nth-child(1) {
            margin-bottom: 10px;
          }
          .title {
            flex: 1.54;
          }
          .Datalist {
            box-sizing: border-box;
            .textList {
              display: flex;
              flex-direction: column;
              text-align: center;
              span {
                &:nth-child(1) {
                  font-size: 30px;
                  color: rgb(73, 194, 241);
                }
                &:nth-child(2) {
                  font-size: 15px;
                }
              }
            }
          }
        }
      }
      .syjd {
        flex: 2;
        background-color: #fff;
      }
    }
  }
}
.title {
  background-color: #fff;
  height: 100%;
  flex: 2;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    &:nth-child(1) {
      width: 70px;
      height: 70px;
      background-color: #d6eef7;
      border-radius: 50%;
      margin-bottom: 10px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 48px;
        height: 48px;
      }
    }
    &:nth-child(2) {
    }
  }
}
.Datalist {
  background-color: #fff;
  height: 100%;
  flex: 7;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 20px 20px;
}
</style>
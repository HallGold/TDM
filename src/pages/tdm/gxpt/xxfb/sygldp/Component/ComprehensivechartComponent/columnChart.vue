<template>
  <div class="column_Chart1"></div>
</template>

<script>
export default {
  props: ['columnDatas'],
  data () {
    return {
      getColumnDatas: [],
    }
  },
  methods: {
    drawChart () {
      /*  console.log(this.getColumnDatas); */
      let titleData = [];
      let datalist = [];
      this.getColumnDatas.forEach(item => {
        titleData.push(item.deptName)
        datalist.push(item.appCount)
      });
      /*  console.log(titleData);
       console.log(datalist); */
      let myChart = this.$echarts.init(document.querySelector(".column_Chart1"));
      const colorArray = [
        {
          top: '#ffa800', //黄
          bottom: 'rgba(248,195,248,.3)'
        },
        {
          top: '#1ace4a', //绿
          bottom: 'rgba(100,255,249, 0.3)'
        },
        {
          top: '#4bf3ff', //蓝
          bottom: 'rgba(135,183,255,.3)'
        },
        {
          top: '#4f9aff', //深蓝
          bottom: 'rgba(11,42,84,.3)'
        },
        {
          top: '#b250ff', //粉
          bottom: 'rgba(100,255,249,.3)'
        }
      ];
      myChart.setOption(
        {
          title: {
            text: '部门预约统计',
            top: '1%',
            left: '1%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#FFF'
            },
          },
          /* backgroundColor: "#38445E", */
          tooltip: {
            show: true,
            formatter: '{b} : {c}'
          },
          xAxis: {
            type: 'value',
            show: false,
          },
          yAxis: {
            type: 'category',
            axisTick: {
              show: false,
              alignWithLabel: false,
              length: 5,
            },
            inverse: 'true',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff',
              }
            },
            data: titleData,
          },
          series: [
            {
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}',
                }
              },
              data: datalist,
              barWidth: '15px',
              barCategoryGap: '50%',
              itemStyle: {
                normal: {
                  show: true,
                  color: function (params) {
                    let num = colorArray.length;
                    return {
                      type: 'linear',
                      colorStops: [{
                        offset: 0,
                        color: colorArray[params.dataIndex % num].bottom
                      }, {
                        offset: 1,
                        color: colorArray[params.dataIndex % num].top
                      }, {
                        offset: 0,
                        color: colorArray[params.dataIndex % num].bottom
                      }, {
                        offset: 1,
                        color: colorArray[params.dataIndex % num].top
                      }, {
                        offset: 0,
                        color: colorArray[params.dataIndex % num].bottom
                      }, {
                        offset: 1,
                        color: colorArray[params.dataIndex % num].top
                      }, {
                        offset: 0,
                        color: colorArray[params.dataIndex % num].bottom
                      }, {
                        offset: 1,
                        color: colorArray[params.dataIndex % num].top
                      }, {
                        offset: 0,
                        color: colorArray[params.dataIndex % num].bottom
                      }, {
                        offset: 1,
                        color: colorArray[params.dataIndex % num].top
                      }]
                    }
                  },
                  barBorderRadius: 20,
                  borderWidth: 0,
                  borderColor: '#333',
                }
              }
            }
          ]
        }
      )
    }
  },
  watch: {
    columnDatas: function (item) {
      /*  console.log(item); */
      this.getColumnDatas = item;
      this.drawChart()
    }
  },
  mounted () {
    this.drawChart()
  }
}
</script>

<style lang="less" scoped>
.column_Chart1 {
  width: 100%;
  height: 100%;
}
</style>
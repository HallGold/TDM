<template>
  <div class="chart"></div>
</template>
<script>
export default {
  data () {
    return {
      defaultProps: {
        name: "fileTypeName",
        oid: "fileTypeId",
        value: "num"
      },
      myChart: {},
      distributed: []
    };
  },
  methods: {
    drawLine () {
      var getname = this.distributed;
      console.log("知识分布 getname", getname);
      var totel = 0;
      var data = [];
      for (var i = 0; i < getname.length; i++) {
        var pop = {};
        pop.name = getname[i][this.defaultProps.name];
        pop.value = getname[i][this.defaultProps.value];
        data.push(pop);
        totel += getname[i][this.defaultProps.value];
      }
      var colorList = [
        {
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#81BEFF", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#3295FF", // 100% 处的颜色
            },
          ],
        },
        {
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#48D69E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#70F3C2", // 100% 处的颜色
            },
          ],
        },
        {
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#FEAE5C", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#FECC84", // 100% 处的颜色
            },
          ],
        },
        {
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#A1AEFF", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#9686F3", // 100% 处的颜色
            },
          ],
        },
      ];

      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/> {c}",
        },

        legend: {
          type: "plain",
          orient: "vertical",
          height: "88%",
          right: "1%",
          top: "center",
          itemWidth: 18,
          itemHeight: 18,
          data: data,
          formatter: function (name) {
            for (var i = 0; i < getname.length; i++) {
              if (name == data[i].name) {
                var nu = (data[i].value / totel) * 100;
                return "{name|" + name + "}{rate|" + nu.toFixed(2) + "%}";
              }
            }
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 15,
                fontWeight: 400,
                width: 250,
                height: 35,
                padding: [0, 0, 0, 5],
                color: "#999",
              },
              rate: {
                fontSize: 15,
                fontWeight: 500,
                height: 35,
                width: 40,
                align: "right",
                color: "#656565",
              },
            },
          },
        },
        series: [
          {
            type: "pie",
            radius: ["5%", "60%"],
            center: ["25%", "50%"],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: data,
          },
        ],
      });

    },
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = this.$echarts.init(document.querySelector(".chart"));
  },
};
</script>
<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>

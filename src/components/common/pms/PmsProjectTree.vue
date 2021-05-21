<template>
    <el-aside class="abb" ref="abb" :width="Width" style="min-height: 500px;">
        <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in comTabs" :key="index" :label="item.name"
            >
                <ice-custom-tree :buttons="buttons.topButtons" :expandOnClickNode="expandOnClickNode" :transfer="item"
                                 @handleCallback="handleCallback"></ice-custom-tree>
            </el-tab-pane>
        </el-tabs>
        <pms-project-msg :title="title" :bottomButtons="buttons.bottomButtons" :labelName="labelName" v-loading="loading" :msgdata="msgData"></pms-project-msg>
    </el-aside>
</template>

<script>
  import IceCustomTree from "./IceCustomTree";
  import PmsProjectMsg from "./PmsProjectMsg";
  // 获取近5年的年份
  function nearFiveYears() {
    let date = new Date();
    let currentYear = date.getFullYear();
    let arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(currentYear);
      currentYear -= 1;
    }
    return arr.join(',');
  }
  export default {
    name: "PmsProjectTree",
    props: {
      // 宽度
      Width: {
        default: '250px'
      },
      // 是否点击标签需要展示
      expandOnClickNode: {
        default: false
      },
      // 需要隐藏的数组
      conceal: {
        default: function () {
          return []
        }
      },
      tabs: {
        default: function () {
          return [
            {
              name: '按年份',
              api: '/pms/Xminfo/listByYear',
              lazy: false,
              props: {
                label: 'xmname',
                children: 'children'
              },
              // 默认node_key 树唯一标识
              nodeKey: 'oid',
              initModel: {
                years: nearFiveYears()
              },
            },
            {
              name: '按状态',
              // 请求接口
              api: '/pms//Xminfo/listByStatus',
              // 是否需要异步加载
              lazy: false,
              // 默认node_key 树唯一标识
              nodeKey: 'oid',
              // 字段配置
              props: {
                label: 'xmname',
                children: 'children'
              },
              // 请求数据
              initModel: {}
            },
          ]
        },
      },
      // 请求详情信息接口
      api: {
        type: String,
        default: '/pms/Xminfo/get'
      },
      // 配置详情需要展示的数据 及展示的字段
      labelName: {
        default: function () {
          return [
            {
              name: '日期',
              label: 'updateDate',
              isZf: true,
              // 操作字符串
              handleStr: (val) => {
                if (val) {
                  return val.split(' ')[0]
                } else {
                  return ''
                }

              }
            },
            {
              name: '项目名称',
              label: 'xmname',
            },
            {
              name: '项目编号',
              label: 'xmcode',
            },
            {
              name: '项目类别',
              label: 'xmlb',
            },
            {
              name: '项目状态',
              label: 'xmzt',
            },
            {
              name: '学科方向',
              label: 'xmxkfx',
            },
            {
              name: '主管部门',
              label: 'xmzgbm',
            },
            {
              name: '项目主管',
              label: 'xmzg',
            },
          ]
        },
      },
      buttons: {
        type: Object,
        default: function () {
          return {
            topButtons: [],
            bottomButtons: []
          }
        }
      },
      title: {
        default: '项目信息',
        type: String
      }

    }
  ,
  data()
  {
    return {
      loading: false,
      msgData: {},
      // 请求最近多少年配置
      requestYear: 7
    }
  }
  ,
  computed: {
    comTabs()
    {
      let arr = [];
      this.tabs.forEach((c, i) => {
        if (!this.conceal.includes(c.name)) {
          arr.push(c)
        }
      })
      return arr;
    }
  ,

  }
  ,
  created(){

  }

  ,
  methods: {
    handleClick(tab, event)
    {
      console.log(tab.index);
    }
  ,
    // 子组件点击回调
    handleCallback(data)
    {
      this.$emit('handleCallback', data);
      let oid = data.oid;
      this.getData(oid);
    }
  ,
    // 获取数据
    getData(oid)
    {
      this.loading = true;
      this.$axios.get(this.api, {params: {id: oid}})
        .then(result => {
          if (result.status === 200) {
            this.msgData = result.data;
            this.loading = false;
          }
        })
        .catch(error => {
          this.$message.error("获取失败")
        })
        .finally(_ => {
          console.log('完成');
        })
    }
  }
  ,
  components: {
    IceCustomTree,
      PmsProjectMsg
  }
  }
</script>

<style lang="less" scoped>
    .abb {
        position: relative;
    }

    .abb /deep/ .el-tabs--border-card {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .abb /deep/ .el-tabs--border-card > .el-tabs__content {
        height: calc(100% - 370px);
        overflow: auto;
    }
</style>

  export default [
      {
          path: 'index',
          component: `JHGL.vue`,
          title: '计划管理'
      },
      {
          path: 'tcjhgl',
          component: `TCJHGL.vue`,
          title: '统筹计划管理'
      },
      {
          path: "jhgl_add_flow",
          component: "JHGL_Add_FLOW.vue",
          title: "计划新增流程页面",
          // isShowTag: true,
          // refresh: false
      },
      // {
      //     path: "JhglChangeFlow",
      //     component: "JhglChangeFlow.vue",
      //     title: "计划变更流程页面"
      // },
      {
          path: "lsjl",
          component: "lsjl.vue",
          title: "流程的历史记录页面"
      },
  ]

export default [
    /* {
         path: 'myServeWork',
         component: 'myServeWork.vue',
         title: '工单待受理'
     },*/
    {
        path: 'workTicket',
        component: 'workTicket.vue',
        title: '工单待受理'
    },
    {
        path: 'serviceTicket',
        component: 'serviceTicket.vue',
        title: '服务待受理',
        refresh: true,
    },
    {
        path: 'serviceAcceptance',
        component: 'serviceAcceptance.vue',
        title: '用户首页',
        refresh: true,
    },
    {
        path: 'serviceTicketHandleMessage',
        component: 'serviceTicketHandleMessage.vue',
        title: '服务单处理信息查询',
        refresh: true,
    },
    {
        path: 'serviceObjectQuery',
        component: 'serviceObjectQuery.vue',
        title: '服务对象查询',
        refresh: true,
    },
    {
        path: 'haveSent',
        component: 'haveSent.vue',
        title: '已派工单页面管理',
        refresh: true,
    },
    {
        path: 'serviceTrack',
        component: 'serviceTrack.vue',
        title: '服务单跟踪',
        refresh: true,
    },
    {
        path: 'serviceTicketLabel',
        component: 'serviceTicketLabel.vue',
        title: '服务单标注',
        refresh: true,
    },
    {
        path: 'workTrack',
        component: 'workTrack.vue',
        title: '工单跟踪'
    },
    {
        path: 'serveMessage',
        component: 'base/workTrack.vue',
        title: '服务基本信息'
    },
    {
        path: 'serveFoundation',
        component: 'base/serveFoundation.vue',
        title: '服务单基础信息'
    }
    ,
    {
        path: 'disposeMessage',
        component: 'base/disposeMessage.vue',
        title: '处理信息'
    },
    {
        path: 'myServeWork',
        component: 'myServeWork.vue',
        title: '我的服务工单'
    },
    {
        path: 'serviceTicket/serviceAsk',
        component: 'base/serviceAsk.vue',
        title: '服务申请'
    },
    {
        path: 'serviceTicket/stoppageAsk',
        component: 'base/stoppageAsk.vue',
        title: '故障申请'
    },
    {
        path: 'serviceTicket/transaction',
        component: 'base/transaction',
        title: '办理',
        refresh: true,
    },
    {
        path: 'serviceBusiness',
        component: 'serviceBusiness',
        title: '服务单业务数据修改',
        refresh: true,
    },
    {
        path: 'serviceBusiness/serviceChange',
        component: 'base/serviceChange',
        title: '服务单数据修改',
        refresh: true,
    },
    {
        path: 'workBusiness',
        component: 'workBusiness',
        title: '工单业务数据修改',
        refresh: true,
    },
    {
        path: 'workBusiness/workChange',
        component: 'base/workChange',
        title: '工单数据修改',
        refresh: true,
    },
    {
        path: 'serviceTicket/detail',
        component: 'base/detail',
        title: '详情'
    },
    {
        path: 'AccessoryMessage',
        component: 'base/AccessoryMessage',
        title: '附件上传'
    },
    {
        path: 'workTransaction',
        component: 'base/workTransaction',
        title: '工单办理',
        refresh: true,
    },
    {
        path: 'serviceTicket/transaction/relevance',
        component: 'base/relevance',
        title: '关联'
    },
    {
        path: 'serviceTicket/transaction/assign',
        component: 'base/assign',
        title: '分派'
    },
    {
        path: 'serviceTicket/transaction/solveQuickly',
        component: 'base/solveQuickly',
        title: '快速解决'
    },
    {
        path: 'serviceTicket/transaction/serviceListAdd',
        component: 'base/serviceListAdd',
        title: '添加'
    },
    {
        path: 'serviceTicket/hasSent',
        component: 'base/hasSent',
        title: '查看已派出工单'
    },
    {
        path: 'serviceTicket/serviceSupplement',
        component: 'base/serviceSupplement',
        title: '服务单补录'
    },
    {
        path: 'serviceTicket/errorSupplement',
        component: 'base/errorSupplement',
        title: '服务单补录'
    },
    {
        path: 'proposerMessage',
        component: 'base/proposerMessage.vue',
        title: '故障申请'
    },
    {
        path: 'maintainMenber',
        component: 'base/maintainMenber.vue',
        title: '组织人员'
    },
    {
        path: 'nextEngineer',
        component: 'base/nextEngineer',
        title: '推荐工程师'
    },
    {
        path: 'deviceManage',
        component: 'base/deviceManage',
        title: '技术服务目录-新增对象'
    },
    {
        path: 'serviceAcceptance/FlowEvent',
        component: 'FlowldpEvent',
        title: '安全事件'
    },
]

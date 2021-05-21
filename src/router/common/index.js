export default [
    {
        path: 'ResMsgList',
        component: 'resmsg/ResMsgList.vue',
        title: '邮件发送管理'
    },{
        path:'resAnnouncement',
        component: 'resmsg/ResAnnountcementList.vue',
        title: '公告管理'
    },{
        path:'resAnnouncementStore',
        component: 'resmsg/ResAnnouncementStore.vue',
        title: '公告维护'
    },{
        path:'resAnnTypeList',
        component: 'resmsg/ResAnnTypeList.vue',
        title: '公告类型管理'
    },{
        path:'mailAccount',
        component: 'resmsg/EmailAccountList.vue',
        title: '邮箱账号配置'
    },{
        path:'rule',
        component:'resmsg/RuleList.vue',
        title:'规则'
    },{
        path:'newHomePage',
        component:'resmsg/newHomePage.vue',
        title:'主页'
    }
    ,{
        path:'newHomePageSearch',
        component:'resmsg/newHomePageSearch.vue',
        title:'主页检索页面'
    }
]

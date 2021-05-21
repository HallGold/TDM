export default [
    {
        path: 'enterNet/edit',
        component: 'enternet/edit.vue',
        title: `设备入网编辑`
    }, {
        path: 'devProcessApplyManage',
        component: 'devProcessApplyManage.vue',
        title: `设备入网编辑`
    },
    {
        path: 'outerNetFlow',
        component: 'outernet/js/outerNetFlow.vue',
        title: `设备出网流程`
    },
    {
        path: 'repair/edit',
        component: 'repair/edit.vue',
        title: `设备维修流程`
    },
    {
        path: 'enterNet/manage',
        component: 'enternet/manage.vue',
        title: `设备入网管理`
    },{
        path: 'osReinstall/edit',
        component: 'osReinstall/edit.vue',
        title: `设备操作系统重装管理`
    },{
        path: 'security/edit',
        component: 'security/edit.vue',
        title: `设备定密`
    },{
        path: 'dutyAlter/edit',
        component: 'dutyAlter/edit.vue',
        title: `设备责任人变更`
    },
    {
        path: 'hardwareUninstall/edit',
        component: 'hardwareUninstall/edit.vue',
        title: `设备硬件维修`
    },
    {
        path: 'hardwareReplace/edit',
        component: 'hardwareReplace/edit.vue',
        title: `设备硬件更换`
    },
    {
        path: 'secrecyProductUninstall/edit',
        component: 'secrecyProductUninstall/edit.vue',
        title: `安全保密产品卸载`
    },
    {
        path: 'settlePlaceChanged/edit',
        component: 'settlePlaceChanged/edit.vue',
        title: `设备放置地点变更`
    },
    {
        path: 'processManage',
        component: 'processManage.vue',
        title: `设备流程管理`,
        children: [
            {
                path: 'enterNet/manage',
                name: 'enterNet/manage',
                component: resolve => require(['@/pages/biz/businessprocess/enternet/manage.vue'], resolve),
            }, {
                path: 'repair/manage',
                name: 'repair/manage',
                component: resolve => require(['@/pages/biz/businessprocess/repair/manage.vue'], resolve),
            },{
                path: 'institute/online/manageOnline',
                name: 'institute/online/manageOnline',
                component: resolve => require(['@/pages/biz/institute/online/manageOnline.vue'], resolve),
            },{
                path: 'institute/update/manageUpdate',
                name: 'institute/update/manageUpdate',
                component: resolve => require(['@/pages/biz/institute/update/manageUpdate.vue'], resolve),
            },{
                path: 'institute/power/managePower',
                name: 'institute/power/managePower',
                component: resolve => require(['@/pages/biz/institute/power/managePower.vue'], resolve),
            },{
                path: 'institute/offline/manageOffline',
                name: 'institute/offline/manageOffline',
                component: resolve => require(['@/pages/biz/institute/offline/manageOffline.vue'], resolve),
            },{
                path: 'institute/modify/manageModify',
                name: 'institute/modify/manageModify',
                component: resolve => require(['@/pages/biz/institute/modify/manageModify.vue'], resolve),
            }
        ]
    }
]

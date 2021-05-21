export default [
    {
        path: 'datamaplist',
        component: 'datamap/DatamapList.vue',
        title: '数据字典维护'
    },
    // {
    //     path: 'data',
    //     component: 'datamap/Data.vue',
    //     title: '数据字典维护'
    // },
    {
        path: 'organizationtypelist',
        component: 'organization/OrganizationTypeList.vue',
        title: '组织机构类型维护'
    },
    // {
    //     path: 'organizationtypeedit',
    //     component: 'organization/OrganizationTypeEdit.vue',
    //     title: '组织机构类型编辑'
    // },
    {
        path: 'organizationlist',
        component: 'organization/OrganizationList.vue',
        title: '组织机构维护'
    },
    {
        path: 'tenantmanage',
        component: 'organization/TenantManage.vue',
        title: '租户维护'
    },
    {
        path: 'organizationedit',
        component: 'organization/OrgEdit.vue',
        title: '组织机构编辑'
    },
    {
        path: 'usermanage',
        component: 'users/UserManage.vue',
        title: '用户管理'
    },
    {
        path: 'userauth',
        component: 'users/UserAuthManage.vue',
        title: '用户授权'
    },
    // {
    //     path: 'workpositiontypemanage',
    //     component: 'workposition/WorkPositionTypeManage.vue',
    //     refresh: true,
    //     title: '岗位线管理'
    // },
    // {
    //     path: 'workpositiontypeedit',
    //     component: 'organization/WorkPositionTypeEdit.vue',
    //     refresh: true,
    //     title: '岗位线编辑'
    // },
    // {
    //     path: 'workpositionedit',
    //     component: 'workposition/WorkPositionEdit.vue',
    //     title: '岗位编辑'
    // },
    {
        path: 'workpositionmanage',
        component: 'workposition/WorkPositionManage.vue',
        title: '岗位线管理'
    },
    // {
    //     path: 'workpositionwork',
    //     component: 'workposition/WorkPositionWork.vue',
    //     title: '岗位'
    // },
    {
        path: 'workpositionworkmanger',
        component: 'workposition/WorkPositionWorkManger.vue',
        title: '岗位管理'
    },
    {
        path: 'workpositionworkauth',
        component: 'workposition/WorkPositionWorkAuthManger.vue',
        title: '岗位人员维护'
    },
    // {
    //     path: 'commselect',
    //     component: 'comm/CommSelect.vue',
    //     title: '通用选择'
    // },
    // {
    //     path: 'rolemanage',
    //     component: 'role/RoleManage.vue',
    //     title: '角色管理(废弃)'
    // },
    // {
    //     path: 'roleEdit',
    //     component: 'role/RoleEdit.vue',
    //     title: '角色编辑(废弃)'
    // },
    // {
    //     path: 'roleaccredituser',
    //     component: `role/RoleAccreditUser.vue`,
    //     title: '角色人员授权(废弃)'
    // },
    // {
    //     path: 'appmanage',
    //     component: `app/AppManage.vue`,
    //     title: 'APP管理(废弃)'
    // },
    // {
    //     path: 'appedit',
    //     component: `app/AppEdit.vue`,
    //     title: 'APP编辑'
    // },
    // {
    //     path: 'funcedit',
    //     component: `app/FuncEdit.vue`,
    //     title: 'APP功能点(废弃)'
    // },
    {
        path: 'appaccredit',
        component: `app/AppAccredit.vue`,
        title: 'APP授权'
    },
    {
        path: 'constantmanage',
        component: `constant/ConstantManage.vue`,
        title: 'APP常量'
    },
    {
        path: 'resetpwd',
        component: `users/ResetPwd.vue`,
        title: '重置密码'
    },
    // {
    //     path: 'roleauthorize',
    //     component: `role/RoleAuthorize.vue`,
    //     title: '角色人员授权(已废弃)'
    // },
    {
        path: 'formcode',
        component: `formcode/formcode.vue`,
        title: '单据编号规则管理'
    },
    {
        path: 'serviceManage',
        component: `serviceInformation/serviceManage.vue`,
        title: '后台服务管理'
    },
    {
        path: 'informationPreserveManage',
        component: `informationPreserve/informationPreserveManage.vue`,
        title: '页面管理'
    },
    {
        path: 'roleManagePage',
        component: `roleManage/roleManagePage.vue`,
        title: '角色管理'
    },
    {
        path: 'appManagePage',
        component: `appManage/appManagePage.vue`,
        title: 'APP管理'
    },
    {
        path: 'dataOriginPage',
        component: `dataOrigin/dataOriginPage.vue`,
        title: '数据源维护'
    },
    {
        path: 'roleAccreditPage',
        component: `roleAccredit/roleAccreditPage.vue`,
        title: '角色授权'
    },
    {
        path: 'strategyPreservePage',
        component: `strategyPreserve/strategyPreservePage.vue`,
        title: '数据隔离策略维护'
    },
    {
        path: 'dataTablePage',
        component: `dataTable/dataTablePage.vue`,
        title: '数据表维护'
    },
    {
        path: 'cacheManage',
        component: `cache/cacheManage.vue`,
        title: '缓存管理'
    },
    {
        path: 'runtime-logs',
        component: `logs/RuntimeLogs.vue`,
        title: '系统运行日志'
    },
    ,
    {
        path: 'sql-exector',
        component: `sqlExector/SqlExector.vue`,
        title: 'SQL执行器'
    },
    {
        path: 'inform',
        component: `inform/inform.vue`,
        title: '系统通知'
    },
]

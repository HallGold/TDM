module.exports = {
    title: '前端框架文档',
    description: '前端框架文档',
    base: '/',
    themeConfig: {
        /*nav: [
            {text: '参数定义', link: '/apiword'},
            {text: '接口字段定义', link: '/api'},
            {text: '附录：错误码', link: '/error'}
        ],*/
        sidebar: [
            '/',
            {
                title: 'Ice功能组件',
                /* collapsable: false,*/
                children: [
                    '/components/IceQueryGrid',
                    '/components/IceSelect',
                    '/components/IceDatePicker'
                ]
            },
            {
                title: 'Ice业务组件',
                children: [/* ... */]
            },
            {
                title: '业务页面规范',
                children: [
                    '/bizGuidelines/IceQueryGrid'
                ]
            }
        ],
        sidebarDepth: 2,
        markdown: {
            lineNumbers: true // 代码块显示行号
        },
    }
}
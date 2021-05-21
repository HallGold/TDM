// 只能选择一个角色的常量
// XMCYLX05 "行政负责人"
// XMCYLX02 "项目主管"
const ROLE_ONE = ["XMCYLX01", 'XMCYLX02', 'XMCYLX11', 'XMCYLX12', 'XMCYLX13', 'XMCYLX14']
// XMCYLX01, XMCYLX02, XMCYLX11, XMCYLX12, XMCYLX13, XMCYLX14
// 必选角色id XMCYLX03
// XMCYLX01, XMCYLX02, XMCYLX11, XMCYLX03
const MUST_ROLE = ["XMCYLX01", 'XMCYLX02', 'XMCYLX11', 'XMCYLX03']

// const forbidDelRole = ['XMCYLX01', 'XMCYLX11'];
const forbidDelRole = [];

// 项目角色
const XMJS = {
    'YZZR': 'XMCYLX11'
}

// 定义审批状态常量
const SPZT = {
    "WSP": "SPZT10", // 未审批
    "SPZ": "SPZT20", // 审批中
    "YSP": "SPZT30", // 已审批
    "ZZSP": "SPZT40", // 终止审批
}

// 定义上报状态
const SBZT = {
    "WSB": "SBZT10", // 未上报
    "YSB": "SBZT20", // 已上报
}

// 定义是否常量
const whether = {
    "IS_YES": "IS_YES", // 是
    "IS_NO": "IS_NO", // 否
}


/**
 *  定义科研项目库
 *
 *
 * @type {{LXZ: string, WSS: string, SSZ: string, ZT: string, YQ: string, BG: string, GB: string, ZZ: string}}
 */
// 项目状态
const XM_ZT = {
    "LXZ": "XMZT10", // 立项中
    "WSS": "XMZT20", // 未实施
    "SSZ": "XMZT30", // 实施中
    "ZT": "XMZT31", // 实施中(暂停)
    "YQ": "XMZT32", // 实施中(逾期)
    "BG": "XMZT33", // 实施中(变更)
    "GB": "XMZT40", // 关闭
    "ZZ": "XMZT11", // 终止
}
// // 学科方向
// const XKFX = {
//     "XKFX1": "XMXKFX01",
// }
// // 项目类别
// const XMLB = {
//
// }


// 定义项目状态颜色
const defineXmStatusColor = {
    'XMZT10': '#777',
    'XMZT20': '#777', // 未实施
    'XMZT30': '#64d11d', // 实施中
    'XMZT31': '#ff9e12', // 暂停
    'XMZT32': '#e0361b', // 实施中(逾期)
    'XMZT33': '#64d11d', //变更中
    'XMZT40': '#1216f3',//关闭
    'XMZT41': '#1216f3', //终止
}


/**
 *
 *  定义年度任务计划
 *
 *
 *
 *
 */
// 任务状态
const RWZT = {
    "XJ": "RWZT10", // 新建
    "WXF": "RWZT20", // 未下发
    "ZXZ": "RWZT30", // 执行中
    "ZT": "RWZT31", // 执行中(暂停)
    "YQ": "RWZT32", // 执行中(逾期)
    "BG": "RWZT33", // 执行中(变更)
    "WC": "RWZT40", // 完成
    "QX": "RWZT41", // 取消
}

// 任务成果形式
const RWCGXX = {
    "YBRW": "DEFAULT", // 一般任务
    "CPSJ": "PDM", // 设计任务PDM
    "GYSJ": "CAPP", // 工艺任务CAPP
    "SCRW": "MES", // 生产任务MES
    "ZLRW": "QIS", // 质量任务QIS
    "JDXRW": "JDRW", // 阶段性任务
}

// 任务执行反馈类型
const FKLX = {
    "ZCJZ": "ZCJZ", // 正常进展
    "YCFK": "YCFK", // 异常反馈
    "WTFK": "WTFK", // 问题反馈
}
// 定义快过期天数

const fastDay = 3;



/**
 *
 *  统筹计划管理
 *
 *
 */

// 计划状态
const JHZT = {
    "BZZ": "JHZT10", // 编制中
    "WKS": "JHZT20", // 未开始
    "JXZ": "JHZT30", // 进行中
    "ZT": "JHZT31", // 进行中(暂停)
    "YQ": "JHZT32", // 进行中(逾期)
    "BG": "JHZT33", // 进行中(变更)
    "WC": "JHZT40", // 完成
    "QX": "JHZT41", // 取消
}

// 定义计划状态颜色
let defineJhStatusColor = {
    'JHZT10': '#35f314', //编制中
    'JHZT20': '#777', // 未开始
    'JHZT30': '#35f314', // 进行中
    'JHZT31': '#ff9e12', // 暂停
    'JHZT32': '#e0361b', // 进行中(逾期)
    'JHZT33': '#e0361b', // 进行中(变更)

    'JHZT40': '#1216f3',//已完成
    'JHZT41': '#333',//已完成
}

// 定义任务状态颜色
let defineRwStatusColor = {
    'RWZT10': '#777', // 未下发
    'RWZT20': '#777', // 未下发
    'RWZT30': '#35f314', // 执行中
    'RWZT31': '#ff9e12', // 暂停
    'RWZT33': '#ff2a21', // 执行中(变更)
    'RWZT32': '#e0361b', // 执行中(逾期)
    'RWZT40': '#1216f3',//已完成
}


/**
 *
 *
 *  文件管理
 *
 */

// 文档类型
const WDLX = {
    'WFB': 'DOCZT10', // 未发布
    'YFB': 'DOCZT30', // 已发布
    'ZF': 'DOCZT50', // 作废
}

// 文件版本
const WJBB = {
    'CG': 'WJBB01', // 初稿
    'SCG': 'WJBB02', // 审查稿
    'FWG': 'WJBB03', // 发文稿
    'ZSG': 'WJBB04', // 正式稿
}


// 质量计划类型
const ZLJHZT = {
    'WJBZXD': 'ZLJH01', //文件编制修订计划
    'GLPS': 'ZLJH02', // 管理评审计划
    'NS': 'ZLJH03', // 内部审核计划
    'GKGT': 'ZLJH04', // 顾客沟通计划
    'BHGPJZ': 'ZLJH05', // 不合格纠正计划
    'CXGJ': 'ZLJH06', // （质量工作）持续改进计划
    'JDJC': 'ZLJH07', // 监督检查计划
    'GCJS': 'ZLJH08', // 质量信息收集分析计划（过程监视与测
    'ZLPX': 'ZLJH09', // 质量培训计划
    'ZLHD': 'ZLJH10', // 质量活动计划
}

// 异常来源
const YCLY = {
    'ZZFX': 'ZZFX', //自主发现
    'BHGPSB': 'BHGPSB', // 不合格品上报
}

export {
    ROLE_ONE,
    MUST_ROLE,
    XM_ZT,
    defineXmStatusColor,
    forbidDelRole,
    SPZT,
    RWZT,
    JHZT,
    defineJhStatusColor,
    defineRwStatusColor,
    SBZT,
    whether,
    WDLX,
    FKLX,
    RWCGXX,
    fastDay,
    WJBB,
    ZLJHZT,
    XMJS,
    YCLY
}


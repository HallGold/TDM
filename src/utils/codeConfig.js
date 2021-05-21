// package cn.icepanda.commonsample.pms.common.constant;
//
// /**
//  * @Author yudai
//  * @since 2020/3/27
//  */
// public class PdmCode {
//     /**
//      *命名规则：
//      * 类型：T_+表名+ “_” + 字段名（同表同字段：T_+表名+ “_” + 中文注释首字母大写）
//      * 属性：编码规则为：年份4+0001时，     A_+表名+ “_” + 字段名（同表同字段：A_+表名+ “_” + 中文注释首字母大写，参考文件管理 -> 文件夹编码和文档编码）
//      *       编码规则为：年份4+XXXX+0001时，A_+表名+ “_” + XXXX首字母大写
//      */
//
//
//     /**
//      * 协同文件编号（公用）,编码规则:年份4+00001
//      */
//     public static final String T_XT_FJ_FILECODE = "T_XT_FJ_FILECODE";
//
//     /**
//      * 科研项目库 -> 所内项目编号,编码规则:年份4+项目类别+0001
//      */
//     public static final String T_PMS_XMINFO_SNXMBH = "T_PMS_XMINFO_SNXMBH";
//     public static final String A_PMS_XMINFO_XMLB = "A_PMS_XMINFO_XMLB";
//
//     /**
//      * WBS任务 -> 模板编号,编码规则:年份4+0001
//      */
//     public static final String T_PMS_WBS_TYPELATE_WBS_TYPELATE_CODE = "T_PMS_WBS_TYPELATE_WBS_TYPELATE_CODE";
//
//     /**
//      * 统筹计划管理 -> 统筹计划编码,编码规则:年份4+计划类型+0001
//      */
//     public static final String T_PMS_JHGL_WJHCODE = "T_PMS_JHGL_WJHCODE";
//     public static final String A_PMS_JHGL_JHLX = "A_PMS_JHGL_JHLX";
//
//     /**
//      * 生产项目库 -> 生产项目编码,编码规则:年份4+0001
//      */
//     public static final String T_PMS_XMINFO_SCXMBH = "T_PMS_XMINFO_SCXMBH";
//
//     /**
//      * 生产项目库 -> 外部项目编码,编码规则:年份4+0001
//      */
//     public static final String T_PMS_XMINFO_XMCODE_SW = "T_PMS_XMINFO_XMCODE_SW";
//
//     /**
//      * 生产计划管理 -> 生产计划编码,编码规则:年份4+计划类型+0001
//      */
//     public static final String T_PMS_SC_JH_SC_JHCODE = "T_PMS_SC_JH_SC_JHCODE";
//     public static final String A_PMS_SC_JH_JHLX = "A_PMS_SC_JH_JHLX";
//
//     /**
//      * 合同台账登记 -> 合同编号,编码规则:年份4+0001
//      */
//     public static final String T_PMS_HTINFO_HTCODE = "T_PMS_HTINFO_HTCODE";
//
//     /**
//      * 问题管理 -> 流水码,编码规则:年份4+0001
//      */
//     public static final String T_PMS_GT_WTINFO_WT_LSM = "T_PMS_GT_WTINFO_WT_LSM";
//
//     /**
//      * 论文清单登记 -> 论文编码,编码规则:年份4+0001
//      */
//     public static final String T_PMS_CG_LWINFO_LWCODE = "T_PMS_CG_LWINFO_LWCODE";
//
//     /**
//      * 文件管理 -> 文件夹编码,编码规则:年份4+0001
//      */
//     public static final String T_QIS_FILEINFO_WJJBM = "T_QIS_FILEINFO_WJJBM";
//
//     /**
//      * 文件管理 -> 文档编码,编码规则:年份4+0001
//      */
//     public static final String T_QIS_FILEINFO_WDBM = "T_QIS_FILEINFO_WDBM";
//
//     /**
//      *内审管理 -> 编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_NSGL_NSBGCODE = "T_QIS_NSGL_NSBGCODE";
//
//     /**
//      * 不符合项与持续改进 -> 编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_BFHX_BFHXCODE = "T_QIS_BFHX_BFHXCODE";
//
//     /**
//      * 纠正措施处理 -> 编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_JZCSCL_JZCSCODE = "T_QIS_JZCSCL_JZCSCODE";
//
//     /**
//      * 日常专项监督 -> 编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_RCZXJD_CODE = "T_QIS_RCZXJD_CODE";
//
//     /**
//      * 不合格品管理 -> 不合格品处理单编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_BHGP_CODE = "T_QIS_BHGP_CODE";
//
//     /**
//      * 质量异常管理 -> 异常编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_ZLYC_YC_CODE = "T_QIS_ZLYC_YC_CODE";
//
//     /**
//      * 质量问题归零管理 -> 问题编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_ZLWT_WT_CODE = "T_QIS_ZLWT_WT_CODE";
//
//     /**
//      * 质量事故调查处理 -> 事故编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_ZLSG_SG_CODE = "T_QIS_ZLSG_SG_CODE";
//
//     /**
//      * 安全论证申报 -> 论证编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_AQLZSB_LZ_CODE = "T_QIS_AQLZSB_LZ_CODE";
//
//     /**
//      * 质量信得过班组 -> 班组编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_XDGBZ_BZ_CODE = "T_QIS_XDGBZ_BZ_CODE";
//
//     /**
//      * 隐患管理 -> 隐患编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_YHGL_YH_CODE = "T_QIS_YHGL_YH_CODE";
//
//     /**
//      * 应急预案台账 -> 演练编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_YJYA_YJYA_CODE = "T_QIS_YJYA_YJYA_CODE";
//
//     /**
//      * QC小组活动汇总 -> 小组编号,编码规则:年份4+0001
//      */
//     public static final String T_QIS_QCXZHD_QC_CODE = "T_QIS_QCXZHD_QC_CODE";
//
//     /**
//      * 风险清单登记 -> 风险编码,编码规则:年份4+0001
//      */
//     public static final String T_PMS_FXQD_FXCODE = "T_PMS_FXQD_FXCODE";
//
//     /**
//      * 安全技术说明书 -> 编码,编码规则:年份4+0001
//      */
//     public static final String T_QIS_WHP_SMS_SMS_CODE = "T_QIS_WHP_SMS_SMS_CODE";
//
//     /**
//      * 计划管理 -> 计划编码,编码规则:年份4+0001
//      */
//     public static final String T_QIS_JHGL_JH_CODE = "T_QIS_JHGL_JH_CODE";
//
//     /**
//      * 顾客满意度 -> 调查表编码,编码规则:年份4+0001
//      */
//     public static final String T_QIS_GKMYD_DCB_CODE = "T_QIS_GKMYD_DCB_CODE";
//
// }
let codeConfig ={
    // 协同文件  编码规则:年份4+00001
    FJ: {
        code: 'T_XT_FJ_FILECODE'
    },
    // 项目  编码规则:年份4+项目类别+0001
    XM: {
        code: "T_PMS_XMINFO_SNXMBH",
        extra: 'A_PMS_XMINFO_XMLB',
    },
    // wbs 任务  编码规则:年份4+0001
    wbs: {
        code: 'T_PMS_WBS_TYPELATE_WBS_TYPELATE_CODE'
    },
    // 统筹计划  年份4+计划类型+0001
    tcjh: {
        code: "T_PMS_JHGL_WJHCODE",
        extra: "A_PMS_JHGL_JHLX"
    },
    // 生产项目库 -> 生产项目编码,编码规则:年份4+0001
    scXm: {
        code: "T_PMS_XMINFO_SCXMBH"
    },
    // 生产项目库 -> 外部项目编码,编码规则:年份4+0001
    scXmWb: {
        code: "T_PMS_XMINFO_XMCODE_SW"
    },
    // 生产计划管理 -> 生产计划编码,编码规则:年份4+计划类型+0001
    scjh: {
        code: "T_PMS_SC_JH_SC_JHCODE",
        extra: "A_PMS_SC_JH_JHLX"
    },
    // 合同台账登记 -> 合同编号,编码规则:年份4+0001
    ht: {
        code: "T_PMS_HTINFO_HTCODE"
    },
    // 问题管理 -> 流水码,编码规则:年份4+0001
    wt: {
        code: "T_PMS_GT_WTINFO_WT_LSM"
    },
    // 论文清单登记 -> 论文编码,编码规则:年份4+0001
    lwqd: {
        code: "T_PMS_CG_LWINFO_LWCODE"
    },
    // 文件管理 -> 文件夹编码,编码规则:年份4+0001
    wjglWjj: {
        code: "T_QIS_FILEINFO_WJJBM",
    },
    // 文件管理 -> 文档编码,编码规则:年份4+0001
    wjglWd: {
        code: "T_QIS_FILEINFO_WDBM"
    },
    // 内审管理 -> 编号,编码规则:年份4+0001
    nsgl: {
        code: "T_QIS_NSGL_NSBGCODE"
    },
    // 不符合项与持续改进 -> 编号,编码规则:年份4+0001
    bfhx: {
        code: "T_QIS_BFHX_BFHXCODE",
    },
    // 纠正措施处理 -> 编号,编码规则:年份4+0001
    jzcs: {
        code: "T_QIS_JZCSCL_JZCSCODE"
    },
    // 日常专项监督 -> 编号,编码规则:年份4+0001
    rcjd: {
        code: "T_QIS_RCZXJD_CODE"
    },
    // 不合格品管理 -> 不合格品处理单编号,编码规则:年份4+0001
    bhgp: {
        code: "T_QIS_BHGP_CODE"
    },
    // 质量异常管理 -> 异常编号,编码规则:年份4+0001
    zlyc: {
        code: "T_QIS_ZLYC_YC_CODE"
    },
    // 质量问题归零管理 -> 问题编号,编码规则:年份4+0001
    zlgl: {
        code: "T_QIS_ZLWT_WT_CODE"
    },
    // 质量事故调查处理 -> 事故编号,编码规则:年份4+0001
    zlsgdc: {
        code: "T_QIS_ZLSG_SG_CODE",
    },
    // 安全论证申报 -> 论证编号,编码规则:年份4+0001
    aqlzsb: {
        code: "T_QIS_AQLZSB_LZ_CODE"
    },
    // 质量信得过班组 -> 班组编号,编码规则:年份4+0001
    zlxdgbz: {
        code: "T_QIS_XDGBZ_BZ_CODE"
    },
    // 隐患管理 -> 隐患编号,编码规则:年份4+0001
    yhgl: {
        code: "T_QIS_YHGL_YH_CODE"
    },
    // 应急预案台账 -> 演练编号,编码规则:年份4+0001
    yjyatz: {
        code: "T_QIS_YJYA_YJYA_CODE"
    },
    // QC小组活动汇总 -> 小组编号,编码规则:年份4+0001
    QCxz: {
        code: "T_QIS_QCXZHD_QC_CODE"
    },
    // 风险清单登记 -> 风险编码,编码规则:年份4+0001
    fxqd: {
        code: "T_PMS_FXQD_FXCODE"
    },
    // 安全技术说明书 -> 编码,编码规则:年份4+0001
    aqjssms: {
        code: "T_QIS_WHP_SMS_SMS_CODE",
    },
    // 计划管理 -> 计划编码,编码规则:年份4+0001
    jhgl: {
        code: "T_QIS_JHGL_JH_CODE"
    },
    // 顾客满意度 -> 调查表编码,编码规则:年份4+0001
    gkmyd: {
        code: "T_QIS_GKMYD_DCB_CODE"
    }
}
export default codeConfig;
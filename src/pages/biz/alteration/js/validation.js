import {isEmpty} from "./commValidator";

export default {
    data() {
        return {
            rules: {
                alterationType: {required: true, message: '请选择变更类型', trigger: 'change'},
                gmtApply: {required: true, message: '请选择日期'},
                alterationSource: {required: true, message: '请选择变更来源', trigger: 'change'},
                applyCont: {required: true, validator: isEmpty, trigger: 'change'},
                planCont: {required: false, validator: isEmpty, trigger: 'change'},
                gmtEnd: {required: true, message: '请选择实施结束时间',trigger: 'blur'},
                area: {required: true, message: '请选择区域', trigger: 'blur'},
                gmtStart: {required: true, message: '请选择实施开始时间',trigger: 'blur'},
                asseOpin: {required: false, validator: isEmpty, trigger: 'change'}
            },
            editTableRules: {
                gmtComplete: {required: true, message: '请选择完成时间'},
                setting: {required: true, message: '请输入相关配置信息'},
                content: {required: true, message: '请输入实施内容'},
                isAuto: {required: true, message: '请选择是否自动化'},
                devName: {required: true, message: '请输入变更对象'}
            },
            otherRules: {
                emerdegr: {required: true, message: '请选择紧急程度', trigger: 'change'},
                isStrategy: {required: true, message: '请选择策略变更', trigger: 'change'},
                gmtEsticomp: {type: 'date', required: true, message: '请选择预计完成时间', trigger: 'change'}
            },
        };
    },
    methods: {
        gmtEndValidate(rule, value, callback) {
            if (value < this.executeData.gmtStart) {
                callback(new Error('实施结束时间不能早于实施开始时间'));
            } else if (!value) {
                callback(new Error('请输入实施结束时间'));
            }
        }
    }
}

//属性规则对照
/**
 * hidden 是否隐藏
 * disabled 是否禁用
 * required 是否必填 hidden=true,则必须将required设置为false
 * @type {{}}
 */
export const PROPERTY_LAW_TEMPLATE = {
    10: {//应用系统
        "commDTO.useFor": {hidden: true, required: false},//用途
        "commDTO.controllable": {hidden: true, required: false},//自主可控
        1001: null
    },
    11: {//服务器与计算机
        "extendData.systemLevel": {hidden: true, required: false},//系统密级
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.osVersion': {required: false},//系统版本
        'commDTO.setupDate': {required: false}//系统安装日期
    },
    12: {//网络设备
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
        'commDTO.qualityDate': {required: false},//质保期
    },
    13: {//存储与备份设备
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
        'commDTO.qualityDate': {required: false},//质保期
    },
    14: {//安全保密产品
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
        'commDTO.qualityDate': {required: false},//质保期
    },
    15: {//存储介质
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
    },
    16: {//外部设施与办公自动化设备
        "commDTO.controllable": {hidden: true, required: false},//自主可控
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.devSn': {required: false},//设备编号
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
    },
    17: {//声像设备
        "commDTO.controllable": {hidden: true, required: false},//自主可控
        "extendData.systemLevel": {hidden: true, required: false},
        'commDTO.devSn': {required: false},//设备编号
        'commDTO.model': {required: false},//设备型号
        'commDTO.birthSn': {required: false},//出厂编号
        'commDTO.birthDate': {required: false},//出厂日期
        'commDTO.buyDate': {required: false},//购置时间
        'commDTO.masterIp': {required: false},//IP地址
    }
};

let resetFormItem = function (category, childType) {
    let labels = document.getElementsByTagName("label");
    for (let i in labels) {
        if (!!labels[i].attributes) {
            let name = labels[i].attributes[0].value;
            //if(name == PROPERTY_LAW_TEMPLATE){}
            let curLaw = Object.assign({}, PROPERTY_LAW_TEMPLATE[category] || {}, (PROPERTY_LAW_TEMPLATE[category] && PROPERTY_LAW_TEMPLATE[category][childType]) ? PROPERTY_LAW_TEMPLATE[category][childType] : {});
            if (!!curLaw[name]) {
                labels[i].parentElement.hidden = !!curLaw[name].hidden;
            }
        }
    }
    // labels.forEach(label=>{
    //    debugger;
    // });
};

/**
 * 重新设置表单规则
 * @param rule 表单规则
 * @param category 设备大类
 * @param childType 设备小类
 */
export const resetRule = function (rule, category, childType) {
    // if (PROPERTY_LAW_TEMPLATE[category]) {
    //     rule = Object.assign(rule, PROPERTY_LAW_TEMPLATE[category]);
    // }
    // if (PROPERTY_LAW_TEMPLATE[category] && PROPERTY_LAW_TEMPLATE[category][childType]) {
    //     rule = Object.assign(rule, PROPERTY_LAW_TEMPLATE[category][childType]);
    // }
    rule = Object.assign(rule, PROPERTY_LAW_TEMPLATE[category] || {}, (PROPERTY_LAW_TEMPLATE[category] && PROPERTY_LAW_TEMPLATE[category][childType]) ? PROPERTY_LAW_TEMPLATE[category][childType] : {});
    resetFormItem(category, childType);
};

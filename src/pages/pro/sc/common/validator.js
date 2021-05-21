export function specialCharacter(rule,value,callback) {
    const reg = /[\\$@#%&\\*`~!\\^\\(\\)\\[\\}<>《》_——：；“”‘’'":;！\\{【】￥……，。||、、.,/\]?？+=\-]/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        let val = value.replace(reg,'');
        if(val == value){
            callback();
        }else{
            callback(new Error('不可输入特殊字符'));
        }
    }
}
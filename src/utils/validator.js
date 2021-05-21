// 验证数字是正数
let validatePassNumber = (rule, value, callback) => {
  if (value<0) {
    callback(new Error('请输入正数！'));
  } else {
    callback();
  }
};
let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;  // 电话正则
let telReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 固定电话正则
// 验证输入格式是手机号
let validatePassTel = (rule, value, callback) => {
  let resPhone = phoneReg.test(value);
  let resTel = telReg.test(value);
  if (value&&!resPhone&&!resTel) {
    callback(new Error('联系电话输入格式错误！'));
  } else {
    callback();
  }
};
export {
  validatePassNumber,
  validatePassTel
}
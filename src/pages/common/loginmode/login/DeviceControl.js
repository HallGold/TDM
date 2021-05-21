/**
 * 设备管理，负责不同设备的统一使用，一些共性的数据在此进行处理
 *
 * @author zhangcc\huangff
 *
 */

import {Imp_SKF} from "./Device_SKF";

// 多个容器分隔符号(可自行定义，默认#)
export var CONTAINER_INFO_SEPARATOR = "#"

// 设备类型 {
export var DEVICE_SKF = 2;
export var DEVICE_CSP = 1;
// }


// 根据设备类型获取具体实现接口
export function getImp(deviceType) {
    // skf方式：用于在谷歌、火狐等浏览器管理设备介质
    if (deviceType == DEVICE_SKF) {
        return new Imp_SKF();
    } else {
        throw new Error('无效证书设备类型');
    }
}

export function Device(deviceType) {
    // 获取对象实现
    this.deviceImp = getImp(deviceType);
    this.deviceImp.init();
}

/**
 *
 * 枚举设备
 * @return 0 - 无设备
 *         deviceList 设备数组,
 *         text - 设备名称
 *         value - 设备下标
 */
Device.prototype.enumDevices = function () {
    return this.deviceImp.enumDevice();
};
/**
 * 枚举设备的应用
 * @return appList - text - 应用名
 *                   value - 应用下标
 */
Device.prototype.enumAppList = function () {
    return this.deviceImp.enumAppList();
};

/**
 * 设置选中的设备
 * @param selectedDevice 选中的设备option;
 *                       text 设备名称
 *                       value 设备下标
 */
Device.prototype.setDevice = function (selectedDevice) {
    this.deviceImp.setDevice(selectedDevice);
};

/**
 * 获取设备总数
 *
 * @return 设备总数
 */
Device.prototype.getDevCount = function (selectedDevice) {
    return this.deviceImp.getDevCount();
};

/**
 * 设置应用
 * @param {*} appIndex 应用下标
 */
Device.prototype.setAppUri = function (appIndex) {
    this.deviceImp.setAppUri(setAppUri);
};

/**
 * 获取应用uri
 * @param {*} appIndex 应用下标
 */
Device.prototype.getAppUri = function (appIndex) {
    return this.deviceImp.getAppUri(appIndex);
};


/**
 * 获取指定设备的应用数目
 *
 * @return 应用总数，无应用返回0
 */
Device.prototype.getAppCount = function () {
    return this.deviceImp.getAppCount();
}

/**
 * 设置应用
 * @param {*} containerURI 容器URI
 */
Device.prototype.setContainer = function (containerURI) {
    this.deviceImp.container_URI = containerURI;
};

/**
 * 获取设备序列号
 *
 */
Device.prototype.getDevSerialNumber = function () {
    return this.deviceImp.getDevSerialNumber();
};

/**
 * 登陆
 *
 * @param appIndex
 *            应用下标
 * @param bsPasswd
 *            用户PING码
 *
 * @return true - 成功 ; false - 失败
 */
Device.prototype.login = function (appIndex, bsPasswd) {
    if (this.deviceImp.app_URI == null) {
        this.deviceImp.setAppUri(appIndex);
    }
    try {
        this.deviceImp.login(bsPasswd);
    } catch (e) {
        throw new Error("登录设备失败，可能是PIN码错误！");
    }
};

/**
 * 获取设备中所有的证书信息：一定返回的数据为容器uri，其他证书数据需要通过参数指定
 *
 * @param cert_flag_bits 获取证书内容的类型，包括证书摘要、证书序列号。
 *            其中此参数使用8位二进制区分，组个使用时，按照高低位依次连接，如下：
 *            00000001:证书摘要，摘要算法sha1
 *            00000010:证书摘要，摘要算法sha256
 *            00000100:10进制序列号
 *            00001000:16进制序列号
 *            将上述转为十进制传入即可。parseInt("00000001", 2);
 * @param separator
 *            多个容器之间的分隔符号，为空则使用默认值"###"
 *
 * @return 证书信息字符串。
 *        证书信息之间默认使用'|'分割，各个证书之间使用外部传入的参数分割。形如
 *        sha1(1)|sha256(1)|snDec(1)|snHex(1)#sha1(2)|sha256(2)|snDec(2)|snHex(2)
 */
Device.prototype.getAllCerts = function (cert_flag_bits, separator) {
    if (cert_flag_bits == null || cert_flag_bits == "") {
        showError("获取证书信息的参数错误！");
    }

    if (separator == null || separator == "") {
        separator = CONTAINER_INFO_SEPARATOR;
    }

    return this.deviceImp.getAllCerts(cert_flag_bits, separator);
};

/**
 * 获取设备中所有的证书序列号（十进制）
 *
 * @param beHex    获取的序列号是否为十六进制
 *
 * @return 容器中证书序列号数组
 */
Device.prototype.enumSNList = function (beHex) {

    var snflag = parseInt("00000100", 2); // 获取十进制系列号
    if (beHex) {
        snflag = parseInt("00001000", 2); // 获取十六进制系列号
    }
    return this.deviceImp.enumSNList(snflag, CONTAINER_INFO_SEPARATOR);
};

/**
 * 通过序列号获取容器URI
 *
 * @param bsCertSN 证书序列号
 * @param beHex 序列号是否为十六进制
 *
 * @return 证书容器uri
 */
Device.prototype.getContainerUriByCertSN = function (bsCertSN, beHex) {

    return this.deviceImp.getContainerUriByCertSN(bsCertSN, beHex);
};

/**
 * 通过序列号获取证书URI
 *
 * @param bsCertSN 证书序列号
 * @param beHex 序列号是否为十六进制
 *
 * @return 证书容器uri
 */
Device.prototype.getCertUriByCertSN = function (bsCertSN, beHex) {

    return this.deviceImp.getCertUriByCertSN(bsCertSN, beHex);
};

/**
 * 通过序列号获取证书内容
 *
 * @param bsCertSN
 *            证书序列号
 * @param certType
 *            1：签名证书
 *            2：加密证书
 * @param beHex
 *            序列号是否为十六进制
 *
 * @return base64编码证书,若未找到，反馈空字符串
 */
Device.prototype.getCertValueBySn = function (bsCertSN, certType, beHex) {

    return this.deviceImp.getCertValueBySn(bsCertSN, certType);
};

Device.prototype.getDuplicateCertValueBySn = function (bsCertSN, certType, beHex) {

    return this.deviceImp.getDuplicateCertValueBySn(bsCertSN, certType, beHex);
};

/**
 * 通过序列号获取容器名称
 *
 * @param bsCertSN 证书序列号
 * @param beHex 序列号是否为十六进制
 *
 * @return 证书容器名称
 */
Device.prototype.getContainerNameByCertSN = function (bsCertSN, beHex) {

    var containerUri = this.getContainerUriByCertSN(bsCertSN, beHex);
    return containerUri.substring(containerUri.lastIndexOf("|"), containerUri.length);
};

/**
 * 检查指定序列号证书是否存在介质中
 *
 * @param sn    待检查的证书序列号
 * @param beHex    是否为十六进制
 *
 * @return true：存在；false：不存在
 */
Device.prototype.checkCertExists = function (bsCertSN, beHex) {
    return this.deviceImp.checkCertExists(bsCertSN, beHex);
};

/**
 * 登陆
 *
 * @param appuri
 *            应用uri
 * @param bsPasswd
 *            用户PING码
 *
 * @return true - 成功 ; false - 失败
 */
Device.prototype.login2 = function (appuri, bsPasswd) {
    return this.deviceImp.login2(appuri, bsPasswd);
};

/**
 * @return 容器URI
 */
Device.prototype.getDeviceURI = function () {
    return this.deviceImp.device_URI;
};

/**
 * @return 容器URI
 */
Device.prototype.getContainer = function () {
    return this.deviceImp.container_URI;
};

/**
 * 删除容器及下属证书、密钥
 *
 * @param    containerURI 容器uri
 */
Device.prototype.deleteContainer = function (containerURI) {
    var appUri = containerURI.substring(0, containerURI.lastIndexOf("|"));
    var containerName = containerURI.substring(containerURI.lastIndexOf("|") + 1);
    this.deviceImp.deleteContainer(appUri, containerName);
};


/**
 * 生成签发请求
 * @param dwKeyType 密钥类型:1 - RSA ; 0 - ECC
 * @param dwKeySpec 证书类型:1 - CONTIANER_SIGN_TYPE ; 2 - CONTIANER_ENC_TYPE
 * @param dwKeyLen  密钥长度 只对RSA有效
 * @param certDN 证书DN项
 * @param bsSplit SKF方式为分隔符 一般为',' ; CSP方式为选中的设备
 */

Device.prototype.createRequset = function (dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit) {
    return this.deviceImp.genCertReq(dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit);
};

/**
 * 创建容器
 * @param {*} appIndex 应用下标
 * @param {*} containerName 容器名
 */
Device.prototype.createContainer = function (appIndex, containerName) {
    if (appIndex === '' || appIndex === null) {
        // 默认给1
        appIndex = '1';
    }
    if (this.deviceImp.app_URI == null) {
        this.deviceImp.setAppUri(appIndex);
    }
    this.deviceImp.createContainer(containerName);
};

/**
 * 导入证书
 */
Device.prototype.doInstall = function (lraInfo, sigCert, containerURI) {
    return this.deviceImp.doInstall(lraInfo, sigCert, containerURI);
};

/**
 * P7签名
 *
 * @param certSn
 *                证书序列号（十进制）
 * @param bsSrcData
 *                要签名的数据原文
 * @param includeSrcData
 *                签名数据中是否包含原数据(1:包含原数据，0:不包含原数据)
 * @param pinCode
 *                管理员pin码
 * @return  pbsSignBase64
 *                base64格式的p7签名数据
 */
Device.prototype.doSignP7ByCertSN = function (certSn, bsSrcData, includeSrcData, pinCode) {
    return this.deviceImp.signP7ByCertSN(certSn, bsSrcData, includeSrcData, pinCode);
};

/**
 * 文本签名
 *
 * @param certSn
 *                证书序列号（十进制）
 * @param dataBase64
 *                要签名的数据原文base编码
 * @param pinCode
 *                ukey介质设备pin码
 * @param beHex
 *                证书序列号是否为十六进制
 * @return  成功返回文本签名数据，失败返回空
 *
 */
Device.prototype.signData = function (certSn, dataBase64, pinCode, beHex) {
    return this.deviceImp.signData(certSn, dataBase64, pinCode, beHex);
};

/**
 * 锁定设备
 * TODO
 */
Device.prototype.lockDevice = function () {
// TODO
};

/**
 * 解锁设备
 * /TODO
 */
Device.prototype.unLockDevice = function () {
// TODO
};

export default Device;

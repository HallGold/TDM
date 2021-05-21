/**
 * �豸��������ͬ�豸��ͳһʹ�ã�һЩ���Ե������ڴ˽��д���
 *
 * @author zhangcc\huangff
 *
 */

import {Imp_SKF} from "./Device_SKF";

// ��������ָ�����(�����ж��壬Ĭ��#)
export var CONTAINER_INFO_SEPARATOR = "#"

// �豸���� {
export var DEVICE_SKF = 2;
export var DEVICE_CSP = 1;
// }


// �����豸���ͻ�ȡ����ʵ�ֽӿ�
export function getImp(deviceType) {
    // skf��ʽ�������ڹȸ衢���������������豸����
    if (deviceType == DEVICE_SKF) {
        return new Imp_SKF();
    } else {
        throw new Error('��Ч֤���豸����');
    }
}

export function Device(deviceType) {
    // ��ȡ����ʵ��
    this.deviceImp = getImp(deviceType);
    this.deviceImp.init();
}

/**
 *
 * ö���豸
 * @return 0 - ���豸
 *         deviceList �豸����,
 *         text - �豸����
 *         value - �豸�±�
 */
Device.prototype.enumDevices = function () {
    return this.deviceImp.enumDevice();
};
/**
 * ö���豸��Ӧ��
 * @return appList - text - Ӧ����
 *                   value - Ӧ���±�
 */
Device.prototype.enumAppList = function () {
    return this.deviceImp.enumAppList();
};

/**
 * ����ѡ�е��豸
 * @param selectedDevice ѡ�е��豸option;
 *                       text �豸����
 *                       value �豸�±�
 */
Device.prototype.setDevice = function (selectedDevice) {
    this.deviceImp.setDevice(selectedDevice);
};

/**
 * ��ȡ�豸����
 *
 * @return �豸����
 */
Device.prototype.getDevCount = function (selectedDevice) {
    return this.deviceImp.getDevCount();
};

/**
 * ����Ӧ��
 * @param {*} appIndex Ӧ���±�
 */
Device.prototype.setAppUri = function (appIndex) {
    this.deviceImp.setAppUri(setAppUri);
};

/**
 * ��ȡӦ��uri
 * @param {*} appIndex Ӧ���±�
 */
Device.prototype.getAppUri = function (appIndex) {
    return this.deviceImp.getAppUri(appIndex);
};


/**
 * ��ȡָ���豸��Ӧ����Ŀ
 *
 * @return Ӧ����������Ӧ�÷���0
 */
Device.prototype.getAppCount = function () {
    return this.deviceImp.getAppCount();
}

/**
 * ����Ӧ��
 * @param {*} containerURI ����URI
 */
Device.prototype.setContainer = function (containerURI) {
    this.deviceImp.container_URI = containerURI;
};

/**
 * ��ȡ�豸���к�
 *
 */
Device.prototype.getDevSerialNumber = function () {
    return this.deviceImp.getDevSerialNumber();
};

/**
 * ��½
 *
 * @param appIndex
 *            Ӧ���±�
 * @param bsPasswd
 *            �û�PING��
 *
 * @return true - �ɹ� ; false - ʧ��
 */
Device.prototype.login = function (appIndex, bsPasswd) {
    if (this.deviceImp.app_URI == null) {
        this.deviceImp.setAppUri(appIndex);
    }
    try {
        this.deviceImp.login(bsPasswd);
    } catch (e) {
        throw new Error("��¼�豸ʧ�ܣ�������PIN�����");
    }
};

/**
 * ��ȡ�豸�����е�֤����Ϣ��һ�����ص�����Ϊ����uri������֤��������Ҫͨ������ָ��
 *
 * @param cert_flag_bits ��ȡ֤�����ݵ����ͣ�����֤��ժҪ��֤�����кš�
 *            ���д˲���ʹ��8λ���������֣����ʹ��ʱ�����ոߵ�λ�������ӣ����£�
 *            00000001:֤��ժҪ��ժҪ�㷨sha1
 *            00000010:֤��ժҪ��ժҪ�㷨sha256
 *            00000100:10�������к�
 *            00001000:16�������к�
 *            ������תΪʮ���ƴ��뼴�ɡ�parseInt("00000001", 2);
 * @param separator
 *            �������֮��ķָ����ţ�Ϊ����ʹ��Ĭ��ֵ"###"
 *
 * @return ֤����Ϣ�ַ�����
 *        ֤����Ϣ֮��Ĭ��ʹ��'|'�ָ����֤��֮��ʹ���ⲿ����Ĳ����ָ����
 *        sha1(1)|sha256(1)|snDec(1)|snHex(1)#sha1(2)|sha256(2)|snDec(2)|snHex(2)
 */
Device.prototype.getAllCerts = function (cert_flag_bits, separator) {
    if (cert_flag_bits == null || cert_flag_bits == "") {
        showError("��ȡ֤����Ϣ�Ĳ�������");
    }

    if (separator == null || separator == "") {
        separator = CONTAINER_INFO_SEPARATOR;
    }

    return this.deviceImp.getAllCerts(cert_flag_bits, separator);
};

/**
 * ��ȡ�豸�����е�֤�����кţ�ʮ���ƣ�
 *
 * @param beHex    ��ȡ�����к��Ƿ�Ϊʮ������
 *
 * @return ������֤�����к�����
 */
Device.prototype.enumSNList = function (beHex) {

    var snflag = parseInt("00000100", 2); // ��ȡʮ����ϵ�к�
    if (beHex) {
        snflag = parseInt("00001000", 2); // ��ȡʮ������ϵ�к�
    }
    return this.deviceImp.enumSNList(snflag, CONTAINER_INFO_SEPARATOR);
};

/**
 * ͨ�����кŻ�ȡ����URI
 *
 * @param bsCertSN ֤�����к�
 * @param beHex ���к��Ƿ�Ϊʮ������
 *
 * @return ֤������uri
 */
Device.prototype.getContainerUriByCertSN = function (bsCertSN, beHex) {

    return this.deviceImp.getContainerUriByCertSN(bsCertSN, beHex);
};

/**
 * ͨ�����кŻ�ȡ֤��URI
 *
 * @param bsCertSN ֤�����к�
 * @param beHex ���к��Ƿ�Ϊʮ������
 *
 * @return ֤������uri
 */
Device.prototype.getCertUriByCertSN = function (bsCertSN, beHex) {

    return this.deviceImp.getCertUriByCertSN(bsCertSN, beHex);
};

/**
 * ͨ�����кŻ�ȡ֤������
 *
 * @param bsCertSN
 *            ֤�����к�
 * @param certType
 *            1��ǩ��֤��
 *            2������֤��
 * @param beHex
 *            ���к��Ƿ�Ϊʮ������
 *
 * @return base64����֤��,��δ�ҵ����������ַ���
 */
Device.prototype.getCertValueBySn = function (bsCertSN, certType, beHex) {

    return this.deviceImp.getCertValueBySn(bsCertSN, certType);
};

Device.prototype.getDuplicateCertValueBySn = function (bsCertSN, certType, beHex) {

    return this.deviceImp.getDuplicateCertValueBySn(bsCertSN, certType, beHex);
};

/**
 * ͨ�����кŻ�ȡ��������
 *
 * @param bsCertSN ֤�����к�
 * @param beHex ���к��Ƿ�Ϊʮ������
 *
 * @return ֤����������
 */
Device.prototype.getContainerNameByCertSN = function (bsCertSN, beHex) {

    var containerUri = this.getContainerUriByCertSN(bsCertSN, beHex);
    return containerUri.substring(containerUri.lastIndexOf("|"), containerUri.length);
};

/**
 * ���ָ�����к�֤���Ƿ���ڽ�����
 *
 * @param sn    ������֤�����к�
 * @param beHex    �Ƿ�Ϊʮ������
 *
 * @return true�����ڣ�false��������
 */
Device.prototype.checkCertExists = function (bsCertSN, beHex) {
    return this.deviceImp.checkCertExists(bsCertSN, beHex);
};

/**
 * ��½
 *
 * @param appuri
 *            Ӧ��uri
 * @param bsPasswd
 *            �û�PING��
 *
 * @return true - �ɹ� ; false - ʧ��
 */
Device.prototype.login2 = function (appuri, bsPasswd) {
    return this.deviceImp.login2(appuri, bsPasswd);
};

/**
 * @return ����URI
 */
Device.prototype.getDeviceURI = function () {
    return this.deviceImp.device_URI;
};

/**
 * @return ����URI
 */
Device.prototype.getContainer = function () {
    return this.deviceImp.container_URI;
};

/**
 * ɾ������������֤�顢��Կ
 *
 * @param    containerURI ����uri
 */
Device.prototype.deleteContainer = function (containerURI) {
    var appUri = containerURI.substring(0, containerURI.lastIndexOf("|"));
    var containerName = containerURI.substring(containerURI.lastIndexOf("|") + 1);
    this.deviceImp.deleteContainer(appUri, containerName);
};


/**
 * ����ǩ������
 * @param dwKeyType ��Կ����:1 - RSA ; 0 - ECC
 * @param dwKeySpec ֤������:1 - CONTIANER_SIGN_TYPE ; 2 - CONTIANER_ENC_TYPE
 * @param dwKeyLen  ��Կ���� ֻ��RSA��Ч
 * @param certDN ֤��DN��
 * @param bsSplit SKF��ʽΪ�ָ��� һ��Ϊ',' ; CSP��ʽΪѡ�е��豸
 */

Device.prototype.createRequset = function (dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit) {
    return this.deviceImp.genCertReq(dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit);
};

/**
 * ��������
 * @param {*} appIndex Ӧ���±�
 * @param {*} containerName ������
 */
Device.prototype.createContainer = function (appIndex, containerName) {
    if (appIndex === '' || appIndex === null) {
        // Ĭ�ϸ�1
        appIndex = '1';
    }
    if (this.deviceImp.app_URI == null) {
        this.deviceImp.setAppUri(appIndex);
    }
    this.deviceImp.createContainer(containerName);
};

/**
 * ����֤��
 */
Device.prototype.doInstall = function (lraInfo, sigCert, containerURI) {
    return this.deviceImp.doInstall(lraInfo, sigCert, containerURI);
};

/**
 * P7ǩ��
 *
 * @param certSn
 *                ֤�����кţ�ʮ���ƣ�
 * @param bsSrcData
 *                Ҫǩ��������ԭ��
 * @param includeSrcData
 *                ǩ���������Ƿ����ԭ����(1:����ԭ���ݣ�0:������ԭ����)
 * @param pinCode
 *                ����Աpin��
 * @return  pbsSignBase64
 *                base64��ʽ��p7ǩ������
 */
Device.prototype.doSignP7ByCertSN = function (certSn, bsSrcData, includeSrcData, pinCode) {
    return this.deviceImp.signP7ByCertSN(certSn, bsSrcData, includeSrcData, pinCode);
};

/**
 * �ı�ǩ��
 *
 * @param certSn
 *                ֤�����кţ�ʮ���ƣ�
 * @param dataBase64
 *                Ҫǩ��������ԭ��base����
 * @param pinCode
 *                ukey�����豸pin��
 * @param beHex
 *                ֤�����к��Ƿ�Ϊʮ������
 * @return  �ɹ������ı�ǩ�����ݣ�ʧ�ܷ��ؿ�
 *
 */
Device.prototype.signData = function (certSn, dataBase64, pinCode, beHex) {
    return this.deviceImp.signData(certSn, dataBase64, pinCode, beHex);
};

/**
 * �����豸
 * TODO
 */
Device.prototype.lockDevice = function () {
// TODO
};

/**
 * �����豸
 * /TODO
 */
Device.prototype.unLockDevice = function () {
// TODO
};

export default Device;

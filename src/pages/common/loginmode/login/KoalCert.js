/**
 * 外部业务逻辑数据处理，包含对外部页面内容和底层设备适配进行处理
 *
 * @author zhangcc
 */
var CONTIANER_SIGN_TYPE = 1; // 签名容器
var CONTIANER_ENC_TYPE = 2; // 加密容器
var RSAKeyType = 1; // RSA密钥
var ECCKeyType = 2; // SM2密钥
var DEVICE_NAME = ''; // 发证设备名称
var keyType = 0; //密钥类型(1:RSA 2:ECC)
var isExistsCheck = true; // 是否检查证书存在介质中
var DEVICE_TYPE = null; // 介质设备类型，csp或者skf
	
/**
 * 签发入口
 * @param theForm
 * @returns
 */
export function execapply3(theForm) {
    
	DEVICE_TYPE = DEVICE_SKF;
    getCertRequest(theForm);
}

/**
 * 生成签名证书请求
 * 
 *	operationId 操作类型
 *		certsign 签发;
 *		certrenew 更新;
 *		certpostpone 延期;
 *		certrecover恢复;
 *		keyupdate 密钥更新
 */
export function getCertRequest(theForm) {
    var operationId = getObj('value(operationId)').value;

    // 证书签发、更新、延期、恢复
    if ('certsign' != operationId 
    		&& 'certrenew' != operationId
    		&& 'certpostpone' != operationId 
    		&& 'certrecover' != operationId
    		&& 'keyupdate' != operationId) {
        showError('无法生成证书请求，原因: 无效的证书操作类型 \'' + operationId + '\'');
        return false;
    }
    if ('certpostpone' == operationId || 'certrenew' == operationId
        || 'keyupdate' == operationId) {
        // 证书延期、证书更新、密钥更新三种情况需要做检查
    	isExistsCheck = true;
        ;
    } else {
        // 其它情况不检查
        isExistsCheck = false;
    }
    
    var deviceList = theForm.IeTokenList;
    if (deviceList.length == 0) {
    	showError('不存在任何介质设备，无法生成证书请求。');
        return false;
    }

    var selectedDevice = deviceList.options[deviceList.selectedIndex];
    DEVICE_NAME = selectedDevice.text;
    
	if (deviceList.disabled && DEVICE_NAME.indexOf("不存在") != -1) {
		showError("不存在任何介质设备，无法生成证书请求!");
		return false;
	}
    
	// 设置请求及响应的类型
    var certType = getObj('value(KEY_FORMAT)').value;
    getObj('value(requestType)').value = 'PKCS10';
    if (certType.indexOf('RSA') != -1 && certType.indexOf('SM2') == -1) {
        // RSA发证
        keyType = RSAKeyType;
        getObj('value(responseType)').value = 'EnvelopedKeyPairData';
    } else if (certType.indexOf('RSA') == -1 
    		&& (certType.indexOf('SM2') != -1 || certType.indexOf('ECC') != -1)) {
        // SM2发证
        keyType = ECCKeyType;
        getObj('value(responseType)').value = 'OSCCA_ECC';
    }

    var device = new Device(DEVICE_TYPE);
    if (DEVICE_TYPE != DEVICE_CSP) {
    	device.setDevice(selectedDevice);
    }

    createRequest_SKF(device);
}


/**
 * SKF接口发证请求
 * 
 * @param device 
 * 		所选择的设备对象
 */
export function createRequest_SKF(device) {

    var appList = device.enumAppList();
    var operationId = getObj('value(operationId)').value;

    // 硬件设备发证
    if (appList == 0) {
        // 弹出创建应用层
        // deviceCreateLayer(device);
        throw new Error('设备里没有应用，请先创建应用');
    } else {
        // 弹出应用选择层/登录层
        deviceLayer(appList, device, operationId);
    }
}

/**
 * 
 * 创建应用回调函数，用于国密接口调用
 * 
 * @param device
 * 		所选择的设备对象
 * @returns
 */
export function CreatAppBack(device) {
    // 点击后页面状态
    document.body.style.cursor = 'wait';

    var objBtnMake = getObjWithoutAlter('btnMake');
    if (objBtnMake != null) {
        objBtnMake.disabled = true;
    }
    var appName = $('#container').val(); // 容器名称
    var adminPin = $('#AdminPIN').val(); // SOPIN
    var userPin = $('UserPIN').val();
    device.CreateAPP(appName, adminPin, 10, userPin, 10);
    device.AppURI = device.deviceURI + '|' + appName;
    device.login2(AppURI, userPin);
    var containerName = getObjWithoutAlter('value(CONTAINER_NAME)').val;
    if (containerName == '' || containerName == null) {
        containerName = getUUID(); // 自动创建容器名
    }
    device.ContainerURI = device.AppURI + '|' + containerName;

    return SignCertRequest(device);

}

/**
 * 签发应用回调函数，用于国密接口调用
 * 
 * @param device
 * 		所选择的设备对象
 * @param operationId
 * 		操作类型
 * @param containerName
 * 		容器名称1
 * @returns
 */
export function deviceLayerBack(device, operationId, containerName) {
    // 点击后页面状态
    document.body.style.cursor = "wait";
    
    /*var objBtnMake = getObjWithoutAlter("btnMake");
    if (objBtnMake != null) {
        objBtnMake.disabled = true;
    }*/
    
    try {
        var pin = $("#PIN").val();             // PIN码
        var appIndex = $("#appList").val();    // 所选择的应用下标
        device.login(appIndex, pin); 		   // 登录应用
        if (operationId == "certsign" || operationId == "keyupdate"
        		||  operationId == "certrecover") {
            if (operationId == "keyupdate") {
            	// 判断老证书是否存在介质中
            	var certSn = getObj("value(CERT_SN)").value;
            	var ret = device.checkCertExists(certSn, false)
            	if(!ret) {
            		showError("pkcs10请求生成失败，介质中未找到证书序列号为：'" + certSn + "' 的证书!");
            		return false;
            	}
            }
            device.createContainer(appIndex, containerName);
            SignCertRequest(device);
        } else {
            UpdateCertRequest(device);
        }

    } catch (e) {
    	showError("生成pkcs10请求失败: " + e.message);
		return false;
    }
}

/**
 * 证书签发请求（容器重新创建），针对下列操作类型：
 *		certsign 签发;
 *		keyupdate 密钥更新;
 *		certrecover 恢复;
 *
 * @param device
 * 		所选择的设备对象
 * @returns
 */
export function SignCertRequest(device) {
    var keyType = RSAKeyType;
    var keylen = '1024';
    getObj('value(ContainerURI)').value = device.getContainer();
    var certDN = getObj('value(CERT_SUBJECT_DN)').value;
    var certType = getObj('value(KEY_FORMAT)').value;
    if (certType.indexOf('ECC') != -1 || certType.indexOf('SM2') != -1) {
        keyType = ECCKeyType;
        keylen = '256';
    } else {
        if (DEVICE_NAME.indexOf('2048') != -1) {
        	keylen = '2048';
        }
    }
    var KeySpec = CONTIANER_SIGN_TYPE; 
    
    var request;
    try{
    	request = device.createRequset(keyType, KeySpec, keylen, certDN, ',');
		getObj('value(pkcs10Request)').value = request;
		
		// 页面都是隐藏式的提交按钮，统一在此处提交
		$('#submitButton').click();
    } catch (e) {
    	showError("生成pkcs10请求失败。错误信息: " + e);
    	return false;
    }
}

/**
 * 证书更新请求（容器使用原有容器）,支持下列操作类型
 *		certrenew 更新;
 *		certpostpone 延期;
 * 
 * @param device
 * 		所选择的设备对象
 * @returns
 */
export function UpdateCertRequest(device) {
    var oldSignSn = getObj('value(CERT_SN)').value;
    var certDN = getObj('value(CERT_SUBJECT_DN)').value;
    var operationId = getObj('value(operationId)').value;
    var certType = getObj('value(KEY_FORMAT)').value;
    var keySpec = CONTIANER_SIGN_TYPE; // 容器类型 1-签名容器 2-加密容器
    
    var keyLen = '1024';
    if (certType.indexOf('ECC') != -1 || certType.indexOf('SM2') != -1) {
        keyType = ECCKeyType;
        keyLen = '256';
    } else {
        if (DEVICE_NAME.indexOf('2048') != -1) {
        	keyLen = '2048';
        }
    }

    if (isExistsCheck) { // 判断是否证书在
        var certURI = device.getCertUriByCertSN(oldSignSn, false);
        if(certURI == "" || certURI == null) {
        	showError("生成pkcs10请求失败，用于更新的证书在介质中无法找到!");
        	return false;
        }
        device.setContainer(certURI);
    }
    
    getObj('value(ContainerURI)').value = device.getContainer();

    var request;
    try{
    	if (operationId != 'certpostpone') { // 延期不生成请求
    		request = device.createRequset(keyType, keySpec, keyLen, certDN, ',');
    		getObj('value(pkcs10Request)').value = request;
    	}
    	// 页面都是隐藏式的提交按钮，统一在此处提交
    	$('#submitButton').click();
    } catch (e) {
    	showError("生成pkcs10请求失败。错误信息: " + e);
    	return false;
    }
}

/**
 * 国密接口安装证书
 * 
 * @returns
 */
export function InstallCert2() {
    // 实例化国密接口设备
    var device = new Device(DEVICE_SKF);
    
    installCert(device);
}

/**
 * 安装证书具体函数实现
 * 
 * @param device
 * 		所选择的设备对象
 * @returns
 */
export function installCert(device) {

    var sigCert = getObj('value(CERT_1)').value;
    var encCert = getObj('value(CERT_2)').value;
    var operationId = getObj('value(operationId)').value;
    var lraInfo = getObj('value(lraInfo)').value;

	var operationName = null;
	if ("certsign" == operationId) {
		operationName = "证书签发";
	}
	else if ("certrenew" == operationId) {
		operationName = "证书更新";
	}
	else if ("certrecover" == operationId) {
		operationName = "密钥恢复";
	}
	else if ("certpostpone" == operationId) {
		operationName = "证书延期";
	}
	else if ("keyupdate" == operationId) {
		operationName = "密钥更新";
	}
	else {
		operationName = "未知操作";
	}

	var ContainerURI = getObj('value(ContainerURI)').value;	
	try {
        if ('certrenew' == operationId || 'certpostpone' == operationId) {
            // 主题更新或证书延期安装
            DoInstallUpdate(sigCert, encCert, ContainerURI, device);
        } else {
            DoInstall(lraInfo, sigCert, ContainerURI, device);
            
            try{
            	if("keyupdate" == operationId) { // 密钥更新成功后需要删除老容器
            		var oldSignSn = getObjWithoutAlter('value(OLD_SIGN_CERT_SN)') == null ? 
            				null : getObj('value(OLD_SIGN_CERT_SN)').value;
            		var containerUri = device.getContainerUriByCertSN(oldSignSn, false);
            		if(containerUri != null) {
            			device.deleteContainer(containerUri);
            		} else {
            			// showError("容器删除失败。介质中未找到序列号'" + oldSignSn + "'" + "所在的容器!");
            			// 删除失败没必要提示，不影响结果就先不管
            		}
            	}
            } catch(e) {
            	// ignore
            }
        }
		
        showError(operationName + "成功!");
        return true;
    } catch (e) {
    	showError(operationName + '失败! 错误原因:' + e.message);
        return false;
    }
}

/**
 * 主题更新和证书延期安装（加密证书密钥不更改的情况）
 * 
 * @param sigCert
 * 		签名证书
 * @param encCert
 * 		加密证书
 * @param containerURI
 * 		容器uri
 * @param device
 * 		所选择的设备对象
 * 		
 * @returns
 */
export function DoInstallUpdate(sigCert, encCert, containerURI, device) {
    // 先安装签名证书
	device.doInstall(null, sigCert, containerURI);
    if (encCert != null && encCert != '') {
    	// 安装加密证书
        device.doInstall(null, encCert, containerURI);
    }
}

/**
 * 证书安装
 * 
 * @param sigCert
 * 		签名证书
 * @param encCert
 * 		加密证书
 * @param containerURI
 * 		容器uri
 * @param device
 * 		所选择的设备对象
 * 		
 * @returns
 */
export function DoInstall(lraInfo, sigCert, containerURI, device) {
    device.doInstall(lraInfo, sigCert, containerURI);
}

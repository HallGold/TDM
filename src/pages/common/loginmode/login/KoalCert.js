/**
 * �ⲿҵ���߼����ݴ����������ⲿҳ�����ݺ͵ײ��豸������д���
 *
 * @author zhangcc
 */
var CONTIANER_SIGN_TYPE = 1; // ǩ������
var CONTIANER_ENC_TYPE = 2; // ��������
var RSAKeyType = 1; // RSA��Կ
var ECCKeyType = 2; // SM2��Կ
var DEVICE_NAME = ''; // ��֤�豸����
var keyType = 0; //��Կ����(1:RSA 2:ECC)
var isExistsCheck = true; // �Ƿ���֤����ڽ�����
var DEVICE_TYPE = null; // �����豸���ͣ�csp����skf
	
/**
 * ǩ�����
 * @param theForm
 * @returns
 */
export function execapply3(theForm) {
    
	DEVICE_TYPE = DEVICE_SKF;
    getCertRequest(theForm);
}

/**
 * ����ǩ��֤������
 * 
 *	operationId ��������
 *		certsign ǩ��;
 *		certrenew ����;
 *		certpostpone ����;
 *		certrecover�ָ�;
 *		keyupdate ��Կ����
 */
export function getCertRequest(theForm) {
    var operationId = getObj('value(operationId)').value;

    // ֤��ǩ�������¡����ڡ��ָ�
    if ('certsign' != operationId 
    		&& 'certrenew' != operationId
    		&& 'certpostpone' != operationId 
    		&& 'certrecover' != operationId
    		&& 'keyupdate' != operationId) {
        showError('�޷�����֤������ԭ��: ��Ч��֤��������� \'' + operationId + '\'');
        return false;
    }
    if ('certpostpone' == operationId || 'certrenew' == operationId
        || 'keyupdate' == operationId) {
        // ֤�����ڡ�֤����¡���Կ�������������Ҫ�����
    	isExistsCheck = true;
        ;
    } else {
        // ������������
        isExistsCheck = false;
    }
    
    var deviceList = theForm.IeTokenList;
    if (deviceList.length == 0) {
    	showError('�������κν����豸���޷�����֤������');
        return false;
    }

    var selectedDevice = deviceList.options[deviceList.selectedIndex];
    DEVICE_NAME = selectedDevice.text;
    
	if (deviceList.disabled && DEVICE_NAME.indexOf("������") != -1) {
		showError("�������κν����豸���޷�����֤������!");
		return false;
	}
    
	// ����������Ӧ������
    var certType = getObj('value(KEY_FORMAT)').value;
    getObj('value(requestType)').value = 'PKCS10';
    if (certType.indexOf('RSA') != -1 && certType.indexOf('SM2') == -1) {
        // RSA��֤
        keyType = RSAKeyType;
        getObj('value(responseType)').value = 'EnvelopedKeyPairData';
    } else if (certType.indexOf('RSA') == -1 
    		&& (certType.indexOf('SM2') != -1 || certType.indexOf('ECC') != -1)) {
        // SM2��֤
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
 * SKF�ӿڷ�֤����
 * 
 * @param device 
 * 		��ѡ����豸����
 */
export function createRequest_SKF(device) {

    var appList = device.enumAppList();
    var operationId = getObj('value(operationId)').value;

    // Ӳ���豸��֤
    if (appList == 0) {
        // ��������Ӧ�ò�
        // deviceCreateLayer(device);
        throw new Error('�豸��û��Ӧ�ã����ȴ���Ӧ��');
    } else {
        // ����Ӧ��ѡ���/��¼��
        deviceLayer(appList, device, operationId);
    }
}

/**
 * 
 * ����Ӧ�ûص����������ڹ��ܽӿڵ���
 * 
 * @param device
 * 		��ѡ����豸����
 * @returns
 */
export function CreatAppBack(device) {
    // �����ҳ��״̬
    document.body.style.cursor = 'wait';

    var objBtnMake = getObjWithoutAlter('btnMake');
    if (objBtnMake != null) {
        objBtnMake.disabled = true;
    }
    var appName = $('#container').val(); // ��������
    var adminPin = $('#AdminPIN').val(); // SOPIN
    var userPin = $('UserPIN').val();
    device.CreateAPP(appName, adminPin, 10, userPin, 10);
    device.AppURI = device.deviceURI + '|' + appName;
    device.login2(AppURI, userPin);
    var containerName = getObjWithoutAlter('value(CONTAINER_NAME)').val;
    if (containerName == '' || containerName == null) {
        containerName = getUUID(); // �Զ�����������
    }
    device.ContainerURI = device.AppURI + '|' + containerName;

    return SignCertRequest(device);

}

/**
 * ǩ��Ӧ�ûص����������ڹ��ܽӿڵ���
 * 
 * @param device
 * 		��ѡ����豸����
 * @param operationId
 * 		��������
 * @param containerName
 * 		��������1
 * @returns
 */
export function deviceLayerBack(device, operationId, containerName) {
    // �����ҳ��״̬
    document.body.style.cursor = "wait";
    
    /*var objBtnMake = getObjWithoutAlter("btnMake");
    if (objBtnMake != null) {
        objBtnMake.disabled = true;
    }*/
    
    try {
        var pin = $("#PIN").val();             // PIN��
        var appIndex = $("#appList").val();    // ��ѡ���Ӧ���±�
        device.login(appIndex, pin); 		   // ��¼Ӧ��
        if (operationId == "certsign" || operationId == "keyupdate"
        		||  operationId == "certrecover") {
            if (operationId == "keyupdate") {
            	// �ж���֤���Ƿ���ڽ�����
            	var certSn = getObj("value(CERT_SN)").value;
            	var ret = device.checkCertExists(certSn, false)
            	if(!ret) {
            		showError("pkcs10��������ʧ�ܣ�������δ�ҵ�֤�����к�Ϊ��'" + certSn + "' ��֤��!");
            		return false;
            	}
            }
            device.createContainer(appIndex, containerName);
            SignCertRequest(device);
        } else {
            UpdateCertRequest(device);
        }

    } catch (e) {
    	showError("����pkcs10����ʧ��: " + e.message);
		return false;
    }
}

/**
 * ֤��ǩ�������������´�������������в������ͣ�
 *		certsign ǩ��;
 *		keyupdate ��Կ����;
 *		certrecover �ָ�;
 *
 * @param device
 * 		��ѡ����豸����
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
		
		// ҳ�涼������ʽ���ύ��ť��ͳһ�ڴ˴��ύ
		$('#submitButton').click();
    } catch (e) {
    	showError("����pkcs10����ʧ�ܡ�������Ϣ: " + e);
    	return false;
    }
}

/**
 * ֤�������������ʹ��ԭ��������,֧�����в�������
 *		certrenew ����;
 *		certpostpone ����;
 * 
 * @param device
 * 		��ѡ����豸����
 * @returns
 */
export function UpdateCertRequest(device) {
    var oldSignSn = getObj('value(CERT_SN)').value;
    var certDN = getObj('value(CERT_SUBJECT_DN)').value;
    var operationId = getObj('value(operationId)').value;
    var certType = getObj('value(KEY_FORMAT)').value;
    var keySpec = CONTIANER_SIGN_TYPE; // �������� 1-ǩ������ 2-��������
    
    var keyLen = '1024';
    if (certType.indexOf('ECC') != -1 || certType.indexOf('SM2') != -1) {
        keyType = ECCKeyType;
        keyLen = '256';
    } else {
        if (DEVICE_NAME.indexOf('2048') != -1) {
        	keyLen = '2048';
        }
    }

    if (isExistsCheck) { // �ж��Ƿ�֤����
        var certURI = device.getCertUriByCertSN(oldSignSn, false);
        if(certURI == "" || certURI == null) {
        	showError("����pkcs10����ʧ�ܣ����ڸ��µ�֤���ڽ������޷��ҵ�!");
        	return false;
        }
        device.setContainer(certURI);
    }
    
    getObj('value(ContainerURI)').value = device.getContainer();

    var request;
    try{
    	if (operationId != 'certpostpone') { // ���ڲ���������
    		request = device.createRequset(keyType, keySpec, keyLen, certDN, ',');
    		getObj('value(pkcs10Request)').value = request;
    	}
    	// ҳ�涼������ʽ���ύ��ť��ͳһ�ڴ˴��ύ
    	$('#submitButton').click();
    } catch (e) {
    	showError("����pkcs10����ʧ�ܡ�������Ϣ: " + e);
    	return false;
    }
}

/**
 * ���ܽӿڰ�װ֤��
 * 
 * @returns
 */
export function InstallCert2() {
    // ʵ�������ܽӿ��豸
    var device = new Device(DEVICE_SKF);
    
    installCert(device);
}

/**
 * ��װ֤����庯��ʵ��
 * 
 * @param device
 * 		��ѡ����豸����
 * @returns
 */
export function installCert(device) {

    var sigCert = getObj('value(CERT_1)').value;
    var encCert = getObj('value(CERT_2)').value;
    var operationId = getObj('value(operationId)').value;
    var lraInfo = getObj('value(lraInfo)').value;

	var operationName = null;
	if ("certsign" == operationId) {
		operationName = "֤��ǩ��";
	}
	else if ("certrenew" == operationId) {
		operationName = "֤�����";
	}
	else if ("certrecover" == operationId) {
		operationName = "��Կ�ָ�";
	}
	else if ("certpostpone" == operationId) {
		operationName = "֤������";
	}
	else if ("keyupdate" == operationId) {
		operationName = "��Կ����";
	}
	else {
		operationName = "δ֪����";
	}

	var ContainerURI = getObj('value(ContainerURI)').value;	
	try {
        if ('certrenew' == operationId || 'certpostpone' == operationId) {
            // ������»�֤�����ڰ�װ
            DoInstallUpdate(sigCert, encCert, ContainerURI, device);
        } else {
            DoInstall(lraInfo, sigCert, ContainerURI, device);
            
            try{
            	if("keyupdate" == operationId) { // ��Կ���³ɹ�����Ҫɾ��������
            		var oldSignSn = getObjWithoutAlter('value(OLD_SIGN_CERT_SN)') == null ? 
            				null : getObj('value(OLD_SIGN_CERT_SN)').value;
            		var containerUri = device.getContainerUriByCertSN(oldSignSn, false);
            		if(containerUri != null) {
            			device.deleteContainer(containerUri);
            		} else {
            			// showError("����ɾ��ʧ�ܡ�������δ�ҵ����к�'" + oldSignSn + "'" + "���ڵ�����!");
            			// ɾ��ʧ��û��Ҫ��ʾ����Ӱ�������Ȳ���
            		}
            	}
            } catch(e) {
            	// ignore
            }
        }
		
        showError(operationName + "�ɹ�!");
        return true;
    } catch (e) {
    	showError(operationName + 'ʧ��! ����ԭ��:' + e.message);
        return false;
    }
}

/**
 * ������º�֤�����ڰ�װ������֤����Կ�����ĵ������
 * 
 * @param sigCert
 * 		ǩ��֤��
 * @param encCert
 * 		����֤��
 * @param containerURI
 * 		����uri
 * @param device
 * 		��ѡ����豸����
 * 		
 * @returns
 */
export function DoInstallUpdate(sigCert, encCert, containerURI, device) {
    // �Ȱ�װǩ��֤��
	device.doInstall(null, sigCert, containerURI);
    if (encCert != null && encCert != '') {
    	// ��װ����֤��
        device.doInstall(null, encCert, containerURI);
    }
}

/**
 * ֤�鰲װ
 * 
 * @param sigCert
 * 		ǩ��֤��
 * @param encCert
 * 		����֤��
 * @param containerURI
 * 		����uri
 * @param device
 * 		��ѡ����豸����
 * 		
 * @returns
 */
export function DoInstall(lraInfo, sigCert, containerURI, device) {
    device.doInstall(lraInfo, sigCert, containerURI);
}

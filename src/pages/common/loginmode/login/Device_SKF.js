/**
 * ʵ��SKF �ؼ��ķ�ʽ���в���
 */

import {enroll_webcall_service} from "./enroll_service_wrapper";
import {signx_webcall_service} from "./signx_service_wrapper";
import {CONTAINER_INFO_SEPARATOR} from "./DeviceControl";

// ֤����Ϣ�ָ�����(��ֵΪ�̶�ֵ���ɿͻ��˾����������޸�)
var CERT_INFO_SEPARATOR = "|"

export function Imp_SKF() {
	var _this = this;

	this.g_CertX = null;
	this.g_SignX = null;
	this.device_URI = null;
	this.app_URI = null;
	this.container_URI = null;

	/**
	 * ֤���������
	 */
    this.getCertX = function () {
        if (this.g_CertX != null) {
            return this.g_CertX;
        } else {
            try {
				this.g_CertX = Object.create(enroll_webcall_service);
                this.g_CertX.connect_service("127.0.0.1", 18776);
            } catch (e) {
                throw new Error(e);
            }
        }
        return this.g_CertX;
    };

    /**
     * ǩ������
     */
    this.getSignX = function () {
    	if (this.g_SignX != null) {
    		return this.g_SignX;
    	} else {
    		try {
    			this.g_SignX = Object.create(signx_webcall_service);
    			this.g_SignX.connect_service("127.0.0.1", 18776);
    		} catch (e) {
    			throw new Error(e);
    		}
    	}
    	return this.g_SignX;
    };
	
    /**
     * ��ʼ��ʵ����
     *
     */
    this.init = function () {
		this.getCertX();
		this.getSignX();

		this.g_CertX.Reload();
    };

    /**
     * ö���豸����
     * @returns deviceList 
     * 				text - �豸����
     *          	value - �豸�±�
     */
    this.enumDevice = function () {
        var deviceCount = this.g_CertX.GetDevCount();
        if (deviceCount == -1) {
            return 0;
        } else {
            var deviceList = new Array();
            // ö���豸URI �±��1��ʼ
            for (var i = 1; i <= deviceCount; i++) {
                // ����ȡkey�豸��cspURI
                var item = new Object();
                var deviceURI = this.g_CertX.GetDevUri(i);
                if (!(deviceURI.indexOf('CSPImpSkfInterFace.dll') != -1 && deviceURI.indexOf('Microsoft') == -1)) {
                    // ���豸URIΪSKFURI��΢���豸ʱ�г��豸�����������CSP΢��ӿ�
                    item.text = this.g_CertX.GetDeviceName(i); //�豸����
                    item.value = i;//�豸�±�
                    item.uri = deviceURI;
                    deviceList.push(item);
                }
            }
            return deviceList;
        }
    };
	
    /**
     * ��ȡָ���豸��Ӧ����Ŀ
     * 
     * @return Ӧ����������Ӧ�÷���0
     */
    this.getAppCount = function() {
    	var appCount = this.g_CertX.GetAppCount(this.device_URI);
    	if(appCount == -1) {
    		appCount = 0;
    	}
    	
    	return appCount;
    }
    
    /**
     * ö��Ӧ��
     * @return appList - text - Ӧ����
     *            value - Ӧ���±�
     */
    this.enumAppList = function () {
        var appCount = this.g_CertX.GetAppCount(this.device_URI);
        if (appCount == -1) {
            return 0;
        } else {
            var appList = new Array();
            //ö��Ӧ��URI �±��1��ʼ
            for (var i = 1; i <= appCount; i++) {
                var tmp = new Object();

                tmp.text = this.g_CertX.GetAppName(this.device_URI, i);//�����±��ȡӦ������
                tmp.value = i;
                appList.push(tmp);
            }

            return appList;
        }
    };

    /**
     * ����device_URI
     * @param selectedDevice ѡ�е��豸option
     */
    this.setDevice = function (selectedDevice) {
        var index = selectedDevice.value;
        if (index !== null && index !== '') {
            this.device_URI = this.g_CertX.GetDevUri(selectedDevice.value);
        } else {
            throw new Error('δ�ҵ���Ӧ�豸��ѡ�е��豸valueΪ��');
        }

    };

    /**
     * ��ȡ�豸����
     */
    this.getDevCount = function () {
    	var devCount = this.g_CertX.GetDevCount();
    	if(devCount == -1) {
    		devCount = 0;
    	}
    	
    	return devCount;
    };
    
    /**
     * @param appIndex Ӧ���±�
     */
    this.setAppUri = function (appIndex) {
        if (appIndex !== null && appIndex !== '') {
            this.app_URI = this.g_CertX.GetAppUri(this.device_URI, appIndex);
        } else {
            throw new Error('δ�ҵ���ӦӦ��');
        }
    };

    /**
     * ��ȡӦ��uri
     * 
     * @param appIndex Ӧ���±�
     */
    this.getAppUri = function (appIndex) {
        if (appIndex !== null && appIndex !== '') {
            this.app_URI = this.g_CertX.GetAppUri(this.device_URI, appIndex);
        } else {
            throw new Error('δ�ҵ���ӦӦ��');
        }
        return this.app_URI;
    };

    /**
     * ��ѯ�豸���к�
     */
    this.getDevSerialNumber = function () {
        return this.g_CertX.GetDevSerialNumber(this.device_URI);
    };

    /**
     * ��½Ӧ�÷���
     * @param bsPasswd Ӧ��PIN��
     * @return true ; false
     */
    this.login = function (bsPasswd) {
        return this.g_CertX.LoginApp(this.app_URI, bsPasswd);
    };

    /**
     * ��½Ӧ�÷���
     * @param bsPasswd Ӧ��PIN��
     * @return true ; false
     */
    this.login2 = function (appUri, bsPasswd) {
        return this.g_CertX.LoginApp(appUri, bsPasswd);
    };

    /**
     * ����ǩ����Կ��
     * @param dwKeyType ��Կ����:1 - RSA ; 2 - ECC
     * @param dwKeySpec ֤������:1 - CONTIANER_SIGN_TYPE ; 2 - CONTIANER_ENC_TYPE  = 2
     * @param dwKeyLen  ��Կ���� ֻ��RSA��Ч
     * @return pbsPubB64 ��Կ�Թ�Կ��Base64������Ϣ
     */
    this.genKeyPair = function (dwKeyType, dwKeySpec, dwKeyLen) {
        return this.g_CertX.GenSignKeyPair(this.container_URI, dwKeyType, dwKeySpec, dwKeyLen);
    };

    /**
     * ����֤������
     * @param certDN ֤��DN��
     * @param bsSplit �ָ��� һ��Ϊ','
     * @param dwKeyLen  ��Կ���� ֻ��RSA��Ч
     */
    this.genCertReq = function (dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit) {
        this.genKeyPair(dwKeyType, dwKeySpec, dwKeyLen);
        return this.g_CertX.GenPkcs10Req(this.container_URI, certDN, bsSplit);
    };

    /**
     * ��������
     * @param containerName ��������
     */
    this.createContainer = function (containerName) {
		var ret = this.g_CertX.CreateContainer(this.app_URI, containerName);
		if(ret == 0){
			this.container_URI = this.app_URI + "|" + containerName;
		}
    };

    /**
     * ��ȡ�豸�����е�֤����Ϣ��һ�����ص�����Ϊ����uri������֤��������Ҫͨ������ָ��
     * 	
     * @param cert_flag_bits ��ȡ֤�����ݵ����ͣ�����֤��ժҪ��֤�����кš�
     * 			���д˲���ʹ��8λ���������֣����ʹ��ʱ�����ոߵ�λ�������ӣ����£�
     * 			00000001:֤��ժҪ��ժҪ�㷨sha1
     * 			00000010:֤��ժҪ��ժҪ�㷨sha256
     * 			00000100:10�������к�
     * 			00001000:16�������к�
     * 			������תΪʮ���ƴ��뼴�ɡ�parseInt("00000001", 2);
     * @param separator
     * 			�������֮��ķָ����ţ�Ϊ����ʹ��Ĭ��ֵ"###"
     * 
     * @return ֤����Ϣ�ַ�����
     * 		֤����Ϣ֮��Ĭ��ʹ��'|'�ָ����֤��֮��ʹ���ⲿ����Ĳ����ָ����
     * 		sha1(1)|sha256(1)|snDec(1)|snHex(1)#sha1(2)|sha256(2)|snDec(2)|snHex(2)
     */
    this.getAllCerts = function (cert_flag_bits, separator) {
    	if(separator == null) {
    		separator = CONTAINER_INFO_SEPARATOR/*Ĭ�ϵ�֤��ָ����*/;
    	}
    	return this.g_SignX.GetAllCerts(cert_flag_bits,separator);//cert_flag_bits, separator);
    }
    
    /**
     * ͨ�����кŻ�ȡ֤��URI
     * 
     * @param bsCertSN ֤�����к�
     * @param beHex ���к��Ƿ�Ϊʮ������
     * 
     * @return ֤����������,Ϊ�ҵ�����null
     */
    this.getCertUriByCertSN = function (bsCertSN, beHex) {
    	
    	var snflag = parseInt("00000100", 2); // ��ȡʮ����ϵ�к�
    	if(beHex) {
    		snflag = parseInt("00001000", 2); // ��ȡʮ������ϵ�к�
    	}
    	var containerURI = null;
    	
    	var certInfoStr = this.getAllCerts(snflag, CONTAINER_INFO_SEPARATOR);
        var certInfos = certInfoStr.split(CONTAINER_INFO_SEPARATOR);
        
        var certCount = certInfos.length;
        for(var i = 0; i < certCount; i++) {
        	if(certInfos[i].indexOf(bsCertSN) != -1) {
        		// certInfo����ֵ��skf://2463335116100715|ES3003 VCR 1|ENTERSAFE-ESPK|KOAL_ECC|sig|26892554857327426307057238731

        		containerURI = certInfos[i].substring(0, certInfos[i].lastIndexOf("|"));
				//alert("container uri = " + containerURI);
        		break;
        	}
        }
        
        return containerURI;
    };

    /**
     * ͨ�����кŻ�ȡ����URI
     * 
     * @param bsCertSN ֤�����к�
     * @param beHex ���к��Ƿ�Ϊʮ������
     * 
     * @return ֤����������,Ϊ�ҵ�����null
     */
    this.getContainerUriByCertSN = function (bsCertSN, beHex) {
    	
    	var certUri = this.getCertUriByCertSN (bsCertSN, beHex);
    	return certUri.substring(0, certUri.lastIndexOf("|"));
    };
    
    /**
     * ͨ�����кŻ�ȡ֤������
     * 
     * @param bsCertSN 
     * 			֤�����к�
     * @param certType 
     * 			1��ǩ��֤��
     * 			2������֤��
     * @param beHex 
     * 			���к��Ƿ�Ϊʮ������
     * 
     * @return base64����֤��,��δ�ҵ����������ַ���
     */
    this.getCertValueBySn = function (bsCertSN, certType, beHex) {
    	
    	var containerUri = this.getContainerUriByCertSN(bsCertSN, beHex);
    	
    	return this.g_SignX.GetCert(containerUri, certType);
    };

    this.getDuplicateCertValueBySn = function (bsCertSN, certType, beHex) {
        var containerUri = this.getContainerUriByCertSN(bsCertSN, beHex);
        
        return this.g_SignX.DuplicateCert(containerUri, certType);
    };
    
    /**
     * ��ȡ�豸�����е�֤�����кţ�ʮ���ƣ�
     * 
     * @param snflag	��ȡ֤����Ϣ�ı�ʶ
     * @param separator	�����ָ�����
     * 
     * @return ������֤�����к�����
     */
    this.enumSNList = function (snflag, separator) {
    	var certInfoStr = this.getAllCerts(snflag, separator);

        var certInfos = certInfoStr.split(separator);
        
        var snArray = new Array();
        var certCount = certInfos.length;
        for(var i = 0; i < certCount; i++) {
        	// certInfo����ֵ��skf://2463335116100715|ES3003 VCR 1|ENTERSAFE-ESPK|KOAL_ECC|sig|26892554857327426307057238731
        	snArray[i] = certInfos[i].substring(certInfos[i].lastIndexOf("|") + 1, certInfos[i].length);
        }
        
        var snArray1 = [];
        for(var i = 0, length = snArray.length; i < length; i++){
        	if(snArray1.indexOf(snArray[i]) > -1){

        	}else{
        		snArray1.push(snArray[i]);
        	}
        }

        return snArray1;
    };
    
    
    /**
     * ���ָ�����к�֤���Ƿ���ڽ�����
     * 
     * @param sn	������֤�����к�
     * @param beHex	�Ƿ�Ϊʮ������
     * 
     * @return true�����ڣ�false��������
     */
    this.checkCertExists = function (bsCertSN, beHex) {
    	var container = this.getContainerUriByCertSN(bsCertSN, beHex);
    	if(container != null && container != "") {
    		return true;
    	}
    	
    	return false;
    };
    
    /**
     * ɾ������������֤�顢��Կ
     * 
     * @param	appUri Ӧ��uri
     * @param	containerName ��������
     */
    this.deleteContainer = function (appUri, containerName) {
        return this.g_CertX.DeleteContainer(appUri, containerName);
    };

    /**
     * ��װ֤��
     * 
     * @param lraInfo 
     * 			֤�鰲װ��
     * @param sigCert 
     * 			ǩ��֤��x509��ʽ
     * @param containerURI 
     * 			����URI
     */
    this.doInstall = function (lraInfo, sigCert, containerURI) {
        var isDouble = false; // �Ƿ���˫֤��
        var isEnvelopd = false; // �Ƿ�Ϊ��Կ�����
        var encCert = null;
        var encKeyPair = null;
        if (!IsNullWithTrim(lraInfo) && lraInfo.indexOf('|') !== -1) {
            // ˫֤��
            var lraInfoItems = lraInfo.split('|');
            encCert = lraInfoItems[0];
            isDouble = true;
            encKeyPair = lraInfoItems[1];
            isEnvelopd = lraInfoItems.length > 2;
        }
        
        // 1.��װǩ��֤��
        this.installCert(containerURI, sigCert);
        
        // 2.��װ����֤��
        if (isDouble) {
            if (isEnvelopd) {
                // ������Կ�����:������Կ��֤��
                this.installEncCert(containerURI, encCert, encKeyPair);
            } else {
                // ��������Կ�����:�������֤�����Կ�� 
                this.installPfxCert(containerURI, encCert);
            }
        }
    };

    /**
     * ��װ֤��
     * @param certValue BASE64֤��
     */
    this.installCert = function (containerURI, certValue) {
        this.g_CertX.ImportX509Cert(containerURI, certValue);
    };

    /**
     * ��װpfx֤��
     * @param certValue BASE64֤��
     */
    this.installPfxCert = function (containerURI, certPfxValue) {
        this.g_CertX.ImportPfxCert(containerURI, certPfxValue, "123456");
    };

    /**
     * ��װ����֤��
     * @param certValue BASE64����֤��
     * @param encKey ��װ�ļ�����Կ�� ASN1�ṹ
     */
    this.installEncCert = function (containerURI, certValue, encKey) {
        this.g_CertX.ImportEncKeyPair(containerURI, encKey);
        this.installCert(containerURI, certValue);
    };

    /**
     * P7ǩ��
     * 
     * @param certSn      
     * 				֤�����кţ�ʮ���ƣ�
     * @param bsSrcData           
     * 				Ҫǩ��������ԭ��
     * @param includeSrcData      
     * 				ǩ���������Ƿ����ԭ����(1:����ԭ���ݣ�0:������ԭ����)
     * @param pinCode      
     * 				����Աpin��
     * @return  pbsSignBase64      
     * 				base64��ʽ��p7ǩ������
     */
    this.signP7ByCertSN = function (certSn, bsSrcData, includeSrcData, pinCode) {
    	
    	var signdData = null;
    	
    	// �������к��ҵ��������� 
    	var containUri = this.getContainerUriByCertSN(certSn, false);
    	if(containUri == null || containUri == "") {
    		throw new Error("֤��ǩ��ʧ�ܣ�������δ�ҵ����к�'" + certSn + "'" + "���ڵ�����!");
    	}
    	
    	// ������֤
    	try{
    		this.g_SignX.LoginApp(containUri, pinCode);
    	} catch (e) {
    		throw new Error("�����豸PIN��(����)����ȷ!");
    	}
    	
    	signdData = this.g_SignX.SignMessage(containUri, bsSrcData, includeSrcData);
    	
    	return signdData;
    };
    
    /**
     * �ı�ǩ��
     * 
     * @param certSn      
     * 				֤�����кţ�ʮ���ƣ�
     * @param dataBase64           
     * 				Ҫǩ��������ԭ��base����
     * @param pinCode      
     * 				ukey�����豸pin��
     * @param beHex      
     * 				֤�����к��Ƿ�Ϊʮ������
     * @return  �ɹ������ı�ǩ�����ݣ�ʧ�ܷ��ؿ�
     * 			
     */
    this.signData = function (certSn, dataBase64, pinCode, beHex) {
    	
    	// �������к��ҵ��������� 
    	var containUri = this.getContainerUriByCertSN(certSn, beHex);
		//alert("uri: " + containUri);
    	if(containUri == null || containUri == "") {
    		throw new Error("֤��ǩ��ʧ�ܣ�������δ�ҵ����к�'" + certSn + "'" + "���ڵ�����!");
    	}
    	
    	if(pinCode != null) {
    		// ������֤
    		try{
    			this.g_SignX.LoginApp(containUri, pinCode);
    		} catch (e) {
    			throw new Error("�����豸PIN��(����)����ȷ!");
    		}
    	}
    	
    	return this.g_SignX.SignData(containUri, dataBase64);
    };
};

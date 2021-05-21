/**
 * 实现SKF 控件的方式进行操作
 */

import {enroll_webcall_service} from "./enroll_service_wrapper";
import {signx_webcall_service} from "./signx_service_wrapper";
import {CONTAINER_INFO_SEPARATOR} from "./DeviceControl";

// 证书信息分隔符号(该值为固定值，由客户端决定，不能修改)
var CERT_INFO_SEPARATOR = "|"

export function Imp_SKF() {
	var _this = this;

	this.g_CertX = null;
	this.g_SignX = null;
	this.device_URI = null;
	this.app_URI = null;
	this.container_URI = null;

	/**
	 * 证书操作对象
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
     * 签名对象
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
     * 初始化实现类
     *
     */
    this.init = function () {
		this.getCertX();
		this.getSignX();

		this.g_CertX.Reload();
    };

    /**
     * 枚举设备方法
     * @returns deviceList 
     * 				text - 设备名称
     *          	value - 设备下标
     */
    this.enumDevice = function () {
        var deviceCount = this.g_CertX.GetDevCount();
        if (deviceCount == -1) {
            return 0;
        } else {
            var deviceList = new Array();
            // 枚举设备URI 下标从1开始
            for (var i = 1; i <= deviceCount; i++) {
                // 不获取key设备的cspURI
                var item = new Object();
                var deviceURI = this.g_CertX.GetDevUri(i);
                if (!(deviceURI.indexOf('CSPImpSkfInterFace.dll') != -1 && deviceURI.indexOf('Microsoft') == -1)) {
                    // 当设备URI为SKFURI及微软设备时列出设备，其他情况走CSP微软接口
                    item.text = this.g_CertX.GetDeviceName(i); //设备名称
                    item.value = i;//设备下标
                    item.uri = deviceURI;
                    deviceList.push(item);
                }
            }
            return deviceList;
        }
    };
	
    /**
     * 获取指定设备的应用数目
     * 
     * @return 应用总数，无应用返回0
     */
    this.getAppCount = function() {
    	var appCount = this.g_CertX.GetAppCount(this.device_URI);
    	if(appCount == -1) {
    		appCount = 0;
    	}
    	
    	return appCount;
    }
    
    /**
     * 枚举应用
     * @return appList - text - 应用名
     *            value - 应用下标
     */
    this.enumAppList = function () {
        var appCount = this.g_CertX.GetAppCount(this.device_URI);
        if (appCount == -1) {
            return 0;
        } else {
            var appList = new Array();
            //枚举应用URI 下标从1开始
            for (var i = 1; i <= appCount; i++) {
                var tmp = new Object();

                tmp.text = this.g_CertX.GetAppName(this.device_URI, i);//根据下标获取应用名称
                tmp.value = i;
                appList.push(tmp);
            }

            return appList;
        }
    };

    /**
     * 设置device_URI
     * @param selectedDevice 选中的设备option
     */
    this.setDevice = function (selectedDevice) {
        var index = selectedDevice.value;
        if (index !== null && index !== '') {
            this.device_URI = this.g_CertX.GetDevUri(selectedDevice.value);
        } else {
            throw new Error('未找到对应设备，选中的设备value为空');
        }

    };

    /**
     * 获取设备总数
     */
    this.getDevCount = function () {
    	var devCount = this.g_CertX.GetDevCount();
    	if(devCount == -1) {
    		devCount = 0;
    	}
    	
    	return devCount;
    };
    
    /**
     * @param appIndex 应用下标
     */
    this.setAppUri = function (appIndex) {
        if (appIndex !== null && appIndex !== '') {
            this.app_URI = this.g_CertX.GetAppUri(this.device_URI, appIndex);
        } else {
            throw new Error('未找到对应应用');
        }
    };

    /**
     * 获取应用uri
     * 
     * @param appIndex 应用下标
     */
    this.getAppUri = function (appIndex) {
        if (appIndex !== null && appIndex !== '') {
            this.app_URI = this.g_CertX.GetAppUri(this.device_URI, appIndex);
        } else {
            throw new Error('未找到对应应用');
        }
        return this.app_URI;
    };

    /**
     * 查询设备序列号
     */
    this.getDevSerialNumber = function () {
        return this.g_CertX.GetDevSerialNumber(this.device_URI);
    };

    /**
     * 登陆应用方法
     * @param bsPasswd 应用PIN码
     * @return true ; false
     */
    this.login = function (bsPasswd) {
        return this.g_CertX.LoginApp(this.app_URI, bsPasswd);
    };

    /**
     * 登陆应用方法
     * @param bsPasswd 应用PIN码
     * @return true ; false
     */
    this.login2 = function (appUri, bsPasswd) {
        return this.g_CertX.LoginApp(appUri, bsPasswd);
    };

    /**
     * 生成签名密钥对
     * @param dwKeyType 密钥类型:1 - RSA ; 2 - ECC
     * @param dwKeySpec 证书类型:1 - CONTIANER_SIGN_TYPE ; 2 - CONTIANER_ENC_TYPE  = 2
     * @param dwKeyLen  密钥长度 只对RSA有效
     * @return pbsPubB64 密钥对公钥的Base64编码信息
     */
    this.genKeyPair = function (dwKeyType, dwKeySpec, dwKeyLen) {
        return this.g_CertX.GenSignKeyPair(this.container_URI, dwKeyType, dwKeySpec, dwKeyLen);
    };

    /**
     * 生成证书请求
     * @param certDN 证书DN项
     * @param bsSplit 分隔符 一般为','
     * @param dwKeyLen  密钥长度 只对RSA有效
     */
    this.genCertReq = function (dwKeyType, dwKeySpec, dwKeyLen, certDN, bsSplit) {
        this.genKeyPair(dwKeyType, dwKeySpec, dwKeyLen);
        return this.g_CertX.GenPkcs10Req(this.container_URI, certDN, bsSplit);
    };

    /**
     * 创建容器
     * @param containerName 容器名称
     */
    this.createContainer = function (containerName) {
		var ret = this.g_CertX.CreateContainer(this.app_URI, containerName);
		if(ret == 0){
			this.container_URI = this.app_URI + "|" + containerName;
		}
    };

    /**
     * 获取设备中所有的证书信息：一定返回的数据为容器uri，其他证书数据需要通过参数指定
     * 	
     * @param cert_flag_bits 获取证书内容的类型，包括证书摘要、证书序列号。
     * 			其中此参数使用8位二进制区分，组个使用时，按照高低位依次连接，如下：
     * 			00000001:证书摘要，摘要算法sha1
     * 			00000010:证书摘要，摘要算法sha256
     * 			00000100:10进制序列号
     * 			00001000:16进制序列号
     * 			将上述转为十进制传入即可。parseInt("00000001", 2);
     * @param separator
     * 			多个容器之间的分隔符号，为空则使用默认值"###"
     * 
     * @return 证书信息字符串。
     * 		证书信息之间默认使用'|'分割，各个证书之间使用外部传入的参数分割。形如
     * 		sha1(1)|sha256(1)|snDec(1)|snHex(1)#sha1(2)|sha256(2)|snDec(2)|snHex(2)
     */
    this.getAllCerts = function (cert_flag_bits, separator) {
    	if(separator == null) {
    		separator = CONTAINER_INFO_SEPARATOR/*默认的证书分割符号*/;
    	}
    	return this.g_SignX.GetAllCerts(cert_flag_bits,separator);//cert_flag_bits, separator);
    }
    
    /**
     * 通过序列号获取证书URI
     * 
     * @param bsCertSN 证书序列号
     * @param beHex 序列号是否为十六进制
     * 
     * @return 证书容器名称,为找到返回null
     */
    this.getCertUriByCertSN = function (bsCertSN, beHex) {
    	
    	var snflag = parseInt("00000100", 2); // 获取十进制系列号
    	if(beHex) {
    		snflag = parseInt("00001000", 2); // 获取十六进制系列号
    	}
    	var containerURI = null;
    	
    	var certInfoStr = this.getAllCerts(snflag, CONTAINER_INFO_SEPARATOR);
        var certInfos = certInfoStr.split(CONTAINER_INFO_SEPARATOR);
        
        var certCount = certInfos.length;
        for(var i = 0; i < certCount; i++) {
        	if(certInfos[i].indexOf(bsCertSN) != -1) {
        		// certInfo返回值：skf://2463335116100715|ES3003 VCR 1|ENTERSAFE-ESPK|KOAL_ECC|sig|26892554857327426307057238731

        		containerURI = certInfos[i].substring(0, certInfos[i].lastIndexOf("|"));
				//alert("container uri = " + containerURI);
        		break;
        	}
        }
        
        return containerURI;
    };

    /**
     * 通过序列号获取容器URI
     * 
     * @param bsCertSN 证书序列号
     * @param beHex 序列号是否为十六进制
     * 
     * @return 证书容器名称,为找到返回null
     */
    this.getContainerUriByCertSN = function (bsCertSN, beHex) {
    	
    	var certUri = this.getCertUriByCertSN (bsCertSN, beHex);
    	return certUri.substring(0, certUri.lastIndexOf("|"));
    };
    
    /**
     * 通过序列号获取证书内容
     * 
     * @param bsCertSN 
     * 			证书序列号
     * @param certType 
     * 			1：签名证书
     * 			2：加密证书
     * @param beHex 
     * 			序列号是否为十六进制
     * 
     * @return base64编码证书,若未找到，反馈空字符串
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
     * 获取设备中所有的证书序列号（十进制）
     * 
     * @param snflag	获取证书信息的标识
     * @param separator	容器分隔符号
     * 
     * @return 容器中证书序列号数组
     */
    this.enumSNList = function (snflag, separator) {
    	var certInfoStr = this.getAllCerts(snflag, separator);

        var certInfos = certInfoStr.split(separator);
        
        var snArray = new Array();
        var certCount = certInfos.length;
        for(var i = 0; i < certCount; i++) {
        	// certInfo返回值：skf://2463335116100715|ES3003 VCR 1|ENTERSAFE-ESPK|KOAL_ECC|sig|26892554857327426307057238731
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
     * 检查指定序列号证书是否存在介质中
     * 
     * @param sn	待检查的证书序列号
     * @param beHex	是否为十六进制
     * 
     * @return true：存在；false：不存在
     */
    this.checkCertExists = function (bsCertSN, beHex) {
    	var container = this.getContainerUriByCertSN(bsCertSN, beHex);
    	if(container != null && container != "") {
    		return true;
    	}
    	
    	return false;
    };
    
    /**
     * 删除容器及下属证书、密钥
     * 
     * @param	appUri 应用uri
     * @param	containerName 容器名称
     */
    this.deleteContainer = function (appUri, containerName) {
        return this.g_CertX.DeleteContainer(appUri, containerName);
    };

    /**
     * 安装证书
     * 
     * @param lraInfo 
     * 			证书安装码
     * @param sigCert 
     * 			签名证书x509格式
     * @param containerURI 
     * 			容器URI
     */
    this.doInstall = function (lraInfo, sigCert, containerURI) {
        var isDouble = false; // 是否是双证书
        var isEnvelopd = false; // 是否为密钥不落地
        var encCert = null;
        var encKeyPair = null;
        if (!IsNullWithTrim(lraInfo) && lraInfo.indexOf('|') !== -1) {
            // 双证书
            var lraInfoItems = lraInfo.split('|');
            encCert = lraInfoItems[0];
            isDouble = true;
            encKeyPair = lraInfoItems[1];
            isEnvelopd = lraInfoItems.length > 2;
        }
        
        // 1.安装签名证书
        this.installCert(containerURI, sigCert);
        
        // 2.安装加密证书
        if (isDouble) {
            if (isEnvelopd) {
                // 启用密钥不落地:导入密钥加证书
                this.installEncCert(containerURI, encCert, encKeyPair);
            } else {
                // 不启用密钥不落地:导入加密证书和密钥对 
                this.installPfxCert(containerURI, encCert);
            }
        }
    };

    /**
     * 安装证书
     * @param certValue BASE64证书
     */
    this.installCert = function (containerURI, certValue) {
        this.g_CertX.ImportX509Cert(containerURI, certValue);
    };

    /**
     * 安装pfx证书
     * @param certValue BASE64证书
     */
    this.installPfxCert = function (containerURI, certPfxValue) {
        this.g_CertX.ImportPfxCert(containerURI, certPfxValue, "123456");
    };

    /**
     * 安装加密证书
     * @param certValue BASE64加密证书
     * @param encKey 封装的加密密钥对 ASN1结构
     */
    this.installEncCert = function (containerURI, certValue, encKey) {
        this.g_CertX.ImportEncKeyPair(containerURI, encKey);
        this.installCert(containerURI, certValue);
    };

    /**
     * P7签名
     * 
     * @param certSn      
     * 				证书序列号（十进制）
     * @param bsSrcData           
     * 				要签名的数据原文
     * @param includeSrcData      
     * 				签名数据中是否包含原数据(1:包含原数据，0:不包含原数据)
     * @param pinCode      
     * 				管理员pin码
     * @return  pbsSignBase64      
     * 				base64格式的p7签名数据
     */
    this.signP7ByCertSN = function (certSn, bsSrcData, includeSrcData, pinCode) {
    	
    	var signdData = null;
    	
    	// 根据序列号找到容器名称 
    	var containUri = this.getContainerUriByCertSN(certSn, false);
    	if(containUri == null || containUri == "") {
    		throw new Error("证书签名失败，介质中未找到序列号'" + certSn + "'" + "所在的容器!");
    	}
    	
    	// 密码验证
    	try{
    		this.g_SignX.LoginApp(containUri, pinCode);
    	} catch (e) {
    		throw new Error("介质设备PIN码(密码)不正确!");
    	}
    	
    	signdData = this.g_SignX.SignMessage(containUri, bsSrcData, includeSrcData);
    	
    	return signdData;
    };
    
    /**
     * 文本签名
     * 
     * @param certSn      
     * 				证书序列号（十进制）
     * @param dataBase64           
     * 				要签名的数据原文base编码
     * @param pinCode      
     * 				ukey介质设备pin码
     * @param beHex      
     * 				证书序列号是否为十六进制
     * @return  成功返回文本签名数据，失败返回空
     * 			
     */
    this.signData = function (certSn, dataBase64, pinCode, beHex) {
    	
    	// 根据序列号找到容器名称 
    	var containUri = this.getContainerUriByCertSN(certSn, beHex);
		//alert("uri: " + containUri);
    	if(containUri == null || containUri == "") {
    		throw new Error("证书签名失败，介质中未找到序列号'" + certSn + "'" + "所在的容器!");
    	}
    	
    	if(pinCode != null) {
    		// 密码验证
    		try{
    			this.g_SignX.LoginApp(containUri, pinCode);
    		} catch (e) {
    			throw new Error("介质设备PIN码(密码)不正确!");
    		}
    	}
    	
    	return this.g_SignX.SignData(containUri, dataBase64);
    };
};

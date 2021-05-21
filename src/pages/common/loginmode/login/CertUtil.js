/**
 * ǩ��֤������� 20180111 V1.0
 *
 */

/**
 * �����ڽ����ʼ��ʱ���豸������ʾ��options��
 * @param theForm ҳ���form
 * @param isCsp �Ƿ�ΪCSP�豸
 */

export function setDevices(theForm, isCsp) {
    var device;

    try {
		device = new Device(DEVICE_SKF);
	} catch (e) {
		if(isIE()) { // IE������쳣�������׳��쳣
			return false;
		} else {
			showError('��ʼ��֤���豸ʧ�ܣ�webcall��������ʧ�ܡ�������Ϣ��' + e);
			return false;
		}
	}
    
    var deviceList = device.enumDevices();
    var setMicrosoftCSP = false;
    var certType = (getObjWithoutAlter('value(CERT_TYPE_NAME)') != null ? 
    		getObj('value(CERT_TYPE_NAME)').value : 'RSA');
    if (certType.indexOf('RSA') != -1 && certType.indexOf('SM2') == -1) {
        // RSA ��֤ �о�΢��CSP + key
        setMicrosoftCSP = true;
    }
    
    var list = theForm.IeTokenList;
    
    if (list != null && list.options != null) {
        //���ԭ�ȵ�options
        var index = list.options.length;
        for (var i = 0; i < index; i++) {
            list.remove(0);
        }
    }
    if (deviceList != 0 && device != null) {
        var deviceCount = deviceList.length;
        for (var i = 0; i < deviceCount; i++) {
            var el = document.createElement('OPTION');
            if (deviceList[i] != '' && deviceList[i] != null) {
                if (!setMicrosoftCSP) {
                    if (deviceList[i].text.indexOf('Microsoft') != -1) {
                        continue;
                    }
                }
                el.text = deviceList[i].text;
                el.value = deviceList[i].value;
                
                theForm.IeTokenList.add(el);
            }
        }
    }
    
    return true;
}

/**
 * ��ȡ�������к�
 */
export function ReadCardNo(device) {
	return device.getDevSerialNumber();
}

/**
 * ����name��ȡ����
 *
 * @param name
 * @returns
 */
export function getObj(name) {
    var obj = document.getElementsByName(name).item(0);
    if (obj == null) {
    	showError('��ǰҳ�治��������Ϊ\'' + name + '\'�Ķ���!');
        return null;
    }

    return obj;
}

/**
 * ����name��ȡ���󣬳���ʱû����ʾ��Ϣ
 *
 * @param name
 * @returns
 */
export function getObjWithoutAlter(name) {
    try {
        var obj = document.getElementsByName(name).item(0);
        return obj;
    } catch (err) {
        ;
    }
    return null;
}

/**
 * ����ID��ȡ����
 *
 * @param name
 * @returns
 */
export function getObjById(id) {
    var obj = document.getElementById(id);
    if (obj == null) {
    	showError('��ǰҳ�治��������Ϊ\'' + id + '\'�Ķ���!');
        return null;
    }

    return obj;
}

/**
 * ����UUID
 *
 * @returns
 */
export function getUUID() {
    var s = [];
    var hexDigits = '0123456789ABCDEF';
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
    // clock_seq_hi_and_reserved
    // to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    var uuid = s.join('');
    return uuid;
}

/**
 * ����F5ˢ��
 *
 * @returns
 */
export function DisableF5() {
    if (event.keyCode == 116) {
        event.keyCode = 0;
        event.cancelBubble = true;
        return false;
    }
}

/**
 * �Ƿ�����DIV
 *
 * @param Object
 * @param bShow
 *            true ��ʾ�� false ����ʾ
 * @returns
 */
export function ShowDiv(Object, bShow) {
    if (bShow) {
        Object.style.visibility = 'visible';
        Object.style.position = '';
    } else {
        Object.style.visibility = 'hidden';
        Object.style.position = 'absolute';
    }
}

/**
 * �Ƿ��������
 *
 * @param id
 *            ID����
 * @param show
 *            �Ƿ���ʾ
 * @returns
 */
export function setVisible(id, show) {
    var style = document.getElementById(id).style;
    if (show)
        style.display = '';
    else
        style.display = 'none';
}

/**
 * ϵͳ��Ϣ������������汾������ϵͳ�汾
 */
export var SysInfo = {
    // �Ƿ�ΪVista
    isVista: function () {
        return (this.getIeVersion() >= 7.0) && (this.getSysVersion() >= 6.0);
    },

    // IE �汾
    getIeVersion: function () {
        return Browser(navigator.appVersion);
    },

    // ����ϵͳ�汾��Win2k: 5.0, WinXP: 5,1, Vista: 6.0
    getSysVersion: function () {
        return System(navigator.appVersion);
    }
};

/**
 * ������汾�����ж�
 *
 * @param Info
 * @returns
 */
export function Browser(Info) {

    // info Ϊ navigator.appVersion
    if (Info.indexOf('rv:12.0') > -1 && Info.indexOf('Trident') > -1) {
        return 12.0;
    }
    // ��IE11��ʼ��IE��appVersion��־�ı�
    else if (Info.indexOf('rv:11.0') > -1 && Info.indexOf('Trident') > -1) {

        return 11.0;
    } else {

        return parseFloat(Info.split('MSIE')[1]);
    }

}

/**
 * ����������ж�
 */
export function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true;
    } else {
        return false;
    }
}

/**
 * ϵͳ�汾�ж�
 *
 * @param Info
 * @returns
 */
export function System(Info) {

    if (Info.indexOf('NT 10.0') > -1) {
        return 10.0; // 'Windows 10
    } else if (Info.indexOf('NT 6.3') > -1) {
        return 6.3; // 'Windows 9
    } else if (Info.indexOf('NT 6.2') > -1) {
        return 6.2; // 'Windows 8
    } else if (Info.indexOf('NT 6.1') > -1) {
        return 6.1; // 'Windows 7
    } else if (Info.indexOf('NT 6.0') > -1) {
        return 6.0; // 'Windows Vista
    } else if (Info.indexOf('NT 5.1') > -1) {
        return 5.1; // 'Windows XP
    } else if (Info.indexOf('NT 5.0') > -1) {
        return 5.0; // 'Windows 2000
    } else {
        return -1;
    }
}

/**
 * ��Ϣ��ʾ������ʵ�ֳɲ�ͬ����ʾ��ʽ
 *
 * @param msg
 * @returns
 */
export function showError(msg) {
    alert(msg);
}

/**
 * ȥ��String���'\r\n'
 */
export function strStrip(s) {
    var filteredValues = '\r\n';     // Characters stripped out
    var i;
    var returnString = '';
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (filteredValues.indexOf(c) == -1) {
            returnString += c;
        }
    }
    return returnString;
}

/**
 * �ж��Ƿ�Ϊ��
 */
export function IsNullWithTrim(value) {
    if (value == null)
        return true;
    for (var n = 0; n < value.length; n++) {
        if (value.charAt(n) != ' ')
            return false;
    }
    return true;
}

/**
 * ��ȡ�ļ�����������д��name��ǩ��
 * @param input
 * @param name
 */
export function read(input, name) {
	console.log('name= ' + name)
	if (input.files.length > 1) {
		showError('ֻ��ѡ��һ���ļ���')
		return;
	}
	var file = input.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function(e) {
		document.getElementsByName(name)[0].value = e.target.result;
	}
}

/**
 * copy name��ǩ��value�����а�
 * @param name
 */
export function copy2(name) {
	var obj = document.getElementsByName(name)[0].value;
	var oInput = document.createElement('input');
    
	oInput.value = obj
    document.body.appendChild(oInput);
    oInput.select(); // ѡ�����
    document.execCommand("Copy"); // ִ���������������
    oInput.className = 'oInput';
    oInput.style.display='none';
    
    showError('���Ƴɹ�');
}

/**
 * �����ļ�
 * 
 * @param value
 * 		�ļ�����
 * @param name
 * 		�ļ�����
 * @param isPem
 * 		�Ƿ�Ϊpem��ʽ,�����pem��ʽ���������pemͷβ
 * @returns
 */
export function saveFile(value, name, isPem)
{
	try {
		var temp = value;
		if (isPem) {
			temp = "-----BEGIN CERTIFICATE-----\n" + temp + "\n-----END CERTIFICATE-----";
		}
        var eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';    // �ַ�����ת���blob��ַ
        var blob = new Blob([temp]);
        eleLink.href = URL.createObjectURL(blob);    // �������
        document.body.appendChild(eleLink);
        eleLink.click();    // Ȼ���Ƴ�
        document.body.removeChild(eleLink);
		return true;
	} catch (e) {
		showError("�����ļ�ʧ��: " + e);
		return false;
	}
}

export function isRunningOnVista() {
	var b;
	var s;
	var Info = navigator.appVersion;
	b = Browser(Info);
	s = System(Info);
	if (b >= 7.0 && s >= 6.0) {
		return true;
	} else {
		return false;
	}
}

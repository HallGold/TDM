/**
 * 签发证书帮助类 20180111 V1.0
 *
 */

/**
 * 用于在界面初始化时将设备名称显示到options中
 * @param theForm 页面的form
 * @param isCsp 是否为CSP设备
 */

export function setDevices(theForm, isCsp) {
    var device;

    try {
		device = new Device(DEVICE_SKF);
	} catch (e) {
		if(isIE()) { // IE浏览器异常，不用抛出异常
			return false;
		} else {
			showError('初始化证书设备失败，webcall服务连接失败。错误信息：' + e);
			return false;
		}
	}
    
    var deviceList = device.enumDevices();
    var setMicrosoftCSP = false;
    var certType = (getObjWithoutAlter('value(CERT_TYPE_NAME)') != null ? 
    		getObj('value(CERT_TYPE_NAME)').value : 'RSA');
    if (certType.indexOf('RSA') != -1 && certType.indexOf('SM2') == -1) {
        // RSA 发证 列举微软CSP + key
        setMicrosoftCSP = true;
    }
    
    var list = theForm.IeTokenList;
    
    if (list != null && list.options != null) {
        //清除原先的options
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
 * 获取介质序列号
 */
export function ReadCardNo(device) {
	return device.getDevSerialNumber();
}

/**
 * 根据name获取对象
 *
 * @param name
 * @returns
 */
export function getObj(name) {
    var obj = document.getElementsByName(name).item(0);
    if (obj == null) {
    	showError('当前页面不存在名称为\'' + name + '\'的对象!');
        return null;
    }

    return obj;
}

/**
 * 根据name获取对象，出错时没有提示信息
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
 * 根据ID获取对象
 *
 * @param name
 * @returns
 */
export function getObjById(id) {
    var obj = document.getElementById(id);
    if (obj == null) {
    	showError('当前页面不存在名称为\'' + id + '\'的对象!');
        return null;
    }

    return obj;
}

/**
 * 生成UUID
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
 * 禁用F5刷新
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
 * 是否隐藏DIV
 *
 * @param Object
 * @param bShow
 *            true 显示， false 不显示
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
 * 是否隐藏组件
 *
 * @param id
 *            ID对象
 * @param show
 *            是否显示
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
 * 系统信息，包括浏览器版本、操作系统版本
 */
export var SysInfo = {
    // 是否为Vista
    isVista: function () {
        return (this.getIeVersion() >= 7.0) && (this.getSysVersion() >= 6.0);
    },

    // IE 版本
    getIeVersion: function () {
        return Browser(navigator.appVersion);
    },

    // 操作系统版本，Win2k: 5.0, WinXP: 5,1, Vista: 6.0
    getSysVersion: function () {
        return System(navigator.appVersion);
    }
};

/**
 * 浏览器版本类型判断
 *
 * @param Info
 * @returns
 */
export function Browser(Info) {

    // info 为 navigator.appVersion
    if (Info.indexOf('rv:12.0') > -1 && Info.indexOf('Trident') > -1) {
        return 12.0;
    }
    // 自IE11开始，IE的appVersion标志改变
    else if (Info.indexOf('rv:11.0') > -1 && Info.indexOf('Trident') > -1) {

        return 11.0;
    } else {

        return parseFloat(Info.split('MSIE')[1]);
    }

}

/**
 * 浏览器类型判断
 */
export function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true;
    } else {
        return false;
    }
}

/**
 * 系统版本判断
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
 * 消息提示，可以实现成不同的提示方式
 *
 * @param msg
 * @returns
 */
export function showError(msg) {
    alert(msg);
}

/**
 * 去掉String里的'\r\n'
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
 * 判断是否为空
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
 * 读取文件，并把内容写入name标签里
 * @param input
 * @param name
 */
export function read(input, name) {
	console.log('name= ' + name)
	if (input.files.length > 1) {
		showError('只能选字一个文件！')
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
 * copy name标签的value到剪切板
 * @param name
 */
export function copy2(name) {
	var obj = document.getElementsByName(name)[0].value;
	var oInput = document.createElement('input');
    
	oInput.value = obj
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display='none';
    
    showError('复制成功');
}

/**
 * 保存文件
 * 
 * @param value
 * 		文件内容
 * @param name
 * 		文件名称
 * @param isPem
 * 		是否为pem格式,如果是pem格式。将会加上pem头尾
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
        eleLink.style.display = 'none';    // 字符内容转变成blob地址
        var blob = new Blob([temp]);
        eleLink.href = URL.createObjectURL(blob);    // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();    // 然后移除
        document.body.removeChild(eleLink);
		return true;
	} catch (e) {
		showError("保存文件失败: " + e);
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

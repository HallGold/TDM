export var enroll_webcall_service = {
    _transport: null,
    _mp: null,
    _client: null,
    _sessionid: null,
    _callback: null,
    _name: "enroll_service",

    SUCCESS: 0,  // 成功
    FAILED: -1,  // 失败

    // 连接服务
    connect_service: function (ip, port) {
        this._transport = new Thrift.TXHRTransport("http://" + ip + ":" + port.toString()),
            this._mp = new Thrift.Multiplexer(),
            this._client = this._mp.createClient(this._name, enroll_serviceClient, this._transport),
            this._sessionid = this.GetSessionID();
    },

    // SSL安全连接服务
    connect_service_with_ssl: function (ip, port) {
        this._transport = new Thrift.TXHRTransport("https://" + ip + ":" + port.toString());
        this._mp = new Thrift.Multiplexer();
        this._client = this._mp.createClient(this._name, enroll_serviceClient, this._transport);
        this._sessionid = this.GetSessionID();
    },

    // 设置错误值回调接口
    SetCallback: function (callback) {
        this._callback = callback;
    },

    // 服务返回值 {'result':'0', 'value':'xxxx', 'error':'xxxx'}
    callback_message: function (retValue) {
        if (this._callback != null) {
            this._callback(retValue);
        } else {
            alert("调用接口:" + this.callback_message.caller.name + "错误，错误消息：" + retValue.error);
        }
    },

    // 服务的版本号
    Version: function () {
        var retValue = this._client.version();
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        }
        return "{'software':'', 'enroll':'', 'signx':'', 'kmail':''}";
    },

    // 版本信息
    GetVersion: function () {
        var retValue = this._client.version();
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 重新加载所有设备
    Reload: function () {
        var retValue = this._client.reload();
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取SessionID
    GetSessionID: function () {
        var retValue = this._client.regist();
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        }
        return "00000000-0000-0000-0000-000000000000";
    },

    // 获取在线设备数量
    GetDevCount: function () {
        var retValue = this._client.get_dev_count();
        if (retValue.result == this.SUCCESS) {
            return Number(retValue.value);
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取设备名称
    // dev_index - 设备索引(注意索引下标从1开始)
    GetDeviceName: function (dev_index) {
        dev_index = arguments[0] ? arguments[0] : 1;
        var retValue = this._client.get_dev_name(this._sessionid, dev_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取设备URI
    // dev_index - 设备索引(注意索引下标从1开始)
    GetDevUri: function (dev_index) {
        dev_index = arguments[0] ? arguments[0] : 1;
        var retValue = this._client.get_dev_uri(this._sessionid, dev_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    GetDevSerialNumber: function (dev_uri) {
        var retValue = this._client.get_dev_sn(this._sessionid, dev_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取应用数量
    // dev_uri - 设备URI
    GetAppCount: function (dev_uri) {
        var retValue = this._client.get_app_count(this._sessionid, dev_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 创建应用
    CreateApp: function (dev_uri, app_name, admin_pin, admin_pin_retry_count, user_pin, user_pin_retry_count, create_file_rights = 0) {
        var retValue = this._client.create_app(this._sessionid, dev_uri, app_name, admin_pin, admin_pin_retry_count, user_pin, user_pin_retry_count, create_file_rights);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 创建应用(文件读写权限)
    CreateApp2: function (dev_uri, app_name, admin_pin, admin_pin_retry_count, user_pin, user_pin_retry_count, create_file_rights) {
        var retValue = this._client.create_app2(this._sessionid, dev_uri, app_name, admin_pin, admin_pin_retry_count, user_pin, user_pin_retry_count, create_file_rights);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 删除应用
    DeleteApp: function (dev_uri, app_name, admin_pin) {
        var retValue = this._client.del_app(this._sessionid, dev_uri, app_name, admin_pin);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取应用名称
    GetAppName: function (dev_uri, app_index) {
        var retValue = this._client.get_app_name(this._sessionid, dev_uri, app_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取应用URI
    GetAppUri: function (dev_uri, app_index) {
        var retValue = this._client.get_app_uri(this._sessionid, dev_uri, app_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 登陆APP
    LoginApp: function (app_uri, app_pin) {
        var retValue = this._client.login(this._sessionid, app_uri, app_pin);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return retValue.value;
    },

    // 注销APP
    LogOutApp: function (app_uri) {
        var retValue = this._client.logout(this._sessionid);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 创建容器
    CreateContainer: function (app_uri, container_name) {
        var retValue = this._client.create_con(this._sessionid, app_uri, container_name);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 删除容器
    DeleteContainer: function (app_uri, container_name) {
        var retValue = this._client.del_con(this._sessionid, app_uri + "|" + container_name);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取容器数量
    GetContainerCount: function (app_uri) {
        var retValue = this._client.get_con_count(this._sessionid, app_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取容器名称
    GetContainerName: function (app_uri, con_index) {
        var retValue = this._client.get_con_name(this._sessionid, app_uri, con_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取容器URI
    GetContainerUri: function (app_uri, con_index) {
        var retValue = this._client.get_con_uri(this._sessionid, app_uri, con_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 根据证书序列号获取容器URI
    GetContianerUriByCertSN: function (cert_sn) {
        var retValue = this._client.get_con_uri_by_sn(this._sessionid, cert_sn);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取证书(b64编码)
    // cert_type: 1表示签名证书，2表示加密证书
    GetCert: function (con_uri, purpose) {
        var retValue = this._client.getb64cert(this._sessionid, con_uri, purpose);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 生成签名密钥对
    // cert_type: 1表示RSA类型, 2表示SM2类型
    // purpose: 1表示签名类型, 2表示加密类型
    // key_bit_len: RSA密钥长度，仅当cert_type为1时有效。
    GenSignKeyPair: function (con_uri, cert_type, purpose, key_bit_len) {
        var retValue = this._client.genb64keypair(this._sessionid, con_uri, cert_type, purpose, key_bit_len);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 生成PKCS10请求
    GenPkcs10Req: function (con_uri, cert_dn, splite_char) {
        var retValue = this._client.gen_p10_req(this._sessionid, con_uri, cert_dn, splite_char);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 导入证书
    ImportX509Cert: function (con_uri, cert_b64) {
        var retValue = this._client.import_x509(this._sessionid, con_uri, cert_b64);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 导入密钥对
    ImportEncKeyPair: function (con_uri, keypair_asn1_b64) {
        var retValue = this._client.import_enc_keypair(this._sessionid, con_uri, keypair_asn1_b64);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 修改用户PIN码
    ChangeUserPIN: function (app_uri, old_pin, new_pin) {
        var retValue = this._client.change_usrpin(this._sessionid, app_uri, old_pin, new_pin, 0);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 解锁用户PIN码
    UnlockUserPIN: function (app_uri, admin_pin, new_pin) {
        var retValue = this._client.unlock_usrpin(this._sessionid, app_uri, admin_pin, new_pin, 0);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 修改管理员PIN码
    ChangeSOPIN: function (app_uri, old_pin, new_pin) {
        var retValue = this._client.change_sopin(this._sessionid, app_uri, old_pin, new_pin, 0);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 创建文件
    CreateFile: function (app_uri, file_name, file_size, read_rights, write_rights) {
        var retValue = this._client.create_file(this._sessionid, app_uri, file_name, file_size, read_rights, write_rights);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 写文件
    WriteFile: function (app_uri, file_name, data_b64) {
        var retValue = this._client.write_file(this._sessionid, app_uri, file_name, data_b64);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 读取文件
    ReadFile: function (app_uri, file_name) {
        var retValue = this._client.read_file(this._sessionid, app_uri, file_name);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取文件数量
    GetFileNum: function (app_uri) {
        var retValue = this._client.get_file_num(this._sessionid, app_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取文件名称
    GetFileName: function (app_uri, file_index) {
        var retValue = this._client.get_file_name(this._sessionid, app_uri, file_index);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 删除文件
    DeleteFile: function (app_uri, file_name) {
        var retValue = this._client.del_file(this._sessionid, app_uri, file_name);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取设备信息
    GetDevInfo: function (dev_uri) {
        var retValue = this._client.get_dev_info(this._sessionid, dev_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 设备认证
    VerifyDevAuth: function (dev_uri, auth_code_b64) {
        var retValue = this._client.dev_auth(this._sessionid, dev_uri, auth_code_b64);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取公钥
    GetPubKey: function (con_uri, purpose) {
        var retValue = this._client.get_pubkey(this._sessionid, con_uri, purpose);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 设置环境变量
    SetEnvString: function (env_var) {
        var retValue = this._client.set_env(this._sessionid, env_var);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 导入PFX证书
    ImportPfxCert: function (con_uri, cert_pfx_b64, cert_pass) {
        var retValue = this._client.import_pfx(this._sessionid, con_uri, cert_pfx_b64, cert_pass);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 随机数
    GenRandom: function (dev_uri, length) {
        var retValue = this._client.gen_random(this._sessionid, dev_uri, length);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 指纹接口
    Finger: function (app_uri, action_call) {
        var retValue = this._client.finger(this._sessionid, app_uri, action_call);
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },
};

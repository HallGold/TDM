export var signx_webcall_service = {
    _transport: null,
    _mp: null,
    _client: null,
    _sessionid: null,
    _callback: null,
    _name: "signx_service",

    SUCCESS: 0,  // 成功
    FAILED: -1,  // 失败

    // 连接服务
    connect_service: function (ip, port) {
        this._transport = new Thrift.TXHRTransport("http://" + ip + ":" + port.toString()),
            this._mp = new Thrift.Multiplexer(),
            this._client = this._mp.createClient(this._name, signx_serviceClient, this._transport),
            this._sessionid = this.GetSessionID();
    },

    // SSL安全连接服务
    connect_service_with_ssl: function (ip, port) {
        this._transport = new Thrift.TXHRTransport("https://" + ip + ":" + port.toString());
        this._mp = new Thrift.Multiplexer();
        this._client = this._mp.createClient(this._name, signx_serviceClient, this._transport);
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
    GetVersion: function () {
        var retValue = this._client.version();
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        }
        return "{'software':'', 'enroll':'', 'signx':'', 'kmail':''}";
    },

    // 获取SessionID
    GetSessionID: function () {
        var retValue = this._client.regist();
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        }
        return "00000000-0000-0000-0000-000000000000";
    },

    // 登陆APP
    LoginApp: function (app_uri, app_pin) {
        var retValue = this._client.login(this._sessionid, app_uri, app_pin);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return retValue.retValue;
    },

    // 注销APP
    LogOutApp: function (app_uri) {
        var retValue = this._client.logout(this._sessionid, app_uri);
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 数据签名
    SignData: function (con_uri, data_json) {
        var retValue;
        if (JSON.parse(data_json).type == "1") {
            retValue = this._client.signdata(this._sessionid, con_uri, data_json);
        } else {
            retValue = this._client.signdata(this._sessionid, con_uri + "|sig", data_json);
        }
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 验证签名
    VerifyData: function (con_uri, src_data_b64, signed_data_b64) {
        var retValue = this._client.verify_signdata(this._sessionid, con_uri + "|sig", src_data_b64, signed_data_b64)
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 数据签名pkcs7
    SignMessage: function (con_uri, data_b64, b_attach_data) {
        var retValue = this._client.signmessage(this._sessionid, con_uri + "|sig", data_b64, b_attach_data)
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 验证签名pkcs7
    VerifyMessage: function (con_uri, src_data_b64, signed_data_b64) {
        var retValue = this._client.verify_message(this._sessionid, con_uri + "|sig", src_data_b64, signed_data_b64)
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 外部密钥数据签名
    EXT_EccSignData: function (con_uri, ecc_priblob_b64, src_data_b64) {
        var retValue = this._client.ext_eccsigndata(this._sessionid, con_uri + "|sig", ecc_priblob_b64, src_data_b64)
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 外部密钥验证签名
    EXT_EccVerifyData: function (con_uri, ecc_pubblob_b64, src_data_b64, signed_data_b64) {
        var retValue = this._client.ext_eccverify(this._sessionid, con_uri + "|sig", ecc_pubblob_b64, src_data_b64, signed_data_b64)
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 外部证书验证签名
    EXT_EccVerifyDataEx: function (con_uri, ecc_cert_b64, src_data_b64, signed_data_b64) {
        var retValue = this._client.ext_eccverify_ex(this._sessionid, con_uri + "|sig", ecc_cert_b64, src_data_b64, signed_data_b64)
        if (retValue.result == this.SUCCESS) {
            return retValue.result;
        } else {
            this.callback_message(retValue);
        }
        return this.FAILED;
    },

    // 获取全部证书
    // 参数：
    // - cert_flag_bits: 获取证书内容的类型，包括证书摘要、证书序列号
    //   此参数使用8位二进制bit区分，当组合使用时，按照高低位依次连接，如下：
    //   00000001 - 证书摘要，摘要算法SHA1
    //   00000010 - 证书摘要，摘要算法SHA256
    //   00000100 - 10进制证书序列号
    //   00001000 - 16进制证书序列号
    // - with_splite: 多个容器URI的分隔符，如果指定为空值，则使用'####'分割
    GetAllCerts: function (cert_flag_bits, with_splite) {
        var retValue = this._client.get_all_con_uri(this._sessionid, cert_flag_bits, with_splite)
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 获取证书
    GetCert: function (con_uri, purpose) {
        var retValue = this._client.getb64cert(this._sessionid, con_uri, purpose)
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    },

    // 复制证书
    DuplicateCert: function (con_uri, purpose, cert_type = 1, bits = 1024, template = "", x509_extension = "", digest = 4, reserve = "") {
        var retValue = this._client.dupb64cert_with_template(this._sessionid, con_uri, purpose, cert_type, bits, template, x509_extension, digest, reserve)
        if (retValue.result == this.SUCCESS) {
            return retValue.value;
        } else {
            this.callback_message(retValue);
        }
        return "";
    }
};

import devComm from "@/pages/biz/dev/js/comm/devComm.js"
export default {
    mixins:[devComm],
    data() {
        return {
            //根据许可类型的不同来显示或隐藏的相关属性
            isLicense: false,
            isLicenseFile: false,
            isValidDate: false,
            isCheckReportFile: false,
            isCheckResultFile: false,
        };
    }, methods: {
        /**
         * 根据许可类型来显示或隐藏相应的内容
         * */
        initFileInfo(data) {
            if (data.licenseType == this.ENUMS.PERMISSION_TYPE_DATA.FILE) {//类型为许可文件
                this.isLicense = false;     //隐藏许可序列号
                this.isLicenseFile = true;  //展示许可附件
                this.isValidDate = true;    //展示许可有效期
            } else if (data.licenseType == this.ENUMS.PERMISSION_TYPE_DATA.NUM) {//类型为许可序列号
                this.isLicense = true;     //展示许可序列号
                this.isLicenseFile = false;  //隐藏许可文件
                this.isValidDate = true;    //展示许可有效期
            } else if (data.licenseType == this.ENUMS.PERMISSION_TYPE_DATA.NULL) {//类型为无
                this.isLicense = false;     //隐藏许可序列号
                this.isLicenseFile = false; //隐藏许可文件
                this.isValidDate = false;   //隐藏许可有效期
            }
            if (data.passOfflineValid) {		    //当部署模式的passOfflineValid属性为true
                this.isCheckReportFile = true;  //显示评测报告
                this.isCheckResultFile = true;  //显示评测结论
            } else {
                this.isCheckReportFile = false;  //隐藏评测报告
                this.isCheckResultFile = false;  //隐藏评测结论
            }
        },
    }
}
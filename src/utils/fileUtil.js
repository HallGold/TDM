export default {
    fileSizeFormat(fileSize) {
        if(typeof(fileSize) == 'undefined'){
            return '未知';
        }
        return fileSize / 1024 / 1024 >= 1024 ? (fileSize / 1024 / 1024 / 1024).toFixed(2) + 'G' :
            (fileSize / 1024 / 1024 >= 1 ? (fileSize / 1024 / 1024).toFixed(2) + 'MB'
                : (fileSize / 1024 >= 1 ? (fileSize / 1024).toFixed(0) + 'KB' :
                    fileSize.toFixed(0) + 'B'));
    },
    getSoftWareDefaultImg(cal){
        this.$axios.get("/biz/BizSoftwareConstant/dft/img", {
            "params": {}
        }).then(success => {
            cal(success.data);
        }).catch(error => {
            console.error(error)
            //this.$message.error('获取默认图片失败');
        });
    }
}
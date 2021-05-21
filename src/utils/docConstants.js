import Vue from "vue";
import jquery from 'jquery'

export default {
    data() {
        return {
            dataSecretLevcode_pdm: {},
            url1: "http://localhost:6800/jsonrpc", //"",
        }
    },

    created() {
        // this.$axios.get("/pdm/PdmDocument/getDataSecretLevcode")
        //     .then(result => {
        //         this.dataSecretLevcode_pdm = result.data
        //     })
        //     .catch(error => {
        //         if (error.msg) {
        //             this.$alert(error.msg, '提示', {
        //                 confirmButtonText: '确定',
        //             });
        //         }
        //     })
        //     .finally(_ => {
        //
        //     })
    },
    methods: {
        // 查看文件
        lookFile(row) {
            console.log(row);
            // this.$router.push({path: "/pdm/PdmInteVue/callInteVueOut", query:{fileName: row.filename, dataId: row.dataid} });
            // window.onload
            // return
            this.$root.$children[0].loading = true;
            this.$axios.get("/pdm/PdmInteVue/callInteVueOut", {
                params: {
                    fileName: row.filename,
                    dataId: row.dataid
                }
            })
                .then(result => {
                    // this.assignment(result);
                    //"http://192.168.30.32:9000/PDM/temp/deaccb5bfd091e366759ab28908f4f2c//deaccb5bfd091e366759ab28908f4f2c1597799707781.xml"
                    let res = this.downloadInteVue(result.data, "C:/temp/" + result.data.pathid);
                    console.log(res);
                })
                .catch(error => {
                    this.$message.error("查看文件失败");
                })
                .finally(_ => {
                    this.$root.$children[0].loading = false;
                })
        },
        sleep(delay) {
            var start = (new Date()).getTime();
            while ((new Date()).getTime() - start < delay) {
                continue;
            }
        },
        async downloadInteVue(array, filePath) {
            let temp = '';
            for(let item of array.path){
                if(item.endsWith(".xml")){
                    temp = item;
                    break;
                }
            }
            let a = temp.split('//');

            let xml = a[a.length - 1];
            let dataxml = array.InteVuePrefix + filePath + '/' + xml;
            console.log(dataxml)
            array = array.path;
            let urlArray = [];
            console.log(123);
            let myDate = new Date();
            let mytime = parseInt(new Date().getTime(), 16);///myDate.getTime();
            let bo = true;
            let result = await this.downloadFiles(mytime, array, filePath);
            for (let i = 0; i < result.length; i++) {
                if (!result[i].hasOwnProperty("result")) {
                    alert("系统异常,请稍后重试！");
                    bo = false;
                    break;
                }
                let stateResult = await this.checkState(result[i].result);
                console.log(stateResult);

                let state = await this.checkState(result[i].result);
                console.log(state.status);
                while (state.status != "complete") {
                    if (state.status == "error") {
                        alert(",文件下载到本地失败，请稍后重试！");
                        bo = false;
                        break;
                    }
                    this.sleep(2000);
                    state = await this.checkState(result[i].result);
                }
                //window.setTimeout(function () {},10000);
                if (state.errorCode !== "0") {
                    alert("文件下载到本地出错!");
                    bo = false;
                    break;
                }
            }
            if (bo) {
                window.open(dataxml);
            }
        },
        downloadFiles(mytime, urlArray, filePath) {

            let downData = [];
            for (let i = 0; i < urlArray.length; i++) {//
                downData.push({
                    "jsonrpc": "2.0",
                    "method": "aria2.addUri",
                    "id": mytime,
                    "params": [
                        [urlArray[i]], {
                            "split": "5",
                            "max-connection-per-server": "5",
                            "seed-ratio": "0",
                            "dir": filePath
                        }
                    ]
                });
            }
            console.log(downData);
            //
            return this.test('123', downData);


            /**return new Promise((resolve, reject) => {
                try {
                    setTimeout(() => {
                        let downData = [{
                            "jsonrpc": "2.0",
                            "method": "aria2.addUri",
                            "id": mytime,
                            "params": [
                                ["http://192.168.0.92:9000/PDM/temp/12.jpg"], {
                                    "split": "5",
                                    "max-connection-per-server": "5",
                                    "seed-ratio": "0",
                                    "dir": filePath
                                }
                            ]
                        }];
                        console.log(downData);
                        //
                       return this.test('123',downData);

                    }, 0)
                } catch (e) {
                    console.error(e)
                    reject(new Error('下载失败'))
                }
            })
             */
        },
        //执行arr2 下载文件到客户端
        test(url1, downData) {
            console.log(downData);
            let result = null;
            jquery.ajax({
                url: this.url1,
                data: JSON.stringify(downData),
                type: "post",
                async: false,//false为同步
                dataType: "JSON",
                success: function (obj) {


                    //result = obj[0].hasOwnProperty("result");
                    result = obj;
                    console.log(result);
                },
                error: function (er) {
                    console.log(er);
                }
            });
            return result;
        },
        test2(downData) {
            console.log(downData);
            jquery.ajax({
                url: this.url1,
                data: JSON.stringify(downData),
                type: "post",
                async: false,//false为同步
                dataType: "json",
                success: function (obj) {
                    console.log("333>>>>>", obj)
                }
            });


        },
        checkState(id) {
            let result = "";
            /*window.setTimeout(function () {*/
            let downData = [{
                "jsonrpc": "2.0",
                "method": "aria2.tellStatus",//getGlobalStat
                "id": "qwer",
                "params": [
                    id
                ]
            }]
            jquery.ajax({
                url: this.url1,
                data: JSON.stringify(downData),
                type: "post",
                async: false,//false为同步
                dataType: "json",
                success: function (obj) {
                    result = obj[0].result;
                    console.log("333>>>>>", obj)
                }
            });
            /*},2000);*/
            return result;
        },
    },
    computed: {}
}

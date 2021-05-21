import codeConfig from './codeConfig'

export default {
    methods: {
        // 获取编码
        loadProjectCode(params) {
            let config = codeConfig[params.name];
            let par = {};
            if (config.extra) {
                par = {
                    'code': config.code,
                    iba: [
                        {
                            [config.extra]: params.param
                        }
                    ]
                };
            } else {
                par = {
                    'code': config.code,
                };
            }
            return new Promise((resolve, reject) => {
                this.$axios.post("/pdm/PdmObject/generateObjectNumber", par).then(result => {
                    resolve(result.data)
                    // if (result.success) {
                    //
                    // } else {
                    //     this.$message.success(result.msg)
                    // }
                })
                    .catch(error => {
                        reject(error)
                    })
                    .finally(_ => {

                    })
            })

        },
    }
}
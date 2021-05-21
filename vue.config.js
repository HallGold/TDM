module.exports = {
    // baseUrl: './',
    outputDir: 'tdm',
    publicPath: '/tdm/',
    productionSourceMap: false,
    /*    transpileDependencies: ['floweditor'/!*, 'iview'*!/],*/
    devServer: {
        proxy: {
            // '/api/resources/': {
            //     target: 'http://x23178478p.iok.la:8088',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // },
            /*     '/api/bpm': {
                     target: 'http://localhost:8077/',
                     pathRewrite: {
                         '/api': '/'
                         192.168.199.100:8066
                     }
                 },*/
            /*'/api/biz': {
                target: 'http://10.99.12.70:8074',
                pathRewrite: {'^/api': '/'}
            },*/
            // '/api/tdm': {
            //     //target: 'http://localhost:8075',
            //     target: 'http://192.168.30.68:8075',
            //     //target: 'http://192.168.30.54:8075',
            //     //target: 'http://192.168.30.24:8075',
            //     //target: 'http://192.168.30.20:8075',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // },
            '/api': {
                // target: 'http://192.168.30.11:6666',
                target: 'http://192.168.2.20:5001',
                changeOrigin: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
            /*,*/

            /*'/api': {
                target: 'http://x23178478p.iok.la:5555',
                changeOrigin: false,
                pathRewrite: {'^/api': ''}
            }*/
            /*,
          '/ms': {
              target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
              changeOrigin: true
          }*/
            // port: 8000, //端口号
        }
    }
}
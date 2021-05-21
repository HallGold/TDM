module.exports = {
    presets: [[
        '@vue/app',
        {
            polyfills: [
                'es6.promise',
                'es6.symbol'
            ]
        }
    ]]/*,
    "plugins":
        ["@babel/plugin-transform-runtime",
            ["import", {
                "libraryName": "iview",
                "libraryDirectory": "src/components"
            }]]*/
}

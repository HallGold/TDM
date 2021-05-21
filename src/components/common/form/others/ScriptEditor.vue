<template>
    <div>
        <el-button @click="visible=true" unauth>脚本编辑
        </el-button>
        <span :class="{'el-icon-finished':(value||value===false)?true:false}" style="color: #00a854"></span>
        <ice-dialog title="脚本编辑" :visible.sync="visible" width="1200px" height="560px" :buttons="buttons">
            <div style="width: 100%;height: 100%;display: flex">
                <IceJsEditor v-model="script" width="950px" height="560px" ref="editor" element-loading-text="代码编译中"
                             v-loading="loading">

                </IceJsEditor>
                <div style="width: 230px;display: flex;flex-direction: column">
                    <div class="title">脚本文档说明</div>
                    <div style="flex-grow: 1;position: relative">
                        <div class="ice-full-absolute">
                            <vue-scroll :ops="{bar: {background: '#000', opacity: 0}}">
                                <el-collapse value="1" accordion>
                                    <el-collapse-item title="作用域参数列表" name="1">
                                        <div>参数绑定在this作用域，通过this.XXX方式使用，包括对象、函数等</div>
                                        <div>例如：this.$("input") 、this.formData</div>
                                        <ol>
                                            <li>formData:页面数据对象，页面所有数据组件会绑定在此对象上，
                                                可以用于获取控件数据值或者设置控件数据值，如：
                                                const a = this.formData.input（this.formData.控件编码)
                                            </li>
                                            <li>
                                                pageProps:页面参数对象，传递至本页面的所有外部参数
                                            </li>
                                            <li>
                                                getComponentByCode/$:通过控件编码获取控件实例,$为该方法简写
                                            </li>
                                            <li>
                                                $vue:当前页面vue对象,不推荐直接使用
                                            </li>
                                            <li>
                                                $axios:用于Ajax数据请求
                                            </li>
                                            <li>
                                                $nextTick:js下一个时间循环执行，参数为function
                                            </li>
                                            <li>
                                                $message:消息对象，用于页面消息提醒
                                            </li>
                                            <li>
                                                $confirm:弹出确认
                                            </li>
                                            <li>
                                                $notify:消息通知
                                            </li>
                                            <li>
                                                $userInfo:当前登录用户信息
                                            </li>
                                            <li>
                                                $loading:loading对象
                                            </li>
                                            <li>
                                                $flowContext:流程上下文数据,此属性只在流程表单页面中有效
                                            </li>
                                            <li>
                                                validatePage:快速校验整个页面数据合法性
                                            </li>
                                            <li>
                                                resetPage:快速重置页面数据
                                            </li>
                                            <li>
                                                loadPageData:更新页面数据
                                            </li>
                                            <li>
                                                reRenderPageData:刷新页面，防止页面数据未及时更新，请慎用
                                            </li>
                                            <li>
                                                openPage:弹出层弹出新页面
                                            </li>
                                            <li>
                                                close:关闭当前弹出层，只能在弹出页面调用此方法
                                            </li>
                                        </ol>
                                    </el-collapse-item>

                                    <el-collapse-item title="页面属性说明" name="2">
                                        <ol>
                                            <li>
                                                <span>页面名称:</span>
                                            </li>
                                            <li>
                                                <span>页面KEY:</span>页面唯一标识符
                                            </li>
                                            <li>
                                                <span>是否流程页面:</span>申明此页面是否作为流程表单页面
                                            </li>
                                            <li>
                                                <span>dataLoader(非流程表单页面):</span>页面数据加载器，用于加载本页面数据，参数pageId（当前页面KEY）
                                            </li>
                                            <li>
                                                <span>pageOnload(非流程表单页面):</span>页面配置信息加载完成回调事件
                                            </li>
                                            <li>
                                                <span>dataOnload(非流程表单页面):</span>页面数据加载完成回调事件
                                            </li>
                                        </ol>
                                    </el-collapse-item>

                                </el-collapse>
                            </vue-scroll>

                        </div>
                    </div>
                </div>
            </div>

        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../base/IceDialog";
    import IceJsEditor from "../../base/iceJsEditor/IceJsEditor";
    import {Message} from 'element-ui';
    import VueScroll from 'vuescroll'


    export default {
        name: "ScriptEditor",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: [Object, String, Boolean],
            initValueModel: {
                type: String,
                default: 'null'
            },
            initScript: String
        },
        data() {
            return {
                script: this.getScriptFromProp(),
                visible: false,
                loading: false,
                buttons: [{
                    name: '确定', click: () => {
                        this.loading = true;
                        return new Promise((resolve, reject) => {

                            if (!this.script) {
                                resolve(true)
                                this.visible = false;
                                this.loading = false;
                                this.$emit("change", "")
                                return
                            }

                            setTimeout(_ => {
                                const script = new IceScript(this.script);
                                script.build(result => {
                                    if (result) {
                                        resolve(true)
                                        this.visible = false
                                        this.$emit("change", script)
                                    } else {
                                        reject(false)

                                    }
                                    this.loading = false;

                                });
                            }, 100)


                        })

                    }
                }, {iscannel: true, name: '取消'}]
            }
        },
        methods: {
            getInitScript() {
                switch (this.initValueModel) {
                    case "function":
                        return '(function(){\n\t\n  \n  \n})\n';
                    case "express":
                        return '(function(){\n\t\n  \n  \n})()\n';
                    default:
                        return this.initScript
                }
            },
            getScriptFromProp() {
                if (this.value || this.value === false) {

                    if (typeof this.value === 'boolean') {
                        return `(function(){\n\t\n return ${this.value}; \n  \n})\n`
                    } else if (typeof this.value === 'string') {
                        return this.value
                    } else {
                        return this.value.editExpress
                    }

                } else {
                    return this.getInitScript();
                }
            }
        },
        watch: {
            visible() {
                if (this.visible) {
                    this.script = this.getScriptFromProp()
                    this.$nextTick(() => {
                        this.$refs.editor.setValue(this.script);
                    })
                }
            },
            value(newValue) {
                this.script = this.getScriptFromProp()
                if (typeof newValue === 'string' && newValue.trim()) {
                    const script = new IceScript(this.script);
                    script.build(result => {
                        if (result) {
                            this.$emit("change", script)
                        }
                    });
                }


            }
        },
        components: {IceJsEditor, IceDialog, VueScroll}
    }


    export class IceScript {
        constructor(editExpress, buildExpress) {
            this.editExpress = editExpress;
            this.buildExpress = buildExpress;
            this.funaction = null;
        }

        async build(next) {
            const babel = await import(/* webpackChunkName: "scriptbuilder" */"@babel/core")
            const jsx = await import(/* webpackChunkName: "scriptbuilder" */"babel-plugin-transform-vue-jsx")
            const commonjs = await import(/* webpackChunkName: "scriptbuilder" */"@babel/plugin-transform-modules-commonjs")
            const preset = await import(/* webpackChunkName: "scriptbuilder" */"@babel/preset-env")


            babel.transform(this.editExpress, {
                plugins: [
                    jsx,//编译jsx
                    [commonjs, {//取消严格模式，否则函数内部this指向失效
                        strictMode: false
                    }]
                ],
                presets: [
                    [preset,//设置babel编辑目标
                        {
                            "targets": {
                                "chrome": "48",
                                "ie": "10"
                            }
                        }]
                ]
            }, (err, result) => {

                if (err) {
                    console.error(err)
                    Message.error("js编译错误:" + err.message);
                    next(false);
                } else {
                    this.buildExpress = result.code
                    //this.funaction = (0, eval)(result.code)
                    next(true);
                }


            })
        }


        getFunAction() {
            // this.funaction = (0, eval)(this.buildExpress)
            if (this.buildExpress) {
                return (0, eval)(this.buildExpress);
            }
            if (this.editExpress) {
                return (0, eval)(this.editExpress);
            }
        }


    }

</script>

<style scoped lang="less">
    .title {
        width: 100%;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }

    ol {
        list-style-type: none;
        counter-reset: sectioncounter;
        /*width: 200px;*/
        color: #897265;
    }

    ol li {
        padding: 5px 0;

        span {
            color: #222;
        }
    }

    ol li:before {
        content: counter(sectioncounter) "、";
        counter-increment: sectioncounter;
    }

</style>
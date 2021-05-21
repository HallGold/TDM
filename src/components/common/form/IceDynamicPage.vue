<script>

    import layouts from './layouts'
    import panels from './panels'
    import eleitems from './eleitems'
    import ComponentsStore from "./store/ComponentsStore";
    import ComponentsUtils from "./componentsUtils";
    import {Loading} from 'element-ui';
    import IceDialog from "../base/IceDialog";
    import IceScript from '@/components/common/form/others/IceJScript.js'

    export default {
        name: "IceDynamicPage",
        props: {
            //页面id
            pageId: String,
            //是否预览
            isPreview: Boolean,
            previewJson: Object,


            //页面配置信息加载器
            pageConfigLoader: {
                type: Function,
                default: async function (pageCode) {
                    const {data: {pageJsonData}} = await this.$axios.get('/devtool/PageDefinition/getByCode', {params: {pageCode: pageCode}});
                    if (!pageJsonData) {
                        return null
                    }
                    /*await new Promise(resolve => {
                        setTimeout(_ => {
                            resolve()
                        }, 3000)
                    })*/
                    return JSON.parse(pageJsonData);
                }
            },

            //页面数据加载器function、promise
            pageDataLoader: {
                type: [Function, Object],
                default: function () {
                    if (this.pageConfig.dataLoader) {
                        const dataLoader = new IceScript(this.pageConfig.dataLoader.editExpress, this.pageConfig.dataLoader.buildExpress)
                        return dataLoader.getFunAction().call(this.getScriptContext())
                    }
                }
            },
            pageProps: Object//页面参数对象
        },
        data() {
            return {
                mainLayout: '',//入口main
                formData: {},//页面数据对象
                componentsStore: new ComponentsStore(),//页面组件管理
                jsonData: '',//页面配置信息对象
                readonly: false,//页面是否只读
                reRenderTime: new Date().getTime() + "",//用于rerender页面
                pageConfig: {//页面基本配置信息
                    pageName: "",
                    globalForm: false,
                    dataLoader: '',
                    pageOnload: '',
                    dataOnload: ''
                },
                dialogConfig: {
                    width: '900px'
                },//弹出层配置信息
                dialogVisible: false,
                flowContext: null,
                //有时页面配置信息加载会比流程数据加载缓慢，导致流程数据无法设置，这里临时存储
                tempBizData: null
            }
        },
        methods: {
            getComponentById(id) {
                return this.componentsStore.getComponentById(id)
            },
            getFieldValue(field) {
                return this.formData[field];
            },
            getFormData() {
                if (this.pageConfig.isFlowPage === '1' && this.pageConfig.dataOutBound) {
                    const dataOutBound = new IceScript(this.pageConfig.dataOutBound.editExpress, this.pageConfig.dataOutBound.buildExpress)
                    return dataOutBound.getFunAction().call(this.getScriptContext(), this.formData)
                } else {
                    return this.formData;
                }

            },
            async setFormData(formData, full = true) {
                if (this.mainLayout) {
                    let t_formData = {}
                    if (full) {
                        t_formData = formData
                    } else {
                        t_formData = {...this.formData, ...formData};
                    }
                    if (this.pageConfig.isFlowPage === '1' && this.pageConfig.dataInBound) {
                        const dataInBound = new IceScript(this.pageConfig.dataInBound.editExpress, this.pageConfig.dataInBound.buildExpress)
                        this.formData = await dataInBound.getFunAction().call(this.getScriptContext(), t_formData)
                    } else {
                        this.formData = t_formData;
                    }
                } else {
                    this.tempBizData = {formData, full};
                }

            },

            async flowOperateBtn(flowContext) {
                if (this.pageConfig.isFlowPage === '1' && this.pageConfig.flowOperate) {
                    const flowOperate = new IceScript(this.pageConfig.flowOperate.editExpress, this.pageConfig.flowOperate.buildExpress)
                    return await flowOperate.getFunAction().call(this.getScriptContext(), flowContext)
                }
                return true;
            },

            setFlowContext(flowContext) {
                this.flowContext = flowContext;
                // debugger

                this.readonly = this.flowContext.getFormReadonly();

            },

            getScriptContext() {
                return {
                    //1、formData对象
                    formData: this.formData,
                    pageProps: this.pageProps,
                    //2、获取元素方法
                    getComponentByCode: code => this.componentsStore.getComponentByCode(code),
                    //3、axios对象
                    $: code => this.componentsStore.getComponentByCode(code),
                    $vue: this,
                    $axios: this.$axios,
                    $nextTick: this.$nextTick,
                    $message: this.$message,
                    $confirm: this.$confirm,
                    $userInfo: this.$userInfo,
                    $notify: this.$notify,
                    $flowContext: this.flowContext,
                    $loading: options => {
                        return Loading.service({text: '请稍候...', target: this.$el, ...options})
                    },
                    //4、校验页面数据包括form、table等
                    validatePage: callback => {

                        const components = this.componentsStore.getAllComponents();
                        const validatePromises = [];
                        for (let id in components) {
                            let component = components[id];
                            if (component.name == 'formpanel' || (component.name == 'tablepanel' && component.attrs.editable)) {
                                validatePromises.push(new Promise((resolve, reject) => {

                                    component.validate((valid, invalidFields) => {
                                        resolve({valid, invalidFields})
                                    })
                                }))
                            }
                        }
                        Promise.all(validatePromises).then(values => {
                            let valid = true;
                            let invalidFields = {}
                            values.forEach(item => {
                                if (!item.valid) {
                                    valid = false
                                }
                                Object.assign(invalidFields, item.invalidFields)
                            })
                            if (callback) {
                                callback(valid, invalidFields);
                            }

                        }).catch(e => {
                            console.error(e)
                        })
                    },
                    //reset整个页面数据
                    resetPage: () => {

                        const components = this.componentsStore.getAllComponents();
                        for (let id in components) {
                            let component = components[id];
                            if (component.name == 'formpanel') {
                                component.resetFields()
                            }
                        }

                    },
                    //5、加载页面数据
                    loadPageData: pageData => {
                        this.formData = {...this.formData, ...pageData}
                    },
                    //6、刷新页面数据，防止页面数据未及时更新
                    reRenderPageData: () => {
                        this.formData = {...this.formData};
                        /*if (this.dialogConfig && this.dialogConfig.$propsFun) {
                            this.dialogConfig.props = this.dialogConfig.$propsFun();
                        }*/
                    },
                    //7、弹出页面
                    openPage: (params) => {

                        const dialogConfig = {
                            title: '标题',
                            remounted: false,
                            pageId: '',
                            fileUrl: '',
                            height: '500px',
                            width: '900px',
                            props: {}
                        }

                        const mergedParams = Object.assign({}, dialogConfig, params)
                        //支持props是function,主要用于动态属性
                        if (mergedParams.props && typeof mergedParams.props == 'function') {
                            mergedParams.$propsFun = mergedParams.props;
                            mergedParams.props = mergedParams.props();

                        }


                        mergedParams.props.$closeDialog = this.closeDialog
                        mergedParams.props.$confirm = mergedParams.confirm
                        mergedParams.props.$cancel = mergedParams.cancel

                        if (mergedParams.buttons) {
                            mergedParams.buttons.forEach(button => {

                                button.click = (button, data) => {
                                    if (button.iscannel) {
                                        if (mergedParams.cancel) {
                                            return mergedParams.cancel(button, data);
                                        }
                                    } else {
                                        if (mergedParams.confirm) {
                                            return mergedParams.confirm(button, data);
                                        }
                                    }
                                    return true;
                                }
                            })
                        }


                        this.dialogConfig = mergedParams
                        this.dialogVisible = true;

                        // })
                    },
                    close: (this.pageProps && this.pageProps.$closeDialog) ? (...params) => this.pageProps.$closeDialog(this, ...params) : () => {
                        console.error(`非弹出页面无法关闭dialog`)
                    }

                }
            },
            async loadPage() {
                let loadingInstance1;
                if (document.getElementById("$base-content")) {
                    loadingInstance1 = Loading.service({target: document.getElementById("$base-content")});
                } else {
                    loadingInstance1 = Loading.service({fullscreen: true});
                }


                //TODO页面配置信息加载逻辑

                let pageId = this.$route.query.page;
                if (this.pageId) {
                    pageId = this.pageId
                }


                if (this.isPreview) {
                    this.jsonData = this.previewJson
                } else {
                    if (this.pageConfigLoader && typeof this.pageConfigLoader == 'function') {
                        try {
                            this.jsonData = await this.pageConfigLoader(pageId)
                        } catch (e) {
                            this.$message.error("加载页面配置失败")
                            return
                        }

                    }
                    if (!this.jsonData) {
                        this.$message.error("没有加载到页面配置信息")
                        return;
                    }
                }


                const components = this.jsonData.components;
                for (let id in components) {
                    const component = components[id];
                    const clazz = this.componentsStore.getComponentClassByName(component.name)
                    const componentObj = new clazz(this);
                    componentObj.recoverSnapshoot(component);
                }
                this.pageConfig = this.jsonData.pageConfig;
                this.mainLayout = this.jsonData.mainLayout;


                //页面配置信息加载完成回调事件
                this.$nextTick(async () => {

                    //当表单数据在页面数据之前获取则重新设置并清空
                    if (this.tempBizData) {
                        this.setFormData(this.tempBizData.formData, this.tempBizData.full)
                        this.tempBizData = null
                    }

                    if (this.pageConfig.pageOnload && this.pageConfig.isFlowPage !== '1') {

                        const pageOnload = new IceScript(this.pageConfig.pageOnload.editExpress, this.pageConfig.pageOnload.buildExpress)
                        await pageOnload.getFunAction().call(this.getScriptContext())

                    }

                    //TODO数据加载逻辑
                    await this.loadPageData()
                    loadingInstance1.close()
                })
            },
            async loadPageData() {

                if (this.pageDataLoader && this.pageConfig.isFlowPage !== '1') {
                    let pageData;
                    try {
                        if (this.pageConfig.isFlowPage !== '1') {
                            if (typeof this.pageDataLoader == 'function') {
                                pageData = await this.pageDataLoader(this.pageId)
                            } else {
                                pageData = await this.pageDataLoader;
                            }
                        } else {
                            pageData = {}
                        }


                        /*if (this.pageConfig.isFlowPage === '1' && this.pageConfig.dataInBound) {
                            const dataInBound = new IceScript(this.pageConfig.dataInBound.editExpress, this.pageConfig.dataInBound.buildExpress)
                            pageData = await dataInBound.getFunAction().call(this.getScriptContext(), pageData)
                        }*/

                        this.formData = {...this.formData, ...pageData};

                        console.log(this.formData, "============================")

                        this.$nextTick(() => {
                            if (this.pageConfig.dataOnload && this.pageConfig.isFlowPage !== '1') {
                                const dataOnload = new IceScript(this.pageConfig.dataOnload.editExpress, this.pageConfig.dataOnload.buildExpress)
                                dataOnload.getFunAction().call(this.getScriptContext())
                            }
                        })
                    } catch (e) {
                        console.error(e)
                        this.$message.error("数据加载失败")
                    }


                }
            },
            async closeDialog(parent, isConfirm = true, button = {}) {
                const loading = Loading.service({text: '请稍候...', target: this.$refs['ice-dialog'].$el});
                if (isConfirm) {
                    if (parent.pageProps.$confirm) {
                        try {
                            const result = await parent.pageProps.$confirm(button, parent.getScriptContext());
                            if (result !== false) {
                                this.dialogVisible = false;
                            }
                        } catch (e) {
                            this.$message.error(e)
                        }

                    } else {
                        this.dialogVisible = false;
                    }

                } else {
                    if (parent.pageProps.$cancel) {
                        try {
                            const result = await parent.pageProps.$cancel(button, parent.getScriptContext());
                            if (result !== false) {
                                this.dialogVisible = false;
                            }
                        } catch (e) {
                            this.$message.error(e)
                        }

                    } else {
                        this.dialogVisible = false;
                    }

                }
                loading.close();
            }
        },
        created() {
            for (let layoutName in layouts) {
                this.componentsStore.addComponentInfoByName(layouts[layoutName].meta.name, layouts[layoutName])
            }
            for (let panelName in panels) {
                this.componentsStore.addComponentInfoByName(panels[panelName].meta.name, panels[panelName])
            }
            for (let eleitemName in eleitems) {
                this.componentsStore.addComponentInfoByName(eleitems[eleitemName].meta.name, eleitems[eleitemName])
            }


            this.$nextTick(() => {
                this.loadPage();
            })


        },
        render(h) {
            if (this.mainLayout && this.reRenderTime) {
                const component = this.getComponentById(this.mainLayout)
                return <div style="height:100%;width:100%" class="ice-dynamic-page">
                    {component.render(h)}
                    <ice-dialog title={this.dialogConfig.title}
                                visible={this.dialogVisible}
                                remounted={this.dialogConfig.remounted}
                                page-id={this.dialogConfig.pageId}
                                file-url={this.dialogConfig.fileUrl}
                                width={this.dialogConfig.width}
                                height={this.dialogConfig.height}
                                buttons={this.dialogConfig.buttons}
                                page-props={this.dialogConfig.props}
                                confirm-handler={this.dialogConfig.confirm}
                                cancel-handler={this.dialogConfig.cancel}
                                ref="ice-dialog"
                                {...{
                                    "on": {
                                        "update:visible": value => {
                                            this.dialogVisible = value;
                                        },
                                    }
                                }
                                }>

                    </ice-dialog>
                </div>
            }
        },
        watch: {
            pageId() {
                this.loadPage()
            },
            pageDataLoader() {
                this.loadPageData();
            }
        },
        mounted() {

        },
        components: {
            IceDialog,
            ...ComponentsUtils.resolve(layouts, panels, eleitems)
        }
    }
</script>

<style lang="less">
    .ice-dynamic-page {
        .vue-grid-item {
            transition: none;
        }

        .el-form-item--small.el-form-item {
            height: calc(100% - 18px);
            /* display: flex;
             align-items: center;*/

            .el-form-item__label {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }

            .el-form-item__content {
                height: 100%;
                /*display: flex;*/
                /*align-items: center;*/
            }
        }

    }
</style>
<script>
    import layouts from './layouts'
    import panels from './panels'
    import eleitems from './eleitems'
    import ComponentsStore from "./store/ComponentsStore";
    import ComponentsUtils from "./componentsUtils";
    import IceLabel from "../base/IceLabel";
    import KeyValueEditable from "./others/KeyValueEditable";
    import VueScroll from 'vuescroll'
    import IceDialog from "../base/IceDialog";
    import PageInfoEditor from "./others/PageInfoEditor";

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    export default {
        name: "IcePageEditor",
        props: {
            cancel: Function,
            save: Function,
            pageDesignData: Object
        },
        data() {
            return {
                componentsStore: new ComponentsStore(),//组件数据仓库
                registedComponents: {},//已注册组件清单
                componentsExpand: ['layouts', 'panels', 'eleitems'],
                mainLayout: '',//入口main
                dragingType: '',//正在拖拽的组件类型
                dragingName: '',//正在拖拽的组件名称
                dragingComponent: null,//正在拖拽的组件
                parentId: '',//正在拖拽时被放置的父元素ID
                operateBar: null,
                clickedELe: null,
                previewDialogVisible: false,
                formData: {},//表单数据//
                reRenderTime: new Date().getTime() + "",//用于重新渲染页面，防止数据发生变化页面不更新
                pageConfig: {pageName: ""},//页面配置信息
                previewJson: {}//预览时生成的临时json，用于页面预览
            }
        },
        methods: {
            renderIcon(h, items) {
                return items.map(item => {
                    if (item.meta.icon) {
                        return <div class="ele-wrapper"
                                    draggable="true"
                                    on-dragstart={evt => this.dragstart(evt, item.meta.type, item.meta.name)}
                                    on-dragend={evt => this.dragend(evt, item.meta.type, item.meta.name)}>
                            {item.meta.icon(h)}
                        </div>
                    }
                })

            },
            getComponentMetaByName(name) {
                return this.componentsStore.getComponentMetaByName(name)
            },
            getComponentById(id) {
                return this.componentsStore.getComponentById(id)
            },

            getComponentClassByName(name) {
                return this.componentsStore.getComponentClassByName(name)
            },

            dragstart(evt, type, name) {
                evt.dataTransfer.setData('123', '123')
                this.dragingType = type;
                this.dragingName = name;
                let componentClass = this.getComponentClassByName(name)
                this.dragingComponent = new componentClass(this);
            },
            dragend(evt, type, name) {
                this.dragingType = '';
                this.dragingName = '';
                this.dragingComponent = null;
            },
            eleClick(evt, ele) {
                if (ele) {
                    this.clickedELe = ele;
                    const metaInfo = this.getComponentMetaByName(ele.name);
                    const attrs = metaInfo.attrs()
                    ele.attrsList = attrs
                    if (metaInfo.basicAttrs && typeof metaInfo.basicAttrs == 'function') {
                        const basicAttrs = metaInfo.basicAttrs()
                        ele.basicAttrsList = basicAttrs
                    }
                    this.operateBar = ele
                }

            },
            getFieldValue(field) {
                return this.formData[field];
            },

            getComponentIds(ids, out) {
                if (ids && ids.length > 0) {
                    ids.forEach(id => {
                        if (id) {
                            out[id + ''] = 'exist';
                            const child = this.getComponentById(id);
                            if (child) {
                                this.getComponentIds(child.getChildrenIds(), out);
                            }
                        }
                    })
                }
            },

            savePage() {

                if (!this.mainLayout) {
                    this.$message.warning("请在操作面板中放置控件后再保存")
                    return;
                }

                //有效组件记录
                const activeComponents = {};
                this.getComponentIds([this.mainLayout], activeComponents)


                console.log(activeComponents)


                const components = this.componentsStore.getAllComponents()
                const resultComponents = {}//有效组件清单
                const buttons = [];//页面按钮清单
                const dataControls = [];//数据控件清单
                for (let id in components) {
                    if (activeComponents[id + '']) {
                        resultComponents[id] = components[id].getSnapshot();
                        const dataControl = components[id].getDataControl();
                        if (dataControl) {
                            dataControls.push(dataControl)
                        }
                        const buttonInfo = components[id].getButtonInfo();
                        if (buttonInfo) {
                            if (buttonInfo instanceof Array) {
                                buttons.push(...buttonInfo)
                            } else {
                                buttons.push(buttonInfo)
                            }
                        }
                    }
                }
                const pageConfig = {
                    pageConfig: this.pageConfig,
                    mainLayout: this.mainLayout,
                    components: resultComponents
                }

                if (this.save) {
                    this.save(pageConfig, buttons, dataControls)
                }

                //console.log(buttons, dataControls)

                //console.log(pageConfig)
                // localStorage.setItem("pageConfig." + this.pageConfig.pageCode, JSON.stringify(pageConfig))
                //console.log(JSON.stringify(pageConfig))
            },
            preview() {
                const components = this.componentsStore.getAllComponents()
                const resultComponents = {}
                for (let id in components) {
                    resultComponents[id] = components[id].getSnapshot();
                }
                const pageConfig = {
                    pageConfig: this.pageConfig,
                    mainLayout: this.mainLayout,
                    components: resultComponents
                }
                this.previewJson = {...pageConfig};
            },
            pageClick(evt) {
                /*this.operateBar = {
                    isPageRoot: true,
                    attrs: this.pageConfig,
                    attrsList: this.pageMetaInfo,
                    setAttrs: (value) => {
                        this.pageConfig = value
                    }
                }*/
                this.operateBar = null
                this.clickedELe = this.operateBar
            },
            getScriptContext() {
                return {
                    formData: this.formData,
                    getComponentByCode: code => this.componentsStore.getComponentByCode(code),
                    $axios: this.$axios,
                    loadPageData: pageData => {

                    }
                    //1、formData对象
                    //2、获取元素方法
                    //3、axios对象
                    //3、刷新整体页面数据
                }
            }
        },
        created() {

            //加载所有组件信息

            this.registedComponents['layouts'] = [];
            for (let layoutName in layouts) {
                this.componentsStore.addComponentInfoByName(layouts[layoutName].meta.name, layouts[layoutName])
                this.registedComponents['layouts'].push(layouts[layoutName])
            }
            this.registedComponents['panels'] = [];
            for (let panelName in panels) {
                this.componentsStore.addComponentInfoByName(panels[panelName].meta.name, panels[panelName])
                this.registedComponents['panels'].push(panels[panelName])
            }
            this.registedComponents['eleitems'] = [];
            for (let eleitemName in eleitems) {
                this.componentsStore.addComponentInfoByName(eleitems[eleitemName].meta.name, eleitems[eleitemName])
                this.registedComponents['eleitems'].push(eleitems[eleitemName])
            }


        },
        mounted() {
            this.pageClick()
        },
        watch: {
            pageDesignData(newValue) {
                if (newValue) {
                    const components = newValue.components;
                    for (let id in components) {
                        const component = components[id];
                        const clazz = this.componentsStore.getComponentClassByName(component.name)
                        const componentObj = new clazz(this);
                        componentObj.recoverSnapshoot(component);
                    }
                    this.pageConfig = newValue.pageConfig;
                    this.mainLayout = newValue.mainLayout;
                }
            }
        },

        render(h) {
            return (<div class="ice-full-relative ice-page-editor" style="display:flex">

                <div class="left" on-click={evt => this.pageClick(evt)}>
                    <vue-scroll ops={{bar: {background: '#000', opacity: 0}}}>

                        <el-collapse class="element-group" value={this.componentsExpand}>
                            <el-collapse-item title="布局组件" name="layouts">
                                {
                                    this.renderIcon(h, this.registedComponents['layouts'])
                                }
                            </el-collapse-item>
                            <el-collapse-item title="普通组件" name="panels">
                                {
                                    this.renderIcon(h, this.registedComponents['panels'])
                                }
                            </el-collapse-item>
                            <el-collapse-item title="表单元素组件" name="eleitems">
                                {
                                    this.renderIcon(h, this.registedComponents['eleitems'])
                                }
                            </el-collapse-item>
                        </el-collapse>

                    </vue-scroll>
                </div>
                <div class="editor-content"
                     on-drop={evt => {
                         if (this.dragingType == 'layout') {
                             const layout = this.getComponentMetaByName(this.dragingName)
                             if (this.parentName == 'pageRoot') {
                                 this.mainLayout = this.dragingComponent.id
                                 this.dragingComponent.setParentId("pageRoot")
                             }
                         }

                         evt.preventDefault()
                     }}
                     on-dragover={evt => {
                         this.parentName = 'pageRoot'
                         const layout = this.getComponentMetaByName(this.dragingName)
                         if (layout) {
                             if (layout.dragable('pageRoot', 'pageRoot')) {
                                 evt.preventDefault()
                             }
                         }
                     }}>
                    {(() => {
                        if (this.mainLayout && this.reRenderTime) {
                            const component = this.getComponentById(this.mainLayout)
                            return component.renderEdirtor(h)
                            //return this.renderElement(h, layout);
                        } else {
                            return <div class="workspace">
                                <h3 style="text-align:center;">工作区 (请将组件拖至工作区)</h3>
                            </div>
                        }
                    })()}
                </div>
                <div class="right">
                    <div class="buttons">
                        <el-button-group>
                            <el-button icon="el-icon-arrow-left" {...{"on": {"click": evt => this.cancel()}}}>退出
                            </el-button>
                            <el-button icon="el-icon-s-claim" {...{"on": {"click": evt => this.savePage()}}}>保存
                            </el-button>
                            <el-button icon="el-icon-view" {...{
                                "on": {
                                    "click": evt => {
                                        this.preview();
                                        this.previewDialogVisible = true;
                                    }
                                }
                            }}>预览
                            </el-button>
                        </el-button-group>

                    </div>
                    <ice-dialog title="页面预览"
                                width="1200px"
                                height="700px"
                                remounted={true}
                                visible={this.previewDialogVisible}
                                {...{"on": {"update:visible": value => this.previewDialogVisible = value}}}>
                        <ice-dynamic-page isPreview={true} previewJson={this.previewJson}>

                        </ice-dynamic-page>

                    </ice-dialog>
                    <div style="flex-grow:1;position:relative">
                        <div class="ice-full-absolute">
                            <vue-scroll ops={{bar: {background: '#000', opacity: 0}}}>

                                {this.operateBar ?
                                    (<div>


                                        <el-card header={this.operateBar.isPageRoot ? '页面基本信息' : '基本信息'} class="card">
                                            <key-value-editable
                                                newable={false}
                                                value={this.operateBar.attrs}
                                                tattrs={this.operateBar.attrsList}
                                                {...{
                                                    "on": {
                                                        "change": value => {
                                                            this.clickedELe.setAttrs(value);
                                                        }
                                                    }
                                                }}>

                                            </key-value-editable>
                                        </el-card>
                                        {
                                            this.operateBar.basicAttrsList ? (<el-card header="组件属性" class="card">
                                                <key-value-editable
                                                    newable={true}
                                                    key-selectable={true}
                                                    value={this.operateBar.basicAttrs}
                                                    tattrs={this.operateBar.basicAttrsList}
                                                    {...{
                                                        "on": {
                                                            "change": value => {
                                                                /*this.operateBar.attrs = value*/
                                                                this.clickedELe.setBasicAttrs(value);
                                                            }
                                                        }
                                                    }}>

                                                </key-value-editable>
                                            </el-card>) : ''
                                        }


                                        {
                                            this.operateBar.additionAttrsRender ? this.operateBar.additionAttrsRender(h) : ''
                                        }
                                        {
                                            this.operateBar.isPageRoot ? '' :
                                                <el-card header="样式信息" className="card">
                                                    <key-value-editable
                                                        newable={true}
                                                        value={this.operateBar.style}
                                                        tattrs={[]}
                                                        {...{
                                                            "on": {
                                                                "change": value => {
                                                                    this.operateBar.style = value
                                                                    this.clickedELe.setStyle(value);
                                                                }
                                                            }
                                                        }}>

                                                    </key-value-editable>
                                                </el-card>
                                        }

                                    </div>) : (<page-info-editor value={this.pageConfig}
                                                                 {...{
                                                                     'on': {
                                                                         'change': value => {
                                                                             this.pageConfig = value;
                                                                         }
                                                                     }
                                                                 }}>

                                    </page-info-editor>)}
                            </vue-scroll>
                        </div>
                    </div>
                </div>
            </div>)
        },
        components: {
            ...ComponentsUtils.resolve(layouts, panels, eleitems),
            IceLabel,
            KeyValueEditable,
            VueScroll,
            PageInfoEditor

        }
    }
</script>

<style lang="less" scoped>
    .left {
        width: 160px;
        height: 100%;
        position: relative;

        .element-group {
            padding: 5px;

            .element-group-item {
                background: #6a8bad;
            }
        }

        .ele-wrapper {
            width: 100%;
            /*height: 80px;*/
            margin-bottom: 6px;
            text-align: center;
            box-sizing: border-box;
            cursor: move;
            padding: 2px 4px;
            padding-right: 6px;

            .full {
                width: 100%;
                height: 80px;
                background: #ffece0;
                line-height: 70px;
                position: relative;
            }

            .border {
                border: 1px solid #c6c7cb;
                line-height: 68px;
            }

        }

    }

    .editor-content {
        flex-grow: 1;
        height: 100%;
        display: block;
        overflow: auto;

        .workspace {
            height: 100%;
            /*  width: 100%;*/
            border: 1px solid #cecdcd;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        * {
            box-sizing: border-box;
        }
    }

    .right {
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;

        .buttons {
            display: flex;
            justify-content: center;
            border-bottom: 1px solid #e8e9ed;
            padding: 2px 0;
        }
    }


</style>
<style lang="less">
    .ice-page-editor {

        .el-tabs__new-tab{
            margin-right: 5px;
        }

        .vue-grid-item {
            transition: none;
        }

        .card {

            margin-bottom: 10px;

            .el-card__header {
                padding: 10px 12px
            }

            .el-card__body {
                padding: 6px;
            }
        }

    }
</style>
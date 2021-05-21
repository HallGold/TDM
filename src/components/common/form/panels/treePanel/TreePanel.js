import BaseElement from "../../BaseElement";
import IceTree from '@/components/common/base/IceTree.vue'
import './TreePanel.less'
import BaseDragableElement from "../../BaseDragableElement";

export default {

    meta: {
        name: 'treepanel',
        type: 'panel',
        icon(h) {
            return <div class="input iconfont icon-shuxingkongjian">树形组件</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleType == "layout") {
                return true
            }
            return false;
        },

        attrs() {
            return [
                {key: 'code', keylabel: '组件编码', deleteable: false, keyreadonly: true},
                {
                    key: 'click',
                    keylabel: 'click事件',
                    deleteable: false,
                    valuetype: "script",
                    keyreadonly: true,
                    initScript: '(function(node){\n\n\t \n\n})'
                },
            ]
        },
        basicAttrs() {
            return [
                {
                    key: 'load-url',
                    keylabel: 'url地址',
                    deleteable: false,
                    keyreadonly: true
                },
                {
                    key: 'lazy',
                    keylabel: '是否懒加载',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "checkbox"
                },
                {
                    key: 'filter',
                    keylabel: '启用过滤',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "checkbox"
                },
                {
                    key: 'label-prop',
                    keylabel: '文本属性编码',
                    deleteable: true,
                    keyreadonly: false,
                },
                {
                    key: 'value-prop',
                    keylabel: '值属性编码',
                    deleteable: true,
                    keyreadonly: false,
                },
                {
                    key: 'children-prop',
                    keylabel: '子属性编码',
                    deleteable: true,
                    keyreadonly: false,
                    showable: (attr) => !attr['lazy']
                },
                {
                    key: 'tree-parent-prop',
                    keylabel: '父属性编码',
                    deleteable: true,
                    keyreadonly: false,
                    showable: (attr) => attr['lazy']
                },
                {
                    key: 'tree-parent-prop',
                    keylabel: '根节点值',
                    deleteable: true,
                    keyreadonly: false,
                    showable: (attr) => attr['lazy']
                },
                {
                    key: 'show-tree-checkbox',
                    keylabel: '显示checkbox',
                    deleteable: true,
                    keyreadonly: false,
                    valuetype: "checkbox"
                },
                {
                    key: 'selected-model',
                    keylabel: '选中模式',
                    deleteable: true,
                    keyreadonly: false,
                    valuetype: "select",
                    list: [{code: 'all', text: '全部选中节点'}, {code: 'onlyParent', text: '仅父节点'}],
                    showable: attrs => attrs['show-tree-checkbox']
                }
            ]
        }
    },
    clazz: class TreePanel extends BaseDragableElement {

        constructor(editor) {
            super(editor);
            this.name = 'treepanel';
            this.type = 'panel';
            this.attrs = {}
            this.style['width'] = '100%';
            this.style['height'] = '100%';
            this.$withoutTitle = true;
            this.basicAttrs['load-url'] = '/'
            this.basicAttrs['lazy'] = true
            this.basicAttrs['filter'] = true
            this.selectedList = []
            this.clickedNode = null
            this.editorTreeData = [{
                label: '一级节点',
                id: '0',
                children: [
                    {
                        label: '二级节点 1',
                        id: '1',

                    },
                    {
                        label: '二级节点 2',
                        id: '2',

                    },
                    {
                        label: '二级节点 3',
                        id: '3',

                    }
                ]
            }]
        }


        setSelectedValue(changeNode, nodeStatus) {
            if (!this.attrs.code) {
                //console.error(`${this.attrs.title ? this.attrs.title : this.name} code是空,请维护`)
                return;
            }

            let checkedList = [];

            if (this.basicAttrs['selected-model'] !== 'onlyParent') {
                checkedList = nodeStatus.checkedNodes;
            } else {
                const tree = this.getVueComponent(this.attrs.code);

                const checkedMap = {};
                //如果父节点和子节点同时被选中返回数据时只返回父节点
                nodeStatus.checkedNodes.forEach((item, index) => {
                    const treeNode = tree.getNode(item);

                    let parent = treeNode.parent;
                    if (!parent) {
                        checkedList.push(item)
                        checkedMap[item[this.basicAttrs['value-prop']]]
                    } else {
                        while (parent) {
                            if (checkedMap[parent.data[this.basicAttrs['value-prop']]]) {
                                break;
                            }
                            parent = parent.parent;
                            if (!parent) {
                                checkedList.push(item)
                                checkedMap[item[this.basicAttrs['value-prop']]] = 'exist'
                            }
                        }
                    }

                })

                console.log(checkedList.map(item => item[this.basicAttrs['label-prop']]))
            }


            this.editor.$set(this.editor.formData, `${this.attrs.code}#selected`, checkedList);
        }

        setClickedValue(data, node) {
            if (!this.attrs.code) {
                //console.error(`${this.attrs.title ? this.attrs.title : this.name} code是空,请维护`)
                return;
            }
            this.clickedNode = node.data;
            this.editor.$set(this.editor.formData, this.attrs.code, data);
            this.editor.$set(this.editor.formData, `${this.attrs.code}#clicked`, node.data);
            this.getScriptContext().$nextTick(_ => {
                this.execFunction(this.attrs.click, node.data)
            })
        }


        renderEdirtor(h) {

            return super.renderEdirtor(h, h => {
                return <div class="tree-panel"
                            style={this.getStyleString()}>
                    <ice-tree tree-data={this.editorTreeData}
                              style="height:100%"
                              tree-width="100%"
                              filter={this.getBasicAttrs()['filter']}
                              show-tree-checkbox={this.getBasicAttrs()['show-tree-checkbox']}>
                    </ice-tree>
                    <div class="full-mask"></div>
                </div>
            })


        }

        render(h) {
            return <ice-tree style={this.getStyleString('width')}
                             tree-width={this.style['width']}
                             {...{
                                 "attrs": {...this.getBasicAttrs()},
                                 "on": {
                                     "node-click": (data, node) => {
                                         this.setClickedValue(data, node);
                                     },
                                     "node-check": (changeNode, nodeStatus) => {
                                         this.setSelectedValue(changeNode, nodeStatus)
                                     },
                                 },
                             }}
                             ref={this.getRefName()}>
            </ice-tree>
        }

    },
    components: {
        IceTree
    }
}
import BasePanel from "@/components/common/form/panels/BasePanel.js";
import './Divider.less'

export default {

    meta: {
        name: 'divider',
        type: 'panel',
        icon(h) {
            return <div class="input iconfont icon-fengexian">分割线组件</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleType == "layout") {
                return true
            }
            return false;
        },

        attrs() {
            return [
                {
                    key: 'content-position',
                    keylabel: '文字位置',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'left', text: '居左'},
                        {code: 'right ', text: '居右'},
                        {code: 'center', text: '居中'}
                    ]
                },
                {
                    key: 'content',
                    keylabel: '文字内容',
                    deleteable: false,
                    keyreadonly: true,
                },
            ]
        },

    },
    clazz: class Divider extends BasePanel {

        constructor(editor) {
            super(editor);
            this.name = 'divider';
            this.$withoutTitle = true;
            delete this.attrs.showTitle
            delete this.attrs.title
            delete this.attrs.expandable
        }


        renderEdirtor(h) {
            return super.renderEdirtor(h, h => {
                return <el-divider
                    content-position={this.attrs['content-position']}>{this.attrs['content']}</el-divider>
            })
        }

        render(h) {
            return <el-divider content-position={this.attrs['content-position']}>{this.attrs['content']}</el-divider>
        }

    },
    components: {}
}
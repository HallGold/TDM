import BaseElement from "./BaseElement";
import './BaseDragableElement.less'

export const dragableAttrs = [

    {key: 'showTitle', keylabel: '是否显示标题', deleteable: false, keyreadonly: true, valuetype: "checkbox"},
    {
        key: 'expandable',
        keylabel: '是否可折叠',
        deleteable: false,
        keyreadonly: true,
        valuetype: "checkbox",
        showable: attrs => attrs.showTitle
    },
    {key: 'title', keylabel: '标题名称', deleteable: false, keyreadonly: true, showable: attrs => attrs.showTitle}]
export default class BaseDragableElement extends BaseElement {
    constructor(editor) {
        super(editor)
        this.$withoutTitle = false;
        this.attrs.showTitle = true//是否显示标题
        this.attrs.title = "标题"//标题
        this.attrs.expandable = false
        this.$startParent = null;//拖拽时候记录起始parent
    }


    renderEdirtor(h, dragContentRender) {
        if (this.$withoutTitle) {
            return <div class="form-panel"

                        tabIndex='1'
                        on-click={evt => {
                            this.onClick(evt)
                        }}
                        on-keyup={evt => {
                            this.onKeyUp(evt)
                        }}>
                <div class="dragable el-icon-rank"
                     draggable="true"
                     on-dragstart={evt => {
                         this.editor.dragstart(evt, this.type, this.name)
                         this.editor.dragingComponent = this;
                         this.$startParent = this.parentId;
                     }}
                     on-dragend={evt => {
                         this.editor.dragend(evt, this.type, this.name)
                         if (this.$startParent && this.parentId != this.$startParent) {//元素已经被移到其他地方
                             this.getComponentById(this.$startParent).removeChild(this.id)
                         }
                     }}>

                </div>
                {
                    dragContentRender ? dragContentRender(h) : ''
                }
            </div>
        } else {
            return <div class="form-group form-panel"
                        style={this.getDragableElementStyleString()}
                        tabIndex='1'
                        on-click={evt => {
                            this.onClick(evt)
                        }}
                        on-keyup={evt => {
                            this.onKeyUp(evt)
                        }}>
                <div class="title"
                     draggable="true"
                     on-dragstart={evt => {
                         this.editor.dragstart(evt, this.type, this.name)
                         this.editor.dragingComponent = this;
                         this.$startParent = this.parentId;
                     }}
                     on-dragend={evt => {
                         this.editor.dragend(evt, this.type, this.name)
                         if (this.$startParent && this.parentId != this.$startParent) {//元素已经被移到其他地方
                             this.getComponentById(this.$startParent).removeChild(this.id)
                         }
                     }}
                     style="background:#FFFDE6;cursor:move;">
                    {this.attrs.showTitle && !this.$withoutTitle ? <div class="bar"></div> : ''}
                    {this.attrs.showTitle && !this.$withoutTitle ? <div class="name">{this.attrs.title}
                        <div class="el-icon-rank"></div>
                    </div> : ''}
                </div>

                <div class="form-content">
                    {
                        dragContentRender ? dragContentRender(h) : ''
                    }
                </div>
            </div>
        }

    }


    render(h, contentRender) {
        if (typeof this.isShow === 'function' && !this.isShow()) {
            return '';
        }
        if (this.attrs.showTitle) {
            return (<ice-form-group
                style={this.getDragableElementStyleString()}
                name={this.attrs.title}
                expandable={this.attrs.expandable}>
                {contentRender(h)}
            </ice-form-group>)
        } else {
            return contentRender(h)
        }
    }


    getStyleString(...ignores) {
        if (this.attrs.showTitle) {
            return `height:100%;height:100%;flex-grow:1;` + super.getStyleString('height', 'width', 'flex-grow', ...ignores);
        } else {
            return super.getStyleString(ignores);
        }
    }

    getDragableElementStyleString() {
        let style = "";
        if (this.style['height']) {
            style += `height:${this.style['height']};`;
        }


        if (this.style['width']) {
            style += `width:${this.style['width']};`;
        }

        if (this.style['flex-grow']) {
            style += `flex-grow:${this.style['flex-grow']};`;
        }
        return style;

    }


}
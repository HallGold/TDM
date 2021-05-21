import IceForm from "../../base/IceForm";
import VueGridLayout from 'vue-grid-layout';
export default {
    name: 'formpanel',
    render(h, attr) {
        let rules = {};
        attr.items.forEach(item => {
            let component = this.components[item.refid];
            if (component.rule) {
                rules[component.name] = component.rule;
            }
        });

        return (

            <div class="ice-form">
                <div class="formTitle">
                    <div class="title">
                        <div class="bar"></div>
                        <div class="name">{attr.name}</div>
                    </div>
                </div>
                <ice-form ice-model={this.formData} rules={rules} ref={attr.id}>
                    <grid-layout
                        layout={attr.items}
                        col-num={attr.colNum}
                        row-height={attr.rowHeight}
                        auto-size={true}
                        is-draggable={false}
                        is-resizable={false}
                        vertical-compact={false}
                        margin={[0, 0]}
                        use-css-transforms={false}>
                        {attr.items.map(child => {
                            let refid = child.refid;
                            let item = this.components[child.refid];
                            item.mark = 'component';
                            // console.log("child", child);
                            return (
                                <grid-item
                                    x={child.x}
                                    y={child.y}
                                    w={child.w}
                                    h={child.h}
                                    i={item.id}>
                                    <el-form-item label={item.label} label-width="100px" prop={item.name}>
                                        {this.renderItem(h, item)}
                                    </el-form-item>
                                </grid-item>
                            )
                        })}
                    </grid-layout>
                </ice-form>
            </div>
        )

    },
    components: {
        IceForm,
        GridItem: VueGridLayout.GridItem,
        GridLayout: VueGridLayout.GridLayout,
    }
}
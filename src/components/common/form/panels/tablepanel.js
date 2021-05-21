import IceQueryGrid from '../../base/IceQueryGrid'

export default {
    name: 'tablepanel',
    render(h, item) {
        return (
            <ice-query-grid {...{
                class: Object.assign({}, item.class),
                style: Object.assign({}, item.style),
                attrs: {
                    ...Object.assign({}, item.attrs),
                    'minHeight': 0
                }
            }} ref={item.id}>

            </ice-query-grid>
        )
    },
    components: {
        IceQueryGrid,
    }
}
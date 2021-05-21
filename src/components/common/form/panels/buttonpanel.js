export default {
    name: 'buttonpanel',
    render(h, attr) {
        return (
            <div class="ice-button-bar">
                {attr.items.map(item => {

                    return (<el-button {...{
                        "attrs": Object.assign({}, item.attrs),
                        "on": {
                            ...item.listeners
                        }
                    }}>{item.name}</el-button>)
                })}
            </div>)
    }
}
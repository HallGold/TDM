function renderContainer(h, attr) {
    return (
        <el-container>
            {attr.items && attr.items.length > 0 ? attr.items.map(item => {
                return renderItem.call(this, h, item)
            }) : []}
        </el-container>
    )
}


function renderHeader(h, attr) {
    return (<el-header height={attr.height}>
        {attr.items && attr.items.length > 0 ? attr.items.map(item => {
            return this.renderItem(h, item)
        }) : []}
    </el-header>)
}

function renderAside(h, attr) {
    return (<el-aside width={attr.width}>
        {attr.items && attr.items.length > 0 ? attr.items.map(item => {
            return this.renderItem(h, item)
        }) : []}
    </el-aside>)
}

function renderFooter(h, attr) {
    return (<el-footer height={attr.height}>
        {attr.items && attr.items.length > 0 ? attr.items.map(item => {
            return this.renderItem(h, item)
        }) : []}
    </el-footer>)
}

function renderMain(h, attr) {
    return (<el-main {...{style: {display: 'flex', 'flex-direction': attr.direction ? attr.direction : 'column'}}}>
        {attr.items && attr.items.length > 0 ? attr.items.map(item => {
            return this.renderItem(h, item)
        }) : []}
    </el-main>)
}


function renderItem(h, attr) {

    if (attr.type == "container") {
        return renderContainer.call(this, h, attr)
    }

    if (attr.type == 'header') {
        return renderHeader.call(this, h, attr)
    }

    if (attr.type == 'aside') {
        return renderAside.call(this, h, attr)
    }

    if (attr.type == 'footer') {
        return renderFooter.call(this, h, attr)
    }

    if (attr.type == 'main') {
        return renderMain.call(this, h, attr)
    }
}


export default {
    name: 'flexlayout',
    render(h, attr) {
        return renderItem.call(this, h, attr.attrs);
    }
}
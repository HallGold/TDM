import {Message} from 'element-ui';

export default class {

    constructor() {
        this.components = {}
        this.componentInfos = {}
        this.componentCodeIdMap = {}
    }

    addComponentById(id, component) {
        this.components[id] = component
    }

    getComponentById(id) {
        return this.components[id];
    }

    removeComponentById(id) {
        delete this.components[id];
    }

    addComponentInfoByName(name, componentInfo) {
        this.componentInfos[name] = componentInfo
    }

    getComponentMetaByName(name) {
        return this.componentInfos[name].meta;
    }

    getComponentClassByName(name) {
        return this.componentInfos[name].clazz;
    }

    addComponentIdByCode(code, id) {
        if (code && this.componentCodeIdMap[code]) {
            Message.warning("编码已存在,请检查!")
        }
        this.componentCodeIdMap[code] = id
    }

    checkComponentCode(code) {
        if (code && this.componentCodeIdMap[code]) {
            return true
        }
        return false;
    }

    removeCompoentCode(code) {
        if (code != undefined && code != null) {
            delete this.componentCodeIdMap[code]
        }
    }

    getComponentByCode(code) {
        const id = this.componentCodeIdMap[code]
        if (!id) {
            throw "没有找到组件，code:" + code
        }
        const component = this.components[id];
        if (component) {
            return component.getPublicScope()
        }
    }

    getAllComponents() {
        return this.components
    }
}


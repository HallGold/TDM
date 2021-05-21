let nodisposed = "mapTypeCodeNoDisposed";
let disposed = "mapTypeCodeDisposed";
export default {
    addMapTypeCode(...typeCode) {//添加未处理的数据字典类型code
        typeCode = this.getUndisposedTypeCodes(...typeCode);
        //typeCode = typeCode.filter(item => this.getValidTypeCode(item))
        let arr = localStorage.getItem(nodisposed)
        if (arr == undefined ||
            arr == null ||
            arr == "undefined" ||
            arr == "null") {
            arr = [];
        } else {
            arr = JSON.parse(arr);
        }

        if (arr instanceof Array) {
            arr.push(...typeCode);
        } else {
            arr = [];
        }
        localStorage.setItem(nodisposed, JSON.stringify(arr));
    },

    addValidTypeCode(item) {//添加已处理的数据字典信息
        if (item instanceof Object) {
            let storage = localStorage.getItem(disposed);
            if (storage == undefined || storage == null) {
                storage = {};
            } else {
                storage = JSON.parse(storage);
            }

            let disposedList = [];
            if (storage instanceof Object) {
                for (let key in item) {
                    storage[key] = item[key];
                    //  disposedList.push(key);
                }
            }

            let nodisposedList = JSON.parse(localStorage.getItem(nodisposed));
            if (nodisposedList && nodisposedList instanceof Array) {
                nodisposedList = nodisposedList.filter(item => disposedList.includes(item));
                localStorage.setItem(nodisposed, JSON.stringify(nodisposedList));
            }
            localStorage.setItem(disposed, JSON.stringify(storage));
        }
    },
    getUndisposedTypeCodes(...typeCodes) {//获取未处理过的数据字典信息
        let mapdata = JSON.parse(localStorage.getItem(disposed));
        let nodisposedList = JSON.parse(localStorage.getItem(nodisposed));
        if (mapdata instanceof Object) {
            typeCodes = typeCodes.filter(item => !mapdata[item])
        }
        if (nodisposedList instanceof Array) {
            typeCodes = typeCodes.filter(item => !nodisposedList.includes(item));
        }
        return typeCodes;

    },
    getValidTypeCode(typeCode) {//获取所有有效的数据字典信息
        let mapdata = JSON.parse(localStorage.getItem(disposed));
        if (mapdata instanceof Object) {
            return mapdata[typeCode]
        }
    },

    getAllValidTypeCodes() {
        let mapdata = JSON.parse(localStorage.getItem(disposed));
        if (mapdata instanceof Object) {
            return mapdata;
        }
        return null
    },

    getAllUndisposedCodes() {//获取所有无效的数据字典信息
        let nodisposedList = JSON.parse(localStorage.getItem(nodisposed));
        if (nodisposedList && nodisposedList instanceof Array) {
            return nodisposedList;
        } else {
            return [];
        }
    },

    clearTypeCodesInfo(){
        localStorage.removeItem(disposed)
        localStorage.removeItem(nodisposed)
    }

}
import Vue from 'vue'
import store from "./index";

/**
 * 转换成列表形式
 * @param origin
 * @param disabledList
 * @returns {Array}
 */
const transformToList = (origin, disabledList) => {
    const result = [];
    for (let key in origin) {
        if (!disabledList || disabledList.length == 0 || disabledList.indexOf(key) == -1) {
            result.push({'value': key, "label": origin[key], 'disabled': false})
        } else {
            result.push({'value': key, "label": origin[key], 'disabled': true})
        }

    }
    return result;
}

/**
 * 去除数据中被disabled
 * @param origin
 * @param disabledList
 */
const removeDisabled = (origin, disabledList) => {
    const result = {};
    for (let key in origin) {
        if (!disabledList || disabledList.length == 0 || disabledList.indexOf(key) == -1) {
            result[key] = origin[key];
        }
    }
    return result;
}

/**
 * 去除数据中被disabled,并转成list
 * @param origin
 * @param disabledList
 * @returns {Array}
 */
const removeDisabledToList = (origin, disabledList) => {
    origin = removeDisabled(origin, disabledList)
    return transformToList(origin);
}

/**
 * 获取多个数据字典信息
 * @param typeCodes
 * @param origin
 * @param disabledMap
 * @returns {{}}
 */
const getDataMaps = (typeCodes, origin, disabledMap, showDisabled) => {
    if (!typeCodes || typeCodes.length == 0) {
        return {};
    }

    const result = {};
    typeCodes.forEach(item => {
        result[item] = showDisabled ? origin[item] : removeDisabled(origin[item], disabledMap[item])
    })
    return result;
}


/**
 * 转换成列表形式
 * @param origin
 * @param disabledList
 * @returns {Array}
 */
const transformDatamapsToList = (typeCodes, origin, disabledMap, showDisabled) => {
    if (!typeCodes || typeCodes.length == 0) {
        return {};
    }
    const result = {};

    typeCodes.forEach(item => {
        result[item] = showDisabled ? transformToList(origin[item], disabledMap[item]) : removeDisabledToList(origin[item], disabledMap[item])
    })

    return result;
}


// 配置需要解析的数据
const configAna = {
    "XMLY": {
        // 请求地址

        'dataurl': '/pms/DataDictionaryType/getTree?code=XMLY&isTree=0',
        // 处理方法

        dispose: (data) => {
            if (!data) {
                return {};
            }
            let obj = {};
            data.forEach(c => {
                obj[c.code] = c.name;
            })
            return obj;
        }
    },
    'DEPT': {
        // 请求地址

        'dataurl': 'permission/frame_org/load_table_next_children?loadDisabled=false&hasSelf=true&conditionLink=AND&staticConditions%5B0%5D.column=deptCode&staticConditions%5B0%5D.exp=%3D&staticConditions%5B0%5D.value=9003&deptCode=9003&columns%5B0%5D=oid&columns%5B1%5D=deptShortName&columns%5B2%5D=deptCode',
        // 处理方法

        dispose: (data) => {
            if (!data) {
                return {};
            }
            let obj = {};
            data.forEach(c => {
                obj[c.deptCode] = c.deptName;
            })
            return obj;
        }
    }
}


const reverseDatamap = (origin) => {
    if (!origin) {
        return {}
    }
    const reversed = {};
    for (let key in origin) {
        reversed[origin[key]] = key;
    }
    return reversed;
}


const pendingTypeCodes = {};

let undoTimer = null;
let cusundoTimer = null;

export default {
    namespaced: true,
    state: {
        undotypecodes: [],//数据字典待处理编码
        datamap: {},//数据字典缓存数据,{type:{item1:'text1',item2:'text2',}}
        disabledItems: {},//已禁用的数据字典项
        // 自定义
        noUpdateFileds: null,  // 文件禁止上传的格式
        cusDatamap: {},  // 自定义缓存数据
        cusUndodata: []
    },
    getters: {
        /**
         * 获取数据字典信息
         * @param state
         * @returns {Function}
         */
        getDataMap: state => (typeCode, showDisabled = true) => {
            if (showDisabled) {
                return state.datamap[typeCode]
            } else {
                return removeDisabled(state.datamap[typeCode], state.disabledItems[typeCode])
            }

        },
        /**
         *
         *  获取自定义数据
         *
         *
         *
         * */
        getCusDataMap: state => (typeCode) => {
            let obj = configAna[typeCode];
            let data = state.cusDatamap[typeCode];
            return obj.dispose(data);
        },
        getReversedDataMap: state => (typeCode, showDisabled = true) => {
            if (showDisabled) {
                return reverseDatamap(state.datamap[typeCode])
            } else {
                return reverseDatamap(removeDisabled(state.datamap[typeCode], state.disabledItems[typeCode]))
            }

        },
        /**
         * 获取数据字典列表信息
         * @param state
         * @returns {Function}
         */
        getDataMapList: state => (typeCode, showDisabled = true) => {
            if (showDisabled) {
                return transformToList(state.datamap[typeCode], state.disabledItems[typeCode])
            } else {
                return removeDisabledToList(state.datamap[typeCode], state.disabledItems[typeCode])
            }
        },
        /**
         * 获取多个数据字典信息
         * @param state
         * @returns {Function}
         */
        getDataMaps: state => (typeCodes, showDisabled = true) => {
            return getDataMaps(typeCodes, state.datamap, state.disabledItems, showDisabled)

        },
        /**
         * 获取多个数据字典列表信息
         * @param state
         * @returns {Function}
         */
        getDataMapsList: state => (typeCodes, showDisabled = true) => {
            return transformDatamapsToList(typeCodes, state.datamap, state.disabledItems, showDisabled)
        },
        /**
         *
         *  获取不能上传的字段
         *
         * */
        getDataUploadFiled: state => () => {
            return state.noUpdateFileds
        },

    },
    mutations: {
        addUndoTypeCodes(state, typecodes) {
            if (!(typecodes instanceof Array)) {
                typecodes = [typecodes];
            }

            typecodes = typecodes.filter(item => !state.undotypecodes.includes(item));
            typecodes = typecodes.filter(item => !state.datamap[item]);
            state.undotypecodes.push(...typecodes);
            if (undoTimer) {
                clearTimeout(undoTimer)
                undoTimer = null;
            }
            undoTimer = setTimeout(_ => {
                store.dispatch('datamapStore/loadUndoTypeCodes')
            }, 400);
        },
        // 增加自定义codes
        addUndoCusTypeCodes(state, typecodes) {

            if (!(typecodes instanceof Array)) {
                typecodes = [typecodes];
            }
            typecodes = typecodes.filter(item => !state.cusUndodata.includes(item));
            typecodes = typecodes.filter(item => !state.cusDatamap[item]);
            state.cusUndodata.push(...typecodes);
            if (cusundoTimer) {
                clearTimeout(cusundoTimer)
                cusundoTimer = null;
            }
            cusundoTimer = setTimeout(_ => {
                store.dispatch('datamapStore/loadUndoCusData')
            }, 400);
        },
        getUndisposedTypeCodes(state) {
            return state.undotypecodes;
        },
        addDataMap(state, item) {
            for (let key in item) {
                Vue.set(state.datamap, key, item[key]);
            }
            // state.undotypecodes.remove(key);
        },
        resetStateDataMap(state) {
            state.undotypecodes = [];//数据字典待处理编码
            state.datamap = {};//数据字典缓存数据
            state.disabledItems = {};//已禁用的数据字典项
        },
        addDataMapItem(state, {typeCode, itemContent, disabledContent}) {
            Vue.set(state.datamap, typeCode, itemContent);
            Vue.set(state.disabledItems, typeCode, disabledContent);
        },
        addDataMapCusItem(state, {typeCode, itemContent, disabledContent}) {
            Vue.set(state.cusDatamap, typeCode, itemContent);

        },
        addDataMapNoFile(state) {
            store.dispatch('datamapStore/loadNoUploadFiled')
        }
    },
    actions: {
        /**
         * 异步加载数据字典信息
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param typecode
         * @param showDisabled
         * @returns {Promise<*>}
         */
        async getDataMapAsync({commit, dispatch, state, rootGetters}, {typecode, showDisabled = false}) {
            if (!state.datamap[typecode]) {
                await dispatch("loadDataMap", [typecode])
            }
            return rootGetters['datamapStore/getDataMap'](typecode, showDisabled);
        },

        /**
         * 异步加载数据字典信息  将结果反转
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param typecode
         * @param showDisabled
         * @returns {Promise<*>}
         */
        async getReversedDataMapAsync({commit, dispatch, state, rootGetters}, {typecode, showDisabled = false}) {
            if (!state.datamap[typecode]) {
                await dispatch("loadDataMap", [typecode])
            }
            return rootGetters['datamapStore/getReversedDataMap'](typecode, showDisabled);
        },

        /**
         * 异步加载数据字典信息  多个数据字典信息
         * @param commit
         * @param dispatch
         * @param state
         * @param rootGetters
         * @param typecodes
         * @param showDisabled
         * @returns {Promise<*>}
         */
        async getDataMapsAsync({commit, dispatch, state, rootGetters}, {typecodes, showDisabled = false}) {
            const undoTypecodes = typecodes.filter(typecode => !state.datamap[typecode])
            if (undoTypecodes && undoTypecodes.length > 0) {
                await dispatch("loadDataMap", undoTypecodes)
            }
            return rootGetters['datamapStore/getDataMaps'](typecodes, showDisabled);
        },

        async loadDataMap({commit, dispatch, state, rootGetters}, typecodes) {

            typecodes = typecodes
                .filter(item => item && !state.datamap[item])
            if (!typecodes || typecodes.length == 0) {
                return;
            }

            const {data} = await Vue.prototype.$axios.get(`permission/dataDictionary/listByActType?typeCodes=${typecodes.join(",")}`);
            if (data) {
                /*return new Promise((resolve, reject) => {
                   /!* setTimeout(_ => {

                        resolve();
                    }, 0)*!/
                })*/
                data.forEach(item => {
                    const typeCode = item.code;
                    const itemContent = {};
                    const disabledContent = []
                    const itemList = item.appDataList;
                    if (itemList) {
                        itemList.forEach(child => {
                            let code = child.code.trim();
                            itemContent[code] = child.name
                            if (child.enabled != '1') {
                                disabledContent.push(child.code)//[] = "Disabled"
                            }
                        })
                    }

                    commit("addDataMapItem", {typeCode, itemContent, disabledContent})
                    delete pendingTypeCodes[typeCode]
                })
            }
        },

        // 自定义加载数据数据

        loadCusDatamap({commit, dispatch, state, rootGetters}, typecodes) {
            console.log(typecodes, 'XMLY')
            typecodes.forEach(c => {
                let obj = configAna[c];
                let {dataurl} = obj;
                Vue.prototype.$axios.get(dataurl, {})
                    .then(result => {
                        commit('addDataMapCusItem', {typeCode: c, itemContent: result.data})
                    })
                    .catch(error => {
                        this.$message.error("获取失败");
                    })
                    .finally(_ => {

                    })
            })
        },

        async loadUndoTypeCodes({commit, dispatch, state, rootGetters}) {
            const undotypecodes = state.undotypecodes

            if (undotypecodes && undotypecodes.length > 0) {
                state.undotypecodes = [];//数据字典待处理编码
                await dispatch("loadDataMap", undotypecodes)
            }
        },
        // 自定义加载
        async loadUndoCusData({commit, dispatch, state, rootGetters}) {
            const undotypecodes = state.cusUndodata;
            if (undotypecodes && undotypecodes.length > 0) {
                state.cusUndodata = [];//数据字典待处理编码
                await dispatch("loadCusDatamap", undotypecodes)
            }
        },

        // 加载配置的上传附件禁止上传格式
        loadNoUploadFiled({commit, dispatch, state, rootGetters}) {
            if (state.noUpdateFileds) {
                return;
            }
            Vue.prototype.$axios.get("permission/app_constant/byCode", {
                params: {
                    appCode: 'SYSTEM_COMMON_90',
                    code: 'NO_UPLOAD_FILE'
                }
            })
                .then(result => {
                    let s = result.data.value;
                    if (s) {
                        let arr = s.split(',');
                        let newarr = [];
                        arr.forEach((c) => {
                            if (c) {
                                newarr.push('.' + c.trim());
                            }
                        })

                        state.noUpdateFileds = newarr;
                    }
                })
                .catch(error => {
                    this.$message.error("获取失败！")
                })
        },
    }
}

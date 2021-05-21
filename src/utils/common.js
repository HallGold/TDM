import XEUtils from "xe-utils/methods/xe-utils";
import IceScript from '@/components/common/form/others/IceJScript'

export default {
    /**
     * 简单的浅拷贝
     * @param target
     * @param source
     */
    copy(conf, target, source) {
        let target_new = Object.assign({}, target);
        let defaultConf = Object.assign({tc: true, pros: []}, conf);

        for (let pro in source) {
            if (defaultConf.pros.indexOf(pro) == -1) {
                continue;
            }
            if (defaultConf.tc && !target[pro]) {
                target_new[pro] = source[pro];
            } else if (!defaultConf.tc) {
                target_new[pro] = source[pro];
            }
        }
        return target_new;
    },
    toInitData(ncolumns, defaultValue) {
        if (typeof(ncolumns) == 'undefined') {
            throw Error('ncolumns is undefined.');
        }
        let itd = {};
        ncolumns.map(item => item.code).forEach(item => {
            itd[item] = '';
        })
        if (defaultValue) {
            return Object.assign(itd, defaultValue);
        }
        return itd;

    },
    toQuery(ncolumns, cusArr) {
        let arr = [];
        ncolumns.filter(item => ((typeof(item.hidden) == 'undefined' || item.hidden == false)
            && (typeof(item.ignore) == 'undefined') || item.ignore == false)).forEach(item => {
            if (item.mapTypeCode) {
                arr.push({
                    type: 'select',
                    label: item.label,
                    code: item.code,
                    mapTypeCode: item.mapTypeCode,
                    value: ''
                });
            } else {
                arr.push({type: 'input', label: item.label, code: item.code, value: ''});
            }
        });
        if (cusArr && cusArr.length > 0) {
            arr.push(...cusArr);
        }
        return arr;
    },
    toFormRules(ncolumns, rules) {
        rules = rules ? rules : {};
        let nrules = {};
        ncolumns.filter(item => item.required).forEach(item => {
            if (rules[item.code]) {
                nrules[item.code] = rules[item.code];
                return;
            }
            nrules[item.code] = [{validator: item.functions, trigger: 'blur'}, {
                required: true, whitespace: true,
                message: (item.mapTypeCode ? '请选择' : '请输入') + item.label, trigger: item.mapTypeCode ? 'change' : 'blur'
            }];
        });
        return nrules;
    },
    getFuncValue(content, ...params) {
        return XEUtils.isFunction(content) ? content(...params) : content
    },

    getFuncValueOrDefault(content, defaultValue, ...params) {
        return XEUtils.isFunction(content) ? content(...params) : !XEUtils.eqNull(content) ? content : defaultValue
    },

    execFunctionOrGetValue(script, context, ...params) {
        let action = this.getFunction(script)
        if (action && XEUtils.isFunction(action)) {
            return action.call(context, ...params)
        }
        return script;
    },

    getFunction(script) {

        if (script === null || script === undefined) {
            return null;
        }

        let action = null
        if (XEUtils.isFunction(script)) {
            action = script
        } else if (XEUtils.isString(script)) {

            //判断是否是函数定义字符串
            if (script.trim().startsWith("(") && script.trim().endsWith(")")) {
                try {
                    action = (0, eval)(script)
                } catch (e) {

                }
            }

        } else if (script.editExpress && script.buildExpress) {
            const script = new script(script.editExpress, script.buildExpress)
            action = script.getFunAction();
        }
        return action
    }
}

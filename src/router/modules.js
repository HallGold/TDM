import auditlog from "./auditlog";
import bpm from "./bpm";
import basic from "./basic";
import system from "./system";
import datamanage from "./datamanage";
import common from "./common";
import software from './biz/software'
import alteration from './biz/alteration'
import change from './biz/change'
import scheduler from "./scheduler";
import questionnaire from "./questionnaire";
import eq from "./biz/eq";
import auditreport from "./biz/auditreport"
import dev from "./biz/dev"
import businessProcess from "./biz/businessprocess"
import proBase from "./pro/base"
import proSc from "./pro/sc"
import events from "./biz/event"
import applyin from "./biz/applyin"
import devtool from './devtool'
import startandstop from "./biz/startandstop"
import institute from "./biz/institute"
import personnel from "./biz/personnel"
import universal from "./biz/universal"
import sys from "./biz/sys"
import rabbitmq from "./biz/rabbitmq"
import tdm from './tdm'

export default {
    auditlog: { appCode: 'system', res: auditlog },
    bpm: { appCode: 'system', res: bpm },
    basic: { appCode: 'system', res: basic },
    system: { appCode: 'system', res: system },
    tdm: { appCode: 'TDM', res: tdm },
    datamanage: { appCode: 'system', res: datamanage },
    common: { appCode: 'system', res: common },
    scheduler: { appCode: 'system', res: scheduler },
    questionnaire: { appCode: 'questionnaire', res: questionnaire },
    'biz/software': { appCode: 'SOFTREPOS', res: software },
    'biz/change': { appCode: 'SOFTREPOS', res: change },
    'biz/alteration': { appCode: 'Alteration', res: alteration },
    'biz/eq': { appCode: 'SOFTREPOS', res: eq },
    'biz/auditreport': { appCode: 'OperationReport', res: auditreport },
    'biz/dev': { appCode: 'dev', res: dev },
    'biz/businessprocess': { appCode: 'businessprocess', res: businessProcess },
    'pro/base': { appCode: 'pro', res: proBase },
    'pro/sc': { appCode: 'pro', res: proSc },
    'biz/event': { appCode: 'biz', res: events },
    'biz/applyin': { appCode: 'biz', res: applyin },
    'biz/startandstop': { appCode: 'biz', res: startandstop },
    'biz/institute': { appCode: "biz", res: institute },
    devtool: { appCode: 'devtool', res: devtool },
    'biz/personnel': { appCode: 'personnel', res: personnel },
    'biz/universal': { appCode: "biz", res: universal },
    'biz/sys': { appCode: "biz", res: sys },
    'biz/rabbitmq': { appCode: 'rabbitmq', res: rabbitmq },

}

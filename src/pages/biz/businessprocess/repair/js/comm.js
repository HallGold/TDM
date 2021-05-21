import {SERVER_NAME, AXIOS_TYPE_ENUM} from "@/pages/biz/js/comm";

export default {
    data() {
        return {
            REPAIR_ENUMS: {
                //质保信息
                QUALITY_INFO: {
                    BEFORE: 1,
                    AFTER: 2,
                    properties: [
                        {code: 1, name: "质保期内"},
                        {code: 2, name: "质保期外"}
                    ]
                },
                STATE: {
                    DRAFT: -1,
                    PROCESS: 1,
                    FINISH: 2,
                    RE_BACK: 3,
                    properties: [
                        {code: -1, name: "草稿"},
                        {code: 1, name: "审批中"},
                        {code: 2, name: "已完成"},
                        {code: 3, name: "驳回"},
                    ]
                },
                //维修类型
                REPAIR_TYPE: {
                    internal: 0,
                    external: 1,
                    properties: [
                        {code: 0, name: "所内维修"},
                        {code: 1, name: "送外维修"}
                    ]
                }
            }
        }
    }
}
import de from "element-ui/src/locale/lang/de";

export default {
    data() {
        return {
            ATTACHMENT_ENUMS: {
                institute_xgfj: "xgfj",//业务数据修改相关附件
                institute_pzsc: "pzsc",//系统安装配置手册
                institute_zyxq: "zyxq",//系统需求说明书
                institute_ywsc: "ywsc",//系统运维手册
                institute_cxb: "cxb",//程序包
                institute_bsb: "czsc",//部署包
                institute_bswj: "bswj",//部署文件
                institute_bmfa: "bmfa",//安全保密方案及评审意见
                institute_cpbg: "cpbg",//离线测评报告
                institute_psyj: "psyj",//评审意见
                institute_jsfa: "jsfa",//建设方案
                institute_xxfj: "xxfj",//下线相关附件
            }
        }
    },
    methods: {
        /**
         * 设置附件list
         * @param data
         * @param childType
         */
        setReFileVoList(data, childType, list) {
            this.deletes(list, this.findSameChildTypeList(childType,list));
            list.push(...data);
        },
        /**
         * 删除childType一样的附件list
         * @param childType
         * @returns {[]}
         */
        findSameChildTypeList(childType,list) {
            let _list = [];
            for (let i = 0; i < list.length; i++) {
                let fileInfo = list[i];
                if (fileInfo.childType1 == childType) {
                    _list.push(fileInfo);
                }
            }
            return _list;
        },
        /**
         * 组装附件map
         */
        assembleAttachmentMap(list, attachmentMap) {
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    let _attachment = list[i];
                    if (!attachmentMap[_attachment.childType1]) {
                        attachmentMap[_attachment.childType1] = [_attachment];
                    } else {
                        attachmentMap[_attachment.childType1].push(_attachment);
                    }
                }
            }
        },
    },
    mounted() {
    }
}
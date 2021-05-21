<template>
    <div>
        <base-property :ref="PAGE_ENUM.REFS.BASE_PROPERTY"
                       :is-edit="isEdit"
                       :main-data.sync="mainData"></base-property>
        <additive-property :ref="PAGE_ENUM.REFS.ADDITIVE_PROPERTY"
                           :is-edit="isEdit"
                           :main-data.sync="mainData"></additive-property>
        <permission-property :ref="PAGE_ENUM.REFS.PERMISSION_PROPERTY"
                             :is-edit="isEdit"
                             :main-data.sync="mainData"></permission-property>
        <duty-property :ref="PAGE_ENUM.REFS.DUTY_PROPERTY"
                       :is-edit="isEdit"
                       :main-data.sync="mainData"></duty-property>
        <rele-dev-property :ref="PAGE_ENUM.REFS.RELE_DEV_PROPERTY"
                           :is-edit="isEdit"
                           :main-data.sync="mainData"></rele-dev-property>
        <factory-property :ref="PAGE_ENUM.REFS.FACTORY_PROPERTY"
                          :is-edit="isEdit"
                          :main-data.sync="mainData"></factory-property>
    </div>
</template>

<script>
    import BaseProperty from "@/pages/biz/dev/comm/baseProperty";
    import AdditiveProperty from "./systemAdditiveProperty";
    import PermissionProperty from "./systemPermissionProperty";
    import DutyProperty from "./systemDutyProperty";
    import ReleDevProperty from "@/pages/biz/dev/comm/releDevProperty";
    import FactoryProperty from "@/pages/biz/dev/comm/factoryProperty";
    import EditComm from "../js/comm/editComm.js";

    export default {
        name: "systemEdit",
        mixins: [EditComm],
        components: {
            PermissionProperty,
            BaseProperty,
            AdditiveProperty,
            DutyProperty,
            ReleDevProperty,
            FactoryProperty
        },
        data() {
            return {
                //页面数据枚举
                PAGE_ENUM: {
                    REFS: {
                        BASE_PROPERTY: "baseProperty",
                        ADDITIVE_PROPERTY: "additiveProperty",
                        PERMISSION_PROPERTY: "permissionProperty",
                        DUTY_PROPERTY: "dutyProperty",
                        RELE_DEV_PROPERTY: "releDevProperty",
                        FACTORY_PROPERTY: "factoryProperty"
                    }
                },
            };
        }
    }
</script>

<style scoped>

</style>
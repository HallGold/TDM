<template>
    <div>
        <base-property :ref="PAGE_ENUM.REFS.BASE_PROPERTY"
                       :is-edit="isEdit"
                       :main-data.sync="mainData"></base-property>
        <duty-property :ref="PAGE_ENUM.REFS.DUTY_PROPERTY"
                       :is-edit="isEdit"
                       :main-data.sync="mainData"></duty-property>
        <standard-property :ref="PAGE_ENUM.REFS.STANDARD_PROPERTY"
                           :is-edit="isEdit"
                           :main-data.sync="mainData"></standard-property>
        <additive-property :ref="PAGE_ENUM.REFS.ADDITIVE_PROPERTY"
                           :is-edit="isEdit"
                           :main-data.sync="mainData"></additive-property>
        <permission-property :ref="PAGE_ENUM.REFS.PERMISSION_PROPERTY"
                             :is-edit="isEdit"
                             :main-data.sync="mainData"></permission-property>
        <rele-dev-property :ref="PAGE_ENUM.REFS.RELE_DEV_PROPERTY"
                           :is-edit="isEdit"
                           :is-mode="false"
                           :main-data.sync="mainData"></rele-dev-property>
        <factory-property :ref="PAGE_ENUM.REFS.FACTORY_PROPERTY"
                          :is-edit="isEdit"
                          :main-data.sync="mainData"></factory-property>
    </div>
</template>

<script>
    import BaseProperty from "../comm/baseProperty";
    import DutyProperty from "../comm/dutyProperty";
    import StandardProperty from "../comm/standardProperty";
    import AdditiveProperty from "./productAdditiveProperty";
    import PermissionProperty from "./productPermissionProperty";
    import ReleDevProperty from "../comm/releDevProperty";
    import FactoryProperty from "../comm/factoryProperty";
    import EditComm from "../js/comm/editComm.js";

    export default {
        name: "productEdit",
        mixins: [EditComm],
        components: {
            BaseProperty,
            AdditiveProperty,
            StandardProperty,
            PermissionProperty,
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
                        STANDARD_PROPERTY: "standardProperty",
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
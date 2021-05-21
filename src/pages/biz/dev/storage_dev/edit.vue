<template>
    <div>
        <base-property :ref="PAGE_ENUM.REFS.BASE_PROPERTY"
                       :main-data.sync="mainData"
                       :is-edit="isEdit"></base-property>
        <duty-property :ref="PAGE_ENUM.REFS.DUTY_PROPERTY"
                       :main-data.sync="mainData"
                       :is-edit="isEdit"></duty-property>
        <additive-property :ref="PAGE_ENUM.REFS.ADDITIVE_PROPERTY"
                           :main-data.sync="mainData"
                           :is-edit="isEdit"></additive-property>
        <standard-property :ref="PAGE_ENUM.REFS.STANDARD_PROPERTY"
                           :main-data.sync="mainData"
                           :is-edit="isEdit"></standard-property>
        <rele-dev-property :ref="PAGE_ENUM.REFS.RELE_DEV_PROPERTY"
                           :main-data.sync="mainData" v-show="false"
                           :is-edit="isEdit"></rele-dev-property>
        <factory-property :ref="PAGE_ENUM.REFS.FACTORY_PROPERTY"
                          :main-data.sync="mainData"
                          :is-edit="isEdit"></factory-property>
    </div>
</template>

<script>
    import BaseProperty from "../comm/baseProperty";
    import DutyProperty from "../comm/dutyProperty";
    import AdditiveProperty from "./storageDevAdditiveProperty";
    import StandardProperty from "../comm/standardProperty";
    import ReleDevProperty from "../comm/releDevProperty";
    import FactoryProperty from "../comm/factoryProperty";
    import EditComm from "../js/comm/editComm.js";

    export default {
        name: "storageDevEdit",
        mixins: [EditComm],
        components: {
            BaseProperty,
            AdditiveProperty,
            StandardProperty,
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
                        DUTY_PROPERTY: "dutyProperty",
                        STANDARD_PROPERTY: "standardProperty",
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
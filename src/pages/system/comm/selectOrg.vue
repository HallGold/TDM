<template>

    <ice-pop-selector
            load-url="/permission/frame_org/load_table_tree?loadDisabled=false"
            label-prop="deptName"
            value-prop="deptCode"
            :lazy="false"
            parent-prop="deptCode"
            data-url="/permission/frame_org/load_table_next_children?loadDisabled=false&hasSelf=true"
            textProp="deptShortName"
            :codeProp="valueProp"
            ref="select"
            :height="600"
            :gridIndex="false"
            mode="hidden"
            :query="query"
            @pagClick="pagClick"
            :loadParentData="loadParentData"
            :isLoadParentData="true"
            :columns="columns"
            :pagination="false"
            v-on="$listeners"
            v-bind="$attrs"
            v-model="innerValue">

        <span slot="tag" slot-scope="scope">
                {{scope.item.deptShortName}}
        </span>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../components/common/base/IcePopSelector";

    export default {
        name: "IceDeptSelector",
        model: {
            prop: 'value',
            event: 'IceDeptSelectorchange'
        },
        props: {
            value: String,
            valueProp: {
                type: String,
                default: 'deptCode'
            },
        },
        data() {
            return {
                arr:[],
                innerValue: '',
                query: [
                    {type: 'input', label: '单位名称', code: 'deptShortName', value: '', exp: 'like'},
                    {type: 'input', label: '单位编码', code: 'deptCode', value: '', exp: 'like'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '单位名称', code: 'deptShortName', width: 220},
                    {label: '单位编码', code: 'deptCode', width: 120},]
            }
        },
        methods: {
            pagClick(data){
                this.arr = data.filter(item=>item.deptName==item.orgName);
            },
            loadParentData(){//子组件回调
                return this.arr;
            },
            openDialog() {
                this.$refs.select.openDialog();
            },
            cleanColumnSelect() {
                this.$refs.select.cleanColumnSelect();
            }
        },
        computed: {},
        watch: {
            value() {
                this.innerValue = this.value;
            },
            innerValue() {
                this.$emit("IceDeptSelectorchange", this.innerValue);
            },
        },
        mounted() {
            this.innerValue = this.value;
        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>

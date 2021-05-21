<template>
    <div  style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <el-dialog v-dialogDrag title="指定组织" custom-class="ice-dialog" center :visible.sync="dialogVisiblea"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForma"  label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="组织ID" label-width="100px" prop="organizationId">
                                <el-select placeholder="组织ID" v-model="mainDataForma.organizationId">
                                    <el-option label="申请人组织" value="{applierOrganization}"></el-option>
                                    <el-option label="当前处理人组织" value="{currentOrganization}"></el-option>
                                    <el-option label="变量:特定组织" value="{specialOrganization}"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="组织名称" label-width="100px" prop="organizationName">
                                 <el-input v-model="mainDataForma.organizationName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="岗位线ID" label-width="100px" prop="organizationId">
                                <el-select placeholder="组织ID" v-model="mainDataForma.organizationId">
                                    <el-option label="申请人组织" value="{applierOrganization}"></el-option>
                                    <el-option label="当前处理人组织" value="{currentOrganization}"></el-option>
                                    <el-option label="变量:特定组织" value="{specialOrganization}"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="岗位线名称" label-width="100px" prop="organizationName">
                                <el-input v-model="mainDataForma.organizationName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="岗位ID" label-width="100px" prop="organizationId">
                                <el-select placeholder="组织ID" v-model="mainDataForma.organizationId">
                                    <el-option label="申请人组织" value="{applierOrganization}"></el-option>
                                    <el-option label="当前处理人组织" value="{currentOrganization}"></el-option>
                                    <el-option label="变量:特定组织" value="{specialOrganization}"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="岗位名称" label-width="100px" prop="organizationName">
                                <el-input v-model="mainDataForma.organizationName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
             <!--       <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="上级组织类型" label-width="100px" prop="parentOrganizationType">
                                <el-select v-model="mainDataForma.parentOrganizationType" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in optionsa"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下级组织类型" label-width="100px" prop="childOrganizationType">
                                <el-select v-model="mainDataForma.childOrganizationType" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in optionsA"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="使用上级组织" label-width="100px" prop="autoParentOrganization">
                                <el-checkbox v-model="mainDataForma.autoParentOrganization">{{mainDataForma.autoParentOrganization?"是":"否"}}</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="savea">保存</el-button>
                    <el-button type="info" @click="reta">返回</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue';
    export default {
        name: "ExtOrganization",
        components: {IceGridLayout},
        data(){
            return{
                mainDataForma:{
                    organizationId:'',
                    organizationName:'',
                    parentOrganizationType:[],
                    childOrganizationType:[],
                    autoParentOrganization:true
                },
                dialogVisiblea:false,
                optionsa: [{
                    value: 'B01',
                    label: '总部'
                }, {
                    value: 'B02',
                    label: '电商'
                }, {
                    value: 'B03',
                    label: '游戏'
                }, {
                    value: 'B04',
                    label: '协同'
                }, {
                    value: '[*]',
                    label: '[任意类型]'
                }],
                optionsA: [{
                    value: 'F01',
                    label: '财务'
                }, {
                    value: 'F02',
                    label: '采购'
                }, {
                    value: 'F03',
                    label: '销售'
                }, {
                    value: 'F04',
                    label: '人事'
                }, {
                    value: '[*]',
                    label: '[任意类型]'
                }]
            }
        },
        methods:{
            savea(){
                this.dialogVisiblea=false;
                this.$emit("set-ext-organization",this.mainDataForma);
            },
            reta(){
                this.dialogVisiblea=false;
            }
        }

    }
</script>

<style scoped>

</style>

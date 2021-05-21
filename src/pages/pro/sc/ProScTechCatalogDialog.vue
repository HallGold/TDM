<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <div class="ice-container">
                <el-form :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editFormDialog"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="担当岗位:" label-width="140px" prop="profession">
                                <el-input v-model="editData.profession" maxlength="36"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="第三方技术支持:" label-width="140px" prop="thirdparty">
                                <el-select placeholder="请选择" v-model="editData.thirdparty">
                                    <el-option v-for="item in thirdPartyList"
                                            :key="item.oid"
                                            :label="item.unitname"
                                            :value="item.unitname"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> 
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                                <el-form-item label="贡献值:" label-width="140px" prop="score">
                                    <el-input-number v-model="editData.score" 
                                                     controls-position="right"
                                                     :precision="2" 
                                                     :min="0">
                        
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="难度系数:" label-width="140px" prop="difficuty">
                                    <el-input-number v-model="editData.difficuty" 
                                                     controls-position="right"
                                                     :min="0">
                        
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="有效开始时间:" label-width="120px" prop="gmtBegin">
                                <el-date-picker
                                    v-model="editData.gmtBegin"
                                    type="date"
                                    placeholder="选择日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
                                <el-date-picker
                                    v-model="editData.gmtEnd"
                                    type="date"
                                    placeholder="选择日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
            </div>
    </div>
    
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import common from '@/utils/common.js';
    export default {
        name: "ProScTechCatalogDialog",
        components: {IceQueryGrid,IceSelect,IceTree},
        props:{
            checkedIds:{
                type: String,
            },
            isSuccess:Function
        },
        data(){
            let editColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '运维组织ID', code: 'tendId', hidden: true},

                {label: '贡献值', code: 'contributionValue', width: 160},
                {label: '难度系数', code: 'difficuty', width: 160},
                {label: '担当岗位', code: 'profession', width: 100},
                {label: '第三方技术支持', code: 'thirdparty', width: 180},
                {label: '有效开始时间', code: 'gmtBegin', width: 160},
                {label: '有效结束时间', code: 'gmtEnd', width: 120},];
            return {
                editData: common.toInitData(editColumns, {
                    // isUsedUserLevel: '0',
                    // serviceLevel: '',
                    // thirdPartService:'0'
                    // areaShortname: this.treeName + ''
                }),
                editRules: common.toFormRules(editColumns),
                innerVisible:false,
                innerSLAVisible:false,
                selectedNode:{},
                options:[
                    {label:'1',value:'1'},
                    {label:'2',value:'2'},
                    {label:'3',value:'3'},
                    {label:'4',value:'4'},
                    {label:'5',value:'5'},
                    {label:'6',value:'6'},
                    {label:'7',value:'7'},
                ],
                thirdPartyList:[]
            }
        },
        methods:{
            show(){
                // this.$refs.mainQueryGrid.refresh();
            },
            refresh() {
                // this.$refs.mainQueryGrid.refresh();
            },
            saveData(){
                let _this = this;
                this.$refs['editFormDialog'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    let list = [];
                    _this.checkedIds.split(',').forEach(item => {
                        if(item){
                            let param = Object.assign({}, _this.editData);
                            param.oid = item
                            list.push(param)
                        }
                    });
                    this.$axios.post("/pro/ProScTechCatalog/allUpudate", {"list": JSON.stringify(list)})
                        .then(result => {
                            this.$emit('closeDialog')
                            this.$message.success("保存成功");
                            this.isSuccess();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
        },
        mounted(){
            this.$nextTick(() => {
                //获取第三方技术支持方信息
                this.$axios.get('/pro/ProScTechCatalog/allThirdparty')
                            .then(result => {
                                this.thirdPartyList = result.data
                            }).catch(error => {
                                this.$message.error(error.msg);
                        });
            })
        },
        watch:{
            'editData.gmtEnd':{
                handler:function (val) {
                    if(this.editData.gmtBegin){
                        if(val<=this.editData.gmtBegin){
                            this.$message.error('有效开始时间不能大于有效结束时间');
                            this.editData.gmtBegin='';
                            this.editData.gmtEnd='';
                        }
                    }
                }
            },
            'editData.gmtBegin':{
                handler:function (val) {
                    if(this.editData.gmtEnd){
                        if(val>=this.editData.gmtEnd){
                            this.$message.error('有效开始时间不能大于有效结束时间');
                            this.editData.gmtBegin='';
                            this.editData.gmtEnd='';
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
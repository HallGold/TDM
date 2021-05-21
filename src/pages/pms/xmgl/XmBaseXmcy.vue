<template>
    <!--新增项目成员-->
    <div>
        <div class="ice-container">
            <!--新增项目成员按钮-->
            <div  style="display: flex; flex-direction: row">
                <el-button type="primary" @click="addXmcy">新增</el-button>
            </div>
            <!--列展示头-->
            <vxe-table
                    border
                    resizable
                    show-overflow
                    highlight-current-row
                    highlight-hover-row
                    max-height="800"
            >
                <!--列展示头的内容字段名称-->
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column field="xmcylx" width="128" title="项目角色"></vxe-table-column>
                <vxe-table-column field="name" width="128" title="人员姓名"></vxe-table-column>
                <vxe-table-column field="code" width="128" title="人员编码"></vxe-table-column>
                <vxe-table-column field="deptName" width="128" title="所属单位"></vxe-table-column>
                <vxe-table-column field="deptCode" width="128" title="所属单位编码"></vxe-table-column>
            </vxe-table>

        </div>
        <div class="ice-container" >
            <!--点击新增人员的时候弹出模态框-->
            <ice-dialog title="新增项目成员"  :visible.sync="visibleXzry" width="900px">
                <el-form ref="Xzryfrom" :model="formXzryModel" v-loading="loadingXzry"  :rules="rulesXzry">
                    <el-row :gutter="20">
                        <!--新增人员第一行-->
                        <el-col :span="24">
                            <el-form-item label="项目角色" label-width="90px" prop="xmcylx">
                                <ice-select v-model="formXzryModel.xmcylx" map-type-code="XMCYLX"
                                            filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <!--新增人员第二行-->
                        <el-col :span="12">
                            <el-form-item label="人员姓名" label-width="90px" prop="name">
                                <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formXzryModel.name" @select-confirm="selectDepRyxm">
                                </ice-persion-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="人员编码" label-width="100px" prop="code">
                                <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formXzryModel.code" v-model="formXzryModel.code" :aria-disabled="true">
                                </ice-persion-selector>
                            </el-form-item>
                        </el-col>
                        <!--新增人员第三行-->
                        <el-col :span="12">
                            <el-form-item label="所属单位" label-width="90px" prop="deptName">
                                <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formXzryModel.deptName" @select-confirm="selectDept">
                                </ice-dept-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属单位编码" label-width="100px" prop="deptCode" >
                                <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formXzryModel.deptCode" v-model="formXzryModel.deptCode" :aria-disabled="true" >
                                </ice-persion-selector>
                            </el-form-item>
                        </el-col>
                        <!--新增人员第四行-->
                        <el-col :span="24">
                            <el-form-item label="项目目标" label-width="90px" prop="zzsm">
                                <el-input v-model="formXzryModel.zzsm" placeholder="不超过650个字" maxlength="650"
                                          show-word-limit type="textarea" :rows="2">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--模态框:新增人员保存和关闭按钮-->
                <div class="ice-button-bar">
                    <el-button type="primary" >保存</el-button><!--@click="saveXzry"-->
                    <el-button type="info" >关闭</el-button>  <!--@click="visibleXzry = false"-->
                </div>
            </ice-dialog>
        </div>
    </div>

</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    export default {
        name: "XmBaseXmcy",
        data(){
            return{
                /**
                 * 定义变量区
                 */
                //定义设置模态框默认为false(关闭状态)
                visibleXzry: false,

                //定义设置默认loding为false
                loadingXzry: false,


            }//return底部

        },//data底部

        //《新增项目成员》方法区
        methods:{
            addXmcy(){
                this.visibleXzry = true;    //设置新增人员的时候模态框为true
            },

            //点击选择部门的时候自动查询部门编码
            selectDept(depts){
                this.formXzryModel.deptCode=depts[0].deptCode
                this.formXzryModel.deptName = depts[0].deptShortName
                this.formXzryModel.deptId=depts[0].oid
            },
            //点击选择人员的时候自动查询人员编码
            selectDepRyxm(depts){
                this.formXzryModel.code =depts[0].code
                this.formXzryModel.deptId=depts[0].oid
            },






        },//methods底部


        //组件引用区
        components: {IceDeptSelector, IcePersionSelector, IceSelect, IceDialog, IceQueryGrid}
    }
</script>

<style scoped>

</style>
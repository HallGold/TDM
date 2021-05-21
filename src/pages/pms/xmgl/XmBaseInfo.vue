<template>
    <div ref="XminfoBase">
        <el-form :model="formModel" ><!--:rules="rules" :v-loading="loading" ref="form"-->
            <el-row :gutter="20">
                <!--第一行-->
                <el-col :span="8">
                    <el-form-item label="项目名称" label-width="110px" prop="xmname">
                        <el-input v-model="formModel.xmname"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所内项目编号" label-width="110px" prop="xmcode">
                        <el-input v-model="formModel.xmcode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所外项目编号" label-width="110px" prop="xmcode">
                        <el-input v-model="formModel.xmcodeyn"></el-input>
                    </el-form-item>
                </el-col>
                <!--第二行-->
                <el-col :span="8">
                    <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                        <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目状态" label-width="110px" prop="xmzt">
                        <ice-select v-model="formModel.xmzt" map-type-code="XMZT" filterable
                                    placeholder="请选择"></ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目类别" label-width="110px" prop="xmlb">
                        <ice-select v-model="formModel.xmlb" map-type-code="XMLB0101" filterable
                                    placeholder="请选择"></ice-select>
                    </el-form-item>
                </el-col>
                <!--第三行-->
                <el-col :span="8">
                    <el-form-item label="学科方向" label-width="110px" prop="xmxkfx">
                        <ice-select v-model="formModel.xmxkfx" map-type-code="XMXKFX" filterable
                                    placeholder="请选择"></ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上报状态" label-width="110px" prop="sbzt">
                        <ice-select v-model="formModel.sbzt" map-type-code="SBZT" filterable
                                    placeholder="请选择"></ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="立项日期" label-width="110px" prop="gmtLx">
                        <el-date-picker v-model="formModel.gmtLx"></el-date-picker>
                    </el-form-item>
                </el-col>
                <!--第四行-->
                <el-col :span="8">
                    <el-form-item label="责任单位" label-width="110px" prop="orgid">
                        <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.orgid" @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                        </ice-dept-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="责任人" label-width="110px" prop="personid">
                        <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formModel.deptCode" v-model="formModel.personid" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                        </ice-persion-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目主管" label-width="110px" prop="xmzg">
                        <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.xmzg" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                        </ice-persion-selector>
                    </el-form-item>
                </el-col>
                <!--第五行-->
                <el-col :span="8">
                    <el-form-item label="业务主管部门" label-width="110px" prop="xmzgbm">
                        <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.xmzgbm" @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                        </ice-dept-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="技术负责人" label-width="110px" prop="personidJs">
                        <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.personidJs" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                        </ice-persion-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行政负责人" label-width="110px" prop="personidXz">
                        <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.personidXz" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                        </ice-persion-selector>
                    </el-form-item>
                </el-col>
                <!--第六行-->
                <el-col :span="8">
                    <el-form-item label="全时人力投入" label-width="110px" prop="rltr">
                        <el-input v-model="formModel.rltr"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="预算经费合计" label-width="110px" prop="ysjfhj">
                        <el-input v-model="formModel.ysjfhj"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预算号" label-width="110px" prop="yscode">
                        <el-input v-model="formModel.yscode"></el-input>
                    </el-form-item>
                </el-col>
                <!--第七行-->
                <el-col :span="24">
                    <el-form-item label="项目目标" label-width="110px" prop="xmmb">
                        <el-input v-model="formModel.xmmb" placeholder="不超过650个字" maxlength="650"
                                  show-word-limit type="textarea" :rows="2">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!--第八行-->
                <el-col :span="24">
                    <el-form-item label="项目经费渠道建议" label-width="110px" prop="xmjfqd">
                        <el-input v-model="formModel.xmjfqd" placeholder="不超过650个字" maxlength="650"
                                  show-word-limit type="textarea" :rows="2">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!--第九行-->
                <el-col :span="24">
                    <el-form-item label="备注" label-width="110px" prop="dateRemark">
                        <el-input v-model="formModel.dateRemark" placeholder="不超过650个字" maxlength="650"
                                  show-word-limit type="textarea"
                                  :rows="2">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    export default {
        name: "XmBaseInfo",

        data (){
            return {
                //form数据双向绑定使用
                formModel:{
                    xmname: '', //项目名称
                    xmcode: '',//
                    xmcodeyn: '',//
                    dataSecretLevcode: '2', //默认选择为2
                    xmzt: 'XMZT01',//
                    xmlb: 'XMLB01010101',// 默认选择为XMLB01010101
                    xmxkfx: 'XMXKFX01',//
                    xmjfqd: '',//
                    xmzgbm: '',//
                    xmzg: '',//
                    orgid: '',//
                    personid: '',//
                    personidJs: '',//
                    personidXz: '',//
                    sbzt: 'SBZT01',//
                    xmmb: '',//
                    rltr: '',//
                    gmtLx: '',//
                    xmysh: '',//
                    yscode:'',//
                    dateRemark: '',//
                    ysjfhj: '',//预算经费合计
                },
            }
        },

      //《新增项目基本信息》方法区
        methods:{

        },

        components: {IceSelect, IcePersionSelector, IceDeptSelector},
    }
</script>

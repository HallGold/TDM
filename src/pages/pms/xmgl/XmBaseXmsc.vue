<template>
    <div ref="XminfXmsc"><!--项目基本信息*《项目输出》-->
        <!--添加项目输出附件上传-->
        <div style="display: flex; flex-direction: row">
            <ice-single-upload :on-success="fileUploadSuccessXmsc" ref="fileUploadXmsc"></ice-single-upload>
            <el-button type="danger" style="margin-left: 10px;">删除</el-button>  <!--删除事件 @click="deleteAttaXmsc"-->
        </div>
        <vxe-table
                border show-overflow
                ref="attaTableXmsc"
                max-height="800"

        ><!--:data="queryListXmsc" 查询数据 -->
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>    <!--以下行定义列-->
            <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="xmname" width="128" title="项目名称"></vxe-table-column>
            <vxe-table-column field="xmstage" width="128" title="项目阶段">
                <template v-slot="{ row }">
                    <ice-select  disabled v-model="row.xmstage" map-type-code="XMSTAGE"></ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="filename" width="128" title="文件名称"></vxe-table-column>
            <vxe-table-column field="filecode" width="128" title="文件编号"></vxe-table-column>
            <vxe-table-column field="fileLyDwname" width="128" title="编写单位"></vxe-table-column>
            <vxe-table-column field="fileBxr" width="128" title="编写人"></vxe-table-column>
            <vxe-table-column field="spzt" width="130" title="审批状态">
                <template v-slot="{ row }">
                    <ice-select disabled v-model="row.spzt" map-type-code="SPZT"></ice-select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="fileDateCreate" width="130" title="上传日期"></vxe-table-column>
            <vxe-table-column field="fileDateSp" width="135" title="审批通过日期"></vxe-table-column>
            <vxe-table-column   field="operator" title="操作" width="80">
                <template v-slot="{ row }">
                    <template>
                        <el-button type="text" @click="downloadFileXmsc(row)">下载</el-button>
                    </template>
                </template>
            </vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    export default {
        name: "XmBaseXmsc",
        components: {IceSingleUpload},
        data(){
          return{

          }
        },

        //《项目输出》方法区
        methods:{
            //项目输出附件上传
            fileUploadSuccessXmsc(response, file){
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                this.$refs.fileUploadXmsc.reset();
                this.$refs.attaTableXmsc.insertAt(record, -1)
                    .then(({ row }) => this.$refs.attaTableXmsc.setActiveCell(row));
            },
            //项目输出附件上传删除（选中列删除）
            deleteAttaXmsc () {
                this.$refs.attaTableXmsc.removeSelecteds()
            },
        },


    }
</script>

<style scoped>

</style>
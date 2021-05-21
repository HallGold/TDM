<template>
  <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
    <ice-tree-grid load-url="/tdm/TdmDocumentCategory/tree?type=1"
                   ref="DataLnquireRef"
                   label-prop="name"
                   childrenProp="child"
                   value-prop="oid"
                   :lazy="false"
                   data-url="tdm/dataCollection/list"
                   :pagination="true"
                   :query="query"
                   :columns="columns"
                   :operations="operations"
                   chooseItem="single"
                   :gridIndex="false"
                   @node-click="dataTree"
                   :operations-width="150"
                   @selection-change="selectionChange">
    </ice-tree-grid>
    <!-- 详情 -->
    <ice-dialog v-dialogDrag
                title="数据详情"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">数据详情</div>
      <div class="headers">
        <ul>
          <li>
            设备名称:<span>{{ DetailsData.equipmentName }}</span>
          </li>
          <li>
            设备编号:<span>{{ DetailsData.equipmentNumber }}</span>
          </li>
          <li>
            文件名称:<span>{{ DetailsData.fileName }}</span>
          </li>
          <li>
            文件格式：<span>{{ DetailsData.fileFormat }}</span>
          </li>
          <li>
            设备IP地址：<span>{{ DetailsData.hostComputerIp }}</span>
          </li>
          <!-- <li>
            负责人：<span>{{ DetailsData.data6 }}</span>
          </li> -->
          <li>
            文件路径：<span>{{ DetailsData.hostComputerPath }}</span>
          </li>
        </ul>
      </div>
    </ice-dialog>
  </div>
</template>

<script>
import IceTreeGrid from "@/components/common/base/IceTreeGrid";
import IceDialog from "@/components/common/base/IceDialog";
import Vue from "vue";
import { Loading } from "element-ui";

export default {
  name: "DataLnquire",
  components: { IceTreeGrid, IceDialog },
  data () {
    return {
      query: [
        //组件查询
        {
          type: "input",
          label: "文件名称/设备编号/IP地址",
          code: "searchTerm",
          value: "",
        },
        {
          type: "static",
          code: "equipmentId",
          label: "",
          value: () => {
            return this.groupId;
          },
        }, //定义高级模糊查询方法
      ],
      columns: [
        //组件table列
        { code: "id", hidden: true },
        {
          label: "文件名称",
          code: "fileName",
          width: 150,
          align: "center",
        }, {
          label: "设备名称",
          code: "equipmentName",
          width: 150,
          showTips: true,
          align: "left",
        },
        {
          label: "设备编号",
          code: "equipmentNumber",
          width: 150,
          align: "center",
        },
        {
          label: "文件格式",
          code: "fileFormat",
          width: 150,
          align: "center",
        },
        {
          label: "设备IP地址",
          code: "hostComputerIp",
          width: 150,
          align: "center",
        },
        /* {
          label: "负责人",
          code: "modelName",
          width: 150,
          align: "center",
        }, */
        {
          label: "文件路径",
          code: "hostComputerPath",
          width: 150,
          align: "center",
        },
      ],
      operations: [
        { name: "查看详情", callback: this.detail },
        /*   { name: "删除", callback: this.deleted }, */
      ], //组件table列操作按钮
      dialogVisible: false,
      /* 详情数据 */
      DetailsData: {
        equipmentName: "",
        equipmentNumber: "",
        fileName: "",
        fileFormat: "",
        hostComputerIp: "",
        /*  data6: "", */
        hostComputerPath: "",
      },
      groupId: "", //用于根据左边树形的类型来获取右边列表数据的参数
    };
  },
  methods: {
    /**
     * 刷新
     */
    refresh () {
      this.$nextTick(() => {
        this.$refs.DataLnquireRef.$refs.queryGrid.refresh();
      });
    },
    /**
     * 点击树节点，获取节点信息
     */
    dataTree (data, node) {
      this.groupId = data;
      console.log(node);
      this.$refs.DataLnquireRef.$refs.queryGrid.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    /* 详情 */
    detail (row) {
      console.log(row);
      this.DetailsData = row;
      this.dialogVisible = true;
    },
    /* 删除 */
    /*  deleted() {}, */
    /**
     * 列表勾选的数据
     */
    selectionChange (rows) { },
  },
};
</script>

<style lang="less" scoped>
.headers {
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 700;
    padding: 20px 20px;
    li {
      width: 50%;
      margin-bottom: 20px;
    }
  }
}
.titleName {
  position: relative;
  padding: 0 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 25px;
    background-color: #0091b0;
    position: absolute;
    top: -2px;
    left: 8px;
  }
}
</style>

<template>
  <div class="container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary"
                   @click="showAddEvent">样品收样</el-button>
        <el-button type="primary">删除</el-button>
        <!--     <vxe-button status="primary" content="导入"></vxe-button>
                        <vxe-button status="primary" content="导出"></vxe-button> -->
      </template>
      <template v-slot:tools>
        <vxe-input v-model="query"
                   placeholder="搜索"
                   style="margin-right:5px"></vxe-input>
        <el-button type="primary">查询</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table align="center"
               border
               resizable
               :data="tableData"
               :edit-config="{ trigger: 'click', mode: 'cell' }">
      <vxe-table-column type="checkbox"
                        width="60"></vxe-table-column>
      <vxe-table-column field="sampleNumber"
                        title="样品编号"></vxe-table-column>
      <vxe-table-column field="sampleName"
                        title="样品名称"></vxe-table-column>
      <vxe-table-column field="reservationNumber"
                        title="预约编号"></vxe-table-column>
      <vxe-table-column field="sampleDeliveryUnit"
                        title="送样单位"></vxe-table-column>
      <vxe-table-column field="receiveSamplesPeople"
                        title="送样人"
                        :edit-render="{
          name: 'input',
          immediate: true,
          attrs: { type: 'text' },
        }"></vxe-table-column>
      <vxe-table-column field="receivePeople"
                        title="收样人"
                        :edit-render="{
          name: 'input',
          immediate: true,
          attrs: { type: 'text' },
        }"></vxe-table-column>
      <vxe-table-column field="receiveSamplesTime"
                        title="收样时间"></vxe-table-column>
      <vxe-table-column field="receiveSamplesWarehouseId"
                        title="收样仓库"
                        :edit-render="{ name: '$select', options: sexList }"></vxe-table-column>
      <!-- <vxe-table-column
        field="aaaName"
        title="储存条件"
        :edit-render="{ autofocus: '.myinput' }"
      >
        <template v-slot:edit="{ row }">
          <div>
            <vxe-select
              :autoselect="true"
              class="myinput"
              v-model="row.aaa"
              :options="condition"
              :optionProps="optionProps"
              :defaultValue="0"
              multiple
              @change="
                (val) => {
                  change(val, condition, row);
                }
              "
              option-id="id"
            >
            </vxe-select>
          </div>
        </template>
      </vxe-table-column> -->
      <vxe-table-column field="storageConditions"
                        title="存储条件"
                        :edit-render="{
          name: '$select',
          options: storageCondition,
          optionProps: optionProps,
          defaultValue: 0,
          props: { multiple: true },
        }"></vxe-table-column>
      <vxe-table-column field="sampleAttribute"
                        title="属性"
                        :edit-render="{
          name: '$select',
          options: AttributeCondition,
          optionProps: optionProps,
          defaultValue: 0,
          props: { multiple: true },
        }"></vxe-table-column>
      <vxe-table-column field="sampleNum"
                        title="入库总量"
                        :edit-render="{
          name: 'input',
          immediate: true,
          attrs: { type: 'text' },
        }"></vxe-table-column>
      <vxe-table-column field="unit"
                        title="单位"
                        :edit-render="{ name: '$select', options: unit }"></vxe-table-column>
      <vxe-table-column field="status"
                        title="库存状态"
                        :edit-render="{ name: '$select', options: status }"></vxe-table-column>
      <vxe-table-column field="isDynamite"
                        title="是否炸药"
                        :edit-render="{ name: '$select', options: isDynamite }"></vxe-table-column>
      <vxe-table-column field="isEntrust"
                        title="是否委外"
                        :edit-render="{ name: '$select', options: isTrust }"></vxe-table-column>
      <vxe-table-column field="entrustEnterprise"
                        title="委外单位"
                        :edit-render="{
          name: 'input',
          immediate: true,
          attrs: { type: 'text' },
        }"></vxe-table-column>
    </vxe-table>
    <vxe-modal v-model="showDetails"
               title="实验预约样品清单"
               width="1600"
               height="800   "
               center
               resize>
      <ice-query-grid title="实验报告添加"
                      data-url="tdm/sample/list"
                      :pagination="true"
                      :columns="columns"
                      ref="grid"
                      chooseItem="multiple"
                      :query="IceQuery"
                      @selection-change="handleSelectionChange"></ice-query-grid>
      <div class="ice-button-bar">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="closeDialog">取消
        </el-button>
      </div>
    </vxe-modal>
    <ice-pagination @size-change="sizeChange"
                    @current-change="currentChange"
                    :current-page="pageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-size="pageSize"
                    :total="total">
    </ice-pagination>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IcePagination from "@/components/common/base/IcePagination.vue";

export default {
  name: "SampleStorage",
  components: { IceQueryGrid, IcePagination },
  data () {
    return {
      query: "",
      IceQuery: [
        { type: "input", label: "预约单号", code: "searchTerm", value: "" },
      ],
      tableData: [],
      sexList: [
        { label: "807-103", value: "0" },
        { label: "807-103", value: "1" },
        { label: "807-103", value: "2" },
      ],
      optionProps: { value: "id", label: "name" },
      storageCondition: [],
      AttributeCondition: [
        { name: "干燥", id: "0" },
        { name: "避光", id: "1" },
        { name: "低温", id: "2" },
        { name: "恒温", id: "3" },
      ],
      unit: [
        { label: "克", value: "0" },
        { label: "毫升", value: "1" },
        { label: "毫克", value: "2" },
      ],
      status: [
        { label: "正常入库", value: "0" },
        { label: "入库暂存", value: "1" },
      ],
      isDynamite: [
        { label: "是", value: "0" },
        { label: "否", value: "1" },
      ],
      isTrust: [
        { label: "是", value: "0" },
        { label: "否", value: "1" },
      ],
      /* 弹窗 */
      showDetails: false,
      /* 弹窗表单 */
      columns: [
        { code: "id", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",
          width: 100,
          align: "center",
        },
        {
          label: "预约单位",
          code: "entrustUnit",
          width: 100,
          align: "center",
        },
        {
          label: "预约时间",
          code: "reservationTime",
          width: 100,
          align: "center",
        },
        {
          label: "预约人",
          code: "reservationPeople",
          width: 100,
          align: "center",
        },
        {
          label: "检测项目",
          code: "testItems",
          width: 100,
          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 100,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 100,
          align: "center",
        },
        {
          label: "数量",
          code: "sampleNum",
          width: 100,
          align: "center",
        },
        {
          label: "单位",
          code: "unit",
          width: 100,
          align: "center",
        },
        {
          label: "属性",
          code: "sampleAttributes",
          width: 100,
          align: "center",
          renderCell (h, data) {
            return data.row.sampleAttributes[0].name;
          },
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 100,
          align: "center",
        },
        {
          label: "是否委外",
          code: "isEntrust",
          width: 100,
          align: "center",
        },
      ],
      /* 弹窗表单选中的数据 */
      SelectedData: [],
      /* 分页 */
      pageSize: 20,
      pageNum: 1,
      total: 100,
    };
  },
  methods: {
    /* change(val, condition, row) {
      console.log(val);
      let items = condition.filter((c) => {
        return val.value.indexOf(c.id) != -1;
      });
      let names = items
        .map((c) => {
          return c.name;
        })
        .join();
      row.aaaName = names;
    }, */
    /* 新增事件 */
    showAddEvent () {
      this.showDetails = true;
      this.SelectedData = [];
    },
    /* 保存 */
    save () {
      this.tableData = this.SelectedData;
      this.tableData.forEach((e) => {
        this.storageCondition = e.sampleAttributes;
      });
      this.showDetails = false;
    },
    closeDialog () {
      this.showDetails = false;
    },
    /* 新增列表选中 */
    handleSelectionChange (row) {
      this.SelectedData = row;
    },
    /* 分页 */
    sizeChange (size) {
      this.pageSize = size;
    },
    currentChange (page) {
      this.pageNum = page;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
  position: relative;
}

.vxe-toolbar {
  padding: 0 10px;
}

.el-pagination {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>

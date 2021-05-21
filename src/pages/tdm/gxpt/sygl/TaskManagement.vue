<template>
  <div class="container">
    <ice-query-grid title="班组任务管理"
                    data-url="tdm/experiment/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="grid"
                    :gridIndex="false"
                    :operationsWidth="420"
                    chooseItem="single"
                    :query="query"></ice-query-grid>
    <!-- 查看详情 -->
    <ice-dialog v-dialogDrag
                title="实验作业详情"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">实验作业详情</div>
      <div class="headers">
        <h2>
          <div><span>实验作业编号:</span> <span>PT12001</span></div>
          <div>
            <el-button type="primary"
                       icon="el-icon-video-play">开工</el-button>
            <el-button type="primary"
                       icon="el-icon-switch-button">完工</el-button>
            <el-button type="primary"
                       icon="el-icon-s-tools">修改</el-button>
          </div>
        </h2>
        <ul>
          <li>
            预约编号：<span>{{ DetailsData.reservationNumber }}</span>
          </li>
          <li>
            预约日期：<span>{{ DetailsData.createTime }}</span>
          </li>
          <li>
            样品编号：<span>{{ DetailsData.sampleNumber }}</span>
          </li>
          <li>
            样品名称：<span>{{ DetailsData.sampleName }}</span>
          </li>
          <li>
            检测项目：<span>{{ DetailsData.projectName }}</span>
          </li>
          <li>
            实验室编号：<span>{{ DetailsData.laboratoryName }}</span>
          </li>
          <li>
            作业人员：<span>{{ DetailsData.peopleName }}</span>
          </li>
          <li>
            检测设备：<span>{{ DetailsData.equipmentName }}</span>
          </li>
          <li>
            实验状态：<span>{{
              DetailsData.status == 1
                ? "待试验"
                : DetailsData.status == 2
                ? "实验中"
                : DetailsData.status == 3
                ? "已完成(未上传数据)"
                : "已上传数据"
            }}</span>
          </li>
        </ul>
      </div>
    </ice-dialog>
    <!-- 任务下发和更改实验人员 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="TaskReleaseVisible"
                :close-on-click-modal="false"
                :before-close="TaskReleaseCancel"
                append-to-body
                width="300px">
      <div class="titleName">{{ title }}</div>
      <div class="TaskRelease">
        <el-select v-model="value"
                   filterable
                   remote
                   reserve-keyword
                   placeholder="请选择"
                   :remote-method="remoteMethod"
                   :loading="loading"
                   @change="SelectChange"
                   @focus="focus">
          <el-option v-for="item in options"
                     :key="item.peopleId"
                     :label="item.name"
                     :value="item.peopleId">
          </el-option>
        </el-select>
      </div>

      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="TaskReleaseConfirm">确认</el-button>
        <el-button type="info"
                   size="medium"
                   @click="TaskReleaseCancel">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import Vue from "vue";
import LoginVue from "../../../common/Login.vue";
export default {
  name: "TaskManagement",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        {
          type: "input",
          label: "检测项目/实验室编号/设备名称/样品名称",
          code: "searchTerm",
          value: "",
        },
        { type: "static", code: "type", value: "1" },
      ],
      /* 样品登记表格数据 */
      columns: [
        { code: "id", hidden: true },
        {
          label: "实验作业编号",
          code: "operationNumber",
          width: 90,
          align: "center",
        },
        {
          label: "预约编号",
          code: "reservationNumber",
          width: 90,
          align: "center",
        },
        {
          label: "预约日期",
          code: "createTime",
          width: 90,
          sortable: true,
          align: "center",
        },
        /*  {
          label: "预约时间",
          code: "createTime",
          width: 90,
          align: "center",
        }, */
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 90,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 90,
          align: "center",
        },
        {
          label: "检测项目",
          code: "projectName",
          width: 90,
          align: "center",
        },
        {
          label: "实验类型",
          code: "experimentType",
          width: 90,
          align: "center",
          formatter (row) {
            if (row.experimentType == 1) {
              return "科研实验";
            }
            return "生产实验";
          },
        },
        {
          label: "实验室编号",
          code: "laboratoryName",
          width: 90,
          align: "center",
        },
        {
          label: "作业人员",
          code: "peopleName",
          width: 90,
          align: "center",
        },
        {
          label: "检验设备",
          code: "equipmentName",
          width: 90,
          align: "center",
        },
        {
          label: "状态",
          code: "status",
          width: 90,
          align: "center",
          formatter (row) {
            return row.statusDesc;
          },
        },
      ],
      operations: [
        { name: "查看详情", callback: this.SeeDetails },
        { name: "上传实验数据", callback: this.UploadData },
        { name: "实验工艺", callback: this.crafts },
        { name: "操作规范", callback: this.specification },
        {
          name: "任务下发",
          callback: this.TaskRelease,
          isShow: (row) => {
            return row.peopleId == null;
          },
        },
        {
          name: "更改实验人员",
          callback: this.ChangePerson,
          isShow: (row) => {
            return row.peopleId != null;
          },
        },
      ],
      dialogVisible: false,
      TaskReleaseVisible: false,
      /* 任务下发和更改实验人员 */
      value: "",
      options: [],
      optionsDATA: [],
      /* 详情数据 */
      DetailsData: {},
      title: "",
      params: {},
      loading: false,
      teamId: "",
    };
  },
  methods: {
    /* 查看详情 */
    SeeDetails (row) {
      this.DetailsData = row;
      this.dialogVisible = true;
    },
    /* 上传实验数据 */
    UploadData () { },
    /* 实验工艺 */
    crafts (row) {
      this.downloadFile(row.experimentStandard);
    },
    /*下载文件*/
    downloadFile (fileId) {
      if (!fileId) {
        this.$message.error("未找到文件！");
        return;
      }
      window.open(
        Vue.prototype.$apicontext +
        "resources/attachment/downloadById?id=" +
        fileId,
        "_blank"
      );
    },
    /* 操作规范 */
    specification (row) {
      this.downloadFile(row.operatingSpecifications);
    },
    /* 任务下发 */
    TaskRelease (row) {
      this.title = "任务下发";
      this.TaskReleaseVisible = true;
      this.params.operationId = row.id;
      this.teamId = row.teamId;
    },
    /* 下拉查询 */
    remoteMethod (query) {
      // console.log(this.optionsDATA);
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.optionsDATA.filter((item) => {
            return item.name.indexOf(query) != -1;
          });
        }, 200);
      } else {
        this.options = this.optionsDATA;
      }
    },
    /* 焦点 */
    focus () {
      this.$axios
        .get("tdm/team/getPeople", { params: { teamId: this.teamId } })
        .then((res) => {
          this.optionsDATA = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /* 选中 */
    SelectChange () { },
    /* 更改实验人员 */
    ChangePerson (row) {
      this.title = "更改实验人员";
      this.TaskReleaseVisible = true;
      this.params.operationId = row.id;
      this.teamId = row.teamId;
    },

    /* 保存 */
    TaskReleaseConfirm () {
      this.params.personnelId = this.value;
      if (this.title == "任务下发") {
        this.$axios
          .post("tdm/experiment/appoint", this.params)
          .then((res) => {
            this.$message.success("操作成功");
            this.$refs.grid.refresh();
            this.TaskReleaseVisible = false;
          })
          .catch((error) => {
            this.$message.error(error.msg ? error.msg : "操作出错了");
          });
      } else {
        this.$axios
          .post("tdm/experiment/appoint", this.params)
          .then((res) => {
            this.$message.success("操作成功");
            this.$refs.grid.refresh();
            this.TaskReleaseVisible = false;
          })
          .catch((error) => {
            this.$message.error(error.msg ? error.msg : "操作出错了");
          });
      }
    },
    /* 关闭 */
    TaskReleaseCancel () {
      this.TaskReleaseVisible = false;
    },
    closeItem () {
      this.dialogVisible = false;
    },
    init () {
      this.$refs.grid.refresh();
    },
  },
  mounted () {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.headers {
  h2 {
    span {
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    margin-top: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px;
    box-sizing: border-box;
    li {
      width: 50%;
      margin-bottom: 20px;
    }
  }
}
.TaskRelease {
  padding-left: 25px;
  padding-top: 20px;
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

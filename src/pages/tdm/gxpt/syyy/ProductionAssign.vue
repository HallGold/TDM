<template>
  <div class="ice-container">
    <ice-query-grid title="受理台账"
                    data-url="tdm/experimentAppointment/acceptTheLedger"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="true"
                    :operations="operations"
                    ref="ProductionAssignRef"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="querys"></ice-query-grid>
    <!-- 选择设备人员弹窗 -->
    <ice-dialog v-dialogDrag
                title="指派人员设备"
                center
                :visible.sync="dialogVisible"
                :before-close="closeDialog"
                width="1077px">
      <ice-grid-layout :columns="1"
                       name="指派人员设备"
                       :expandable="true">
        <!--        <el-row :gutter="24"-->
        <!--                style="margin-bottom:20px">-->
        <!--          <el-col :span="12">-->
        <!--            <p class="p-text"><span style="color:blue">【{{equipmentName}}】</span> 目前有 <span style="color:blue">【{{equipmenTask}}】</span> 个实验检测待执行(选择后，显示设备的负荷情况)</p>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <p class="p-text"><span style="color:blue">【{{peopleName}}】</span> 目前有 <span style="color:blue">【{{peopleTask}}】</span> 个实验检测待执行(选择后，显示人员的负荷情况)</p>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!-- 设备和人员 -->
        <el-row>
          <!-- 设备 -->
          <el-col :span="12"
                  style="border-right: 1px solid #ccc">
            <h3>
              <span>可预约</span>
              <span>不可预约</span>
              <span>维护中</span>
            </h3>
            <ul class="equipmentList">
              <li v-for="item in equipmentOptions"
                  :key="item.equipmentId"
                  @click="handerEquipmentID(item)"
                  :class="{Selected:equipmentId==item.equipmentId}">
                <span :class="item.checkinStatus==0?'bgc-color-green':item.checkinStatus==1?'bgc-color-gray':'bgc-color-red'"></span>
                <span>编号:{{item.equipmentNumber}}</span>
                <span>名称:{{item.equipmentName}}</span>
                <span>设备负责人:{{item.principalName}}</span>
                <span>电话:{{item.tel}}</span>
                <span>待执行实验：{{item.equipmenTask}}个</span>
              </li>
            </ul>
          </el-col>
          <!-- 人员 -->
          <el-col :span="12"
                  v-loading="loading2">
            <h3></h3>
            <ul class="personnel">
              <li v-for="item in personnelOptions"
                  :key="item.oid"
                  @click="handerPersonneID(item)"
                  :class="{Selected:peopleId==item.peopleId}">
                <span><img src="./img/u534.png"
                       alt=""></span>
                <span style="font-weight:bold">{{item.name}}</span>
                <span style="font-size:10px">{{item.parentDeptName}}</span>
                <span style="font-size:10px">{{item.teamName}}</span>
                <span style="font-size:10px">待执行实验：{{item.peopleTask?item.peopleTask:0}}个</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </ice-grid-layout>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceGridLayout from "@/components/common/base/IceGridLayout";
export default {
  title: 'ProductionAssign',
  components: { IceQueryGrid, IceDialog, IceGridLayout },
  data () {
    return {
      loading: false,
      loading2: false,
      querys: [
        { type: "static", label: "", code: "urlType", value: 1 },
        { type: "input", label: "项目名称/样品名称", code: "searchTerm", value: "" },
      ],
      columns: [
        { code: "id", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",
          align: "center",
        },
        {
          label: "预约日期",
          code: "appCreatTime",
          align: "center",
        },
        {
          label: "委托单位",
          code: "entrustUnit",
          align: "center",
        },
        {
          label: "预约人",
          code: "appUser",
          align: "center",
        },
        {
          label: "联系方式",
          code: "phone",
          align: "center",
        },
        {
          label: "实验类型",
          code: "reservationType",
          align: "center",
          formatter: (data) => {
            /*  console.log(data); */
            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
            let obj = {
              color: '#fff',
              background: color[data.reservationType],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.reservationType == 1 ? '自主' : data.reservationType == 2 ? "委托" : "生产"}</span>
          }
        },
        {
          label: "期望完成日期",
          code: "sendSampleTime",
          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          align: "center",
        },
        {
          label: "规格型号",
          code: "sampleAttributeVar",
          align: "center",
        },
        {
          label: "实验项目",
          code: "projectName",
          align: "center",
        },
        {
          label: "班组",
          code: "deptName",
          align: "center",
        },
        {
          label: "进度",
          code: "xxaxx",
          align: "center",
          formatter: (data) => {
            let status = 0;
            if (!data.equipmentId || !data.peopleId) {
              status = 1;
            } else {
              status = 2;
            }
            let jd = ['', '指派未完成', '指派已完成']
            let color = ['', '#F56C6C', '#67C23A']
            let obj = {
              color: '#fff',
              background: color[status],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{jd[status]}</span>
          }
        },
      ],
      buttons: [
        {
          name: "刷新",
          type: "primary",
          icon: 'el-icon-refresh',
          callback: () => {
            this.$refs.ProductionAssignRef.refresh();
          }
        },
        // {
        //   name: "导出",
        //   type: "primary",
        //   icon: 'el-icon-download',
        // },
      ],
      operations: [
        {
          name: "指派人员设备", callback: this.showDetailEvent,
        },
      ],
      dialogVisible: false,
      /* 设备 */
      equipmentOptions: [
      ],
      /* 人员 */
      personnelOptions: [
      ],
      /* 人员和设备回显 */
      peopleName: '',
      peopleTask: '',
      equipmentName: '',
      equipmenTask: '',
      /* 班组ID */
      teamId: '',
      /* 选中的设备ID */
      equipmentId: '',
      /* 选中人员ID */
      peopleId: '',
      /* 表格itemID */
      id: '',
    }
  },
  methods: {
    /* 人员设备弹窗 */
    showDetailEvent (row) {
      /*   console.log(row); */
      this.id = row.id;
      this.equipmentId = '';
      this.peopleId = '';
      this.teamId = row.teamId;
      // 获取设备下拉数据
      this.$axios.get('tdm/TdmDetectProjectEquipment/getProEquipments', {
        params: {
          proOid: row.projectId,
          teamId: this.teamId
        }
      }).then(res => {
        this.dialogVisible = true;
        this.equipmentOptions = res.data
        if (row.equipmentId && row.peopleId && row.reservationType != 1) {
          this.equipmentId = row.equipmentId;
          this.peopleId = row.peopleId;
          this.equipmentOptions.forEach(item => {
            if (row.equipmentId == item.equipmentId) {
              this.handerEquipmentID(item)
            }
          })
        }
      }).catch(err => {
        this.$message.error(err.msg)
      });

    },
    /* 关闭人员设备 */
    closeDialog () {
      this.dialogVisible = false
    },
    /* 选中设备ID */
    handerEquipmentID (row) {
      /* console.log(row); */
      if (row.checkinStatus == 0) {
        this.loading2 = true;
        this.equipmentId = row.equipmentId;
        this.equipmentName = row.equipmentName + '(' + row.equipmentNumber + ')';
        this.equipmenTask = row.equipmenTask;
        this.$axios.get('tdm/team/getPeoples', {
          params: {
            teamId: this.teamId,
            equipmentId: this.equipmentId
          }
        }).then((res) => {
          this.personnelOptions = res.data
          /*  console.log(this.personnelOptions); */
          this.loading2 = false;
          if (this.peopleId) {
            this.personnelOptions.forEach(item => {
              /*   console.log(item); */
              if (this.peopleId == item.peopleId) {
                this.handerPersonneID(item);
              }
            })
          }
        }).catch((err) => {
          this.$message.error(err.msg)
          this.loading2 = false;
        })
      } else {
        this.$message.warning('该设备异常,不能选择!')
      }

    },
    /* 选中人员ID */
    handerPersonneID (row) {
      /*  console.log(row); */
      this.peopleId = row.peopleId;
      this.peopleName = row.name;
      this.peopleTask = row.task;
    },
    /* 保存 */
    save () {
      this.$axios.post('tdm/experimentAppointment/selectEquPer', {
        id: this.id,
        equipmentId: this.equipmentId,
        peopleId: this.peopleId
      }).then((res) => {
        this.$message.success('保存成功!');
        this.$refs.ProductionAssignRef.refresh();
        this.closeDialog();
      }).catch((err) => {
        this.$message.error(err.msg)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.echoText1 {
  box-sizing: border-box;
  margin-left: 35px;
  padding: 0 !important;
}
.echoText2 {
  box-sizing: border-box;
  margin-left: 66px;
  padding: 0 !important;
}
.p-text {
  font-size: 12px;
  color: #000;
  height: 20px;
  padding-left: 12px;
}
h3 {
  text-align: left;
  margin-bottom: 20px;
  margin-left: 32px;
  span {
    margin-right: 40px;
    position: relative;
    &:nth-child(1) {
      &::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #4acf2b;
        position: absolute;
        top: 3px;
        left: -15px;
      }
    }
    &:nth-child(2) {
      &::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ff6666;
        position: absolute;
        top: 3px;
        left: -15px;
      }
    }
    &:nth-child(3) {
      &::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ccc;
        position: absolute;
        top: 3px;
        left: -15px;
      }
    }
  }
}
/* 设备 */
.equipmentList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;
  li {
    width: 212px;
    height: 122px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin-bottom: 20px;
    padding: 5px 0;
    padding-left: 15px;
    box-shadow: 0px 0px 10px #ccc;
    span {
      font-size: 13px;
      margin-bottom: 5px;
      overflow: hidden;
      &:nth-child(1) {
        display: block;
        height: 100%;
        width: 6px;
        background-color: #4acf2b;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
.bgc-color-red {
  background-color: red !important;
}
.bgc-color-gray {
  background-color: gray !important;
}
.bgc-color-green {
  background-color: rgb(4, 212, 4) !important;
}
/* 人员 */
.personnel {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding-left: 50px;
  margin-top: 39px;
  li {
    display: flex;
    flex-direction: column;
    border: 1px dashed #ccc;
    width: 118px;
    padding: 5px;
    margin-right: 30px;
    margin-bottom: 20px;
    position: relative;
    cursor: pointer;
    &:nth-child(3n) {
      margin-right: 0;
    }
    span {
      text-align: center;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
/* 选中样式 */
.Selected {
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(77, 77, 77, 0.5);
    z-index: 10;
  }
  &::after {
    content: '';
    position: absolute;
    width: 35px;
    height: 15px;
    border: 5px solid rgb(11, 243, 30);
    border-radius: 1px;
    border-top: none;
    border-right: none;
    background: transparent;
    -ms-transform: rotate(-45deg);
    z-index: 11;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
</style>
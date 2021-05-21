<template>
  <div class="container">
    <div class="content-header">
      <div class="button">
        <el-button type="primary"
                   @click="refresh"
                   icon="el-icon-refresh">刷新</el-button>
        <el-button type="primary"
                   @click="goBack">返回</el-button>
      </div>
      <header>
        <ul>
          <li>
            <img :src="queryImage()"
                 alt="" />
          </li>
          <li>
            <h3>{{equipment.equipmentName}}</h3>
            <p><span>联系人：</span><span>{{equipment.principal}}</span></p>
            <p><span>实验室：</span><span>{{equipment.laboratoryName}}</span></p>
          </li>
          <li>
            <p><span>电话：</span><span>{{equipment.tal}}</span></p>
            <p><span>设备类型：</span><span>{{equipment.classificationName}}</span></p>
          </li>
          <li>
            <p><span>设备状态:</span><span class="textcolor">{{queryStatus()}}</span></p>
          </li>
        </ul>
      </header>
    </div>
    <div class="content-button">
      <template>
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="基本信息"
                       name="first">
            <ul>
              <li>
                <p><span>设备名称：</span><span>{{equipment.equipmentName}}</span></p>
                <p><span>设备类型：</span><span>{{equipment.classificationName}}</span></p>
                <p><span>负责人：</span><span>{{equipment.principal}}</span></p>
              </li>
              <li>
                <p><span>设备编号：</span><span>{{equipment.laboratoryName}}</span></p>
                <p><span>实验室编号：</span><span>{{equipment.equipmentNumber}}</span></p>
                <p><span>覆盖检测领域：</span><span>{{equipment.coveredRealm}}</span></p>
              </li>
              <li>
                <p><span>设备型号：</span><span>{{equipment.model}}</span></p>
                <p><span>设备IP：</span><span>{{equipment.ip}}</span></p>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="样品要求"
                       name="second">
            <ul>
              <li>
                <p>
                  <span>样品要求：</span><span>{{equipment.sampleClaim}}</span>
                </p>
                <p>
                  <span>预约说明：</span><span>如遇到生产实验，优先生产实验，预约日期顺延</span>
                </p>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="技术资料"
                       name="third">
            <ul>
              <li>
                <p>
                  <span>设备操作规程：</span><span><a href="#"
                       @click="queryFileUrl('specification')">{{file.specificationName}}</a></span>
                </p>
                <p>
                  <span>实验安全制度：</span><span><a href="#"
                       @click="queryFileUrl('secureDiscipline')">{{file.secureDisciplineName}}</a></span>
                </p>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  data () {
    return {
      activeName: "first",
      equipment: {

      },
      equipmentId: '',
      file: {
        secureDisciplineName: '',
        specificationName: '',
      }
    };
  },
  methods: {
    queryFileName (name) {
      let fileId = this.equipment[name];
      if (fileId) {
        this.$axios.get("/resources/attachment/get", { params: { "id": fileId } })
          .then(result => {
            if (result.status = 200) {
              console.log(result);
              this.file[name + "Name"] = result.data.fileName;
            }
          }).catch(error => {
            this.$message.error("获取失败！")
          })
      }
    },
    queryFileUrl (name) {
      let fileId = this.equipment[name];
      if (!fileId) {
        this.$message.error("未找到文件！");
        return;
      }
      window.open(Vue.prototype.$apicontext + "resources/attachment/downloadById?id=" + fileId, '_blank')
    },
    queryStatus () {
      return this.equipment.status == 1 ? '检修' : this.equipment.status == 2 ? '故障' : '正常';
    },
    queryImage () {
      return "/api/resources/image.png?id=" + this.equipment.image;
    },
    handleClick (tab, event) {
      //console.log(tab, event);
    },
    goBack () {
      this.$router.push({
        path: "/tdm/EquipmentManagement",
      });
    },
    refresh () {
      this.$axios.get("/tdm/equipment/getDetails", { params: { "equipmentId": this.equipmentId } })
        .then(result => {
          if (result.status = 200) {
            this.equipment = result.data;
            this.queryFileName("specification");
            this.queryFileName("secureDiscipline")
          } else {
            this.$message.success(result.statusText);
          }
        }).catch(error => {
          this.$message.error("获取失败！")
        })
    },
  },
  created () {
    this.equipmentId = this.$route.query.equipmentId;
    this.refresh();
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .content-header {
    .button {
      height: 50px;
      background-color: #fff;
    }
    header {
      height: 220px;
      border-top: 1px solid #ccc;
      /*   border-bottom: 1px solid #000; */
      box-sizing: border-box;
      padding: 20px 40px;
      margin-bottom: 30px;
      ul {
        display: flex;
        justify-content: start;
        align-items: center;
        li {
          margin-right: 100px;
          img {
            width: 180px;
            height: 180px;
          }
          &:nth-child(2) {
            h3 {
              font-size: 20px;
              font-weight: bold;
            }
            line-height: 3.5;
          }
          &:nth-child(3) {
            line-height: 3.5;
            transform: translateY(35px);
          }
          &:nth-child(4) {
            transform: translateY(60px);
            span {
              font-size: 16px;
            }
            .textcolor {
              font-size: 16px;
              color: green;
            }
          }
        }
      }
    }
  }
  .content-button {
    ul {
      display: flex;
      justify-content: start;
      li {
        margin-right: 100px;
        font-size: 14px;
        line-height: 2.5;
        a {
          color: blue;
        }
      }
    }
  }
}
</style>

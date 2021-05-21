<template>
  <div>
    <div class="ice-container">
      <el-form :model="pwdDataForm" :rules="pwdFormRules" label-position="right" class="conditon-bar"
               ref="pwdDataForm">
        <el-form-item label="旧密码:" label-width="100px" prop="oldPwd" key="key_old_pwd" v-if="showOldPwd === 'true'">
          <el-input placeholder="请输入旧密码" v-model="pwdDataForm.oldPwd"
                    maxlength="30" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" label-width="100px" prop="pwd">
          <el-input placeholder="请输入新密码"
                    v-model="pwdDataForm.pwd"
                    maxlength="30" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" label-width="100px" prop="newPwd2">
          <el-input placeholder="请再次输入新密码"
                    v-model="pwdDataForm.newPwd2"
                    maxlength="30" type="password"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="ice-button-bar" slot="footer">
      <el-button type="primary" size="medium" @click="savePwd">保存</el-button>
      <el-button type="info" size="medium" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",

  props: {
    showOldPwd: {
      type: String,
      default: "true"
    },
    oid: {
      type: String,
      default: ''
    }
  },
  data() {
    let oldPwdValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else {
        if (value !== '') {
          this.$refs.pwdDataForm.validateField('oldPass');
        }
        callback();
      }
    };
    let newPwdValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (value !== '') {
          if (this.pwdDataForm.oldPwd == value) {
            callback(new Error('新密码不能和旧密码一样'))
          } else {
            this.$refs.pwdDataForm.validateField('newPass');
          }
        }
        callback();
      }
    };
    let checkPwdValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdDataForm.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      pwdDataForm: {
        oid: "",
        oldPwd: "",
        pwd: "",
        newPwd2: ""
      },

      pwdFormRules: {
        oldPwd: [{validator: oldPwdValidator, trigger: 'blur'}],
        pwd: [{validator: newPwdValidator, trigger: 'blur'}],
        newPwd2: [{validator: checkPwdValidator, trigger: 'blur'}],
      },
      dialogTitle: '修改密码'
    }
  },
  methods: {
    savePwd() {
      this.$refs.pwdDataForm.validate((valid) => {
        if (valid) {
          const detailPwdData = this.pwdDataForm;
          detailPwdData["oid"] = this.oid;
          this.$axios.post("/pms/userInfo/modifyPwd", {
            ...detailPwdData
          })
              .then(success => {
                this.$message.success("修改密码成功");
                this.$emit("dialogVisible", false);
              }).catch(error => {
            this.$message({
              type: 'error',
              message: error.msg
            })
          })
        }
      });
    },
    closeDialog() {
      this.$emit("dialogVisible", false);
      // 清空表单
      this.$refs['pwdDataForm'].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
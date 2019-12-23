<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitLoginForm">提交</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '2 ~ 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度 6 ~ 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 重置表单数据
      this.$refs.loginFormRef.resetFields()
    },
    submitLoginForm () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false
        let { data } = await this.$http.post('login', this.form)
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.$message.success(data.meta.msg)
        window.sessionStorage.setItem('token', data.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50% , -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50% , -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid #fff;
  background-color: #ddd;
  overflow: hidden;
  box-shadow: 0 0 2px rgba(0 , 0, 0, .3);
}
.avatar_box img {
  width: 100%;
}
.login_form {
  position: absolute;
  bottom: 10px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

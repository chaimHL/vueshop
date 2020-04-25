<template>
  <div class="login-container">
    <div class="login-box">
      <el-form label-width="0" class="input-box" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont iconwode" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont iconmima" show-password v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'Jay',
        password: '123456'
      },
      // 表单校验规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // valid为布尔值，如果验证通过则为true
        if (!valid) return
        // axios返回的结果为一个promise对象，就可以用await简化操作，用了await就要在最近的函数前加上async
        // 用解构赋值接收data数据，并赋值给res
        const { data: res } = await this.$http.post('login/login', this.loginForm)
        if (res.err === -1) return this.$message.error(res.msg)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    height: 100%;
    background-color: #2b4b6b;
  }
  .login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .input-box{
    margin-top: 60px;
    padding: 20px;
  }
  .btn-box{
    display: flex;
    justify-content: flex-end;
  }
</style>

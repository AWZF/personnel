<template>
  <div class="login">
    <el-form :model="loginForm" status-icon class="container" :rules="myrules" ref="loginForm">
      <el-form-item>
        <div class="avatar">
          <img src="../assets/avatar.jpg" alt>
        </div>
      </el-form-item>
      <el-form-item prop='username'>
        <el-input v-model="loginForm.username" autocomplete="off"
        prefix-icon="myicon myicon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="myicon myicon-key" @keydown.enter.native="handlelogin('loginForm')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handlelogin('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

// import axios from 'axios'
// 修改成引入的形式
// 导出数据
import { postLogin } from '@/api'
export default {

  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      myrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handlelogin (formName) {
      // console.log(this.$refs)  传过来一个字符串 使用[]
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('去登陆！')
          // axios.post('http://localhost:8888/api/private/v1/login', {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // })
          //   .then(res => {
          //     console.log(res)
          //     if (res.data.meta.status === 200) {
          //       this.$router.push({ name: 'home' })
          //     } else {
          //       this.$message.error(res.data.meta.msg)
          //     }
          //   })
          postLogin({ username: this.loginForm.username, password: this.loginForm.password })
            .then(res => {
              if (res.meta.status === 200) {
                // 保存令牌到本地
                localStorage.setItem('mytoken', res.data.token)
                localStorage.setItem('username', res.data.username)
                this.$router.push({ name: 'home' })
              } else {
                this.$message.error(res.meta.msg)
              }
            })
        } else {
          console.log('有错误!')
          this.$message.warning('请正确填写表单')
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>

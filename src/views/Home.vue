<template>
  <div class="home">
        <el-container>
      <!-- 左侧导航部分 -->
      <el-aside width="auto">
        <div class="logo"></div>
        <!-- collapse属性的true或者false控制菜单折叠与展开 -->
        <!-- router属性用于开启路由模式，下面会将index里面的值作为跳转的路径 -->
        <el-menu
          router
          :collapse="isCollapse"
          background-color="#F9F9F9"
          default-active="2"
          class="el-menu-admin"
          @open="handleOpen"
          @close="handleClose">
          <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 这里需要index改为一个路径 -->
            <el-menu-item :index="menu.path" v-for="menu in item.children" :key="menu.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{menu.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

       <el-container>
        <!-- 头部部分 -->
        <el-header>
          <div class="myicon myicon-menu toggle-btn" @click="5"></div>
          <div class="system-title">电商后台管理系统</div>
          <div>
            <span class="welcome">您好，{{username}}</span>
            <!-- 2.1 退出事件绑定 -->
            <el-button type="warning" round @click="logout">退出</el-button>
          </div>
        </el-header>
        <!-- 中间内容主体部分，这里放一个坑，将来存放路由匹配的组件 -->
        <el-main>
          <!-- mode属性表示切换模式，只有两个值，一个为out-in（不要的先出去，需要的后进来）,一个为in-out（需要的先进来，不要的后出去） -->
          <transition
            mode="out-in"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
           <router-view></router-view>
          </transition>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getMenus } from '@/api'
export default {
  data () {
    return {
      isCollapse: false,
      username: '',
      menuList: []
    }
  },
  mounted () {
    this.initMenu()
    // 3.1 组件一挂载就从本地获取username，将他赋值给data中的变量，展示到页面(在这之前，先去login页面存username到本地)
    let name = localStorage.getItem('username')
    this.username = name
  },
  methods: {
    // 切换菜单的折叠与展开
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    // 2.2 退出方法
    logout () {
      // a 先清除本地的token
      // b 跳转到登录页
      localStorage.removeItem('mytoken')
      this.$router.push({ name: 'login' })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    initMenu () {
      getMenus()
        .then(res => {
          // console.log(res)
          this.menuList = res.data
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #F9F9F9;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409EFF;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome, {
    color: white;
  }
}
</style>

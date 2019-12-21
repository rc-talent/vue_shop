<template>
  <el-container>
    <!-- 页面头部区域 -->
    <el-header>
      <img src="../assets/heima.png" alt="" />
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体内容 -->
    <el-container>
      <!-- 左侧边菜单导航栏 -->
      <el-aside width="200px">
        <div class="toggle-button" @click="toggleCollapse">| | |</div>
        <el-menu :default-active="defaultActive" :collapse-transition="false" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" router>
          <!-- 一级菜单 -->
          <el-submenu  v-for="item in menuList" :key="item.id" :index="item.id + ''">
              <!-- 一级菜单的图标和文本 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/' + subItem.path" @click="active(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧边内容区域 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-s-check',
        103: 'el-icon-suitcase',
        101: 'el-icon-shopping-bag-2',
        102: 'el-icon-shopping-cart-2',
        145: 'el-icon-folder-opened'
      },
      // 折叠
      isCollapse: false,
      // 高亮
      defaultActive: ''
    }
  },
  async created() {
    let { data } = await this.$http.get('menus')
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.menuList = data.data
    this.defaultActive = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse(e) {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        e.target.parentNode.style.width = 64 + 'px'
      } else {
        e.target.parentNode.style.width = 200 + 'px'
      }
    },
    active(key) {
      window.sessionStorage.setItem('activePath', '/' + key)
      this.defaultActive = '/' + key
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  text-align: center;
  line-height: 60px;
}
.el-header span {
  float: left;
  margin-left: 10px;
  color: #fff;
  font-size: 20px;
}
.el-header img {
  float: left;
  margin-top: 2px;
}
.el-header .el-button {
  float: right;
  margin-top: 10px;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
    border-right: 0;
}
.toggle-button {
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    background-color: #4a5064;
    cursor: pointer;
}
.el-main {
  background-color: #eaedf1;
}
</style>

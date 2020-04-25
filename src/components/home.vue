<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="collapse">|||</div>
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePathIndex('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
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
      // 左侧菜单数据
      menuList: [],
      // 一级菜单icon
      iconsObj: {
        '5e931effcdc78ab0b6520847': 'iconfont iconyonghuming',
        '5e932bd899d40812b4ecd61d': 'iconfont iconquanxian',
        '5e932c3099d40812b4ecd620': 'iconfont iconshangpin',
        '5e932c7599d40812b4ecd622': 'iconfont icondingdan',
        '5e932cb399d40812b4ecd624': 'iconfont icontongji'
      },
      // 菜单折叠
      isCollapse: false,
      // 激活菜单
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('authority/menu')
      if (res.meta.err !== 0) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 菜单折叠与展开
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    savePathIndex(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #363D40;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    > div{
      display: flex;
      align-items: center;
      img{
        height: 40px;
      }
      span{
        font-size: 18px;
        color: #fff;
        margin-left: 10px;
      }
    }
  }
  .el-aside{
    background-color: #313743;
  }
  .el-main{
    background-color: #FAFAFA;
  }
  .el-menu{
    border-right: none;
    i{
      color: #efefef;
    }
  }
  .iconfont{
    margin-right: 10px;
  }
  .collapse{
    background-color: #465163;
    color: #FFFFFF;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: .2em;
    text-align: center;
    cursor: pointer;
  }
</style>

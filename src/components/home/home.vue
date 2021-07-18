<template>
  <el-container>

    <!-- 头部 -->
    <el-header>
      <div class="image">
        <img src="../../assets/img/heima.png" alt="">
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    
    <!-- 侧边栏 -->
    <el-container>
      <!-- 如果折叠为64px 没有折叠为200px -->
      <el-aside :width="isCollapse ? '64PX' : '200px'">

        <div class="togoButton" @click="togoButton" >|||</div>

        <el-menu
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath" >

          <!-- 一级菜单 index值接收字符串，每个菜单都有子的 index 值 -->
          <el-submenu :index="item.id +''" v-for="item in menusList" :key="item.id" > 
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 高亮： -->
            <el-menu-item :index=" '/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="activeState('/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体区 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getMenusList } from "@/api/index"
export default {
  name: 'home',           // 首页     
  created(){
    this.getMenus();      // 进入首页展示左侧菜单栏
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  data() {
    return {
      menusList: [],      // 左侧菜单栏 数据
      iconObj: {          // 字体图标 对象
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },  
      
      isCollapse: false,   // 展开与折叠

      activePath: '',      // 二级路由高亮， 被激活链接
    }
  },
  methods: {

    /**
     *  退出登录
     **/ 
    quit(){
      window.localStorage.clear();
      this.$router.push('/login')
    },

    /** 
     *  获取左侧菜单
     */ 
    async getMenus(){
      let {data:res} = await getMenusList();
      // console.log(res);

      if(res.meta.status !== 200){
        return this.$message.error('res.meta.msg');
      }else{
        this.menusList = res.data;
      }
    },

    /**
     *  点击按钮切换左侧菜单栏 的折叠与展开 
     */
    togoButton(){
      this.isCollapse =  !this.isCollapse;
    },


    /**
     *  二级菜单字体高亮 , 保存链接激活状态
     */
    activeState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      // 回退显示高亮
      this.activePath = activePath;
    }
  }
}
</script>
<style lang="scss" scoped>
.el-container{
  height: 100%;

  // 头部
  .el-header{
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-left: 0;
    background-color: #373D41;

    .image{
      display: flex;
      align-items: center;
    }
    span{
      color: #fff;
      font-size: 20px;
      margin-left: 30px;
    }
  }

  // 侧边
  .el-aside{
    background-color: #373D41;
    
    .el-menu {
      border-right: none;     // 去除边框线
    }
  }

  // 主体区
  .el-main{
    background-color: #eaedf1;
  }

  .iconfont{
    margin-right: 20px;
  }

  .togoButton{
    background-color: #4A5064;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
}
</style>

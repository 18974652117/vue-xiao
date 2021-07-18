<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type=index></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/api/index'
export default {
  name: 'rights',     // 权限列表
  created(){
    /** 获取所有的权限 */ 
    this.getRights();
  },
  data(){
    return {
      rightsList: [],   // 所有的权限列表

    }
  },
  methods:{
    /**
     *  获取 权限列表
     */ 
    async getRights( list ){
      let {data:res} = await getRightsList(list);
      if(res.meta.status !== 200 ){
        return this.$message.error("获取权限失败!");
      }else {
        this.rightsList = res.data;
        // console.log(this.rightsList);
      }
    }
  }

}
</script>

<style>

</style>
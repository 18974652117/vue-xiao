<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button>添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="rolesLists" border stripe>
        <!-- 展开列 需要三层循环 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- vcenter: 属性绑定 弹性布局 -->
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRightById( scope.row , item1.id )">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级 和 三级 权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="['bdtop',i2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag  closable type="success" @close="delRightById( scope.row , item2.id )">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag  type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="delRightById( scope.row , item3.id )">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>

          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template >
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRighDialog">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="showDialogVisible"
      width="50%" >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, getDelRight } from '@/api/index'
export default {
  name: 'roles', // 角色权限
  data () {
    return {
      rolesLists: [], // 角色列表
      showDialogVisible: false
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    /**
     *  获取列表 角色
     */
    async getRoles () {
      const { data: res } = await getRolesList()
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('列表角色列表失败!')
      } else {
        this.rolesLists = res.data
        // console.log(this.rolesLists);
      }
    },

    /**
     * 根据id删除对应的权限，tag 关闭标签
     */
    async delRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        // 获取接口  有问题
        const { data: res } = await getDelRight(role, rightId)
        if (res.meta.status !== 200) {
          return this.$message.error('列表角色列表失败!')
        }

        // 防止页面刷新，提升用户的体验
        role.children = res.data
        // this.getRoles();
      }
    },

    /**
     *  展示分配权限对话框
     */
    showSetRighDialog () {

    }

  }
}
</script>

<style lang="scss" scoped>
  .el-tag{
    margin: 10px;
  }
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>

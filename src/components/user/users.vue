<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">

      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="query" placeholder="请输入内容" clearable @clear="getUsers" >
            <el-button slot="append"  @click="getUsers" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" ></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%"  @close="closeDialog">
      <!-- 内容  :model：数据绑定  rules：验证规则 ref：引用名称 -->
      <el-form :model="addForm" :rules="addForRules" ref="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editDialogClose" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getUserLists, getSwitchState, getAddUsers, getEditUser, getEditUserInfo, getDelUserInfo } from '@/api/index'
export default {
  name: 'users', // 用户
  created () {
    this.getUsers()
  },
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    /** 验证手机号的规则 */
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      query: '',
      total: 0, // 总数据列表条数
      pagenum: 1, // 当前的页数 页码
      pagesize: 2, // 当前页码显示几条数据

      userList: [], // 保存所有的用户列表，数据源

      addDialogVisible: false, // 控住对话框的显示和隐藏

      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false, // 控制修改用户对话框 显示 和 隐藏

      editForm: { }, // 查询到的用户信息对象

      addForRules: { // 添加表单的验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      /** 点击编辑按钮 表单验证 */
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    /**
     *  获取用户列表
     **/
    async getUsers () {
      const { data: res } = await getUserLists(this.query, this.pagenum, this.pagesize)
      // console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },

    /**
     *  监听pagesizes 改变的事件
     */
    handleSizeChange (newSizes) {
      // console.log(newSizes);
      this.pagesize = newSizes
      this.getUsers()
    },

    /**
     *  监听页码值改变的事件
     */
    handleCurrentChange (newPage) {
      // console.log(newPage);
      this.pagenum = newPage
      this.getUsers()
    },

    /**
     *  监听 开关状态
     */
    async userStateChange (userInfo) {
      // console.log(userInfo);
      const { data: res } = await getSwitchState(userInfo.id, state, userInfo.mg_state)
      // console.log(res);

      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败')
      } else {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
      }
    },

    /**
      *   监听添加用户对话框的关闭   清空对话框  @ close 事件
      */
    closeDialog () {
      this.$refs.addForm.resetFields()
    },

    /**
     *  点击确定按钮 添加新用户 预校验
     **/
    addUsers () {
      this.$refs.addForm.validate(async valid => {
        // console.log(valid);
        if (!valid) {
          return
        }
        // 通过 发送添加用户的请求
        const { data: res } = await getAddUsers(this.addForm.username, this.addForm.password, this.addForm.email, this.addForm.mobile)
        console.log(res)

        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加 用户对话框
        this.addDialogVisible = false
        // 重新获取用户数据
        this.getUsers()
      })
    },

    /**
     *  修改用户弹框, 展示编辑用户的对话框
     **/
    async showEditDialog (id) {
      // console.log(id);
      const { data: res } = await getEditUser(id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      } else {
        this.editForm = res.data
      }
      this.editDialogVisible = true
    },

    /**
     * 监听修改用户 对话框的关闭事件
     */
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },

    /**
     *  修改用户信息并提交，预验证
     */
    editDUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {

        } else {
          // 发起用户的预验证请求
          const { data: res } = await getEditUserInfo(this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('查询用户信息失败')
          } else {
            // 1：请求成功 关闭对话框
            this.editDialogVisible = false
            // 2：刷新数据列表
            this.getUsers()
            // 3：提示用户更新成功
            this.$message.success('添加用户成功!')
          }
        }
      })
    },

    /**
     *  删除用户，根据id删除
     */
    async delUserById (id) {
      // 弹框提示删除
      const configResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      console.log(configResult)
      // 如果用用户确认删除，则返回值为字符串  confirm
      // 如果用用户确认取消，则返回值为字符串  cancel
      if (configResult !== 'confirm') {
        return this.$message.info('已经取消删除!')
      } else {
        const { data: res } = await getDelUserInfo(id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          // 删除成功后刷新用户列表
          this.getUsers()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
    font-size: 12px;
  }

  .el-card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2) !important;
  }

  .el-table{
    margin-top: 20px;
  }

  .el-pagination{
    margin-top: 20px;
    margin-right: 0;
  }
</style>

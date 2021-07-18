<template>
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="small" @click="addClassify">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
       <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" :border="true" :show-row-hover="true">
         <template slot="isOK" slot-scope="scope">
           <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
           <i v-else class="el-icon-error" style="color:red" ></i>
         </template>

         <!-- 排序 -->
         <template slot="sort" slot-scope="scope">
           <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
           <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
           <el-tag type="warning" size="mini" v-else>三级</el-tag>
         </template>
        <!-- 操作 -->
         <template slot="operation" slot-scope="scope">
           <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
           <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
         </template>
       </tree-table>

      <!-- 分页 -->
       <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 添加分类 弹框 -->
      <div>
        <el-dialog title="提示" :visible.sync="addClassifyDialog">
          <el-form :model="addCateForm" :rules="rulesForm" ref="addCateForm" label-width="100px">
            <el-form-item label="分类名称：" prop="cateName">
              <el-input v-model="addCateForm.cateName"></el-input>
            </el-form-item>
            <el-form-item label="父级分类："> </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addClassifyDialog = false">取 消</el-button>
            <el-button type="primary" @click="addClassifyDialog  = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategories, getFatherCassifyList } from '../../api/index.js'
export default {
  name: 'categories', // 商品分类
  created () {
    this.geCateList()
  },
  data () {
    return {
      // 添加分类表单数据对象
      addCateForm: {
        cateId: 0,
        cateName: '',
        cateLevel: 0 // 分类等级 默认添加1级分类
      },
      total: 0, // 总数据列表条数
      type: 3,
      pagenum: 1, // 当前的页数 页码
      pagesize: 5, // 当前页码显示几条数据
      addClassifyDialog: false, // 添加分类 弹框  显示 和 隐藏
      cateList: [], // 商品列表数据分类
      parentCateList: [], // 父级分类列表

      columns: [ // 为table指定列的定义
        { label: '分类名称', prop: 'cat_name' },
        // template：表示将当前列 定义为模板列, isOK：表示档期一列使用模板名称
        { label: '是否有效', type: 'template', template: 'isOK' },
        { label: '排序', type: 'template', template: 'sort' },
        { label: '操作', type: 'template', template: 'operation' }
      ],

      rulesForm: {
        cateName: [{ required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {

    /** 获取商品分类 */
    async geCateList () {
      const { data: res } = await getCategories(this.type, this.pagenum, this.pagesize)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      } else {
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    /** 监听 分页 pagesize 改变 */
    handleSizeChange (newPagesize) {
      this.pagesize = newPagesize
      this.geCateList()
    },
    /** 监听 页码值 pagenum 发生改变 */
    handleCurrentChange (newPagenum) {
      this.pagenum = newPagenum
      this.geCateList()
    },
    /** 点击按钮 展示 添加分类 弹框 */
    addClassify () {
      this.getFatherCategorieslist() // 先获取父类
      this.addClassifyDialog = true // 在展示对话框
    },

    /** 获取父级分类的列表 */
    async getFatherCategorieslist () {
      const { data: res } = await getCategories({ params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      } else {
        // console.log(res.data, 'res')
        this.parentCateList = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.block{
  margin-top: 20px;
  margin-right: 0px;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateForm">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :show-row-hover="false"
        :expand-type="false"
        show-index
        index-text=""
        border>
          <!-- 是否有效 -->
          <template v-slot:isok="slotProps">
            <i v-if="slotProps.row.cat_deleted === false" class="el-icon-success" style="color: #42B983;"></i>
            <i v-else class="el-icon-error" style="color: indianred;"></i>
          </template>
          <!-- 排序 -->
          <template v-slot:order="slotProps">
            <el-tag v-if="slotProps.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-else-if="slotProps.row.cat_level === 1" type="success" size="mini">二级</el-tag>
            <el-tag v-else-if="slotProps.row.cat_level === 3" type="warning" size="mini">三级</el-tag>
          </template>
          <!-- 操作 -->
          <template v-slot:opt>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="30%"
      @close="closeCatedialog">
      <el-form :model="addCateRuleForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addCateRuleForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="parentCateProps"
              @change="parentCateChange"
              clearable >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subCatedialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为 table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 添加分类对话框的显示
      addCatedialogVisible: false,
      // 添加分类的表单数据
      addCateRuleForm: {},
      // 添加分类的表单校验
      addCateRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 添加分类表单的级联选择器数据
      parentCateList: [],
      // 添加分类表单的级联选择器配置
      parentCateProps: {
        expandTrigger: 'hover',
        value: 'cat_name',
        label: 'cat_name',
        children: 'children'
      },
      // 添加分类表单的级联选择器选择的值
      selectedKeys: []
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get('authority/categories', { params: this.queryInfo })
      if (res.err !== 0) this.$message.error(res.msg)
      // 把数据列表赋值给 catelist
      this.catelist = res.data
      // 为总数据条数赋值
      this.total = res.total
    },
    // 分页-每页条数改变触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelist()
    },
    // 分页-当前页码改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCatelist()
    },
    // 点击添加分类按钮
    showAddCateForm() {
      // 先获取级联选择器数据
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    // 获取添加分类表单中级联选择器的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('authority/categories', { params: { type: 2 } })
      if (res.err !== 0) this.$message.error(res.msg)
      this.parentCateList = res.data
    },
    // 级联选择器发生变化
    parentCateChange() {
      console.log(this.selectedKeys)
    },
    // 关闭添加分类对话框
    closeCatedialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
    },
    // 添加分类对话框点击确定
    subCatedialog() {
      this.$refs.addCateFormRef.validate((valid) => {
        if (valid) {
          this.addCatedialogVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.tree-table{
  margin-top: 16px;
}
.el-cascader{
  width: 100%;
}
</style>

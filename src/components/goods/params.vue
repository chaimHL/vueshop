<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
          title="api不好写,所以编辑啊删除这些功能就没写,凑合看"
          type="warning"
          show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="mtb_20">
        <el-col>
          <span class="mr_16">选择商品分类</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
              v-model="selectedCateKeys"
              :options="catelist"
              :props="cateProps"
              @change="handleChange"
              clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数的按钮 -->
          <el-button @click="addDialogVisible=true" type="primary" size="small" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <template>
            <el-table :data="firstData" border stripe style="width: 100%">
              <!-- 展开列 -->
              <el-table-column type="expand">
                <template v-slot="slotProps">
                  <!-- 循环渲染 tag 标签 -->
                  <el-tag
                    v-for="(tag, i) in slotProps.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClose(i, slotProps.row)">
                    {{tag}}
                  </el-tag>
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="slotProps.row.inputVisible"
                    v-model="slotProps.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(slotProps.row)"
                    @blur="handleInputConfirm(slotProps.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ 新标签
                  </el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="second">
          <!-- 添加属性的按钮 -->
          <el-button @click="addDialogVisible=true" type="primary" size="small" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 共用的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 级联选择器配置
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器被选中的值
      selectedCateKeys: [],
      // 页签被选中的名字
      activeName: 'first',
      // 对话框是否显示
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 表单验证规则
      addFormRules: {
        name: [
          { required: true, message: '请输入参数名称', trigger: 'change' }
        ]
      },
      // 动态参数表单数据
      firstData: []
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get('authority/categories', { params: { type: '' } })
      if (res.err !== 0) this.$message.error(res.msg)
      // 把数据列表赋值给 catelist
      this.catelist = res.data
    },
    // 级联选择器值发生变化
    handleChange() {
      this.firstData = [
        {
          attr_name: '板式',
          attr_vals: '49吋4K超薄曲面 人工智能，55吋4K观影曲面',
          inputVisible: false,
          inputValue: ''
        },
        {
          attr_name: '颜色',
          attr_vals: '',
          inputVisible: false,
          inputValue: ''
        }
      ]
      this.firstData.forEach(item => {
        // 三元表达式是防止 attr_vals 值为空的情况下 tag 标签会渲染一个空的标签
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
    },
    // 页签被选中时触发
    handleTabClick() {
      console.log(this.activeName)
    },
    // 对话框关闭触发
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交对话框
    subDialog() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.$message.success('验证通过')
          this.addDialogVisible = false
        } else {
          this.$message.error('验证不通过')
          return false
        }
      })
    },
    // 新添标签输入文本框按下 enter 键或失去焦点触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 若没有 return 则说明有输入内容，需作后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
    },
    // 点击添加标签按钮触发
    showInput(row) {
      row.inputVisible = true
      // $nextTick: 在下次 DOM 更新循环结束之后执行延迟回调
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 0) {
        return false
      }
      return true
    },
    titleText() {
      if (this.activeName === 'first') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang='less' scoped>
.mtb_20{
  margin-top: 20px;
  margin-bottom: 20px;
}
.mr_16{
  margin-right: 16px;
}
.el-tag, .button-new-tag, .input-new-tag{
  margin: 8px;
}
.input-new-tag{
  width: 120px;
}
</style>

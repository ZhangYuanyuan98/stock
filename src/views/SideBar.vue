<template>
  <div>
    <el-button @click="toggleCollapse">
      <i :class="isCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
    </el-button>
    <el-aside :width="asideWidth" :collapse="isCollapsed" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '2']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-location"></i>
      <span slot="title">{{ isCollapsed ? '' : '板块列表' }}</span></template>
          <el-menu-item-group>
            <el-menu>
              <el-menu-item 
                v-for="(boardItems, index) in boardItems" 
                :key="index" 
                :index="boardItems.route" 
                :class="{ 'active': isActiveMenuItem(boardItems) }"
                @click="goToRoute(boardItems.route)">
                <span class="menu-item-text">{{ isCollapsed ? '' : boardItems.label }}</span>
              </el-menu-item>

            </el-menu>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>
    <span slot="title">{{ isCollapsed ? '' : '个股列表' }}</span></template>
          <el-menu-item-group>
            <el-menu>
              <el-menu-item 
                v-for="(stockItems, index) in stockItems" 
                :key="index" 
                :index="stockItems.route" 
                :class="{ 'active': isActiveMenuItem(stockItems) }"
                @click="goToRoute(stockItems.route)">
                <span class="menu-item-text">{{ isCollapsed ? '' : stockItems.label }}</span>
              </el-menu-item>
            </el-menu>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  computed: {
    activeMenuItem() {
      return this.boardItems.find((item) => item.route === this.$route.path);
    },
  },
  data() {
    return {
      isCollapsed: false, // 控制侧边栏是否折叠的变量
      asideWidth: '200px', // 侧边栏的宽度，可根据折叠状态来调整
      boardItems: [
        { route: '/api/concept', path: '/api/concept', label: '概念板块列表' },
        { route: '/api/concept_followed', path: '/api/concept_followed', label: '已关注概念板块' },
        { route: '/api/industry', path: '/api/industry', label: '行业板块列表' },
        { route: '/api/industry_followed', path: '/api/industry_followed', label: '已关注行业板块' },
        // {  label: '已关注板块列表' },
        // 其他菜单项...
      ],
      stockItems:[
        {  route: '/api/stock/stock_list', path: '/api/stock/stock_list',label: '沪深京股票列表' },
        {  route: '/api/stock/stock_followed', path: '/api/stock/stock_followed',label: '已关注股票列表' },
        {  route: '/api/stock/stock_black', path: '/api/stock/stock_black',label: '已拉黑股票列表' },
      ],
    };
  },
  mounted() {

    // 监听路由变化，以便在路由变化时刷新页面
    this.$router.afterEach(() => {
      window.location.reload();
    });
  },

  methods: {
    isActiveMenuItem(menuItem) {
      return menuItem.route === this.$route.path;
    },
    goToRoute(route) {
      
    if (this.$route.path !== route) {
      
      this.$router.push(route);
      
    }

  },
  toggleCollapse() {
      this.isCollapsed = !this.isCollapsed; // 点击按钮时切换折叠状态
      this.asideWidth = this.isCollapsed ? '0px' : '200px'; // 根据折叠状态调整侧边栏宽度
    },
  } 
};

</script>

<style>
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    overflow: hidden;
    
  }

.active {
  color: inherit; /* 保持字体颜色不变，继承父元素或默认样式 */
  background-color: #f6f6fe; /* 改变背景颜色，这里以黄色为例 */
  border: 1px solid #26244c; /* 添加边框 */
  border-radius: 4px; /* 可选，设置边框圆角，使得按钮形状更美观 */
};


</style>
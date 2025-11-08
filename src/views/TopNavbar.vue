<template>
    <el-header style="font-size:40px;background-color:rgb(238, 241, 246)">
      <div class="header-content">
      <span>股票系统</span>
      <div v-if="lastSavedDate">
        {{ lastSavedDate }}
      </div>
    </div>
    </el-header>
</template>
<script>
import {date} from '@/api/apiService'; 

export default {
  data() {
    return {
      lastSavedDate: null,
    };
  },
  methods: {
    async fetchDate() {
      try {
      const result = await date('/api/date');
      this.lastSavedDate = result.data[0].date;
    }catch (error) {
        // 如果API调用失败，使用默认日期
        this.lastSavedDate = new Date().toLocaleDateString('zh-CN');
        console.log('使用默认日期');
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.fetchDate();
    }, 100);
  },
};
</script>
<style>
.el-header {
  background-color: #B3C0D1; /* 使用指定的颜色 */
  color: #333;
  line-height: 60px; /* 行高与高度匹配 */
  display: flex;
  align-items: center; /* 垂直居中内容 */
  /* justify-content: center;  */
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}


</style>
<script setup>
    import LoginVue from './views/Login.vue';
    import LayoutVue from './views/Layout.vue';
</script>

<template>
    <router-view></router-view>
</template>

<style scoped>
.el-table td, .el-table th {
  border: 1px solid black !important; /* 设置单元格边框为黑色 */
}

.el-table th {
  background-color: #f5f7fa; /* 保持表头的背景色 */
}
</style>

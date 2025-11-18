<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.title">
      <span v-if="!item.path">{{ item.title }}</span>
      <router-link v-else :to="item.path">{{ item.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../stores/menu';

const route = useRoute();
const menuStore = useMenuStore();

const breadcrumbItems = computed(() => {
  return menuStore.getBreadcrumb(route.path);
});
</script>

<style scoped lang="scss">
.breadcrumb {
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: #000000d9;
      
      &.is-link {
        color: #00000073;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
    
    &:last-child {
      .el-breadcrumb__inner {
        color: #000000d9;
        font-weight: 500;
      }
    }
  }
}
</style>
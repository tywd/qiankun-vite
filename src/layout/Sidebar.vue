<template>
  <el-aside :width="sidebarWidth" class="sidebar">
    <!-- <div class="logo">
      <img src="/logo.jpeg" alt="Logo" class="logo-img">
      <span v-show="!menuStore.collapsed" class="logo-text">Qiankun</span>
    </div> -->
    
    <el-menu
      :default-active="menuStore.activeMenu"
      :collapse="menuStore.collapsed"
      :unique-opened="true"
      router
      class="sidebar-menu"
      @select="handleMenuSelect"
    >
      <template v-for="menu in menuStore.menus" :key="menu.id">
        <!-- 有子菜单的项 -->
        <el-sub-menu v-if="menu.children" :index="menu.id">
          <template #title>
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </template>
          
          <el-menu-item 
            v-for="child in menu.children" 
            :key="child.id" 
            :index="child.id"
            :route="child.path"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 没有子菜单的项 -->
        <el-menu-item v-else :index="menu.id" :route="menu.path">
          <el-icon v-if="menu.icon">
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMenuStore } from '../stores/menu';

const menuStore = useMenuStore();

const sidebarWidth = computed(() => menuStore.collapsed ? '64px' : '200px');

const handleMenuSelect = (index: string) => {
  menuStore.setActiveMenu(index);
};
</script>

<style scoped lang="scss">
.sidebar {
  background-color: #001529;
  transition: width 0.3s;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #002140;
    padding: 0 16px;
    
    .logo-img {
      width: 32px;
      height: 32px;
    }
    
    .logo-text {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      margin-left: 8px;
      white-space: nowrap;
    }
  }
  
  .sidebar-menu {
    border: none;
    background-color: #001529;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      color: #bfbfbf;
      
      &:hover {
        background-color: #000c17;
        color: #fff;
      }
    }
    
    :deep(.el-menu-item.is-active) {
      background-color: #1890ff;
      color: #fff;
    }
    
    :deep(.el-icon) {
      color: inherit;
    }
  }
}
</style>
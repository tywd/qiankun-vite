<template>
  <div class="tabs-view">
    <!-- 标签页栏 -->
    <div class="tabs-bar">
      <div class="tabs-container">
        <div
          v-for="tab in tabsStore.tabs"
          :key="tab.id"
          :class="['tab-item', { active: tab.id === tabsStore.activeTabId }]"
          @click="switchTab(tab)"
          @contextmenu.prevent="showContextMenu($event, tab)"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <el-icon
            v-if="tab.closable"
            class="tab-close"
            @click.stop="closeTab(tab.id)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
      
      <!-- 标签页操作 -->
      <div class="tab-actions">
        <el-dropdown @command="handleTabAction">
          <el-icon class="more-actions">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
              <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="tab-content">
      <router-view />
    </div>
    
    <!-- 右键菜单 -->
    <div
      v-show="contextMenu.visible"
      :style="contextMenuStyle"
      class="context-menu"
    >
      <div class="menu-item" @click="closeCurrentTab">关闭</div>
      <div class="menu-item" @click="closeOtherTabs">关闭其他</div>
      <div class="menu-item" @click="closeAllTabs">关闭所有</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Close, MoreFilled } from '@element-plus/icons-vue';
import { useTabsStore } from '@/stores/tabs';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const currentRoute = computed(() => route.path);

// 右键菜单相关
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  currentTab: null as any
});

const contextMenuStyle = computed(() => ({
  left: contextMenu.x + 'px',
  top: contextMenu.y + 'px'
}));

// 切换标签页
const switchTab = (tab: any) => {
  if (tab.path !== route.path) {
    router.push(tab.path);
  }
  tabsStore.setActiveTab(tab.id);
};

// 关闭标签页
const closeTab = (tabId: string) => {
  const tab = tabsStore.tabs.find(t => t.id === tabId);
  if (!tab) return;

  tabsStore.removeTab(tabId);

  // 如果关闭后没有激活的标签页，跳转到首页
  if (tabsStore.tabs.length === 0) {
    router.push('/');
  }
};

// 显示右键菜单
const showContextMenu = (event: MouseEvent, tab: any) => {
  contextMenu.visible = true;
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.currentTab = tab;
};

// 关闭右键菜单
const hideContextMenu = () => {
  contextMenu.visible = false;
};

// 右键菜单操作
const closeCurrentTab = () => {
  if (contextMenu.currentTab) {
    closeTab(contextMenu.currentTab.id);
  }
  hideContextMenu();
};

const closeOtherTabs = () => {
  if (contextMenu.currentTab) {
    tabsStore.closeOtherTabs(contextMenu.currentTab.id);
  }
  hideContextMenu();
};

const closeAllTabs = () => {
  tabsStore.closeAllTabs();
  router.push('/');
  hideContextMenu();
};

// 标签页操作
const handleTabAction = (command: string) => {
  if (command === 'closeOther' && tabsStore.currentTab) {
    tabsStore.closeOtherTabs(tabsStore.currentTab.id);
  } else if (command === 'closeAll') {
    tabsStore.closeAllTabs();
    router.push('/');
  }
};

// 点击其他地方隐藏右键菜单
onMounted(() => {
  document.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu);
});
</script>

<style scoped lang="scss">
.tabs-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .tabs-bar {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    
    .tabs-container {
      flex: 1;
      display: flex;
      overflow-x: auto;
      
      .tab-item {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        min-width: 120px;
        transition: all 0.3s;
        position: relative;
        text-align: center;
        
        &:hover {
          background-color: #f5f5f5;
          
          .tab-close {
            opacity: 1;
          }
        }
        
        &.active {
          background-color: #e6f7ff;
          color: #1890ff;
          
          .tab-close:hover {
            background-color: #c6e2ff;
            color: #1890ff;
          }
        }
        
        .tab-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tab-close {
          margin-left: 4px;
          border-radius: 50%;
          padding: 2px;
          opacity: 0;
          transition: all 0.3s;
          position: absolute;
          right: 0;
          top: 0;
          
          &:hover {
            background-color: #d9d9d9;
            color: #000;
          }
        }
      }
    }
    
    .tab-actions {
      display: flex;
      align-items: center;
      padding: 0 12px;
      border-left: 1px solid #f0f0f0;
      
      .more-actions {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
  
  .tab-content {
    flex: 1;
    overflow: auto;
    
    .micro-app-container {
      width: 100%;
      height: 100%;
    }
  }
  
  .context-menu {
    position: fixed;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    
    .menu-item {
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
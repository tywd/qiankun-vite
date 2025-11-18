// 应用的tab访问状态管理
import { defineStore } from 'pinia';
import type { AppNavTab } from '@/types';

interface AppTabsState {
  // 应用的导航Tabs数据(用于切换主子应用)
  navTabs: AppNavTab[];
  // 当前激活的Tab的ID
  activeTabId: string;
}

export const useAppTabsStore = defineStore('appTabs', {
  state: (): AppTabsState => ({
    // 应用的导航Tabs数据(用于切换主子应用)
    navTabs: [],
    // 当前激活的Tab的ID
    activeTabId: 'main'
  }),

  getters: {
    activeTab: (state: AppTabsState) => state.navTabs.find(tab => tab.id === state.activeTabId)
  },

  actions: {
    // 切换激活的Tab
    setActiveTab(tabId: string) {
      console.log('切换激活的Tab', tabId, this.activeTabId);
      this.navTabs.forEach(tab => {
        tab.isActive = tab.id === tabId;
      });
      this.activeTabId = tabId;
    },

    // 添加新的导航Tab（用于后续扩展）
    addNavTab(tab: Omit<AppNavTab, 'isActive'>) {
      // 先将所有tab设为非激活
      const newTab: AppNavTab = {
        ...tab,
        isActive: false
      };
      this.navTabs.push(newTab);
    }
  }
});
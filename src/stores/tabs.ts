import { defineStore } from 'pinia';
import type { NavTab } from '@/types';
import router from "@/router";

interface TabsState {
  // 导航Tabs数据
  tabs: NavTab[];
  activeTabId: string;
}

export const useTabsStore = defineStore('Tabs', {
  state: (): TabsState => ({
    // 导航Tabs数据
    tabs: [
      {
        id: 'home',
        name: '数据看板',
        path: '/dashboard',
        closable: false,
        isActive: true
      }
    ],
    activeTabId: 'dashboard'
  }),

  getters: {
    currentTab: (state) => state.tabs.find(tab => tab.id === state.activeTabId)
  },

  actions: {
    // 切换激活的Tab
    setActiveTab(tabId: string) {
      this.tabs = this.tabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }));
      this.activeTabId = tabId;
    },

    // 添加新的导航Tab（用于后续扩展）
    addTab(tab: Omit<NavTab, 'isActive'>) {
      // 先检查标签页是否已存在
      const existingTab = this.tabs.find(t => t.path === tab.path);
      if (existingTab) {
        // 如果标签页已存在，直接激活它
        this.setActiveTab(existingTab.id);
        return;
      }

      const newTab: NavTab = {
        ...tab,
        isActive: true
      };

      // 先将所有tab设为非激活
      this.tabs = this.tabs.map(tab => ({
        ...tab,
        isActive: false
      }));

      this.tabs.push(newTab);
      this.activeTabId = newTab.id;
    },

    // 移除导航Tab（对于可关闭的Tab）
    removeTab(tabId: string) {
      if (this.tabs.length <= 1) return; // 至少保留一个Tab

      const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex === -1) return;

      const isActive = this.activeTabId === tabId;
      this.tabs.splice(tabIndex, 1);

      if (isActive) {
        // 如果删除的是当前激活的Tab，激活前一个Tab
        const newIndex = Math.max(0, tabIndex - 1);
        router.push(this.tabs[newIndex].path)
        this.setActiveTab(this.tabs[newIndex].id);
      }
    },

    // 关闭其他标签页
    closeOtherTabs(tabId: string) {
      const tab = this.tabs.find(t => t.id === tabId);
      if (!tab) return;

      // 保留当前标签页和不可关闭的标签页（如首页）
      this.tabs = this.tabs.filter(t => !t.closable || t.id === tabId);

      // 如果当前激活的标签页被关闭了，则激活指定的标签页
      if (this.activeTabId !== tabId) {
        this.setActiveTab(tabId);
      }
    },

    // 关闭所有标签页
    closeAllTabs() {
      // 保留不可关闭的标签页（如首页）
      this.tabs = this.tabs.filter(tab => !tab.closable);

      // 激活第一个标签页（通常是首页）
      if (this.tabs.length > 0) {
        this.setActiveTab(this.tabs[0].id);
      }
    }
  }
});
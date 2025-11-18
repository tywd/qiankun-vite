// 菜单状态管理
import { defineStore } from 'pinia';
import type { MenuItem } from '@/types';
import { transformMenu } from '@/utils';

interface MenuState {
  // 菜单数据（支持多级）
  menus: MenuItem[];
  collapsed: boolean; // 侧边栏是否折叠
  activeMenu: string; // 当前激活的菜单
  openMenus: string[]; // 展开的菜单项
  isLoaded: boolean; // 是否加载完成所有菜单
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    // 菜单数据（支持多级）
    menus: [
      {
        id: 'dashboard',
        title: '数据看板',
        path: '/dashboard',
        icon: 'DataAnalysis',
        level: 1
      },
      {
        id: 'user-center',
        title: '个人中心',
        path: '/user-center',
        icon: 'User',
        level: 1,
      },
      {
        id: 'system-management',
        title: '系统管理',
        icon: 'Setting',
        level: 1,
        children: [
          {
            id: 'system-settings',
            title: '系统设置',
            path: '/system/setting',
            icon: 'Tools',
            level: 2,
            parentId: 'system-management'
          }
        ]
      }
    ],
    collapsed: false, // 侧边栏是否折叠
    activeMenu: 'dashboard', // 当前激活的菜单
    openMenus: ['dashboard'], // 展开的菜单项
    isLoaded: false // 是否加载完成所有菜单
  }),

  getters: {
    // 扁平化菜单用于面包屑
    flatMenus: (state) => {
      const flatten: MenuItem[] = [];
      const flattenMenus = (menus: MenuItem[]) => {
        menus.forEach(menu => {
          if (menu.path) {
            flatten.push(menu);
          }
          if (menu.children) {
            flattenMenus(menu.children);
          }
        });
      };
      flattenMenus(state.menus);
      return flatten;
    },

    // 获取面包屑路径
    breadcrumb: (state) => (path: string) => {
      const breadcrumb: Array<{ title: string; path?: string; icon?: string }> = [];

      const findPath = (menus: MenuItem[], targetPath: string): boolean => {
        for (const menu of menus) {
          if (menu.path === targetPath) {
            breadcrumb.unshift({
              title: menu.title,
              path: menu.path,
              icon: menu.icon
            });
            return true;
          }
          if (menu.children) {
            if (findPath(menu.children, targetPath)) {
              if (menu.title) {
                breadcrumb.unshift({
                  title: menu.title,
                  path: menu.path,
                  icon: menu.icon
                });
              }
              return true;
            }
          }
        }
        return false;
      };

      findPath(state.menus, path);
      return breadcrumb;
    }
  },

  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },

    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed;
    },

    setActiveMenu(menuId: string) {
      this.activeMenu = menuId;
    },

    // 切换菜单展开状态
    toggleMenu(menuId: string) {
      const index = this.openMenus.indexOf(menuId);
      if (index > -1) {
        this.openMenus.splice(index, 1);
      } else {
        this.openMenus.push(menuId);
      }
    },

    // 根据路径查找菜单
    findMenuByPath(path: string): MenuItem | null {
      const findInMenus = (menus: MenuItem[]): MenuItem | null => {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children) {
            const found = findInMenus(menu.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findInMenus(this.menus);
    },

    // 获取面包屑路径
    getBreadcrumb(path: string) {
      return this.breadcrumb(path);
    },
    // 合并菜单
    mergeMenu(routes: any[]) {
      if (this.isLoaded) return; // 菜单已经加载则无需再合并menus
      this.menus = [...this.menus, ...transformMenu(routes)]
      this.isLoaded = true
    }
  }
});
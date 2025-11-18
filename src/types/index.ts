// 导航Tab项类型
export interface NavTab {
  id: string;
  title?: string;
  name: string;
  path: string;
  component?: string;
  closable?: boolean; // 是否可关闭
  isActive: boolean;
}
export interface AppNavTab extends NavTab{
  app: string;
}

// 用户信息类型
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

// 菜单项类型（支持多级）
export interface MenuItem {
  id: string;
  title: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  level: number; // 菜单级别：1,2,3
  parentId?: string; // 父级菜单ID
  isExternal?: boolean; // 是否外部链接
  hidden?: boolean; // 是否隐藏
}

// 标签页类型
export interface TabItem {
  id: string;
  name: string;
  path: string;
  component: string;
  closable: boolean;
  isActive: boolean;
  query?: any; // 路由参数
}

// 面包屑项类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}
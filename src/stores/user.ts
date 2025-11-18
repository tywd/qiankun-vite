import { defineStore } from 'pinia';
import type { UserInfo } from '@/types';

interface UserState {
  userInfo: UserInfo;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: {
      id: '1',
      name: '管理员',
      avatar: '/avatar.jpeg',
      role: '超级管理员'
    },
    isLoggedIn: true
  }),

  actions: {
    // 更新用户信息
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo };
    },

    // 退出登录
    logout() {
      this.isLoggedIn = false;
      this.userInfo = {} as UserInfo;
      // 这里可以添加跳转到登录页的逻辑
    }
  }
});
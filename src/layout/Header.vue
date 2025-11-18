<template>
    <header class="main-header">
        <!-- 左侧：平台名称 -->
        <div class="header-left">
            <div class="platform-name">
                <span class="name-text">Qiankun微前端管理平台</span>
            </div>
        </div>
        <!-- 中间：导航Tabs -->
        <div class="header-center">
            <AppTabs />
        </div>
        <!-- 右侧：用户信息 -->
        <div class="header-right">
            <el-dropdown @command="handleUserCommand" trigger="click">
                <span class="user-info">
                    <el-avatar :size="32" :src="userStore.userInfo.avatar" class="user-avatar" />
                    <span class="username">{{ userStore.userInfo.name }}</span>
                    <el-icon class="dropdown-arrow">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { SwitchButton, ArrowDown } from '@element-plus/icons-vue';
import AppTabs from './AppTabs.vue';

const userStore = useUserStore();

const handleUserCommand = (command: string) => {
    switch (command) {
        case 'logout':
            // 处理退出登录
            userStore.logout();
            // 这里可以跳转到登录页
            console.log('退出登录');
            break;
    }
};
</script>

<style scoped lang="scss">
.main-header {
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    color: white;


    .header-left {
        flex-shrink: 0;

        .platform-name {
            .name-text {
                font-size: 20px;
                font-weight: 600;
                letter-spacing: 1px;
            }
        }
    }

    .header-center {
        flex-grow: 1;
        /* 中间内容自适应 */
        overflow-y: auto;
        /* 超出部分显示垂直滚动条 */
    }

    .header-right {
        flex-shrink: 0;

        .user-info {
            color: #fff;
            display: flex;
            align-items: center;
            padding: 8px 5px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .user-avatar {
                margin-right: 8px;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            .username {
                color: #fff;
                font-size: 14px;
                font-weight: 500;
            }

            .dropdown-arrow {
                font-size: 12px;
                transition: transform 0.3s ease;
            }
        }

        // 下拉菜单展开时箭头旋转
        :deep(.el-dropdown) {
            &.is-active {
                .dropdown-arrow {
                    transform: rotate(180deg);
                }
            }
        }
    }
}

// 下拉菜单样式
:deep(.el-dropdown-menu) {
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .el-dropdown-menu__item {
        display: flex;
        align-items: center;
        padding: 8px 16px;

        .el-icon {
            margin-right: 8px;
            font-size: 16px;
        }

        &:hover {
            background-color: #f5f7fa;
            color: #409eff;
        }
    }
}
</style>
<template>
  <div class="home-page">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">欢迎使用管理平台</span>
        </div>
      </template>
      
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-item">
                <div class="stats-icon" style="background: #1890ff;">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">1,234</div>
                  <div class="stats-label">用户数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-item">
                <div class="stats-icon" style="background: #52c41a;">
                  <el-icon><Picture /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">56</div>
                  <div class="stats-label">Banner数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-item">
                <div class="stats-icon" style="background: #faad14;">
                  <el-icon><ShoppingCart /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">89</div>
                  <div class="stats-label">订单数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>快速导航</span>
              </template>
              <div class="quick-nav">
                <el-button 
                  type="primary" 
                  link 
                  @click="$router.push('/banner')"
                >
                  <el-icon><Picture /></el-icon>
                  Banner管理
                </el-button>
                <el-button type="primary" link>
                  <el-icon><User /></el-icon>
                  用户管理
                </el-button>
                <el-button type="primary" link>
                  <el-icon><ShoppingCart /></el-icon>
                  订单管理
                </el-button>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>系统信息</span>
              </template>
              <div class="system-info">
                <p>版本: v1.0.0</p>
                <p>最后更新: 2024-01-15</p>
                <p>状态: 运行正常</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { User, Picture, ShoppingCart } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.home-page {
  padding: 0;
  
  .welcome-card {
    border: none;
    box-shadow: none;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #000000d9;
      }
    }
    
    .welcome-content {
      .stats-card {
        border: none;
        
        .stats-item {
          display: flex;
          align-items: center;
          
          .stats-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            
            .el-icon {
              font-size: 24px;
              color: white;
            }
          }
          
          .stats-info {
            .stats-value {
              font-size: 24px;
              font-weight: 600;
              color: #000000d9;
              line-height: 1.2;
            }
            
            .stats-label {
              font-size: 14px;
              color: #00000073;
              margin-top: 4px;
            }
          }
        }
      }
      
      .quick-nav {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .el-button {
          justify-content: flex-start;
          padding: 12px 16px;
          
          .el-icon {
            margin-right: 8px;
          }
        }
      }
      
      .system-info {
        p {
          margin: 8px 0;
          color: #00000073;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
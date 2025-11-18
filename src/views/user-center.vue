<template>
  <div class="user-center">
    <el-card>
      <template #header>
        <span class="card-title">个人中心</span>
      </template>
      
      <el-form :model="userForm" label-width="100px" style="max-width: 500px;">
        <el-form-item label="用户名">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="userForm.role" disabled />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const userStore = useUserStore();
const userForm = reactive({
  name: '',
  role: '',
  avatar: ''
});

onMounted(() => {
  // 初始化表单数据
  Object.assign(userForm, userStore.userInfo);
});

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    ElMessage.error('头像只能是 JPG/PNG 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!');
    return false;
  }
  
  // 模拟上传
  const reader = new FileReader();
  reader.onload = (e) => {
    userForm.avatar = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  return false; // 阻止自动上传
};

const handleSave = () => {
  userStore.updateUserInfo(userForm);
  ElMessage.success('保存成功!');
};

const handleReset = () => {
  Object.assign(userForm, userStore.userInfo);
};
</script>

<style scoped lang="scss">
.user-center {
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      width: 100px;
      height: 100px;
      
      &:hover {
        border-color: #409eff;
      }
    }
    
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}
</style>
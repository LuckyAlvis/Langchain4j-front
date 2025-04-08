<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">个人财务管理系统</h1>
      <p class="subtitle">管理您的个人和家庭财务</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <div class="input-with-icon">
            <el-input
                v-model="form.username"
                placeholder="用户名/邮箱"
                :prefix-icon="User"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                :prefix-icon="Lock"
                show-password
            />
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">登录</span>
          <i v-else class="fas fa-spinner fa-spin"></i>
        </button>
      </form>

      <div class="login-footer">
        <span>还没有账号? </span>
        <a href="#" class="register-link">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {User, Lock} from '@element-plus/icons-vue'
import {authService} from '@/services/auth'
import type {LoginRequest} from '@/types/auth'

const router = useRouter()
const loading = ref(false)
const form = ref<LoginRequest>({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const response = await authService.login(form.value)
    localStorage.setItem('token', response.data.token)
    router.push('/')
  } catch (error) {
    alert('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f1fa, #f0f5fa);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.subtitle {
  margin: 0 0 32px 0;
  font-size: 14px;
  color: #666;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 0;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

/* 覆盖 Element Plus 的默认样式 */
:deep(.el-input__wrapper) {
  padding: 1px 11px;
  background-color: white;
}

:deep(.el-input__inner) {
  height: 42px;
  font-size: 14px;
}

:deep(.el-input__prefix) {
  font-size: 16px;
  color: #909399;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  cursor: pointer;
}

.forgot-password {
  color: #1976d2;
  text-decoration: none;
}

.btn-login {
  background: #1976d2;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.btn-login:hover {
  background: #1565c0;
}

.btn-login:disabled {
  background: #90caf9;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #1976d2;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
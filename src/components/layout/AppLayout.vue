<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h2>
          <span>财务管理系统</span>
          <span>Financial System</span>
        </h2>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" active-class="active">
          <i class="fas fa-chart-line" style="margin-right: 10px"></i>
          <span>看板</span>
        </router-link>
        
        <router-link to="/transactions" class="nav-item" active-class="active">
          <i class="fas fa-wallet" style="margin-right: 10px"></i>
          <span>个人记账</span>
        </router-link>
        
        <router-link to="/family-bills" class="nav-item" active-class="active">
          <i class="fas fa-home" style="margin-right: 10px"></i>
          <span>家庭账单</span>
        </router-link>
        
        <router-link to="/personal-savings" class="nav-item" active-class="active">
          <i class="fas fa-piggy-bank" style="margin-right: 10px"></i>
          <span>个人储蓄计划</span>
        </router-link>
        
        <router-link to="/family-savings" class="nav-item" active-class="active">
          <i class="fas fa-users" style="margin-right: 10px"></i>
          <span>家庭储蓄计划</span>
        </router-link>
        
        <router-link to="/financial-health" class="nav-item" active-class="active">
          <i class="fas fa-heartbeat" style="margin-right: 10px"></i>
          <span>财务健康看板</span>
        </router-link>
        
        <router-link to="/chat" class="nav-item" active-class="active">
          <i class="fas fa-comment-dots" style="margin-right: 10px"></i>
          <span>AI财务助手</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-nav">
        <div class="nav-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumb">
            <span>{{ currentPageName }}</span>
          </div>
        </div>
        <div class="nav-right">
          <!-- 移除搜索框 -->
          <!-- <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索...">
          </div> -->

          <!-- 注释掉消息通知 -->
          <!-- <div class="notifications">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </div> -->

          <!-- 修改用户头像部分，添加下拉菜单 -->
          <div class="user-profile" @click="toggleUserMenu">
            <img src="@/assets/avatar.png" alt="User Avatar" class="avatar">
            <span class="username">张三</span>
            <i class="fas fa-chevron-down"></i>
            
            <!-- 用户菜单 -->
            <div class="user-menu" v-if="showUserMenu">
              <a href="#" class="menu-item">
                <i class="fas fa-user"></i> 个人资料
              </a>
              <a href="#" class="menu-item">
                <i class="fas fa-cog"></i> 设置
              </a>
              <a href="#" class="menu-item" @click.prevent="logout">
                <i class="fas fa-sign-out-alt"></i> 退出登录
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'AppLayout',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isSidebarCollapsed = ref(false)
    const showUserMenu = ref(false)
    
    // 当前页面名称
    const currentPageName = computed(() => {
      const routeMap = {
        '/': '首页',
        '/transactions': '个人记账',
        '/family-bills': '家庭账单',
        '/personal-savings': '个人储蓄计划',
        '/family-savings': '家庭储蓄计划',
        '/financial-health': '财务健康看板',
        '/chat': 'AI财务助手'
      }
      
      return routeMap[route.path] || '未知页面'
    })
    
    // 切换侧边栏
    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value
    }
    
    // 切换用户菜单
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }
    
    // 退出登录
    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
    
    // 点击外部关闭用户菜单
    const handleClickOutside = (event) => {
      const userProfile = document.querySelector('.user-profile')
      if (userProfile && !userProfile.contains(event.target)) {
        showUserMenu.value = false
      }
    }
    
    // 监听点击事件
    window.addEventListener('click', handleClickOutside)
    
    return {
      isSidebarCollapsed,
      showUserMenu,
      currentPageName,
      toggleSidebar,
      toggleUserMenu,
      logout
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* 侧边栏样式 */
.sidebar {
  width: 230px;
  background: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  padding: 0;
  border-right: 1px solid #eee;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 8px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  flex-direction: column;
}

.sidebar-header h2 span:first-child {
  font-size: 16px;
  margin-bottom: 2px;
}

.sidebar-header h2 span:last-child {
  font-size: 12px;
  color: #999;
}

/* 侧边栏导航项 */
.sidebar-nav {
  padding: 15px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #666;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #4a90e2;
  color: white;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
}

.nav-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
  margin-right: 16px;
}

.nav-item span {
  font-size: 14px;
}

/* 顶部导航样式 */
.top-nav {
  height: 60px;
  background: white;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  right: 0;
  left: 230px;
  z-index: 5;
  margin-bottom: 0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.breadcrumb span:last-child {
  color: #333;
  font-weight: 500;
}

.menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  margin-right: 10px;
}

.menu-toggle:hover {
  background: #f5f5f5;
  color: #333;
}

/* 用户资料样式 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.user-profile:hover {
  background: #f5f5f5;
}

.user-profile img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-profile i {
  font-size: 12px;
  color: #666;
}

.main-content {
  flex: 1;
  margin-left: 230px;
  padding-top: 60px;
  min-height: 100vh;
  width: calc(100% - 230px);
}

.content {
  padding: 0;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 用户菜单 */
.user-menu {
  position: absolute;
  top: 45px;
  right: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 100;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.menu-item i {
  width: 16px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  .sidebar-collapsed .sidebar {
    transform: translateX(-100%);
  }
  
  .top-nav {
    left: 0;
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .user-profile span {
    display: none;
  }
}
</style>
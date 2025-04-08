<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h2>财务管理系统</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: $route.path === '/' }">
            <router-link to="/"><i class="fas fa-chart-line"></i>看板</router-link>
          </li>
          <li :class="{ active: $route.path === '/transactions' }">
            <router-link to="/transactions"><i class="fas fa-wallet"></i>个人记账</router-link>
          </li>
          <li :class="{ active: $route.path === '/family-bills' }">
            <router-link to="/family-bills"><i class="fas fa-home"></i>家庭账单</router-link>
          </li>
          <li :class="{ active: $route.path === '/personal-savings' }">
            <router-link to="/personal-savings"><i class="fas fa-piggy-bank"></i>个人储蓄计划</router-link>
          </li>
          <li :class="{ active: $route.path === '/family-savings' }">
            <router-link to="/family-savings"><i class="fas fa-users"></i>家庭储蓄计划</router-link>
          </li>
          <li :class="{ active: $route.path === '/financial-health' }">
            <router-link to="/financial-health"><i class="fas fa-heartbeat"></i>财务健康看板</router-link>
          </li>
        </ul>
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
            <span>{{ breadcrumbs[0] }}</span> / <span>{{ breadcrumbs[1] }}</span>
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
          <div class="user-profile">
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="user-info">
                <img src="@/assets/avatar.png" alt="用户头像">
                <span>张三</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
// 引入Element Plus组件
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import 'element-plus/dist/index.css' // 引入样式

export default {
  name: 'AppLayout',
  components: {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },
  data() {
    return {
      sidebarCollapsed: false
    }
  },
  computed: {
    breadcrumbs() {
      const routeMap = {
        '/': ['首页', '看板'],
        '/transactions': ['首页', '个人记账'],
        '/family-bills': ['首页', '家庭账单'],
        '/personal-savings': ['首页', '个人储蓄计划'],
        '/family-savings': ['首页', '家庭储蓄计划'],
        '/financial-health': ['首页', '财务健康看板']
      }
      return routeMap[this.$route.path] || ['首页', '未知页面']
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      document.querySelector('.app-container').classList.toggle('sidebar-collapsed')
    },
    // 添加处理下拉菜单命令的方法
    handleCommand(command) {
      if (command === 'logout') {
        // 清除登录状态
        localStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login')
      } else if (command === 'profile') {
        // 处理个人信息
        console.log('跳转到个人信息页面')
      } else if (command === 'settings') {
        // 处理设置
        console.log('跳转到设置页面')
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #eee;
}

.logo {
  width: 32px;
  height: 32px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.sidebar-nav {
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav li {
  margin-bottom: 4px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #666;
  transition: all 0.2s;
}

.sidebar-nav a i {
  width: 20px;
  text-align: center;
}

.sidebar-nav li.active a {
  background: #e3f2fd;
  color: #1976d2;
}

.sidebar-nav a:hover {
  background: #f5f5f5;
  color: #333;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-nav {
  height: 64px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: none;
}

.menu-toggle:hover {
  background: #f5f5f5;
  color: #333;
}

.breadcrumb {
  color: #666;
}

.breadcrumb span:last-child {
  color: #333;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #1976d2;
  width: 300px;
}

.notifications {
  position: relative;
  color: #666;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff1744;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

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

.content {
  flex: 1;
  overflow: auto;
  background: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
  }

  .menu-toggle {
    display: block;
  }

  .sidebar-collapsed .sidebar {
    transform: translateX(-100%);
  }

  .search-box {
    display: none;
  }
}

@media (max-width: 768px) {
  .user-profile span {
    display: none;
  }
}

/* 调整下拉菜单样式 */
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}

.user-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

/* 确保下拉菜单可见 */
:deep(.el-dropdown-menu) {
  z-index: 2000;
}
</style>
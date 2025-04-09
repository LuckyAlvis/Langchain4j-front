import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import FamilyBillsView from '../views/FamilyBillsView.vue'
import PersonalSavingsView from '../views/PersonalSavingsView.vue'
import FamilySavingsView from '../views/FamilySavingsView.vue'
import FinancialHealthView from '../views/FinancialHealthView.vue'
import ChatView from '../views/ChatView.vue'

// 路由定义
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/family-bills',
    name: 'FamilyBills',
    component: FamilyBillsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/personal-savings',
    name: 'PersonalSavings',
    component: PersonalSavingsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/family-savings',
    name: 'FamilySavings',
    component: FamilySavingsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/financial-health',
    name: 'FinancialHealth',
    component: FinancialHealthView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router 
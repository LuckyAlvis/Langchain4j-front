import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import TransactionsView from '@/views/TransactionsView.vue'
import FamilyBillsView from '@/views/FamilyBillsView.vue'
import PersonalSavingsView from '@/views/PersonalSavingsView.vue'
import FamilySavingsView from '@/views/FamilySavingsView.vue'
import FinancialHealthView from '@/views/FinancialHealthView.vue'
import LoginView from '@/views/LoginView.vue'

// 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView,
            meta: {requiresAuth: true}
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: {requiresAuth: false}
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: TransactionsView,
            meta: {requiresAuth: true}
        },
        {
            path: '/family-bills',
            name: 'family-bills',
            component: FamilyBillsView,
            meta: {requiresAuth: true}
        },
        {
            path: '/personal-savings',
            name: 'personal-savings',
            component: PersonalSavingsView,
            meta: {requiresAuth: true}
        },
        {
            path: '/family-savings',
            name: 'family-savings',
            component: FamilySavingsView,
            meta: {requiresAuth: true}
        },
        {
            path: '/financial-health',
            name: 'financial-health',
            component: FinancialHealthView,
            meta: {requiresAuth: true}
        }
    ]
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token')

    // 如果路由需要认证且用户未登录，则重定向到登录页
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router
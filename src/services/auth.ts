import type {LoginRequest, LoginResponse, ApiResponse} from '@/types/auth'
import http from '@/utils/axios'

export const authService = {
    // 登录
    login: (data: LoginRequest) => http.post<ApiResponse<LoginResponse>>('/api/auth/login', data),

    // 登出
    logout: () => http.post<ApiResponse<void>>('/api/auth/logout')
} 
import type { RouteRecordRaw } from 'vue-router'
import { AppLayoutsEnum } from '@/app/layouts/config/layouts.types'

export const routeName = 'MainPage'
export const route: RouteRecordRaw = {
    name: routeName,
    path: '/',
    component: () => import('@/pages/main'),
    meta: {
        layout: AppLayoutsEnum.default,
        // needsAuth: true,
    }
}
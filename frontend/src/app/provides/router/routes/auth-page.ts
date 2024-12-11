import type { RouteRecordRaw } from 'vue-router'
import { AppLayoutsEnum } from '@/app/layouts/config/layouts.types'

export const routeName = 'AuthPage'
export const route: RouteRecordRaw = {
  name: routeName,
  path: '/auth',
  component: () => import('@/pages/auth'),
  meta: {
    layout: AppLayoutsEnum.auth,
    // needsAuth: false,
    // checkAuth: true
  }
}
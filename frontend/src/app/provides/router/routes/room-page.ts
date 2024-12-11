import type { RouteRecordRaw } from 'vue-router'
import { AppLayoutsEnum } from '@/app/layouts/config/layouts.types'

export const routeName = 'RoomPage'
export const route: RouteRecordRaw = {
    name: routeName,
    path: '/room-page',
    component: () => import('@/pages/room'),
    meta: {
        layout: AppLayoutsEnum.default,
        // needsAuth: true,
    }
}
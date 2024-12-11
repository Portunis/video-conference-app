import type { RouteRecordRaw } from 'vue-router'
import { AppLayoutsEnum } from '@/app/layouts/config/layouts.types'

export const routeName = 'NotFoundPage'
export const route: RouteRecordRaw = {
  name: routeName,
  path: '/:catchAll(.*)',
  component: () => import('@/pages/NotFoundPage'),
  meta: {
    layout: AppLayoutsEnum.auth,
  },

}
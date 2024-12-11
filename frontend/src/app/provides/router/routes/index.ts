import type { RouteRecordRaw } from 'vue-router'


import { route as mainRoute } from './main-page'
import { route as authPage } from  './auth-page'
import { route as notFoundPage } from './404-page'
import { route as roomPage } from './room-page'

export const routes: readonly RouteRecordRaw[] = [
    mainRoute,
    authPage,
  notFoundPage,
    roomPage

] as const
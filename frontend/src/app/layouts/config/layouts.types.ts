export enum AppLayoutsEnum {
  default = 'default',
  auth = 'auth',
}

export const AppLayoutToFileMap: Record<AppLayoutsEnum, string> = {
  default: 'AppLayoutDefault.vue',
  auth: 'AppLayoutAuth.vue'
}
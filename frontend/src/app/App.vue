<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { Capacitor } from '@capacitor/core';
import AppLayout from './layouts/ui/AppLayout.vue'
import ToasterNotification from '@/shared/ui/toast/Toaster.vue'
import { setTheme } from '@/shared/utils/setTheme'
import { Toaster } from '@/shared/ui/sonner'

setTheme()
const calcVh = () => {
  let vh: number | string = '1%'
  const isIosApp = Capacitor?.isNativePlatform?.() && Capacitor?.getPlatform?.() === 'ios'
  if (!isIosApp) {
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    vh = height * 0.01
  }

  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  calcVh()
  window.addEventListener('resize', () => {
    calcVh()
  })
  window.addEventListener('orientationchange', () => {
    calcVh()
  })
})
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster />
  <ToasterNotification />
</template>

<style scoped></style>
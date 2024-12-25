<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import AppLayout from './layouts/ui/AppLayout.vue'
import ToasterNotification from '@/shared/ui/toast/Toaster.vue'
import { setTheme } from '@/shared/utils/setTheme'
import { Toaster } from '@/shared/ui/sonner'
import { App } from '@capacitor/app';


setTheme()
const calcVh = () => {
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const vh = height * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

calcVh()

onMounted(() => {
  window.addEventListener('resize', () => {
    calcVh()
  })
  window.addEventListener('orientationchange', () => {
    calcVh()
  })
  App.addListener('backButton', ({canGoBack}) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp().catch(e => console.error(e));
    }
  });
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
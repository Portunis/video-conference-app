<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import AppLayout from './layouts/ui/AppLayout.vue'
import Toaster from '@/shared/ui/toast/Toaster.vue'
import { setTheme } from '@/shared/utils/setTheme'

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
})
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster />
</template>

<style scoped></style>
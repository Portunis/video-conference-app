<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './layouts/ui/AppLayout.vue'
import Toaster from '@/shared/ui/toast/Toaster.vue'
import { setTheme } from '@/shared/utils/setTheme'

setTheme()
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster />
</template>

<style scoped></style>
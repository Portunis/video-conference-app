<script setup lang="ts">

import AuthForm from '@/widgets/Auth/ui/AuthForm.vue'
const version = import.meta.env.VITE_APP_VERSION

</script>

<template>
  <div class="auth-page">
    <div class="auth-page__form">
      <AuthForm />
      <div class="mt-2.5 text-center">{{ version}}</div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "style";
</style>

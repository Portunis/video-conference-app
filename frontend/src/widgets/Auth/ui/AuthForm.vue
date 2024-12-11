<script setup lang="ts">

import { LoginForm, RegisterForm } from '@/feature/auth'

import { computed, ref } from 'vue'


const isRegister = ref(false)

const typeForm = computed(() => {
  return isRegister.value ? 'Регистарция' : 'Авторизация'
})
const typeTitle = computed(() => {
  return isRegister.value ? 'Зарегистрируйтесь' : 'Авторизируйтесь'
})




</script>

<template>
  <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px]">
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ typeForm }}
      </h1>
      <p class="text-sm text-muted-foreground">
        {{ typeTitle }}, для того чтобы воспользоваться функциями системы
      </p>
    </div>
    <LoginForm v-if="!isRegister" @toRegister="isRegister = true" />
    <RegisterForm v-if="isRegister" @back="isRegister = false" />
  </div>
</template>

<style scoped lang="scss">

</style>
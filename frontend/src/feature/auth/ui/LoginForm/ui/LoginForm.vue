<script setup lang="ts">

import { Loader } from 'lucide-vue-next'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {ref} from "vue";
import axios from "@/shared/api/api";

import { useRouter} from "vue-router";

const route = useRouter();

const emits = defineEmits(['toRegister'])
const isLoading = ref<boolean>(false);
const password = ref<string>('');
const username = ref<string>('');

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/users/login', {
      password: password.value,
      username: username.value,
    });
    console.log('Login successful', response.data);
    route.push('/')

  } catch (error) {
    console.error('Login error:', error);
  }
};
const showRegComponent = () => {
  emits('toRegister')
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email"> Email </Label>
          <Input
            placeholder="username"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
            v-model="username"
          />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="password"> Password </Label>
          <Input
            placeholder="*******"
            type="password"
            auto-capitalize="none"
            auto-complete="password"
            autocomplete="on"
            auto-correct="off"
            :disabled="isLoading"
            v-model="password"
          />
        </div>
        <Button :disabled="isLoading" class="mt-5" @click="handleSubmit">
          <Loader v-if="isLoading" class="h-4 w-4 animate-spin" />
          <p v-if="!isLoading">Войти</p>
        </Button>
        <Button :disabled="isLoading" @click="showRegComponent">
          <Loader v-if="isLoading" class="h-4 w-4 animate-spin" />
          <p v-if="!isLoading">Регистрация</p>
        </Button>
      </div>
  </div>
</template>
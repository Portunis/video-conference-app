<script setup lang="ts">


import { Button } from '@/shared/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'
import { Loader } from 'lucide-vue-next'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import {ref} from "vue";
import  axios  from "@/shared/api/api";

const emits = defineEmits(['back'])

const isLoading = ref<boolean>(false);
const email = ref<string>('');
const password = ref<string>('');
const username = ref<string>('');

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/users/register', {
      email: email.value,
      password: password.value,
      username: username.value,
    });
    console.log('Login successful', response.data);
    emits('back')
  } catch (error) {
    console.error('Login error:', error);
  }
};
const toBack = () => {
  emits('back')
}

</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="handleSubmit">
      <div class="grid gap-2">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Почта</FormLabel>
            <FormControl>
              <Input type="text" placeholder="user@mail.ru" v-model="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="username">
          <FormItem class="mt-2">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" placeholder="username" v-model="username" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem class="mt-2">
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input type="password" placeholder="**********" v-model="password" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ value, handleChange }" type="checkbox" name="approved">
          <FormItem class="flex flex-row items-start gap-x-3 space-y-0">
            <FormControl>
              <Checkbox :checked="value" @update:checked="handleChange" />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel>Я согласен на обработку моих данных</FormLabel>
            </div>
          </FormItem>
        </FormField>
        <Button :disabled="isLoading" @click="handleSubmit" class="mt-5" type="button">
          <Loader v-if="isLoading" class="h-4 w-4 animate-spin" />
          <p v-if="!isLoading">Регистрация</p>
        </Button>
        <Button @click="toBack" variant="outline" :disabled="isLoading" type="button">
          <p>Назад</p>
        </Button>
      </div>
    </form>
  </div>
</template>
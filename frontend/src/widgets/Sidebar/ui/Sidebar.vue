<script setup lang="ts">
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { ClassesEnums } from '@/shared/typescripts'


const sidebar = [
  {
    name: 'Вопросы',
    url: '/questions'
  },
  {
    name: 'Первая страница',
    url: '/qwew'
  },
  {
    name: 'Просто старница',
    url: '/asdf'
  },
]


</script>

<template>
  <div :class="cn( $attrs.class ?? '')" class="h-screen min-w-min border-r ">
    <div class="space-y-4 py-4">
      <div class="px-3 py-2">
        <router-link to="/">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
          Название чего то
        </h2>
        </router-link>
        <div class="mt-10">
          <router-link :to="item.url" v-for="item in sidebar" :key="item.url" :active-class="`button--${ClassesEnums.ACTIVE}`">
            <Button variant="ghost" class="w-full justify-start mb-1">
              {{ item.name }}
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button--active {
  button {
    color: hsl(var(--accent-foreground));
    background-color: hsl(var(--accent));
    border: none;
  }
}

</style>
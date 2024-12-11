<script setup lang="ts">
import { Button } from '@/shared/ui/button'

</script>

<template>
  <div class="not-found">

    <p class="not-found__text">404</p>
    <p class="not-found__text">Страница не найдена</p>
    <router-link to="/"><Button>Вернуться на главную</Button></router-link>
  </div>
</template>
<style scoped lang="scss">
@import "style";
</style>
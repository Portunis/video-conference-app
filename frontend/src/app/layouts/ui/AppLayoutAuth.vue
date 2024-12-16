<script setup lang="ts">

</script>

<template>
  <div class="auth-layout">
  <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  height: calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  width: 100%;
}
</style>
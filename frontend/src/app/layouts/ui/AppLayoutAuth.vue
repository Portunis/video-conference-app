<script setup lang="ts">

</script>

<template>
  <div class="auth-layout">
  <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
}
</style>
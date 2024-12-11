<script setup lang="ts">


import { setTheme } from '@/shared/utils/setTheme'
import { HeaderComponent } from '@/widgets/Header'

setTheme()
</script>

<template>
  <div class="main">
<!--    <HeaderComponent class="main__header" />-->
    <div class="main__content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
$admin-header-height: 70px;
$admin-footer-height: 70px;
$admin-nav-width: 250px;

.main {
  --spacing: 20px;
  display: grid;
  height: 100vh;

  grid-template-rows:     $admin-header-height 1fr $admin-footer-height;
  grid-template-columns:  $admin-nav-width 1fr;
  grid-template-areas:    "main main"
                          "main main"
                          "main main";

  &__header {
    display: flex;
    flex-basis: 100%;
    grid-area: header;
    position: relative;
  }
  &__nav {
    flex: 0 0;
    grid-area: nav;
  }
  &__content {
    flex: 1;
    grid-area: main;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding-top: 45px;


    &::-webkit-scrollbar {
      display: none;
    }

  }
  &__footer {
    display: flex;
    grid-area: footer;
    flex-basis: 100%;
    justify-content: space-between;
    align-items: center;
  }

  @media screen and (min-width: 48rem) {
    --spacing: 2rem;
  }
}
</style>

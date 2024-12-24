<script setup lang="ts">

import {PropType} from "vue";

defineProps({
  title: String as PropType<string>,
  description: String as PropType<string>
})


</script>

<template>
  <div class="notification-accept bg-neutral-100 text-black dark:text-neutral-50 dark:white">
    <div class="notification-accept__top">
      <p class="notification-accept__title text-black dark:text-black">{{title}}</p>
    </div>
    <p class="notification-accept__description text-black dark:text-black">{{description}}</p>
  </div>
</template>

<style scoped lang="scss">
.notification-accept {
  -webkit-box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  width: auto;
  height: auto;
  border-radius: 20px;
  padding: 16px 20px;
  &__top {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &__title {
    font-family: "Chakra Petch", sans-serif;
    font-size: 18px;
  }
  &__description {
    padding-top: 5px;
    font-family: "Chakra Petch", sans-serif;
    font-size: 14px;
  }
  // TODO: Решить прикол с разрешением
  @media screen and (min-width: 425px) {
    width: 365px;
  }
}

</style>
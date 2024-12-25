<script setup lang="ts">

import {Avatar, AvatarFallback, AvatarImage} from "@/shared/ui/avatar";
import {X,Check, Loader } from "lucide-vue-next";



const emit = defineEmits(["close", "accept"]);



defineProps({
  title: String,
  description: String,
  isLoader: Boolean,

})


const onClose = () => {
  emit("close");
};

const onAccept = () => {
  emit("accept");
};

</script>

<template>
  <div class="notification-accept bg-neutral-100 text-black dark:text-neutral-50 dark:white">

    <div class="notification-accept__top">
      <Avatar class="card-meeting__people-avatar h-8 w-8">
        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
        <AvatarFallback class="uppercase">{{ title[0] }}</AvatarFallback>
      </Avatar>
      <p class="notification-accept__title text-black dark:text-black">Запрос от {{title}}</p>
    </div>
    <p class="notification-accept__description text-black dark:text-black">{{description}}</p>
    <div class="notification-accept__actions">
      <div class="icon icon--red" @click="onClose">
        Отклонить
        <X color="#fff" />
      </div>
      <div  class="icon" @click="onAccept">
        <div v-if="!isLoader" style="display: flex;gap: 5px;">
          Принять
          <Check color="#fff" />
        </div>
          <Loader v-if="isLoader" class="loader"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification-accept {
  -webkit-box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(4, 4, 4, 0.2);
  width: 100%;
  height: auto;
  border-radius: 30px;
  padding: 16px 20px;
  &__top {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  &__title {
    font-family: "Chakra Petch", sans-serif;
    font-size: 20px;
  }
  &__description {
    padding-top: 15px;
    font-family: "Chakra Petch", sans-serif;
    font-size: 14px;
    padding-bottom: 30px;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: space-between;
    width: 100%;
  }
}
.icon {
  cursor: pointer;
  background: #000;
  border-radius: 50px;
  width: auto;
  height: 45px;
  padding: 10px 20px;
  display: flex;
  gap: 5px;
  min-width: 150px;
  justify-content: center;
  color: #fff;

  &--red {
    background: #EB5545;
  }


}
.loader {
  animation-name: spin;
  animation-duration: 2000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes spin {
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
}
</style>
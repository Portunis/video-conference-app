<script setup lang="ts">
import Avatar from '@/shared/ui/avatar/Avatar.vue';
import AvatarFallback from '@/shared/ui/avatar/AvatarFallback.vue';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/shared/ui/drawer'
import { ref, watch } from 'vue';

enum EUserStatus {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

type TUser = {
    userId: string;
    status: EUserStatus
    user: {
        username: string;
    }
}

type TProps = {
    modelValue: boolean
    users: TUser[],
    admin: string
}

type TEmits = {
    'update:modelValue': [nextModelValue: boolean]
}
const props = defineProps<TProps>()
const emits = defineEmits<TEmits>()

const isOpen = ref(props.modelValue)

watch(isOpen, (nexIsOpen) => {
    emits('update:modelValue', nexIsOpen); // Событие для обновления v-model в родителе
});

watch(() => props.modelValue, (nexIsOpen) => {
    isOpen.value = nexIsOpen
});

</script>
<template>
    <Drawer v-model:open="isOpen">
        <DrawerContent class="z-[9999]">
            <DrawerHeader>
                <DrawerTitle>Пользователи</DrawerTitle>
                <DrawerDescription>Список пользователей в комнате</DrawerDescription>
            </DrawerHeader>
            <div class="space-y-8 p-4">
                <div v-for="user in users" class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>{{ user.user.username[0] || '' }}</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                       <div class="flex items-center">
                         <p class="text-sm font-medium leading-none"> {{ user.user.username }} </p>
                         <div class="drawer-dot"></div>
                       </div>
                        <p class="text-sm" v-if="user.user.userId === admin">Администратор</p>
                        <p class="text-sm" v-else>Пользователь</p>
                    </div>
                    <div class="ml-auto font-medium" :class="{ 'text-green-600': user.status === 'online', 'text-red-600': user.status === 'offline' }"> {{  user.status }} </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
</template>
<style scoped lang="scss">
.drawer-dot {
  margin-left: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(252, 3, 3);
  transform: scale(1);
  box-shadow: 0 0 0 rgba(0, 0, 0, 1);
  animation: anim-vibrate 2s infinite;

  @keyframes anim-vibrate {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(252, 3, 3, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 0.3rem rgba(0, 0, 0, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
}
</style>

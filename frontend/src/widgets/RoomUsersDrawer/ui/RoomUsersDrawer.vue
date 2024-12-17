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
                         <div class="relative inline-flex ml-2">
                           <div class="w-2 h-2  rounded-full" :class="{ 'bg-green-600': user.status === 'online', 'bg-red-600': user.status === 'offline' }"></div>
                           <div class="w-2 h-2  rounded-full absolute top-0 left-0 animate-ping" :class="{ 'bg-green-600': user.status === 'online', 'bg-red-600': user.status === 'offline' }"></div>
                           <div class="w-2 h-2  rounded-full absolute top-0 left-0 animate-pulse" :class="{ 'bg-green-600': user.status === 'online', 'bg-red-600': user.status === 'offline' }"></div>
                         </div>
                       </div>
                    </div>
                    <div class="ml-auto font-medium" > <p class="inline-flex items-center justify-between space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-[4px] text-[8px]" v-if="user.user.userId === admin">Администратор</p>
                      <p class="inline-flex items-center justify-between space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-[4px] text-[8px]" v-else>Пользователь</p> </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
</template>

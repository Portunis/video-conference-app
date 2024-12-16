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
    users: TUser[]
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
                <DrawerDescription>Спислк пользователей в комнате</DrawerDescription>
            </DrawerHeader>
            <div class="space-y-8 p-4">
                <div v-for="user in users" class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>{{ user.user.username[0] || '' }}</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> {{ user.user.username }} </p>
                    </div>
                    <div class="ml-auto font-medium" :class="{ 'text-green-600': user.status === 'online', 'text-red-600': user.status === 'offline' }"> {{  user.status }} </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
</template>
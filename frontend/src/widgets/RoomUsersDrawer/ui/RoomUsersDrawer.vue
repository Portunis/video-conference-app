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
    username: string;
    RoomUsers: {
        status: EUserStatus
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
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Пользователи</DrawerTitle>
                <DrawerDescription>Спислк пользователей в комнате</DrawerDescription>
            </DrawerHeader>
            <div class="space-y-8">
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
                <div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div><div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div><div class="flex items-center">
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                        <AvatarFallback>q</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                        <p class="text-sm font-medium leading-none"> Olivia Martin </p>
                    </div>
                    <div class="ml-auto font-medium"> {{  }} </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
</template>
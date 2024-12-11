<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import axios from '@/shared/api/api'
import {ref} from "vue";
import {router} from "@/app/provides";

const emits = defineEmits(['successful'])

const nameRoom = ref('')
const roomId = ref('')
const isOpenCreateRoom = ref(false)
const isOpenConnectRoom = ref(false)

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/rooms/createRoom', {
      roomName: nameRoom.value,
    });
    console.log('Login successful', response.data);
    isOpenCreateRoom.value = false
    emits('successful')
  } catch (error) {
    console.error('Login error:', error);
  }
};
const handleRoomConnect = async () => {
 await router.push(`/room-page?id=${roomId.value}`)
  isOpenConnectRoom.value = false
};
</script>

<template>
<div class="add-new-room flex flex-col sm:grid grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
  <Dialog v-model:open="isOpenCreateRoom">
    <DialogTrigger as-child>
      <Button variant="outline">
        Добавить комнату
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-[300px] sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Создание комнаты</DialogTitle>
        <DialogDescription>
          Введите название комнаты
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Название
          </Label>
          <Input id="name"  v-model="nameRoom" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="handleSubmit">
          Добавить
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Dialog v-model:open="isOpenConnectRoom">
    <DialogTrigger as-child>
      <Button variant="outline">
        Присоединиться
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-[300px] sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Присоединиться к комнате</DialogTitle>
        <DialogDescription>
          Введите id комнаты
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Название
          </Label>
          <Input id="name"  v-model="roomId" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="handleRoomConnect">
          Добавить
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
</template>

<style scoped lang="scss">

</style>
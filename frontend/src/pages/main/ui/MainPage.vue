<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/shared/api/api';
import RoomConnect from "@/widgets/RoomConnect/ui/RoomConnect.vue";
import {LottieAnimation} from "lottie-web-vue";
import kasper from "@/shared/lottie/kasper.json"
import {AddNewRoom} from "@/widgets/AddNewRoom";
import { Button } from '@/shared/ui/button'
import { useRouter } from 'vue-router'
import {useToast} from "@/shared/ui/toast";
import {CopyDialog} from "@/widgets/CopyDialog";
const toast = useToast()

const route = useRouter()

const rooms = ref([]);
const user = ref({})
const fetchRooms = async () => {
  try {
    const response = await axios.get('/api/rooms');
    rooms.value = response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
  }
};
const getUser = async () => {
  try {
    const response = await axios.get('/api/users/get-user');
    user.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
const joinRoom = (roomId) => {
  if (!roomId) {
    toast({
      title: 'Ошибка',
      description: `На данный момент подключение не возможно, отсутсвует roomId`,
      type: 'warning',
    });
  }
  route.push({ path: 'room-page', query: { id: roomId } });
};

onMounted(() => {
  fetchRooms();
  getUser()
});

</script>

<template>
  <div class="main-page">
    Главная
    <div>
      <div class="max-w-4xl mx-auto mt-10">
        <h2 class="text-2xl font-semibold mb-4">Комнаты для созвона</h2>
        <AddNewRoom @successful="fetchRooms" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5" v-if="rooms.length">
          <div v-for="room in rooms" :key="room.roomId" class="bg-white shadow-md rounded-lg p-4">
            <h3 class="text-xl font-semibold text-black">{{ room.roomName }}</h3>
            <div class="main-page__room-element mt-5">
              <Button @click="joinRoom(room.roomId)"variant="outline">Войти</Button>
              <CopyDialog
                  label="Сыылка"
                  description="Скопируйте бибизяна"
                  :url="`${room.roomId}`"
              />
            </div>
          </div>
        </div>
        <div v-if="rooms.length === 0" class="mt-5">
          <p class="main-page__text">Тут так пусто...</p>
          <LottieAnimation
              class="main-page__not-found-animation"
          :animation-data="kasper"
          :loop="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "style.scss";
</style>
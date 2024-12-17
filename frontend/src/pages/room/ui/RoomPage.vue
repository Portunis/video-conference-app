<script setup lang="ts">
import {RoomConnect} from "@/widgets/RoomConnect";
import {useRoute} from 'vue-router'
import axios from "@/shared/api/api";
import {ref} from "vue";
import {IRoom} from "@/shared/typescripts/interfaces/room/IRoom.ts";
import {IUser} from "@/shared/typescripts/interfaces/user/IUser.ts";

const route = useRoute()
const queryParams = route.query;
const user = ref<IUser>({})
const room = ref<IRoom>({})
const rooms  = ref([])
const isUserRoom = ref(false)
const getUser = async () => {
  try {
    const response = await axios.get('/api/users/get-user');
    user.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
const getRoom = async () => {
  try {
    const response = await axios.get(`/api/rooms/${queryParams.id}`);
    room.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
const getRooms = async () => {
  try {
    const response = await axios.get(`/api/rooms`);
    rooms.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

const findByUserRoom = () => {
  const room = rooms.value.find((item) => item.roomId === queryParams.id);
  isUserRoom.value = !!room.Users.find((item) => item.userId === user.value.userId);
}

Promise.all([
  getRooms(),
  getRoom(),
  getUser(),
]).then(() => {
  findByUserRoom()
})

</script>

<template>
<div class="room-page">
  <RoomConnect :room-id="queryParams.id" :userId="user.userId" :userName="user.username" :admin="room.createdBy" :isUserRoom="isUserRoom" />
</div>
</template>

<style scoped lang="scss">
.room-page {
  height: calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top) - env(safe-area-inset-bottom));
}
</style>
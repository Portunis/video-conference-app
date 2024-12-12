<script setup lang="ts">
import {RoomConnect} from "@/widgets/RoomConnect";
import { useRoute } from 'vue-router'
import axios from "@/shared/api/api";
import {ref} from "vue";

const route = useRoute()
const queryParams = route.query;
const user = ref({})
const getUser = async () => {
  try {
    const response = await axios.get('/api/users/get-user');
    user.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
getUser();
</script>

<template>
<div class="room-page">
  <RoomConnect :room-id="queryParams.id" :userId="user.userId" :userName="user.username"/>
</div>
</template>

<style scoped lang="scss">
.room-page {
  height: 100%;
}
</style>
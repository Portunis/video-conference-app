<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import moment from 'moment'
import axios from "@/shared/api/api";
import { LottieAnimation } from "lottie-web-vue";
import kasper from "@/shared/lottie/kasper.json";
import { AddNewRoom } from "@/widgets/AddNewRoom";
import { useRouter } from "vue-router";
import { useToast } from "@/shared/ui/toast";
import { CopyDialog } from "@/widgets/CopyDialog";
import {Copy, MoveRight} from "lucide-vue-next";
import Avatar from "@/shared/ui/avatar/Avatar.vue";
import { AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
const toast = useToast();

const route = useRouter();

const rooms = ref([]);
const user = ref({});
const fetchRooms = async () => {
  try {
    const response = await axios.get("/api/rooms");
    rooms.value = response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};
const getUser = async () => {
  try {
    const response = await axios.get("/api/users/get-user");
    user.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
const joinRoom = (roomId) => {
  if (!roomId) {
    toast({
      title: "Ошибка",
      description: `На данный момент подключение не возможно, отсутсвует roomId`,
      type: "warning",
    });
    return;
  }
  route.push({ path: "room-page", query: { id: roomId } });
};

const onShareUrlRoom = async (roomId) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: roomId,
      })
    } catch (error) {
      console.error(error)
      await copyToClipboard(roomId)
    }
  } else {
    await copyToClipboard(roomId)
  }
}
const copyToClipboard = async (roomId) => {
  try {
    if (roomId) {
      await navigator.clipboard.writeText(roomId)
      toast({
        title: 'Успех',
        description: `Скопирован текст ${roomId}`
      })
    }
  } catch (err) {
    console.error('Ошибка при копировании: ', err)
    toast({
      title: 'Ошибка при копировании',
      description: `Вы пытались скопировать ${roomId}`,
      type: 'danger'
    })
  }
}
const computedRooms = computed(() => {
  return rooms.value?.reduce((accum, item) => {
    if (item?.createdBy === user.value?.userId) {
      accum.own.push(item)
    } else {
      accum.history.push(item)
    }
    return accum
  }, { own: [], history: [] })
})

onMounted(() => {
  fetchRooms();
  getUser();
});
</script>

<template>
  <div class="main-page">
    <div class="max-w-4xl mx-auto mt-10">
      <h2 class="text-2xl font-semibold mb-4">Комнаты для созвона</h2>
      <AddNewRoom @successful="fetchRooms" />
      <Tabs default-value="room" class="mt-5">
        <TabsList class="grid grid-cols-2">
          <TabsTrigger value="room"> Мои комнаты </TabsTrigger>
          <TabsTrigger value="room-old"> История </TabsTrigger>
        </TabsList>
        <TabsContent value="room">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
            v-if="computedRooms.own.length"
          >
            <TransitionGroup name="list" appear>
              <div
                v-for="room in computedRooms.own"
                :key="room.roomId"
                class="card-meeting bg-neutral-100 text-black dark:text-neutral-50 dark:white"
              >
                <div class="card-meeting__top">
                  <div
                    class="card-meeting__times text-black bg-white dark:text-neutral-50 dark:bg-neutral-800"
                  >
                    {{ moment(room.createdAt).format('DD.MM.YYYY HH:mm') }}
                  </div>
                  <div class="copy-button dark:bg-neutral-800" @click="onShareUrlRoom(room.roomId)">
                    <Copy class="w-4 h-4" />
                  </div>
                </div>
                <h3 class="card-meeting__title text-black dark:text-black">
                  {{ room.roomName }}
                </h3>
                <!-- <p
                  class="card-meeting__description text-neutral-50 dark:text-black"
                >
                  Описание комнаты
                </p> -->
                <div class="card-meeting__footer">
                  <div class="card-meeting__people">
                    <Avatar
                      class="card-meeting__people-avatar h-8 w-8"
                      v-for="user in room.Users.slice(0,4)"
                    >
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>{{ user.username[0] || '' }}</AvatarFallback>
                    </Avatar>
                    <Avatar v-if="(room.Users.length - 4) > 0" class="card-meeting__people-avatar h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>+ {{ room.Users.length - 4 }}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div
                    class="card-meeting__button bg-white dark:bg-black"
                    @click="joinRoom(room.roomId)"
                  >
                    <p
                      class="card-meeting__button-name text-black dark:text-white"
                    >
                      Войти
                    </p>
                    <div class="card-meeting__button-icon">
                      <MoveRight class="text-black dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div  v-if="computedRooms.own.length === 0">
            <p class="main-page__text">Тут так пусто...</p>
            <LottieAnimation
                class="main-page__not-found-animation"
                :animation-data="kasper"
                :loop="true"
            />
          </div>
        </TabsContent>
        <TabsContent value="room-old">
          <!-- TODO: Унифицировать карточку -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
            v-if="computedRooms.history.length"
          >
            <TransitionGroup name="list" appear>
              <div
                v-for="room in computedRooms.history"
                :key="room.roomId"
                class="card-meeting bg-neutral-100 text-black dark:text-neutral-50 dark:white"
              >
                <div class="card-meeting__top">
                  <div
                    class="card-meeting__times text-black bg-neutral-100 dark:text-neutral-50 dark:bg-neutral-800"
                  >
                    {{ moment(room.createdAt).format('DD.MM.YYYY HH:mm') }}
                  </div>
                  <div class="copy-button dark:bg-neutral-800" @click="onShareUrlRoom(room.roomId)">
                    <Copy class="w-4 h-4" />
                  </div>
                </div>
                <h3 class="card-meeting__title text-black dark:text-black">
                  {{ room.roomName }}
                </h3>
                <!-- <p
                  class="card-meeting__description text-neutral-50 dark:text-black"
                >
                  Описание комнаты
                </p> -->
                <div class="card-meeting__footer">
                  <div class="card-meeting__people">
                    <Avatar
                      class="card-meeting__people-avatar h-8 w-8"
                      v-for="user in room.Users.slice(0,4)"
                    >
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>{{ user.username[0] || '' }}</AvatarFallback>
                    </Avatar>
                    <Avatar v-if="(room.Users.length - 4) > 0" class="card-meeting__people-avatar h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>+ {{ room.Users.length - 4 }}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div
                    class="card-meeting__button bg-white dark:bg-black"
                    @click="joinRoom(room.roomId)"
                  >
                    <p
                      class="card-meeting__button-name text-black dark:text-white"
                    >
                      Войти
                    </p>
                    <div class="card-meeting__button-icon">
                      <MoveRight class="text-black dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div  v-if="computedRooms.history.length === 0">
            <p class="main-page__text">Тут так пусто...</p>
            <LottieAnimation
                class="main-page__not-found-animation"
                :animation-data="kasper"
                :loop="true"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "style.scss";

.card-meeting {
  width: 100%;
  height: auto;
  border-radius: 30px;
  padding: 16px 13px;
  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  &__times {
    border-radius: 30px;
    padding: 5px 20px;
    display: inline-block;
    font-size: 12px;
  }
  &__title {
    font-family: "Chakra Petch", sans-serif;
    margin-top: 10px;
    font-size: 20px;
    
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
  &__button {
    border-radius: 30px;
    padding: 9px 33px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  &__people {
    display: inline-flex;
    flex-direction: row;
    margin-left: 15px;
  }
  &__people-avatar {
    border: 1px solid #fff;
    overflow: hidden;

    margin-left: -15px;
  }
  &__button-name {
    margin-right: 30px;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 27px;
  }
  @media screen and (min-width: 1024px) {
    &__button {
      padding: 9px 15px;
    }
  }
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}
.copy-button {
  border-radius: 50px;
  padding: 15px;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/shared/api/api";
import { LottieAnimation } from "lottie-web-vue";
import kasper from "@/shared/lottie/kasper.json";
import { AddNewRoom } from "@/widgets/AddNewRoom";
import { useRouter } from "vue-router";
import { useToast } from "@/shared/ui/toast";
import { CopyDialog } from "@/widgets/CopyDialog";
import { MoveRight } from "lucide-vue-next";
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
        <TabsList class="grid grid-cols-3">
          <TabsTrigger value="room"> В процессе </TabsTrigger>
          <TabsTrigger value="room-old"> Ожидают </TabsTrigger>
          <TabsTrigger value="cancel"> Закончено </TabsTrigger>
        </TabsList>
        <TabsContent value="room">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
            v-if="rooms.length"
          >
            <TransitionGroup name="list" appear>
              <div
                v-for="room in rooms"
                :key="room.roomId"
                class="card-meeting bg-neutral-100 dark:text-neutral-50 dark:white"
              >
                <div class="card-meeting__top">
                  <div
                    class="card-meeting__times bg-neutral-100 dark:text-neutral-50 dark:bg-neutral-800"
                  >
                    13.10.2024 00:07
                  </div>
                  <CopyDialog
                    label="Ссылка"
                    description="Скопируйте код комнаты"
                    :url="`${room.roomId}`"
                  />
                </div>
                <h3 class="card-meeting__title text-neutral-50 dark:text-black">
                  {{ room.roomName }}
                </h3>
                <p
                  class="card-meeting__description text-neutral-50 dark:text-black"
                >
                  Описание комнаты
                </p>
                <div class="card-meeting__footer">
                  <div class="card-meeting__people">
                    <Avatar
                      class="card-meeting__people-avatar h-8 w-8"
                      v-for="n in 4"
                    >
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <Avatar class="card-meeting__people-avatar h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>+6</AvatarFallback>
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
                      <MoveRight color="#fff" />
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div  v-if="rooms.length === 0">
            <p class="main-page__text">Тут так пусто...</p>
            <LottieAnimation
                class="main-page__not-found-animation"
                :animation-data="kasper"
                :loop="true"
            />
          </div>
        </TabsContent>
        <TabsContent value="room-old">
          <p class="main-page__text">Тут так пусто...</p>
          <LottieAnimation
            class="main-page__not-found-animation"
            :animation-data="kasper"
            :loop="true"
          />
        </TabsContent>
        <TabsContent value="cancel">
          <p class="main-page__text">Тут так пусто...</p>
          <LottieAnimation
            class="main-page__not-found-animation"
            :animation-data="kasper"
            :loop="true"
          />
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
</style>

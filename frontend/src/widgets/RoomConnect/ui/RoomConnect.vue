<template>
  <div class="room">
    <div class="room__header" v-if="inCall">
      <div class="room__header-controls" v-if="isOneRemoteUser">
        <div class="room__header-control">
          <ChevronLeft @click="leaveCall" :width="12" :height="12" />
        </div>
        <p class="room__header-user" v-for="(stream, userId) in remoteStreams">
          {{ stream.name }}
        </p>
      </div>
      <div class="room__header-controls">
        <div class="room__header-control">
          <SwitchCamera :width="12" :height="12" />
        </div>
      </div>
    </div>
    <!--    <h1>Видеозвонок в комнате: {{ roomId }}</h1>-->
    <!--    Количество участников {{Object.values(remoteStreams).length + 1}}-->
    <div class="room__content" v-if="!inCall">
      <LottieAnimation
        class="room__content-loader"
        :animation-data="LoaderVideo"
        :loop="true"
      />
      <Button v-if="!isNotApprove" class="mt-5" @click="requestAcceptToRoom">Присоединиться к звонку</Button>
    </div>
    <div v-show="inCall" class="video local-video">
      <div
        v-if="!localStream?.getVideoTracks()?.[0]?.enabled"
        class="video__poster"
        :style="{ backgroundColor: localColor }"
      >
        <Avatar class="video__poster-avatar h-14 w-14">
          <AvatarFallback>{{ userName?.[0]?.toUpperCase() || '' }}</AvatarFallback>
        </Avatar>
      </div>
      <video :srcObject="localStream" autoplay muted playsinline></video>
    </div>
    <div
      class="video-container"
      :class="{ 'video-container--many-remote': !isOneRemoteUser }"
      v-show="inCall"
    >
      <div
        v-for="(stream, userId) in remoteStreams"
        :key="userId"
        class="video video--remote"
        :class="{ 'remote-video-one': isOneRemoteUser }"
      >
        <span class="video__label" v-if="!isOneRemoteUser">{{
          stream.name
        }}</span>
        <div
          v-if="!stream.isVideoEnabled"
          class="video__poster"
          :style="{ backgroundColor: localColor }"
        >
          <Avatar class="video__poster-avatar h-14 w-14">
            <AvatarFallback>{{ stream.name?.[0]?.toUpperCase() || '' }}</AvatarFallback>
          </Avatar>
        </div>
        <video
          :id="'video-' + userId"
          autoplay
          playsinline
          :style="{ backgroundColor: stream.color }"
          :srcObject="stream.stream"
        />

        <!--        <div v-if="inCall" class="controls-video-remote">-->
        <!--          <div @click="toggleRemoteAudio(userId)">-->
        <!--            <MicOff v-if="remoteAudioMuted[userId]" class="icon" />-->
        <!--            <Mic v-if="!remoteAudioMuted[userId]" class="icon" />-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>

    <div v-if="inCall" class="controls-video">
      <div class="controls-video__header">
        <div @click="toggleLocalVideo" class="icon">
          <Video v-if="!isLocalVideoMuted" color="#fff" />
          <VideoOff v-if="isLocalVideoMuted" color="#fff" />
        </div>
        <div @click="toggleLocalAudio" class="icon">
          <MicOff v-if="isLocalAudioMuted" color="#fff" />
          <Mic v-if="!isLocalAudioMuted" color="#fff" />
        </div>
        <div class="icon">
          <MessageCircle color="#fff" />
        </div>
        <div class="icon" @click="toggleDrawer">
          <UserRoundSearch color="#fff"/>
        </div>
        <div @click="leaveCall" class="icon icon--red">
          <X color="#fff" />
        </div>
      </div>
    </div>
    <RoomUsersDrawer v-model="isRoomUsersOpen" :users="roomUsers" :admin="admin"/>
  </div>
</template>

<script setup lang="ts">
import {computed, defineComponent, h, markRaw, onMounted, onUnmounted, ref } from "vue";
import { io } from "socket.io-client";
import { Button } from "@/shared/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  MessageCircle,
  SwitchCamera,
  ChevronLeft,
  UserRoundSearch
} from "lucide-vue-next";
import { LottieAnimation } from "lottie-web-vue";
import LoaderVideo from "@/shared/lottie/loader-video.json";
import { router } from "@/app/provides";
import { RoomUsersDrawer } from "@/widgets/RoomUsersDrawer";
import {NotificationAccept} from "@/shared/ui/notificationAccept";
import { Notification } from "@/shared/ui/notification";
import {toast} from "vue-sonner";
import Avatar from "@/shared/ui/avatar/Avatar.vue";
import AvatarFallback from "@/shared/ui/avatar/AvatarFallback.vue";

const getRandomBrightColorHex = () => {
  const r = Math.floor(Math.random() * 156) + 100; // Красный: от 100 до 255
  const g = Math.floor(Math.random() * 156) + 100; // Зелёный: от 100 до 255
  const b = Math.floor(Math.random() * 156) + 100; // Синий: от 100 до 255

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const props = defineProps({
  roomId: String,
  userId: String,
  userName: String,
  admin: String,
  isUserRoom: Boolean,
});

const roomUsers = ref([]);
let socket = null;
let localStream = ref<MediaStream | null>(null);
let peerConnections = {};
let remoteStreams = ref({});
let remoteAudioMuted = ref({});
const isNotApprove = ref(false)
const localColor = ref<string>(getRandomBrightColorHex())

const isRoomUsersOpen = ref(false)
const inCall = ref(false);
const isLocalVideoMuted = ref(false);
const isLocalAudioMuted = ref(false);

const isOneRemoteUser = computed(() => {
  const remote = Object.values(remoteStreams.value).length;
  return remote === 1;
});

const isAdmin = computed(() => {
  return props.userId === props.admin
})

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.redramka.ru:13478" },
    { urls: "stun:stun.redramka.ru:15349" },
  ],
};

const toggleDrawer = () => {
  isRoomUsersOpen.value = !isRoomUsersOpen.value
}

const errorHandler = (error) => {
  console.log("werbrtc error", error);
};

const startLocalStream = async () => {
  localStream.value = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
};

const onMessageRecieve = (data) => {
  console.log("revieve", data);
  const peerUuid = data.uuid;

  // Ignore messages that are not for us or from ourselves
  if (
    peerUuid == props.userId ||
    (data.dest != props.userId && data.dest != "all")
  ) {
    console.log("Сообщение от меня, не для меня");
    return;
  }

  if (data.displayName && data.dest == "all") {
    console.log("Подключился ", data.displayName);
    // set up peer connection object for a newcomer peer

    setUpPeer(peerUuid, data.userName);
    socket.emit("webrtcSend", {
      displayName: props.userName,
      uuid: props.userId,
      dest: peerUuid,
      roomId: props.roomId,
      userName: props.userName,
    });
  } else if (data.displayName && data.dest == props.userId) {
    // initiate call if we are the newcomer peer

    console.log("Я подключился и начинаю обмен");
    setUpPeer(peerUuid, data.displayName, true);
  } else if (data.sdp) {
    console.log("Получил sdp");
    peerConnections[peerUuid].pc
      .setRemoteDescription(new RTCSessionDescription(data.sdp))
      .then(function () {
        // Only create answers in response to offers
        if (data.sdp.type == "offer") {
          peerConnections[peerUuid].pc
            .createAnswer()
            .then((description) => createdDescription(description, peerUuid))
            .catch(errorHandler);
        }
      })
      .catch(errorHandler);
  } else if (data.ice) {
    peerConnections[peerUuid].pc
      .addIceCandidate(new RTCIceCandidate(data.ice))
      .catch(errorHandler);
  }
};

const setUpPeer = (peerUuid, displayName, initCall = false) => {
  peerConnections[peerUuid] = {
    displayName: displayName,
    pc: new RTCPeerConnection(peerConnectionConfig),
  };
  peerConnections[peerUuid].pc.onicecandidate = (event) =>
    gotIceCandidate(event, peerUuid);
  peerConnections[peerUuid].pc.ontrack = (event) => {
    console.log('event', event)
    gotRemoteStream(event, peerUuid, displayName)
  };
  peerConnections[peerUuid].pc.oniceconnectionstatechange = (event) =>
    checkPeerDisconnect(event, peerUuid);
  localStream.value?.getTracks()
    .forEach((track) =>
      peerConnections[peerUuid].pc.addTrack(track, localStream.value),
    );

  if (initCall) {
    peerConnections[peerUuid].pc
      .createOffer()
      .then((description) => createdDescription(description, peerUuid))
      .catch(errorHandler);
  }
};

const gotIceCandidate = (event, peerUuid) => {
  if (event.candidate != null) {
    socket.emit("webrtcSend", {
      ice: event.candidate,
      uuid: props.userId,
      dest: peerUuid,
      roomId: props.roomId,
      userName: props.userName,
    });
  }
};

const createdDescription = (description, peerUuid) => {
  console.log(`got description, peer ${peerUuid}`);
  peerConnections[peerUuid].pc
    .setLocalDescription(description)
    .then(() => {
      socket.emit("webrtcSend", {
        sdp: peerConnections[peerUuid].pc.localDescription,
        uuid: props.userId,
        dest: peerUuid,
        roomId: props.roomId,
        userName: props.userName,
      });
    })
    .catch(errorHandler);
};

const gotRemoteStream = (event, peerUuid, userName) => {
  console.log(`got remote stream, peer ${peerUuid}`);
  if (!remoteStreams.value[peerUuid]) {
    remoteStreams.value[peerUuid] = {};
  }
  remoteStreams.value[peerUuid].stream = event.streams[0];
  remoteStreams.value[peerUuid].name = userName;
  remoteStreams.value[peerUuid].color = getRandomBrightColorHex();


  if (remoteStreams.value[peerUuid].videoInterval) {
    clearInterval(remoteStreams.value[peerUuid].videoInterval)
  }

  // todo
  remoteStreams.value[peerUuid].videoInterval = setInterval(() => {
    remoteStreams.value[peerUuid].isVideoEnabled = (remoteStreams.value[peerUuid].stream as MediaStream).getVideoTracks()[0].enabled
    console.log('(remoteStreams.value[peerUuid].stream as MediaStream).getVideoTracks()[0].enabled', (remoteStreams.value[peerUuid].stream as MediaStream).getTracks())
  }, 500)

  remoteAudioMuted.value[peerUuid] = true; // Изначально аудио не отключено
};

const checkPeerDisconnect = (event, peerUuid) => {
  const state = peerConnections[peerUuid].pc.iceConnectionState;
  console.log(`connection with peer ${peerUuid} ${state}`);
  if (state === "failed" || state === "closed" || state === "disconnected") {
    delete peerConnections[peerUuid];
  }
};

const start = async () => {
  // Когда участник покидает комнату
  socket.on("userLeft", ({ userId }) => {
    if (peerConnections[userId]) {
      peerConnections[userId]?.pc?.close?.();
      delete peerConnections[userId];
    }
    delete remoteStreams.value[userId];
    delete remoteAudioMuted.value[userId];
    isNotApprove.value = false
  });
  inCall.value = true;
  socket.on("webrtcRecieve", onMessageRecieve);
  socket.emit("webrtcSend", {
    displayName: props.userId,
    uuid: props.userId,
    dest: "all",
    roomId: props.roomId,
    userName: props.userName,
  });
};

const leaveCall = () => {
  Object.values(peerConnections).forEach((pc) => pc.pc.close());
  peerConnections = {};
  localStream.value?.getTracks().forEach((track) => track.stop());
  socket.emit("leaveRoom", { roomId: props.roomId, userId: props.userId });
  inCall.value = false;
  router.push("/");
};

const onGetUsers = ({ users }) => {
  roomUsers.value = users
}

const requestAcceptToRoom = () => {
  if (!props.isUserRoom && !isAdmin.value ) {
    socket.emit("joinRoom2", {
      roomId: props.roomId,
      userId: props.userId,
      userName: props.userName,
      isUserRoom: props.isUserRoom,
      isAdmin: isAdmin.value
    });
    isNotApprove.value = true
    notificationAlert('Приглашение отправлено', `Комната № ${props.roomId}`)
    return
  }
  joinCall()
}

const joinCall = async () => {
  await startLocalStream().then(() => {
    socket.on('users', onGetUsers)

    socket.emit("joinRoom2", {
      roomId: props.roomId,
      userId: props.userId,
      userName: props.userName,
      isUserRoom: true,
      isAdmin: isAdmin.value
    });

    setTimeout(() => {
      start();
    }, 2000);
  }).catch(() => {
    notificationAlert('Ошибка подключения', 'У вас отсутствует камера. На данный момент мы не можем Вас подключить')
  })
};

const toggleLocalVideo = () => {
  isLocalVideoMuted.value = !isLocalVideoMuted.value;
  const videoTrack = localStream.value?.getTracks()
    .find((track) => track.kind === "video");
  if (videoTrack) {
    videoTrack.enabled = !isLocalVideoMuted.value;
  }
};

const toggleLocalAudio = () => {
  isLocalAudioMuted.value = !isLocalAudioMuted.value;
  const audioTrack = localStream.value?.getTracks()
    .find((track) => track.kind === "audio");
  if (audioTrack) {
    audioTrack.enabled = !isLocalAudioMuted.value;
  }
};

const toggleRemoteAudio = (userId) => {
  const stream = remoteStreams.value[userId]?.stream;
  if (stream) {
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      remoteAudioMuted.value[userId] = !remoteAudioMuted.value[userId];
      audioTrack.enabled = !remoteAudioMuted.value[userId];
    }
  }
};



const openToast = (userName, userId) => {
  toast(
      markRaw(
          defineComponent({
            setup() {
              const isLoader = ref(false);

              const onCloseToast = () => {
                toast.dismiss(userId)
              };

              const onAcceptToast = () => {
                isLoader.value = true;
                socket.emit("approveJoin", {  roomId: props.roomId, userId: userId,  userName, })

                  setTimeout(() => {
                    isLoader.value = false;
                    toast.dismiss(userId)

                  }, 2000);

              };

              return () =>
                  h(NotificationAccept, {
                    title: `Запрос от ${userName}`,
                    description: "Хотите разрешить вход?",
                    isLoader: isLoader,
                    onClose: onCloseToast,
                    onAccept: onAcceptToast,
                  });
            },
          })
      ),
      {
        id: userId,
        duration: Infinity,
        unstyled: true,
      }
  );
};

const notificationAlert = (title: string, description: string, type: string) => {
  toast(
      markRaw(
          defineComponent({
            setup() {
              return () =>
                  h(Notification, {
                    title: title,
                    description: description,
                    type: type
                  });
            },
          })
      ),
      {
        duration: 5000,
        unstyled: true,
      }
  );
}


onMounted(() => {
  const socketURL = import.meta.env.VITE_API_SOCKET_URL;
  socket = io(socketURL);

  socket.on("requestJoin", ({ userId, userName }) => {
    console.log('Запрос на подключение к комнате от:', userName)
    openToast(userName, userId);
  });

  socket.on("joinApproved", ({ roomId }) => {
    if (roomId === props.roomId) {
      console.log('Комнаты совпали')
      notificationAlert('Приглашение принято', `Комната № ${roomId}`)
      joinCall()
    }
  });
});
onUnmounted(() => {
  socket.disconnect()
});
</script>

<style scoped lang="scss">
@import "style";
</style>

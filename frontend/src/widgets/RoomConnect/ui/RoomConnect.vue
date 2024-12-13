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
      <Button class="mt-5" @click="joinCall">Присоединиться к звонку</Button>
    </div>
    <div v-show="inCall" class="video local-video">
      <video ref="localVideo" autoplay muted playsinline></video>
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
        <video
          :id="'video-' + userId"
          autoplay
          playsinline
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
    <RoomUsersDrawer v-model="isRoomUsersOpen"/>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { io } from "socket.io-client";
import { Button } from "@/shared/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  MessageCircle,
  Settings,
  SwitchCamera,
  ChevronLeft,
  UserRoundSearch
} from "lucide-vue-next";
import { LottieAnimation } from "lottie-web-vue";
import LoaderVideo from "@/shared/lottie/loader-video.json";
import { router } from "@/app/provides";
import { RoomUsersDrawer } from "@/widgets/RoomUsersDrawer";

async function checkPermissions() {
  const status = await Permissions.query({ name: "camera" });
  if (status.state !== "granted") {
    await Permissions.request({ name: "camera" });
  }
}
const props = defineProps({
  roomId: String,
  userId: String,
  userName: String,
});

const localVideo = ref(null);
let socket = null;
let localStream = null;
let peerConnections = {};
let remoteStreams = ref({});
let remoteAudioMuted = ref({});

const isRoomUsersOpen = ref(false)
const inCall = ref(false);
const isLocalVideoMuted = ref(false);
const isLocalAudioMuted = ref(false);

const isOneRemoteUser = computed(() => {
  const remote = Object.values(remoteStreams.value).length;
  return remote === 1;
});

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
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  localVideo.value.srcObject = localStream;
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
  peerConnections[peerUuid].pc.ontrack = (event) =>
    gotRemoteStream(event, peerUuid, displayName);
  peerConnections[peerUuid].pc.oniceconnectionstatechange = (event) =>
    checkPeerDisconnect(event, peerUuid);
  localStream
    .getTracks()
    .forEach((track) =>
      peerConnections[peerUuid].pc.addTrack(track, localStream),
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
  localStream?.getTracks().forEach((track) => track.stop());
  socket.emit("leaveRoom", { roomId: props.roomId, userId: props.userId });
  inCall.value = false;
  router.push("/");
};

const joinCall = async () => {
  await startLocalStream();

  // Отправляем запрос на присоединение к комнате
  socket.emit("joinRoom2", {
    roomId: props.roomId,
    userId: props.userId,
    userName: props.userName,
  });

  setTimeout(() => {
    start();
  }, 2000);
};

const toggleLocalVideo = () => {
  isLocalVideoMuted.value = !isLocalVideoMuted.value;
  const videoTrack = localStream
    .getTracks()
    .find((track) => track.kind === "video");
  if (videoTrack) {
    videoTrack.enabled = !isLocalVideoMuted.value;
  }
};

const toggleLocalAudio = () => {
  isLocalAudioMuted.value = !isLocalAudioMuted.value;
  const audioTrack = localStream
    .getTracks()
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

onMounted(() => {
  // socket = io("https://portunis.pw");
  socket = io("http://localhost:3001");
});
onUnmounted(() => {
  socket.disconnect()
});
</script>

<style scoped lang="scss">
@import "style";
</style>

<template>
  <nuxt-link
    :to="`/${boardId}/chat/${room.id}/`"
    class="flex items-center p-2 rounded"
    :class="{
      'hover:bg-gray-100': $route.params.roomId !== room.id,
      'relative z-10 shadow-md': $route.params.roomId === room.id,
    }"
  >
    <!-- Avatar -->
    <div class="rounded bg-gray-200 w-9 h-9 mr-3 flex-shrink-0 overflow-hidden">
      <img
        v-show="participants[0].identicon"
        :src="participants[0].identiconSrc"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Thread & Author ID -->
    <div class="flex-grow flex flex-col space-y-1">
      <div
        class="text-sm font-display font-bold text-gray-700"
        style="line-height: 14px"
      >
        /{{ room.boardId }}/{{ room.threadId }}
      </div>
      <div class="inline-flex space-x-0.5">
        <badge
          v-for="participant of participants"
          :key="participant.authorId"
          :color="rgbColor(participant.identicon)"
          >{{ participant.authorId.slice(-6) }}</badge
        >
      </div>
    </div>
    <unread-chat-count v-if="room.unread" :count="room.unread" />
    <div
      class="h-2 w-2 rounded-full ml-2"
      :class="room.online ? 'bg-green-400' : 'bg-gray-300'"
    ></div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      required: true,
    },
  },
  data() {
    const boardId = this.$route.params.boardId;
    return { boardId };
  },
  computed: {
    participants() {
      return this.room.participants.filter(
        (p) => p.authorId !== this.room.myAuthorId
      );
    },
  },
  methods: {
    rgbColor(identicon) {
      const [r, g, b] = identicon?.foreground || [0, 0, 0];
      return [r, g, b].some(isNaN) ? `rgb(0,0,0)` : `rgb(${r},${g},${b})`;
    },
  },
};
</script>

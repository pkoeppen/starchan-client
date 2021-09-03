<template>
  <div class="w-2/3 relative">
    <chat-reply-box :room-id="roomId" />
    <div class="absolute inset-0">
      <simplebar ref="simplebar" class="h-full">
        <div
          class="
            overflow-x-hidden
            p-12
            pb-28
            flex flex-col
            justify-center
            items-center
          "
        >
          <div v-if="loading" class="text-gray-300">
            <i class="fas fa-asterisk animate-spin" />
          </div>
          <div
            v-else-if="!messages || !messages.length"
            class="font-display text-gray-300"
          >
            No messages to display.
          </div>

          <div v-else class="flex flex-col w-full">
            <div
              v-for="message of messages"
              :key="message.id"
              class="flex items-center"
              :class="message.from ? 'from-other' : 'from-self'"
            >
              <div class="max-w-2/3 rounded p-3 message-content">
                {{ message.content }}
              </div>
              <div
                class="text-xs text-gray-300 font-display flex-grow"
                :class="message.from ? 'text-right' : 'text-left'"
              >
                {{ formatTime(message.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </simplebar>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
export default {
  data() {
    const boardId = this.$route.params.boardId;
    return {
      loading: true,
      messages: [],
      boardId,
    };
  },
  computed: {
    roomId() {
      return this.$route.params.roomId;
    },
  },
  mounted() {
    this.$socket.on('message', this.messageListener);
    this.$socket.on('messages', this.messagesListener);
    this.$socket.emit('messages', this.roomId);
  },
  beforeDestroy() {
    this.$socket.off('message', this.messageListener);
    this.$socket.off('messages', this.messagesListener);
  },
  methods: {
    messageListener(message) {
      if (message.roomId === this.roomId) {
        this.messages.push(message);
        this.scrollBottom();
      }
    },
    messagesListener(messages) {
      this.loading = false;
      this.messages = messages;
      this.scrollBottom();
    },
    formatTime(time) {
      return format(new Date(time), 'p');
    },
    scrollBottom() {
      const element = this.$refs.simplebar.$refs.scrollElement;
      setTimeout(() => (element.scrollTop = element.scrollHeight), 0);
    },
  },
};
</script>
<style scoped>
.from-self .message-content {
  @apply bg-blue-100 order-last;
}

.from-other .message-content {
  @apply bg-gray-100 order-first;
}

.from-self + .from-self,
.from-other + .from-other {
  @apply mt-1;
}

.from-self + .from-other,
.from-other + .from-self {
  @apply mt-3;
}
</style>

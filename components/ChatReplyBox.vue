<template>
  <div class="absolute bottom-6 right-6 left-6 pointer-events-none z-20">
    <form
      class="
        w-full
        max-w-3xl
        min-w-min
        bg-white
        border-2 border-gray-300
        shadow-lg
        rounded
        mx-auto
        pointer-events-auto
        p-3
      "
      @submit.prevent="send()"
    >
      <div class="flex space-x-2">
        <input
          ref="chatInput"
          v-model="content"
          type="text"
          class="flex-grow shadow-inner rounded px-2 py-1"
          placeholder="Type your message..."
        />
        <small-button
          type="submit"
          :disabled="!canSubmit"
          icon="fas fa-paper-plane"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    canSubmit() {
      return !!this.content.trim();
    },
  },
  methods: {
    send() {
      this.$socket.emit('message', {
        roomId: this.roomId,
        content: this.content,
      });
      this.content = '';
      this.$refs.chatInput.focus();
    },
  },
};
</script>

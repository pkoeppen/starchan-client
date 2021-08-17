<template>
  <div class="w-2/3 relative">
    <div class="absolute inset-0">
      <simplebar class="h-full">
        <div
          class="
            overflow-x-hidden
            p-12
            flex flex-col
            justify-center
            items-center
          "
        >
          <div v-if="!room.messages" class="font-display text-gray-300">
            No messages to display.
          </div>

          <div class="flex flex-col space-y-2 w-full">
            <div
              v-for="message of room.messages"
              :key="message.id"
              :class="
                message.authorId
                  ? 'bg-gray-100 self-start'
                  : 'bg-blue-100 self-end'
              "
              class="max-w-2/3 rounded p-3"
            >
              {{ message.content }}
            </div>
          </div>
        </div>
      </simplebar>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto';
export default {
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      room: {},
      boardId: this.$route.params.boardId,
    };
  },
  fetch() {
    const room = {
      id: crypto.randomBytes(3).toString('hex'),
      boardId: this.boardId,
      threadId: Math.round(Math.random() * 999999999),
      participants: [
        {
          authorId: crypto.randomBytes(16).toString('hex'),
          tripcode: null,
        },
      ],
      unseenMessages: 0,
      usersOnline: true,
      messages: [
        {
          id: crypto.randomBytes(16).toString('hex'),
          createdAt: new Date(),
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          authorId: crypto.randomBytes(16).toString('hex'),
        },
        {
          id: crypto.randomBytes(16).toString('hex'),
          createdAt: new Date(),
          content:
            'Labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          authorId: crypto.randomBytes(16).toString('hex'),
        },
        {
          id: crypto.randomBytes(16).toString('hex'),
          createdAt: new Date(),
          content: 'u wot m8?',
          authorId: null,
        },
      ],
    };
    this.data.room = room;
  },
};
</script>

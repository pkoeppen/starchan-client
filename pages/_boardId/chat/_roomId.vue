<template>
  <no-ssr>
    <div class="h-full flex">
      <!-- Chat List -->
      <chat-room-list :board-id="boardId" />

      <!-- Chat -->
      <chat-messages :room-id="roomId" />
    </div>
  </no-ssr>
</template>

<script>
import crypto from 'crypto';
export default {
  layout: 'board',
  data() {
    const boardId = this.$route.params.boardId;
    const roomId = this.$route.params.roomId;
    return {
      boardId,
      roomId,
      room: {
        id: crypto.randomBytes(3).toString('hex'),
        boardId,
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
        ],
      },
    };
  },
  computed: {
    roomsOnThisBoard() {
      return this.rooms
        .filter((room) => room.boardId === this.boardId)
        .map((room) => {
          for (const participant of room.participants) {
            participant.identicon = this.$identicon(participant.authorId);
            participant.identiconSrc = `data:image/svg+xml;base64,${participant.identicon?.toString()}`;
          }
          return room;
        });
    },
    roomsOnOtherBoards() {
      return this.rooms
        .filter((room) => room.boardId !== this.boardId)
        .map((room) => {
          for (const participant of room.participants) {
            participant.identicon = this.$identicon(participant.authorId);
            participant.identiconSrc = `data:image/svg+xml;base64,${participant.identicon?.toString()}`;
          }
          return room;
        });
    },
  },
  methods: {
    rgbColor(identicon) {
      const [r, g, b] = identicon?.foreground || [33, 33, 33];
      return `rgb(${r},${g},${b})`;
    },
  },
};
</script>

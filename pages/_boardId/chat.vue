<template>
  <no-ssr>
    <div class="h-full flex">
      <div class="w-1/3 relative border-r">
        <div class="absolute inset-0">
          <simplebar class="h-full">
            <div class="overflow-x-hidden pt-12 pb-5 px-5 flex flex-col">
              <div
                class="space-y-1 w-full"
                :class="{ '-mt-2': !noRoomsToDisplay }"
              >
                <!-- Loading -->
                <div v-if="loading" class="text-gray-300 text-center">
                  <i class="fas fa-asterisk animate-spin" />
                </div>

                <!-- No Conversations -->
                <div
                  v-else-if="noRoomsToDisplay"
                  class="font-display text-gray-300 text-center"
                >
                  No conversations to display.
                </div>

                <template v-else>
                  <!-- Rooms On This Board -->
                  <chat-room-list-item
                    v-for="room of roomsOnThisBoard"
                    :key="room.id"
                    :room="room"
                  />

                  <!-- Rooms On Other Boards -->
                  <div
                    v-if="roomsOnOtherBoards.length"
                    class="
                      font-bold font-display
                      uppercase
                      tracking-wider
                      text-center text-sm text-gray-300
                      py-2
                    "
                  >
                    From Other Boards
                  </div>

                  <chat-room-list-item
                    v-for="room of roomsOnOtherBoards"
                    :key="room.id"
                    :room="room"
                  />
                </template>
              </div>
            </div>
          </simplebar>
        </div>
      </div>

      <NuxtChild v-if="$route.params.roomId" :key="$route.path" />
      <div v-else class="w-2/3 relative">
        <div class="absolute inset-0 p-12 text-center">
          <div class="font-display text-gray-300">
            Select a conversation to view messages.
          </div>
        </div>
      </div>
    </div>
  </no-ssr>
</template>

<script>
export default {
  layout: 'board',
  data() {
    return {
      loading: true,
      boardId: this.$route.params.boardId,
      rooms: [],
    };
  },
  computed: {
    roomsOnThisBoard() {
      return this.roomList.filter((room) => room.boardId === this.boardId);
    },
    roomsOnOtherBoards() {
      return this.roomList.filter((room) => room.boardId !== this.boardId);
    },
    noRoomsToDisplay() {
      return !this.roomsOnThisBoard.length && !this.roomsOnOtherBoards.length;
    },
    roomList() {
      return this.rooms.map((room) => {
        for (const participant of room.participants) {
          participant.identicon = this.$identicon(participant.authorId);
          participant.identiconSrc = `data:image/svg+xml;base64,${participant.identicon?.toString()}`;
        }
        room.online = room.participants.some(
          ({ authorId, online }) => authorId !== room.myAuthorId && online
        );
        return room;
      });
    },
  },
  mounted() {
    this.$socket.on('rooms', this.roomsListener);
    this.$socket.on('reset unread', this.resetUnreadListener);
    this.$socket.on('incr unread', this.incrUnreadListener);
    this.$socket.on('user connected', this.userConnectedListener);
    this.$socket.on('user disconnected', this.userDisconnectedListener);
    this.$socket.emit('rooms');
  },
  beforeDestroy() {
    this.$socket.off('rooms', this.roomsListener);
    this.$socket.off('reset unread', this.resetUnreadListener);
    this.$socket.off('incr unread', this.incrUnreadListener);
    this.$socket.on('user connected', this.userConnectedListener);
    this.$socket.off('user disconnected', this.userDisconnectedListener);
  },
  methods: {
    roomsListener(rooms) {
      this.loading = false;
      this.rooms = rooms;
    },
    resetUnreadListener({ roomId }) {
      const room = this.rooms.find((room) => room.id === roomId);
      room.unread = 0;
      this.$forceUpdate();
    },
    incrUnreadListener({ count, roomId }) {
      // If we are already in this room, don't update the "unread" count.
      if (this.$route.params.roomId === roomId) {
        this.$socket.emit('reset unread', { roomId });
        return;
      }
      const room = this.rooms.find((room) => room.id === roomId);
      room.unread += count;
      this.$forceUpdate();
    },
    userConnectedListener(data) {
      this.setUserOnline(true, data);
    },
    userDisconnectedListener(data) {
      this.setUserOnline(false, data);
    },
    setUserOnline(value, { roomId, authorId }) {
      const index = this.rooms.findIndex((room) => room.id === roomId);
      if (index >= 0) {
        const room = { ...this.rooms[index] };
        const participant = room.participants.find(
          (participant) => participant.authorId === authorId
        );
        if (participant) {
          participant.online = value;
          this.$set(this.rooms, index, room);
          this.$forceUpdate();
        }
      }
    },
  },
};
</script>

<template>
  <div class="w-1/3 relative border-r">
    <div class="absolute inset-0">
      <simplebar class="h-full">
        <div class="overflow-x-hidden pt-12 pb-5 px-5 flex flex-col">
          <div class="space-y-1 w-full" :class="{ '-mt-2': !noRoomsToDisplay }">
            <!-- Rooms On This Board -->
            <nuxt-link
              v-for="room of roomsOnThisBoard"
              :key="room.id"
              :to="`/${boardId}/chat/${room.id}/`"
              class="flex items-center p-2 rounded"
              :class="{
                'hover:bg-gray-100': $route.params.roomId !== room.id,
                'relative z-10 shadow-md': $route.params.roomId === room.id,
              }"
            >
              <!-- Avatar -->
              <div
                class="
                  rounded
                  bg-gray-200
                  w-9
                  h-9
                  mr-3
                  flex-shrink-0
                  overflow-hidden
                "
              >
                <img
                  v-show="room.participants[0].identicon"
                  :src="room.participants[0].identiconSrc"
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
                <div class="inline-flex">
                  <badge :color="rgbColor(room.participants[0].identicon)">{{
                    room.participants[0].authorId.slice(-6)
                  }}</badge>
                </div>
              </div>

              <div
                class="h-2 w-2 rounded-full"
                :class="room.usersOnline ? 'bg-green-400' : 'bg-gray-300'"
              ></div>
            </nuxt-link>

            <!-- Rooms On Other Boards -->
            <div
              v-if="roomsOnOtherBoards.length"
              class="
                font-bold font-display
                uppercase
                tracking-wider
                text-center text-sm text-gray-300
                py-1
              "
            >
              From Other Boards
            </div>

            <nuxt-link
              v-for="room of roomsOnOtherBoards"
              :key="room.id"
              :to="`/${boardId}/chat/${room.id}/`"
              class="flex items-center p-2 rounded"
              :class="{
                'hover:bg-gray-100': $route.params.roomId !== room.id,
                'relative z-10 shadow-md': $route.params.roomId === room.id,
              }"
            >
              <!-- Avatar -->
              <div
                class="
                  rounded
                  bg-gray-200
                  w-9
                  h-9
                  mr-3
                  flex-shrink-0
                  overflow-hidden
                "
              >
                <img
                  v-show="room.participants[0].identicon"
                  :src="room.participants[0].identiconSrc"
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
                <div class="inline-flex">
                  <badge :color="rgbColor(room.participants[0].identicon)">{{
                    room.participants[0].authorId.slice(-6)
                  }}</badge>
                </div>
              </div>

              <div
                class="h-2 w-2 rounded-full"
                :class="room.usersOnline ? 'bg-green-400' : 'bg-gray-300'"
              ></div>
            </nuxt-link>

            <!-- Rooms On Other Boards -->
            <div
              v-if="noRoomsToDisplay"
              class="font-display text-gray-300 text-center"
            >
              No conversations to display.
            </div>
          </div>
        </div>
      </simplebar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rooms: [],
    };
  },
  fetch() {
    const rooms = [
      {
        id: 'a5af55',
        boardId: this.boardId,
        threadId: 123456789,
        participants: [
          {
            authorId: ''.padStart(32, 'a5af55'),
            tripcode: null,
          },
        ],
        unseenMessages: 0,
        usersOnline: true,
      },
      {
        id: 'caf6bb',
        boardId: 'b',
        threadId: 987654321,
        participants: [
          {
            authorId: ''.padStart(32, 'caf6bb'),
            tripcode: null,
          },
        ],
        unseenMessages: 2,
        usersOnline: true,
      },
      {
        id: '92ed2b',
        boardId: 'gif',
        threadId: 192837465,
        participants: [
          {
            authorId: ''.padStart(32, '92ed2b'),
            tripcode: null,
          },
        ],
        unseenMessages: 0,
        usersOnline: false,
      },
    ];
    this.data.rooms = rooms;
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
    noRoomsToDisplay() {
      return !this.roomsOnThisBoard.length && !this.roomsOnOtherBoards.length;
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

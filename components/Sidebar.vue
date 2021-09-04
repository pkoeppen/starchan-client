<template>
  <div
    class="flex flex-col items-center px-5 flex-shrink-0 w-52"
    :class="{ 'border-r': !searchResultsModalVisible }"
  >
    <!-- Logo Group -->
    <board-select />

    <!-- Nav Group -->
    <div class="grid grid-cols-1 gap-2 w-full">
      <!-- Threads -->
      <nuxt-link
        :to="`/${boardId}/`"
        class="
          text-sm
          font-display
          uppercase
          font-bold
          tracking-wider
          pl-4
          pr-2
          py-2
          rounded
          flex
          items-center
          space-x-4
        "
        :class="{
          'text-blue-900 bg-blue-100': isThreadRoute,
          'text-gray-500 hover:bg-gray-100 hover:text-gray-700': !isThreadRoute,
        }"
      >
        <i class="w-3 fas fa-align-left" />
        <span>Threads</span>
      </nuxt-link>

      <!-- Posts -->
      <nuxt-link :to="`/${boardId}/posts/`" class="sidebar-item">
        <i class="w-3 fas fa-indent" />
        <span>Posts</span>
      </nuxt-link>

      <!-- Files -->
      <nuxt-link :to="`/${boardId}/files/`" class="sidebar-item">
        <i class="w-3 fas fa-file-image" />
        <span>Files</span>
      </nuxt-link>

      <!-- Chat -->
      <nuxt-link
        :to="`/${boardId}/chat/`"
        class="sidebar-item flex items-center"
      >
        <i class="w-3 fas fa-project-diagram" />
        <span class="flex-grow">Chat</span>
        <unread-chat-count
          v-if="unreadChatMessageCount"
          :count="unreadChatMessageCount"
        />
      </nuxt-link>

      <!-- Archive -->
      <nuxt-link :to="`/${boardId}/archive/`" class="sidebar-item">
        <i class="w-3 fas fa-archive" />
        <span>Archive</span>
      </nuxt-link>

      <nuxt-link v-if="modRoute" to="/dashboard/" class="sidebar-item">
        <i class="w-3 fas fa-chart-line" />
        <span>Dashboard</span>
      </nuxt-link>
    </div>

    <!-- End Group -->
    <div class="w-full flex flex-col flex-grow justify-end">
      <div
        class="
          relative
          w-full
          bg-gray-100
          rounded
          overflow-hidden
          aspect-ratio-square
        "
      >
        <div class="absolute inset-0">
          <img src="~/static/slot-1.jpg" class="w-full h-full object-cover" />
        </div>
      </div>
      <span class="text-xs py-3 text-gray-400 text-center">*chan v0.0.1</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      unreadChatMessageCount: 0,
    };
  },
  computed: {
    ...mapState(['modRoute']),
    boardId() {
      return this.$route.params.boardId || 'all';
    },
    isArchiveRoute() {
      return this.$route.path.includes('archive');
    },
    isThreadRoute() {
      const route = this.$route;
      if (
        (route.params.page || route.params.threadId) &&
        !this.isArchiveRoute
      ) {
        return true;
      }
      if (route.path === `/${this.boardId}/`) {
        return true;
      }
      return false;
    },
    searchResultsModalVisible() {
      return this.$store.state.modals.searchResults.visible;
    },
  },
  mounted() {
    this.$socket.on('total unread', this.totalUnreadListener);
    this.$socket.on('incr total unread', this.incrTotalUnreadListener);
    this.$socket.emit('total unread');
  },
  beforeDestroy() {
    this.$socket.off('total unread', this.totalUnreadListener);
    this.$socket.off('incr total unread', this.incrTotalUnreadListener);
  },
  methods: {
    totalUnreadListener({ count }) {
      this.unreadChatMessageCount = count;
    },
    incrTotalUnreadListener({ roomId, count }) {
      // If we are already in this room, don't update the "unread" count.
      if (this.$route.params.roomId === roomId) {
        return;
      }
      this.unreadChatMessageCount += count;
    },
  },
};
</script>
<style scoped>
.sidebar-item {
  @apply flex items-center space-x-4 text-sm font-display uppercase font-bold tracking-wider text-gray-500 pl-4 pr-2 py-2 rounded hover:bg-gray-100 hover:text-gray-700;
}
.nuxt-link-active.sidebar-item {
  @apply text-blue-900 bg-blue-100 hover:bg-blue-100 hover:text-blue-900;
}
</style>

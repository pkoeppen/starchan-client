<template>
  <div class="flex flex-col items-center border-r px-5 flex-shrink-0">
    <!-- Logo Group -->
    <board-select />

    <!-- Nav Group -->
    <div class="grid grid-cols-1 gap-2 w-full">
      <!-- Threads -->
      <nuxt-link :to="`/${boardId}/`" class="sidebar-item">
        <i class="w-3 fas fa-align-left mr-2" />
        <span>Threads</span>
      </nuxt-link>

      <!-- Posts -->
      <nuxt-link :to="`/${boardId}/posts/`" class="sidebar-item">
        <i class="w-3 fas fa-indent mr-2" />
        <span>Posts</span>
      </nuxt-link>

      <!-- Files -->
      <nuxt-link :to="`/${boardId}/files`" class="sidebar-item">
        <i class="w-3 fas fa-file-image mr-2" />
        <span>Files</span>
      </nuxt-link>

      <!-- Chat -->
      <nuxt-link :to="`/${boardId}/chat/`" class="sidebar-item">
        <i class="w-3 fas fa-project-diagram mr-2" />
        <span>Chat</span>
      </nuxt-link>

      <!-- Archive -->
      <nuxt-link :to="`/${boardId}/archive/`" class="sidebar-item">
        <i class="w-3 fas fa-archive mr-2" />
        <span>Archive</span>
      </nuxt-link>

      <nuxt-link v-if="modRoute" to="/dashboard/" class="sidebar-item">
        <i class="w-3 fas fa-chart-line mr-2" />
        <span>Dashboard</span>
      </nuxt-link>
    </div>

    <!-- End Group -->
    <div class="w-full flex flex-col flex-grow justify-end">
      <div
        class="
          w-full
          h-44
          bg-gray-100
          rounded
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <img
          src="http://amphibistudio.sg/egi/wp-content/uploads/2020/08/cat-lowpoly-300x300.jpg"
          class="w-full h-full object-cover"
        />
      </div>
      <span class="text-xs py-3 text-gray-400 text-center">*chan v0.0.1</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['modRoute']),
    boardId() {
      return this.$route.params.boardId || 'all';
    },
  },
};
</script>
<style scoped>
.sidebar-item {
  @apply text-sm font-display uppercase font-bold tracking-wider text-gray-500 px-4 py-2 rounded hover:bg-gray-100 hover:text-gray-700;
}
.nuxt-link-active.sidebar-item {
  @apply text-blue-900 bg-blue-100 hover:bg-blue-100 hover:text-blue-900;
}
</style>

<template>
  <div class="h-14 mb-12 flex justify-center items-center relative">
    <div
      class="
        flex
        items-center
        justify-center
        cursor-pointer
        hover:bg-gray-100
        rounded
        px-3
        py-1.5
        space-x-2
        font-display
        z-20
      "
      :class="{ 'bg-gray-100': showMenu }"
      @click="showMenu = !showMenu"
    >
      <span class="font-bold text-xl tracking-tighter">*chan</span>
      <div class="text-xl">
        <span>/</span><span class="tracking-tighter mr-0.5">{{ boardId }}</span
        ><span>/</span>
      </div>
      <i class="fas fa-caret-down text-sm" />
    </div>
    <!-- Board Select Menu -->
    <div v-if="showMenu">
      <div
        class="absolute top-14 left-0 z-20 flex flex-col flex-wrap"
        style="max-height: calc(100vh - 4em)"
      >
        <nuxt-link
          to="/all/"
          class="board-link"
          @click.native="showMenu = false"
        >
          /all/ - Everything
        </nuxt-link>
        <nuxt-link
          v-for="board of boards"
          :key="board.id"
          :to="`/${board.id}/`"
          class="board-link"
          @click.native="showMenu = false"
        >
          /{{ board.id }}/ - {{ board.title }}
        </nuxt-link>
        <nuxt-link
          to="/"
          class="homepage-link"
          @click.native="showMenu = false"
        >
          Home Page
        </nuxt-link>
      </div>
      <div
        class="fixed inset-0 z-10 bg-white opacity-95"
        @click="showMenu = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boards: [],
      showMenu: false,
    };
  },
  async fetch() {
    const boards = await this.$store.dispatch('api/getBoards');
    this.boards = boards;
  },
  computed: {
    boardId() {
      return this.$route.params.boardId || 'all';
    },
  },
};
</script>
<style scoped>
.board-link {
  @apply border mr-2 mb-2 rounded block px-4 py-3 bg-white hover:bg-gray-100 cursor-pointer border-b whitespace-nowrap text-sm font-semibold;
}
.board-link.nuxt-link-active {
  @apply text-blue-700 hover:bg-white;
}
.homepage-link {
  @apply bg-gray-300 border border-gray-300 text-white text-center mr-2 mb-2 font-semibold text-sm px-5 py-3 rounded;
}
</style>

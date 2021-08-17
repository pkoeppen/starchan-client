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
        class="
          absolute
          bg-white
          shadow-lg
          rounded
          overflow-hidden
          left-6
          top-12
          z-20
        "
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
      </div>
      <div class="fixed inset-0 z-10" @click="showMenu = false" />
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
  @apply block px-4 py-3 bg-white hover:bg-gray-100 cursor-pointer border-b whitespace-nowrap text-sm font-semibold;
}
.board-link.nuxt-link-active {
  @apply text-blue-700 hover:bg-white;
}
</style>

<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <div class="text-6xl font-bold tracking-tighter mb-6">*chan</div>
    <!-- <nuxt-link to="/login/">Login</nuxt-link> -->
    <div class="p-6 border rounded">
      <h1
        class="
          text-gray-400
          uppercase
          font-display font-bold
          text-sm
          tracking-wider
          mb-3
        "
      >
        Boards
      </h1>
      <div class="-mx-2">
        <nuxt-link
          v-for="board of boards"
          :key="board.id"
          :to="`/${board.id}/`"
          class="flex items-center group hover:bg-gray-100 rounded px-3 py-1.5"
        >
          <span class="font-bold font-display mr-1.5">/{{ board.id }}/</span>
          <span class="font-display">{{ board.title }}</span>
          <div
            class="
              flex
              items-center
              justify-end
              ml-3
              group-hover:opacity-100
              opacity-0
              flex-grow
            "
          >
            <i class="fas fa-caret-right text-xs" />
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    const boards = await store.dispatch('api/getBoards');
    return { boards };
  },
};
</script>

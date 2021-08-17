<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <div class="text-6xl font-bold tracking-tighter mb-6">*chan</div>
    <!-- <nuxt-link to="/login/">Login</nuxt-link> -->
    <div class="p-6 border rounded space-y-3">
      <nuxt-link
        v-for="board of boards"
        :key="board.id"
        :to="`/${board.id}/`"
        class="flex items-center"
      >
        <span class="font-bold font-display mr-1.5">/{{ board.id }}/</span>
        <span class="font-display">{{ board.title }}</span>
      </nuxt-link>
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

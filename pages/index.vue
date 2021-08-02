<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <div v-if="modData">{{ modData }}</div>
    <div v-else>not logged in</div>
    <nuxt-link to="/login/">Login</nuxt-link>
    <nuxt-link v-for="board of boards" :key="board.id" :to="`/${board.id}/`">
      /{{ board.id }}/
    </nuxt-link>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    const boards = await store.dispatch('api/getBoards');
    return { boards, modData: store.state.api.modData };
  },
};
</script>

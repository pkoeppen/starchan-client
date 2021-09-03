<template>
  <div></div>
</template>

<script>
export default {
  layout: 'board',
  async asyncData({ store, route }) {
    const boardId = route.params.boardId;
    const page = route.params.page;
    const threads = await store.dispatch('api/getThreads', {
      boardId,
      page,
    });
    return {
      threads,
    };
  },
};
</script>

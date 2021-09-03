<template>
  <threads-page :threads="threads" />
</template>

<script>
export default {
  layout: 'board',
  async asyncData({ store, route }) {
    const boardId = route.params.boardId;
    const threads = await store.dispatch('api/getThreads', {
      boardId,
      page: 1,
      archived: true,
    });
    return {
      threads,
    };
  },
};
</script>

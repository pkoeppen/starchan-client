<template>
  <posts-page :posts="posts" />
</template>

<script>
export default {
  layout: 'board',
  async asyncData({ store, route, $catch }) {
    try {
      const boardId = route.params.boardId;
      const page = route.params.page;
      const posts = await store.dispatch('api/getPosts', {
        boardId,
        page,
      });
      return {
        posts,
      };
    } catch (error) {
      $catch(error);
    }
  },
};
</script>

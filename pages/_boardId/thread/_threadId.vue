<template>
  <div class="w-3/4 border-r relative">
    <div class="absolute inset-0">
      <simplebar class="h-full">
        <nuxt-link
          :to="previousRoute"
          class="
            ml-12
            mt-2
            w-8
            h-8
            text-gray-500
            hover:text-gray-900 hover:bg-gray-100
            rounded
            flex
            items-center
            justify-center
          "
        >
          <i class="fas fa-angle-left" />
        </nuxt-link>
        <div class="overflow-x-hidden px-12 pt-2 pb-28 grid grid-cols-1 gap-6">
          <thread-preview
            :thread="thread"
            :root-post="thread.rootPost"
            show-replies
          />
          <post
            v-for="post of thread.posts"
            :key="post.id"
            :post="post"
            :thread="thread"
            show-replies
          />
        </div>
      </simplebar>
    </div>
    <reply-box :thread-id="thread.id" />
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path !== '/') vm.previousRoute = from.path;
    });
  },
  layout: 'board',
  async asyncData({ store, route }) {
    const boardId = route.params.boardId;
    const threadId = route.params.threadId;
    const thread = await store.dispatch('api/getThread', { boardId, threadId });
    return {
      thread,
      previousRoute: `/${boardId}/`,
    };
  },
  mounted() {
    this.$bus.$on('appendNewPost', (post) => {
      this.thread.posts.push(post);
    });
  },
};
</script>

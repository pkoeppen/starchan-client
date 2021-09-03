<template>
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
      <div
        class="overflow-x-hidden px-12 pt-2 grid grid-cols-1 gap-6"
        :class="showReplyBox ? 'pb-28' : 'pb-12'"
      >
        <thread-preview :thread="thread" append-reply show-replies />
        <post
          v-for="post of thread.posts"
          :key="post.id"
          :post="post"
          :thread="thread"
          append-reply
          show-replies
        />
      </div>
    </simplebar>
    <reply-box v-if="showReplyBox" :thread-id="thread.id" />
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
  computed: {
    showReplyBox() {
      return !this.thread.archived;
    },
  },
  mounted() {
    if (this.$route.hash) {
      // This fixes an issue where navigating client-side to a route with a hash
      // ending does not scroll to the appropriate anchor.
      location.hash = this.$route.hash;
    }
    this.$bus.$on('appendNewPost', (post) => {
      this.thread.posts.push(post);
    });
  },
};
</script>

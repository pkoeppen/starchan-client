<template>
  <div class="absolute inset-0">
    <simplebar class="h-full">
      <div class="overflow-x-hidden p-12 flex flex-col space-y-6">
        <!-- Pagination Controls -->
        <pagination-controls />

        <!-- Posts -->
        <div v-if="posts.length" class="grid grid-cols-1 gap-8">
          <post
            v-for="post of posts"
            :key="post.id"
            :post="post"
            :thread="post.thread"
            :root-author-id="post.threadId || post.id"
            show-replies
          />
        </div>

        <div v-else class="text-center pt-8">
          <div class="text-lg text-gray-300 font-display">
            No posts to display.
          </div>
        </div>

        <!-- Pagination Controls -->
        <pagination-controls v-if="posts.length" />
      </div>
    </simplebar>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
};
</script>

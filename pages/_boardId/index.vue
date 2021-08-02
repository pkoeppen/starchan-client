<template>
  <div class="w-3/4 border-r relative">
    <div class="absolute inset-0">
      <simplebar class="h-full">
        <div class="overflow-x-hidden p-12 grid grid-cols-1 gap-6">
          <!-- Pagination Controls -->
          <pagination-controls />

          <!-- Threads -->
          <div class="grid grid-cols-1 gap-8">
            <thread-preview
              v-for="thread of threads"
              :key="thread.id"
              :thread="thread"
              :root-post="thread.rootPost"
            >
              <!-- Replies -->
              <nuxt-link
                v-if="thread._count.posts"
                :to="`/${thread.boardId}/thread/${thread.id}/`"
                class="
                  group
                  flex
                  items-center
                  w-full
                  px-4
                  py-2
                  mt-3
                  border border-white
                  hover:border-gray-200
                  -mx-4
                  rounded
                  text-sm text-gray-500
                  font-display
                "
              >
                <span class="font-bold mr-2 text-blue-500 hover:underline"
                  >{{ thread._count.posts }} repl{{
                    thread._count.posts === 1 ? 'y' : 'ies'
                  }}</span
                >
                <span class="flex-grow">{{
                  $timeAgo(thread.lastPost.updatedAt)
                }}</span>
                <i
                  class="opacity-0 group-hover:opacity-100 fas fa-angle-right"
                />
              </nuxt-link>
            </thread-preview>
          </div>

          <!-- Pagination Controls -->
          <pagination-controls />
        </div>
      </simplebar>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  layout: 'board',
  async asyncData({ store, route }) {
    const boardId = route.params.boardId;
    const threads = await store.dispatch('api/getThreads', { boardId });
    return {
      boardId: route.params.boardId,
      threads,
    };
  },
  methods: {
    formatPostTime(time) {
      return format(new Date(time), 'MMMM d, yyyy p');
    },
  },
};
</script>

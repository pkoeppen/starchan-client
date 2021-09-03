<template>
  <div class="absolute inset-0">
    <simplebar class="h-full">
      <div class="overflow-x-hidden p-12 flex flex-col space-y-6">
        <!-- Pagination Controls -->
        <pagination-controls />

        <!-- Threads -->
        <div v-if="threads.length" class="grid grid-cols-1 gap-8">
          <thread-preview
            v-for="thread of threads"
            :key="thread.id"
            :thread="thread"
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
              <span class="flex-grow">{{ $timeAgo(thread.bumpedAt) }}</span>
              <i class="opacity-0 group-hover:opacity-100 fas fa-angle-right" />
            </nuxt-link>
          </thread-preview>
        </div>

        <div v-else class="text-center pt-8">
          <div class="text-lg text-gray-300 font-display">
            No threads to display.
          </div>
        </div>

        <!-- Pagination Controls -->
        <pagination-controls v-if="threads.length" />
      </div>
    </simplebar>
  </div>
</template>

<script>
export default {
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },
};
</script>

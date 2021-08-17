<template>
  <div class="flex flex-col rounded shadow">
    <nuxt-link
      :to="`/${thread.boardId}/thread/${thread.id}/`"
      class="px-5 h-14 flex items-center justify-between border-b"
    >
      <!-- Title -->
      <div class="flex items-center">
        <div
          v-if="
            thread.sticky || thread.locked || thread.anchored || thread.cycle
          "
          class="mr-4 space-x-1"
        >
          <i v-if="thread.sticky" class="fas fa-thumbtack text-sm" />
          <i v-if="thread.locked" class="fas fa-lock text-sm" />
          <i v-if="thread.anchored" class="fas fa-anchor text-sm" />
          <i v-if="thread.cycle" class="fas fa-recycle text-sm" />
        </div>
        <span class="text-xl">{{ thread.title }}</span>
      </div>
      <!-- Views -->
      <div class="text-gray-500 text-sm">
        {{ `${thread.views} view${thread.views === 1 ? '' : 's'}` }}
      </div>
    </nuxt-link>
    <!-- Post Container -->
    <post
      :post="rootPost"
      :thread="thread"
      :show-replies="showReplies"
      :root-author-id="rootPost.authorId"
      class="m-5"
    >
      <slot></slot>
    </post>
  </div>
</template>

<script>
export default {
  props: {
    thread: {
      type: Object,
      required: true,
    },
    rootPost: {
      type: Object,
      required: true,
    },
    showReplies: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

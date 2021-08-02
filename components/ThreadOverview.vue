<template>
  <div class="w-1/4 pt-5 px-5 flex-grow">
    <!-- Ad Space -->
    <div
      class="
        bg-gray-100
        h-32
        w-full
        rounded
        mb-4
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src="https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/00e5e810218663.58bec04f061fd.jpg"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Sticky Threads -->
    <div class="mb-4">
      <div
        class="
          font-display
          uppercase
          font-bold
          text-sm text-gray-500
          tracking-wider
          mb-2
        "
      >
        Sticky
      </div>
      <!-- Thread List -->
      <div class="-mx-2">
        <nuxt-link
          v-for="thread of stickyThreads"
          :key="thread.id"
          :to="`/${thread.boardId}/thread/${thread.id}/`"
          class="
            w-full
            flex
            items-center
            group
            hover:bg-gray-100
            rounded
            px-2
            py-1
          "
        >
          <div
            v-if="
              thread.sticky || thread.locked || thread.anchored || thread.cycle
            "
            class="mr-2 flex items-center space-x-1"
          >
            <i
              v-if="thread.sticky"
              class="fas fa-thumbtack text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.locked"
              class="fas fa-lock text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.anchored"
              class="fas fa-anchor text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.cycle"
              class="fas fa-recycle text-sm"
              style="font-size: 9px"
            />
          </div>
          <span class="text-sm w-full truncate">{{ thread.title }}</span>
          <i
            class="
              fas
              fa-angle-right
              text-right
              flex-grow
              opacity-0
              group-hover:opacity-100
              text-xs
            "
          />
        </nuxt-link>
      </div>
    </div>

    <!-- Latest Threads -->
    <div>
      <div
        class="
          font-display
          flex
          items-center
          justify-between
          uppercase
          font-bold
          text-sm text-gray-500
          tracking-wider
          mb-2
        "
      >
        <span>Latest</span>
        <i class="fas fa-sync-alt text-xs cursor-pointer hover:text-gray-700" />
      </div>
      <!-- Thread List -->
      <div class="-mx-2">
        <nuxt-link
          v-for="(thread, n) of latestThreads"
          :key="thread.id"
          :to="`/${thread.boardId}/thread/${thread.id}/`"
          class="
            w-full
            flex
            items-center
            group
            hover:bg-gray-100
            cursor-pointer
            rounded
            px-2
            py-1
          "
        >
          <span class="font-display font-bold text-xs text-gray-400 mr-2">{{
            n + 1
          }}</span>
          <div
            v-if="
              thread.sticky || thread.locked || thread.anchored || thread.cycle
            "
            class="mr-2 flex-shrink-0 flex items-center space-x-1"
          >
            <i
              v-if="thread.sticky"
              class="fas fa-thumbtack text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.locked"
              class="fas fa-lock text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.anchored"
              class="fas fa-anchor text-sm"
              style="font-size: 9px"
            />
            <i
              v-if="thread.cycle"
              class="fas fa-recycle text-sm"
              style="font-size: 9px"
            />
          </div>
          <span class="text-sm w-full truncate">{{ thread.title }}</span>
          <i
            class="
              fas
              fa-angle-right
              text-right
              flex-grow
              opacity-0
              group-hover:opacity-100
              text-xs
            "
          />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stickyThreads: [],
      latestThreads: [],
    };
  },
  async fetch() {
    const boardId = this.$route.params.boardId;
    this.stickyThreads = await this.$store.dispatch('api/getThreads', {
      boardId,
      sticky: true,
    });
    this.latestThreads = await this.$store.dispatch('api/getThreads', {
      boardId,
      latest: true,
    });
  },
};
</script>

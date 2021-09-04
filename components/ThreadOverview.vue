<template>
  <div
    class="w-1/4 pt-5 px-5 flex-grow flex flex-col absolute h-full right-0"
    :class="{ 'border-l': !searchResultsModalVisible }"
  >
    <!-- Ad Space -->
    <div
      class="
        flex-shrink-0
        relative
        w-full
        bg-gray-100
        rounded
        overflow-hidden
        aspect-ratio-21/9
        mb-4
      "
    >
      <div class="absolute inset-0">
        <img src="~/static/slot-2.jpg" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Sticky Threads -->
    <div v-if="stickyThreads.length" class="mb-4">
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
    <div class="flex-grow pb-5 flex flex-col overflow-hidden -mx-2">
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
          mx-2
        "
      >
        <span>Latest</span>
        <i
          class="fas fa-sync-alt text-xs cursor-pointer hover:text-gray-700"
          :class="{ 'animate-spin': latestThreadsLoading }"
          @click="loadLatestThreads()"
        />
      </div>
      <!-- Thread List -->
      <div ref="latestThreads" class="flex-grow overflow-hidden">
        <nuxt-link
          v-for="(thread, n) of latestThreadsFiltered"
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
      boardId: this.$route.params.boardId,
      stickyThreads: [],
      latestThreads: [],
      canFitCount: 20,
      latestThreadsLoading: false,
    };
  },
  async fetch() {
    try {
      const boardId = this.boardId;
      if (boardId !== 'all') {
        this.stickyThreads = await this.$store.dispatch(
          'api/listStickyThreads',
          { boardId, take: 10 }
        );
      }
      this.latestThreads = await this.$store.dispatch('api/listLatestThreads', {
        boardId,
        take: 20,
      });
    } catch (error) {
      this.$catch(error);
    }
  },
  computed: {
    latestThreadsFiltered() {
      return this.latestThreads.slice(0, this.canFitCount);
    },
    searchResultsModalVisible() {
      return this.$store.state.modals.searchResults.visible;
    },
  },
  mounted() {
    this.latestThreadsInterval = setInterval(this.loadLatestThreads, 15000);
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      const height = this.$refs.latestThreads.clientHeight;
      const itemHeight = 26; // Approximate height of each list element.
      this.canFitCount = Math.floor(height / itemHeight);
    },
    async loadLatestThreads() {
      this.latestThreadsLoading = true;
      await this.pause(1000);
      try {
        this.latestThreads = await this.$store.dispatch(
          'api/listLatestThreads',
          {
            boardId: this.boardId,
            take: 20,
          }
        );
      } catch (error) {
        this.$catch(error);
      } finally {
        this.latestThreadsLoading = false;
      }
    },
    pause(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
  },
};
</script>

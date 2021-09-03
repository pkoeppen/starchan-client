<template>
  <div v-show="visible" class="fixed inset-0 z-30 flex">
    <div
      class="w-52 bg-white opacity-90"
      @click="hideModal({ modal: 'searchResults' })"
    />
    <div class="flex-grow flex">
      <div class="w-3/4 bg-white relative">
        <!-- Search Input -->
        <div
          class="
            text-sm
            py-2
            flex
            items-center
            w-3/4
            px-12
            h-14
            bg-white
            w-full
            border-b border-white
          "
        >
          <i class="fas fa-search text-xs mr-2 text-gray-400" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            placeholder="Search..."
            class="flex-grow placeholder-gray-400"
            @input="handleSearchInputDebounced()"
          />
          <!-- <i
            v-if="loading"
            class="fas fa-asterisk animate-spin text-gray-400"
          /> -->
          <div class="text-gray-400 whitespace-nowrap">
            <b>{{ searchResultCount || 0 }}</b>
            <span>result{{ searchResultCount === 1 ? '' : 's' }}</span>
          </div>
        </div>

        <div class="gradient" />

        <!-- Results -->
        <simplebar
          ref="scrollElement"
          style="height: calc(100vh - 3.5em)"
          @scroll="handleInfiniteScroll"
        >
          <div class="overflow-x-hidden p-12 flex flex-col space-y-6">
            <div v-if="searchResults.length" class="grid grid-cols-1 gap-6">
              <div
                v-for="post of searchResults"
                :key="post.id"
                class="shadow p-5"
              >
                <post
                  :post="post"
                  :thread-id="post.threadId"
                  :board-id="post.boardId"
                  :thread="post.thread || post.rootThread"
                  :is-op="!post.threadId"
                  show-replies
                />
              </div>
            </div>
            <div v-else class="text-center text-lg text-gray-300 font-display">
              No results.
            </div>
            <div v-if="loading" class="text-center">
              <i class="fas fa-asterisk animate-spin fa-2x text-gray-300" />
            </div>
          </div>
        </simplebar>
      </div>
      <div
        class="w-1/4 bg-white opacity-90"
        @click="hideModal({ modal: 'searchResults' })"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { debounce } from 'lodash';
export default {
  data() {
    return {
      loading: false,
      searchQuery: null,
      searchResultCount: null,
      searchResults: [],
      handleSearchInputDebounced: debounce(this.handleSearchInput, 500),
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.searchResults.data,
      visible: (state) => state.modals.searchResults.visible,
    }),
    searchResultCountText() {
      if (!this.searchQuery || isNaN(parseInt(this.searchResultCount))) {
        return null;
      }
      const s = this.searchResultCount === 1 ? '' : 's';
      return `${this.searchResultCount} result${s}`;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.searchQuery = this.data.searchQuery;
        this.searchResultCount = this.data.searchResultCount;
        this.searchResults = [...this.data.searchResults];
        if (!this.searchResults?.length) {
          // If we've opened the modal before results could be loaded in the search bar
          // component and passed to this component, execute the search again.
          this.handleSearchInput();
        }
        setTimeout(() => this.$refs.searchInput.focus(), 0);
        document.addEventListener('keyup', this.escapeListener);
      } else {
        this.loading = false;
        this.searchQuery = null;
        this.searchResultCount = null;
        this.searchResults = [];
        this.scrollTop();
        document.removeEventListener('keyup', this.escapeListener);
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.focusSearchInputListener);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.focusSearchInputListener);
  },
  methods: {
    ...mapMutations(['hideModal']),
    focusSearchInputListener(event) {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        this.$refs.searchInput.focus();
      }
    },
    scrollTop() {
      const scrollElement = this.$refs.scrollElement?.$refs?.scrollElement;
      if (scrollElement) {
        scrollElement.scrollTop = 0;
      }
    },
    async handleSearchInput() {
      if (!this.searchQuery) {
        this.searchResults = [];
        return;
      }
      try {
        this.loading = true;
        const { total, results } = await this.$store.dispatch('api/search', {
          q: this.searchQuery,
        });
        this.searchResultCount = total;
        this.searchResults = results;
        this.scrollTop();
      } catch (error) {
        this.$catch(error);
      } finally {
        this.loading = false;
      }
    },
    escapeListener(event) {
      if (event.keyCode === 27) {
        this.hideModal({ modal: 'searchResults' });
      }
    },
    async handleInfiniteScroll(event) {
      if (event.target.scrollTop === event.target.scrollTopMax) {
        if (this.searchResults.length === this.searchResultCount) {
          // We've already fetched all results.
          return;
        }
        try {
          this.loading = true;
          const { total, results } = await this.$store.dispatch('api/search', {
            q: this.searchQuery,
            skip: this.searchResults.length,
          });
          this.searchResultCount = total;
          this.searchResults.push(...results);
        } catch (error) {
          this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>
<style scoped>
.gradient {
  background-image: linear-gradient(white, rgba(0, 0, 0, 0));
  @apply absolute top-14 left-0 right-3 h-14 z-30;
}
</style>

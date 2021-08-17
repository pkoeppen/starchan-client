<template>
  <!-- Thread Controls -->
  <div class="h-14 px-3 flex items-center justify-between rounded shadow">
    <div
      class="
        w-8
        h-8
        flex
        justify-center
        items-center
        rounded-sm
        hover:bg-gray-100
        text-gray-500
        hover:text-gray-700
        cursor-pointer
      "
    >
      <i class="fas fa-sync-alt" />
    </div>
    <!-- Pagination Controls -->
    <div class="flex items-center justify-center">
      <nuxt-link
        :to="`/${boardId}/${previousPage}/`"
        class="
          mr-3
          rounded-sm
          h-8
          w-8
          flex
          items-center
          justify-center
          text-gray-500
          hover:bg-gray-100 hover:text-gray-700
        "
      >
        <i class="fas fa-angle-left" />
      </nuxt-link>
      <nuxt-link
        v-for="n in 10"
        :key="n"
        :class="{
          'bg-blue-100 text-blue-900': n === page,
          'hover:bg-gray-100 hover:text-gray-700': n !== page,
        }"
        class="
          h-8
          w-8
          flex
          items-center
          justify-center
          rounded-sm
          font-bold font-display
          text-gray-500 text-sm
        "
        :to="`/${boardId}/${n}/`"
        >{{ n }}</nuxt-link
      >
      <nuxt-link
        :to="`/${boardId}/${nextPage}/`"
        class="
          ml-3
          rounded-sm
          h-8
          w-8
          flex
          items-center
          justify-center
          text-gray-500
          hover:bg-gray-100 hover:text-gray-700
        "
      >
        <i class="fas fa-angle-right" />
      </nuxt-link>
    </div>
    <button
      class="
        px-2
        py-1
        border border-white
        rounded
        hover:border-gray-200
        text-sm
        font-bold
        text-gray-500
        hover:text-gray-700
        tracking-tight
        font-display
      "
      @click="showModal({ modal: 'thread' })"
    >
      Create Thread
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    page() {
      return parseInt(this.$route.params.page) || 1;
    },
    nextPage() {
      if (this.page + 1 > 10) {
        return 1;
      } else {
        return this.page + 1;
      }
    },
    previousPage() {
      if (this.page - 1 < 1) {
        return 10;
      } else {
        return this.page - 1;
      }
    },
  },
  methods: {
    ...mapMutations(['showModal']),
  },
};
</script>

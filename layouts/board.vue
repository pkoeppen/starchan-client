<template>
  <div class="fixed inset-0 flex">
    <!-- Modals -->
    <lightbox />
    <thread-modal />
    <delete-post-modal />

    <!-- Sidebar -->
    <sidebar />

    <!-- Main Container -->
    <div class="flex-grow h-screen relative">
      <!-- Search & Settings Bar -->
      <search-profile-bar />

      <!-- Thread Window -->
      <div class="flex flex-grow absolute top-14 bottom-0 left-0 right-0">
        <Nuxt />

        <!-- Thread Overview Window -->
        <thread-overview />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['modRoute']),
    boardId() {
      return this.$route.params.boardId;
    },
  },
};
</script>

<template>
  <div class="fixed inset-0 flex">
    <!-- Modals -->
    <modal-lightbox />
    <modal-create-thread />
    <modal-delete-post />
    <modal-report-post />
    <modal-ban-post />
    <modal-edit-thread />
    <modal-start-chat />
    <modal-search-results />

    <!-- Sidebar -->
    <sidebar />

    <!-- Main Container -->
    <div class="flex-grow h-screen relative">
      <!-- Search & Settings Bar -->
      <search-profile-bar />

      <!-- Thread Window -->
      <div class="flex flex-grow absolute top-14 bottom-0 left-0 right-0">
        <div class="w-3/4 relative">
          <Nuxt />
        </div>

        <!-- Thread Overview Window -->
        <thread-overview />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ModalSearchResults from '../components/ModalSearchResults.vue';
export default {
  components: { ModalSearchResults },
  computed: {
    ...mapState(['modRoute']),
    boardId() {
      return this.$route.params.boardId;
    },
  },
  mounted() {
    this.$recaptcha.init();
    this.$socket.connect();
  },
  beforeDestroy() {
    this.$recaptcha.destroy();
    this.$socket.disconnect();
  },
};
</script>

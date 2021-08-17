<template>
  <div class="fixed inset-0 flex">
    <!-- Modals -->
    <modal-edit-board />
    <modal-edit-user />

    <!-- Sidebar -->
    <sidebar />

    <!-- Main Container -->
    <div class="flex-grow h-screen relative">
      <!-- Search & Settings Bar -->
      <search-profile-bar />

      <!-- Dashboard Window -->
      <div class="flex flex-grow absolute top-14 bottom-0 left-0 right-0">
        <simplebar class="h-full w-full">
          <div class="p-12 w-full overflow-x-hidden">
            <div class="mb-6">
              <nuxt-link class="dashboard-item" to="/dashboard/"
                >Stats</nuxt-link
              >
              <nuxt-link class="dashboard-item" to="/dashboard/reports/"
                >Reports</nuxt-link
              >
              <nuxt-link class="dashboard-item" to="/dashboard/bans/"
                >Bans</nuxt-link
              >
              <nuxt-link class="dashboard-item" to="/dashboard/boards/"
                >Boards</nuxt-link
              >
              <nuxt-link class="dashboard-item" to="/dashboard/users/"
                >Users</nuxt-link
              >
              <nuxt-link class="dashboard-item" to="/dashboard/log/"
                >Log</nuxt-link
              >
            </div>
            <Nuxt />
          </div>
        </simplebar>
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
<style scoped>
.dashboard-item {
  @apply text-sm font-display uppercase font-bold tracking-wider text-gray-500 px-4 py-2 rounded hover:bg-gray-100 hover:text-gray-700 inline-block;
}
.nuxt-link-exact-active.dashboard-item {
  @apply text-blue-900 bg-blue-100 hover:bg-blue-100 hover:text-blue-900;
}
</style>

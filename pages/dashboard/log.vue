<template>
  <div>
    <div class="overflow-hidden rounded shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">Log ID</th>
            <th scope="col" class="table-header">User</th>
            <th scope="col" class="table-header">Message</th>
            <th scope="col" class="table-header">Created</th>
            <th scope="col" class="table-header">Metadata</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="logEntries.length">
            <tr v-for="logEntry of logEntries" :key="logEntry.id">
              <td class="table-cell font-bold">
                {{ logEntry.id }}
              </td>
              <td class="table-cell font-bold">{{ logEntry.user.username }}</td>
              <td class="table-cell">{{ logEntry.message }}</td>
              <td class="table-cell">{{ $timeAgo(logEntry.createdAt) }}</td>
              <td class="px-6 py-4">
                <button
                  v-if="logEntry.metadata"
                  class="
                    inline-block
                    font-bold font-display
                    text-sm
                    bg-gray-500
                    text-gray-100
                    hover:text-white hover:bg-gray-700
                    rounded
                    px-2
                    py-1
                    cursor-pointer
                    tracking-tight
                  "
                  @click="alert(logEntry.metadata)"
                >
                  Show JSON
                </button>
                <span v-else class="">--</span>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td
              class="font-display font-bold text-gray-700 text-center py-6"
              colspan="5"
            >
              No log entries to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  async asyncData({ store }) {
    const logEntries = await store.dispatch('api/getLogEntries');
    return {
      logEntries,
    };
  },
  methods: {
    alert(obj) {
      alert(JSON.stringify(obj, null, 2));
    },
  },
};
</script>
<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}
</style>

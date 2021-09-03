<template>
  <div>
    <div class="overflow-hidden rounded shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">Board</th>
            <th scope="col" class="table-header">Post ID</th>
            <th scope="col" class="table-header">Reason</th>
            <th scope="col" class="table-header">IP Address</th>
            <th scope="col" class="table-header">Created</th>
            <th scope="col" class="table-header">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="reports.length">
            <tr v-for="report of reports" :key="report.id">
              <td class="table-cell">
                <nuxt-link
                  :to="`/${report.boardId}/`"
                  class="text-blue-500 hover:underline focus:underline"
                  >/{{ report.boardId }}/</nuxt-link
                >
              </td>
              <td class="table-cell">
                <a
                  :href="`/${report.boardId}/thread/${report.threadId}/#${report.postId}`"
                  class="text-blue-500 hover:underline focus:underline"
                  >{{ report.postId }}</a
                >
              </td>
              <td class="table-cell">
                {{ formatReportReason(report.reason) }}
              </td>
              <td class="table-cell">
                <nuxt-link
                  :to="`/dashboard/ip/${report.ipAddress}/`"
                  class="text-blue-500 hover:underline focus:underline"
                  >{{ report.ipAddress }}</nuxt-link
                >
              </td>
              <td class="table-cell">{{ $timeAgo(report.createdAt) }}</td>
              <td class="">
                <button
                  class="
                    inline-block
                    font-bold font-display
                    text-sm text-gray-600
                    hover:text-gray-900 hover:bg-gray-100
                    rounded
                    px-2
                    py-1
                    cursor-pointer
                  "
                  @click="deleteReport(report.id)"
                >
                  Dismiss
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td class="font-display text-gray-300 text-center py-6" colspan="7">
              No reports to display.
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
    const reports = await store.dispatch('api/getReports', {});
    return {
      reports,
    };
  },
  methods: {
    formatReportReason(str) {
      switch (str) {
        case 'SPAM':
          return 'Spam';
        case 'OFFTOPIC':
          return 'Off-Topic';
        case 'ILLEGAL':
          return 'Illegal Content';
        default:
          return 'Unknown';
      }
    },
    async deleteReport(reportId) {
      try {
        // Send the request.
        await this.$store.dispatch('api/deleteReport', { reportId });

        // Refresh the page.
        this.$nuxt.refresh();
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      }
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

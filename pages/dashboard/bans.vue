<template>
  <div>
    <div class="overflow-hidden rounded shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">Ban ID</th>
            <th scope="col" class="table-header">Created</th>
            <th scope="col" class="table-header">Duration</th>
            <th scope="col" class="table-header">Reason</th>
            <th scope="col" class="table-header">Board</th>
            <th scope="col" class="table-header">Post ID</th>
            <th scope="col" class="table-header">IP Address</th>
            <th scope="col" class="py-1 text-left text-xs">
              <button
                class="
                  px-2
                  py-1.5
                  font-bold font-display
                  cursor-pointer
                  text-gray-700
                  hover:text-black hover:bg-gray-200
                  rounded
                  flex
                  items-center
                  space-x-1.5
                "
              >
                <span>Create</span>
                <i class="fas fa-plus-square text-xs" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="bans.length">
            <tr v-for="ban of bans" :key="ban.id">
              <td class="table-cell font-bold">{{ ban.id }}</td>
              <td class="table-cell">{{ $timeAgo(ban.createdAt) }}</td>
              <td class="table-cell">
                <template v-if="ban.duration === 0">indefinite</template>
                <template v-else>{{ ban.duration }} days</template>
              </td>
              <td v-if="ban.reason" class="table-cell">{{ ban.reason }}</td>
              <td v-else class="table-cell italic">none</td>
              <td class="table-cell">
                <template v-if="ban.universal">universal</template>
                <nuxt-link
                  v-else
                  :to="`/${ban.boardId}/`"
                  class="text-blue-500 hover:underline focus:underline"
                  >/{{ ban.boardId }}/</nuxt-link
                >
              </td>
              <td class="table-cell">
                <div
                  v-if="ban.postId"
                  class="
                    inline-block
                    text-blue-500
                    hover:underline
                    cursor-pointer
                  "
                  @click="resolvePost(ban.postId)"
                >
                  {{ ban.postId }}
                </div>
                <span v-else class="text-gray-400">(deleted)</span>
              </td>
              <td class="table-cell">
                <nuxt-link
                  :to="`/dashboard/ip/${ban.ipAddress}/`"
                  class="text-blue-500 hover:underline focus:underline"
                  >{{ ban.ipAddress }}</nuxt-link
                >
              </td>
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
                  @click="deleteBan(ban.id)"
                >
                  Remove
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td
              class="font-display font-bold text-gray-700 text-center py-6"
              colspan="8"
            >
              No bans to display.
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
    const bans = await store.dispatch('api/getBans', {});
    return {
      bans,
    };
  },
  methods: {
    async deleteBan(banId) {
      try {
        // Send the request.
        await this.$store.dispatch('api/deleteBan', { banId });

        // Refresh the page.
        this.$nuxt.refresh();
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      }
    },
    async resolvePost(postId) {
      const { data } = await this.$axios.get(`/posts/resolve/${postId}`);
      console.log(data);
      this.$router.push(data);
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

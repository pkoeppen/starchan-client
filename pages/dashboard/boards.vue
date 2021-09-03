<template>
  <div>
    <div class="overflow-hidden rounded shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">Board ID</th>
            <th scope="col" class="table-header">Title</th>
            <th scope="col" class="table-header">Thread Count</th>
            <th scope="col" class="table-header">Post Count</th>
            <th scope="col" class="table-header">Created</th>
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
          <template v-if="boards.length">
            <tr v-for="board of boards" :key="board.id">
              <td class="table-cell">
                <nuxt-link
                  :to="`/${board.id}/`"
                  class="text-blue-500 hover:underline focus:underline"
                  >/{{ board.id }}/</nuxt-link
                >
              </td>
              <td class="table-cell">{{ board.title }}</td>
              <td class="table-cell">
                {{ board._count.threads }}
              </td>
              <td class="table-cell">{{ board._count.posts }}</td>
              <td class="table-cell">{{ $timeAgo(board.createdAt) }}</td>
              <td>
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
                  @click="showEditBoardModal(board)"
                >
                  <span>Edit</span>
                  <i class="fas fa-edit ml-1" />
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td class="font-display text-gray-300 text-center py-6" colspan="6">
              No boards to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  layout: 'dashboard',
  async asyncData({ store }) {
    const boards = await store.dispatch('api/getBoards');
    return {
      boards,
    };
  },
  methods: {
    ...mapMutations(['showModal']),
    showEditBoardModal(board) {
      this.showModal({
        modal: 'editBoard',
        data: {
          boardId: board.id,
          title: board.title,
        },
      });
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

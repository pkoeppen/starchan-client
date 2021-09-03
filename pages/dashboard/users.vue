<template>
  <div>
    <div class="overflow-hidden rounded shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">Username</th>
            <th scope="col" class="table-header">Roles</th>
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
          <template v-if="users.length">
            <tr v-for="user of users" :key="user.id">
              <td class="table-cell font-bold">
                {{ user.username }}
              </td>
              <td class="px-6 py-4 flex flex-wrap items-center max-w-lg">
                <div
                  v-for="role of user.roles"
                  :key="role.id"
                  class="
                    inline-flex
                    items-center
                    font-display
                    text-xs
                    tracking-tight
                    px-1.5
                    py-0.5
                    rounded-sm
                    font-bold
                    text-white
                    m-0.5
                    whitespace-nowrap
                  "
                  :class="{
                    'bg-gray-900': role.level === 'OWNER',
                    'bg-red-600': role.level === 'ADMIN',
                    'bg-blue-600': role.level === 'MODERATOR',
                    'bg-green-700': role.level === 'JANITOR',
                  }"
                >
                  <template v-if="role.boardId">/{{ role.boardId }}/ </template
                  >{{ role.level.toLowerCase() }}
                </div>
              </td>
              <td class="table-cell">{{ $timeAgo(user.createdAt) }}</td>
              <td>
                <button
                  class="
                    inline-block
                    font-bold font-display
                    text-sm
                    rounded
                    px-2
                    py-1
                  "
                  :class="
                    self.id === user.id
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer'
                      : 'text-gray-300 pointer-events-none'
                  "
                  :disabled="self.id !== user.id"
                  @click="showEditUserModal(user)"
                >
                  <span>Edit</span>
                  <i class="fas fa-edit ml-1" />
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td class="font-display text-gray-300 text-center py-6" colspan="4">
              No users to display.
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
    const users = await store.dispatch('api/getUsers');
    return {
      self: store.state.api.userData,
      users,
    };
  },
  methods: {
    ...mapMutations(['showModal']),
    showEditUserModal(user) {
      this.showModal({
        modal: 'editUser',
        data: {
          userId: user.id,
          username: user.username,
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

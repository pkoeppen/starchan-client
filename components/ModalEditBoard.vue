<template>
  <modal id="editBoard" title="Edit Board" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Board ID -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6">
        <div class="flex justify-between">
          <div class="font-bold">Board ID:</div>
          <div class="font-mono">/{{ data.boardId }}/</div>
        </div>
        <div class="flex justify-between">
          <div class="font-bold">Title:</div>
          <div class="font-mono">{{ data.title }}</div>
        </div>
      </div>

      <div class="space-y-2 mt-4 mb-2">
        <!-- Board ID Input -->
        <input
          v-model="form.newBoardId"
          type="text"
          class="rounded px-2 py-1 border-2 w-full"
          placeholder="Board ID"
        />
        <!-- Title Input -->
        <input
          v-model="form.title"
          type="text"
          class="rounded px-2 py-1 border-2 w-full"
          placeholder="Title"
        />
      </div>

      <!-- Deletion Warning -->
      <div
        v-if="form.newBoardId && form.newBoardId !== data.boardId"
        class="text-sm text-center my-6 text-red-500"
      >
        <span class="font-bold">This action will change the board ID.</span> All
        thread routes under the old board ID will no longer be accessible.
      </div>

      <!-- Submit -->
      <div class="flex justify-center mt-6">
        <button
          type="submit"
          icon="fas fa-paper-plane"
          class="
            font-display font-bold
            px-3
            py-2
            border
            rounded
            cursor-pointer
            w-36
            text-center
          "
          :class="{
            'cursor-pointer text-gray-700  hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200':
              canSubmit && !loading,
            'text-gray-300 pointer-events-none': !canSubmit || loading,
          }"
        >
          <i v-if="loading" class="fas fa-asterisk animate-spin" />
          <span v-else>Update</span>
        </button>
      </div>
    </form>
  </modal>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {
      loading: false,
      form: {
        newBoardId: null,
        title: null,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.editBoard.data,
      visible: (state) => state.modals.editBoard.visible,
    }),
    canSubmit() {
      if (this.loading) {
        return false;
      }
      return (
        this.form.newBoardId &&
        this.form.title &&
        (this.form.newBoardId !== this.data.boardId ||
          this.form.title !== this.data.title)
      );
    },
  },
  watch: {
    visible(newVal) {
      if (newVal === true) {
        this.form.newBoardId = this.data.boardId;
        this.form.title = this.data.title;
      }
      if (newVal === false) {
        this.resetForm();
      }
    },
  },
  methods: {
    ...mapMutations(['hideModal']),
    resetForm() {
      this.form = {
        newBoardId: null,
        title: null,
      };
    },
    async submit() {
      this.loading = true;
      try {
        const formData = { ...this.form };
        if (formData.newBoardId === this.data.boardId) {
          delete formData.newBoardId;
        }

        // Send the request.
        await this.$store.dispatch('api/updateBoard', {
          boardId: this.data.boardId,
          formData,
        });

        // Close the modal and refresh the page.
        this.hideModal({ modal: 'editBoard' });
        this.$nuxt.refresh();
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.check-field {
  @apply px-3 py-2 border rounded flex justify-between items-center cursor-pointer select-none font-display text-sm;
}
</style>

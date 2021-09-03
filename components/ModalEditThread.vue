<template>
  <modal id="editThread" title="Thread Options" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Thread Information -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6 mb-4">
        <div class="flex justify-between">
          <div class="font-bold">Thread ID:</div>
          <div class="font-mono">{{ data.threadId }}</div>
        </div>
      </div>

      <!-- Sticky -->
      <label for="editThread-sticky" class="check-field mb-2">
        <span>Sticky this thread</span>
        <input
          id="editThread-sticky"
          v-model="form.sticky"
          type="checkbox"
          name="editThread-sticky"
        />
      </label>

      <!-- Anchored -->
      <label for="editThread-anchored" class="check-field mb-2">
        <span>Anchor (bumplock) this thread</span>
        <input
          id="editThread-anchored"
          v-model="form.anchored"
          type="checkbox"
          name="editThread-anchored"
        />
      </label>

      <!-- Locked -->
      <label for="editThread-locked" class="check-field mb-2">
        <span>Lock this thread</span>
        <input
          id="editThread-locked"
          v-model="form.locked"
          type="checkbox"
          name="editThread-locked"
        />
      </label>

      <!-- Cycle -->
      <label for="editThread-cycle" class="check-field mb-2">
        <span>Cycle this thread</span>
        <input
          id="editThread-cycle"
          v-model="form.cycle"
          type="checkbox"
          name="editThread-cycle"
        />
      </label>

      <!-- Will Archive -->
      <label for="editThread-willArchive" class="check-field mb-2">
        <span>Mark this thread for archival</span>
        <input
          id="editThread-willArchive"
          v-model="form.willArchive"
          type="checkbox"
          name="editThread-willArchive"
        />
      </label>

      <!-- Archive -->
      <label for="editThread-archived" class="check-field mb-2">
        <span>Archive this thread (immediate)</span>
        <input
          id="editThread-archived"
          v-model="form.archived"
          type="checkbox"
          name="editThread-archived"
        />
      </label>

      <!-- Deletion Warning -->
      <div v-if="form.archived" class="text-sm text-center my-6 text-red-500">
        <span class="font-bold">This action will archive the thread.</span>
        It will be removed from the normal thread list. The effect is immediate
        and overrides any other selections.
      </div>
      <div
        v-else-if="form.willArchive"
        class="text-sm text-center my-6 text-red-500"
      >
        This action will mark the thread for archival at the end of its natural
        life.
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
            w-28
            text-center
          "
          :class="{
            'cursor-pointer text-gray-700  hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200':
              !loading,
            'text-gray-300 pointer-events-none': loading,
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
        sticky: false,
        locked: false,
        anchored: false,
        cycle: false,
        archived: false,
        willArchive: false,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.editThread.data,
      visible: (state) => state.modals.editThread.visible,
    }),
  },
  watch: {
    visible(newVal) {
      if (newVal === true) {
        this.form = {
          sticky: this.data.sticky,
          locked: this.data.locked,
          anchored: this.data.anchored,
          cycle: this.data.cycle,
          archived: this.data.archived,
          willArchive: this.data.willArchive,
        };
      }
    },
  },
  methods: {
    ...mapMutations(['hideModal']),
    resetForm() {
      this.form = {
        sticky: false,
        locked: false,
        anchored: false,
        cycle: false,
        archived: false,
        willArchive: false,
      };
    },
    async submit() {
      this.loading = true;
      try {
        // Send the request.
        await this.$store.dispatch('api/updateThread', {
          boardId: this.data.boardId,
          threadId: this.data.threadId,
          formData: this.form,
        });

        // Reset the form.
        this.resetForm();

        // Close the modal.
        this.hideModal({ modal: 'editThread' });
      } catch (error) {
        this.$catch(error);
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

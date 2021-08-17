<template>
  <modal id="editUser" title="Edit User" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Username -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6">
        <div class="flex justify-between">
          <div class="font-bold">Username:</div>
          <div class="font-mono">{{ data.username }}</div>
        </div>
      </div>

      <div class="space-y-2 mt-4 mb-2">
        <!-- Username Input -->
        <input
          v-model="form.username"
          type="text"
          class="rounded px-2 py-1 border-2 w-full"
          placeholder="Username"
        />
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
        username: null,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.editUser.data,
      visible: (state) => state.modals.editUser.visible,
    }),
    canSubmit() {
      if (this.loading) {
        return false;
      }
      return this.form.username && this.form.username !== this.data.username;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal === true) {
        this.form.username = this.data.username;
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
        username: null,
      };
    },
    async submit() {
      this.loading = true;
      try {
        const formData = { ...this.form };
        if (formData.username === this.data.username) {
          delete formData.username;
        }

        // Send the request.
        await this.$store.dispatch('api/updateUser', {
          userId: this.data.userId,
          formData,
        });

        // Close the modal and refresh the page.
        this.hideModal({ modal: 'editUser' });
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

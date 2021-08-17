<template>
  <modal id="reportPost" title="Report Post" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Post & IP Information -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6 mb-4">
        <div class="flex justify-between">
          <div class="font-bold">Post ID:</div>
          <div class="font-mono">{{ data.postId }}</div>
        </div>
      </div>

      <!-- Delete All Posts By IP Checkbox -->
      <div
        class="px-3 py-2 border rounded select-none font-display space-y-4 mb-6"
      >
        <!-- Off-Topic -->
        <label
          for="offTopic"
          class="flex justify-between items-center cursor-pointer"
        >
          <span>Off-topic</span>
          <input
            id="offTopic"
            v-model="form.reason"
            type="radio"
            name="reason"
            value="offTopic"
          />
        </label>

        <!-- Spam or Advertisement -->
        <label
          for="spam"
          class="flex justify-between items-center cursor-pointer"
        >
          <span>Spam or advertisement</span>
          <input
            id="spam"
            v-model="form.reason"
            type="radio"
            name="reason"
            value="spam"
          />
        </label>

        <!-- Illegal Content -->
        <label
          for="illegalContent"
          class="flex justify-between items-center cursor-pointer"
        >
          <span>Illegal content</span>
          <input
            id="illegalContent"
            v-model="form.reason"
            type="radio"
            name="reason"
            value="illegalContent"
          />
        </label>
      </div>

      <!-- Submit -->
      <div class="flex justify-center">
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
          <span v-else>Report Post</span>
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
        reason: null,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.reportPost.data,
      visible: (state) => state.modals.reportPost.visible,
    }),
    canSubmit() {
      if (this.loading) {
        return false;
      }
      return !!this.form.reason;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal === false) {
        this.resetForm();
      }
    },
  },
  methods: {
    ...mapMutations(['hideModal']),
    resetForm() {
      this.form = {
        reason: null,
      };
    },
    async submit() {
      this.loading = true;
      try {
        const recaptcha = await this.$recaptcha.execute('addReport');

        // Send the request.
        await this.$store.dispatch('api/addReport', {
          recaptcha,
          postId: this.data.postId,
          formData: {
            ...this.form,
            postId: this.data.postId,
          },
        });

        this.resetForm();

        // Close the modal.
        this.hideModal({ modal: 'reportPost' });
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

<template>
  <modal id="deletePost" title="Delete Post" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Post & IP Information -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6 mb-4">
        <div class="flex justify-between">
          <div class="font-bold">Post ID:</div>
          <div class="font-mono">{{ data.postId }}</div>
        </div>
        <div class="flex justify-between">
          <div class="font-bold">IP Address:</div>
          <nuxt-link
            v-if="data.ipAddress"
            :to="`/dashboard/ip/${data.ipAddress}/`"
            class="font-mono hover:underline focus:underline"
            @click.native="hideModal({ modal: 'deletePost' })"
          >
            {{ data.ipAddress }}
          </nuxt-link>
          <div v-else class="italic">&lt;unknown&gt;</div>
        </div>
      </div>

      <!-- Delete All Posts By IP Checkbox -->
      <label for="deletePost-deleteOnBoard" class="check-field mb-2">
        <span>Delete all posts by this IP on /{{ data.boardId }}/</span>
        <input
          id="deletePost-deleteOnBoard"
          v-model="form.deleteOnBoard"
          type="checkbox"
          name="deletePost-deleteOnBoard"
        />
      </label>

      <!-- Delete All Posts By IP On This Board Checkbox -->
      <label for="deletePost-deleteOnAllBoards" class="check-field">
        <span>Delete all posts by this IP on all boards</span>
        <input
          id="deletePost-deleteOnAllBoards"
          v-model="form.deleteOnAllBoards"
          type="checkbox"
          name="deletePost-deleteOnAllBoards"
        />
      </label>

      <!-- Deletion Warning -->
      <div v-if="isThread" class="text-sm text-center my-6 text-red-500">
        <span class="font-bold">This post is a thread root.</span> This action
        will remove the thread and all post replies.
      </div>
      <div v-else class="text-sm text-center my-6 text-red-500">
        This action will remove the post and all references to other posts.
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
              !loading,
            'text-gray-300 pointer-events-none': loading,
          }"
        >
          <i v-if="loading" class="fas fa-asterisk animate-spin" />
          <span v-else>Delete Post</span>
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
        deleteOnBoard: false,
        deleteOnAllBoards: false,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.deletePost.data,
      visible: (state) => state.modals.deletePost.visible,
    }),
    isThread() {
      return this.data.postId === this.data.threadId;
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
        deleteOnBoard: false,
        deleteOnAllBoards: false,
      };
    },
    async submit() {
      this.loading = true;
      try {
        // Send the request.
        await this.$store.dispatch('api/deletePost', {
          postId: this.data.postId,
          formData: {
            ...this.form,
            boardId: this.data.boardId,
          },
        });

        this.resetForm();

        // Close the modal.
        this.hideModal({ modal: 'deletePost' });

        // If the post was a thread root and we're in the thread,
        // navigate back to the board.
        if (
          this.isThread &&
          this.$route.path ===
            `/${this.data.boardId}/thread/${this.data.threadId}/`
        ) {
          this.$router.push(`/${this.data.boardId}/`);
        }
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

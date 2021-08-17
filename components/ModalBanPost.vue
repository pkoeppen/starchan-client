<template>
  <modal id="banPost" title="Ban IP" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Post & IP Information -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6">
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
            @click.native="hideModal({ modal: 'banPost' })"
          >
            {{ data.ipAddress }}
          </nuxt-link>
          <div v-else class="italic">&lt;unknown&gt;</div>
        </div>
      </div>

      <!-- Duration Input -->
      <input
        v-model="form.duration"
        type="number"
        class="rounded px-2 py-1 border-2 w-full mt-6 mb-2"
        placeholder="Days (0 for permaban)"
      />

      <!-- Reason Input -->
      <input
        v-model="form.reason"
        type="text"
        class="rounded px-2 py-1 border-2 w-full mb-6"
        placeholder="Reason"
      />

      <!-- Delete Post Checkbox -->
      <label for="banPost-universal" class="check-field mb-2">
        <span>Ban on all boards</span>
        <input
          id="banPost-universal"
          v-model="form.universal"
          type="checkbox"
          name="banPost-universal"
        />
      </label>

      <!-- Delete Post Checkbox -->
      <label for="banPost-deletePost" class="check-field mb-2">
        <span>Delete this post</span>
        <input
          id="banPost-deletePost"
          v-model="form.deletePost"
          type="checkbox"
          name="banPost-deletePost"
        />
      </label>

      <!-- Delete All Posts By IP Checkbox -->
      <label for="banPost-deleteOnBoard" class="check-field mb-2">
        <span>Delete all posts by this IP on /{{ data.boardId }}/</span>
        <input
          id="banPost-deleteOnBoard"
          v-model="form.deleteOnBoard"
          type="checkbox"
          name="banPost-deleteOnBoard"
        />
      </label>

      <!-- Delete All Posts By IP On This Board Checkbox -->
      <label for="banPost-deleteOnAllBoards" class="check-field">
        <span>Delete all posts by this IP on all boards</span>
        <input
          id="banPost-deleteOnAllBoards"
          v-model="form.deleteOnAllBoards"
          type="checkbox"
          name="banPost-deleteOnAllBoards"
        />
      </label>

      <!-- Deletion Warning -->
      <template
        v-if="form.deletePost || form.deleteOnBoard || form.deleteOnAllBoards"
      >
        <div v-if="isThread" class="text-sm text-center my-6 text-red-500">
          <span class="font-bold">This post is a thread root.</span> This action
          will remove the thread and all post replies.
        </div>
        <div v-else class="text-sm text-center my-6 text-red-500">
          This action will remove the post and all references to other posts.
        </div>
      </template>

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
              !loading,
            'text-gray-300 pointer-events-none': loading,
          }"
        >
          <i v-if="loading" class="fas fa-asterisk animate-spin" />
          <span v-else>Ban IP</span>
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
        duration: null,
        reason: null,
        universal: false,
        deletePost: false,
        deleteOnBoard: false,
        deleteOnAllBoards: false,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.modals.banPost.data,
      visible: (state) => state.modals.banPost.visible,
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
        duration: null,
        reason: null,
        universal: false,
        deletePost: false,
        deleteOnBoard: false,
        deleteOnAllBoards: false,
      };
    },
    async submit() {
      this.loading = true;
      try {
        // Send the request.
        await this.$store.dispatch('api/addBan', {
          formData: {
            ...this.form,
            boardId: this.data.boardId,
            postId: this.data.postId,
            ipAddress: this.data.ipAddress,
          },
        });

        this.resetForm();

        // Close the modal.
        this.hideModal({ modal: 'banPost' });
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

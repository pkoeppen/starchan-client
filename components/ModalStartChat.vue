<template>
  <modal id="startChat" title="Start Chat" size="sm">
    <form class="font-display" @submit.prevent="submit">
      <!-- Post & IP Information -->
      <div class="bg-gray-100 rounded px-2 py-1 mt-6 mb-4">
        <div class="flex justify-between items-center">
          <div class="font-bold">Author ID:</div>
          <div>
            <div
              class="
                flex
                items-center
                px-1.5
                font-display
                inline-block
                font-bold
                rounded
                text-white text-sm
              "
              :style="`background: ${data.authorTagColor}`"
            >
              {{ (data.authorId || '').slice(-6) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <input
        v-model="form.message"
        class="rounded px-2 py-1 border-2 w-full mb-6"
        placeholder="Type your message..."
        type="text"
      />

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
          <span v-else>Start Chat</span>
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
      data: (state) => state.modals.startChat.data,
      visible: (state) => state.modals.startChat.visible,
    }),
    canSubmit() {
      if (this.loading) {
        return false;
      }
      return !!this.form.message;
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
        message: null,
      };
    },
    async submit() {
      this.loading = true;
      try {
        const recaptcha = await this.$recaptcha.execute('startChat');

        // Send the request.
        const { roomId } = await this.$store.dispatch('api/startChat', {
          recaptcha,
          formData: {
            authorId: this.data.authorId,
            threadId: this.data.threadId,
            boardId: this.data.boardId,
            ...this.form,
          },
        });

        this.$socket.emit('refresh');
        this.resetForm();
        this.hideModal({ modal: 'startChat' });
        this.$router.push(`/${this.data.boardId}/chat/${roomId}/`);
      } catch (error) {
        this.$catch(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

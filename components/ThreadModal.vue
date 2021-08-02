<template>
  <div
    v-show="visible"
    class="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-20"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 z-20"
      @click="hideModal({ modal: 'thread' })"
    />

    <div class="h-full w-full flex flex-col items-center p-10">
      <div
        class="relative z-30 w-full max-w-2xl p-6 bg-white rounded"
        style="margin: auto 0"
        @dragover.prevent
        @drop.prevent="dropHandler"
        @dragenter.prevent="dragenterHandler"
        @dragleave.prevent="dragleaveHandler"
      >
        <!-- Dragover Receiver -->
        <div
          class="
            absolute
            inset-0
            z-50
            opacity-0
            bg-white
            flex flex-col
            items-center
            justify-center
            space-y-3
            rounded
            pointer-events-none
          "
          :class="{ 'opacity-90': dragoverActive }"
        >
          <i class="fas fa-upload fa-6x" />
          <div class="font-display font-bold text-3xl">Drop files</div>
        </div>

        <!-- Close Modal -->
        <div
          class="
            absolute
            top-0
            -right-9
            h-8
            w-8
            rounded
            bg-white bg-opacity-0
            hover:bg-opacity-20
            cursor-pointer
          "
          @click="hideModal({ modal: 'thread' })"
        >
          <div class="flex items-center justify-center p-2 text-white">
            <i class="fas fa-times" />
          </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-center">
          <h2 class="text-xl font-bold font-display">Create Thread</h2>
        </div>

        <!-- Drop Zone -->
        <div
          class="
            border-4 border-dashed
            my-6
            w-full
            h-64
            flex flex-col
            items-center
            justify-center
            text-gray-400
            space-y-3
          "
          @click="triggerFileInput"
        >
          <i class="fas fa-file-archive fa-4x" />
          <div class="font-display font-bold">
            Drag and drop, or click to upload.
          </div>
          <div class="">{{ files.length }} / 4</div>
        </div>

        <!-- File List -->
        <div v-if="files.length" class="pb-3 w-full grid grid-cols-4 gap-3">
          <div v-for="(file, index) of files" :key="index">
            <img
              :src="file.src"
              class="h-32 w-full object-cover mb-1 rounded"
            />
            <div class="flex justify-between space-x-3">
              <div class="text-xs overflow-hidden">
                <div class="font-bold truncate tracking-wide">
                  {{ file.filename }}
                </div>
                <div>{{ Math.round(file.filesize / 1024) }} KB</div>
              </div>
              <small-button
                icon="fas fa-times"
                @click.native="removeFile(index)"
              />
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="flex-grow flex flex-col space-y-2 relative z-40">
          <!-- Title Input -->
          <input
            v-model="form.title"
            class="rounded px-2 py-1 border-2"
            placeholder="Title"
          />
          <!-- Name Input -->
          <input
            v-model="form.name"
            class="rounded px-2 py-1 border-2"
            placeholder="Name (optional)"
          />
          <!-- Password Input -->
          <input
            v-model="form.password"
            class="rounded px-2 py-1 border-2"
            placeholder="Password (optional)"
            type="password"
          />
          <!-- Post Body Input -->
          <editable
            ref="body"
            v-model="form.body"
            class="rounded px-2 py-1 border-2"
            style="min-height: 100px"
            placeholder="Type here..."
          />
        </div>

        <!-- Submit -->
        <div class="flex justify-center mt-6 relative z-40">
          <div
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
            @click="submit"
          >
            <i v-if="loading" class="fas fa-asterisk animate-spin" />
            <span v-else>Create Thread</span>
          </div>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      hidden
      @change="handleFileChange"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      loading: false,
      dragCounter: 0,
      dragoverActive: false,
      files: [],
      form: {
        title: '',
        name: '',
        password: '',
        body: '',
      },
    };
  },
  computed: {
    ...mapState({
      visible: (state) => state.modals.thread.visible,
      data: (state) => state.modals.thread.data,
    }),
    boardId() {
      return this.$route.params.boardId;
    },
    canAddFiles() {
      return this.files.length < 4;
    },
    canSubmit() {
      if (this.loading) {
        return false;
      }
      // The contenteditable element leaves behind a '\n',
      // even when it appears to be empty.
      return (
        this.form.title &&
        this.files.length &&
        this.form.body &&
        this.form.body !== '\n'
      );
    },
  },
  methods: {
    ...mapMutations(['hideModal']),
    dropHandler(event) {
      event.preventDefault();
      this.addFiles(event.dataTransfer.files);
      this.dragoverActive = false;
      this.dragCounter = 0;
    },
    dragenterHandler(event) {
      if (!this.canAddFiles || !event.dataTransfer.types?.includes('Files')) {
        return;
      }
      this.dragCounter++;
      this.dragoverActive = true;
    },
    dragleaveHandler(event) {
      if (--this.dragCounter < 1) {
        this.dragoverActive = false;
      }
    },
    triggerFileInput() {
      if (this.files.length < 4) {
        this.$refs.fileInput.click();
      }
    },
    handleFileChange() {
      this.addFiles(this.$refs.fileInput.files);
    },
    addFiles(files) {
      if (!this.canAddFiles || !files?.length) {
        return;
      }
      const fileCount = this.files.length;
      const toAdd = Math.min(files.length, 4);
      const canAdd = 4 - fileCount;
      for (
        let i = fileCount, j = 0;
        i < fileCount + Math.min(toAdd, canAdd);
        i++, j++
      ) {
        const fileData = files[j];
        this.files.push({
          filename: fileData.name,
          filesize: fileData.size,
          mimetype: fileData.type,
          fileData,
        });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.files[i].src = event.target.result;
          this.$forceUpdate();
        };
        reader.readAsDataURL(fileData);
      }
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
    async submit() {
      this.loading = true;
      try {
        await this.$recaptcha.init();
        const recaptcha = await this.$recaptcha.execute('createThread');
        const formData = new FormData();
        for (const key in this.form) {
          const value = this.form[key];
          if (value) {
            formData.append(key, value);
          }
        }

        for (const file of this.files) {
          delete file.src;
          formData.append('files', file.fileData);
        }

        const post = await this.$store.dispatch('api/addThread', {
          recaptcha,
          boardId: this.boardId,
          formData,
        });

        this.form = {};
        this.files = [];

        // Close modal and navigate to the new thread.
        this.hideModal({ modal: 'thread' });
        this.$router.push(`/${post.thread.boardId}/thread/${post.id}/`);
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      } finally {
        this.loading = false;
        this.$recaptcha.destroy();
      }
    },
  },
};
</script>

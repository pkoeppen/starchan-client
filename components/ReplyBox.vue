<template>
  <div class="absolute bottom-6 right-6 left-6 pointer-events-none">
    <div
      class="
        w-full
        max-w-3xl
        min-w-min
        bg-white
        border-2 border-gray-300
        shadow-lg
        rounded
        mx-auto
        pointer-events-auto
        p-3
      "
    >
      <!-- File List -->
      <div v-if="files.length" class="pb-3 w-full flex space-x-3">
        <div v-for="(file, index) of files" :key="index" class="">
          <img :src="file.src" class="h-32 w-full object-cover mb-1 rounded" />
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

      <div class="flex space-x-2">
        <!-- Column 1 -->
        <div class="flex flex-col justify-between">
          <small-button
            v-show="showAdditionalFields"
            :icon="
              form.sage ? 'text-green-500 fas fa-seedling' : 'fas fa-seedling'
            "
            @click.native="form.sage = !form.sage"
          />
          <small-button
            :icon="
              showAdditionalFields ? 'fas fa-angle-up' : 'fas fa-angle-down'
            "
            @click.native="showAdditionalFields = !showAdditionalFields"
          />
        </div>

        <!-- Column 2 -->
        <div
          class="flex-grow flex flex-col"
          :class="{ 'space-y-2': showAdditionalFields }"
        >
          <!-- Name Input -->
          <input
            v-show="showAdditionalFields"
            v-model="form.name"
            class="shadow-inner rounded px-2 py-1"
            placeholder="Name (optional)"
          />
          <!-- Password Input -->
          <input
            v-show="showAdditionalFields"
            v-model="form.password"
            class="shadow-inner rounded px-2 py-1"
            placeholder="Password (optional)"
            type="password"
          />
          <!-- Post Body Input -->
          <simplebar class="h-full flex-grow max-h-25vh">
            <editable
              ref="body"
              v-model="form.body"
              class="shadow-inner rounded px-2 py-1"
              placeholder="Type your reply..."
            />
          </simplebar>
        </div>

        <!-- Column 3 -->
        <div class="flex flex-col justify-end">
          <div class="flex">
            <div
              v-if="files.length"
              class="
                h-8
                flex
                items-center
                font-display font-bold
                text-gray-300 text-sm
                px-1
              "
            >
              {{ files.length }} / 4
            </div>
            <small-button
              :disabled="!canAddFiles || loading"
              icon="fas fa-paperclip"
              @click.native="triggerFileInput"
            />
            <small-button
              :disabled="!canSubmit || loading"
              :loading="loading"
              icon="fas fa-paper-plane"
              @click.native="submit"
            />
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
export default {
  props: {
    threadId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      files: [],
      showAdditionalFields: false,
      form: {
        name: '',
        password: '',
        body: '',
        sage: false,
      },
    };
  },
  computed: {
    canAddFiles() {
      return this.files.length < 4;
    },
    canSubmit() {
      if (this.loading) {
        return false;
      }
      // The contenteditable element leaves behind a '\n',
      // even when it appears to be empty.
      return this.files.length || (this.form.body && this.form.body !== '\n');
    },
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const recaptcha = await this.$recaptcha.execute('addPost');
        const threadId = this.threadId;
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

        formData.append('threadId', this.threadId);

        const newPost = await this.$store.dispatch('api/addPost', {
          recaptcha,
          threadId,
          formData,
        });

        this.form = {};
        this.files = [];
        this.showAdditionalFields = false;

        // Add new post to posts array, then scroll to bottom.
        this.$bus.$emit('appendNewPost', newPost);
        // TODO: scroll to bottom
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      } finally {
        this.loading = false;
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
  },
};
</script>

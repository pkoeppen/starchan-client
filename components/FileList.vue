<template>
  <div class="flex flex-col">
    <div v-if="filtered.length" class="w-full flex space-x-3">
      <div v-for="file of filtered" :key="file.index" class="">
        <img :src="file.src" class="h-32 w-full object-cover mb-1 rounded" />
        <div class="flex justify-between space-x-3">
          <div class="flex-1 text-xs text-chan-red overflow-hidden">
            <div class="font-bold truncate">
              {{ file.filename }}
            </div>
            <div>{{ Math.round(file.filesize / 1024) }} KB</div>
          </div>
          <div
            class="
              w-8
              h-8
              flex
              items-center
              justify-center
              cursor-pointer
              text-gray-500
              hover:text-gray-700 hover:bg-gray-100
              rounded
            "
          >
            <i
              class="fa fa-times"
              title="Remove file"
              @click="removeFile(file.index)"
            ></i>
          </div>
        </div>
      </div>
      <div class="w-16 font-bold text-gray-500">{{ filtered.length }} / 4</div>
    </div>
    <div>
      <div class="flex flex-row justify-between items-center">
        <div>
          <button class="chan-button text-xs" @click.prevent="triggerFileInput">
            <i class="fa fa-cloud-upload-alt mr-2"></i>
            <span>Select files</span>
          </button>
          <input
            :id="id"
            ref="files"
            type="file"
            multiple
            hidden
            @change="handleFileChange"
          />
        </div>
        <div class="font-bold text-chan-tan-darker">
          {{ filtered.length }} / 4
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
export default {
  name: 'FileList',
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      files: [],
      fileList: null,
    };
  },
  computed: {
    filtered() {
      return this.files.filter(({ removed }) => !removed);
    },
  },
  methods: {
    triggerFileInput() {
      this.$refs.files.click();
    },
    handleFileChange() {
      this.files = [];
      this.fileList = this.$refs.files.files;
      const length = this.fileList.length > 4 ? 4 : this.fileList.length;
      for (let i = 0; i < length; i++) {
        this.files[i] = this.files[i] || {
          index: i,
          filename: this.fileList[i].name,
          filesize: this.fileList[i].size,
          mimetype: this.fileList[i].type,
        };
        const reader = new FileReader();
        reader.onload = (event) => {
          this.files[i].src = event.target.result;
          this.$forceUpdate();
        };
        reader.readAsDataURL(this.fileList[i]);
      }
      this.$emit('input', {
        files: this.files.map((file) => _.omit(file, 'src')),
        fileList: this.fileList,
      });
    },
    removeFile(index) {
      const files = [...this.files];
      files[index].removed = true;
      this.files = files;
      this.$emit('input', {
        files: this.files.map((file) => _.omit(file, 'src')),
        fileList: this.fileList,
      });
    },
  },
};
</script>

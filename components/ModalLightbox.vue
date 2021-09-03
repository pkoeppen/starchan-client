<template>
  <div
    v-show="visible"
    class="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-30"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 z-30"
      @click="hideModal({ modal: 'lightbox', data: {} })"
    />

    <!-- Image Viewer -->
    <div class="absolute flex inset-0">
      <div
        ref="imageContainer"
        class="
          relative
          mx-auto
          inline-flex
          flex-col
          items-stretch
          justify-center
        "
      >
        <!-- Loading -->
        <div
          v-if="loading"
          class="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-center text-white
          "
        >
          <i class="animate-spin fa fa-asterisk fa-2x" />
        </div>

        <!-- Not Found -->
        <div v-if="selected.notFound" class="text-center">
          <div class="text-white font-display">File not found</div>
          <div class="text-xs text-gray-300">
            {{ index + 1 }} / {{ files.length }}
          </div>
        </div>

        <template v-else-if="files.length">
          <!-- Close Modal -->
          <div
            v-show="!loading"
            class="flex items-center justify-end z-40 mr-1 lg:mr-0"
            style="height: 30px"
            :class="controlsClass"
          >
            <i
              class="fas fa-times cursor-pointer text-gray-300 hover:text-white"
              @click="hideModal({ modal: 'lightbox', data: {} })"
            />
          </div>

          <!-- Image -->
          <img
            ref="image"
            :src="imageSource"
            :style="imageStyle"
            class="object-contain"
            @load="onImageLoad()"
            @error="setNotFound()"
            @change="alert('changed')"
          />

          <!-- Location -->
          <div
            v-show="!loading"
            class="
              flex
              items-center
              justify-end
              z-40
              text-xs text-gray-300
              mr-1
              lg:mr-0
              space-x-3
            "
            style="height: 30px"
            :class="controlsClass"
          >
            <span
              >{{ selected.filename }} ({{
                readableFileSize(selected.size)
              }})</span
            >
            <span>{{ index + 1 }} / {{ files.length }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Controls -->
    <div class="absolute inset-0 flex justify-between items-center">
      <div
        class="p-10 cursor-pointer text-gray-300 hover:text-white z-50"
        @click="previous()"
      >
        <i class="fas fa-caret-left fa-4x" />
      </div>
      <div
        class="p-10 cursor-pointer text-gray-300 hover:text-white z-50"
        @click="next()"
      >
        <i class="fas fa-caret-right fa-4x" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';
import filesize from 'filesize';

export default {
  data() {
    return {
      loading: false,
      baseDataUrl: this.$config.baseDataUrl,
      imageStyle: '',
      controlsClass: '',
    };
  },
  computed: {
    ...mapState({
      visible: (state) => state.modals.lightbox.visible,
      data: (state) => state.modals.lightbox.data,
    }),
    files() {
      return (this.data.files || []).map((file) => ({
        loading: true,
        ...file,
      }));
    },
    index() {
      return this.data.index || 0;
    },
    selected() {
      return this.files[this.index] || {};
    },
    imageSource() {
      return this.selected.id
        ? `${this.baseDataUrl}/files/${this.selected.id}`
        : '';
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loading = true;
        document.documentElement.style.overflow = 'hidden';
      } else {
        this.loading = false;
        document.documentElement.style.overflow = 'auto';
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    ...mapMutations(['setModalData', 'showModal', 'hideModal']),
    onImageLoad() {
      this.onResize();
      this.loading = false;
    },
    setNotFound() {
      const files = cloneDeep(this.files);
      const file = files[this.index];
      if (file) {
        file.notFound = true;
        this.setModalData({
          modal: 'lightbox',
          data: { files },
        });
      }
      this.loading = false;
    },
    getImageRef() {
      return this.$refs.image;
    },
    onResize() {
      const image = this.getImageRef();
      if (image) {
        const aspectRatioViewport = window.innerWidth / window.innerHeight;
        const aspectRatioImage = image.clientWidth / (image.clientHeight + 60);
        if (aspectRatioViewport > aspectRatioImage) {
          this.imageStyle = 'height: calc(100vh - 60px)';
          this.controlsClass = '';
        } else {
          this.imageStyle = 'width: 100vw';
          this.controlsClass = 'pr-2';
        }
      }
    },
    next() {
      const index = this.index === this.files.length - 1 ? 0 : this.index + 1;
      if (index !== this.index && !this.files[index].notFound) {
        this.loading = true;
      }
      this.setModalData({
        modal: 'lightbox',
        data: { index },
      });
    },
    previous() {
      const index = this.index === 0 ? this.files.length - 1 : this.index - 1;
      if (index !== this.index && !this.files[index].notFound) {
        this.loading = true;
      }
      this.setModalData({
        modal: 'lightbox',
        data: { index },
      });
    },
    readableFileSize(size) {
      return filesize(size || 0, { round: 0 });
    },
  },
};
</script>

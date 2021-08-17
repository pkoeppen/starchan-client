<template>
  <div
    v-show="visible"
    class="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-30"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 z-30"
      @click="hideModal({ modal: 'lightbox' })"
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
        <!-- Close Modal -->
        <div
          class="flex items-center justify-end z-40 mr-1 lg:mr-0"
          style="height: 30px"
          :class="controlsClass"
        >
          <i
            class="fas fa-times cursor-pointer text-gray-300 hover:text-white"
            @click="hideModal({ modal: 'lightbox' })"
          />
        </div>
        <!-- Image -->
        <img
          ref="image"
          :src="imageSource"
          :style="imageStyle"
          class="object-contain"
        />
        <!-- Location -->
        <div
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
import filesize from 'filesize';

export default {
  data() {
    return {
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
      return this.data.files || [];
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
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = 'auto';
      }
    },
  },
  mounted() {
    this.onResize(); // Adjust image container size on page load.
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    ...mapMutations(['setModalData', 'showModal', 'hideModal']),
    onResize() {
      const aspectRatioViewport = window.innerWidth / window.innerHeight;
      const aspectRatioImage =
        this.$refs.image.clientWidth / (this.$refs.image.clientHeight + 60);

      if (aspectRatioViewport > aspectRatioImage) {
        this.imageStyle = 'height: calc(100vh - 60px)';
        this.controlsClass = '';
      } else {
        this.imageStyle = 'width: 100vw';
        this.controlsClass = 'pr-2';
      }
    },
    next() {
      const index = this.index === this.files.length - 1 ? 0 : this.index + 1;
      this.setModalData({
        modal: 'lightbox',
        data: { index },
      });
    },
    previous() {
      const index = this.index === 0 ? this.files.length - 1 : this.index - 1;
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

<template>
  <div
    v-show="visible"
    class="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-30"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 z-20" @click="hideModal({ modal: id })" />

    <div class="h-full w-full flex flex-col items-center p-10">
      <div
        class="relative z-30 w-full p-6 bg-white rounded"
        :class="`max-w-${size}`"
        style="margin: auto 0"
      >
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
          @click="hideModal({ modal: id })"
        >
          <div class="flex items-center justify-center p-2 text-white">
            <i class="fas fa-times" />
          </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-center">
          <h2 class="text-xl font-bold font-display">{{ title }}</h2>
        </div>

        <!-- Modal Content -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  computed: {
    visible() {
      return this.$store.state.modals[this.id].visible;
    },
  },
  methods: {
    ...mapMutations(['hideModal']),
  },
};
</script>

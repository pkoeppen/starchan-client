<template>
  <button
    class="h-8 w-8 rounded flex items-center justify-center"
    :class="{
      'cursor-pointer text-gray-500  hover:text-gray-700 hover:bg-gray-100':
        !disabled,
      'text-gray-300 pointer-events-none': disabled,
    }"
  >
    <i :class="iconClass" />
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    iconClass() {
      return this.loading ? 'fas fa-asterisk animate-spin' : this.icon;
    },
  },
};
</script>

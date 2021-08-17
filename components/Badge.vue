<template>
  <div
    style="font-size: 10px; padding: 0 3px; line-height: 14px"
    :style="badgeStyle"
    class="font-display inline-block font-bold rounded text-white"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    badgeStyle() {
      return this.color ? `background-color: ${this.color}` : '';
    },
  },
};
</script>

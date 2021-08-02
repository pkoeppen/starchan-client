<template>
  <p
    ref="editable"
    class="editable"
    :placeholder="placeholder"
    contenteditable
    v-on="listeners"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    listeners() {
      return { ...this.$listeners, input: this.onInput, blur: this.onBlur };
    },
  },

  // This bit of code makes you type in reverse. Interesting.
  // watch: {
  //   value(newValue) {
  //     this.$refs.editable.innerText = newValue;
  //   },
  // },

  mounted() {
    if (this.$refs.editable) {
      this.$refs.editable.innerText = this.value;
    }
    this.$bus.$on('appendToReply', (str) => {
      if (this.$refs.editable) {
        this.$refs.editable.innerText += str;
      }
    });
    this.$bus.$on('appendNewPost', () => {
      if (this.$refs.editable) {
        this.$refs.editable.innerText = '';
      }
    });
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.innerText);
    },
    onBlur(event) {
      const text = event.target.innerText;
      if (!text.replace(/[\s]+/, '').length) {
        event.target.innerHTML = '';
      }
    },
  },
};
</script>
<style scoped>
.editable[placeholder]:empty::before {
  content: attr(placeholder);
  @apply text-gray-400;
}

.editable[placeholder]:empty:focus::before {
  content: '';
}
</style>

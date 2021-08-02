<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <h1 class="font-display font-bold text-2xl mb-6">
      {{ error.statusCode }} - {{ error.message }}
    </h1>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>

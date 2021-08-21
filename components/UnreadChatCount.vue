<template>
  <div
    class="
      h-4
      px-1
      bg-red-500
      text-white text-xs
      font-display font-bold
      rounded
      flex
      items-center
      justify-center
      tracking-tighter
    "
  >
    {{ count }}
  </div>
</template>
<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
};
</script>

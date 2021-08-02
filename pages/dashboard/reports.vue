<template>
  <div>
    <div v-for="n in 50" :key="n" class="my-3 bg-gray-100 rounded">
      reports {{ n }}
    </div>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
};
</script>

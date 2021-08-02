<template>
  <div
    class="
      relative
      inline-block
      w-10
      align-middle
      select-none
      transition
      duration-200
      ease-in
    "
  >
    <input
      :id="id"
      :checked="value"
      type="checkbox"
      :name="id"
      class="
        toggle-checkbox
        absolute
        block
        w-6
        h-6
        rounded-full
        bg-white
        border-4 border-gray-300
        appearance-none
        cursor-pointer
      "
      @change="$emit('change', $event.target.checked)"
    />
    <label
      :for="id"
      class="
        toggle-label
        block
        overflow-hidden
        h-6
        rounded-full
        bg-gray-300
        cursor-pointer
      "
    ></label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
<style>
.toggle-checkbox:checked {
  @apply right-0 border-green-400;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-green-400;
}
</style>

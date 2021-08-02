<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <!-- Header -->
    <h1 class="text-2xl font-display font-bold mb-6 mx-auto">Login</h1>

    <!-- Form -->
    <form class="flex flex-col max-w-sm" @submit.prevent="submit">
      <!-- Username Input -->
      <input
        v-model="form.username"
        class="rounded px-2 py-1 border-2 mb-2"
        placeholder="Username"
      />
      <!-- Password Input -->
      <input
        v-model="form.password"
        class="rounded px-2 py-1 border-2"
        placeholder="Password"
        type="password"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        icon="fas fa-paper-plane"
        class="
          font-display font-bold
          px-3
          py-2
          border
          rounded
          cursor-pointer
          w-28
          text-center
          mx-auto
          mt-6
        "
        :class="{
          'cursor-pointer text-gray-700  hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200':
            !loading,
          'text-gray-300 pointer-events-none': loading,
        }"
      >
        <i v-if="loading" class="fas fa-asterisk animate-spin" />
        <span v-else>Submit</span>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        username: null,
        password: null,
      },
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const recaptcha = await this.$recaptcha.execute('login');

        // Send the request.
        await this.$store.dispatch('api/logIn', {
          recaptcha,
          formData: this.form,
        });

        this.form = {};
        this.$router.push('/');
      } catch (error) {
        // TODO: show a toast message or something
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div
    class="w-full flex items-center h-14"
    :class="{ 'border-b': !searchResultsModalVisible }"
  >
    <!-- Search -->
    <form
      class="text-sm py-2 flex items-center w-3/4 px-12"
      @submit.prevent="showSearchModal()"
    >
      <i class="fas fa-search text-xs mr-2 text-gray-400" />
      <input
        ref="searchInput"
        v-model="searchQuery"
        placeholder="Search..."
        class="flex-grow placeholder-gray-400"
        @input="handleSearchInputDebounced()"
      />
      <!-- <i
        v-if="searchLoading"
        class="fas fa-asterisk animate-spin text-gray-400"
      /> -->
      <div
        v-if="showSearchResultCount"
        class="text-gray-400 whitespace-nowrap cursor-pointer"
        @click="showSearchModal()"
      >
        <b>{{ searchResultCount }}</b>
        <span>result{{ searchResultCount === 1 ? '' : 's' }}</span>
        <span class="mx-1 text-gray-200">|</span>
        <span>Press</span>
        <b>Enter</b>
        <i class="fas fa-external-link-square-alt text-xs" />
      </div>
    </form>

    <!-- Profile / Settings -->
    <div class="w-1/4 flex items-center justify-end pr-5">
      <div class="relative">
        <div
          class="
            flex
            items-center
            rounded
            hover:bg-gray-100
            text-gray-500
            hover:text-gray-700
            cursor-pointer
            pl-3
          "
          :class="{ 'bg-gray-100': showMenu }"
          @click="showMenu = !showMenu"
        >
          <i class="fas fa-bars mr-3" />
          <div class="rounded bg-gray-200 h-8 w-8 overflow-hidden">
            <img
              v-if="identicon"
              class="object-cover w-full h-full"
              :src="identicon"
            />
          </div>
        </div>
        <div v-show="showMenu">
          <div
            class="
              absolute
              right-0
              top-8
              bg-gray-100
              rounded
              z-20
              shadow-lg
              text-sm
              p-3
            "
            style="min-width: 18rem"
          >
            <!-- Logged In As -->
            <div
              v-if="modRoute"
              class="flex justify-between mb-2 space-x-2 whitespace-nowrap"
            >
              <nuxt-link
                to="/dashboard/"
                class="
                  font-display font-bold
                  text-center
                  border
                  rounded
                  px-3
                  py-2
                  flex-grow
                  hover:border-gray-300
                "
              >
                <span>Logged in as:</span
                ><span class="text-red-500 ml-1.5 tracking-tight">{{
                  userData.username
                }}</span>
              </nuxt-link>
              <button
                class="
                  px-3
                  py-2
                  border
                  rounded
                  font-display font-bold
                  hover:border-gray-300
                "
                @click="logOut"
              >
                Log Out
              </button>
            </div>

            <!-- IP & Country Table -->
            <table class="table-auto bg-white w-full">
              <tbody>
                <tr>
                  <td class="font-bold border px-2 py-1">IP</td>
                  <td class="border px-2 py-1">{{ ipAddress }}</td>
                </tr>
                <tr>
                  <td class="font-bold border px-2 py-1">Country</td>
                  <td class="border px-2 py-1 whitespace-nowrap">
                    {{ countryName }} {{ countryFlag }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 flex items-center justify-center space-x-3">
              <div class="flex-shrink-0">
                <span
                  class="
                    uppercase
                    font-display font-bold
                    tracking-wide
                    text-xs text-gray-700
                  "
                  >Show NSFW</span
                >
                <toggle
                  id="showNsfwToggle"
                  v-model="showNsfw"
                  @change="updateShowNsfw"
                />
              </div>
              <div class="flex-shrink-0">
                <span
                  class="
                    uppercase
                    font-display font-bold
                    tracking-wide
                    text-xs text-gray-700
                  "
                  >Dark Mode</span
                >
                <toggle
                  id="darkModeToggle"
                  v-model="darkMode"
                  @change="updateDarkMode"
                />
              </div>
            </div>
          </div>
          <div class="fixed inset-0 z-10" @click="showMenu = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { name, flag } from 'country-emoji';
import { mapMutations, mapState } from 'vuex';
export default {
  data() {
    const agentData = this.$store.state.agentData;
    return {
      showMenu: false,
      ipAddress: agentData.ip,
      countryName: name(agentData.loc),
      countryFlag: flag(agentData.loc),
      showNsfw: this.$store.state.showNsfw,
      darkMode: this.$store.state.darkMode,
      searchLoading: false,
      searchQuery: null,
      searchResultCount: null,
      searchResults: [],
      handleSearchInputDebounced: debounce(this.handleSearchInput, 500),
    };
  },
  computed: {
    ...mapState({
      identicon: (state) => state.identicon,
      modRoute: (state) => state.modRoute,
      userData: (state) => state.api.userData || {},
    }),
    showSearchResultCount() {
      return this.searchQuery && !isNaN(parseInt(this.searchResultCount));
    },
    searchResultsModalVisible() {
      return this.$store.state.modals.searchResults.visible;
    },
  },
  watch: {
    searchQuery(newVal) {
      if (!newVal) {
        this.searchResultCount = null;
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.focusSearchInputListener);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.focusSearchInputListener);
  },
  methods: {
    ...mapMutations(['showModal']),
    focusSearchInputListener(event) {
      if (
        event.ctrlKey &&
        event.key === 'k' &&
        !this.searchResultsModalVisible
      ) {
        event.preventDefault();
        this.$refs.searchInput.focus();
      }
    },
    updateShowNsfw(value) {
      this.$store.commit('updateShowNsfw', value);
    },
    updateDarkMode(value) {
      this.$store.commit('updateDarkMode', value);
    },
    async handleSearchInput() {
      if (!this.searchQuery) {
        this.searchResultCount = null;
        this.searchResults = [];
        return;
      }
      try {
        this.searchLoading = true;
        const { total: resultCount, results } = await this.$store.dispatch(
          'api/search',
          {
            q: this.searchQuery,
          }
        );
        this.searchResultCount = resultCount;
        this.searchResults = results;
      } catch (error) {
        this.$catch(error);
      } finally {
        this.searchLoading = false;
      }
    },
    showSearchModal() {
      if (!this.searchQuery) {
        return;
      }
      this.showModal({
        modal: 'searchResults',
        data: {
          searchQuery: this.searchQuery,
          searchResultCount: this.searchResultCount,
          searchResults: this.searchResults,
        },
      });
      this.searchQuery = null;
      this.searchResultCount = null;
    },
    async logOut() {
      try {
        await this.$store.dispatch('api/logOut');
        this.$router.push('/login/');
      } catch (error) {
        this.$catch(error);
      }
    },
  },
};
</script>

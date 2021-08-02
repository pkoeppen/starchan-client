<template>
  <div :id="post.id" class="flex relative">
    <!-- Post Menu Container -->
    <div class="absolute right-0 top-0 w-8 h-8">
      <div
        class="
          absolute
          inset-0
          hover:bg-gray-100 hover:text-gray-700
          cursor-pointer
          text-gray-500
          rounded
          flex
          items-center
          justify-center
        "
        :class="{ 'bg-gray-100': showPostMenu }"
        @click="showPostMenu = !showPostMenu"
      >
        <i class="fas fa-ellipsis-v" />
      </div>

      <!-- Post Options Menu -->
      <div v-if="showPostMenu">
        <div
          class="
            font-display
            absolute
            bg-white
            shadow
            rounded
            right-8
            top-0
            z-20
            whitespace-nowrap
          "
          style="min-width: 8rem"
        >
          <div
            v-if="$route.path === `/${thread.boardId}/thread/${thread.id}/`"
            class="menu-item border-b"
            @click="appendToReply(post.id)"
          >
            <span>Reply</span><i class="fas fa-reply text-xs text-gray-600" />
          </div>
          <nuxt-link
            v-else
            :to="`/${thread.boardId}/thread/${thread.id}/`"
            class="menu-item border-b"
            @click.native="showPostMenu = false"
          >
            <span>Reply</span><i class="fas fa-reply text-xs text-gray-600" />
          </nuxt-link>
          <div class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b">
            <span>Hide</span>
          </div>
          <div class="menu-item border-b-2 text-red-500">
            <span>Report </span>
          </div>

          <!-- Mod Tools -->
          <template v-if="modRoute">
            <div class="menu-item" @click="showDeletePostModal()">
              <span>Delete</span>
            </div>
            <div class="menu-item border-t">
              <span>Ban</span>
            </div>
            <div v-if="isOp" class="menu-item border-t">
              <span>Thread</span><i class="fas fa-cog text-xs text-gray-600" />
            </div>
          </template>
        </div>
        <div class="fixed inset-0 z-10" @click="showPostMenu = false" />
      </div>
    </div>

    <!-- Avatar -->
    <div class="rounded bg-gray-200 w-8 h-8 mr-3 flex-shrink-0 overflow-hidden">
      <img
        v-if="identicon"
        :src="base64Src"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Post Content -->
    <div class="flex flex-col flex-grow">
      <!-- Author -->
      <div
        class="space-x-1 relative"
        :class="post.files && post.files.length ? 'mb-1' : 'mb-2'"
        style="line-height: 14px"
      >
        <span class="font-bold font-display" style="font-size: 14px">{{
          post.name
        }}</span>
        <!-- Tags -->
        <div class="inline-block">
          <!-- Tripcode -->
          <div
            v-if="post.tripcode"
            style="font-size: 10px; padding: 0 3px"
            :style="authorTagColor"
            class="font-display inline-block font-bold rounded text-white"
          >
            !{{ post.tripcode }}
          </div>

          <!-- Author ID -->
          <div
            v-else
            style="font-size: 10px; padding: 0 3px"
            :style="authorTagColor"
            class="font-display inline-block font-bold rounded text-white"
          >
            {{ post.authorId.slice(-6) }}
          </div>

          <!-- OP -->
          <div
            v-if="isOp"
            style="font-size: 10px; padding: 0 3px"
            class="
              font-display
              inline-block
              bg-blue-500
              font-bold
              rounded
              text-white
            "
          >
            OP
          </div>
        </div>

        <!-- IP Address -->
        <nuxt-link
          v-if="modRoute"
          :to="`/dashboard/ip/${post.ipAddress}/`"
          class="
            font-bold
            text-gray-700 text-xs
            hover:underline hover:text-black
            inline-block
          "
        >
          {{ post.ipAddress }}
        </nuxt-link>

        <!-- Post Time -->
        <span class="text-gray-500 text-xs">{{
          formatPostTime(post.createdAt)
        }}</span>

        <!-- Post ID -->
        <span
          class="text-blue-500 text-xs hover:underline cursor-pointer"
          @click="appendToReply(post.id)"
          >#{{ post.id }}</span
        >
      </div>

      <!-- Files -->
      <div v-if="post.files && post.files.length" class="flex mb-4">
        <!-- File Container -->
        <div
          v-for="(file, index) of post.files"
          :key="file.id"
          class="space-y-0.5 w-1/4 pr-2"
        >
          <!-- Filename, Filesize & Menu Twirldown -->
          <div class="relative inline-block">
            <div
              class="
                inline-flex
                items-center
                text-gray-500
                cursor-pointer
                max-w-full
              "
              @click="
                fileOptions[file.id].showFileMenu =
                  !fileOptions[file.id].showFileMenu
              "
            >
              <span class="text-xs tracking-wide mr-1 truncate">{{
                file.filename
              }}</span
              ><span class="text-xs mr-1 tracking-wide whitespace-nowrap"
                >({{ readableFileSize(file.size) }})</span
              ><i class="fas fa-caret-down text-xs" />
            </div>
            <!-- File Menu -->
            <div v-show="fileOptions[file.id].showFileMenu">
              <div
                class="
                  absolute
                  bg-white
                  rounded
                  top-6
                  -right-10
                  font-display
                  z-20
                  overflow-hidden
                  shadow
                "
              >
                <div
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
                  @click="isHidden(file) ? showFile(file) : hideFile(file)"
                >
                  <span>{{ isHidden(file) ? 'Show' : 'Hide' }}</span>
                </div>
                <div
                  class="
                    px-3
                    py-2
                    hover:bg-gray-100
                    cursor-pointer
                    text-red-500
                  "
                >
                  <span>Report </span>
                </div>
              </div>
              <div
                class="fixed inset-0 z-10"
                @click="fileOptions[file.id].showFileMenu = false"
              />
            </div>
          </div>

          <!-- Preview Container -->
          <div
            class="
              h-32
              w-full
              bg-gray-200
              rounded
              flex
              items-center
              justify-center
              overflow-hidden
              relative
              cursor-pointer
            "
          >
            <img
              class="object-cover w-full h-full"
              :class="{
                'filter blur-md': isHidden(file),
              }"
              :src="`${baseDataUrl}/thumbs/${file.id}`"
            />
            <div
              v-if="isHidden(file)"
              class="
                absolute
                inset-0
                flex
                items-center
                justify-center
                opacity-50
                hover:opacity-100
                transition-opacity
              "
              @click="showFile(file)"
            >
              <i class="fas fa-eye text-white text-3xl" />
            </div>
            <div
              v-else
              class="absolute inset-0"
              @click="
                showModal({
                  modal: 'lightbox',
                  data: { files: post.files, index },
                })
              "
            />
          </div>
        </div>
      </div>

      <!-- Post Body -->
      <div class="space-y-2" v-html="post.bodyHtml" />

      <div
        v-if="post.bannedForThisPost"
        class="font-display font-bold uppercase text-red-500 mt-5 mb-2 text-sm"
      >
        User was banned for this post
      </div>

      <!-- References -->
      <div
        v-if="showReplies && post.referencedBy.length"
        class="flex flex-wrap mt-3"
      >
        <a
          v-for="reference of post.referencedBy"
          :key="reference.id"
          :href="`#${reference.id}`"
          class="text-blue-500 hover:underline text-sm mr-1"
        >
          >>{{ reference.id }}
        </a>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { format } from 'date-fns';
import filesize from 'filesize';
import Identicon from 'identicon.js';

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    thread: {
      type: Object,
      required: true,
    },
    showReplies: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    const fileOptions = {};
    if (this.post.files) {
      for (const file of this.post.files) {
        fileOptions[file.id] = {
          showNsfw: false,
          forceHide: false,
          showFileMenu: false,
        };
      }
    }
    return {
      baseDataUrl: this.$config.baseDataUrl,
      showPostMenu: false,
      fileOptions,
    };
  },
  computed: {
    ...mapState(['modRoute']),
    isOp() {
      return this.post.id === this.thread.id;
    },
    showNsfw() {
      return this.$store.state.showNsfw;
    },
    identicon() {
      try {
        const identicon = new Identicon(
          (this.post.tripcode || '') + this.post.authorId,
          {
            margin: 0.2,
            size: 32,
            format: 'svg',
          }
        );
        return identicon;
      } catch (error) {
        // Probably the 'hash of at least 15 characters is required' error.
      }
      return null;
    },
    base64Src() {
      return `data:image/svg+xml;base64,${this.identicon.toString()}`;
    },
    authorTagColor() {
      const [r, g, b] = this.identicon.foreground;
      return `background-color: rgb(${r},${g},${b});`;
    },
  },
  methods: {
    ...mapMutations(['showModal']),
    formatPostTime(time) {
      return format(new Date(time), 'MMMM d, yyyy p');
    },
    appendToReply(postId) {
      this.$bus.$emit('appendToReply', `>>${postId}\n`);
    },
    readableFileSize(size) {
      return filesize(size, { round: 0 });
    },
    isHidden({ id: fileId, nsfw }) {
      return (
        (nsfw && !this.showNsfw && !this.fileOptions[fileId].showNsfw) ||
        this.fileOptions[fileId].forceHide
      );
    },
    hideFile({ id: fileId }) {
      this.fileOptions[fileId].showNsfw = false;
      this.fileOptions[fileId].forceHide = true;
      this.fileOptions[fileId].showFileMenu = false;
    },
    showFile({ id: fileId }) {
      this.fileOptions[fileId].showNsfw = true;
      this.fileOptions[fileId].forceHide = false;
      this.fileOptions[fileId].showFileMenu = false;
    },
    replyHandler(event, postId) {
      if (
        this.$route.path === `/${this.thread.boardId}/thread/${this.thread.id}/`
      ) {
        // If we're already on the thread page, append the post ID to the reply box.
        // Otherwise, let the link click event navigate to the thread page.
        event.preventDefault();
        this.appendToReply(postId);
      }
      this.showPostMenu = false;
    },
    showDeletePostModal() {
      this.showModal({
        modal: 'deletePost',
        data: {
          postId: this.post.id,
          threadId: this.thread.id,
          boardId: this.thread.boardId,
          ipAddress: this.post.ipAddress,
        },
      });
      this.showPostMenu = false;
    },
  },
};
</script>
<style>
.menu-item {
  @apply px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between space-x-3;
}
.reference {
  @apply text-blue-500 cursor-pointer hover:underline;
}
.greentext {
  color: #117743;
}
.redtext {
  color: #eb4949;
}
.spoiler {
  @apply bg-black hover:text-white;
}
.echoes {
  @apply bg-gray-100 text-blue-500 tracking-wider;
}
.footnote {
  @apply text-xs;
}
.link {
  @apply text-blue-500 hover:underline focus:underline;
}
.code {
  @apply font-mono bg-gray-100 px-1 py-0.5;
}
</style>
